import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDownUp, X, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const TOKENS = {
  DOS: { balance: 50, rate: 1, unit: 'DOS' },
  SCV: { balance: 1000, rate: 0.1, unit: 'SCV' },
};
const SC_BALANCE = 32.11;

export default function ExchangeSCSheet({ onClose, onSubmit }) {
  const { lang } = useLanguage();
  const [fromToken, setFromToken] = useState('DOS');
  const [menuOpen, setMenuOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  const token = TOKENS[fromToken];
  const num = parseFloat(amount) || 0;
  const willReceive = num * token.rate;
  const insufficient = num > 0 && num > token.balance;
  const canSubmit = num > 0 && !insufficient;

  function selectToken(t) {
    if (t !== fromToken) { setFromToken(t); setAmount(''); }
    setMenuOpen(false);
  }

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit?.(num, fromToken);
    onClose();
  }

  return createPortal(
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
        <div
          style={{
            borderRadius: '20px 20px 0 0',
            background: 'var(--color-bg-page)',
            boxShadow: '0 -4px 32px rgba(13,21,39,0.14)',
          }}
        >
          {/* Handle + header */}
          <div className="relative flex items-center justify-center px-4 pt-3 pb-2">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 h-1 w-10 rounded-full" style={{ background: 'var(--color-border)' }} />
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="w-8" />
              <span className="text-[17px] font-semibold text-tokenText">{lang === 'zh' ? '兑换 SC' : 'Swap SC'}</span>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--color-bg-card)' }}>
                <X className="h-4 w-4 text-tokenSub" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="px-4 pt-2 pb-6">
            {/* 从 */}
            <div className="rounded-2xl px-4 pt-3 pb-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-medium text-tokenSub">{lang === 'zh' ? '从' : 'From'}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-tokenHint">
                    {lang === 'zh' ? `余额：${token.balance} ${fromToken}` : `Balance: ${token.balance} ${fromToken}`}
                  </span>
                  <button
                    onClick={() => setAmount(String(token.balance))}
                    className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-tokenPrimary"
                    style={{ background: 'var(--color-primary-soft)' }}
                  >
                    {lang === 'zh' ? '全部' : 'Max'}
                  </button>
                </div>
              </div>
              <div
                className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                style={{ background: 'var(--color-bg-page)', border: `1.5px solid ${insufficient ? 'var(--color-danger)' : 'var(--color-primary)'}` }}
              >
                <div className="relative shrink-0">
                  <button
                    onClick={() => setMenuOpen(o => !o)}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 active:opacity-70"
                    style={{ background: 'var(--color-bg-card)' }}
                  >
                    {fromToken === 'DOS' ? (
                      <img src="/assets/DOS.svg" alt="DOS" className="h-6 w-6 shrink-0" />
                    ) : (
                      <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>V</div>
                    )}
                    <span className="text-[15px] font-semibold text-tokenText">{fromToken}</span>
                    <ChevronDown className={`h-3.5 w-3.5 text-tokenSub transition-transform duration-150 ${menuOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                  </button>
                  {menuOpen && (
                    <div
                      className="absolute left-0 top-full z-10 mt-1.5 min-w-[130px] overflow-hidden rounded-xl py-1"
                      style={{ background: 'var(--color-bg-page)', boxShadow: '0 4px 20px rgba(13,21,39,0.16)', border: '1px solid var(--color-border)' }}
                    >
                      {Object.keys(TOKENS).map(key => (
                        <button
                          key={key}
                          onClick={() => selectToken(key)}
                          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left active:opacity-70"
                          style={{ background: key === fromToken ? 'var(--color-primary-soft)' : 'transparent' }}
                        >
                          {key === 'DOS' ? (
                            <img src="/assets/DOS.svg" alt="DOS" className="h-5 w-5 shrink-0" />
                          ) : (
                            <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>V</div>
                          )}
                          <span className="text-[14px] font-semibold text-tokenText">{key}</span>
                          {key === fromToken && <Check className="ml-auto h-3.5 w-3.5 text-tokenPrimary" strokeWidth={2.5} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-1 cursor-text" onClick={() => { setMenuOpen(false); inputRef.current?.focus(); }}>
                <input
                  ref={inputRef}
                  type="number"
                  min="0"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder={lang === 'zh' ? '输入数量' : 'Enter amount'}
                  className="min-w-0 w-full bg-transparent text-right font-num text-[26px] font-semibold outline-none placeholder:text-[18px] placeholder:text-tokenHint"
                  style={{ color: insufficient ? 'var(--color-danger)' : 'var(--color-text-primary)' }}
                />
                </div>
              </div>
              {insufficient && (
                <p className="mt-1.5 text-right text-[11px] text-tokenDanger">{lang === 'zh' ? '余额不足' : 'Insufficient balance'}</p>
              )}
            </div>

            {/* 方向箭头 */}
            <div className="flex justify-center py-3">
              <ArrowDownUp className="h-5 w-5 text-tokenSub" strokeWidth={1.8} />
            </div>

            {/* 到 */}
            <div className="rounded-2xl px-4 pt-3 pb-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-medium text-tokenSub">{lang === 'zh' ? '到' : 'To'}</span>
                <span className="text-[12px] text-tokenHint">{lang === 'zh' ? `余额：${SC_BALANCE} 亿 SC` : `Balance: ${SC_BALANCE}B SC`}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex shrink-0 items-center gap-2">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white" style={{ background: 'linear-gradient(135deg,var(--color-primary),#0a9090)' }}>S</div>
                  <span className="text-[15px] font-semibold text-tokenText">SC</span>
                </div>
                <div className="flex flex-1 items-baseline justify-end gap-1">
                  <span className="font-num text-[26px] font-semibold" style={{ color: num > 0 && !insufficient ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                    {num > 0 && !insufficient ? willReceive : '0.00'}
                  </span>
                  <span className="text-[14px] font-medium text-tokenSub">{lang === 'zh' ? '亿' : 'B'}</span>
                </div>
              </div>
            </div>

            {/* 汇率 */}
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <ArrowDownUp className="h-3 w-3 text-tokenHint" strokeWidth={2} />
              <span className="text-[12px] text-tokenHint">
                {lang === 'zh'
                  ? `1 ${fromToken} ≈ ${token.rate} 亿 SC`
                  : `1 ${fromToken} ≈ ${token.rate}B SC`}
              </span>
            </div>

            {/* 提交 */}
            <div className="mt-5">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full py-[14px] text-[15px] font-semibold"
                style={{
                  borderRadius: 'var(--radius-md)',
                  background: canSubmit ? 'var(--color-primary)' : 'var(--color-border)',
                  color: canSubmit ? '#fff' : 'var(--color-text-hint)',
                  boxShadow: canSubmit ? '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' : 'none',
                }}
              >
                {lang === 'zh' ? '确认兑换' : 'Confirm Swap'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
