import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, ArrowLeftRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import InfoTip from '../components/InfoTip';

const SC_BALANCE = 32.11;
const PRICES = { A: 5, B: 3, C: 1 };
const TIPS = {
  A: 'A 类专用词元，用于兑换 A 类 AI 视频商品；购买价为 5 亿 SC = 1 亿 ASC，兑换商品时还需支付 10% 附加 SC',
  B: 'B 类专用词元，用于兑换 B 类 AI 视频商品；购买价为 3 亿 SC = 1 亿 BSC，兑换商品时还需支付 10% 附加 SC',
  C: 'C 类专用词元，用于兑换 C 类 AI 视频商品；购买价为 1 亿 SC = 1 亿 CSC，兑换商品时还需支付 10% 附加 SC',
};
const TOKEN_V = { A: 'a', B: 'b', C: 'c' };

export default function P2BuyABC() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ A: 0, B: 0, C: 0 });
  const [phase, setPhase] = useState('cart'); // 'cart' | 'confirm'

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
    navigate('/lottery', { state: { counts, total, combo: Object.entries(counts).filter(([,v]) => v > 0).map(([k,v]) => `${k}×${v}`).join('  ') } });
  }

  return (
    <>
      <PageHeader
        title="兑换首发权"
        onBack={phase === 'confirm' ? () => setPhase('cart') : undefined}
      />

      <div className="px-4 pt-5 pb-8">
        {/* SC 余额 */}
        <div className="mb-4 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
          <span className="text-[13px] text-tokenSub">SC 词元余额</span>
          <span className="font-num text-[18px] font-semibold text-tokenPrimary">{SC_BALANCE} 亿</span>
        </div>

        {/* ABC 行 */}
        {['A','B','C'].map(key => {
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
                  {phase === 'cart' ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => adjust(key, -1)}
                        disabled={count === 0}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-tokenBorder disabled:opacity-30"
                      >
                        <Minus className="h-4 w-4 text-tokenText" strokeWidth={2} />
                      </button>
                      <span className="font-num text-[20px] font-semibold text-tokenText w-8 text-center">{count}</span>
                      <button
                        onClick={() => adjust(key, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                        style={{ background: `var(--token-${v}-from)` }}
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

        {/* 确认订单摘要（phase confirm） */}
        {phase === 'confirm' && (
          <div className="mb-4 rounded-xl px-4 py-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between mb-2">
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
                <button onClick={() => navigate('/exchange')} className="text-[12px] font-semibold text-tokenDanger underline">去兑换 SC</button>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleConfirm}
          disabled={isEmpty || (phase === 'confirm' && insufficient)}
          className="w-full py-[14px] text-[15px] font-semibold text-white"
          style={{
            borderRadius: 'var(--radius-md)',
            background: isEmpty || (phase === 'confirm' && insufficient) ? 'var(--color-border)' : 'var(--color-primary)',
            color: isEmpty || (phase === 'confirm' && insufficient) ? 'var(--color-text-hint)' : '#fff',
            boxShadow: !isEmpty && !(phase === 'confirm' && insufficient) ? '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' : 'none',
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <ArrowLeftRight className="h-4 w-4" strokeWidth={2.5} />
            {phase === 'cart' ? `去结算（共 ${total} 亿 SC）` : '确认支付'}
          </span>
        </button>
      </div>
    </>
  );
}
