# Matchday — school cricket, stage 2

A private Sites application with a bilingual English/Sinhala interface, a public-facing demo design and an authenticated match-scoring workspace. Built with the supplied Vinext/Cloudflare Worker starter, D1, Drizzle and the existing HTML/CSS/JS UI.

## Working scope
- Public UI: original stage-1 demo match/tournament/player pages, filters, scorecard and resource links.
- My matches: signed-in user-owned records; create a match with teams, 2–11 players each, competition, venue, date, overs (1–50), batting-first selection and optional free-hit rule.
- Scorer: opening batters/bowler, next batter/new bowler, runs, boundaries, wides, no-balls, byes/leg-byes, supported wickets, innings changes, result calculation, strike corrections and undo.
- Server-authoritative replay; persistent event history; optimistic revision checks; idempotent action IDs and safe retry after an uncertain save.
- JSON scorecard export, loading/error/empty states, language preference in browser storage. Match data lives in D1, not localStorage.
- Owner-private Site audience is preserved. Every record API requires platform identity and matches the record owner; there is no anonymous write access.

## Important limits
This is a development milestone, not a fully implemented replacement for SLSCA. The public demo is not connected to real scores. The private workspace only supports one innings per team, standard six-ball overs and a one-run wide/no-ball penalty. No DLS, super overs, penalty-run adjustments, retirements, multi-day matches, roster editing after creation, official approval, scorer assignment, school/tournament administration or original API integration yet. Run-out end corrections must be applied with the explicit Swap ends control where the umpire requires them. Confirm applicable school competition rules before official use.

Scorer authentication uses Sites' ChatGPT sign-in. Your own matches are private; separately managed administrator/scorer/viewer accounts and public score sharing remain future work. Do not change the Site audience expecting shared scoring: owner authorization is enforced per record.

## Source and local workflow
- `public/core.js`: public demo UI.
- `public/workspace.js`: authenticated match administration and scoring UI.
- `public/i18n.js`: bilingual labels and route integration.
- `node scripts/compose-ui.mjs`: combines these into `public/app.js`; run before build after UI edits.
- `lib/cricket/engine.mjs`: pure replayable scoring engine.
- `lib/cricket/api.ts`, `app/api/`: owner authorization, input validation, D1 persistence and revision checks.
- `db/schema.ts`, `drizzle/`: schema and migrations. Generate with `npm run db:generate`; never edit applied migrations.
- `node --test tests/engine.test.mjs`: scoring regression tests.
- `npm run dev`: Vinext preview (local preview identity is supplied by the starter).
- Build and package via the Sites skill helper. Hosting manifest retains the Site project ID and D1 binding `DB`.
- Preview database and hosted database are separate; no sample match records are seeded into production.

## Reference rules
- MCC Laws of Cricket (2026): https://www.lords.org/getattachment/d9eb43d5-5935-4634-b170-da698e0e9d6e/Laws-of-Cricket-2017-Code-4th-Edition-%282026%29.pdf
- New South Wales Cricket Umpires' and Scorers' Association scoring manual (balls faced/no-ball convention): https://nswcusa.cricketnsw.com.au/app/uploads/2020/05/Scorers-Manual-130922-w-sheets.pdf
These are reference sources for the supported core, not confirmation of SLSCA competition-specific playing conditions.

## Next stages
3. Agree official scoring/competition rules and validate the scorer against sample scorebooks. Add admin/scorer roles, school/player/tournament management and result approval.
4. Integrate authorized public data, scheduled fixture management, standings and season aggregates.
5. Add advanced match formats, offline synchronization, backup/restore, migration and operational testing before official rollout.
