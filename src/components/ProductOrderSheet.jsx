import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';

const BALANCES = { A: 5.20, B: 3.00, C: 1.80 };
const SC_BALANCE = 32.11;
const SC_RATE = { A: 5, B: 3, C: 1 };
const TYPE_INFO = {
  A: { label: '品牌定制版', v: 'a' },
  B: { label: '创意文案版', v: 'b' },
  C: { label: '极速盲盒版', v: 'c' },
};

export default function ProductOrderSheet({ product, onClose, onOpenBuy, onOpenExchange }) {
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [ordered, setOrdered] = useState(false);

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
  const canOrder = !abcInsufficient && !scInsufficient;

  function handleOrder() {
    if (!canOrder) return;
    setOrdered(true);
    setTimeout(() => {
      onClose();
      navigate('/orders');
    }, 1400);
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
              <span className="text-[17px] font-semibold text-tokenText">{product.title}</span>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--color-bg-card)' }}>
                <X className="h-4 w-4 text-tokenSub" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="px-4 pb-6 pt-2">
            <div className="mb-5 overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
              <div className="flex h-[120px] items-end px-5 pb-4" style={{ background: `linear-gradient(135deg, var(--token-${v}-from), var(--token-${v}-to))` }}>
                <div>
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.25)' }}>
                    {type} · {info.label}
                  </span>
                  <p className="mt-2 text-[18px] font-bold text-white">{product.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-tokenCard px-5 py-3">
                <div>
                  <p className="text-[11px] text-tokenHint">每单时长</p>
                  <p className="font-num text-[16px] font-semibold text-tokenText">{product.duration} 秒</p>
                </div>
                <div className="h-8 w-px bg-tokenBorder" />
                <div>
                  <p className="text-[11px] text-tokenHint">单价</p>
                  <p className="font-num text-[16px] font-semibold" style={{ color: `var(--token-${v}-text)` }}>
                    {unitABC}亿 {type}SC + {(unitABC * SC_RATE[type] * 0.1).toFixed(1)}亿 SC
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-xl px-5 py-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="min-w-0">
                <p className="text-[13px] text-tokenSub">购买数量</p>
                <p className="mt-1 flex items-baseline gap-1 whitespace-nowrap">
                  <span className="font-num text-[28px] font-bold leading-none text-tokenPrimary">{duration}</span>
                  <span className="text-[15px] font-semibold text-tokenPrimary">秒视频</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-tokenBorder">
                  <Minus className="h-4 w-4 text-tokenText" strokeWidth={2} />
                </button>
                <span className="w-8 text-center font-num text-[22px] font-semibold text-tokenText">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: `var(--token-${v}-from)` }}>
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="mb-4 rounded-xl px-5 py-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              <p className="mb-3 text-[13px] font-semibold text-tokenText">组合支付</p>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[13px] text-tokenSub">{type}SC 词元</span>
                <span className="font-num text-[15px] font-semibold" style={{ color: `var(--token-${v}-text)` }}>{totalABC} 亿 {type}SC</span>
              </div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] text-tokenSub">SC 词元（+10%）</span>
                <span className="font-num text-[15px] font-semibold text-tokenPrimary">{totalSC} 亿 SC</span>
              </div>
              <div className="mb-3 h-px bg-tokenBorderSubtle" />
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-tokenHint">{type}SC 余额 / SC 余额</span>
                <span className="text-[12px]" style={{ color: abcInsufficient || scInsufficient ? 'var(--color-danger)' : 'var(--color-success)' }}>
                  {abcBal} / {SC_BALANCE}
                </span>
              </div>
            </div>

            {abcInsufficient && (
              <div className="mb-3 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'var(--color-danger-soft)' }}>
                <span className="text-[12px] text-tokenDanger">{type}SC 余额不足</span>
                <button onClick={onOpenBuy} className="text-[12px] font-semibold text-tokenDanger underline">去兑换首发权</button>
              </div>
            )}
            {!abcInsufficient && scInsufficient && (
              <div className="mb-3 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'var(--color-danger-soft)' }}>
                <span className="text-[12px] text-tokenDanger">SC 余额不足</span>
                <button onClick={onOpenExchange} className="text-[12px] font-semibold text-tokenDanger underline">去兑换 SC</button>
              </div>
            )}

            {ordered ? (
              <div className="flex items-center justify-center gap-2 rounded-xl py-4" style={{ background: 'var(--color-success-soft)', border: '1px solid var(--color-primary-border)' }}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="var(--color-success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-[15px] font-semibold text-tokenSuccess">下单成功，跳转订单…</span>
              </div>
            ) : (
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
                确认下单 · {duration} 秒视频
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
