import React, { useEffect, useRef, useState, lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Home, Wallet, Users, UserRound, LayoutDashboard, LifeBuoy, Megaphone, Wrench, LogOut, ArrowUpRight, ArrowLeft, Signal, Wifi, BatteryFull, ChevronRight, ShieldCheck, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ThemeProvider, useTheme } from '../providers/ThemeProvider';
import { I18nProvider, useI18n } from '../i18n/I18nContext';
import { AuthProvider } from '../providers/AuthProvider';
const AuthPage = lazy(() => import('../features/auth/AuthPage').then(m => ({ default: m.AuthPage })));
import { NotebookAuth } from '../features/auth/NotebookAuth';
import { SpendWiseSLoading } from '../components/ui/SpendWiseSLoading';
const ResetPinPage = lazy(() => import('../features/auth/ResetPinPage').then(m => ({ default: m.ResetPinPage })));
import { useDemo, getSession, signIn, signOut, register, verifySignup, wait } from './store';
import { ActionForm, ResultDialog, Dialog, SimulationBadge, Tools, Skeleton, Button, Badge, useCopy, type FormSpec, type Result } from './ui';
import * as Pages from './UserPages';
import { AdminOverview, AdminUsers, AdminNotifications, AdminMaintenance } from './AdminPages';
import './demo.css';
function Phone({ children }: {
    children: ReactNode;
}) { const t=useCopy(); return <div className="d-stage"><div className="d-stage-copy"><img src="/spenwise-logo.png" alt=""/><span>SpendWise</span><p>{t("YOUR MONEY. YOUR MOMENT.")}</p><SimulationBadge /><a href="/admin">{t("Admin CRM")}<ArrowUpRight size={14}/></a></div><div className="d-phone"><div className="d-phone-screen"><div className="d-status-bar"><b>9:41</b><div className="d-island"/><div><Signal size={14}/><Wifi size={14}/><BatteryFull size={19}/></div></div><div className="d-phone-body">{children}</div><div className="d-home-indicator"/></div></div><p className="d-stage-foot">{t("FRONTEND SIMULATION · SPENDWISE V1.0")}</p></div>; }
function UserAuth() { const navigate = useNavigate(), t = useCopy(), [signup, setSignup] = useState<string | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState(''); return <><div className="d-user-auth"><div className="d-auth-top"><img src="/spenwise-logo.png" alt="SpendWise"/><b>SpendWise</b><Tools /></div><SimulationBadge /><NotebookAuth onLogin={async (email, password) => { await signIn(email, password, 'app'); navigate('/app'); }} onRegister={async (name, email, phone, password, confirm) => { const id = await register({ fullName: name, email, phone, password, confirmPassword: confirm }); setSignup(id); }} onForgot={() => navigate('/app/recovery?action=forgot')}/><div className="d-auth-credentials"><b>{t('Tài khoản giả lập', 'Demo credentials')}</b><span>a@spendwise.demo / b@spendwise.demo</span><span>Demo@12345 · PIN: 123456 · OTP: 12345678</span><a href="/admin/login">{t("Admin CRM")}<ArrowUpRight size={13}/></a></div></div>{signup && <Dialog title={t('Xác minh OTP & thiết lập PIN', 'Verify OTP & set PIN')} onClose={() => {if(!busy)setSignup(null);}}><form className="d-form" onSubmit={async (e) => { e.preventDefault(); if (busy)
    return; const f = new FormData(e.currentTarget); setBusy(true); setError(''); try {
    const u = await verifySignup(signup, String(f.get('otp')), String(f.get('pin')), String(f.get('confirm')));
    await signIn(u.email, u.password, 'app');
    navigate('/app');
}
catch (e) {
    setError(e instanceof Error ? e.message : 'Error');
}
finally {
    setBusy(false);
} }}><p>{t("DEMO OTP:")}<b>12345678</b></p>{error && <p className="d-error" role="alert">{t(error)}</p>}{[['otp', 'OTP (8 số / digits)'], ['pin', 'PIN (6 số / digits)'], ['confirm', t('Xác nhận PIN', 'Confirm PIN')]].map(([name, label]) => <label key={name}>{t(label)}<input name={name} inputMode="numeric" pattern={name === 'otp' ? '[0-9]{8}' : '[0-9]{6}'} maxLength={name === 'otp' ? 8 : 6} required type={name === 'otp' ? 'text' : 'password'}/></label>)}{busy ? <div className="d-auth-inline"><SpendWiseSLoading size={80}/></div> : <Button type="submit" size="lg">{t('Xác minh & Tiếp tục', 'Verify & Continue')}</Button>}</form></Dialog>}</>; }
function AdminLogin() {
 const t=useCopy(), navigate=useNavigate(), [email,setEmail]=useState('admin@spendwise.demo'), [password,setPassword]=useState('Demo@12345'), [busy,setBusy]=useState(false), [error,setError]=useState(''), guard=useRef(false);
 return <div className="d-admin-login"><Tools/><section className="d-card d-admin-login-card"><a className="d-admin-brand" href="/admin"><img src="/spenwise-logo.png" alt=""/><div>Spend<span>Wise</span><small>{t("ADMIN WORKSPACE")}</small></div></a><Badge tone="success">{t("FRONTEND DEMO")}</Badge><h1>{t("Đăng nhập quản trị")}</h1><p className="d-muted">{t("Quản lý SpendWise trong không gian làm việc của bạn.")}</p><form className="d-form" onSubmit={async e=>{e.preventDefault();if(guard.current)return;guard.current=true;setBusy(true);setError('');try{await signIn(email.trim(),password,'admin');navigate('/admin');}catch(e){setError(e instanceof Error?e.message:'Không thể đăng nhập.');}finally{guard.current=false;setBusy(false);}}}><label>Email<input id="admin-email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required disabled={busy}/></label><label>{t("Mật khẩu")}<input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required disabled={busy}/></label>{error&&<p className="d-error" role="alert">{t(error)}</p>}<Button id="btn-admin-login-submit" type="submit" size="lg" className="d-full" isLoading={busy}>{t("Đăng nhập")}</Button></form><div className="d-auth-credentials"><b>{t("Tài khoản Demo đã điền sẵn")}</b><span>admin@spendwise.demo · Demo@12345</span></div><SimulationBadge/><a className="d-back" href="/app">{t("Mở User Mobile")}<ArrowUpRight size={14}/></a></section></div>;
}
function PageLoader({ children, kind, userId }: {
    children: ReactNode;
    kind: string;
    userId: string;
}) { const location = useLocation(), [loading, setLoading] = useState(true); useEffect(() => { let active = true; setLoading(true); void wait(180).then(() => { if (active)
    setLoading(false); }); return () => { active = false; }; }, [location.pathname, userId]); return loading ? <Skeleton kind={kind}/> : <div className="d-page-enter">{children}</div>; }
