import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { ArrowRight, X, Clock3, Wallet, Sun, Moon, Laptop } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useI18n } from '../i18n/I18nContext';
import { useTheme } from '../providers/ThemeProvider';
import { demoApi } from './store';
import type { Command, DemoState, DemoUser } from './model';
export { Button };
export const money = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);
export const date = (s: string) => new Date(s).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
export type Field = {
    name: string;
    label: string;
    type?: string;
    value?: string;
    required?: boolean;
    options?: {
        value: string;
        label: string;
    }[];
};
export type FormSpec = {
    title: string;
    description?: string;
    command: Command;
    fields: Field[];
    destructive?: boolean;
};
export type Result = {
    status: 'success' | 'error' | 'pending';
    title: string;
    message: string;
    reference?: string;
    amount?: number;
    recipient?: string;
};
export type PageProps = {
    s: DemoState;
    u: DemoUser;
    open: (f: FormSpec) => void;
    result: (r: Result) => void;
};
export const pinField: Field = { name: 'pin', label: 'Security PIN · Demo: 123456', type: 'password' };
export function useCopy() { const { locale } = useI18n(); return (vi: string, en: string) => locale === 'vi-VN' ? vi : en; }
export function Badge({ children, tone = 'neutral' }: {
    children: ReactNode;
    tone?: string;
}) { return <span className={'d-badge ' + tone}>{children}</span>; }
export function Card({ children, className = '' }: {
    children: ReactNode;
    className?: string;
}) { return <section className={'d-card ' + className}>{children}</section>; }
export function Empty({ text }: {
    text: string;
}) { return <div className="d-empty"><Wallet size={30}/><p>{text}</p></div>; }
export function Heading({ title, action, onClick }: {
    title: string;
    action?: string;
    onClick?: () => void;
}) { return <div className="d-section-heading"><h2>{title}</h2>{action && <button className="d-text-button" onClick={onClick}>{action}<ArrowRight size={15}/></button>}</div>; }
export function Tools() { const { theme, setTheme } = useTheme(), { locale, setLocale } = useI18n(); return <div className="d-tools"><button onClick={() => setLocale(locale === 'vi-VN' ? 'en-US' : 'vi-VN')} aria-label="Language">{locale === 'vi-VN' ? 'VI' : 'EN'}</button><button aria-label={'Theme: ' + theme} onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')}>{theme === 'light' ? <Sun size={17}/> : theme === 'dark' ? <Moon size={17}/> : <Laptop size={17}/>}</button></div>; }
export function SimulationBadge() { const t = useCopy(); return <div className="d-simulation"><span />{t('DEMO · Không có giao dịch tiền thật', 'DEMO · No real-money transactions')}</div>; }
const Sk = ({ className = '' }: { className?: string }) => <i className={'sk-block ' + className}/>;
export function Skeleton({ kind = 'ai' }: { kind?: string }) {
    const lines = (count: number) => Array.from({ length: count }, (_, i) => <div className="sk-line-row" key={i}><Sk className="sk-avatar"/><div><Sk/><Sk className="sk-short"/></div><Sk className="sk-value"/></div>);
    const title = <div className="sk-title"><Sk/><Sk className="sk-short"/></div>;
    const filters = <div className="sk-filters"><Sk/><Sk/><Sk/></div>;
    const progress = <><Sk className="sk-amount"/><Sk className="sk-progress"/></>;
    const panel = (children: ReactNode) => <div className="sk-panel">{children}</div>;
    const chart = <div className="sk-chart">{[35,70,48,90,65,100,75].map((h,i)=><Sk key={i} className={'sk-bar sk-bar-'+h}/>)}</div>;
    const table = (cols: number) => <div className="sk-table" style={{'--sk-cols':cols} as CSSProperties}>{Array.from({length:5},(_,r)=><div className="sk-table-row" key={r}>{Array.from({length:cols},(_,c)=><div key={c}>{c===0&&r>0?<div className="sk-person"><Sk className="sk-avatar"/><Sk/></div>:<Sk/>}</div>)}</div>)}</div>;
    let content: ReactNode;
    switch(kind) {
      case 'home': content=<>{lines(1)}{panel(<>{title}{progress}<Sk className="sk-short"/></>)}<div className="sk-quick">{[0,1,2,3].map(i=><Sk key={i}/>)}</div>{panel(<>{title}{chart}</>)}{panel(<>{title}{lines(3)}</>)}</>;break;
      case 'wallet': content=<>{title}{[0,1].map(i=><div className="sk-panel" key={i}>{title}<Sk className="sk-amount"/>{filters}</div>)}{filters}{panel(<>{title}{lines(3)}</>)}</>;break;
      case 'friends': content=<>{title}<Sk className="sk-input"/>{filters}{panel(<>{lines(4)}</>)}</>;break;
      case 'groups': content=<>{title}{filters}{[0,1].map(i=><div className="sk-panel" key={i}>{lines(1)}{progress}{lines(1)}</div>)}</>;break;
      case 'fixed': content=<>{title}{panel(<>{title}{progress}{filters}</>)}{panel(<>{title}{lines(2)}</>)}{panel(<>{title}{lines(2)}</>)}{panel(<>{title}{lines(3)}</>)}</>;break;
      case 'free': content=<>{title}{panel(<>{title}<Sk className="sk-amount"/>{filters}</>)}{panel(<>{title}{lines(1)}{progress}</>)}{panel(<>{title}{lines(2)}{filters}</>)}{panel(<>{title}{lines(3)}</>)}</>;break;
      case 'history': content=<>{title}<Sk className="sk-input"/>{filters}{[0,1].map(i=><div className="sk-panel" key={i}><Sk className="sk-short"/>{lines(3)}</div>)}</>;break;
      case 'planning': content=<>{title}{filters}{[0,1,2].map(i=><div className="sk-panel" key={i}>{lines(1)}{progress}{filters}</div>)}</>;break;
      case 'notifications': content=<>{title}{filters}{[0,1,2].map(i=><div className="sk-panel" key={i}>{lines(1)}<Sk/><Sk className="sk-short"/></div>)}</>;break;
      case 'ai': content=<>{title}<div className="sk-chat"><Sk/><Sk/><Sk/><Sk/></div><Sk className="sk-input"/></>;break;
      case 'profile': case 'settings': content=<><div className="sk-profile"><Sk className="sk-avatar"/>{title}<Sk className="sk-short"/></div>{panel(<>{title}{lines(5)}</>)}{panel(<>{title}{lines(6)}</>)}</>;break;
      case 'password': content=<>{title}{panel(<>{[0,1,2].map(i=><div className="sk-field" key={i}><Sk className="sk-short"/><Sk className="sk-input"/></div>)}<Sk className="sk-input"/></>)}</>;break;
      case 'sessions': content=<>{title}{panel(<><Sk className="sk-avatar"/>{title}<Sk/><Sk/><Sk className="sk-input"/></>)}</>;break;
      case 'banks': content=<>{title}<Sk/>{panel(<><Sk className="sk-avatar"/>{title}<Sk className="sk-amount"/>{filters}</>)}{panel(<>{title}{lines(2)}</>)}</>;break;
      case 'reports': content=<>{title}{filters}{panel(<>{title}{progress}{chart}</>)}{panel(<>{title}{lines(3)}</>)}</>;break;
      case 'support': content=<>{title}{filters}{panel(<>{lines(3)}</>)}</>;break;
      case 'admin-users': content=<>{title}{panel(<>{filters}{table(5)}{filters}</>)}</>;break;
      case 'admin-support': content=<>{title}{filters}<div className="sk-support">{panel(<>{title}{lines(4)}</>)}{panel(<>{title}<div className="sk-chat"><Sk/><Sk/><Sk/></div>{filters}</>)}{panel(<>{title}{lines(2)}{filters}</>)}</div></>;break;
      case 'admin-notifications': content=<>{title}<div className="sk-kpis">{[0,1,2].map(i=><div className="sk-panel" key={i}>{title}<Sk className="sk-amount"/></div>)}</div>{panel(<>{filters}{table(4)}</>)}</>;break;
      case 'admin-maintenance': content=<>{title}<div className="sk-columns">{panel(<>{title}{progress}{filters}</>)}{panel(<>{title}{lines(3)}</>)}</div>{panel(<>{title}{table(3)}</>)}{panel(<>{title}{lines(2)}</>)}</>;break;
      default: content=<>{title}<div className="sk-kpis">{[0,1,2,3].map(i=><div className="sk-panel" key={i}>{title}<Sk className="sk-amount"/><Sk/></div>)}</div><div className="sk-columns">{panel(<>{title}{chart}</>)}{panel(<>{title}{lines(3)}</>)}</div><div className="sk-columns">{panel(<>{title}{lines(3)}</>)}{panel(<>{title}{lines(3)}</>)}</div></>;
    }
    return <div className={'d-skeleton sk-layout sk-'+kind} data-skeleton={kind} role="status" aria-label="Đang tải / Loading">{content}</div>;
}
export function Dialog({ title, children, onClose, bottom = false }: {
    title: string;
    children: ReactNode;
    onClose: () => void;
    bottom?: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null), close = useRef(onClose);
    close.current = onClose;
    useEffect(() => { const previous = document.activeElement as HTMLElement; const content = ref.current; const controls = () => Array.from(content?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select,textarea,[tabindex="0"]') ?? []); controls()[0]?.focus(); const key = (e: KeyboardEvent) => { if (content?.closest('[inert]'))
        return; if (e.key === 'Escape') {
        e.stopPropagation();
        close.current();
    } if (e.key === 'Tab') {
        const f = controls(), first = f[0], last = f.at(-1);
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
        }
        else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
        }
    } }; document.addEventListener('keydown', key); return () => { document.removeEventListener('keydown', key); previous?.focus(); }; }, []);
    return <div className={'d-overlay ' + (bottom ? 'bottom' : '')} onClick={e => { if (e.target === e.currentTarget)
        onClose(); }}><div ref={ref} className="d-dialog" role="dialog" aria-modal="true" aria-label={title}><div className="d-dialog-title"><h2>{title}</h2><button className="d-icon-button" aria-label="Đóng / Close" onClick={onClose}><X size={20}/></button></div>{children}</div></div>;
}
export function ResultDialog({ result, onClose }: {
    result: Result;
    onClose: () => void;
}) { const t = useCopy(); return <Dialog title={t('Kết quả', 'Result')} onClose={onClose}><div className={'d-result ' + result.status}><div className="d-result-icon">{result.status === 'pending' ? <Clock3 size={46}/> : <svg viewBox="0 0 200 200" fill="none" aria-hidden="true">{result.status === 'success' ? <path d="M 58 100 L 88 130 L 145 70" className="animate-spendwise-check" pathLength="40"/> : <><path d="M 65 65 L 135 135" className="animate-spendwise-cross-1" pathLength="35"/><path d="M 135 65 L 65 135" className="animate-spendwise-cross-2" pathLength="35"/></>}</svg>}</div><Badge tone={result.status}>DEMO</Badge><h3>{result.title}</h3><p>{result.message}</p>{result.amount !== undefined && <strong className="d-result-amount">{money(result.amount)}</strong>}{result.recipient && <p>{result.recipient}</p>}<small>{date(new Date().toISOString())}</small>{result.reference && <small>#{result.reference.slice(0, 18)}</small>}<SimulationBadge /><Button className="d-full" size="lg" onClick={onClose}>{result.status === 'error' ? t('Quay lại / Thử lại', 'Back / Try again') : t('Hoàn tất', 'Done')}</Button></div></Dialog>; }
export function ActionForm({ spec, actor, onClose, onResult }: {
    spec: FormSpec;
    actor: DemoUser;
    onClose: () => void;
    onResult: (r: Result) => void;
}) {
    const t = useCopy(), [busy, setBusy] = useState(false), [error, setError] = useState(''), guard = useRef(false), key = useRef(crypto.randomUUID());
    return <Dialog title={spec.title} bottom onClose={() => { if (!guard.current)
        onClose(); }}><form className="d-form" onSubmit={async (e) => { e.preventDefault(); if (guard.current)
        return; guard.current = true; setBusy(true); setError(''); const values = Object.fromEntries(new FormData(e.currentTarget)); const recipient = e.currentTarget.querySelector<HTMLSelectElement>('select[name="recipientId"]')?.selectedOptions[0]?.textContent ?? undefined; try {
        const v = await demoApi.command(actor.id, { ...spec.command, ...values, key: key.current }) as {
            status?: string;
            id?: string;
        };
        onClose();
        const pending = v?.status?.startsWith('Pending');
        onResult({ status: pending ? 'pending' : 'success', title: pending ? t('Đang chờ xử lý', 'Awaiting processing') : t('Thao tác thành công', 'Action completed'), message: pending ? t('Yêu cầu được lưu và chưa được đánh dấu hoàn tất.', 'Request saved. It has not been marked completed.') : spec.title, reference: v?.id || key.current, amount: values.amount ? Number(values.amount) : undefined, recipient });
    }
    catch (e) {
        const message = e instanceof Error ? e.message : 'Demo error';
        setError(message);
        onResult({ status: 'error', title: t('Chưa thể thực hiện', 'Unable to complete'), message });
    }
    finally {
        guard.current = false;
        setBusy(false);
    } }}>{spec.description && <p className="d-muted">{spec.description}</p>}{error && <p role="alert" className="d-error">{error}</p>}{spec.fields.map(f => <label key={f.name}><span>{f.label}</span>{f.options ? <select aria-label={f.label} name={f.name} defaultValue={f.value ?? f.options[0]?.value} required={f.required !== false}>{f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select> : f.type === 'textarea' ? <textarea aria-label={f.label} name={f.name} rows={3} defaultValue={f.value} required={f.required !== false}/> : <input aria-label={f.label} name={f.name} type={f.type ?? 'text'} defaultValue={f.value} required={f.required !== false} inputMode={f.type === 'number' || f.name.toLowerCase().includes('pin') ? 'numeric' : undefined} min={f.type === 'number' ? 1 : undefined} step={f.type === 'number' ? 1 : undefined} maxLength={f.name.toLowerCase().includes('pin') ? 6 : 160}/>}</label>)}{spec.destructive && <label className="d-confirm"><input type="checkbox" required/>{t('Tôi xác nhận thao tác trên dữ liệu Demo.', 'I confirm this action on demo data.')}</label>}<Button type="submit" size="lg" variant={spec.destructive ? 'danger' : 'primary'} isLoading={busy} className="d-full">{busy ? t('Đang lưu…', 'Saving…') : t('Xác nhận', 'Confirm')}</Button><Button type="button" variant="ghost" className="d-full" disabled={busy} onClick={onClose}>{t('Hủy', 'Cancel')}</Button></form></Dialog>;
}
export function useForms(p: PageProps) {
    const { s, u, open } = p, t = useCopy();
    const walletField: Field = { name: 'walletId', label: t('Ví nguồn', 'Source wallet'), options: s.wallets.filter(w => w.userId === u.id).map(w => ({ value: w.id, label: w.name + ' · ' + money(w.balance) })) };
    const amountField: Field = { name: 'amount', label: t('Số tiền (VND)', 'Amount (VND)'), type: 'number' };
    return { walletField, amountField, transfer: (recipientId?: string) => open({ title: t('Chuyển tiền', 'Send money'), description: t('Kiểm tra người nhận, ví và số tiền trước khi nhập PIN Demo.', 'Review recipient, wallet and amount before entering your demo PIN.'), command: { type: 'transfer' }, fields: [{ name: 'recipientId', label: t('Người nhận', 'Recipient'), value: recipientId, options: s.users.filter(x => x.role === 'User' && x.id !== u.id).map(x => ({ value: x.id, label: x.name })) }, walletField, amountField, { name: 'note', label: t('Lời nhắn', 'Message'), required: false }, pinField] }), createWallet: () => open({ title: t('Tạo ví mới', 'Create wallet'), command: { type: 'wallet.create' }, fields: [{ name: 'name', label: t('Tên ví', 'Wallet name') }, { name: 'walletType', label: t('Loại ví', 'Type'), options: [{ value: 'spending', label: t('Chi tiêu', 'Spending') }, { value: 'savings', label: t('Tiết kiệm', 'Savings') }, { value: 'emergency', label: t('Dự phòng', 'Emergency') }] }] }), createFund: () => open({ title: t('Tạo nhóm & quỹ', 'Create fund'), command: { type: 'fund.create' }, fields: [{ name: 'name', label: t('Tên nhóm', 'Fund name') }, { name: 'kind', label: t('Loại quỹ', 'Kind'), options: [{ value: 'Fixed', label: 'Fixed Fund' }, { value: 'Free', label: 'Free Fund' }] }, { name: 'target', label: t('Mục tiêu Fixed (VND)', 'Fixed target (VND)'), type: 'number', value: '6000000' }, pinField] }), manual: () => open({ title: t('Ghi thu / chi', 'Record income / expense'), command: { type: 'transaction.create' }, fields: [{ name: 'kind', label: t('Loại', 'Type'), options: [{ value: 'expense', label: t('Khoản chi', 'Expense') }, { value: 'income', label: t('Khoản thu ngoài Demo', 'External demo income') }] }, walletField, amountField, { name: 'name', label: t('Nội dung', 'Description') }, { name: 'category', label: t('Danh mục', 'Category'), options: [...s.items.filter(i => i.kind === 'category' && i.userId === u.id).map(i => ({ value: i.name, label: i.name })), { value: 'Khác', label: t('Khác', 'Other') }] }, pinField] }) };
}
