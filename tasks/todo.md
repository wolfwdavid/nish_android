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

## Review

All 11 tasks done. `assembleDebug` green at every gate; full demo-mode walkthrough on the Medium_Phone_API_36 emulator verified Explore, Projects, project detail (all four tabs incl. threaded comments), Live builds, journal timeline (day badges, entry-type chips, media, code, problem→solution), debounced Search, Profile, and Settings — zero AndroidRuntime crashes. Screenshots captured to docs/screenshots/ and embedded in the README.

Key decisions (details in docs/): single-module MVVM with manual DI, Retrofit + kotlinx.serialization DTOs mirrored 1:1 from the backend Pydantic schemas, repository seam with a fixture implementation so demo mode doubles as a serializer contract test. Toolchain pinned: Gradle 8.10.2 / AGP 8.7.3 / Kotlin 2.1.0 / JDK 17 (note: machine JAVA_HOME pointed at JDK 11 — builds must export JDK 17, documented in docs/BUILD.md).

Deferred to future phases: writes/mutations, real Clerk auth + backend JWT verification, push, Cloudinary uploads, follow/bookmarks/dashboard/changelog screens.