function AccountPreferences({ user }: {
    user: NonNullable<ReturnType<typeof getSession>>;
}) { const { setTheme } = useTheme(), { setLocale } = useI18n(); useEffect(() => { setTheme(user.theme); setLocale(user.language); }, [user.id]); return null; }
function Workspace() {
    const s = useDemo(), loc = useLocation(), navigate = useNavigate(), admin = loc.pathname.startsWith('/admin'), u = getSession(admin ? 'admin' : 'app'), t = useCopy();
    const [collapsed,setCollapsed]=useState(()=>localStorage.getItem('sw.demo.sidebarCollapsed')==='true');
    const [form, setForm] = useState<FormSpec | null>(null), [result, setResult] = useState<Result | null>(null);
    const scroll = useRef<HTMLDivElement>(null);
    useEffect(() => { scroll.current?.scrollTo(0, 0); setForm(null); setResult(null); }, [loc.pathname]);
    const login = loc.pathname.endsWith('/login'), recovery = loc.pathname.endsWith('/recovery') || loc.pathname.endsWith('/reset-pin');
    if (!u || login || recovery) {
        const auth = u && !recovery ? <Navigate to={admin ? '/admin' : '/app'} replace/> : recovery ? <div className="d-recovery"><Link to="/app/login" className="d-back"><ArrowLeft size={16}/>{t('Đăng nhập', 'Login')}</Link><div className="d-demo-auth-note">{t("DEMO OTP: 12345678 · PIN: 123456")}</div>{loc.pathname.endsWith('/reset-pin') ? <ResetPinPage /> : <AuthPage />}</div> : admin ? <AdminLogin /> : <UserAuth />;
        const loaded = <Suspense fallback={<div className="d-auth-inline"><SpendWiseSLoading size={110}/></div>}>{auth}</Suspense>;
        return admin ? loaded : <Phone>{loaded}</Phone>;
    }
    const p = { s, u, open: setForm, result: setResult }, path = loc.pathname.replace(admin ? '/admin' : '/app', '').replace(/^\//, '') || 'home';
    let page: ReactNode;
    let kind = path;
    if (admin) {
        kind = 'admin-' + (path === 'home' || path === 'overview' ? 'overview' : path);
        switch (path) {
            case 'home':
            case 'overview':
                page = <AdminOverview {...p}/>;
                break;
            case 'users':
                page = <AdminUsers {...p}/>;
                break;
            case 'support':
                page = <Pages.SupportPage {...p} admin/>;
                break;
            case 'notifications':
                page = <AdminNotifications {...p}/>;
                break;
            case 'maintenance':
                page = <AdminMaintenance {...p}/>;
                break;
            default: page = <Navigate to="/admin" replace/>;
        }
    }
    else {
        switch (path) {
            case 'home':
                kind = 'home';
                page = <Pages.HomePage {...p}/>;
                break;
            case 'wallet':
                page = <Pages.WalletPage {...p}/>;
                break;
            case 'history':
                page = <Pages.HistoryPage {...p}/>;
                break;
            case 'friends':
                page = <Pages.FriendsPage {...p}/>;
                break;
            case 'groups':
                page = <Pages.GroupsPage {...p}/>;
                break;
            case 'planning':
                page = <Pages.PlanningPage {...p}/>;
                break;
            case 'banks':
                page = <Pages.BanksPage {...p}/>;
                break;
            case 'notifications':
                page = <Pages.NotificationsPage {...p}/>;
                break;
            case 'support':
                page = <Pages.SupportPage {...p}/>;
                break;
            case 'reports':
                page = <Pages.ReportsPage {...p}/>;
                break;
            case 'ai':
                page = <Pages.AiPage {...p}/>;
                break;
            case 'profile':
            case 'settings':
                page = <Pages.ProfilePage {...p}/>;
                break;
            case 'password':
                page = <Pages.PasswordPage {...p}/>;
                break;
            case 'sessions':
                page = <Pages.SessionsPage />;
                break;
            default: if (path.startsWith('groups/')) {
                kind = s.funds.find(f => f.id === path.split('/')[1])?.kind === 'Fixed' ? 'fixed' : 'free';
                page = <Pages.FundPage {...p}/>;
            }
            else
                page = <Navigate to="/app" replace/>;
        }
    }
    const nav = admin ? [{ to: '/admin', label: t('Tổng quan', 'Overview'), icon: LayoutDashboard, code: '01' }, { to: '/admin/users', label: t('Người dùng', 'Users'), icon: Users, code: '02' }, { to: '/admin/support', label: t('Hỗ trợ & Tranh chấp', 'Support & Disputes'), icon: LifeBuoy, code: '03' }, { to: '/admin/notifications', label: t('Thông báo', 'Notifications'), icon: Megaphone, code: '04' }, { to: '/admin/maintenance', label: t('Bảo trì & Vận hành', 'Maintenance'), icon: Wrench, code: '05' }] : [{ to: '/app', label: t('Trang chủ', 'Home'), icon: Home }, { to: '/app/wallet', label: t('Ví', 'Wallet'), icon: Wallet }, { to: '/app/groups', label: t('Nhóm', 'Groups'), icon: Users }, { to: '/app/friends', label: t('Bạn bè', 'Friends'), icon: Users }, { to: '/app/profile', label: t('Cá nhân', 'Profile'), icon: UserRound }];
    const titles:Record<string,string>={wallet:t('Ví của tôi','My wallets'),history:t('Giao dịch','Transactions'),friends:t('Bạn bè','Friends'),groups:t('Nhóm và quỹ','Groups and funds'),planning:t('Kế hoạch','Planning'),banks:t('Ngân hàng','Banks'),notifications:t('Thông báo','Notifications'),support:t('Hỗ trợ','Support'),reports:t('Báo cáo','Reports'),ai:t('Trợ lý SpendWise','SpendWise assistant'),profile:t('Cá nhân','Profile'),settings:t('Cài đặt','Settings'),password:t('Mật khẩu','Password'),sessions:t('Phiên đăng nhập','Sessions')};
    const active = (to: string) => to === (admin ? '/admin' : '/app') ? loc.pathname === to || loc.pathname === to + '/overview' : loc.pathname.startsWith(to);
    const overlays = <>{form && <div inert={result ? true : undefined}><ActionForm key={JSON.stringify(form.command) + form.title} spec={form} actor={u} onClose={() => setForm(null)} onResult={setResult}/></div>}{result && <ResultDialog result={result} onClose={() => setResult(null)}/>}</>;
    const userContent = <><div className="d-app-scroll" ref={scroll} inert={form || result ? true : undefined}>{path!=='ai'&&<div className="d-app-toolbar"><SimulationBadge /><Tools /></div>}{u.status !== 'Active' && <div className="d-warning">{t('Tài khoản bị hạn chế giao dịch', 'Account is financially restricted')}</div>}{s.maintenance.enabled && <div className="d-warning">{t('Đang bảo trì · Giao dịch tạm dừng', 'Maintenance · Financial actions paused')}</div>}<main className={"d-user-main"+(path==='ai'?' d-ai-main':'')}>{path!=='home'&&<header className="d-subpage-nav"><button className="d-icon-button" aria-label={t('Quay lại','Go back')} onClick={()=>{if((window.history.state?.idx??0)>0)navigate(-1);else navigate(path.startsWith('groups/')?'/app/groups':'/app');}}><ArrowLeft size={21}/></button><span>{titles[path]||t('Chi tiết quỹ','Fund details')}</span>{path==='ai'&&<Tools/>}<Link to="/app" aria-label={t('Về trang chủ','Go to dashboard')}><Home size={19}/></Link></header>}<PageLoader key={loc.pathname+u.id} kind={kind} userId={u.id}>{page}</PageLoader></main></div><nav className="d-bottom-nav" aria-label={t("Mobile navigation")} inert={form || result ? true : undefined}>{nav.map(n => <Link key={n.to} to={n.to} className={active(n.to) ? 'active' : ''} aria-current={active(n.to) ? 'page' : undefined}><n.icon size={21}/><span>{n.label}</span></Link>)}</nav>{overlays}</>;
    const adminContent = <div className={"d-admin"+(collapsed?" sidebar-collapsed":"")}><div className="d-admin-layout" inert={form || result ? true : undefined}><aside className="d-admin-sidebar"><a href="/admin" className="d-admin-brand"><img src="/spenwise-logo.png" alt=""/><div>Spend<span>Wise</span><small>{t("ADMIN WORKSPACE")}</small></div></a><div className="d-sidebar-caption">{t("WORKSPACE")}</div><nav>{nav.map(n => <Link key={n.to} to={n.to} title={n.label} aria-label={n.label+" "+n.code} aria-current={active(n.to)?"page":undefined} className={active(n.to) ? 'active' : ''}><n.icon size={19}/><span>{n.label}</span><small>{'code' in n ? n.code : ''}</small></Link>)}</nav><div className="d-sidebar-bottom"><div className="d-sidebar-help"><ShieldCheck size={24}/><b>{t('An toàn từ thiết kế', 'Safe by design')}</b><p>{t('Không chỉnh sửa ledger hay số dư tùy ý.', 'No arbitrary balance or ledger edits.')}</p><a href="/app">{t("User Mobile")}<ArrowUpRight size={14}/></a></div><button onClick={() => { signOut('admin'); location.assign('/admin/login'); }}><LogOut size={18}/>{t('Đăng xuất', 'Sign out')}</button></div></aside><div className="d-admin-canvas"><header className="d-admin-topbar"><button className="d-icon-button d-sidebar-toggle" aria-label={collapsed?t('Mở rộng thanh điều hướng','Expand sidebar'):t('Thu gọn thanh điều hướng','Collapse sidebar')} aria-expanded={!collapsed} onClick={()=>{setCollapsed(!collapsed);localStorage.setItem('sw.demo.sidebarCollapsed',String(!collapsed));}}>{collapsed?<PanelLeftOpen size={22}/>:<PanelLeftClose size={22}/>}</button><div><small>{t("SpendWise / Admin")}</small><b>{nav.find(n => active(n.to))?.label || 'Overview'}</b></div><div className="d-topbar-right"><SimulationBadge /><Tools /><div className="d-admin-account"><div className="d-avatar small">LH</div><span>{t(u.name)}<small>{t("System Admin")}</small></span></div></div></header><main className="d-admin-main"><PageLoader key={loc.pathname+u.id} kind={kind} userId={u.id}>{page}</PageLoader></main></div></div>{overlays}</div>;
    return <><AccountPreferences user={u}/>{admin ? adminContent : <Phone>{userContent}</Phone>}</>;
}
export default function DemoApp() { return <ThemeProvider><I18nProvider><AuthProvider><BrowserRouter><Routes><Route path="/" element={<Navigate to="/app" replace/>}/><Route path="/app/*" element={<Workspace />}/><Route path="/admin/*" element={<Workspace />}/><Route path="/login" element={<Navigate to="/admin/login" replace/>}/><Route path="*" element={<Navigate to="/app" replace/>}/></Routes></BrowserRouter></AuthProvider></I18nProvider></ThemeProvider>; }
