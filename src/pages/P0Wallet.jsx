import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  ArrowDownLeft, ArrowLeftRight, ChevronRight, History,
  PlayCircle, ShoppingCart, Wallet,
} from 'lucide-react';
import InfoTip from '../components/InfoTip';
import SubsidyResultModal from '../components/SubsidyResultModal';
import HeaderActions from '../components/HeaderActions';

// ── Mock data ────────────────────────────────────────────────
const ABC_BALANCES = [
  { key: 'A', v: 'a', label: 'ASC', value: '5.20', tip: 'A 类专用词元，用于兑换 A 类 AI 视频商品；购买价为 5 亿 SC = 1 亿 ASC，兑换商品时还需支付 10% 附加 SC' },
  { key: 'B', v: 'b', label: 'BSC', value: '3.00', tip: 'B 类专用词元，用于兑换 B 类 AI 视频商品；购买价为 3 亿 SC = 1 亿 BSC，兑换商品时还需支付 10% 附加 SC' },
  { key: 'C', v: 'c', label: 'CSC', value: '1.80', tip: 'C 类专用词元，用于兑换 C 类 AI 视频商品；购买价为 1 亿 SC = 1 亿 CSC，兑换商品时还需支付 10% 附加 SC' },
];

const SC_FLOWS = [
  { dir: 'in',  label: '补贴到账', sub: '本轮补贴 3.11 亿（补贴 +3.7%）', amount: '+3.11 亿 SC', time: '今天 16:40' },
  { dir: 'in',  label: '兑换 SC',  sub: '10 DOS → 10 亿 SC',             amount: '+10 亿 SC',   time: '今天 14:23' },
  { dir: 'in',  label: '补贴到账', sub: '本轮折让 36%（折让）',           amount: '+5.20 亿 SC', time: '昨天 20:08' },
];

const ORDERS = [
  { combo: 'A×12  B×7  C×23', amount: '−9 亿 SC',  time: '今天 16:42' },
  { combo: 'A×2  B×1',        amount: '−13 亿 SC', time: '昨天 20:11' },
];

const VIDEO_PRODUCTS = [
  { id: 1, title: '星空延时·极光版', tag: '4K', dur: '30s', price: '1.5 亿', grad: 'linear-gradient(135deg,#1a1a4e,#3b2d8a,#6c3fa0)' },
  { id: 2, title: '海浪慢镜·日落',   tag: 'HD', dur: '15s', price: '0.8 亿', grad: 'linear-gradient(135deg,#0d4f7c,#1a8fa8,#43c6b0)' },
  { id: 3, title: '城市航拍·霓虹夜', tag: '4K', dur: '60s', price: '3 亿',   grad: 'linear-gradient(135deg,#1a0533,#7b1fa2,#e040fb)' },
  { id: 4, title: '樱花飘落·慢镜',   tag: 'HD', dur: '20s', price: '1 亿',   grad: 'linear-gradient(135deg,#4a0010,#c2185b,#f48fb1)' },
];

// ── Sub-components ───────────────────────────────────────────
function SloganBanner({ lang, setLang }) {
  return (
    <section
      className="mb-[22px] relative -mt-[24px] -mx-4 px-5 pt-[46px] pb-3 overflow-visible"
      style={{ background: 'linear-gradient(180deg, #e2f8f5 0%, #f7fbff 100%)' }}
    >
      <div className="pr-[128px]">
        <p className="font-slogan text-[19px] font-extrabold leading-[26px] text-tokenText">
          {lang === 'zh' ? '抢占视频首发权' : 'Claim First-Release Rights'}
        </p>
        <p className="font-slogan text-[19px] font-extrabold leading-[26px] text-tokenPrimary">
          {lang === 'zh' ? '解锁万亿词元补贴' : 'Unlock Trillion-Token Subsidy'}
        </p>
      </div>
      <img
        src="/assets/mascot-lobster.png"
        alt="首发权"
        className="absolute right-[20px] top-[11px] h-[140px] w-[150px] object-contain object-bottom"
      />
      <button
        onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')}
        className="absolute right-5 top-[32px] rounded-[4px] px-1.5 py-0.5 text-[12px] font-semibold leading-none"
        style={{ color: 'var(--color-text-secondary)', border: '1px solid color-mix(in srgb, var(--color-border) 62%, transparent)' }}
      >
        {lang === 'zh' ? 'EN' : '中'}
      </button>
    </section>
  );
}

