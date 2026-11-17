import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export type SessionUser = {
  userId: string;
  email: string;
  displayName: string;
};

const sessionCookie = "matchday_session";
const flowCookie = "matchday_oauth";
const sessionSeconds = 8 * 60 * 60;
const flowSeconds = 10 * 60;

type Flow = { state: string; verifier: string; returnTo: string };

function options(maxAge: number) {
  return { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge };
}

function secret() {
  const key = process.env.MATCHDAY_SESSION_SECRET;
  return key && key.length >= 32 ? key : undefined;
}

function seal(data: object, purpose: string, maxAge: number, key: string) {
  const payload = Buffer.from(JSON.stringify({ data, expires: Date.now() + maxAge * 1000 })).toString("base64url");
  const signature = createHmac("sha256", key).update(purpose + "." + payload).digest("base64url");
  return payload + "." + signature;
}

function unseal<T>(value: string | undefined, purpose: string, key: string): T | null {
  if (!value) return null;
  const [payload, signature, trailing] = value.split(".");
  if (!payload || !signature || trailing !== undefined) return null;
  const expected = createHmac("sha256", key).update(purpose + "." + payload).digest();
  const actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const { data, expires } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return expires > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const key = secret();
  if (!key) return null;
  return unseal<SessionUser>((await cookies()).get(sessionCookie)?.value, sessionCookie, key);
}

export function configuredAppOrigin() {
  const url = process.env.MATCHDAY_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL);
  return url ? new URL(url).origin : null;
}

function oauthConfig() {
  const key = secret();
  const clientId = process.env.MATCHDAY_GITHUB_CLIENT_ID;
  const clientSecret = process.env.MATCHDAY_GITHUB_CLIENT_SECRET;
  const origin = configuredAppOrigin();
  if (!key || !clientId || !clientSecret || !origin) return null;
  return { key, clientId, clientSecret, origin, callback: new URL("/auth/callback", origin).href };
}

function returnPath(value: string | null, origin: string) {
  if (!value?.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/#admin";
  const url = new URL(value, origin);
  if (url.origin !== origin || url.pathname !== "/") return "/#admin";
  return url.pathname + url.search + url.hash;
}

export function beginSignIn(request: Request) {
  const config = oauthConfig();
  if (!config) {
    return new NextResponse("Scorer sign-in is awaiting GitHub OAuth configuration.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== config.origin) {
    const canonical = new URL("/signin", config.origin);
    canonical.search = requestUrl.search;
    return NextResponse.redirect(canonical);
  }

  const query = requestUrl.searchParams;
  const flow: Flow = {
    state: randomBytes(32).toString("base64url"),
    verifier: randomBytes(32).toString("base64url"),
    returnTo: returnPath(query.get("return_to"), config.origin),
  };
  const url = new URL("https://github.com/login/oauth/authorize");
  url.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.callback,
    scope: "user:email",
    state: flow.state,
    code_challenge: createHash("sha256").update(flow.verifier).digest("base64url"),
    code_challenge_method: "S256",
  }).toString();

  const response = NextResponse.redirect(url);
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(flowCookie, seal(flow, flowCookie, flowSeconds, config.key), options(flowSeconds));
  return response;
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
}

export async function finishSignIn(request: Request) {
  const config = oauthConfig();
  const query = new URL(request.url).searchParams;
  const code = query.get("code");
  const flow = config && unseal<Flow>((await cookies()).get(flowCookie)?.value, flowCookie, config.key);
  const failure = new NextResponse("GitHub sign-in failed. Return to My matches and sign in again.", {
    status: 400,
    headers: { "Cache-Control": "no-store" },
  });
  failure.cookies.set(flowCookie, "", options(0));
  if (!config || !flow || !code || query.get("state") !== flow.state) return failure;

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.callback,
        code,
        code_verifier: flow.verifier,
      }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) return failure;
    const token = asRecord(await tokenResponse.json());
    if (typeof token.access_token !== "string") return failure;

    const github = { headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + token.access_token }, cache: "no-store" as const };
    const [profileResponse, emailResponse] = await Promise.all([
      fetch("https://api.github.com/user", github),
      fetch("https://api.github.com/user/emails", github),
    ]);
    if (!profileResponse.ok || !emailResponse.ok) return failure;

    const profile = asRecord(await profileResponse.json());
    const emails = await emailResponse.json();
    if (!Number.isSafeInteger(profile.id) || !Array.isArray(emails)) return failure;
    const primary = emails.map(asRecord).find(entry => entry.primary === true && entry.verified === true);
    if (typeof primary?.email !== "string") return failure;
    const user: SessionUser = {
      userId: "github:" + profile.id,
      email: primary.email,
      displayName: [profile.name, profile.login].find((name): name is string => typeof name === "string" && !!name) || primary.email,
    };
    const response = NextResponse.redirect(new URL(flow.returnTo, config.origin));
    response.headers.set("Cache-Control", "no-store");
    response.cookies.set(flowCookie, "", options(0));
    response.cookies.set(sessionCookie, seal(user, sessionCookie, sessionSeconds, config.key), options(sessionSeconds));
    return response;
  } catch {
    return failure;
  }
}
