import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../components/LanguageContext';
import { formatScAmount } from '../utils/formatSc';

export default function P4Result() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { state } = useLocation();
  const subsidy = state?.subsidy ?? 3.11;
  const total   = state?.total   ?? 9;
  const combo   = state?.combo   ?? '';
  const isZherang = subsidy < total;
  const pct = (subsidy / total * 100).toFixed(1);

  const [displayVal, setDisplayVal] = useState(0);
  const [ready, setReady] = useState(false);
  const subsidyDisplay = formatScAmount(displayVal, lang);

  useEffect(() => {
    const dur = 900, start = performance.now();
    let frameId;
    const raf = (now) => {
      const t = Math.min((now - start) / dur, 1);
      setDisplayVal((1 - Math.pow(1 - t, 3)) * subsidy);
      if (t < 1) frameId = requestAnimationFrame(raf);
      else setReady(true);
    };
    frameId = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(frameId);
  }, [subsidy]);

  const dots = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    x: 5 + Math.random() * 90,
    delay: Math.random() * 0.5,
    dur: 0.7 + Math.random() * 0.6,
    color: ['#14c7b5','#ffd33c','#42a6ff','#13a978','#ffad00'][i % 5],
    size: 4 + Math.random() * 5,
  })), []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden" style={{ background: 'var(--color-bg-page)' }}>
      {/* confetti */}
      <svg className="pointer-events-none absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        {dots.map((d, i) => (
          <circle key={i} cx={`${d.x}%`} cy="-8" r={d.size / 2} fill={d.color}
            style={{ animation: `confettiFall ${d.dur}s ${d.delay}s ease-in both` }} />
        ))}
      </svg>

      <div className="relative w-full max-w-[343px] overflow-hidden rounded-[20px] px-6 pt-8 pb-7"
        style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-lg)', animation: 'popIn 380ms cubic-bezier(0.34,1.56,0.64,1) both' }}>

        {/* 图标 */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: 'var(--color-success-soft)', animation: 'popIn 400ms 80ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="var(--color-success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <p className="mb-1 text-center text-[15px] font-medium text-tokenSub">
          {lang === 'zh' ? (isZherang ? '本轮折让已到账' : '本轮补贴已到账') : (isZherang ? 'Round discount credited' : 'Round subsidy credited')}
        </p>
        <p className="mb-1 text-center font-num text-[42px] font-bold leading-none" style={{ color: 'var(--color-success)' }}>
          +{subsidyDisplay.value} {lang === 'zh' ? '亿' : subsidyDisplay.unit.replace(' SC', '')}
        </p>
        <p className="mb-6 text-center text-[13px] text-tokenHint">SC</p>

        <div className="mb-6 flex gap-3">
          {combo && (
            <div className="flex-1 rounded-xl py-3 text-center" style={{ background: 'var(--color-bg-page)' }}>
              <p className="text-[11px] text-tokenHint">{lang === 'zh' ? '订单' : 'Order'}</p>
              <p className="mt-0.5 text-[12px] font-semibold text-tokenText leading-tight">{combo}</p>
            </div>
          )}
          <div className="flex-1 rounded-xl py-3 text-center" style={{ background: 'var(--color-bg-page)' }}>
            <p className="text-[11px] text-tokenHint">{lang === 'zh' ? (isZherang ? '本轮折让' : '本轮补贴') : (isZherang ? 'Discount' : 'Subsidy')}</p>
            <p className="mt-0.5 text-[13px] font-semibold" style={{ color: isZherang ? 'var(--color-primary)' : 'var(--color-success)' }}>
              {isZherang ? '' : '+'}{pct}%
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/buy')}
            className="flex-1 py-3 text-[14px] font-semibold rounded-xl border border-tokenBorder text-tokenSub"
          >
            {lang === 'zh' ? '继续兑换' : 'Redeem More'}
          </button>
          <button
            onClick={() => navigate('/history')}
            className="flex-1 py-3 text-[14px] font-semibold rounded-xl border border-tokenBorder text-tokenSub"
          >
            {lang === 'zh' ? '查看记录' : 'View History'}
          </button>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-2 w-full py-3 text-[15px] font-semibold text-white"
          style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
        >
          {lang === 'zh' ? '返回首页' : 'Back to Home'}
        </button>
      </div>
    </div>
  );
}
