import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from './LanguageContext';

export default function SubsidyResultModal({ onClose, subsidyAmount = 3.11, orderTotal = 9 }) {
  const { lang } = useLanguage();
  const [displayVal, setDisplayVal] = useState(0);
  const [phase, setPhase] = useState('counting');
  const isZherang = subsidyAmount < orderTotal;
  const pct = (subsidyAmount / orderTotal * 100).toFixed(1);

  useEffect(() => {
    const dur = 900, start = performance.now();
    let frameId;
    const raf = (now) => {
      const t = Math.min((now - start) / dur, 1);
      setDisplayVal((1 - Math.pow(1 - t, 3)) * subsidyAmount);
      if (t < 1) frameId = requestAnimationFrame(raf);
      else setPhase('done');
    };
    frameId = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(frameId);
  }, [subsidyAmount]);

  const dots = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    x: 10 + Math.random() * 80,
    delay: Math.random() * 0.4,
    dur: 0.6 + Math.random() * 0.5,
    color: ['#14c7b5','#ffd33c','#42a6ff','#13a978','#ffad00'][i % 5],
    size: 4 + Math.random() * 4,
  })), []);

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{ background: 'rgba(13,21,39,0.45)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[343px] overflow-hidden"
        style={{ animation: 'sheetUp 320ms cubic-bezier(0.22,1,0.36,1) both' }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden px-6 pt-6 pb-7"
          style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-lg)' }}
        >
          <svg className="pointer-events-none absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
            {dots.map((d, i) => (
              <circle key={i} cx={`${d.x}%`} cy="-8" r={d.size / 2} fill={d.color}
                style={{ animation: `confettiFall ${d.dur}s ${d.delay}s ease-in both` }} />
            ))}
          </svg>

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: 'var(--color-success-soft)', animation: 'popIn 400ms 100ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="var(--color-success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <p className="mb-1 text-center text-[15px] font-medium text-tokenSub">
            {lang === 'zh' ? (isZherang ? '本轮折让已到账' : '本轮补贴已到账') : (isZherang ? 'This round discount has been credited' : 'This round subsidy has been credited')}
          </p>
          <p className="mb-1 text-center font-num text-[38px] font-bold leading-none" style={{ color: 'var(--color-success)' }}>
            +{displayVal.toFixed(2)} {lang === 'zh' ? '亿' : 'B'}
          </p>
          <p className="mb-5 text-center text-[13px] text-tokenHint">SC</p>

          <div className="mb-5 flex gap-3">
            <div className="flex-1 rounded-xl py-3 text-center" style={{ background: 'var(--color-bg-page)' }}>
              <p className="text-[11px] text-tokenHint">{lang === 'zh' ? '本次扣除' : 'Deducted'}</p>
              <p className="mt-0.5 text-[13px] font-semibold text-tokenText">{orderTotal} {lang === 'zh' ? '亿 SC' : 'B SC'}</p>
            </div>
            <div className="flex-1 rounded-xl py-3 text-center" style={{ background: 'var(--color-bg-page)' }}>
              <p className="text-[11px] text-tokenHint">{lang === 'zh' ? (isZherang ? '本轮折让' : '本轮补贴') : (isZherang ? 'Discount' : 'Subsidy')}</p>
              <p className="mt-0.5 text-[13px] font-semibold" style={{ color: isZherang ? 'var(--color-primary)' : 'var(--color-success)' }}>
                {isZherang ? '' : '+'}{pct}%
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 text-[15px] font-semibold text-white"
            style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
          >
            {lang === 'zh' ? '好的' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
