import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Minus, Plus, ArrowLeftRight, X } from 'lucide-react';
import InfoTip from './InfoTip';
import { useLanguage } from './LanguageContext';

const SC_BALANCE = 32.11;
const PRICES = { A: 5, B: 3, C: 1 };
const TIPS = {
  A: '持有 ASC 可兑换 A 类 AI 视频；从 SC 兑换时，5 亿 SC 可换 1 ASC；兑换视频时另扣 10% SC',
  B: '持有 BSC 可兑换 B 类 AI 视频；从 SC 兑换时，3 亿 SC 可换 1 BSC；兑换视频时另扣 10% SC',
  C: '持有 CSC 可兑换 C 类 AI 视频；从 SC 兑换时，1 亿 SC 可换 1 CSC；兑换视频时另扣 10% SC',
};
const TOKEN_V = { A: 'a', B: 'b', C: 'c' };

export default function BuyABCSheet({ onClose, onOpenExchange, onSubmit }) {
  const { lang } = useLanguage();
  const [counts, setCounts] = useState({ A: 0, B: 0, C: 0 });

  const total = Object.entries(counts).reduce((s, [k, v]) => s + v * PRICES[k], 0);
  const isEmpty = total === 0;
  const insufficient = total > SC_BALANCE;

  function adjust(key, delta) {
    setCounts(c => ({ ...c, [key]: Math.max(0, c[key] + delta) }));
  }

  function handleConfirm() {
    if (isEmpty || insufficient) return;
    onSubmit?.({
      counts,
      total,
      combo: Object.entries(counts).filter(([, v]) => v > 0).map(([k, v]) => `${k}×${v}`).join('  '),
    });
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
              <div className="w-8" />
              <span className="text-[17px] font-semibold text-tokenText">{lang === 'zh' ? '兑换首发权' : 'Swap for Premiere Access'}</span>
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
                      <span className="text-[15px] font-semibold text-tokenText">{lang === 'zh' ? `${key}SC 首发权` : `${key}SC Premiere Access`}</span>
                      <InfoTip text={lang === 'zh' ? TIPS[key] : {
                        A: 'Hold ASC to swap for Type A AI videos. 5B SC swaps into 1 ASC, and swapping for the video also consumes an extra 10% in SC.',
                        B: 'Hold BSC to swap for Type B AI videos. 3B SC swaps into 1 BSC, and swapping for the video also consumes an extra 10% in SC.',
                        C: 'Hold CSC to swap for Type C AI videos. 1B SC swaps into 1 CSC, and swapping for the video also consumes an extra 10% in SC.',
                      }[key]} />
                      <span className="ml-auto font-num text-[13px] font-semibold" style={{ color: `var(--token-${v}-text)` }}>
                        {PRICES[key]} {lang === 'zh' ? '亿 SC / 个' : 'B SC / unit'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
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
                          className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                          style={{ background: `var(--token-${v}-from)` }}
                        >
                          <Plus className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                      </div>
                      {subtotal > 0 && (
                        <span className="font-num text-[13px] font-medium text-tokenSub">= {subtotal} {lang === 'zh' ? '亿 SC' : 'B SC'}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="mb-4 flex items-center justify-between px-1">
              <span className="text-[13px] font-medium text-tokenSub">{lang === 'zh' ? '合计消耗 SC' : 'Total SC Cost'}</span>
              <span className="font-num text-[16px] font-semibold text-tokenText">{total} {lang === 'zh' ? '亿 SC' : 'B SC'}</span>
            </div>

            {insufficient && (
              <div className="mb-3 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'var(--color-danger-soft)' }}>
                <span className="text-[12px] text-tokenDanger">{lang === 'zh' ? 'SC 余额不足' : 'Insufficient SC balance'}</span>
                <button onClick={() => { onClose(); onOpenExchange?.(); }} className="text-[12px] font-semibold text-tokenDanger underline">{lang === 'zh' ? '去兑换 SC' : 'Swap SC'}</button>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleConfirm}
              disabled={isEmpty || insufficient}
              className="w-full py-[14px] text-[15px] font-semibold"
              style={{
                borderRadius: 'var(--radius-md)',
                background: isEmpty || insufficient ? 'var(--color-border)' : 'var(--color-primary)',
                color: isEmpty || insufficient ? 'var(--color-text-hint)' : '#fff',
                boxShadow: !isEmpty && !insufficient ? '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' : 'none',
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <ArrowLeftRight className="h-4 w-4" strokeWidth={2.5} />
                {lang === 'zh' ? '兑换首发权' : 'Swap for Premiere Access'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
