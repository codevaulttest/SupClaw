import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Key, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useUser } from './UserContext';

// 无主续期码校验：账号16位大写字母+数字，密码8位数字
function validateUnowned(account, password) {
  const acctOk = /^[A-Z0-9]{16}$/.test(account.trim().toUpperCase());
  const pwOk   = /^\d{8}$/.test(password.trim());
  return acctOk && pwOk;
}

function SuccessView({ expiry, wasRenewal, onDone }) {
  const { lang } = useLanguage();
  return (
    <>
      <div className="flex justify-center pt-3 pb-1">
        <div className="h-1 w-10 rounded-full" style={{ background: 'var(--color-border)' }} />
      </div>
      <div className="flex justify-end px-4 pt-1">
        <button onClick={onDone} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--color-bg-card)' }}>
          <X className="h-4 w-4 text-tokenSub" strokeWidth={2} />
        </button>
      </div>
      <div className="flex flex-col items-center px-6 pt-2 pb-6">
        <div className="mb-4 grid h-16 w-16 place-items-center rounded-full" style={{ background: 'var(--color-success-soft)' }}>
          <CheckCircle className="h-8 w-8" style={{ color: 'var(--color-success)' }} strokeWidth={1.8} />
        </div>
        <p className="text-[20px] font-semibold text-tokenText">
          {lang === 'zh' ? (wasRenewal ? '续期成功' : '开通成功') : (wasRenewal ? 'Renewed' : 'Activated')}
        </p>
        <p className="mt-2 text-[14px] text-tokenSub">
          {lang === 'zh' ? `有效期至 ${expiry}` : `Valid until ${expiry}`}
        </p>
        <p className="mt-3 text-center text-[13px] leading-[20px] text-tokenHint">
          {lang === 'zh'
            ? '您现在可以兑换首发权，抢先解锁 AI 视频。'
            : 'You can now redeem early access and unlock AI videos ahead of time.'}
        </p>
      </div>
      <div className="px-4 pb-8">
        <button
          onClick={onDone}
          className="w-full py-[14px] text-[15px] font-semibold text-white"
          style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
        >
          {lang === 'zh' ? '完成' : 'Done'}
        </button>
      </div>
    </>
  );
}

