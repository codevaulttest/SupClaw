import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Mail, Minus, Play, Plus, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const USER_EMAIL = 'zhangsan@gmail.com';
const BALANCES = { A: 5.20, B: 3.00, C: 1.80 };
const SC_BALANCE = 32.11;
const SC_RATE = { A: 5, B: 3, C: 1 };
const TYPE_INFO = {
  A: { label: '品牌定制版', v: 'a' },
  B: { label: '创意文案版', v: 'b' },
  C: { label: '极速盲盒版', v: 'c' },
};

function formatBookTitle(title) {
  if (!title || title.startsWith('《') || /^[A-Za-z0-9\s',:.-]+$/.test(title)) return title;
  return `《${title}》`;
}

export default function ProductOrderSheet({ product, onClose, onOrdered, onOpenBuy, onOpenExchange }) {
  const { lang } = useLanguage();
  const [qty, setQty] = useState(1);
  const [qtyDraft, setQtyDraft] = useState('');
  const [email, setEmail] = useState(USER_EMAIL);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const type = product.type;
  const info = TYPE_INFO[type];
  const v = info.v;
  const unitABC = product.price;
  const totalABC = qty * unitABC;
  const totalSC = +(totalABC * SC_RATE[type] * 0.1).toFixed(2);
  const duration = qty * product.duration;

  const abcBal = BALANCES[type];
  const abcInsufficient = totalABC > abcBal;
  const scInsufficient = totalSC > SC_BALANCE;
  const canOrder = !abcInsufficient && !scInsufficient && emailValid;

  function handleOrder() {
    if (!canOrder) return;
    onClose();
    onOrdered?.();
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
          className="max-h-[86vh] overflow-y-auto no-scrollbar"
          style={{
            borderRadius: '20px 20px 0 0',
            background: 'var(--color-bg-page)',
            boxShadow: '0 -4px 32px rgba(13,21,39,0.14)',
          }}
        >
          <div className="relative flex items-center justify-center px-4 pt-3 pb-2">
            <div className="absolute top-3 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full" style={{ background: 'var(--color-border)' }} />
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="w-8" />
              <span className="text-[17px] font-semibold text-tokenText">{formatBookTitle(product.title)}</span>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--color-bg-card)' }}>
                <X className="h-4 w-4 text-tokenSub" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="px-4 pb-6 pt-2">
            <div className="mb-5 flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="relative shrink-0 h-12 w-12 rounded-xl overflow-hidden" style={{ background: `linear-gradient(135deg, var(--token-${v}-from), var(--token-${v}-to))` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-5 w-5 fill-white text-white" strokeWidth={0} />
                </div>
                <span className="absolute left-1 top-1 rounded px-1 text-[9px] font-bold text-white leading-4" style={{ background: 'rgba(0,0,0,0.28)' }}>{type}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-tokenText">{formatBookTitle(product.title)}</p>
                <p className="mt-0.5 text-[12px] text-tokenHint">
                  {lang === 'zh' ? info.label : { A: 'Brand Custom', B: 'Creative Copy', C: 'Surprise Drop' }[type]}
                  {' · '}{product.duration}{lang === 'zh' ? '秒' : 's'}
                  {' · '}<span style={{ color: `var(--token-${v}-text)` }}>{unitABC} {type}SC</span>
                </p>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-xl px-5 py-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="min-w-0">
                <p className="text-[13px] text-tokenSub">{lang === 'zh' ? '兑换数量' : 'Quantity'}</p>
                <p className="mt-1 flex items-baseline gap-1 whitespace-nowrap">
                  <span className="font-num text-[28px] font-bold leading-none" style={{ color: `var(--token-${v}-from)` }}>{duration}</span>
                  <span className="text-[15px] font-semibold" style={{ color: `var(--token-${v}-from)` }}>{lang === 'zh' ? '秒视频' : 'sec video'}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { const next = Math.max(1, qty - 1); setQty(next); setQtyDraft(''); }} className="flex h-9 w-9 items-center justify-center rounded-full border border-tokenBorder">
                  <Minus className="h-4 w-4 text-tokenText" strokeWidth={2} />
                </button>
                <input
                  type="number"
                  min="1"
                  value={qtyDraft !== '' ? qtyDraft : qty}
                  onChange={e => {
                    setQtyDraft(e.target.value);
                    const n = parseInt(e.target.value, 10);
                    if (Number.isFinite(n) && n >= 1) setQty(n);
                  }}
                  onBlur={() => { setQtyDraft(''); if (qty < 1) setQty(1); }}
                  className="text-center font-num text-[22px] font-semibold text-tokenText bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ width: '4rem' }}
                />
                <button onClick={() => { setQty(q => q + 1); setQtyDraft(''); }} className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: `var(--token-${v}-from)` }}>
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="mb-4 rounded-xl px-5 py-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              <p className="mb-3 text-[13px] font-semibold text-tokenText">{lang === 'zh' ? '组合支付' : 'Split Payment'}</p>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[13px] text-tokenSub">{type}SC</span>
                <span className="font-num text-[15px] font-semibold" style={{ color: `var(--token-${v}-text)` }}>{totalABC} {type}SC</span>
              </div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] text-tokenSub">SC (+10%)</span>
                <span className="font-num text-[15px] font-semibold text-tokenPrimary">{totalSC} {lang === 'zh' ? '亿 SC' : 'B SC'}</span>
              </div>
              <div className="mb-3 h-px bg-tokenBorderSubtle" />
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-tokenHint">{lang === 'zh' ? `${type}SC 余额 / SC 余额` : `${type}SC Balance / SC Balance`}</span>
                <span className="text-[12px]" style={{ color: abcInsufficient || scInsufficient ? 'var(--color-danger)' : 'var(--color-success)' }}>
                  {abcBal} {type}SC / {SC_BALANCE} {lang === 'zh' ? '亿 SC' : 'B SC'}
                </span>
              </div>
            </div>

            {abcInsufficient && (
              <div className="mb-3 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'var(--color-danger-soft)' }}>
                <span className="text-[12px] text-tokenDanger">{lang === 'zh' ? `${type}SC 余额不足` : `Insufficient ${type}SC balance`}</span>
                <button onClick={onOpenBuy} className="text-[12px] font-semibold text-tokenDanger underline">{lang === 'zh' ? '去兑换首发权' : 'Swap for Premiere Access'}</button>
              </div>
            )}
            {!abcInsufficient && scInsufficient && (
              <div className="mb-3 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'var(--color-danger-soft)' }}>
                <span className="text-[12px] text-tokenDanger">{lang === 'zh' ? 'SC 余额不足' : 'Insufficient SC balance'}</span>
                <button onClick={onOpenExchange} className="text-[12px] font-semibold text-tokenDanger underline">{lang === 'zh' ? '去兑换 SC' : 'Swap SC'}</button>
              </div>
            )}

            <div className="mb-4 rounded-xl px-4 py-3" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)', border: `1px solid ${!emailValid && email ? 'var(--color-danger)' : 'transparent'}` }}>
              <p className="mb-2 text-[13px] font-semibold text-tokenText">
                {lang === 'zh' ? '视频接收邮箱' : 'Delivery Email'}
                <span className="ml-1 text-tokenDanger">*</span>
              </p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-tokenHint" strokeWidth={1.8} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-[14px] text-tokenText outline-none placeholder:text-tokenHint"
                  placeholder="email@example.com"
                />
              </div>
              {!emailValid && email && (
                <p className="mt-1.5 text-[11px] text-tokenDanger">{lang === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email'}</p>
              )}
            </div>

            <button
              onClick={handleOrder}
              disabled={!canOrder}
              className="w-full py-[14px] text-[15px] font-semibold text-white"
              style={{
                borderRadius: 'var(--radius-md)',
                background: canOrder ? `linear-gradient(135deg, var(--token-${v}-from), var(--token-${v}-to))` : 'var(--color-border)',
                color: canOrder ? '#fff' : 'var(--color-text-hint)',
                boxShadow: canOrder ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {lang === 'zh' ? `确认兑换 · ${duration} 秒视频` : `Confirm Order · ${duration}s video`}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
