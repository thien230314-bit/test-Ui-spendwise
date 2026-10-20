export type DemoUser = {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    pin: string;
    role: 'User' | 'SystemAdmin';
    status: 'Active' | 'Restricted' | 'Locked';
    theme: 'light' | 'dark' | 'system';
    language: 'vi-VN' | 'en-US';
    verified: boolean;
    sessionVersion: number;
};
export type Wallet = {
    id: string;
    userId: string;
    name: string;
    balance: number;
    type: string;
};
export type Entry = {
    id: string;
    userId: string;
    walletId: string;
    title: string;
    amount: number;
    status: string;
    date: string;
    reference: string;
    category: string;
};
export type Member = {
    userId: string;
    episode: string;
    contributed: number;
    active: boolean;
    canSpend: boolean;
};
export type Fund = {
    id: string;
    name: string;
    kind: 'Fixed' | 'Free';
    ownerId: string;
    balance: number;
    target: number;
    status: string;
    members: Member[];
    history: {
        id: string;
        text: string;
        amount: number;
        date: string;
    }[];
    election?: {
        phase: string;
        deadline: string;
        candidates: string[];
        ballots: Record<string, string>;
        winner?: string;
    };
    requests: {
        id: string;
        userId: string;
        recipientId: string;
        amount: number;
        reason: string;
        status: string;
        episode: string;
        kind: string;
    }[];
};
export type Item = {
    id: string;
    userId: string;
    kind: string;
    name: string;
    amount: number;
    current: number;
    status: string;
    date: string;
};
export type Ticket = {
    id: string;
    userId: string;
    title: string;
    status: string;
    assignedTo?: string;
    messages: {
        author: string;
        text: string;
        date: string;
    }[];
    evidence: string[];
    fundId?: string;
    requestId?: string;
};
export type Notice = {
    id: string;
    userId: string;
    title: string;
    text: string;
    read: boolean;
    date: string;
};
export type DemoState = {
    version: 1;
    users: DemoUser[];
    wallets: Wallet[];
    entries: Entry[];
    funds: Fund[];
    items: Item[];
    friends: {
        id: string;
        from: string;
        to: string;
        status: string;
    }[];
    invitations: {
        id: string;
        fundId: string;
        from: string;
        to: string;
        status: string;
    }[];
    tickets: Ticket[];
    notices: Notice[];
    banks: {
        id: string;
        userId: string;
        name: string;
        balance: number;
        linked: boolean;
    }[];
    pending: {
        id: string;
        userId: string;
        walletId: string;
        amount: number;
        status: string;
    }[];
    broadcasts: {
        id: string;
        title: string;
        text: string;
        status: string;
        date: string;
    }[];
    maintenance: {
        enabled: boolean;
        title: string;
        start: string;
        end: string;
    };
    audit: {
        id: string;
        actor: string;
        text: string;
        date: string;
    }[];
    receipts: Record<string, {
        actor: string;
        fingerprint: string;
        value: unknown;
    }>;
    external: number;
    seedTotal: number;
};
export type Command = {
    type: string;
    [key: string]: unknown;
};
const now = () => new Date().toISOString();
const id = () => crypto.randomUUID();
function requireThat(ok: unknown, message: string): asserts ok { if (!ok)
    throw new Error(message); }
