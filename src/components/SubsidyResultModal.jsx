import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Frown } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { formatScAmount } from '../utils/formatSc';
import Toast from './Toast';

export default function SubsidyResultModal({ onClose, subsidyAmount = 3.11, orderTotal = 9, error = false }) {
  const { lang } = useLanguage();
  if (error) {
    return (
      <Toast
        type="error"
        position="top"
        duration={4000}
        message={lang === 'zh' ? '补贴结果暂时无法获取，请稍后在历史记录中查看' : 'Subsidy result unavailable — check your history later'}
        onDone={onClose}
      />
    );
  }

  const noWin = subsidyAmount === 0;
  const [displayVal, setDisplayVal] = useState(0);
  const subsidyDisplay = formatScAmount(displayVal, lang);
  const isZherang = subsidyAmount < orderTotal;
  const pct = (subsidyAmount / orderTotal * 100).toFixed(1);

  useEffect(() => {
    if (noWin) return;
    const dur = 900, start = performance.now();
    let frameId;
    const raf = (now) => {
      const t = Math.min((now - start) / dur, 1);
      setDisplayVal((1 - Math.pow(1 - t, 3)) * subsidyAmount);
      if (t < 1) frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(frameId);
  }, [subsidyAmount, noWin]);

  const dots = useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    x: 10 + Math.random() * 80,
    delay: Math.random() * 0.45,
    dur: 0.7 + Math.random() * 0.55,
    color: ['var(--color-primary)','var(--token-a-from)','var(--token-b-from)','var(--color-success)','var(--token-a-to)'][i % 5],
    size: 4 + Math.random() * 5,
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
          className="relative overflow-hidden px-6 pt-5 pb-7"
          style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-lg)' }}
        >
          {!noWin && (
            <svg className="pointer-events-none absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
              {dots.map((d, i) => (
                <circle key={i} cx={`${d.x}%`} cy="-8" r={d.size / 2} fill={d.color}
                  style={{ animation: `confettiFall ${d.dur}s ${d.delay}s ease-in both` }} />
              ))}
            </svg>
          )}

          <div className="pointer-events-none absolute -left-8 top-10 h-24 w-24 rounded-full opacity-70" style={{ background: noWin ? 'var(--color-bg-page)' : 'var(--token-c-soft)' }} />
          <div className="pointer-events-none absolute -right-8 top-24 h-20 w-20 rounded-full opacity-80" style={{ background: noWin ? 'var(--color-bg-page)' : 'var(--token-a-soft)' }} />

          <div className="relative mx-auto mb-4 flex h-[132px] w-[132px] items-center justify-center">
            {noWin ? (
              <div
                className="grid h-[88px] w-[88px] place-items-center rounded-full"
                style={{ background: 'var(--color-bg-page)', animation: 'popIn 420ms 80ms cubic-bezier(0.34,1.56,0.64,1) both' }}
              >
                <Frown className="h-10 w-10 text-tokenHint" strokeWidth={1.5} />
              </div>
            ) : (
              <img
                src="/assets/mascot-subsidy.webp"
                alt=""
                className="h-[132px] w-[132px] object-contain"
                style={{ animation: 'popIn 420ms 80ms cubic-bezier(0.34,1.56,0.64,1) both' }}
              />
            )}
          </div>

          <p className="mb-2 text-center text-[17px] font-semibold text-tokenText">
            {noWin
              ? (lang === 'zh' ? '本轮未获得补贴' : 'No Subsidy This Round')
              : (lang === 'zh' ? '恭喜获得词元补贴' : 'Token Subsidy Awarded')}
          </p>

          {noWin ? (
            <p className="mb-6 text-center text-[13px] leading-[20px] text-tokenHint">
              {lang === 'zh' ? '很遗憾，本轮未获得补贴，下次好运。' : 'No subsidy this time — better luck next round.'}
            </p>
          ) : (
            <>
              <p className="mb-2 text-center font-num text-[40px] font-bold leading-none" style={{ color: 'var(--color-success)' }}>
                +{subsidyDisplay.value} {lang === 'zh' ? '亿' : subsidyDisplay.unit.replace(' SC', '')}
              </p>
              <p className="mb-6 text-center text-[13px] text-tokenHint">SC</p>
              <div className="mb-5">
                <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'var(--color-bg-page)' }}>
                  <p className="text-[11px] text-tokenHint">{lang === 'zh' ? (isZherang ? '本轮折让' : '本轮补贴') : (isZherang ? 'Discount' : 'Subsidy')}</p>
                  <p className="text-[13px] font-semibold" style={{ color: isZherang ? 'var(--color-primary)' : 'var(--color-success)' }}>
                    {isZherang ? '' : '+'}{pct}%
                  </p>
                </div>
              </div>
            </>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 text-[15px] font-semibold text-white"
            style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
          >
            {lang === 'zh' ? (noWin ? '知道了' : '好的') : (noWin ? 'Got It' : 'OK')}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
