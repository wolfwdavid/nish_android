# Android App Architecture

Single-module MVVM. The guiding principle was **Simplicity First**: one small object graph, no DI framework, no multi-module split — none of it would pay for itself at this size.

## Layout

```
android/app/src/main/java/com/devmaniac/app/
├── DevManiacApp.kt          Application; owns the AppContainer
├── MainActivity.kt          Single activity; hosts the Compose tree
├── di/AppContainer.kt       Hand-rolled object graph + repository cache
├── data/
│   ├── dto/                 kotlinx.serialization DTOs (mirror backend Pydantic schemas 1:1)
│   ├── remote/              Retrofit ApiService + clerk-user-id AuthInterceptor
│   ├── repo/                DevManiacRepository interface
│   │                          ├── NetworkRepository  (Retrofit → FastAPI)
│   │                          └── FixtureRepository  (bundled assets/fixtures/*.json)
│   └── settings/            Preferences DataStore (base URL, dev user id, demo mode)
└── ui/
    ├── theme/               Material 3 dark scheme matching the web palette
    ├── navigation/          Type-safe Navigation Compose routes + bottom nav
    ├── common/              UiState, ViewModel factory, relative-time formatting
    ├── components/          Shared composables (avatar, tech chips, loading/error/empty)
    └── explore|projects|projectdetail|liveproject|profile|search|settings/
                             One package per screen: Screen + ViewModel (+ cards)
```

## Decisions and why

**Single `:app` module.** The app is a read-mostly client with ~10 screens. Multi-module buys build parallelism and enforced boundaries at the cost of ceremony; neither matters here.

**Manual DI (`AppContainer`) instead of Hilt.** The entire object graph is: settings store, one `Json`, one OkHttp client, one Retrofit service, one repository. A plain class constructed lazily in `Application` covers it. ViewModels reach it through a small `containerViewModelFactory` helper that pulls the `Application` out of `CreationExtras`.

**Repository interface with two implementations.** `DevManiacRepository` is the seam that makes everything else testable and demoable:
- `NetworkRepository` delegates to Retrofit.
- `FixtureRepository` decodes bundled JSON **through the same DTOs**, so the fixtures double as a serializer contract test — if a fixture drifts from the schema, the app crashes loudly in demo mode.

The `AppContainer` rebuilds the active repository whenever a settings snapshot that shapes it changes (demo flag, base URL, dev user id), keyed by a simple data-class cache key.

**Retrofit + kotlinx.serialization** (`converter-kotlinx-serialization`). The FastAPI routers map 1:1 to a Retrofit interface. `Json { ignoreUnknownKeys; coerceInputValues; explicitNulls = false }` keeps the client resilient to backend additions.

**UUIDs and datetimes stay `String`.** The backend emits naive ISO datetimes (no timezone suffix) and UUIDs; nothing in the UI needs them typed. `relativeTime()` parses defensively (offset first, then naive-as-UTC) and falls back to the raw string.

**Per-screen ViewModel + sealed `UiState<T>`** (`Loading / Content / Error`) exposed as `StateFlow`, collected with `collectAsStateWithLifecycle`. Detail ViewModels take the slug/username as a constructor argument and are keyed in `viewModel(key = …)` so two different projects never share state.

**Type-safe Navigation Compose.** Routes are `@Serializable` objects/data classes (`ProjectDetailRoute(slug)`), not string templates. Bottom nav uses `popUpTo(startDestination) { saveState = true }` + `restoreState` for standard tab behavior.

## Data flow

```
Screen (Compose) → ViewModel.load() → container.repository()  ── demoMode? ──► FixtureRepository → assets/fixtures/*.json
                                                          └─────────────────► NetworkRepository → Retrofit → FastAPI
        ◄── StateFlow<UiState<T>> ──┘
```

## Theming

Material 3 `darkColorScheme` pinned to the web palette: background `#0F0F0F`, cards `#171717`/`#1F1F1F`, primary `#E8560A` with bright accent `#FB923C`, muted text zinc-400/500, hairline outlines at 10% white. Display type uses the platform serif (web uses Instrument Serif), code blocks use the platform monospace (web uses JetBrains Mono) — zero bundled font assets.

## Authentication (Phase 2)

`auth/AuthManager.kt` is the single source of truth for identity, exposing a
`StateFlow<AuthState>`:

```
AuthState = SignedOut | DevUser(clerkUserId) | ClerkUser(clerkUserId, email)
```

Priority: a signed-in **Clerk session** wins; otherwise **demo mode** acts as
the bundled demo builder; otherwise the Settings **dev user id**; otherwise
signed out. All Clerk SDK symbols live in `AuthManager` + `SignInViewModel`
only — the rest of the app sees `AuthState`.

- Clerk (`com.clerk:clerk-android-api`) initializes in `DevManiacApp` only
  when `CLERK_PUBLISHABLE_KEY` is non-empty (read from `local.properties`
  key `clerk.publishableKey` at build time). Keyless builds never touch the
  SDK and fall back to dev sign-in.
- `AuthInterceptor` reads the live auth state per request: Clerk sessions
  send `Authorization: Bearer <session JWT>` (via `Clerk.auth.getToken()`,
  cached by the SDK) plus the legacy `clerk-user-id` header; dev users send
  the header only. `runBlocking` in the interceptor is safe — Retrofit
  suspend calls run interceptors on OkHttp dispatcher threads.
- After Clerk sign-in the app POSTs `/sync_user/` to provision the user row.
- Server side, the optional JWT middleware verifies Bearer tokens and
  overrides client-supplied identity — see [API.md](API.md).

## Write operations (Phase 2)

The repository interface gained star/bookmark/comment/vote/journal/like/
follow/sync methods. Two implementation notes:

- **State-sync error mapping** lives inside `NetworkRepository`: 409 on a
  duplicate create and 404 on a missing delete both mean "already in the
  requested state" and resolve by refetching rather than surfacing errors.
- **Demo mode stays writable**: `FixtureRepository` keeps a session-scoped
  in-memory overlay (stars, bookmarks, added comments + votes, added
  journals, likes, follows) that is merged into *every* read path, so
  optimistic writes survive screen reloads. The overlay resets when settings
  changes rebuild the repository or the app restarts.

ViewModels apply optimistic updates and reconcile from responses (star
returns the full project; journal like returns the fresh count; votes re-read
the comment list because the server semantics are toggle/switch).

## What's deliberately not here (yet)

- Media uploads (Cloudinary direct upload), push notifications
- Journal comments UI (the backend schema returns no user or threading data)
- Edit/delete flows, project creation, onboarding
- Offline caching beyond the fixture set; realtime (the backend has none either)
