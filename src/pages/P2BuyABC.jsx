import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, ArrowLeftRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import InfoTip from '../components/InfoTip';
import ExchangeSubmittedSheet from '../components/ExchangeSubmittedSheet';
import { useLanguage } from '../components/LanguageContext';

const SC_BALANCE = 32.11;
const PRICES = { A: 5, B: 3, C: 1 };
const TIPS = {
  A: '持有 ASC 可兑换 A 类 AI 视频；从 SC 兑换时，5 亿 SC 可换 1 ASC；兑换视频时另扣 10% SC',
  B: '持有 BSC 可兑换 B 类 AI 视频；从 SC 兑换时，3 亿 SC 可换 1 BSC；兑换视频时另扣 10% SC',
  C: '持有 CSC 可兑换 C 类 AI 视频；从 SC 兑换时，1 亿 SC 可换 1 CSC；兑换视频时另扣 10% SC',
};
const TOKEN_V = { A: 'a', B: 'b', C: 'c' };

export default function P2BuyABC() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [counts, setCounts] = useState({ A: 0, B: 0, C: 0 });
  const [drafts, setDrafts] = useState({ A: '', B: '', C: '' });
  const [submitted, setSubmitted] = useState(null);

  const total = Object.entries(counts).reduce((s, [k, v]) => s + v * PRICES[k], 0);
  const isEmpty = total === 0;
  const insufficient = total > SC_BALANCE;

  function adjust(key, delta) {
    const next = Math.max(0, counts[key] + delta);
    setCounts(c => ({ ...c, [key]: next }));
    setDrafts(d => ({ ...d, [key]: '' }));
  }

  function handleInput(key, val) {
    setDrafts(d => ({ ...d, [key]: val }));
    const n = parseInt(val, 10);
    setCounts(c => ({ ...c, [key]: Number.isFinite(n) && n >= 0 ? n : 0 }));
  }

  function handleBlur(key) {
    setDrafts(d => ({ ...d, [key]: '' }));
  }

  function handleConfirm() {
    if (isEmpty || insufficient) return;
    setSubmitted({
      total,
      combo: Object.entries(counts).filter(([,v]) => v > 0).map(([k,v]) => `${k}×${v}`).join('  '),
    });
  }

  return (
    <>
      <PageHeader title={lang === 'zh' ? '兑换首发权' : 'Swap for Premiere Access'} />

      <div className="px-4 pt-5 pb-8">
        {/* SC 余额 */}
        <div className="mb-4 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
          <span className="text-[13px] text-tokenSub">{lang === 'zh' ? 'SC 词元余额' : 'SC Balance'}</span>
          <span className="font-num text-[18px] font-semibold text-tokenPrimary">{SC_BALANCE} {lang === 'zh' ? '亿 SC' : 'B SC'}</span>
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

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjust(key, -1)}
                    disabled={count === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-tokenBorder disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4 text-tokenText" strokeWidth={2} />
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={drafts[key] !== '' ? drafts[key] : count === 0 ? '' : count}
                    onChange={e => handleInput(key, e.target.value)}
                    onBlur={() => handleBlur(key)}
                    placeholder="0"
                    className="font-num text-[20px] font-semibold text-tokenText text-center bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{ width: '7rem' }}
                  />
                  <button
                    onClick={() => adjust(key, 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                    style={{ background: `var(--token-${v}-from)` }}
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                  {subtotal > 0 && (
                    <span className="font-num text-[13px] font-medium text-tokenSub ml-1">= {subtotal} {lang === 'zh' ? '亿 SC' : 'B SC'}</span>
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
          <div className="mb-4 flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'var(--color-danger-soft)' }}>
            <span className="text-[12px] text-tokenDanger">{lang === 'zh' ? 'SC 余额不足' : 'Insufficient SC balance'}</span>
            <button onClick={() => navigate('/exchange')} className="text-[12px] font-semibold text-tokenDanger underline">{lang === 'zh' ? '去兑换 SC' : 'Swap SC'}</button>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleConfirm}
          disabled={isEmpty || insufficient}
          className="w-full py-[14px] text-[15px] font-semibold text-white"
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

      {submitted && (
        <ExchangeSubmittedSheet
          detail={lang === 'zh' ? `${submitted.combo} · 扣除 ${submitted.total} 亿 SC` : `${submitted.combo} · ${submitted.total}B SC deducted`}
          onClose={() => setSubmitted(null)}
        />
      )}
    </>
  );
}
