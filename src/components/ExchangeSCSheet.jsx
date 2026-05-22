import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDownUp, X, ChevronDown, Check, CircleCheck, CircleX, Loader } from 'lucide-react';
import { useLanguage } from './LanguageContext';

// fromToken drives direction:
//   DOS  →  SC  (1 DOS = 1 亿 SC)
//   SCV  →  SC  (激活码兑换, 刮刮码)
//   SC   →  DOS (1 亿 SC = 0.8 DOS, 整数, 最小 1 亿)

const TOKENS = [
  { key: 'DOS', balance: 50,    label: 'DOS' },
  { key: 'SCV', balance: null,  label: 'SCV' },  // SCV 用激活码，无余额概念
  { key: 'SC',  balance: 32.11, label: 'SC'  },
];

const RATES = { DOS: 1 };   // 1 DOS = 1 亿 SC
const SC_TO_DOS = 0.8;       // 1 亿 SC = 0.8 DOS

// 模拟激活码校验（实际对接 API 时在此替换）
// forceInvalid: 开发者面板强制走失败分支
function mockValidateCode(raw, forceInvalid = false) {
  const clean = raw.replace(/[\s\-]/g, '');
  if (!clean) return { valid: false };
  if (forceInvalid) return { valid: false };
  const tiers = [100, 500, 1000];
  const amount = tiers[clean.charCodeAt(0) % 3];
  return { valid: true, amount };
}

function TokenIcon({ tokenKey, size = 6 }) {
  const px = size < 7 ? (size < 6 ? 10 : 11) : 13;
  const cls = `h-${size} w-${size} shrink-0`;
  if (tokenKey === 'DOS') return <img src="/assets/DOS.svg" alt="DOS" className={cls} />;
  if (tokenKey === 'SCV') return (
    <div className={`grid ${cls} place-items-center rounded-full font-bold text-white`}
      style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', fontSize: px }}>V</div>
  );
  return (
    <div className={`grid ${cls} place-items-center rounded-full font-bold text-white`}
      style={{ background: 'linear-gradient(135deg,var(--color-primary),#0a9090)', fontSize: px }}>S</div>
  );
}

