# Matchday School Cricket

Matchday is a bilingual English and Sinhala school cricket app with fixtures, scorecards, competitions, standings, player statistics, and a match administration workspace. The overview includes clearly labeled demo data. Published matches use the scoring database.

## Local development

Use Node 24. Install dependencies with `npm ci`. For a local SQLite database, set `TURSO_DATABASE_URL=file:local.db` in your environment, then run `npm run db:migrate` and `npm run dev`. Set `MATCHDAY_APP_URL=http://localhost:3000` and register a corresponding GitHub OAuth callback if you need local sign-in.

- `npm test` runs the scoring and match summary tests.
- `npm run build` assembles the browser scripts and builds Next.js.
- `npm run db:generate` generates schema changes. Apply them with `npm run db:migrate`.

## Vercel setup

1. Deploy with the Next.js framework preset. Connect a Turso SQLite database and configure `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in Vercel. Apply the checked-in migrations once to the production database using `npm run db:migrate` with the production database variables loaded in your shell.
2. Create a GitHub OAuth app with your production deployment's home URL and `/auth/callback` as the callback path. Set `MATCHDAY_GITHUB_CLIENT_ID` and `MATCHDAY_GITHUB_CLIENT_SECRET` in Vercel.
3. Set `MATCHDAY_APP_URL` to the production origin used by the OAuth app. Set `MATCHDAY_SESSION_SECRET` to a random secret of at least 32 characters, such as the output of `openssl rand -hex 32`. Set `MATCHDAY_ADMIN_EMAIL` to the administrator's verified primary GitHub email. Redeploy after updating environment variables.

Set a separate database and GitHub OAuth registration for preview deployments that need scoring access. Match ownership is tied to the authenticated GitHub account ID. A new Turso database starts empty. Importing existing Sites/D1 records requires mapping Site owners to their new GitHub account IDs before importing.

See the [Turso Vercel integration](https://vercel.com/marketplace/tursocloud/database) and [GitHub OAuth app setup](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).
