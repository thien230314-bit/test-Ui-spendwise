# Verification — 2026-10-20, Asia/Saigon

## Status

**Interactive demo core: verified. Full Backend-equivalent V1.0 coverage: PARTIAL.** No live API/database/provider test is relevant to this corrected frontend-only scope. No production/Vercel deployment has been performed.

| Check | Actual result |
|---|---|
| `npm test` | PASS — 51 focused checks |
| `npm run typecheck` | PASS — TypeScript, no errors |
| `node scripts/test-browser.cjs` | PASS — isolated Chrome UI flows, no page runtime errors and no Backend fetch/XHR |
| `node scripts/test-social-auth.cjs` | PASS — A/B friendship, new fund, invitation/join/contribution, registration flip, incorrect OTP, PIN setup |
| `npm run build` | PASS — Vite production output; size warning remains for the inherited password-strength dictionaries |
| Production preview on port 5174 | PASS — User/Admin login, lazy Auth chunk, direct wallet/users routes, refresh, Admin logout, zero runtime errors |
| Chrome DevTools | Opened and inspected actual User/Admin pages, snapshots, styles, screenshots, console and interaction |
| User viewport tests | PASS — 375×812, 390×844, 430×932; no horizontal document overflow; decorative frame removed |
| Desktop User | PASS — phone screen centered, approximately 390px wide; internal scroll/navbar/dialog containment |
| Admin desktop | PASS — full-width CRM, 1440×900 and 1024×768; no phone frame or horizontal page overflow |
| Theme/language | PASS — Light/Dark and English tested in Chrome; System follows existing media listener |
| Refresh/direct routes | PASS — User wallet and direct Admin support/maintenance/users preserve sessions and data |
| Original S renderer | SHA-256 matches reference byte for byte |

S checksum: `126e998552f151480efde0490fbb7bfc39bccc7c798b640f3f722010d1df7ad4`.

## Behavioral evidence

- User login prefilled, original S displayed, Dashboard opens without requiring an extra PIN login step in Demo.
- Transfer 250,000 VND debits A's wallet and credits B's wallet. Success contains amount/recipient/reference inside the device. A wrong PIN produces failure, does not change balances and retains form inputs for retry.
- Zero-balance wallet creation appears immediately and remains after refresh.
- User A invites B; B signs in through the account switcher and accepts. A creates a Free Fund and invites B; B accepts, contributes, and fund balance/history update persistently.
- Registration uses the original notebook flip. Test waits until the destination form is interactive, edits email/phone/password/confirmation, rejects a wrong OTP and completes with demo OTP/PIN. New users begin with zero wallet balance.
- Admin has an independent session and prefilled login. Case-scoped account restriction persists. Broadcast draft/preview/publish creates two local notifications, with no email/push network request.
- Financial model checks cover conservation, overdraft rejection, whole VND, PIN failure, wallet ownership, idempotency/replay conflict, restricted outbound/inbound policy, lock/unlock session versions, active-case scope, new membership episode with zero old entitlement, election freeze, withdrawal holds, maintenance admission and audited reversal.
- A visual defect in the result checkmark was corrected by matching pathLength to the retained stroke animation; the Auth S source was not changed. Glass page cores were made readable so permanently mounted Auth forms do not show through each other.
- A select's implicit label included its option text in the browser selector. Explicit accessible labels were added and the complete UI test passed afterward.

## Browser evidence and incremental Git workflow

Real Chrome screenshots are stored in `../img/` and committed with each completed UI group. No composite image is generated. Earlier diagnostic images in `docs/screenshots/` are ignored.

2026-10-20: TypeScript, production build, 51 model checks, existing Chrome regression suite and a 22-route loading check passed. Each route displayed its layout skeleton and then loaded content after the 180ms mock delay. The Users skeleton has five columns. Fixed/Free Fund layouts differ. Admin uses a new glass login card, validates credentials and does not render the notebook or User S loader. No browser runtime errors, document overflow or backend fetch/XHR were found in these checks. Browser tests use disposable contexts and virtual time only to capture transient loading states.

Repository was empty before initialization. Source and real PNG evidence are pushed incrementally to the user-specified repository, without force push.

## Not run / limits

- No actual Vercel deployment or Vercel-hosted refresh verification. SPA rewrites and build/output paths are prepared in `vercel.json`.
- No real provider, Backend, database, SMTP, email, push, Gemini or native-device build. This is intentional scope, not an integration PASS.
- No claim of complete V1.0 business equivalence. Advanced elections, multi-period Fixed Fund activity/settlement, automated classification and the full maintenance scheduling lifecycle remain partial; see `API-COVERAGE.md`.
- Browser code uses public demo credentials and localStorage. It is a simulation and is not a secure authentication or financial system.
- TikTok video frames were unavailable: `VIDEO_REFERENCE_UNAVAILABLE`.
- No Backend reference source was modified.
