# nish_android — Android Port Plan

Native Android (Kotlin + Jetpack Compose) version of DevManiac, consuming the FastAPI REST backend. Read-only browsing MVP with a bundled-fixture demo mode so the app runs without the backend.

## Tasks

- [x] T1 — Restructure repo: `frontend/` → `web/`, remove stray files, `licence` → `LICENSE`, gitignore for Android
- [ ] T2 — Android Gradle scaffold (Gradle 8.10.2 wrapper, AGP 8.7.3, Kotlin 2.1.0, Compose, min 26 / target 35) — gate: `assembleDebug` green
- [ ] T3 — Dark Material 3 theme (#0F0F0F / #E8560A) + bottom-nav shell (Explore, Projects, Live, Search, Profile)
- [ ] T4 — Data layer: DTOs from backend Pydantic schemas, Retrofit ApiService, clerk-user-id auth interceptor, DataStore settings, repository interface + network impl
- [ ] T5 — Demo mode: fixture JSON in assets + FixtureRepository (default ON)
- [ ] T6 — Explore feed screen
- [ ] T7 — Projects list + project detail (Overview / Gallery / Updates / Comments tabs, cursor load-more)
- [ ] T8 — Live projects + day-numbered journal timeline (entry-type badges, media grid, code blocks, problem→solution)
- [ ] T9 — Profile, Search (debounced), Settings (base URL, dev sign-in, demo toggle)
- [ ] T10 — Docs: README rewrite, docs/ARCHITECTURE.md, docs/API.md, docs/BUILD.md, docs/PORTING-NOTES.md
- [ ] T11 — Emulator verification walkthrough + fixes

## Review

(to be filled in as tasks complete)