export default function ExchangeSCSheet({ onClose, onSubmit, devForceInvalid = false }) {
  const { lang } = useLanguage();
  const [fromToken, setFromToken] = useState('DOS');
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [amount,    setAmount]    = useState('');   // DOS / SC 数量
  const [code,      setCode]      = useState('');   // SCV 激活码
  const [codeResult, setCodeResult] = useState(null); // null | { valid, amount }
  const [checking,   setChecking]   = useState(false);
  const inputRef = useRef(null);
  const checkTimer = useRef(null);

  const isSCV  = fromToken === 'SCV';
  const isSCFrom = fromToken === 'SC';

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  // 切换 token 时清空输入
  function selectToken(key) {
    if (key !== fromToken) {
      setFromToken(key);
      setAmount('');
      setCode('');
      setCodeResult(null);
    }
    setMenuOpen(false);
  }

  // 激活码输入 → 清空旧结果
  function handleCodeChange(e) {
    setCode(e.target.value);
    setCodeResult(null);
    setChecking(false);
  }

  // 手动点击"校验"
  function handleVerify() {
    if (!code.trim() || checking) return;
    setChecking(true);
    clearTimeout(checkTimer.current);
    checkTimer.current = setTimeout(() => {
      setChecking(false);
      setCodeResult(mockValidateCode(code, devForceInvalid));
    }, 600);
  }

  // ── DOS → SC ──
  const dosToken   = TOKENS.find(t => t.key === 'DOS');
  const numDos     = parseFloat(amount) || 0;
  const insuffDOS  = numDos > 0 && numDos > dosToken.balance;
  const canDOS     = numDos > 0 && !insuffDOS;

  // ── SC → DOS ──
  const scToken    = TOKENS.find(t => t.key === 'SC');
  const scMaxInt   = Math.floor(scToken.balance); // 32
  const numSC      = parseFloat(amount) || 0;
  const isWhole    = Number.isInteger(numSC);
  const insuffSC   = numSC > 0 && numSC > scMaxInt;
  const belowMin   = numSC > 0 && (numSC < 1 || !isWhole);
  const canSC      = isWhole && numSC >= 1 && !insuffSC;

  // ── SCV 激活码 ──
  const canSCV     = isSCV && codeResult?.valid === true;

  const canSubmit  = isSCV ? canSCV : isSCFrom ? canSC : canDOS;

  // 边框颜色
  const fromInvalid = isSCV
    ? (codeResult !== null && !codeResult.valid)
    : isSCFrom ? (insuffSC || belowMin) : insuffDOS;
  const borderColor = fromInvalid ? 'var(--color-danger)'
    : (isSCV && codeResult?.valid) ? 'var(--color-success, #10b981)'
    : 'var(--color-primary)';

  // 错误提示
  let errorMsg = null;
  if (!isSCV && !isSCFrom && insuffDOS) errorMsg = lang === 'zh' ? '余额不足' : 'Insufficient balance';
  if (isSCFrom && insuffSC)             errorMsg = lang === 'zh' ? '余额不足' : 'Insufficient balance';
  if (isSCFrom && belowMin && !insuffSC) errorMsg = lang === 'zh' ? '最小兑换单位为 1 亿 SC' : 'Min unit: 1B SC';

  function handleSubmit() {
    if (!canSubmit) return;
    if (isSCV)     onSubmit?.(codeResult.amount, 'SCV', 'code');
    else if (isSCFrom) onSubmit?.(numSC, 'SC', 'from-sc');
    else           onSubmit?.(numDos, 'DOS', 'to-sc');
    onClose();
  }

  // ── "到" 面板数据 ──
  const toToken = isSCFrom ? 'DOS' : 'SC';
  const toBalanceLabel = isSCFrom
    ? (lang === 'zh' ? `余额：${dosToken.balance} DOS` : `Balance: ${dosToken.balance} DOS`)
    : (lang === 'zh' ? `余额：${scToken.balance} 亿 SC` : `Balance: ${scToken.balance}B SC`);

  const toAmountStr = isSCV
    ? (codeResult?.valid ? String(codeResult.amount) : '0.00')
    : isSCFrom
      ? (canSC ? (numSC * SC_TO_DOS).toFixed(2) : '0.00')
      : (canDOS ? (numDos * RATES.DOS).toFixed(2) : '0.00');
  const toAmountActive = isSCV ? canSCV : isSCFrom ? canSC : canDOS;

  // 汇率行
  const showRate = !isSCV;
  const rateLabel = isSCFrom
    ? (lang === 'zh' ? `1 亿 SC ≈ ${SC_TO_DOS} DOS` : `1B SC ≈ ${SC_TO_DOS} DOS`)
    : (lang === 'zh' ? `1 DOS ≈ ${RATES.DOS} 亿 SC` : `1 DOS ≈ ${RATES.DOS}B SC`);

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
              <span className="text-[17px] font-semibold text-tokenText">{lang === 'zh' ? '兑换' : 'Swap'}</span>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--color-bg-card)' }}>
                <X className="h-4 w-4 text-tokenSub" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="px-4 pt-2 pb-6">

            {/* 从 */}
            <div className="rounded-2xl px-4 pt-3 pb-4" style={cardStyle}>
              {/* 从 header */}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-medium text-tokenSub">{lang === 'zh' ? '从' : 'From'}</span>
                {/* SCV 不显示余额/全部 */}
                {!isSCV && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-tokenHint">
                      {isSCFrom
                        ? (lang === 'zh' ? `余额：${scToken.balance} 亿 SC` : `Balance: ${scToken.balance}B SC`)
                        : (lang === 'zh' ? `余额：${dosToken.balance} DOS` : `Balance: ${dosToken.balance} DOS`)}
                    </span>
                    <button
                      onClick={() => isSCFrom ? setAmount(String(scMaxInt)) : setAmount(String(dosToken.balance))}
                      className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-tokenPrimary"
                      style={{ background: 'var(--color-primary-soft)' }}
                    >
                      {lang === 'zh' ? '全部' : 'Max'}
                    </button>
                  </div>
                )}
              </div>

              {/* 输入框 */}
              <div
                className={`flex gap-3 rounded-xl px-3 py-2.5 ${isSCV ? 'items-center' : 'items-end'}`}
                style={{ background: 'var(--color-bg-page)', border: `1.5px solid ${borderColor}`, transition: 'border-color 0.2s' }}
              >
                {/* Token 下拉 */}
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

                {/* SCV：文本激活码输入 */}
                {isSCV ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={code}
                    onChange={handleCodeChange}
                    onFocus={() => setMenuOpen(false)}
                    placeholder={lang === 'zh' ? '输入激活码' : 'Enter activation code'}
                    className="min-w-0 flex-1 bg-transparent text-right font-num text-[18px] font-semibold leading-none outline-none tracking-widest placeholder:text-[15px] placeholder:tracking-normal placeholder:text-tokenHint"
                    style={{ color: fromInvalid ? 'var(--color-danger)' : 'var(--color-text-primary)' }}
                  />
                ) : (
                  /* DOS / SC：数字输入 */
                  <>
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
                  </>
                )}
              </div>

              {/* 校验按钮 + 状态提示 */}
              {isSCV && (
                <div className="mt-2 flex items-center justify-end gap-2 min-h-[24px]">
                  <div className="flex items-center gap-2">
                  {codeResult === null && code.trim() && (
                    <button
                      onClick={handleVerify}
                      disabled={checking}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold text-white"
                      style={{ background: checking ? 'var(--color-border)' : 'var(--color-primary)' }}
                    >
                      {checking && <Loader className="h-3 w-3 animate-spin" strokeWidth={2} />}
                      {lang === 'zh' ? '校验' : 'Verify'}
                    </button>
                  )}
                  {codeResult?.valid && (
                    <>
                      <CircleCheck className="h-3.5 w-3.5 shrink-0" strokeWidth={2} style={{ color: 'var(--color-success, #10b981)' }} />
                      <span className="text-[12px] font-medium" style={{ color: 'var(--color-success, #10b981)' }}>
                        {lang === 'zh' ? `可用 · 充值额度 ${codeResult.amount} 亿 SC` : `Valid · ${codeResult.amount}B SC`}
                      </span>
                    </>
                  )}
                  {codeResult !== null && !codeResult.valid && (
                    <>
                      <CircleX className="h-3.5 w-3.5 shrink-0 text-tokenDanger" strokeWidth={2} />
                      <span className="text-[12px] font-medium text-tokenDanger">
                        {lang === 'zh' ? '无效或已使用' : 'Invalid or already used'}
                      </span>
                    </>
                  )}
                  </div>{/* end right group */}
                </div>
              )}
              {errorMsg && (
                <p className="mt-1.5 text-right text-[11px] text-tokenDanger">{errorMsg}</p>
              )}
            </div>

            {/* 方向箭头 */}
            <div className="flex justify-center py-3">
              <button
                disabled={isSCV}
                onClick={() => { setFromToken(t => t === 'SC' ? 'DOS' : 'SC'); setAmount(''); }}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity"
                style={{
                  background: 'var(--color-bg-card)',
                  boxShadow: 'var(--shadow-sm)',
                  opacity: isSCV ? 0.35 : 1,
                  cursor: isSCV ? 'not-allowed' : 'pointer',
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

            {/* 汇率（SCV 不显示） */}
            {showRate && (
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <ArrowDownUp className="h-3 w-3 text-tokenHint" strokeWidth={2} />
                <span className="text-[12px] text-tokenHint">{rateLabel}</span>
              </div>
            )}

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
