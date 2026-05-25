import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../components/LanguageContext';
import { getProductsByCategory } from '../data/booklists';
import { formatScAmount } from '../utils/formatSc';

// mock balances
const BALANCES = { A: 3, B: 5, C: 8 };
const SC_BALANCE = 32.11;
// per-type price (ABC / unit)
const UNIT_PRICE  = { A: 1, B: 1, C: 1 };
// SC rate: 1 ASC = 5亿 SC; 10% of that = 0.5亿 SC per ASC
const SC_RATE     = { A: 5, B: 3, C: 1 };
const TYPE_INFO   = {
  A: { label: 'A · 品牌定制', color: 'var(--token-a-text)', bg: 'var(--token-a-soft)', v: 'a' },
  B: { label: 'B · 创意文案', color: 'var(--token-b-text)', bg: 'var(--token-b-soft)', v: 'b' },
  C: { label: 'C · 极速盲盒', color: 'var(--token-c-text)', bg: 'var(--token-c-soft)', v: 'c' },
};

function guessType(productId) {
  const idx = parseInt(productId?.split('-').pop() ?? '1', 10) - 1;
  return getProductsByCategory(productId?.split('-').slice(0, -1).join('-'))[idx]?.type ?? 'C';
}

export default function P7Product() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [qty, setQty] = useState(1);
  const [ordered, setOrdered] = useState(false);

  const product = getProductsByCategory(category).find((item) => item.id === id);
  const title = product ? (lang === 'zh' ? product.title : product.titleEn) : (lang === 'zh' ? '视频商品' : 'Video Item');
  const type  = guessType(id);
  const info  = TYPE_INFO[type];
  const v     = info.v;

  const unitABC = UNIT_PRICE[type];
  const totalABC = qty * unitABC;
  const totalSC  = +(totalABC * SC_RATE[type] * 0.1).toFixed(2);
  const unitScDisplay = formatScAmount(unitABC * SC_RATE[type] * 0.1, lang);
  const totalScDisplay = formatScAmount(totalSC, lang);
  const scBalanceDisplay = formatScAmount(SC_BALANCE, lang);
  const duration = qty * 10;

  const abcBal = BALANCES[type];
  const abcInsufficient = totalABC > abcBal;
  const scInsufficient  = totalSC > SC_BALANCE;
  const canOrder = !abcInsufficient && !scInsufficient;

  function handleOrder() {
    if (!canOrder) return;
    setOrdered(true);
    setTimeout(() => navigate('/orders'), 1400);
  }

  return (
    <>
      <PageHeader title={title} />

      <div className="px-4 pt-5 pb-8">
        {/* 商品卡 */}
        <div className="mb-5 overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <div className="h-[120px] flex items-end px-5 pb-4" style={{ background: `linear-gradient(135deg, var(--token-${v}-from), var(--token-${v}-to))` }}>
            <div>
              <span className="rounded-full px-2.5 py-1 text-[11px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.25)' }}>{type} · {lang === 'zh' ? info.label : { A: 'A · Brand Custom', B: 'B · Creative Copy', C: 'C · Blind Box' }[type]}</span>
              <p className="mt-2 text-[18px] font-bold text-white">{title}</p>
            </div>
          </div>
          <div className="bg-tokenCard flex items-center gap-4 px-5 py-3">
            <div>
              <p className="text-[11px] text-tokenHint">{lang === 'zh' ? '视频时长' : 'Video Length'}</p>
              <p className="font-num text-[16px] font-semibold text-tokenText">10 {lang === 'zh' ? '秒' : 's'}</p>
            </div>
            <div className="w-px h-8 bg-tokenBorder" />
            <div>
              <p className="text-[11px] text-tokenHint">{lang === 'zh' ? '兑换费用' : 'Cost'}</p>
              <p className="font-num text-[16px] font-semibold" style={{ color: `var(--token-${v}-text)` }}>{unitABC} {type}SC + {unitScDisplay.text}</p>
            </div>
          </div>
        </div>

        {/* 数量 */}
        <div className="mb-4 flex items-center justify-between rounded-xl px-5 py-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="min-w-0">
            <p className="text-[13px] text-tokenSub">{lang === 'zh' ? '视频时长' : 'Video Length'}</p>
            <p className="mt-1 flex items-baseline gap-1 whitespace-nowrap">
              <span className="font-num text-[28px] font-bold leading-none" style={{ color: `var(--token-${v}-from)` }}>{duration}</span>
              <span className="text-[15px] font-semibold" style={{ color: `var(--token-${v}-from)` }}>{lang === 'zh' ? '秒视频' : 'sec video'}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-tokenBorder">
              <Minus className="h-4 w-4 text-tokenText" strokeWidth={2} />
            </button>
            <span className="font-num text-[22px] font-semibold text-tokenText w-8 text-center">{qty}</span>
            <button onClick={() => setQty(q => q + 1)} className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: `var(--token-${v}-from)` }}>
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* 支付摘要 */}
        <div className="mb-4 rounded-xl px-5 py-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
          <p className="mb-3 text-[13px] font-semibold text-tokenText">{lang === 'zh' ? '费用明细' : 'Payment Summary'}</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-tokenSub">{type}SC</span>
            <span className="font-num text-[15px] font-semibold" style={{ color: `var(--token-${v}-text)` }}>
              {totalABC} {type}SC
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] text-tokenSub">SC (+10%)</span>
            <span className="font-num text-[15px] font-semibold text-tokenPrimary">{totalScDisplay.text}</span>
          </div>
          <div className="h-px bg-tokenBorderSubtle mb-3" />
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-tokenHint">{lang === 'zh' ? `${type}SC 余额 / SC 余额` : `${type}SC Balance / SC Balance`}</span>
            <span className="text-[12px]" style={{ color: abcInsufficient || scInsufficient ? 'var(--color-danger)' : 'var(--color-success)' }}>
              {abcBal} {type}SC / {scBalanceDisplay.text}
            </span>
          </div>
        </div>

        {/* 余额不足提示 */}
        {abcInsufficient && (
          <div className="mb-3 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'var(--color-danger-soft)' }}>
            <span className="text-[12px] text-tokenDanger">{lang === 'zh' ? `${type}SC 余额不足` : `Insufficient ${type}SC balance`}</span>
            <button onClick={() => navigate('/buy')} className="text-[12px] font-semibold text-tokenDanger underline">{lang === 'zh' ? '去兑换首发权' : 'Redeem Early Access'}</button>
          </div>
        )}
        {!abcInsufficient && scInsufficient && (
          <div className="mb-3 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'var(--color-danger-soft)' }}>
            <span className="text-[12px] text-tokenDanger">{lang === 'zh' ? 'SC 余额不足' : 'Insufficient SC balance'}</span>
            <button onClick={() => navigate('/exchange')} className="text-[12px] font-semibold text-tokenDanger underline">{lang === 'zh' ? '去兑换 SC' : 'Swap SC'}</button>
          </div>
        )}

        {/* 兑换按钮 */}
        {ordered ? (
          <div className="flex items-center justify-center gap-2 rounded-xl py-4" style={{ background: 'var(--color-success-soft)', border: '1px solid var(--color-primary-border)' }}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="var(--color-success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span className="text-[15px] font-semibold text-tokenSuccess">{lang === 'zh' ? '兑换成功，跳转订单…' : 'Order placed. Redirecting to Orders…'}</span>
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
            {lang === 'zh' ? `确认兑换 · ${duration} 秒视频` : `Confirm Order · ${duration}s video`}
          </button>
        )}
      </div>
    </>
  );
}
