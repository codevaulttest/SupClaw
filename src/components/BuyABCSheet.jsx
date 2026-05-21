import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, ArrowLeftRight, X } from 'lucide-react';
import InfoTip from './InfoTip';

const SC_BALANCE = 32.11;
const PRICES = { A: 5, B: 3, C: 1 };
const TIPS = {
  A: 'A 类专用词元，用于兑换 A 类 AI 视频商品；购买价为 5 亿 SC = 1 亿 ASC，兑换商品时还需支付 10% 附加 SC',
  B: 'B 类专用词元，用于兑换 B 类 AI 视频商品；购买价为 3 亿 SC = 1 亿 BSC，兑换商品时还需支付 10% 附加 SC',
  C: 'C 类专用词元，用于兑换 C 类 AI 视频商品；购买价为 1 亿 SC = 1 亿 CSC，兑换商品时还需支付 10% 附加 SC',
};
const TOKEN_V = { A: 'a', B: 'b', C: 'c' };

export default function BuyABCSheet({ onClose, onOpenExchange }) {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ A: 0, B: 0, C: 0 });
  const [phase, setPhase] = useState('cart');

  const total = Object.entries(counts).reduce((s, [k, v]) => s + v * PRICES[k], 0);
  const isEmpty = total === 0;
  const insufficient = total > SC_BALANCE;

  function adjust(key, delta) {
    setCounts(c => ({ ...c, [key]: Math.max(0, c[key] + delta) }));
  }

  function handleConfirm() {
    if (phase === 'cart') {
      if (!isEmpty) setPhase('confirm');
      return;
    }
    if (insufficient) return;
    onClose();
    navigate('/lottery', {
      state: {
        counts,
        total,
        combo: Object.entries(counts).filter(([, v]) => v > 0).map(([k, v]) => `${k}×${v}`).join('  '),
      },
    });
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
          className="overflow-hidden"
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
              {phase === 'confirm' ? (
                <button onClick={() => setPhase('cart')} className="text-[14px] text-tokenSub">返回</button>
              ) : (
                <div className="w-10" />
              )}
              <span className="text-[17px] font-semibold text-tokenText">兑换首发权</span>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--color-bg-card)' }}>
                <X className="h-4 w-4 text-tokenSub" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="px-4 pb-6 pt-2">
            {/* ABC 行 */}
            {['A', 'B', 'C'].map(key => {
              const v = TOKEN_V[key];
              const count = counts[key];
              const subtotal = count * PRICES[key];
              return (
                <div key={key} className="mb-3 overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
                  <div className="px-4 pt-3.5 pb-3">
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className="grid h-7 w-[25px] shrink-0 place-items-center font-num text-[14px] font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, var(--token-${v}-from), var(--token-${v}-to))`,
                          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        }}
                      >
                        {key}
                      </div>
                      <span className="text-[15px] font-semibold text-tokenText">{key}SC 首发权</span>
                      <InfoTip text={TIPS[key]} />
                      <span className="ml-auto font-num text-[13px] font-semibold" style={{ color: `var(--token-${v}-text)` }}>
                        {PRICES[key]} 亿 SC / 个
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      {phase === 'cart' || insufficient ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => adjust(key, -1)}
                            disabled={count === 0}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-tokenBorder disabled:opacity-30"
                          >
                            <Minus className="h-4 w-4 text-tokenText" strokeWidth={2} />
                          </button>
                          <span className="w-8 text-center font-num text-[20px] font-semibold text-tokenText">{count}</span>
                          <button
                            onClick={() => adjust(key, 1)}
                            disabled={total + PRICES[key] > SC_BALANCE}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-white disabled:opacity-30"
                            style={{ background: total + PRICES[key] > SC_BALANCE ? 'var(--color-danger)' : `var(--token-${v}-from)` }}
                          >
                            <Plus className="h-4 w-4" strokeWidth={2.5} />
                          </button>
                        </div>
                      ) : (
                        <span className="font-num text-[20px] font-semibold text-tokenText">{count} 个</span>
                      )}
                      {subtotal > 0 && (
                        <span className="font-num text-[13px] font-medium text-tokenSub">= {subtotal} 亿 SC</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {phase === 'cart' && (
              <div className="mb-4 flex items-center justify-between px-1">
                <span className="text-[13px] font-medium text-tokenSub">合计消耗 SC</span>
                <span className="font-num text-[16px] font-semibold text-tokenText">{total} 亿 SC</span>
              </div>
            )}

            {/* 确认订单摘要 */}
            {phase === 'confirm' && (
              <div className="mb-4 rounded-xl px-4 py-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13px] text-tokenSub">扣除 SC</span>
                  <span className="font-num text-[18px] font-semibold text-tokenDanger">-{total} 亿</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-tokenSub">SC 余额（兑换后）</span>
                  <span className={`font-num text-[15px] font-semibold ${insufficient ? 'text-tokenDanger' : 'text-tokenPrimary'}`}>
                    {(SC_BALANCE - total).toFixed(2)} 亿
                  </span>
                </div>
                {insufficient && (
                  <div className="mt-3 flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'var(--color-danger-soft)' }}>
                    <span className="text-[12px] text-tokenDanger">SC 余额不足</span>
                    <button onClick={() => { onClose(); onOpenExchange?.(); }} className="text-[12px] font-semibold text-tokenDanger underline">去兑换 SC</button>
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleConfirm}
              disabled={isEmpty || (phase === 'confirm' && insufficient)}
              className="w-full py-[14px] text-[15px] font-semibold"
              style={{
                borderRadius: 'var(--radius-md)',
                background: isEmpty || (phase === 'confirm' && insufficient) ? 'var(--color-border)' : 'var(--color-primary)',
                color: isEmpty || (phase === 'confirm' && insufficient) ? 'var(--color-text-hint)' : '#fff',
                boxShadow: !isEmpty && !(phase === 'confirm' && insufficient) ? '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' : 'none',
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <ArrowLeftRight className="h-4 w-4" strokeWidth={2.5} />
                {phase === 'cart' ? '兑换首发权' : '确认支付'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