function SCHeroCard({ onExchange }) {
  const [val, setVal] = useState(0);
  const target = 32.11;

  useEffect(() => {
    const dur = 300, start = performance.now();
    let frameId;
    const raf = (now) => {
      const t = Math.min((now - start) / dur, 1);
      setVal((1 - Math.pow(1 - t, 3)) * target);
      if (t < 1) frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section
      className="relative overflow-hidden px-4 pb-3 pt-3"
      style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: '0 4px 16px rgba(13,21,39,0.08)' }}
    >
      <div className="absolute -right-6 top-11 h-[90px] w-[110px] rounded-full blur-[20px] opacity-35" style={{ background: 'var(--color-primary-soft)' }} />
      <img src="/assets/sc-hero-illustration.png" className="absolute -right-7 -top-2.5 h-[180px] w-[180px] object-contain opacity-40" alt="" />

      <div className="relative">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-[17px] w-[17px] text-tokenPrimary" strokeWidth={2} />
            <span className="text-[17px] font-semibold leading-[22px] text-tokenText">词元余额 (SC)</span>
            <InfoTip text="平台基础词元：可由 DOS 兑换，也会作为 100 秒补贴发放；用于购买 ASC/BSC/CSC，并在兑换 AI 产品时支付 10% 附加 SC" size={13} />
          </div>
          <button
            onClick={onExchange}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white"
            style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
          >
            <ArrowLeftRight className="h-[14px] w-[14px]" strokeWidth={2.5} />
            兑换 SC
          </button>
        </div>

        <div className="flex items-end gap-1.5 text-tokenText">
          <span className="font-num text-[34px] font-semibold leading-none tracking-[-1px]">{val.toFixed(2)}</span>
          <span className="pb-1 text-[16px] font-medium">亿</span>
        </div>
      </div>
    </section>
  );
}