export default function MembershipSheet({ onClose, onActivate }) {
  const { lang } = useLanguage();
  const { isMember, ownedCodeCount, activateMembership, useOwnedCode } = useUser();

  const [tab, setTab] = useState(ownedCodeCount > 0 ? 'owned' : 'unowned');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // { expiry, wasRenewal }
  const [confirming, setConfirming] = useState(false);

  function handleUseOwned() {
    const wasRenewal = isMember;
    const newExpiry = activateMembership();
    useOwnedCode();
    setConfirming(false);
    setSuccess({ expiry: newExpiry, wasRenewal });
  }

  function handleVerify() {
    if (!account.trim() || !password.trim() || loading) return;
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      if (validateUnowned(account, password)) {
        const wasRenewal = isMember;
        const newExpiry = activateMembership();
        setSuccess({ expiry: newExpiry, wasRenewal });
      } else {
        setError(lang === 'zh' ? '账号或密码不正确' : 'Invalid account or password');
      }
    }, 800);
  }

  function handleDone() {
    onClose?.();
    onActivate?.();
  }

  const confirmSheet = confirming && createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onClick={() => setConfirming(false)}
    >
      <div
        className="w-full max-w-[480px]"
        style={{ animation: 'sheetUp 260ms cubic-bezier(0.22,1,0.36,1) both' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ borderRadius: '20px 20px 0 0', background: 'var(--color-bg-page)', boxShadow: '0 -4px 32px rgba(13,21,39,0.14)' }}>
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full" style={{ background: 'var(--color-border)' }} />
          </div>
          <div className="px-6 pt-3 pb-3 text-center">
            <p className="text-[17px] font-semibold text-tokenText">
              {lang === 'zh' ? '确认使用续期码？' : 'Use Renewal Code?'}
            </p>
            <p className="mt-2 text-[13px] leading-[20px] text-tokenHint">
              {lang === 'zh'
                ? `将使用 1 张续期码，会员有效期增加 1 年，剩余 ${ownedCodeCount - 1} 张。`
                : `1 renewal code will be used. Membership extended by 1 year. ${ownedCodeCount - 1} remaining.`}
            </p>
          </div>
          <div className="px-4 pb-8 flex flex-col gap-3">
            <button
              onClick={handleUseOwned}
              className="w-full py-[14px] text-[15px] font-semibold text-white"
              style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
            >
              {lang === 'zh' ? '确认使用' : 'Confirm'}
            </button>
            <button onClick={() => setConfirming(false)} className="w-full py-3 text-[15px] font-medium text-tokenSub">
              {lang === 'zh' ? '取消' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );

  const sheetInner = (
    <div style={{ borderRadius: '20px 20px 0 0', background: 'var(--color-bg-page)', boxShadow: '0 -4px 32px rgba(13,21,39,0.14)' }}>
      {success ? (
        <SuccessView expiry={success.expiry} wasRenewal={success.wasRenewal} onDone={handleDone} />
      ) : (
        <>
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full" style={{ background: 'var(--color-border)' }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-1 pb-3">
            <p className="text-[17px] font-semibold text-tokenText">
              {lang === 'zh' ? (isMember ? '续期会员' : '开通会员') : (isMember ? 'Renew Membership' : 'Activate Membership')}
            </p>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--color-bg-card)' }}>
              <X className="h-4 w-4 text-tokenSub" strokeWidth={2} />
            </button>
          </div>

          {/* Tab switcher */}
          <div className="mx-4 mb-4 flex border-b border-tokenBorderSubtle">
            {[
              { key: 'owned',   zh: `我的续期码${ownedCodeCount > 0 ? ` (${ownedCodeCount})` : ''}`, en: `My Codes${ownedCodeCount > 0 ? ` (${ownedCodeCount})` : ''}` },
              { key: 'unowned', zh: '输入续期码', en: 'Enter Code' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="mr-5 pb-2 text-[14px] font-semibold leading-[20px] transition-colors"
                style={{
                  color: tab === t.key ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  borderBottom: tab === t.key ? '2px solid var(--color-primary)' : '2px solid transparent',
                  marginBottom: '-1px',
                }}
              >
                {lang === 'zh' ? t.zh : t.en}
              </button>
            ))}
          </div>

          <div className="px-4 pb-8">

            {/* Tab: 我的续期码（有主码） */}
            {tab === 'owned' && (
              ownedCodeCount === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="grid h-12 w-12 place-items-center rounded-full" style={{ background: 'var(--color-bg-card)' }}>
                    <Key className="h-5 w-5 text-tokenHint" strokeWidth={1.8} />
                  </div>
                  <p className="text-[14px] text-tokenHint">
                    {lang === 'zh' ? '暂无可用续期码' : 'No renewal codes available'}
                  </p>
                  <button
                    onClick={() => setTab('unowned')}
                    className="text-[13px] font-semibold"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {lang === 'zh' ? '输入续期码开通' : 'Enter a renewal code instead'}
                  </button>
                </div>
              ) : (
                <div className="rounded-xl px-4 py-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full" style={{ background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }}>
                        <Key className="h-5 w-5" style={{ color: 'var(--color-primary)' }} strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-tokenText">
                          {lang === 'zh' ? `${ownedCodeCount} 张续期码` : `${ownedCodeCount} Renewal Code${ownedCodeCount > 1 ? 's' : ''}`}
                        </p>
                        <p className="text-[12px] text-tokenHint">
                          {lang === 'zh' ? '每张增加 1 年有效期' : '+1 year per code'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setConfirming(true)}
                      className="rounded-full px-4 py-1.5 text-[13px] font-semibold text-white"
                      style={{ background: 'var(--color-primary)' }}
                    >
                      {lang === 'zh' ? '立即使用' : 'Use Now'}
                    </button>
                  </div>
                </div>
              )
            )}

            {/* Tab: 输入续期码（无主码） */}
            {tab === 'unowned' && (
              <div className="flex flex-col gap-3">
                {[
                  { key: 'account',  val: account,  set: v => { setAccount(v);  setError(null); }, zh: '续期码账号', en: 'Code Account',  type: 'text',     hint: lang === 'zh' ? '16 位大写字母或数字' : '16 uppercase letters or digits' },
                  { key: 'password', val: password, set: v => { setPassword(v); setError(null); }, zh: '续期码密码', en: 'Code Password', type: 'password', hint: lang === 'zh' ? '8 位数字' : '8 digits' },
                ].map(f => (
                  <div key={f.key}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <label className="text-[12px] font-medium text-tokenHint">{lang === 'zh' ? f.zh : f.en}</label>
                      <span className="text-[11px] text-tokenHint">{f.hint}</span>
                    </div>
                    <input
                      type={f.type}
                      value={f.val}
                      onChange={e => f.set(e.target.value)}
                      placeholder={lang === 'zh' ? `请输入${f.zh}` : `Enter ${f.en.toLowerCase()}`}
                      className="w-full rounded-xl px-4 py-3 text-[15px] outline-none"
                      style={{
                        background: 'var(--color-bg-card)',
                        border: `1.5px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
                        color: 'var(--color-text-primary)',
                      }}
                    />
                  </div>
                ))}

                {error && (
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 text-tokenDanger" strokeWidth={2} />
                    <p className="text-[12px] text-tokenDanger">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleVerify}
                  disabled={loading || !account.trim() || !password.trim()}
                  className="mt-1 flex w-full items-center justify-center gap-2 py-[14px] text-[15px] font-semibold text-white"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    background: (loading || !account.trim() || !password.trim()) ? 'var(--color-border)' : 'var(--color-primary)',
                    boxShadow: (loading || !account.trim() || !password.trim()) ? 'none' : '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)',
                  }}
                >
                  {loading && <Loader className="h-4 w-4 animate-spin" strokeWidth={2} />}
                  {lang === 'zh' ? '验证并开通' : 'Verify & Activate'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  return <>
    {confirmSheet}
    {createPortal(
      <div
        className="fixed inset-0 z-50 flex items-end justify-center"
        style={{ background: 'rgba(0,0,0,0.35)' }}
        onClick={onClose}
      >
        <div
          className="w-full max-w-[480px]"
          style={{ animation: 'sheetUp 260ms cubic-bezier(0.22,1,0.36,1) both' }}
          onClick={e => e.stopPropagation()}
        >
          {sheetInner}
        </div>
      </div>,
      document.body
    )}
  </>;
}
