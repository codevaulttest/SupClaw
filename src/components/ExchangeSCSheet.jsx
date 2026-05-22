import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDownUp, X, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from './LanguageContext';

// fromToken drives direction:
//   DOS | SCV  →  SC  (normal, 1 DOS=1亿SC, 1 SCV=0.1亿SC)
//   SC         →  DOS (1亿SC=0.8DOS, integer, min 1亿)

const TOKENS = [
  { key: 'DOS', balance: 50,    label: 'DOS' },
  { key: 'SCV', balance: 1000,  label: 'SCV' },
  { key: 'SC',  balance: 32.11, label: 'SC'  },
];

const RATES = {
  DOS: { toSC: 1,   unit: 'SC' },  // 1 DOS = 1 亿 SC
  SCV: { toSC: 0.1, unit: 'SC' },  // 1 SCV = 0.1 亿 SC
};
const SC_TO_DOS = 0.8; // 1 亿 SC = 0.8 DOS

function TokenIcon({ tokenKey, size = 6 }) {
  const cls = `h-${size} w-${size} shrink-0`;
  if (tokenKey === 'DOS') return <img src="/assets/DOS.svg" alt="DOS" className={cls} />;
  if (tokenKey === 'SCV') return (
    <div className={`grid ${cls} place-items-center rounded-full text-[11px] font-bold text-white`}
      style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', fontSize: size < 7 ? 10 : 11 }}>V</div>
  );
  // SC
  return (
    <div className={`grid ${cls} place-items-center rounded-full font-bold text-white`}
      style={{ background: 'linear-gradient(135deg,var(--color-primary),#0a9090)', fontSize: size < 7 ? 11 : 13 }}>S</div>
  );
}

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

  const isSCFrom = fromToken === 'SC';
  const tokenInfo = TOKENS.find(t => t.key === fromToken);

  // ── Calculations ──
  const num = parseFloat(amount) || 0;

  // DOS/SCV → SC
  const rate = !isSCFrom ? RATES[fromToken].toSC : null;
  const willReceiveSC = !isSCFrom ? num * rate : 0;
  const insufficientNormal = !isSCFrom && num > 0 && num > tokenInfo.balance;
  const canSubmitNormal = !isSCFrom && num > 0 && !insufficientNormal;

  // SC → DOS
  const scMaxInt = Math.floor(tokenInfo.balance); // 32
  const isWholeUnit = Number.isInteger(num);
  const insufficientSC = isSCFrom && num > 0 && num > scMaxInt;
  const belowMinSC = isSCFrom && num > 0 && (num < 1 || !isWholeUnit);
  const willReceiveDOS = isSCFrom && isWholeUnit && !insufficientSC ? num * SC_TO_DOS : 0;
  const canSubmitSC = isSCFrom && isWholeUnit && num >= 1 && !insufficientSC;

  const canSubmit = isSCFrom ? canSubmitSC : canSubmitNormal;
  const fromInvalid = isSCFrom ? (insufficientSC || belowMinSC) : insufficientNormal;

  let errorMsg = null;
  if (!isSCFrom && insufficientNormal) errorMsg = lang === 'zh' ? '余额不足' : 'Insufficient balance';
  if (isSCFrom && insufficientSC)      errorMsg = lang === 'zh' ? '余额不足' : 'Insufficient balance';
  if (isSCFrom && belowMinSC && !insufficientSC) errorMsg = lang === 'zh' ? '最小兑换单位为 1 亿 SC' : 'Min unit: 1B SC';

  function selectToken(key) {
    if (key !== fromToken) { setFromToken(key); setAmount(''); }
    setMenuOpen(false);
  }

  function handleMax() {
    if (isSCFrom) setAmount(String(scMaxInt));
    else setAmount(String(tokenInfo.balance));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit?.(num, fromToken, isSCFrom ? 'from-sc' : 'to-sc');
    onClose();
  }

  // ── Display values ──
  const fromBalanceLabel = isSCFrom
    ? (lang === 'zh' ? `余额：${tokenInfo.balance} 亿 SC` : `Balance: ${tokenInfo.balance}B SC`)
    : (lang === 'zh' ? `余额：${tokenInfo.balance} ${fromToken}` : `Balance: ${tokenInfo.balance} ${fromToken}`);

  const toToken = isSCFrom ? 'DOS' : 'SC';
  const toBalanceSC   = 32.11;
  const toBalanceDOS  = TOKENS.find(t => t.key === 'DOS').balance;
  const toBalanceLabel = isSCFrom
    ? (lang === 'zh' ? `余额：${toBalanceDOS} DOS` : `Balance: ${toBalanceDOS} DOS`)
    : (lang === 'zh' ? `余额：${toBalanceSC} 亿 SC` : `Balance: ${toBalanceSC}B SC`);

  const toAmountStr = isSCFrom
    ? (canSubmitSC ? willReceiveDOS.toFixed(2) : '0.00')
    : (canSubmitNormal ? willReceiveSC.toFixed(2) : '0.00');
  const toAmountActive = isSCFrom ? canSubmitSC : canSubmitNormal;

  const rateLabel = isSCFrom
    ? (lang === 'zh' ? `1 亿 SC ≈ ${SC_TO_DOS} DOS` : `1B SC ≈ ${SC_TO_DOS} DOS`)
    : (lang === 'zh' ? `1 ${fromToken} ≈ ${rate} 亿 SC` : `1 ${fromToken} ≈ ${rate}B SC`);

  const cardStyle = { background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' };

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
        <div style={{ borderRadius: '20px 20px 0 0', background: 'var(--color-bg-page)', boxShadow: '0 -4px 32px rgba(13,21,39,0.14)' }}>
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
            <div className="rounded-2xl px-4 pt-3 pb-4" style={cardStyle}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-medium text-tokenSub">{lang === 'zh' ? '从' : 'From'}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-tokenHint">{fromBalanceLabel}</span>
                  <button
                    onClick={handleMax}
                    className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-tokenPrimary"
                    style={{ background: 'var(--color-primary-soft)' }}
                  >
                    {lang === 'zh' ? '全部' : 'Max'}
                  </button>
                </div>
              </div>

              <div
                className="flex items-end gap-3 rounded-xl px-3 py-2.5"
                style={{ background: 'var(--color-bg-page)', border: `1.5px solid ${fromInvalid ? 'var(--color-danger)' : 'var(--color-primary)'}` }}
              >
                {/* Token dropdown */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => setMenuOpen(o => !o)}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 active:opacity-70"
                    style={{ background: 'var(--color-bg-card)' }}
                  >
                    <TokenIcon tokenKey={fromToken} size={6} />
                    <span className="text-[15px] font-semibold text-tokenText">{fromToken}</span>
                    <ChevronDown className={`h-3.5 w-3.5 text-tokenSub transition-transform duration-150 ${menuOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                  </button>

                  {menuOpen && (
                    <div
                      className="absolute left-0 top-full z-10 mt-1.5 min-w-[140px] overflow-hidden rounded-xl py-1"
                      style={{ background: 'var(--color-bg-page)', boxShadow: '0 4px 20px rgba(13,21,39,0.16)', border: '1px solid var(--color-border)' }}
                    >
                      {TOKENS.map(({ key }) => (
                        <button
                          key={key}
                          onClick={() => selectToken(key)}
                          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left active:opacity-70"
                          style={{ background: key === fromToken ? 'var(--color-primary-soft)' : 'transparent' }}
                        >
                          <TokenIcon tokenKey={key} size={5} />
                          <span className="text-[14px] font-semibold text-tokenText">{key}</span>
                          {key === fromToken && <Check className="ml-auto h-3.5 w-3.5 text-tokenPrimary" strokeWidth={2.5} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  ref={inputRef}
                  type="number"
                  min={isSCFrom ? '1' : '0'}
                  step={isSCFrom ? '1' : 'any'}
                  value={amount}
                  onChange={e => { setMenuOpen(false); setAmount(e.target.value); }}
                  onFocus={() => setMenuOpen(false)}
                  placeholder={lang === 'zh' ? '输入数量' : 'Enter amount'}
                  className="min-w-0 flex-1 bg-transparent text-right font-num text-[26px] font-semibold leading-none outline-none placeholder:text-[18px] placeholder:text-tokenHint"
                  style={{ color: fromInvalid ? 'var(--color-danger)' : 'var(--color-text-primary)' }}
                />
                {isSCFrom && (
                  <span className="shrink-0 text-[16px] font-medium text-tokenSub">{lang === 'zh' ? '亿' : 'B'}</span>
                )}
              </div>

              {errorMsg && (
                <p className="mt-1.5 text-right text-[11px] text-tokenDanger">{errorMsg}</p>
              )}
            </div>

            {/* 方向箭头 */}
            <div className="flex justify-center py-3">
              <button
                disabled={fromToken === 'SCV'}
                onClick={() => { setFromToken(t => t === 'SC' ? 'DOS' : 'SC'); setAmount(''); }}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity"
                style={{
                  background: 'var(--color-bg-card)',
                  boxShadow: 'var(--shadow-sm)',
                  opacity: fromToken === 'SCV' ? 0.35 : 1,
                  cursor: fromToken === 'SCV' ? 'not-allowed' : 'pointer',
                }}
              >
                <ArrowDownUp className="h-4 w-4 text-tokenSub" strokeWidth={1.8} />
              </button>
            </div>

            {/* 到 */}
            <div className="rounded-2xl px-4 pt-3 pb-4" style={cardStyle}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-medium text-tokenSub">{lang === 'zh' ? '到' : 'To'}</span>
                <span className="text-[12px] text-tokenHint">{toBalanceLabel}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex shrink-0 items-center gap-2">
                  <TokenIcon tokenKey={toToken} size={7} />
                  <span className="text-[15px] font-semibold text-tokenText">{toToken}</span>
                </div>
                <div className="flex flex-1 items-baseline justify-end gap-1">
                  <span className="font-num text-[26px] font-semibold" style={{ color: toAmountActive ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                    {toAmountStr}
                  </span>
                  {!isSCFrom && <span className="text-[14px] font-medium text-tokenSub">{lang === 'zh' ? '亿' : 'B'}</span>}
                </div>
              </div>
            </div>

            {/* 汇率 */}
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <ArrowDownUp className="h-3 w-3 text-tokenHint" strokeWidth={2} />
              <span className="text-[12px] text-tokenHint">{rateLabel}</span>
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
