import { validEmail, validName, validPassword, validPhone } from './authValidation';
import { useSyncExternalStore } from 'react';
import { assertState, execute, seed, type Command, type DemoState, type DemoUser } from './model';
const KEY = 'spendwise.frontend-simulation.v1';
export const area = location.pathname.startsWith('/admin') ? 'admin' : 'app';
const listeners = new Set<() => void>();
function read(): DemoState { const raw = localStorage.getItem(KEY); if (raw) {
    const s = JSON.parse(raw) as DemoState;
    assertState(s);
    return s;
} const s = seed(); localStorage.setItem(KEY, JSON.stringify(s)); return s; }
let state = read();
function emit() { listeners.forEach(fn => fn()); }
function persist(s: DemoState) { assertState(s); localStorage.setItem(KEY, JSON.stringify(s)); state = s; emit(); }
window.addEventListener('storage', e => { if (e.key === KEY || e.key?.startsWith('sw.demo.session.')) {
    state = read();
    emit();
} });
export const wait = (ms = 220) => new Promise<void>(resolve => setTimeout(resolve, ms));
export const snapshot = () => state;
export function useDemo() { return useSyncExternalStore(fn => { listeners.add(fn); return () => { listeners.delete(fn); }; }, snapshot); }
async function exclusive<T>(fn: () => T): Promise<T> {
    // shortcut: browsers without Web Locks support one-tab simulation; use Web Locks for cross-tab finance.
    if (navigator.locks)
        return navigator.locks.request(KEY, fn);
    return fn();
}
export const demoApi = {
    async command(actor: string, c: Command) { if(c.type!=='preferences')await wait(); return exclusive(() => { const result = execute(read(), actor, c); persist(result.state); return result.value; }); },
    async query() { await wait(180); return read(); },
};
type Session = {
    userId: string;
    version: number;
};
export function getSession(scope = area): DemoUser | undefined { try {
    const raw = localStorage.getItem('sw.demo.session.' + scope);
    if (!raw)
        return;
    const session = JSON.parse(raw) as Session;
    const u = state.users.find(u => u.id === session.userId && u.sessionVersion === session.version && u.status !== 'Locked');
    if (u && (scope === 'admin' ? u.role === 'SystemAdmin' : u.role === 'User'))
        return u;
}
catch { /* Invalid demo session requires fresh sign-in. */ } }
export async function signIn(identifier: string, password: string, scope = area) { await wait(780); const s = read(), u = s.users.find(u => [u.email, u.phone, u.id].includes(identifier.trim().toLowerCase())); if (!u || u.password !== password)
    throw new Error('Email hoặc mật khẩu demo không đúng / Incorrect demo credentials'); if (!u.verified)
    throw new Error('Vui lòng xác minh OTP demo / Verify demo OTP first'); if (u.status === 'Locked')
    throw new Error('Tài khoản đang khóa / Account locked'); if ((scope === 'admin') !== (u.role === 'SystemAdmin'))
    throw new Error('Sai khu vực đăng nhập / Use the correct login area'); localStorage.setItem('sw.demo.session.' + scope, JSON.stringify({ userId: u.id, version: u.sessionVersion })); state = s; emit(); return u; }
export function signOut(scope = area) { localStorage.removeItem('sw.demo.session.' + scope); for (const name of ['access_token', 'refresh_token', 'access_token_expires_at', 'user_profile'])
    sessionStorage.removeItem('spendwise_demo_' + scope + '_' + name); emit(); }
export function profile(u: DemoUser) { return { id: u.id, fullName: u.name, email: u.email, phone: u.phone, spendId: u.id.toUpperCase(), systemRole: u.role, status: u.status.toLowerCase(), mustChangePassword: false, preferredLanguage: u.language, preferredTheme: u.theme, defaultCurrency: 'VND', createdAt: '2026-10-01T00:00:00Z', engagementEmailOptIn: false }; }
export function authResponse(u: DemoUser) { return { accessToken: 'DEMO.' + u.id, refreshToken: 'DEMO.' + u.id, accessTokenExpiresAt: new Date(Date.now() + 86400000).toISOString(), user: profile(u), deviceTrustToken: 'DEMO-ONLY' }; }
export async function register(form: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}) { await wait(500); return exclusive(() => { const s = read(); if (!validName(form.fullName) || !validEmail(form.email) || !validPhone(form.phone) || !validPassword(form.password) || form.password !== form.confirmPassword)
    throw new Error('Vui lòng kiểm tra họ tên, email, số điện thoại và mật khẩu 8–128 ký tự có chữ hoa, thường, số. / Check registration fields.'); form.email = form.email.trim().toLowerCase(); if (s.users.some(u => u.email === form.email || u.phone === form.phone))
    throw new Error('Email/SĐT đã tồn tại / Email or phone already exists'); const u: DemoUser = { id: crypto.randomUUID(), name: form.fullName.trim(), email: form.email, phone: form.phone, password: form.password, pin: '', role: 'User', status: 'Active', theme: 'light', language: 'vi-VN', verified: false, sessionVersion: 0 }; s.users.push(u); s.wallets.push({ id: crypto.randomUUID(), userId: u.id, name: 'Ví chi tiêu', balance: 0, type: 'spending' }); persist(s); return u.id; }); }
