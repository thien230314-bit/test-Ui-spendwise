import React, { useState, useRef } from 'react';
import { useCopy } from '../../demo/copy';
import { SpendWiseSLoading } from '../../components/ui/SpendWiseSLoading';
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';

export interface NotebookAuthProps {
  onLogin?: (email: string, password: string) => Promise<void>;
  onRegister?: (name: string, email: string, phone: string, password: string, confirm: string) => Promise<void>;
  onForgot?: () => void;
  statusMode?: 'normal' | 'loading' | 'error' | 'success';
}

export const NotebookAuth: React.FC<NotebookAuthProps> = ({
  onLogin,
  onRegister,
  onForgot,
}) => {
  const t = useCopy();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submissionRef = useRef(false);

  // Login form states
  const [loginId, setLoginId] = useState('a@spendwise.demo');
  const [loginPass, setLoginPass] = useState('Demo@12345');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [remember, setRemember] = useState(true);

  // Register form states
  const [regName, setRegName] = useState('Nguyễn Văn An');
  const [regEmail, setRegEmail] = useState('an.nguyen@spendwise.demo');
  const [regPhone, setRegPhone] = useState('0912345678');
  const [regPass, setRegPass] = useState('Demo@12345');
  const [regConfirm, setRegConfirm] = useState('Demo@12345');
  const [showRegPass, setShowRegPass] = useState(false);

  const handleSubmit = async (action: () => Promise<void>) => {
    if (busy || submissionRef.current) return;
    submissionRef.current = true;
    setError('');
    setBusy(true);
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Demo error');
    } finally {
      submissionRef.current = false;
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-[390px] mx-auto relative px-2 py-3">
      {/* S-Loading Indicator when busy */}
      {busy && (
        <div className="demo-auth-loading">
          <SpendWiseSLoading />
        </div>
      )}

      {/* Main Glassmorphic Auth Card */}
      <div className="relative rounded-3xl p-6 sm:p-7 bg-white/80 dark:bg-[#12282c]/80 backdrop-blur-2xl border border-emerald-900/10 dark:border-emerald-400/15 shadow-[0_16px_40px_-12px_rgba(6,78,59,0.18)] transition-all">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-emerald-100 tracking-tight">
            {mode === 'login' ? t('Đăng nhập SpendWise', 'Welcome Back') : t('Đăng ký tài khoản', 'Create Account')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            {mode === 'login'
              ? t('Quản lý tài chính thông minh trong tầm tay', 'Manage your finances with intelligent clarity')
              : t('Bắt đầu hành trình tài chính cá nhân hiện đại', 'Start your journey to financial freedom')}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 mb-6 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5 text-xs font-semibold">
          <button
            type="button"
            className={`py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            {t('Đăng nhập', 'Sign In')}
          </button>
          <button
            type="button"
            className={`py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            {t('Đăng ký', 'Register')}
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit(async () => {
                await onLogin?.(loginId, loginPass);
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                {t('Email hoặc số điện thoại', 'Email or Phone')}
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                  placeholder="a@spendwise.demo"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                {t('Mật khẩu', 'Password')}
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-11 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  aria-label={t('Hiện mật khẩu', 'Show password')}
                >
                  {showLoginPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>{t('Ghi nhớ', 'Remember')}</span>
              </label>
              <button
                type="button"
                onClick={onForgot}
                className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {t('Quên mật khẩu?', 'Forgot password?')}
              </button>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full h-11 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_8px_20px_-4px_rgba(5,150,105,0.4)] transition-all cursor-pointer"
            >
              <span>{t('Đăng nhập vào SpendWise', 'Sign In to SpendWise')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit(async () => {
                await onRegister?.(regName, regEmail, regPhone, regPass, regConfirm);
              });
            }}
            className="space-y-3.5"
          >
            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1">
                {t('Họ và tên', 'Full Name')}
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  placeholder="Nguyễn Văn An"
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1">
                {t('Email', 'Email')}
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  placeholder="an.nguyen@spendwise.demo"
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1">
                {t('Số điện thoại', 'Phone Number')}
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  required
                  placeholder="0912345678"
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1">
                {t('Mật khẩu', 'Password')}
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type={showRegPass ? 'text' : 'password'}
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-10 pl-10 pr-11 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPass(!showRegPass)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  {showRegPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1">
                {t('Xác nhận mật khẩu', 'Confirm Password')}
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type={showRegPass ? 'text' : 'password'}
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full h-11 mt-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_8px_20px_-4px_rgba(5,150,105,0.4)] transition-all cursor-pointer"
            >
              <span>{t('ĐĂNG KÝ NGAY', 'Create Account')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
