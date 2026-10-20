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

Admin follow-up: inline support ticket reply and assignment, maintenance plan edit and the existing broadcast/restriction regression passed in Chrome. ADM-03 uses ticket list/conversation/action columns; ADM-04 adds three KPI cards and a four-column delivery table. PNGs are under `img/admin-*.png`.

Final feedback group: original S remains source-identical; the User login button is disabled while authenticating. Pending withdrawal result is bounded by the phone screen and recorded as a pending hold. AI reply loading stays below 100px and resolves to a scripted response. Admin invalid-credential and Dark login states were captured. Registration/OTP/PIN and A/B social regression passed. Final production build passes with the inherited >500kB chunk-size warning (including recovery password-strength dictionaries); no warning threshold was increased.

UX quality P0 (2026-10-20): 21 English routes checked for untranslated controlled Vietnamese copy (personal names excluded). User back/home navigation, logout confirmation/cancel/session removal with wallet data preserved, language preference refresh persistence, Admin sidebar width/active accessible labels/collapse persistence passed in Chrome. Preference updates no longer wait for the simulated financial latency. Source S animation remains unchanged.

User visual group: AI hero, read-only balance context, prompt cards, chat author/time, compact loading, persisted conversation, localized scripted replies, back/home and language/theme controls verified in Chrome. The empty composer does not overlap prompt cards; conversation composer stays above navigation at 375/390/430 widths. Dashboard, Wallet, Friends, Groups and Profile surfaces were refined together. Real transfer success and logout confirmation screenshots updated. TypeScript and build passed.

Admin readability group: computed table cell font >=14px and table header >=12px asserted in Chrome. All five sections loaded; user search worked. Sidebar collapse expanded content, survived refresh, retained accessible active links and navigated Support. Dark/English and 1024px no-document-overflow passed. Required admin-login/dashboard/users-final and sidebar expanded/collapsed PNGs updated. Build passed.

Final UX/localization integrity: wrong-PIN feedback was checked separately in VI and EN with no bilingual error string. English signup OTP labels and dismissal passed. User forgot-password now enters the reused recovery form directly; OTP/password reset returns to the User notebook login, and invalid PIN-recovery links return to the same User area. Recovery path/validation/animations are retained. Added human operation labels for audit history and localized paused/cancelled/fund states; removed the duplicate ad-hoc locale audit script in favor of the assert-based UX suite. Original model checks remain 51/51. Required ten final PNGs exist under img/. No deployment performed.

Final evidence: Chrome DevTools confirmed the live User AI has back navigation and no document overflow; Admin Users has 15px body / 14px cells / 12px headers, two loaded rows and no remaining skeleton. Fresh console/network checks on User and Admin found no error/warning messages or backend fetch/XHR. Nine VI routes were also checked for raw English status/fund labels. All 92 PNG files were verified readable. A transient Windows file-open error during a repeated Admin screenshot was resolved by retry; the complete Admin capture/behavior suite then passed.