function ABCCard({ onBuy }) {
  return (
    <section className="mt-3 overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-md)' }}>
      <div className="relative flex items-center gap-2 px-4 pt-3.5 pb-2.5">
        <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
          <defs>
            <linearGradient id="hxGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#18d8c4"/>
              <stop offset="100%" stopColor="#0e9e8e"/>
            </linearGradient>
          </defs>
          <path d="M9 1.5 L16 5.25 L16 12.75 L9 16.5 L2 12.75 L2 5.25 Z" fill="none" stroke="url(#hxGrad)" strokeWidth="1.5"/>
          <polygon points="9,5.2 10.1,7.7 12.8,8 10.9,9.8 11.4,12.5 9,11.2 6.6,12.5 7.1,9.8 5.2,8 7.9,7.7" fill="url(#hxGrad)"/>
        </svg>
        <span className="text-[17px] font-semibold leading-[22px] text-tokenText">我的首发权</span>
      </div>
      <div className="h-px bg-tokenBorderSubtle" />

      <div className="grid grid-cols-3 gap-px" style={{ background: 'var(--color-border-subtle)' }}>
        {ABC_BALANCES.map((item) => (
          <div key={item.key} className="px-3 py-3" style={{ background: 'var(--color-bg-card)' }}>
            <div className="mb-2 flex items-center gap-1.5">
              <div
                className="grid h-7 w-[25px] shrink-0 place-items-center font-num text-[14px] font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, var(--token-${item.v}-from), var(--token-${item.v}-to))`,
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                }}
              >
                {item.key}
              </div>
              <span className="text-[12px] font-semibold leading-[16px]" style={{ color: `var(--token-${item.v}-text)` }}>
                {item.label}
              </span>
              <InfoTip text={item.tip} />
            </div>
            <p className="mb-0.5 text-[10px] leading-[13px] text-tokenHint">数量</p>
            <span className="font-num text-[20px] font-semibold leading-none text-tokenText">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-tokenCard px-3 pb-3 pt-2.5">
        <button
          onClick={onBuy}
          className="relative w-full overflow-hidden flex items-center gap-3 px-4 py-2.5 text-left"
          style={{ borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg,#17d4bf 0%,#0eb5a6 55%,#0a9090 100%)', boxShadow: '0 4px 14px rgba(14,185,166,0.35)' }}
        >
          <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />
          <div className="relative grid h-9 w-9 shrink-0 place-items-center" style={{ borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.22)' }}>
            <ArrowLeftRight className="nudge h-[18px] w-[18px] text-white" strokeWidth={2.2} />
          </div>
          <p className="relative text-[15px] font-bold leading-[20px] text-white flex-1">兑换首发权</p>
          <ChevronRight className="relative h-[17px] w-[17px] shrink-0 text-white/70" strokeWidth={2.2} />
        </button>
      </div>
    </section>
  );
}

function SubsidyCountdown({ onTrigger }) {
  const TOTAL = 100;
  const [secs, setSecs] = useState(5);
  const [done, setDone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [subsidyAmount] = useState(3.11);

  useEffect(() => {
    if (secs <= 0) { setDone(true); setShowModal(true); return; }
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const R = 30, SW = 4;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - secs / TOTAL);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  return (
    <>
      {showModal && (
        <SubsidyResultModal
          subsidyAmount={onTrigger ? onTrigger : subsidyAmount}
          orderTotal={9}
          onClose={() => setShowModal(false)}
        />
      )}
      {!done && (
        <section
          className="mt-3 flex items-center gap-4 px-4 py-3.5"
          style={{ borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg,#fff8ee 0%,#fff1d6 100%)', boxShadow: '0 4px 16px rgba(255,173,0,0.12)', border: '1px solid rgba(255,173,0,0.2)' }}
        >
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: '#ffad00', boxShadow: '0 0 6px #ffad00', animation: 'pulse 1.2s ease-in-out infinite' }} />
              <span className="text-[15px] font-bold" style={{ color: '#7a4800' }}>抽奖结算中</span>
            </div>
            <p className="text-[12px] leading-[17px]" style={{ color: 'rgba(122,72,0,0.7)' }}>A×12  B×7  C×23</p>
          </div>
          <div className="relative shrink-0" style={{ width: 68, height: 68 }}>
            <svg width="68" height="68" viewBox="0 0 68 68" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="34" cy="34" r={R} fill="none" stroke="rgba(255,173,0,0.18)" strokeWidth={SW} />
              <circle cx="34" cy="34" r={R} fill="none" stroke="#ffad00" strokeWidth={SW} strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-num text-[13px] font-bold leading-none" style={{ color: '#7a4800' }}>{mm}:{ss}</span>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function WalletHistory({ onMore }) {
  const [tab, setTab] = useState('sc');
  const TABS = [{ key: 'sc', label: '收支明细' }, { key: 'order', label: '兑换记录' }];

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-[17px] w-[17px] text-tokenPrimary" strokeWidth={2} />
          <h2 className="text-[17px] font-semibold leading-[22px] text-tokenText">历史记录</h2>
        </div>
        <button onClick={onMore} className="flex items-center gap-0.5 text-[13px] leading-[17px] text-tokenSub">
          更多 <ChevronRight className="h-[15px] w-[15px]" />
        </button>
      </div>

      <div className="mb-3 flex border-b border-tokenBorderSubtle">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="mr-5 pb-2 text-[14px] font-semibold leading-[20px] transition-colors"
            style={{
              color: tab === t.key ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: tab === t.key ? '2px solid var(--color-primary)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'sc' && (
        <div key="sc" className="tab-enter overflow-hidden bg-tokenCard" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          {SC_FLOWS.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3${i < 2 ? ' border-b border-tokenBorderSubtle' : ''}`}>
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: 'var(--color-success-soft)' }}>
                <ArrowDownLeft className="h-[18px] w-[18px] text-tokenSuccess" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium leading-[18px] text-tokenText">{item.label}</p>
                <p className="mt-0.5 truncate text-[12px] leading-[16px] text-tokenSub">{item.sub}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-num text-[15px] font-semibold leading-[20px] text-tokenSuccess">{item.amount}</p>
                <p className="mt-0.5 text-[11px] leading-[15px] text-tokenHint">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'order' && (
        <div key="order" className="tab-enter overflow-hidden bg-tokenCard" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          {ORDERS.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3${i < ORDERS.length - 1 ? ' border-b border-tokenBorderSubtle' : ''}`}>
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: 'var(--color-danger-soft)' }}>
                <ShoppingCart className="h-[18px] w-[18px] text-tokenDanger" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium leading-[18px] text-tokenText">{item.combo}</p>
                <p className="mt-0.5 truncate text-[12px] leading-[16px] text-tokenSub">首发权</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-num text-[15px] font-semibold leading-[20px] text-tokenDanger">{item.amount}</p>
                <p className="mt-0.5 text-[11px] leading-[15px] text-tokenHint">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function AIVideoMallPreview({ onEnter, onProduct }) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlayCircle className="h-[17px] w-[17px] text-tokenPrimary" strokeWidth={2} />
          <h2 className="text-[17px] font-semibold leading-[22px] text-tokenText">AI 生成</h2>
        </div>
        <button onClick={onEnter} className="flex items-center gap-0.5 text-[13px] leading-[17px] text-tokenSub">
          进入 <ChevronRight className="h-[15px] w-[15px]" />
        </button>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {VIDEO_PRODUCTS.map(p => (
          <button
            key={p.id}
            onClick={() => onProduct && onProduct(p)}
            className="relative shrink-0 overflow-hidden text-left"
            style={{ width: 140, borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}
          >
            <div className="relative h-[88px] w-full" style={{ background: p.grad }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid h-8 w-8 place-items-center rounded-full" style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(4px)' }}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                </div>
              </div>
              <span className="absolute left-2 top-2 rounded px-1.5 py-0.5 font-num text-[10px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.38)' }}>{p.tag}</span>
              <span className="absolute bottom-2 right-2 font-num text-[10px] text-white/80">{p.dur}</span>
            </div>
            <div className="bg-tokenCard px-2.5 py-2">
              <p className="truncate text-[12px] font-medium leading-[16px] text-tokenText">{p.title}</p>
              <p className="mt-1 font-num text-[13px] font-semibold leading-[17px] text-tokenPrimary">{p.price} SC</p>
            </div>
          </button>
        ))}
        <button
          onClick={onEnter}
          className="flex shrink-0 flex-col items-center justify-center gap-1.5 bg-tokenCard text-tokenSub"
          style={{ width: 72, borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="grid h-9 w-9 place-items-center rounded-full" style={{ background: 'var(--color-primary-soft)' }}>
            <ChevronRight className="h-4 w-4 text-tokenPrimary" strokeWidth={2.4} />
          </div>
          <span className="text-[11px] leading-[14px]">更多</span>
        </button>
      </div>
    </section>
  );
}

function DevPanel({ onClose, onTrigger }) {
  const scenarios = [
    { label: '折让演示', sub: '补贴 3.11 亿 < 下单 9 亿', amount: 3.11 },
    { label: '补贴演示', sub: '补贴 10.5 亿 > 下单 9 亿', amount: 10.5 },
  ];
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={onClose}>
      <div className="w-full max-w-[480px] px-4 pb-6" style={{ animation: 'sheetUp 260ms cubic-bezier(0.22,1,0.36,1) both' }} onClick={e => e.stopPropagation()}>
        <div className="overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-lg)' }}>
          <div className="flex items-center justify-between border-b border-tokenBorderSubtle px-4 py-3">
            <span className="text-[13px] font-semibold text-tokenSub">🛠 开发者演示</span>
            <button onClick={onClose} className="text-[13px] text-tokenHint">关闭</button>
          </div>
          {scenarios.map((s, i) => (
            <button key={i} onClick={() => { onTrigger(s.amount); onClose(); }}
              className={`flex items-center justify-between px-4 py-3.5 w-full text-left${i < scenarios.length - 1 ? ' border-b border-tokenBorderSubtle' : ''}`}>
              <div>
                <p className="text-[14px] font-medium text-tokenText">{s.label}</p>
                <p className="text-[12px] text-tokenHint">{s.sub}</p>
              </div>
              <ChevronRight className="h-[15px] w-[15px] text-tokenHint" />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Page ─────────────────────────────────────────────────────
export default function P0Wallet() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('zh');
  const [devOpen, setDevOpen] = useState(false);
  const [devVisible, setDevVisible] = useState(true);
  const [devModal, setDevModal] = useState(null);

  return (
    <>
      <header className="flex h-[68px] items-center px-4">
        <div className="w-[86px]" />
        <h1 className="flex-1 text-center text-[20px] font-semibold text-tokenText">超级龙虾</h1>
        <HeaderActions />
      </header>

      <main className="no-scrollbar h-[calc(100vh-68px-58px)] overflow-y-auto px-4 pb-8 pt-1">
        <div className="enter" style={{ animationDelay: '0ms' }}>
          <SloganBanner lang={lang} setLang={setLang} />
        </div>
        <div className="enter" style={{ animationDelay: '80ms' }}>
          <SCHeroCard onExchange={() => navigate('/exchange')} />
        </div>
        <div className="enter" style={{ animationDelay: '160ms' }}>
          <ABCCard onBuy={() => navigate('/buy')} />
        </div>
        <div className="enter" style={{ animationDelay: '260ms' }}>
          <SubsidyCountdown onTrigger={devModal} />
        </div>
        <div className="enter" style={{ animationDelay: '300ms' }}>
          <WalletHistory onMore={() => navigate('/history')} />
        </div>
        <div className="enter" style={{ animationDelay: '380ms' }}>
          <AIVideoMallPreview onEnter={() => navigate('/ai')} />
        </div>
      </main>

      {devOpen && <DevPanel onClose={() => setDevOpen(false)} onTrigger={(amt) => setDevModal(amt)} />}
      {devModal !== null && <SubsidyResultModal subsidyAmount={devModal} orderTotal={9} onClose={() => setDevModal(null)} />}
      {devVisible && (
        <div className="fixed bottom-[72px] right-4 z-40 flex flex-col items-end gap-1">
          <button onClick={() => setDevVisible(false)} className="flex h-4 w-4 items-center justify-center rounded-full text-white/70" style={{ background: 'rgba(13,21,39,0.4)', fontSize: 10 }}>×</button>
          <button onClick={() => setDevOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'rgba(13,21,39,0.55)', backdropFilter: 'blur(6px)', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
            <span className="font-num text-[11px] font-bold text-white">Dev</span>
          </button>
        </div>
      )}
    </>
  );
}
