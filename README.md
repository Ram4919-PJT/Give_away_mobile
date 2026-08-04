# Give Away — Mobile App

React Native / Expo mobile app for the Give Away platform. Auth is connected to the real IAM API via the backend gateway.

## Prerequisites

- **Node.js 18+**
- **Expo CLI** (via `npx expo`)
- **Backend running** on port 8000 (see `give-away-backend/README.md`)
- **Expo Go** app on your phone, or Android/iOS emulator

## Install dependencies

```powershell
cd Give_away_mobile
npm install
```

## Configure environment

```powershell
copy .env.example .env
```

| Environment | `EXPO_PUBLIC_IAM_API_URL` |
|-------------|---------------------------|
| iOS simulator / Expo web (same machine) | `http://localhost:8000/api/v1` |
| Android emulator | `http://10.0.2.2:8000/api/v1` |
| Physical device | `http://<YOUR_PC_LAN_IP>:8000/api/v1` |

## Start the app

**Terminal 1 — Backend:**

```powershell
cd give-away-backend
python run.py
```

**Terminal 2 — Mobile:**

```powershell
cd Give_away_mobile
npx expo start
```

Then press:

- `a` — Android emulator / device
- `i` — iOS simulator (macOS only)
- Scan the QR code with **Expo Go** on a phone

Web preview (optional):

```powershell
npx expo start --web
```

## Login / register

- **Register** — creates a real account via `POST /api/v1/auth/register`
- **Login** — role comes from the server after login (no role picker on login)
- Tokens are stored in **AsyncStorage**
- Dashboards are mostly empty until Core/Communication APIs are wired in the UI

### Test accounts (after backend register)

| Email | Password |
|-------|----------|
| `donor@test.com` | `Test@1234` |
| `receiver@test.com` | `Test@1234` |
| `ngo@test.com` | `Test@1234` |

Mobile must be a 10-digit Indian number starting with 6–9 (e.g. `9876543210`).

## How API calls work

```
Mobile app  →  EXPO_PUBLIC_IAM_API_URL  (e.g. http://localhost:8000/api/v1)
            →  API Gateway (:8000)
            →  IAM service
```

## Project structure

```
src/
  api/iamClient.js       # IAM API client (AsyncStorage for tokens)
  context/AuthContext.js # Auth state
  navigation/            # Auth stack + role tab navigators
  screens/               # Welcome, login, register, dashboards
  theme/                 # Colors, spacing (Give Away brand)
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Network request failed | Backend must be running; use `10.0.2.2` on Android emulator |
| Physical device can't connect | Use your PC's LAN IP, not `localhost` |
| Login fails | Check `.env` URL matches your setup |
