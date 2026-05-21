import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const TOTAL_SECS = 100;
const SETTLE_WINDOW = 10; // last 10s → delayed to next round

export default function P3Lottery() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const combo  = state?.combo  ?? 'A×1';
  const total  = state?.total  ?? 5;

  const [secs, setSecs] = useState(TOTAL_SECS);
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (secs <= 0) {
      // mock subsidy result and navigate to P4
      const subsidy = +(total * (0.5 + Math.random() * 1.2)).toFixed(2);
      navigate('/result', { replace: true, state: { subsidy, total, combo } });
      return;
    }
    const t = setTimeout(() => setSecs(s => {
      const next = s - 1;
      if (next === SETTLE_WINDOW && !delayed) setDelayed(true);
      return next;
    }), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const R = 52, SW = 6;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - secs / TOTAL_SECS);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  return (
    <>
      <PageHeader title="抽奖中" onBack={() => navigate('/')} />

      <div className="flex flex-col items-center px-4 pt-8 pb-8">
        {/* 订单摘要 */}
        <div className="w-full mb-8 rounded-xl px-5 py-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-md)' }}>
          <p className="text-[12px] text-tokenHint mb-1">本次订单</p>
          <p className="text-[16px] font-semibold text-tokenText">{combo}</p>
          <p className="mt-1 font-num text-[14px] text-tokenSub">消耗 {total} 亿 SC</p>
        </div>

        {/* 倒计时环 */}
        <div className="relative mb-6" style={{ width: 140, height: 140 }}>
          <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="70" cy="70" r={R} fill="none" stroke="var(--color-border)" strokeWidth={SW} />
            <circle cx="70" cy="70" r={R} fill="none" stroke="var(--color-primary)" strokeWidth={SW}
              strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-num text-[32px] font-bold leading-none text-tokenText">{mm}:{ss}</span>
            <span className="mt-1 text-[12px] text-tokenHint">本轮剩余</span>
          </div>
        </div>

        {delayed && (
          <div className="mb-4 w-full rounded-xl px-4 py-3 text-center" style={{ background: '#fffaf1', border: '1px solid var(--token-a-border)' }}>
            <p className="text-[13px] font-medium" style={{ color: 'var(--token-a-text)' }}>已进入结算窗口，自动顺延至下一轮</p>
          </div>
        )}

        <p className="text-center text-[13px] leading-[20px] text-tokenSub px-6 mb-8">
          后台正在处理抽奖，您可以离开，结果会自动到账
        </p>

        <button
          onClick={() => navigate('/')}
          className="w-full py-[14px] text-[15px] font-semibold text-tokenSub border border-tokenBorder rounded-xl"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          离开等待（后台继续）
        </button>
      </div>
    </>
  );
}
