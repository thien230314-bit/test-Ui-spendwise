# Demo walkthrough

1. Run `npm install`, then `npm run dev` at project root. Open `/app` and `/admin` in two tabs.
2. User Login is prefilled for A. Click Login and observe the original S. Home is contained in the phone frame and initially shows a short skeleton.
3. Home → Chuyển tiền → choose B, source wallet, `250000`, optional note, PIN `123456` → confirm. The success popup shows amount/recipient/reference; A decreases and B increases. Try PIN `000000` to see the red X; closing the failure result retains the form values for retry.
4. Wallet → Tạo ví → save a name. A zero-balance wallet appears and survives refresh. Transfer between A's wallets without minting money.
5. Friends → send B an invitation. Profile → switch A/B → Friends → Accept. Switch back to A as needed. User identity is shown on Home/Profile.
6. Groups → create Free Fund → Members → invite B. Switch to B → Groups → accept → contribute with PIN. Check fund finance, membership contribution and history. Fixed Fund has a target/obligation view, and expense requests have Pending24h with a dispute action. Free Fund requests await owner review.
7. Profile → Planning → create budget/goal/recurring/category. Goal allocation moves wallet money into the goal; withdrawing returns it. Recurring → Record this occurrence prevents repeating the same month.
8. Profile → Banks → top up from the finite Demo bank reservoir. Withdrawal creates Pending and holds money; it never shows Completed immediately.
9. Admin Login is prefilled. Sign in independently. User Management → Details → status requires an active case assigned to Admin, reason and PIN. User A already has `case-a`; claim B's case in Support before changing B. Restricted blocks debits, Locked invalidates User sessions.
10. Admin Support → claim/reply/resolve. Notifications → draft → preview/publish → notification appears in User. No actual email/push is sent.
11. Admin Maintenance → schedule → enable. Financial actions are blocked. If a withdrawal is Pending, reconcile it through a related assigned case before reopening. Reconciliation moves only demo reserves.
12. Profile → Light/Dark/System and VI/EN. Refresh `/app/wallet` or `/admin/users` directly. Both routes retain their own session.

OTP registration/recovery: `12345678`. Demo PIN: `123456` for seeded accounts. New users choose/confirm a new six-digit demo PIN and start with a zero-balance wallet. All account credentials are deliberately public fixture data; never reuse real passwords or account details.

Screenshots: `docs/screenshots/`. Scripts run separate isolated browser contexts and do not modify the live demo tabs. Vercel preparation is documented in README; live deployment has not been performed.
