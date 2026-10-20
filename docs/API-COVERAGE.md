# Frontend simulation coverage

No HTTP Backend integration is enabled or claimed. The UI calls `demoApi.command/query`; Auth compatibility methods route to `mockRequest`, without fetch. Replace these transports and map real DTOs in a later integration task. The original Backend remains untouched.

| Area | Implemented demo behavior | Future real API family |
|---|---|---|
| Auth | prefilled User/Admin sign-in, registration, demo OTP/PIN, original Auth animations, password/PIN recovery | `/api/auth/*`, `/api/security-pin/*` |
| Wallets | zero-balance creation, rename, empty-wallet closure, owner checks | `/api/wallets` |
| Transfers | debit/credit two wallets, whole VND, sufficient balance, PIN, per-intent replay protection | `/api/transfers/internal`, `/api/transfers/p2p` |
| Personal finance | record income/expense, category, history/filter/detail, CSV and aggregate report | `/api/transactions`, `/api/categories` |
| Friends | search synthetic users, invite, incoming acceptance/rejection, cancellation/removal, transfer action | `/api/friends` |
| Fixed/Free funds | separate finance summary, target/obligations or equity/refund view, invitation/membership, contributions, expenses/withdrawal requests, Free review, Fixed 24h pending and dispute report | `/api/v1/funds/*` |
| Fund governance | permissions, ownership offers/acceptance, current-episode refunds, leave/dissolve and history | `/api/v1/funds/*` |
| Elections | basic nomination/vote/deadline/acceptance/rejection UI, finance/invitation freeze | `/api/v1/funds/elections/*` — partial simulation |
| Planning | CRUD budgets/goals/recurring/categories/rules, goal allocation/refund, occurrence recording | `/api/budgets`, `/api/goals`, `/api/recurring-transactions`, `/api/transaction-rules` |
| Banking | synthetic bank reservoir, all-or-nothing top-up, pending withdrawal hold, case-scoped simulated settlement/refund | `/api/bank-connections/*` — no live provider |
| Notifications | read/unread/all-read and local broadcasts | `/api/notifications/*` |
| Support | ticket creation, synthetic evidence description, case conversation, assignment, resolution/dispute cancellation | `/api/cases/*`, `/api/v1/admin/support/*` |
| AI | persisted conversation with explicit scripted response, suggestions, skeleton typing state | `/api/ai/*` — no model integration |
| Profile/preferences | name, password/PIN, current-session sign-out, user-scoped theme/language | `/api/users/me/*`, `/api/auth/*` |
| ADM-01 | KPIs, fund aggregate drilldown, outgoing cash-flow bars, recent cases/activity | `/api/v1/admin/overview/*` |
| ADM-02 | user search/filter/pagination, details, case-scoped status and session revocation | `/api/v1/admin/users/search`, `/api/v1/admin/support/{caseId}/users/*` |
| ADM-03 | case queue/detail, claim, reply, resolve; disputed Fixed expense returns to hold or cancels | `/api/v1/admin/support/*` |
| ADM-04 | draft/preview/publish, local delivery/read log | `/api/v1/admin/notifications/*` |
| ADM-05 | schedule metadata, emergency maintenance on/off, admission guard, pending reconciliation safety gate, audit | `/api/v1/system/maintenance/*` |

## Explicit partial areas

- Election phase names, deadlines and transitions currently provide a small interactive representation, not every canonical Backend phase/edge case; runoff/tie-break/confirmation and every inactivity predicate are not implemented. A deadline cannot be bypassed by the UI. The client does not claim a final election result without the corresponding simulated command.
- Fixed Fund new-activity proposals, carry-over settlement, complete multi-period financial calculations, all kick/leave edge policies and all election-related administrative intake are not fully simulated.
- Classification rules are stored/edited/toggled; automatic matching is not yet implemented. Recurring occurrences are recorded by explicit user action, not a background scheduler.
- Budget demo summaries begin with synthetic fixture history and update matching-category recorded expenses. They are not a replacement for period-aware Backend budget calculations.
- Evidence is a synthetic text description. No real file upload, notification provider, AI provider or bank provider is contacted. No physical/native mobile build is part of the corrected Vite demo.
- Maintenance includes one schedule and immediate activation, not the complete Backend plan/reminder/extension lifecycle.

## Financial checks

All monetary operations use safe integer VND, sufficient-balance checks and immutable command execution. Each accepted update rechecks total seeded reserves across wallets, banks, funds, goal allocations, pending withdrawal holds and external income/expense boundary. An exception leaves stored data unchanged. Intent keys prevent replayed transfers from debiting twice. A newly joined membership has a new episode and zero historical contributed balance. Account restriction preserves inbound credits while blocking outbound financial writes; account lock invalidates sessions, and unlock does not revive revoked sessions. Chrome Web Locks serialize writes across tabs for this local demo only.
