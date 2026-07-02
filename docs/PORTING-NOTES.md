# Porting Notes — Web → Android

Decisions made translating the Next.js web app into native Kotlin/Compose, plus the gaps that remain.

## Why native Kotlin + Compose

Three options were weighed:

1. **Capacitor WebView wrap** — fastest, but the web app is server-rendered Next.js 16 with Clerk; it cannot be statically exported into a bundled hybrid app, so the "app" would be a thin shell around the website.
2. **React Native / Expo** — good middle ground; reuses the React mental model and Clerk ships an Expo SDK.
3. **Native Kotlin + Jetpack Compose** — chosen: a genuine Android app consuming the REST API, the strongest demonstration artifact, and the API is clean REST/JSON that maps directly onto Retrofit.

## Screen mapping

| Web (Next.js App Router) | Android (Compose) | Notes |
|---|---|---|
| `MobileBottomNav` (5 items) | `BottomNavBar` + Navigation Compose | same 5 tabs: Explore, Projects, Live, Search, Profile |
| Landing page | — | skipped; the app opens straight into Explore |
| `u/[username]` feed + sidebars | `ExploreScreen` | sidebars folded into cards; feed is the tab's whole surface |
| `project/[slug]` tabs Overview / Gallery / Updates / Comments | `ProjectDetailScreen` `TabRow` | identical tab names; comments read-only |
| `live_project/[slug]` journal timeline | `LiveProjectScreen` + `JournalEntryCard` | day badges, entry-type chips, code blocks, media row, problem→solution blocks |
| `search/` | `SearchScreen` | 300 ms debounce, same `/search/users` endpoint |
| `settings/*` (account, github, feedback…) | `SettingsScreen` | reduced to what the MVP needs: demo mode, base URL, dev sign-in |
| Clerk sign-in/sign-up pages | — | replaced by dev sign-in (see Auth) |
| Onboarding wizard, create flows, admin, changelog, legal | — | deferred (write operations / low value for a read-first MVP) |

## Contract discrepancies discovered (backend code is the source of truth)

- **`GET /feed-events` is not paginated** — it returns a plain array. Only `GET /projects/` uses cursor pagination, and its cursor is a datetime string.
- **`/projects/` needs its trailing slash** or you get a 307 redirect.
- **Journal `code_snippets` is `list[str]`** in the Pydantic schema; the web's TypeScript type models objects. The Android DTO follows the backend.
- **Feed `event_type` values** actually emitted/rendered: `journal_published`, `live_project_created`, `deployment`, `milestone` (the web `FeedEventCard` mapping) — not the journal `entry_type` vocabulary.
- **README env-var drift**: the web code reads `NEXT_PUBLIC_BACKEND_URL`, while the upstream README documents `NEXT_PUBLIC_API_URL`.

## Auth: from caveat to implementation (Phase 2)

Upstream, the backend trusts a raw `clerk-user-id` header / `clerk_user_id` query param with **no token verification**. Phase 2 closed that gap on both sides while staying backward compatible:

1. **Backend**: `core/clerk_jwt.py` middleware verifies `Authorization: Bearer` Clerk JWTs against the issuer's JWKS when `CLERK_JWT_ISSUER` is set, and the verified `sub` overrides any client-supplied identity. `CLERK_REQUIRE_JWT=true` disables the legacy trust-the-client path entirely.
2. **Android**: the official Clerk Android SDK (`com.clerk:clerk-android-api`) drives email+password sign-in when a publishable key is configured; the session JWT rides every request as a Bearer token. Keyless builds fall back to the dev sign-in.
3. The dev header path remains for local development (issuer unset, or `CLERK_REQUIRE_JWT=false`).

Integrating the Clerk SDK forced a toolchain bump: it requires **compileSdk 36** and is compiled with **Kotlin 2.4**, which pulled the project to AGP 8.11.1 / Gradle 8.13 / Kotlin 2.4.0 (and a `packaging` exclude for a duplicate `META-INF` resource from its transitive OkHttp 5).

## Demo mode design

The backend requires Python 3.14 + PostgreSQL, which makes "clone → run the app" heavy. Demo mode bundles fixture JSON (three builders, six projects, three live builds with full journals, comments, profiles, search results) decoded through the **same** kotlinx DTOs used against the live API. Fixture drift from the schema fails fast at decode time, so the fixtures act as a standing contract test. Demo mode defaults ON; Settings flips to the network repository at runtime — no rebuild needed.

## Visual translation

- Palette lifted from the web: `#0F0F0F` background, `#171717` cards, `#E8560A` primary / `#FB923C` accent, zinc muted text, 10%-white hairlines.
- Web display font (Instrument Serif) → platform serif; JetBrains Mono code blocks → platform monospace. Zero bundled font files; swap in the real OFL fonts later by dropping TTFs into `res/font/` and updating `Type.kt`.
- The web's Reddit-style comment votes render read-only as `▲ score`.

## Backend bugs found and fixed while porting

- Comment edit/delete/vote handlers crashed with 500 (wrong kwarg into the service layer) — fixed in `router/project.py`.
- Follow decremented follower counts instead of incrementing — fixed in `service/follow.py`. The app still refetches the profile after a follow toggle so it renders correct counts even against unfixed deployments.
- Journals carry no per-user `is_liked` flag, so liked state is session-local on Android; the 409/404 state-sync mapping self-heals divergence.

## Deferred / future work

- Media uploads (Cloudinary direct upload) for journal entries and projects
- Push notifications (backend has a notification model but no delivery)
- Journal comments UI (backend returns no commenter identity or threading — needs backend schema work first)
- Edit/delete flows for comments, journals, projects; project + live-project creation; onboarding wizard
- Bookmarks tab, dashboard, changelog screens
- Real-backend E2E test with Clerk keys + Postgres; release signing / Play Store packaging
- Paging 3 for the projects list if the dataset grows; image preloading; tablet layouts
