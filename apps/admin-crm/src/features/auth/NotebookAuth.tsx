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
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0 8px', position: 'relative' }}>
      {/* S-Loading Indicator when busy */}
      {busy && (
        <div className="demo-auth-loading">
          <SpendWiseSLoading />
        </div>
      )}

      {/* Main Glassmorphic Auth Card */}
      <div className="clean-auth-card">
        {/* Header */}
        <div className="clean-auth-header">
          <h2>
            {mode === 'login' ? t('Đăng nhập SpendWise', 'Welcome Back') : t('Đăng ký tài khoản', 'Create Account')}
          </h2>
          <p>
            {mode === 'login'
              ? t('Quản lý tài chính thông minh trong tầm tay', 'Manage your finances with intelligent clarity')
              : t('Bắt đầu hành trình tài chính cá nhân hiện đại', 'Start your journey to financial freedom')}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="d-error" style={{ margin: '0 0 10px 0' }}>
            {error}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="clean-auth-tabs">
          <button
            type="button"
            className={`clean-auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            {t('Đăng nhập', 'Sign In')}
          </button>
          <button
            type="button"
            className={`clean-auth-tab ${mode === 'register' ? 'active' : ''}`}
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
            className="clean-auth-form"
          >
            <div className="clean-auth-field">
              <label htmlFor="auth-login-id">
                {t('Email hoặc số điện thoại', 'Email or Phone')}
              </label>
              <div className="clean-auth-input-wrapper">
                <Mail className="field-icon" size={17} />
                <input
                  id="auth-login-id"
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                  placeholder="a@spendwise.demo"
                />
              </div>
            </div>

            <div className="clean-auth-field">
              <label htmlFor="auth-login-pass">
                {t('Mật khẩu', 'Password')}
              </label>
              <div className="clean-auth-input-wrapper">
                <Lock className="field-icon" size={17} />
                <input
                  id="auth-login-pass"
                  type={showLoginPass ? 'text' : 'password'}
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="toggle-pass"
                  aria-label={t('Hiện mật khẩu', 'Show password')}
                >
                  {showLoginPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="clean-auth-options">
              <label className="clean-auth-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>{t('Ghi nhớ', 'Remember')}</span>
              </label>
              <button
                type="button"
                onClick={onForgot}
                className="clean-auth-forgot"
              >
                {t('Quên mật khẩu?', 'Forgot password?')}
              </button>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="clean-auth-submit"
            >
              <span>{t('Đăng nhập vào SpendWise', 'Sign In to SpendWise')}</span>
              <ArrowRight size={17} />
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
            className="clean-auth-form"
          >
            <div className="clean-auth-field">
              <label htmlFor="auth-reg-name">
                {t('Họ và tên', 'Full Name')}
              </label>
              <div className="clean-auth-input-wrapper">
                <User className="field-icon" size={17} />
                <input
                  id="auth-reg-name"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  placeholder="Nguyễn Văn An"
                />
              </div>
            </div>

            <div className="clean-auth-field">
              <label htmlFor="auth-reg-email">
                {t('Email', 'Email')}
              </label>
              <div className="clean-auth-input-wrapper">
                <Mail className="field-icon" size={17} />
                <input
                  id="auth-reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  placeholder="an.nguyen@spendwise.demo"
                />
              </div>
            </div>

            <div className="clean-auth-field">
              <label htmlFor="auth-reg-phone">
                {t('Số điện thoại', 'Phone Number')}
              </label>
              <div className="clean-auth-input-wrapper">
                <Phone className="field-icon" size={17} />
                <input
                  id="auth-reg-phone"
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  required
                  placeholder="0912345678"
                />
              </div>
            </div>

            <div className="clean-auth-field">
              <label htmlFor="auth-reg-pass">
                {t('Mật khẩu', 'Password')}
              </label>
              <div className="clean-auth-input-wrapper">
                <Lock className="field-icon" size={17} />
                <input
                  id="auth-reg-pass"
                  type={showRegPass ? 'text' : 'password'}
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPass(!showRegPass)}
                  className="toggle-pass"
                >
                  {showRegPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="clean-auth-field">
              <label htmlFor="auth-reg-confirm">
                {t('Xác nhận mật khẩu', 'Confirm Password')}
              </label>
              <div className="clean-auth-input-wrapper">
                <Lock className="field-icon" size={17} />
                <input
                  id="auth-reg-confirm"
                  type={showRegPass ? 'text' : 'password'}
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="clean-auth-submit"
            >
              <span>{t('ĐĂNG KÝ NGAY', 'Create Account')}</span>
              <ArrowRight size={17} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
