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

## What's deliberately not here (yet)

- Writes/mutations (comments, stars, journal composer) — the MVP is read-first
- Real authentication — see the auth caveat in [API.md](API.md) and [PORTING-NOTES.md](PORTING-NOTES.md)
- Offline caching beyond the fixture set; realtime (the backend has none either)
