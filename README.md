# PromptVision

PromptVision is a browser-based recording studio with a voice-tracked teleprompter and an eye-contact meter. Camera and microphone media are handled in the browser; recordings are created as downloadable WebM files and are not uploaded by the app.

## Features

- Google sign-in with Auth.js (NextAuth.js v5).
- A protected recording studio at `/studio`.
- Camera preview and local WebM recording with playback and download.
- Editable teleprompter script that follows speech using the Web Speech API.
- Optional eye tracking and an eye-contact score using MediaPipe Face Landmarker.

Eye tracking currently reports gaze position and a score; it does not modify or redirect pixels in the camera video. Eye tracking downloads its WASM runtime and model from public CDNs when enabled. Speech recognition availability depends on the browser; Chrome and Edge are recommended.

## Requirements

- Node.js 20.9 or later.
- npm or Bun.
- A Google OAuth client for sign-in.
- A modern browser with camera and microphone access. Use `localhost` or HTTPS for media device access.

## Setup

1. Install dependencies:

   ```bash
   npm install
   # or
   bun install
   ```

2. Create a local environment file from the template:

   ```bash
   cp .env.example .env.local
   ```

   Fill in the Google OAuth values and generate an Auth.js secret as described below. Environment files belong in the repository root, even though application code is under `src/`.

3. In Google Cloud Console, configure an OAuth consent screen and create a **Web application** OAuth client. Add this authorized redirect URI for local development:

   ```text
   http://localhost:3000/api/auth/callback/google
   ```

   Put the client ID and client secret in `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.

4. Generate a secret and put it in `AUTH_SECRET`:

   ```bash
   openssl rand -base64 33
   ```

5. Start the development server:

   ```bash
   npm run dev
   # or
   bun run dev
   ```

6. Visit [http://localhost:3000](http://localhost:3000), sign in with Google, and open the studio. Grant camera and microphone permissions when prompted.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `AUTH_GOOGLE_ID` | Yes | Google OAuth client ID. |
| `AUTH_GOOGLE_SECRET` | Yes | Google OAuth client secret. Keep it private. |
| `AUTH_SECRET` | Yes | Random secret used by Auth.js to protect sessions. |

For deployments where Auth.js cannot infer the public host, configure `AUTH_URL` to the app's public origin (for example, `https://example.com`) and set `AUTH_TRUST_HOST=true` when the deployment proxy is trusted. The Google OAuth client must also allow `https://<your-domain>/api/auth/callback/google` as an authorized redirect URI.

Never expose these values with a `NEXT_PUBLIC_` prefix or commit `.env.local`.

## Useful commands

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run start    # Serve the production build
npm run lint     # Run ESLint
```

## Browser permissions and privacy

Camera access is needed for preview and recording. Microphone access is needed for recording and voice tracking. The app records locally in the browser; it does not send camera or microphone recordings to a backend. MediaPipe model assets are fetched from public CDNs when eye tracking is turned on. Browser speech recognition may use a browser-provided service and may not be available in every browser.

## Project layout

```text
src/app/             App Router pages and Auth.js route handler
src/components/      Landing, login, and studio UI
src/hooks/           Camera, recording, speech, and eye-tracking hooks
src/lib/auth.ts      Auth.js configuration
```