const challenges = new Map<string, {
    userId: string;
    expires: number;
}>();
export async function mockRequest<T>(method: string, path: string, body: unknown, token: string | null): Promise<T> {
    await wait(220);
    const c = (body ?? {}) as Record<string, string>;
    const current = getSession();
    const run = async (): Promise<unknown> => {
        if (path === '/auth/login') {
            const s = read(), u = s.users.find(u => [u.email, u.phone, u.id].includes(c.identifier));
            if (!u || u.password !== c.password || u.status === 'Locked')
                throw Error('Thông tin đăng nhập không đúng / Invalid credentials');
            const challenge = crypto.randomUUID();
            challenges.set(challenge, { userId: u.id, expires: Date.now() + 300000 });
            return { challengeToken: challenge, status: u.pin ? 'PIN_REQUIRED' : 'PIN_SETUP_REQUIRED', expiresAt: new Date(Date.now() + 300000).toISOString() };
        }
        if (path === '/auth/pin/verify' || path === '/auth/pin/setup') {
            const challenge = challenges.get(c.challengeToken), s = read(), u = s.users.find(u => u.id === challenge?.userId);
            if (!u || !challenge || challenge.expires < Date.now())
                throw Error('Phiên xác thực hết hạn / Challenge expired');
            if (path.endsWith('setup')) {
                if (!/^\d{6}$/.test(c.pin) || c.pin !== c.confirmPin)
                    throw Error('PIN không hợp lệ / Invalid PIN');
                u.pin = c.pin;
                persist(s);
            }
            else if (c.pin !== u.pin)
                throw Error('PIN không đúng / Incorrect PIN');
            challenges.delete(c.challengeToken);
            return authResponse(await signIn(u.email, u.password));
        }
        if (path === '/auth/register') {
            await register(c as unknown as Parameters<typeof register>[0]);
            return { status: 'EMAIL_VERIFICATION_REQUIRED', expiresAt: new Date(Date.now() + 300000).toISOString(), resendAfterSeconds: 30 };
        }
        if (path === '/auth/email-verification/verify') {
            if (c.otp !== '12345678')
                throw Error('OTP Demo: 12345678');
            const s = read(), u = s.users.find(u => u.email === c.email);
            if (!u)
                throw Error('User unavailable');
            u.verified = true;
            persist(s);
            const challenge = crypto.randomUUID();
            challenges.set(challenge, { userId: u.id, expires: Date.now() + 300000 });
            return { challengeToken: challenge, status: 'PIN_SETUP_REQUIRED', expiresAt: new Date(Date.now() + 300000).toISOString() };
        }
        if (path === '/auth/email-verification/resend' || path === '/auth/forgot-password' || path === '/auth/pin/forgot' || path === '/account-recovery')
            return { message: 'Demo OTP: 12345678 · PIN reset token: DEMO-RESET-' + encodeURIComponent(c.identifier || '') };
        if (path === '/auth/reset-password') {
            if (c.otp !== '12345678' || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/.test(c.newPassword))
                throw Error('OTP hoặc mật khẩu không hợp lệ / Invalid OTP or password');
            const s = read(), u = s.users.find(u => [u.email, u.phone].includes(c.identifier));
            if (!u)
                throw Error('User unavailable');
            u.password = c.newPassword;
            u.sessionVersion++;
            persist(s);
            return;
        }
        if (path === '/auth/pin/reset/validate')
            return { valid: c.token.startsWith('DEMO-RESET-'), expiresAt: new Date(Date.now() + 300000).toISOString() };
        if (path === '/auth/pin/reset') {
            const s = read(), u = s.users.find(u => [u.email, u.phone].includes(decodeURIComponent(c.token.replace('DEMO-RESET-', ''))));
            if (!u || !/^\d{6}$/.test(c.newPin) || c.newPin !== c.confirmPin)
                throw Error('Invalid reset token or PIN');
            u.pin = c.newPin;
            u.sessionVersion++;
            persist(s);
            return;
        }
        if (path === '/auth/logout') {
            signOut();
            return;
        }
        if (path === '/auth/refresh') {
            if (!current)
                throw Error('Phiên hết hạn / Session expired');
            return authResponse(current);
        }
        if (path === '/users/me' && method === 'GET') {
            if (!current)
                throw Error('Session expired');
            return profile(current);
        }
        if (path === '/users/me/preferences' && current) {
            await demoApi.command(current.id, { type: 'preferences', theme: c.preferredTheme || current.theme, language: c.preferredLanguage || current.language });
            return profile(snapshot().users.find(u => u.id === current.id)!);
        }
        if (path === '/auth/change-password' && current) {
            if (c.currentPassword !== current.password || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/.test(c.newPassword))
                throw Error('Mật khẩu không hợp lệ / Invalid password');
            const s = read(), u = s.users.find(u => u.id === current.id)!;
            u.password = c.newPassword;
            persist(s);
            return;
        }
        if (path === '/security-pin/status')
            return { isSet: !!current?.pin };
        if (path === '/security-pin/verify') {
            if (c.pin !== current?.pin)
                throw Error('Incorrect PIN');
            return;
        }
        if (path === '/users/me/sessions' && method === 'DELETE' && current) {
            const s = read();
            s.users.find(u => u.id === current.id)!.sessionVersion++;
            persist(s);
            signOut();
            return;
        }
        void token;
        throw Error('Mock route unavailable: ' + method + ' ' + path);
    };
    try {
        return await run() as T;
    }
    catch (e) {
        throw { kind: 'validation', status: 400, title: e instanceof Error ? e.message : 'Demo error', detail: e instanceof Error ? e.message : 'Demo error' };
    }
}
export async function verifySignup(userId: string, otp: string, pin: string, confirm: string) { await wait(550); return exclusive(() => { const s = read(), u = s.users.find(u => u.id === userId); if (!u || u.verified || otp !== '12345678' || !/^\d{6}$/.test(pin) || pin !== confirm)
    throw Error('OTP Demo: 12345678. PIN cần đúng 6 số, xác nhận khớp. / Check OTP and PIN confirmation.'); u.verified = true; u.pin = pin; persist(s); return u; }); }
