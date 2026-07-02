# Building the Android App (Windows, CLI-only)

No Android Studio required. Everything below runs from a shell.

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| JDK | **17** (Temurin tested) | AGP 8.7 requires 17+. If `JAVA_HOME` points elsewhere (e.g. an old JDK 11), override it for the build shell. |
| Android SDK | platform **android-35**, build-tools 35.x | Default Windows location: `%LOCALAPPDATA%\Android\Sdk` |
| Gradle | — | Not needed globally; the repo commits the **Gradle 8.10.2 wrapper** |

## One-time setup

1. Create `android/local.properties` (gitignored) pointing at your SDK:

   ```properties
   sdk.dir=C\:\\Users\\<you>\\AppData\\Local\\Android\\Sdk
   ```

2. Ensure the build uses JDK 17. Either set it machine-wide, or per shell:

   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot"
   ```

   ```bash
   export JAVA_HOME="C:/Program Files/Eclipse Adoptium/jdk-17.0.17.10-hotspot"
   ```

## Build

```bash
cd android
./gradlew assembleDebug
```

First build downloads dependencies (several minutes). Output APK:
`android/app/build/outputs/apk/debug/app-debug.apk`

## Run on the emulator

```powershell
# list available virtual devices
& "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -list-avds

# boot one (keep this shell open)
& "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -avd <AVD_NAME>

# in another shell: wait, install, launch
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" wait-for-device
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r android\app\build\outputs\apk\debug\app-debug.apk
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" shell am start -n com.devmaniac.app/.MainActivity
```

The app boots into **demo mode** — fully browsable with bundled data, no backend needed.

## Point at a real backend (optional)

1. Run the backend on the host: PostgreSQL up, then from `backend/`: `uvicorn app.main:app --reload` (Python 3.14 + Poetry; see `backend/pyproject.toml`).
2. In the app: **Profile → ⚙ Settings** → turn **Demo mode off**. The default base URL `http://10.0.2.2:8000/` maps to `localhost:8000` on the host machine. For a physical device, use your machine's LAN IP (the debug build allows cleartext HTTP).
3. Optionally paste a `clerk_user_id` from your database under **Dev sign-in** to browse as that user (see the auth caveat in [API.md](API.md)).

## Troubleshooting

- **"Android Gradle plugin requires Java 17"** — your `JAVA_HOME` points at an older JDK; set it as above.
- **`SDK location not found`** — missing/incorrect `android/local.properties`.
- **Emulator can't reach the backend** — use `10.0.2.2`, not `localhost`; confirm uvicorn listens on `0.0.0.0` or at least `127.0.0.1`.
- **Screenshots for docs/bug reports** — `adb exec-out screencap -p > screen.png`; crash logs via `adb logcat -s AndroidRuntime`.
