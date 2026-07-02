# nish_android — Android Port Plan

Native Android (Kotlin + Jetpack Compose) version of DevManiac, consuming the FastAPI REST backend. Read-only browsing MVP with a bundled-fixture demo mode so the app runs without the backend.

## Tasks

- [x] T1 — Restructure repo: `frontend/` → `web/`, remove stray files, `licence` → `LICENSE`, gitignore for Android
- [x] T2 — Android Gradle scaffold (Gradle 8.10.2 wrapper, AGP 8.7.3, Kotlin 2.1.0, Compose, min 26 / target 35) — gate: `assembleDebug` green
- [x] T3 — Dark Material 3 theme (#0F0F0F / #E8560A) + bottom-nav shell (Explore, Projects, Live, Search, Profile)
- [x] T4 — Data layer: DTOs from backend Pydantic schemas, Retrofit ApiService, clerk-user-id auth interceptor, DataStore settings, repository interface + network impl
- [x] T5 — Demo mode: fixture JSON in assets + FixtureRepository (default ON)
- [x] T6 — Explore feed screen
- [x] T7 — Projects list + project detail (Overview / Gallery / Updates / Comments tabs, cursor load-more)
- [x] T8 — Live projects + day-numbered journal timeline (entry-type badges, media grid, code blocks, problem→solution)
- [x] T9 — Profile, Search (debounced), Settings (base URL, dev sign-in, demo toggle)
- [x] T10 — Docs: README rewrite, docs/ARCHITECTURE.md, docs/API.md, docs/BUILD.md, docs/PORTING-NOTES.md
- [x] T11 — Emulator verification walkthrough + fixes

## Phase 2 — Write operations + Clerk auth

- [x] P2-T1 — Fix comment update/delete/vote 500s (router passed wrong kwarg to service layer)
- [x] P2-T2 — Fix follow counters (decremented instead of incremented)
- [x] P2-T3 — Optional Clerk JWT verification middleware (JWKS, sub overrides client identity, CLERK_REQUIRE_JWT)
- [x] P2-T4 — Write endpoints in ApiService + repositories (star, bookmark, comments, votes, journals, likes, follow, sync_user) with 409/404 state-sync mapping
- [x] P2-T5 — Demo-mode session-scoped write overlay in FixtureRepository
- [x] P2-T6 — Clerk Android SDK integration (key-gated), AuthManager, Bearer-token interceptor; toolchain bump to Kotlin 2.4 / AGP 8.11 / Gradle 8.13 / compileSdk 36
- [x] P2-T7 — Sign-in screen + Settings account section
- [x] P2-T8 — Project detail: star/bookmark toggles, comment composer + replies + voting
- [x] P2-T9 — Journal likes + owner-only session composer (entry type, code snippet, problem/solution, progress)
- [x] P2-T10 — Follow/unfollow on profiles
- [x] P2-T11 — Docs updates + emulator write walkthrough

### Phase 2 review

Backend fixes verified by py_compile + code review (runtime needs Python 3.14 + Postgres, not available on this machine — deploy box must run `poetry lock && poetry install` for the new pyjwt dependency). Android verified by green `assembleDebug` at every task gate and a demo-mode emulator walkthrough exercising every write path. Clerk SDK API surface was verified by decompiling the actual 1.0.32 artifact (javap) before coding against it.

## Phase 1 review

All 11 tasks done. `assembleDebug` green at every gate; full demo-mode walkthrough on the Medium_Phone_API_36 emulator verified Explore, Projects, project detail (all four tabs incl. threaded comments), Live builds, journal timeline (day badges, entry-type chips, media, code, problem→solution), debounced Search, Profile, and Settings — zero AndroidRuntime crashes. Screenshots captured to docs/screenshots/ and embedded in the README.

Key decisions (details in docs/): single-module MVVM with manual DI, Retrofit + kotlinx.serialization DTOs mirrored 1:1 from the backend Pydantic schemas, repository seam with a fixture implementation so demo mode doubles as a serializer contract test. Toolchain pinned: Gradle 8.10.2 / AGP 8.7.3 / Kotlin 2.1.0 / JDK 17 (note: machine JAVA_HOME pointed at JDK 11 — builds must export JDK 17, documented in docs/BUILD.md).

Deferred to future phases: writes/mutations, real Clerk auth + backend JWT verification, push, Cloudinary uploads, follow/bookmarks/dashboard/changelog screens.
