# Give Away — Mobile Wireframe (React Native / Expo)

Clean mobile UI wireframe for **Give Away / Aja Abayahastham**, mirroring the web project in `Demo_Give_away`.

This app is a **UI/UX prototype** with mock authentication and demo accounts — no real backend.

## Features (first deliverable)

- Welcome screen with Login / Register
- Role-based login: **Donor · Receiver · NGO · Admin**
- Email + password mock sign-in
- Demo accounts bottom sheet (one-tap login, password `123456`)
- Register role picker + Donor / Receiver / NGO forms (mock session)
- Role-based bottom tab homes with neat shells

## Run

```bash
cd d:\Aja\Demo_Give_away_mobile
npm install
npx expo start
```

Then press:
- `a` — Android emulator / device
- `i` — iOS simulator (macOS)
- scan the QR code with **Expo Go** on a phone

Web preview (optional):

```bash
npx expo start --web
```

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Verified Donor | `verified.donor@demo.com` | `123456` |
| Pending Donor | `pending.donor@demo.com` | `123456` |
| Verified Receiver | `verified.receiver@demo.com` | `123456` |
| Pending Receiver | `pending.receiver@demo.com` | `123456` |
| Verified NGO | `verified.ngo@demo.com` | `123456` |
| Pending NGO | `pending.ngo@demo.com` | `123456` |
| Admin | `admin@demo.com` | `123456` |

Or open **Try demo accounts** on the Login screen.

## Project structure

```text
src/
  components/     Shared UI (buttons, sheets, fields)
  context/        Mock AuthContext
  data/           Demo accounts (mirrored from web)
  navigation/     Auth stack + role tab navigators
  screens/        Welcome, Login, Register, role shells
  theme/          Colors, spacing, radius (Give Away brand)
```

## Brand

- Primary green `#22C55E`
- Accent blue `#2563EB`
- Background `#F8FAFC`
- 8px spacing · 44px+ touch targets · 16–20px cards

## Next

Port remaining web feature screens role-by-role (donate flows, applications, NGO requests, admin queue) into these tab shells without cluttering the home screens.