const text = (c: Command, key: string) => String(c[key] ?? '').trim();
const amount = (c: Command, key = 'amount') => { const n = Number(c[key]); requireThat(Number.isSafeInteger(n) && n > 0 && n <= 1000000000, 'Số tiền phải là số nguyên VND từ 1 đến 1.000.000.000 / Enter a valid whole VND amount.'); return n; };
export function seed(): DemoState {
    const users: DemoUser[] = [
        { id: 'user-a', name: 'Nguyễn Minh Anh', email: 'a@spendwise.demo', phone: '0900000001', password: 'Demo@12345', pin: '123456', role: 'User', status: 'Active', theme: 'light', language: 'vi-VN', verified: true, sessionVersion: 0 },
        { id: 'user-b', name: 'Trần Gia Bảo', email: 'b@spendwise.demo', phone: '0900000002', password: 'Demo@12345', pin: '123456', role: 'User', status: 'Active', theme: 'light', language: 'vi-VN', verified: true, sessionVersion: 0 },
        { id: 'admin', name: 'Lê Hoàng · Admin', email: 'admin@spendwise.demo', phone: '0900000000', password: 'Demo@12345', pin: '123456', role: 'SystemAdmin', status: 'Active', theme: 'light', language: 'vi-VN', verified: true, sessionVersion: 0 },
    ];
    const member = (userId: string, contributed: number): Member => ({ userId, episode: id(), contributed, active: true, canSpend: userId === 'user-a' });
    const s: DemoState = { version: 1, users, wallets: [{ id: 'wallet-a', userId: 'user-a', name: 'Ví chi tiêu', balance: 14250000, type: 'spending' }, { id: 'savings-a', userId: 'user-a', name: 'Quỹ dự phòng', balance: 6000000, type: 'savings' }, { id: 'wallet-b', userId: 'user-b', name: 'Ví của Bảo', balance: 8250000, type: 'spending' }], entries: [], funds: [{ id: 'fixed', name: 'Đà Lạt cùng nhau', kind: 'Fixed', ownerId: 'user-a', balance: 3000000, target: 6000000, status: 'Active', members: [member('user-a', 1500000), member('user-b', 1500000)], history: [], requests: [] }, { id: 'free', name: 'Nhà mình · Chi tiêu chung', kind: 'Free', ownerId: 'user-a', balance: 1800000, target: 0, status: 'Active', members: [member('user-a', 900000), member('user-b', 900000)], history: [], requests: [] }], items: [{ id: 'budget-food', userId: 'user-a', kind: 'budget', name: 'Ăn uống & Cà phê', amount: 5000000, current: 3200000, status: 'Active', date: now() }, { id: 'goal-trip', userId: 'user-a', kind: 'goal', name: 'Một chuyến đi xa', amount: 10000000, current: 0, status: 'Active', date: now() }, { id: 'recurring-rent', userId: 'user-a', kind: 'recurring', name: 'Tiền thuê nhà', amount: 3500000, current: 0, status: 'Active', date: now() }, { id: 'category-food', userId: 'user-a', kind: 'category', name: 'Ăn uống', amount: 0, current: 0, status: 'Active', date: now() }], friends: [], invitations: [], tickets: [{ id: 'case-a', userId: 'user-a', title: 'Kiểm tra giao dịch đang xử lý', status: 'InProgress', assignedTo: 'admin', messages: [{ author: 'user-a', text: 'Nhờ kiểm tra trạng thái giao dịch demo của tôi.', date: now() }], evidence: [] }, { id: 'case-b', userId: 'user-b', title: 'Cập nhật bảo mật tài khoản', status: 'New', messages: [{ author: 'user-b', text: 'Tôi cần hỗ trợ quản lý phiên đăng nhập.', date: now() }], evidence: [] }], notices: [{ id: 'welcome-a', userId: 'user-a', title: 'Chào mừng đến SpendWise', text: 'Không gian tài chính của bạn đã sẵn sàng. Đây là dữ liệu mô phỏng.', read: false, date: now() }], banks: [{ id: 'bank-a', userId: 'user-a', name: 'Ngân hàng Demo · •• 0123', balance: 20000000, linked: true }, { id: 'bank-b', userId: 'user-b', name: 'Ngân hàng Demo · •• 0456', balance: 10000000, linked: true }], pending: [], broadcasts: [], maintenance: { enabled: false, title: 'Bảo trì định kỳ', start: now(), end: new Date(Date.now() + 3600000).toISOString() }, audit: [], receipts: {}, external: 0, seedTotal: 0 };
    s.entries = [{ id: 'sample-1', userId: 'user-a', walletId: 'wallet-a', title: 'Cà phê cùng bạn', amount: -65000, status: 'Completed', date: now(), reference: 'DEMO-001', category: 'Ăn uống' }, { id: 'sample-2', userId: 'user-a', walletId: 'wallet-a', title: 'Thu nhập tháng 10', amount: 18000000, status: 'Completed', date: new Date(Date.now() - 86400000).toISOString(), reference: 'DEMO-002', category: 'Thu nhập' }];
    s.seedTotal = total(s);
    return s;
}
export function total(s: DemoState) { return s.wallets.reduce((n, w) => n + w.balance, 0) + s.funds.reduce((n, f) => n + f.balance, 0) + s.banks.reduce((n, b) => n + b.balance, 0) + s.pending.filter(p => p.status === 'Pending').reduce((n, p) => n + p.amount, 0) + s.items.filter(i => i.kind === 'goal').reduce((n, i) => n + i.current, 0) + s.external; }
export function assertState(s: DemoState) {
    requireThat(s.version === 1 && Array.isArray(s.users), 'Invalid demo data');
    for (const n of [...s.wallets.map(w => w.balance), ...s.funds.map(f => f.balance), ...s.banks.map(b => b.balance), ...s.items.filter(i => i.kind === 'goal').map(i => i.current)])
        requireThat(Number.isSafeInteger(n) && n >= 0, 'Số dư không hợp lệ / Invalid balance');
    requireThat(total(s) === s.seedTotal, 'Bảo toàn tiền thất bại / Money conservation failed');
}
export function execute(source: DemoState, actorId: string, c: Command): {
    state: DemoState;
    value: unknown;
} {
    const s = structuredClone(source), actor = s.users.find(u => u.id === actorId);
    requireThat(actor && actor.status !== 'Locked', 'Tài khoản đã khóa / Account locked');
    const key = text(c, 'key'), fingerprint = JSON.stringify({ ...c, key: undefined });
    if (key && s.receipts[key]) {
        const r = s.receipts[key];
        requireThat(r.actor === actorId && r.fingerprint === fingerprint, 'Khóa giao dịch trùng / Conflicting idempotency key');
        return { state: source, value: r.value };
    }
    let value: unknown = { status: 'Completed', id: id() };
    const notify = (userId: string, title: string, body: string) => s.notices.unshift({ id: id(), userId, title, text: body, read: false, date: now() });
    const pin = () => requireThat(text(c, 'pin') === actor.pin, 'Mã PIN không đúng / Incorrect PIN (demo: 123456)');
    const debitGuard = () => { requireThat(actor.role === 'User' && actor.status === 'Active', 'Tài khoản bị hạn chế giao dịch / Outbound finance is restricted'); requireThat(!s.maintenance.enabled, 'Hệ thống đang bảo trì / Maintenance is active'); pin(); requireThat(key, 'Thiếu mã giao dịch / Missing idempotency key'); };
    const wallet = (walletId: string, own = true) => { const w = s.wallets.find(w => w.id === walletId); requireThat(w && (!own || w.userId === actor.id), 'Không tìm thấy ví / Wallet unavailable'); return w; };
    const entry = (w: Wallet, n: number, title: string, status = 'Completed') => { const e = { id: id(), userId: w.userId, walletId: w.id, title, amount: n, status, date: now(), reference: key || id(), category: text(c, 'category') || 'Khác' }; s.entries.unshift(e); return e; };
    const fund = () => { const f = s.funds.find(f => f.id === text(c, 'fundId')); requireThat(f && f.status === 'Active', 'Quỹ không hoạt động / Fund unavailable'); return f; };
    const member = (f: Fund) => { const m = f.members.find(m => m.userId === actor.id && m.active); requireThat(m, 'Bạn không là thành viên / Membership required'); return m; };
    const owner = (f: Fund) => requireThat(f.ownerId === actor.id, 'Chỉ chủ quỹ được thao tác / Owner only');
    const finance = (f: Fund) => requireThat(!f.election || ['Failed', 'Completed'].includes(f.election.phase), 'Tài chính bị đóng băng trong bầu cử / Finance frozen during election');
    const history = (f: Fund, t: string, n = 0) => f.history.unshift({ id: id(), text: t, amount: n, date: now() });
    const admin = () => requireThat(actor.role === 'SystemAdmin', 'Chỉ Admin / Admin only');
    switch (c.type) {
        case 'wallet.create': {
            requireThat(actor.role === 'User', 'User only');
            const name = text(c, 'name');
            requireThat(name.length >= 2 && name.length <= 60, 'Tên ví từ 2–60 ký tự / Wallet name: 2–60 characters');
            const w = { id: id(), userId: actor.id, name, balance: 0, type: text(c, 'walletType') || 'spending' };
            s.wallets.push(w);
            value = w;
            break;
        }
        case 'wallet.rename': {
            const w = wallet(text(c, 'walletId'));
            requireThat(text(c, 'name').length >= 2, 'Tên không hợp lệ / Invalid name');
            w.name = text(c, 'name');
            break;
        }
        case 'wallet.close': {
            const w = wallet(text(c, 'walletId'));
            pin();
            requireThat(w.balance === 0, 'Chỉ đóng ví số dư 0 / Only empty wallets can close');
            requireThat(s.wallets.filter(w => w.userId === actor.id).length > 1, 'Phải giữ ít nhất một ví / Keep at least one wallet');
            s.wallets = s.wallets.filter(x => x.id !== w.id);
            break;
        }
        case 'transfer':
        case 'internal': {
            debitGuard();
            const n = amount(c), from = wallet(text(c, 'walletId')), to = c.type === 'internal' ? wallet(text(c, 'destinationId')) : s.wallets.find(w => w.userId === text(c, 'recipientId'));
            requireThat(to && from.id !== to.id && (c.type === 'internal' || to.userId !== actor.id), 'Người nhận không hợp lệ / Invalid recipient');
            const recipient = s.users.find(u => u.id === to.userId);
            requireThat(recipient && recipient.status !== 'Locked', 'Người nhận không khả dụng / Recipient unavailable');
            requireThat(from.balance >= n, 'Số dư không đủ / Insufficient balance');
            from.balance -= n;
            to.balance += n;
            value = entry(from, -n, text(c, 'note') || 'Chuyển tiền');
            entry(to, n, 'Nhận từ ' + actor.name);
            notify(to.userId, 'Nhận tiền / Money received', actor.name + ' · ' + n.toLocaleString('vi-VN') + ' ₫');
            break;
        }
        case 'transaction.create': {
            debitGuard();
            const w = wallet(text(c, 'walletId')), n = amount(c), income = text(c, 'kind') === 'income';
            requireThat(income || w.balance >= n, 'Số dư không đủ / Insufficient balance');
            w.balance += income ? n : -n;
            s.external += income ? -n : n;
            value = entry(w, income ? n : -n, text(c, 'name') || 'Thu chi cá nhân');
            if (!income)
                for (const b of s.items.filter(i => i.userId === actor.id && i.kind === 'budget' && i.name === text(c, 'category')))
                    b.current += n;
            break;
        }
        case 'friend.invite': {
            const to = text(c, 'userId');
            requireThat(to !== actor.id && s.users.some(u => u.id === to && u.role === 'User'), 'Người nhận không hợp lệ / Invalid user');
            requireThat(!s.friends.some(f => [f.from, f.to].includes(actor.id) && [f.from, f.to].includes(to) && ['Pending', 'Accepted'].includes(f.status)), 'Đã có kết nối/lời mời / Already connected or invited');
            s.friends.push({ id: id(), from: actor.id, to, status: 'Pending' });
            notify(to, 'Lời mời kết bạn / Friend request', actor.name);
            break;
        }
        case 'friend.respond': {
            const f = s.friends.find(f => f.id === text(c, 'id'));
            requireThat(f && f.status === 'Pending' && f.to === actor.id, 'Lời mời không hợp lệ / Invitation unavailable');
            f.status = text(c, 'decision') === 'accept' ? 'Accepted' : 'Rejected';
            break;
        }
        case 'friend.remove': {
            const f = s.friends.find(f => f.id === text(c, 'id'));
            requireThat(f && [f.from, f.to].includes(actor.id), 'Không có quyền / Access denied');
            f.status = 'Cancelled';
            break;
        }
        case 'fund.create': {
            debitGuard();
            requireThat(s.funds.filter(f => f.status === 'Active' && f.members.some(m => m.active && m.userId === actor.id)).length < 10, 'Tối đa 10 quỹ / Maximum 10 funds');
            requireThat(text(c, 'name').length >= 2, 'Tên quỹ không hợp lệ / Invalid fund name');
            const kind = text(c, 'kind');
            requireThat(kind === 'Fixed' || kind === 'Free', 'Loại quỹ không hợp lệ / Invalid fund kind');
            const f: Fund = { id: id(), name: text(c, 'name'), kind, ownerId: actor.id, balance: 0, target: kind === 'Fixed' ? amount(c, 'target') : 0, status: 'Active', members: [{ userId: actor.id, episode: id(), contributed: 0, active: true, canSpend: true }], history: [], requests: [] };
            s.funds.unshift(f);
            value = f;
            break;
        }
        case 'fund.invite': {
            const f = fund();
            owner(f);
            finance(f);
            const to = text(c, 'userId');
            requireThat(s.users.some(u => u.id === to && u.role === 'User') && !f.members.some(m => m.userId === to && m.active), 'Thành viên không hợp lệ / Invalid member');
            requireThat(!s.invitations.some(i => i.fundId === f.id && i.to === to && i.status === 'Pending'), 'Đã có lời mời / Already invited');
            s.invitations.push({ id: id(), fundId: f.id, from: actor.id, to, status: 'Pending' });
            notify(to, 'Lời mời nhóm / Fund invitation', f.name);
            break;
        }
        case 'fund.join': {
            const i = s.invitations.find(i => i.id === text(c, 'id') && i.to === actor.id && i.status === 'Pending');
            requireThat(i, 'Lời mời không hợp lệ / Invitation unavailable');
            const f = s.funds.find(f => f.id === i.fundId);
            requireThat(f && f.status === 'Active', 'Fund unavailable');
            finance(f);
            requireThat(!f.members.some(m => m.active && m.userId === actor.id), 'Already a member');
            requireThat(f.members.filter(m => m.active).length < (f.kind === 'Fixed' ? 30 : 6), 'Quỹ đã đủ thành viên / Fund full');
            requireThat(s.funds.filter(f => f.status === 'Active' && f.members.some(m => m.active && m.userId === actor.id)).length < 10, 'Maximum 10 funds');
            i.status = 'Accepted';
            f.members.push({ userId: actor.id, episode: id(), contributed: 0, active: true, canSpend: false });
            history(f, actor.name + ' đã tham gia / joined');
            break;
        }
        case 'fund.contribute': {
            debitGuard();
            const f = fund(), m = member(f);
            finance(f);
            const n = amount(c), w = wallet(text(c, 'walletId'));
            requireThat(w.balance >= n, 'Số dư không đủ / Insufficient balance');
            if (f.kind === 'Fixed') {
                const count = f.members.filter(m => m.active).length;
                const due = Math.floor(f.target / count) + (f.members.filter(m => m.active).findIndex(x => x.episode === m.episode) < f.target % count ? 1 : 0);
                requireThat(n <= Math.max(0, due - m.contributed), 'Vượt nghĩa vụ đóng góp / Exceeds fixed obligation');
            }
            w.balance -= n;
            f.balance += n;
            m.contributed += n;
            entry(w, -n, 'Góp quỹ · ' + f.name);
            history(f, actor.name + ' góp quỹ / contributed', n);
            break;
        }
        case 'fund.request': {
            debitGuard();
            const f = fund(), m = member(f);
            finance(f);
            const n = amount(c);
            requireThat(n <= f.balance - f.requests.filter(r => ['Pending', 'Pending24h', 'Suspended'].includes(r.status)).reduce((a, r) => a + r.amount, 0), 'Quỹ không đủ số dư khả dụng / Insufficient available fund balance');
            const recipientId = text(c, 'recipientId') || actor.id;
            requireThat(s.wallets.some(w => w.userId === recipientId), 'Người nhận không có ví / Recipient needs a wallet');
            const kind = text(c, 'kind') || 'Expense';
            requireThat(['Expense', 'Withdrawal'].includes(kind), 'Invalid request kind');
            requireThat(kind !== 'Withdrawal' || (f.kind === 'Free' && recipientId === actor.id && n <= refund(f, actor.id)), 'Không đủ quyền rút / Withdrawal exceeds entitlement');
            requireThat(kind === 'Withdrawal' || f.kind === 'Free' || actor.id === f.ownerId || m.canSpend, 'Không có quyền chi tiêu / Spending permission required');
            const r = { id: id(), userId: actor.id, recipientId, amount: n, reason: text(c, 'reason'), status: f.kind === 'Fixed' ? 'Pending24h' : 'Pending', episode: m.episode, kind };
            f.requests.push(r);
            history(f, 'Yêu cầu / Request: ' + r.reason);
            value = r;
            break;
        }
        case 'fund.review': {
            debitGuard();
            const f = fund();
            owner(f);
            finance(f);
            const r = f.requests.find(r => r.id === text(c, 'id'));
            requireThat(r && r.status === 'Pending', 'Chưa thể duyệt / Request unavailable for review');
            const m = f.members.find(m => m.userId === r.userId && m.active);
            requireThat(m?.episode === r.episode, 'Membership đã thay đổi / Membership episode changed');
            if (text(c, 'decision') === 'reject') {
                r.status = 'Rejected';
                break;
            }
            requireThat(f.balance >= r.amount, 'Insufficient fund balance');
            const w = s.wallets.find(w => w.userId === r.recipientId);
            requireThat(w, 'Wallet unavailable');
            f.balance -= r.amount;
            w.balance += r.amount;
            r.status = 'Completed';
            if (r.kind === 'Withdrawal')
                m.contributed = Math.max(0, m.contributed - r.amount);
            entry(w, r.amount, 'Chi quỹ · ' + f.name);
            history(f, r.reason, -r.amount);
            break;
        }
        case 'fund.report': {
            const f = fund();
            member(f);
            const r = f.requests.find(r => r.id === text(c, 'id'));
            requireThat(r && r.status === 'Pending24h', 'Chỉ báo cáo khoản đang chờ 24h / Pending24h request required');
            r.status = 'Suspended';
            s.tickets.unshift({ id: id(), userId: actor.id, title: 'Tranh chấp · ' + r.reason, status: 'New', messages: [{ author: actor.id, text: text(c, 'reason'), date: now() }], evidence: [], fundId: f.id, requestId: r.id });
            break;
        }
        case 'fund.leave': {
            pin();
            const f = fund(), m = member(f);
            finance(f);
            requireThat(f.ownerId !== actor.id, 'Chuyển chủ trước khi rời / Transfer ownership before leaving');
            requireThat(!f.requests.some(r => ['Pending', 'Pending24h', 'Suspended'].includes(r.status)), 'Có yêu cầu chưa xử lý / Pending requests block refund');
            const n = refund(f, actor.id), w = s.wallets.find(w => w.userId === actor.id);
            requireThat(w, 'Wallet unavailable');
            f.balance -= n;
            w.balance += n;
            m.active = false;
            history(f, actor.name + ' rời nhóm / left', -n);
            entry(w, n, 'Hoàn quỹ · ' + f.name);
            break;
        }
        case 'fund.dissolve': {
            pin();
            const f = fund();
            owner(f);
            finance(f);
            requireThat(!f.requests.some(r => ['Pending', 'Pending24h', 'Suspended'].includes(r.status)), 'Pending requests block dissolution');
            const active = f.members.filter(m => m.active && m.contributed > 0);
            let rest = f.balance;
            const original = f.balance;
            const contributionTotal = active.reduce((n, m) => n + m.contributed, 0);
            active.forEach((m, index) => { const n = index === active.length - 1 ? rest : Math.floor(original * m.contributed / contributionTotal); const w = s.wallets.find(w => w.userId === m.userId); requireThat(w, 'Wallet unavailable'); w.balance += n; rest -= n; entry(w, n, 'Giải tán quỹ · ' + f.name); });
            requireThat(rest === 0, 'Quỹ không có người đủ quyền hoàn tiền / No eligible refund recipients');
            f.balance = 0;
            f.status = 'Dissolved';
            history(f, 'Đã giải tán / Dissolved');
            break;
        }
        case 'fund.owner': {
            pin();
            const f = fund();
            owner(f);
            finance(f);
            const target = text(c, 'userId');
            requireThat(f.members.some(m => m.active && m.userId === target) && target !== actor.id, 'Chủ mới phải là thành viên / New owner must be an active member');
            s.invitations.push({ id: id(), fundId: f.id, from: actor.id, to: target, status: 'OwnershipOffer' });
            break;
        }
        case 'fund.owner.accept': {
            pin();
            const i = s.invitations.find(i => i.id === text(c, 'id') && i.to === actor.id && i.status === 'OwnershipOffer');
            requireThat(i, 'Ownership offer unavailable');
            const f = s.funds.find(f => f.id === i.fundId);
            requireThat(f, 'Fund unavailable');
            finance(f);
            member(f);
            f.ownerId = actor.id;
            i.status = 'Accepted';
            history(f, 'Chủ mới / New owner: ' + actor.name);
            break;
        }
        case 'fund.permission': {
            pin();
            const f = fund();
            owner(f);
            finance(f);
            const m = f.members.find(m => m.active && m.userId === text(c, 'userId'));
            requireThat(m, 'Member unavailable');
            m.canSpend = !m.canSpend;
            break;
        }
        case 'election.open': {
            pin();
            const f = fund();
            member(f);
            requireThat(!f.election || ['Failed', 'Completed'].includes(f.election.phase), 'Election active');
            requireThat(f.ownerId === actor.id, 'Demo chỉ cho chủ tự mở bầu cử / Demo owner can open election');
            f.election = { phase: 'Nomination', deadline: new Date(Date.now() + 86400000).toISOString(), candidates: [], ballots: {} };
            break;
        }
        case 'election.nominate': {
            pin();
            const f = fund();
            member(f);
            requireThat(f.election?.phase === 'Nomination', 'Nomination closed');
            if (!f.election.candidates.includes(actor.id))
                f.election.candidates.push(actor.id);
            break;
        }
        case 'election.vote': {
            pin();
            const f = fund();
            member(f);
            requireThat(f.election?.phase === 'Voting' && f.election.candidates.includes(text(c, 'userId')), 'Invalid ballot');
            requireThat(!f.election.ballots[actor.id], 'Bạn đã bỏ phiếu / Already voted');
            f.election.ballots[actor.id] = text(c, 'userId');
            break;
        }
        case 'election.advance': {
            const f = fund();
            owner(f);
            const e = f.election;
            requireThat(e, 'No election');
            requireThat(Date.parse(e.deadline) <= Date.now(), 'Chưa hết hạn bầu cử / Deadline has not elapsed');
            if (e.phase === 'Nomination') {
                e.phase = e.candidates.length ? 'Voting' : 'Failed';
                e.deadline = new Date(Date.now() + 172800000).toISOString();
            }
            else if (e.phase === 'Voting') {
                const counts = e.candidates.map(u => ({ u, n: Object.values(e.ballots).filter(x => x === u).length })).sort((a, b) => b.n - a.n);
                if (!counts.length || !counts[0].n || counts[0].n === counts[1]?.n)
                    e.phase = 'Failed';
                else {
                    e.winner = counts[0].u;
                    e.phase = 'Acceptance';
                    e.deadline = new Date(Date.now() + 86400000).toISOString();
                }
            }
            break;
        }
        case 'election.accept':
        case 'election.reject': {
            pin();
            const f = fund(), e = f.election;
            requireThat(e?.phase === 'Acceptance' && e.winner === actor.id, 'Only elected winner');
            if (c.type === 'election.accept') {
                f.ownerId = actor.id;
                e.phase = 'Completed';
            }
            else
                e.phase = 'Failed';
            break;
        }
        case 'item.save': {
            const kind = text(c, 'kind');
            requireThat(['budget', 'goal', 'recurring', 'category', 'rule'].includes(kind), 'Invalid item');
            const existing = s.items.find(i => i.id === text(c, 'id') && i.userId === actor.id);
            requireThat(text(c, 'name').length >= 2, 'Tên tối thiểu 2 ký tự / Name is too short');
            const n = ['category', 'rule'].includes(kind) ? 0 : amount(c);
            if (existing) {
                existing.name = text(c, 'name');
                existing.amount = n;
            }
            else
                s.items.push({ id: id(), userId: actor.id, kind, name: text(c, 'name'), amount: n, current: 0, status: 'Active', date: text(c, 'date') || now() });
            break;
        }
        case 'item.delete': {
            const i = s.items.find(i => i.id === text(c, 'id') && i.userId === actor.id);
            requireThat(i, 'Item unavailable');
            requireThat(i.kind !== 'goal' || i.current === 0, 'Rút tiền mục tiêu trước khi xóa / Withdraw goal allocation first');
            s.items = s.items.filter(x => x.id !== i.id);
            break;
        }
        case 'item.toggle': {
            const i = s.items.find(i => i.id === text(c, 'id') && i.userId === actor.id);
            requireThat(i, 'Item unavailable');
            i.status = i.status === 'Active' ? 'Paused' : 'Active';
            break;
        }
        case 'goal.move': {
            debitGuard();
            const i = s.items.find(i => i.id === text(c, 'id') && i.userId === actor.id && i.kind === 'goal');
            requireThat(i, 'Goal unavailable');
            const n = amount(c), w = wallet(text(c, 'walletId')), out = text(c, 'direction') === 'withdraw';
            requireThat(out ? i.current >= n : w.balance >= n, 'Số dư không đủ / Insufficient funds');
            w.balance += out ? n : -n;
            i.current += out ? -n : n;
            entry(w, out ? n : -n, 'Mục tiêu · ' + i.name);
            break;
        }
        case 'recurring.pay': {
            debitGuard();
            const i = s.items.find(i => i.id === text(c, 'id') && i.userId === actor.id && i.kind === 'recurring');
            requireThat(i && i.status === 'Active', 'Recurring unavailable');
            const month = now().slice(0, 7);
            requireThat(!s.entries.some(e => e.userId === actor.id && e.category === i.id && e.date.startsWith(month)), 'Đã ghi kỳ này / Occurrence already recorded');
            const w = wallet(text(c, 'walletId'));
            requireThat(w.balance >= i.amount, 'Insufficient balance');
            w.balance -= i.amount;
            s.external += i.amount;
            const e = entry(w, -i.amount, i.name);
            e.category = i.id;
            break;
        }
        case 'bank.link': {
            requireThat(text(c, 'name').length >= 2, 'Invalid bank name');
            s.banks.push({ id: id(), userId: actor.id, name: text(c, 'name') + ' · DEMO', balance: 0, linked: true });
            break;
        }
        case 'bank.unlink': {
            const b = s.banks.find(b => b.id === text(c, 'id') && b.userId === actor.id);
            requireThat(b, 'Bank unavailable');
            pin();
            b.linked = false;
            break;
        }
        case 'bank.topup': {
            debitGuard();
            const b = s.banks.find(b => b.id === text(c, 'bankId') && b.userId === actor.id && b.linked), w = wallet(text(c, 'walletId')), n = amount(c);
            requireThat(b && b.balance >= n, 'Ngân hàng Demo không đủ tiền / Insufficient demo bank balance');
            b.balance -= n;
            w.balance += n;
            entry(w, n, 'Nạp tiền · ' + b.name);
            break;
        }
        case 'bank.withdraw': {
            debitGuard();
            const w = wallet(text(c, 'walletId')), n = amount(c);
            requireThat(w.balance >= n, 'Insufficient balance');
            requireThat(s.banks.some(b => b.userId === actor.id && b.linked), 'Link a bank first');
            w.balance -= n;
            const p = { id: id(), userId: actor.id, walletId: w.id, amount: n, status: 'Pending' };
            s.pending.push(p);
            value = p;
            entry(w, -n, 'Rút tiền · Chờ đối soát', 'Pending').reference = p.id;
            break;
        }
        case 'pending.review': {
            admin();
            pin();
            const p = s.pending.find(p => p.id === text(c, 'id') && p.status === 'Pending');
            requireThat(p, 'Pending request unavailable');
            const t = s.tickets.find(t => t.id === text(c, 'caseId') && t.userId === p.userId && t.assignedTo === actor.id && !['Resolved', 'Closed', 'Rejected'].includes(t.status));
            requireThat(t, 'Active assigned case required');
            requireThat(text(c, 'reason').length >= 5, 'Reason required');
            requireThat(['reverse', 'settle'].includes(text(c, 'decision')), 'Invalid reconciliation decision');
            if (text(c, 'decision') === 'reverse') {
                const w = s.wallets.find(w => w.id === p.walletId);
                requireThat(w, 'Wallet unavailable');
                w.balance += p.amount;
                entry(w, p.amount, 'Hoàn yêu cầu rút Demo');
                p.status = 'Cancelled';
            }
            else {
                const b = s.banks.find(b => b.userId === p.userId && b.linked);
                requireThat(b, 'Demo bank unavailable');
                b.balance += p.amount;
                p.status = 'Completed';
            }
            const original = s.entries.find(e => e.reference === p.id);
            if (original)
                original.status = p.status;
            value = p;
            break;
        }
        case 'ticket.create': {
            requireThat(text(c, 'title').length >= 3 && text(c, 'message').length >= 5, 'Cần tiêu đề và nội dung / Title and message required');
            const t: Ticket = { id: id(), userId: actor.id, title: text(c, 'title'), status: 'New', messages: [{ author: actor.id, text: text(c, 'message'), date: now() }], evidence: text(c, 'evidence') ? [text(c, 'evidence')] : [] };
            s.tickets.unshift(t);
            value = t;
            break;
        }
        case 'ticket.reply': {
            const t = s.tickets.find(t => t.id === text(c, 'id'));
            requireThat(t && (actor.role === 'SystemAdmin' ? t.assignedTo === actor.id : t.userId === actor.id), 'Không có quyền ticket / Case access denied');
            requireThat(!['Resolved', 'Closed', 'Rejected'].includes(t.status), 'Ticket đã đóng / Case closed');
            requireThat(text(c, 'message').length > 0, 'Empty message');
            t.messages.push({ author: actor.id, text: text(c, 'message'), date: now() });
            break;
        }
        case 'ticket.assign': {
            admin();
            const t = s.tickets.find(t => t.id === text(c, 'id'));
            requireThat(t && !['Resolved', 'Closed', 'Rejected'].includes(t.status), 'Case unavailable');
            t.assignedTo = actor.id;
            t.status = 'InProgress';
            break;
        }
        case 'ticket.resolve': {
            admin();
            pin();
            const t = s.tickets.find(t => t.id === text(c, 'id'));
            requireThat(t && t.assignedTo === actor.id && !['Resolved', 'Closed', 'Rejected'].includes(t.status), 'Active assigned case required');
            requireThat(text(c, 'reason').length >= 5, 'Lý do tối thiểu 5 ký tự / Reason required');
            t.messages.push({ author: actor.id, text: text(c, 'reason'), date: now() });
            t.status = 'Resolved';
            if (t.fundId) {
                const f = s.funds.find(f => f.id === t.fundId), r = f?.requests.find(r => r.id === t.requestId);
                if (r)
                    r.status = text(c, 'decision') === 'valid' ? 'Cancelled' : 'Pending24h';
            }
            notify(t.userId, 'Yêu cầu đã xử lý / Case resolved', t.title);
            break;
        }
        case 'admin.status': {
            admin();
            pin();
            const t = s.tickets.find(t => t.id === text(c, 'caseId') && t.userId === text(c, 'userId') && t.assignedTo === actor.id && !['Resolved', 'Rejected', 'Closed'].includes(t.status));
            requireThat(t, 'Cần ticket liên quan đang được phân công / Active assigned support case required');
            requireThat(text(c, 'reason').length >= 5, 'Lý do tối thiểu 5 ký tự / Reason required');
            const u = s.users.find(u => u.id === t.userId && u.role === 'User');
            requireThat(u, 'User unavailable');
            const status = text(c, 'status');
            requireThat(['Active', 'Restricted', 'Locked'].includes(status), 'Invalid status');
            u.status = status as DemoUser['status'];
            if (status === 'Locked')
                u.sessionVersion++;
            notify(u.id, 'Trạng thái tài khoản / Account status', status);
            break;
        }
        case 'admin.revoke': {
            admin();
            pin();
            const t = s.tickets.find(t => t.id === text(c, 'caseId') && t.assignedTo === actor.id && !['Resolved', 'Closed', 'Rejected'].includes(t.status));
            requireThat(t, 'Active assigned case required');
            const u = s.users.find(u => u.id === t.userId);
            requireThat(u, 'User unavailable');
            u.sessionVersion++;
            break;
        }
        case 'broadcast.save': {
            admin();
            requireThat(text(c, 'title') && text(c, 'message'), 'Title and message required');
            s.broadcasts.unshift({ id: id(), title: text(c, 'title'), text: text(c, 'message'), status: 'Draft', date: now() });
            break;
        }
        case 'broadcast.publish': {
            admin();
            pin();
            const b = s.broadcasts.find(b => b.id === text(c, 'id') && b.status === 'Draft');
            requireThat(b, 'Draft unavailable');
            b.status = 'Published';
            for (const u of s.users.filter(u => u.role === 'User'))
                notify(u.id, b.title, b.text);
            break;
        }
        case 'maintenance.save': {
            admin();
            pin();
            const start = Date.parse(text(c, 'start')), end = Date.parse(text(c, 'end'));
            requireThat(Number.isFinite(start) && Number.isFinite(end) && end > start, 'Khoảng thời gian không hợp lệ / Invalid schedule');
            s.maintenance = { ...s.maintenance, title: text(c, 'title'), start: new Date(start).toISOString(), end: new Date(end).toISOString() };
            break;
        }
        case 'maintenance.toggle': {
            admin();
            pin();
            if (s.maintenance.enabled)
                requireThat(!s.pending.some(p => p.status === 'Pending'), 'Còn giao dịch đối soát / Pending reconciliation blocks reopening');
            s.maintenance.enabled = !s.maintenance.enabled;
            break;
        }
        case 'notice.read': {
            for (const n of s.notices)
                if (n.userId === actor.id && (!text(c, 'id') || n.id === text(c, 'id')))
                    n.read = true;
            break;
        }
        case 'profile.save': {
            requireThat(text(c, 'name').length >= 2, 'Invalid name');
            actor.name = text(c, 'name');
            break;
        }
        case 'preferences': {
            const theme = text(c, 'theme'), language = text(c, 'language');
            requireThat(['light', 'dark', 'system'].includes(theme) && ['vi-VN', 'en-US'].includes(language), 'Invalid preferences');
            actor.theme = theme as DemoUser['theme'];
            actor.language = language as DemoUser['language'];
            break;
        }
        case 'pin.change': {
            pin();
            requireThat(/^\d{6}$/.test(text(c, 'newPin')) && text(c, 'newPin') === text(c, 'confirmPin'), 'PIN mới cần 6 số và xác nhận khớp / Confirm six-digit PIN');
            actor.pin = text(c, 'newPin');
            break;
        }
        default: throw new Error('Thao tác chưa được hỗ trợ / Unsupported demo command: ' + c.type);
    }
    s.audit.unshift({ id: id(), actor: actor.name, text: c.type + (text(c, 'reason') ? ' · ' + text(c, 'reason') : ''), date: now() });
    assertState(s);
    if (key)
        s.receipts[key] = { actor: actor.id, fingerprint, value };
    return { state: s, value };
}
export function refund(f: Fund, userId: string) { const m = f.members.find(m => m.userId === userId && m.active); if (!m || !m.contributed)
    return 0; const sum = f.members.filter(m => m.active).reduce((n, m) => n + m.contributed, 0); return Math.min(m.contributed, Math.floor(f.balance * m.contributed / sum)); }
