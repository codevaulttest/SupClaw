import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDownUp, X, ChevronDown, Check, CircleCheck, CircleX, Loader, Clock, CreditCard } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { formatScAmount } from '../utils/formatSc';

// fromToken drives direction:
//   DOS  →  SC  (1 DOS = 1 亿 SC)
//   SC   →  DOS (1 亿 SC = 0.8 DOS, 整数, 最小 1 亿)

const TOKENS = [
  { key: 'DOS', balance: 50,    label: 'DOS' },
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
  const scPx = size < 7 ? (size < 6 ? 8 : 10) : 11;
  const cls = `h-${size} w-${size} shrink-0`;
  if (tokenKey === 'DOS') return <img src="/assets/DOS.svg" alt="DOS" className={cls} />;
  if (tokenKey === 'SCV') return (
    <div className={`grid ${cls} place-items-center rounded-full font-bold text-white`}
      style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', fontSize: px }}>V</div>
  );
  return (
    <div className={`grid ${cls} place-items-center rounded-full font-bold text-white`}
      style={{ background: 'linear-gradient(135deg,var(--color-primary),#0a9090)', fontSize: scPx }}>SC</div>
  );
}

export default function ExchangeSCSheet({ onClose, onSubmit, devForceInvalid = false }) {
  const { lang } = useLanguage();
  const [tab, setTab] = useState('swap'); // 'swap' | 'card'
  const [fromToken, setFromToken] = useState('DOS');
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [toMenuOpen, setToMenuOpen] = useState(false);
  const [amount,    setAmount]    = useState('');
  const [cardNo,    setCardNo]    = useState('');
  const [cardPwd,   setCardPwd]   = useState('');
  const [cardResult, setCardResult] = useState(null); // null | { valid, amount }
  const [cardChecking, setCardChecking] = useState(false);
  const inputRef = useRef(null);
  const cardCheckTimer = useRef(null);

  const isSCFrom = fromToken === 'SC';

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  function selectToken(key) {
    if (key !== fromToken) {
      setFromToken(key);
      setAmount('');
    }
    setMenuOpen(false);
    setToMenuOpen(false);
  }

  function selectToToken(key) {
    if (key !== toToken) {
      setFromToken(key === 'DOS' ? 'SC' : 'DOS');
      setAmount('');
    }
    setMenuOpen(false);
    setToMenuOpen(false);
  }

  // 实体卡校验并提交
  function handleCardSubmit() {
    if (!cardNo.trim() || !cardPwd.trim() || cardChecking) return;
    setCardChecking(true);
    clearTimeout(cardCheckTimer.current);
    cardCheckTimer.current = setTimeout(() => {
      setCardChecking(false);
      const result = mockValidateCode(cardNo, devForceInvalid);
      setCardResult(result);
      if (result.valid) {
        onSubmit?.(result.amount, 'CARD', 'physical-card');
        onClose();
      }
    }, 800);
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

  const canSubmit  = isSCFrom ? canSC : canDOS;

  // 边框颜色
  const fromInvalid = isSCFrom ? (insuffSC || belowMin) : insuffDOS;
  const borderColor = fromInvalid ? 'var(--color-danger)' : 'var(--color-primary)';

  // 错误提示
  let errorMsg = null;
  if (!isSCFrom && insuffDOS)             errorMsg = lang === 'zh' ? '余额不足' : 'Insufficient balance';
  if (isSCFrom && insuffSC)               errorMsg = lang === 'zh' ? '余额不足' : 'Insufficient balance';
  if (isSCFrom && belowMin && !insuffSC)  errorMsg = lang === 'zh' ? '最小兑换单位为 1 亿 SC' : 'Minimum amount: 100M SC';

  function handleSubmit() {
    if (!canSubmit) return;
    if (isSCFrom) onSubmit?.(numSC, 'SC', 'from-sc');
    else          onSubmit?.(numDos, 'DOS', 'to-sc');
    onClose();
  }

  // 实体卡表单可提交条件
  const canCardSubmit = cardNo.trim().length > 0 && cardPwd.trim().length > 0 && !cardChecking;

  // ── "到" 面板数据 ──
  const toToken = isSCFrom ? 'DOS' : 'SC';
  const scBalanceDisplay = formatScAmount(scToken.balance, lang);
  const toBalanceLabel = isSCFrom
    ? (lang === 'zh' ? `余额：${dosToken.balance} DOS` : `Balance: ${dosToken.balance} DOS`)
    : (lang === 'zh' ? `余额：${scBalanceDisplay.text}` : `Balance: ${scBalanceDisplay.text}`);

  const toScYiAmount = !isSCFrom && canDOS ? numDos * RATES.DOS : 0;
  const toScDisplay = formatScAmount(toScYiAmount, lang);

  const toAmountStr = isSCFrom
    ? (canSC ? (numSC * SC_TO_DOS).toFixed(2) : '0.00')
    : (canDOS ? toScDisplay.value : '0.00');
  const toAmountActive = isSCFrom ? canSC : canDOS;

  // 汇率行
  const rateLabel = isSCFrom
    ? (lang === 'zh' ? `1 亿 SC ≈ ${SC_TO_DOS} DOS` : `100M SC ≈ ${SC_TO_DOS} DOS`)
    : (lang === 'zh' ? `1 DOS ≈ ${RATES.DOS} 亿 SC` : `1 DOS ≈ 100M SC`);

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

          {/* Tabs */}
          <div className="mx-4 mb-1 flex border-b border-tokenBorderSubtle">
            {[
              { key: 'swap', label: lang === 'zh' ? '兑换' : 'Swap' },
              { key: 'card', label: lang === 'zh' ? 'SC 实体卡' : 'Physical Card' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="mr-5 pb-2 text-[14px] font-semibold leading-[20px]"
                style={{
                  color: tab === key ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  borderBottom: tab === key ? '2px solid var(--color-primary)' : '2px solid transparent',
                  marginBottom: '-1px',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="px-4 pt-2 pb-6">

            {tab === 'swap' ? (
              <>
                {/* 从 */}
                <div className="rounded-2xl px-4 pt-3 pb-4" style={cardStyle}>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[13px] font-medium text-tokenSub">{lang === 'zh' ? '从' : 'From'}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] text-tokenHint">
                        {isSCFrom
                          ? (lang === 'zh' ? `余额：${scBalanceDisplay.text}` : `Balance: ${scBalanceDisplay.text}`)
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
                  </div>

                  <div
                    className="flex items-end gap-3 rounded-xl px-3 py-2.5"
                    style={{ background: 'var(--color-bg-page)', border: `1.5px solid ${borderColor}`, transition: 'border-color 0.2s' }}
                  >
                    <div className="relative shrink-0">
                      <button
                        onClick={() => { setToMenuOpen(false); setMenuOpen(o => !o); }}
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
                      <span className="shrink-0 text-[14px] font-medium text-tokenSub">{lang === 'zh' ? '亿' : '×100M SC'}</span>
                    )}
                  </div>

                  {isSCFrom && !errorMsg && (
                    <p className="mt-1.5 flex items-center gap-1 text-[12px]" style={{ color: '#f59e0b' }}>
                      <Clock className="h-3 w-3 shrink-0" strokeWidth={2} />
                      {lang === 'zh' ? 'SC 兑 DOS 预计 48 小时内到账' : 'DOS will arrive within 48 hours'}
                    </p>
                  )}
                  {errorMsg && (
                    <p className="mt-1.5 text-right text-[11px] text-tokenDanger">{errorMsg}</p>
                  )}
                </div>

                {/* 方向箭头 */}
                <div className="flex justify-center py-3">
                  <button
                    onClick={() => { setFromToken(t => t === 'SC' ? 'DOS' : 'SC'); setAmount(''); setMenuOpen(false); setToMenuOpen(false); }}
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}
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
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => { setMenuOpen(false); setToMenuOpen(o => !o); }}
                        className="flex items-center gap-2 rounded-lg px-2 py-1 active:opacity-70"
                        style={{ background: 'var(--color-bg-card)' }}
                      >
                        <TokenIcon tokenKey={toToken} size={7} />
                        <span className="text-[15px] font-semibold text-tokenText">{toToken}</span>
                        <ChevronDown className={`h-3.5 w-3.5 text-tokenSub transition-transform duration-150 ${toMenuOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                      </button>
                      {toMenuOpen && (
                        <div
                          className="absolute left-0 top-full z-10 mt-1.5 min-w-[140px] overflow-hidden rounded-xl py-1"
                          style={{ background: 'var(--color-bg-page)', boxShadow: '0 4px 20px rgba(13,21,39,0.16)', border: '1px solid var(--color-border)' }}
                        >
                          {['DOS', 'SC'].map(key => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => selectToToken(key)}
                              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left active:opacity-70"
                              style={{ background: key === toToken ? 'var(--color-primary-soft)' : 'transparent' }}
                            >
                              <TokenIcon tokenKey={key} size={5} />
                              <span className="text-[14px] font-semibold text-tokenText">{key}</span>
                              {key === toToken && <Check className="ml-auto h-3.5 w-3.5 text-tokenPrimary" strokeWidth={2.5} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 items-baseline justify-end gap-1">
                      <span className="font-num text-[26px] font-semibold" style={{ color: toAmountActive ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                        {toAmountStr}
                      </span>
                      {!isSCFrom && <span className="text-[14px] font-medium text-tokenSub">{toScDisplay.unit}</span>}
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
              </>
            ) : (
              /* ── SC 实体卡 tab ── */
              <>
                <div className="rounded-2xl px-4 pt-4 pb-5 flex flex-col gap-4" style={cardStyle}>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 shrink-0 text-tokenPrimary" strokeWidth={2} />
                    <span className="text-[13px] font-medium text-tokenSub">
                      {lang === 'zh' ? 'SC 实体卡' : 'SC Physical Card'}
                    </span>
                  </div>

                  {/* 卡号 */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] text-tokenHint">{lang === 'zh' ? '卡号' : 'Card Number'}</label>
                    <input
                      type="text"
                      value={cardNo}
                      onChange={e => { setCardNo(e.target.value); setCardResult(null); }}
                      placeholder={lang === 'zh' ? '请输入实体卡卡号' : 'Enter card number'}
                      className="w-full rounded-xl px-3 py-3 text-[15px] font-semibold tracking-widest outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-tokenHint"
                      style={{
                        background: 'var(--color-bg-page)',
                        border: `1.5px solid ${cardResult !== null && !cardResult.valid ? 'var(--color-danger)' : 'var(--color-border)'}`,
                        color: 'var(--color-text-primary)',
                        transition: 'border-color 0.2s',
                      }}
                    />
                  </div>

                  {/* 密码 */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] text-tokenHint">{lang === 'zh' ? '密码' : 'Password'}</label>
                    <input
                      type="password"
                      value={cardPwd}
                      onChange={e => { setCardPwd(e.target.value); setCardResult(null); }}
                      placeholder={lang === 'zh' ? '请输入实体卡密码' : 'Enter card password'}
                      className="w-full rounded-xl px-3 py-3 text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-tokenHint"
                      style={{
                        background: 'var(--color-bg-page)',
                        border: `1.5px solid ${cardResult !== null && !cardResult.valid ? 'var(--color-danger)' : 'var(--color-border)'}`,
                        color: 'var(--color-text-primary)',
                        transition: 'border-color 0.2s',
                      }}
                    />
                  </div>

                  {/* 错误提示 */}
                  {cardResult !== null && !cardResult.valid && (
                    <div className="flex items-center gap-2">
                      <CircleX className="h-3.5 w-3.5 shrink-0 text-tokenDanger" strokeWidth={2} />
                      <span className="text-[12px] font-medium text-tokenDanger">
                        {lang === 'zh' ? '卡号或密码无效，请重新确认' : 'Invalid card number or password'}
                      </span>
                    </div>
                  )}
                </div>

                {/* 校验并提交 */}
                <div className="mt-5">
                  <button
                    onClick={handleCardSubmit}
                    disabled={!canCardSubmit}
                    className="w-full py-[14px] text-[15px] font-semibold flex items-center justify-center gap-2"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      background: canCardSubmit ? 'var(--color-primary)' : 'var(--color-border)',
                      color: canCardSubmit ? '#fff' : 'var(--color-text-hint)',
                      boxShadow: canCardSubmit ? '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' : 'none',
                    }}
                  >
                    {cardChecking && <Loader className="h-4 w-4 animate-spin" strokeWidth={2} />}
                    {lang === 'zh' ? '校验并提交' : 'Verify & Submit'}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
