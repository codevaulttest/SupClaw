import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import BuyABCSheet from '../components/BuyABCSheet';
import MembershipSheet from '../components/MembershipSheet';
import ExchangeSCSheet from '../components/ExchangeSCSheet';
import ExchangeSubmittedSheet from '../components/ExchangeSubmittedSheet';
import {
  ArrowDownLeft, ArrowUpRight, ArrowLeftRight, ChevronRight, Clock, History,
  PlayCircle, ShoppingCart, Wallet, Lock, Languages, ReceiptText,
} from 'lucide-react';
import InfoTip from '../components/InfoTip';
import EmptyState from '../components/EmptyState';
import SubsidyResultModal from '../components/SubsidyResultModal';
import HeaderActions from '../components/HeaderActions';
import { useLanguage } from '../components/LanguageContext';
import { useUser } from '../components/UserContext';
import { useDev } from '../components/DevContext';
import { VISIBLE_CATEGORIES } from '../data/booklists';

// ── Mock data ────────────────────────────────────────────────
const ABC_BALANCES = [
  { key: 'A', v: 'a', label: 'ASC', value: '5.20', tip: '用 ASC 解锁 A 类 AI 视频，换 1 个 ASC 需消耗 5 亿 SC。' },
  { key: 'B', v: 'b', label: 'BSC', value: '3.00', tip: '用 BSC 解锁 B 类 AI 视频，换 1 个 BSC 需消耗 3 亿 SC。' },
  { key: 'C', v: 'c', label: 'CSC', value: '1.80', tip: '用 CSC 解锁 C 类 AI 视频，换 1 个 CSC 需消耗 1 亿 SC。' },
];

const SC_FLOWS = [
  { dir: 'in',      label: '兑换 SC',  sub: '5 DOS → 5 亿 SC',              amount: '+5 亿 SC',    time: '今天 17:02' },
  { dir: 'in',      label: '补贴到账', sub: '本轮补贴 3.11 亿（补贴 +3.7%）', amount: '+3.11 亿 SC', time: '今天 16:40' },
  { dir: 'out',     label: '兑换首发权', sub: 'A×2  B×1',                     amount: '-13 亿 SC',   time: '今天 14:23' },
];

const ORDERS = [
  { combo: 'A×12  B×7  C×23', amount: '−9 亿 SC',  time: '今天 16:42' },
  { combo: 'A×2  B×1',        amount: '−13 亿 SC', time: '昨天 20:11' },
];


// ── Sub-components ───────────────────────────────────────────
function SloganBanner() {
  const { lang, toggleLang } = useLanguage();
  return (
    <section
      className="mb-[22px] relative -mt-[24px] -mx-4 px-5 pt-[46px] pb-3 overflow-visible"
      style={{ background: 'linear-gradient(180deg, #e2f8f5 0%, #f7fbff 100%)' }}
    >
      <div className="pr-[128px]">
        <p className="font-slogan text-[19px] font-extrabold leading-[26px] text-tokenText">
          {lang === 'zh' ? '抢占视频首发权' : 'Claim Premiere Access'}
        </p>
        <p className="font-slogan text-[19px] font-extrabold leading-[26px] text-tokenPrimary">
          {lang === 'zh' ? '解锁万亿词元补贴' : 'Unlock Trillion-Token Subsidies'}
        </p>
      </div>
      <img
        src="/assets/mascot-lobster.png"
        alt={lang === 'zh' ? '首发权' : 'Premiere access'}
        className="absolute right-[20px] top-[11px] h-[140px] w-[150px] object-contain object-bottom"
      />
      <button
        onClick={toggleLang}
        className="absolute right-5 top-[32px] rounded-[4px] p-1"
        style={{ color: 'var(--color-text-secondary)', border: '1px solid color-mix(in srgb, var(--color-border) 62%, transparent)' }}
      >
        <Languages size={16} />
      </button>
    </section>
  );
}

function SCHeroCard({ onExchange }) {
  const { lang } = useLanguage();
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
            <span className="text-[17px] font-semibold leading-[22px] text-tokenText">{lang === 'zh' ? '词元余额 (SC)' : 'SC Balance'}</span>
            <InfoTip text={lang === 'zh' ? '用 SC 换成 ASC/BSC/CSC，解锁 AI 视频。SC 可通过 DOS 兑换获得，或通过 100 秒补贴自动到账。' : 'Swap SC into ASC, BSC, or CSC to unlock AI videos. Earn SC by swapping from DOS or receiving the 100-second subsidy.'} size={13} />
          </div>
          <button
            onClick={onExchange}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white"
            style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
          >
            <ArrowLeftRight className="h-[14px] w-[14px]" strokeWidth={2.5} />
            {lang === 'zh' ? '兑换' : 'Swap SC'}
          </button>
        </div>

        <div className="flex items-end gap-1.5 text-tokenText">
          <span className="font-num text-[34px] font-semibold leading-none tracking-[-1px]">{val.toFixed(2)}</span>
          <span className="pb-1 text-[16px] font-medium">{lang === 'zh' ? '亿' : 'B'}</span>
        </div>
      </div>
    </section>
  );
}

function ABCCard({ onBuy }) {
  const { lang } = useLanguage();
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
        <span className="text-[17px] font-semibold leading-[22px] text-tokenText">{lang === 'zh' ? '我的首发权' : 'My Premiere Access'}</span>
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
              <InfoTip text={lang === 'zh' ? item.tip : {
                A: 'Use ASC to unlock Type A AI videos. 1 ASC costs 5B SC.',
                B: 'Use BSC to unlock Type B AI videos. 1 BSC costs 3B SC.',
                C: 'Use CSC to unlock Type C AI videos. 1 CSC costs 1B SC.',
              }[item.key]} />
            </div>
            <p className="mb-0.5 text-[10px] leading-[13px] text-tokenHint">{lang === 'zh' ? '数量' : 'Balance'}</p>
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
          <p className="relative text-[15px] font-bold leading-[20px] text-white flex-1">{lang === 'zh' ? '兑换首发权' : 'Swap for Premiere Access'}</p>
          <ChevronRight className="relative h-[17px] w-[17px] shrink-0 text-white/70" strokeWidth={2.2} />
        </button>
      </div>
    </section>
  );
}

function SubsidyCountdown({ onTrigger }) {
  const { lang } = useLanguage();
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
              <span className="text-[15px] font-bold" style={{ color: '#7a4800' }}>{lang === 'zh' ? '补贴结算中' : 'Settlement in Progress'}</span>
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

function WalletHistory({ onMore, onMemberRequired }) {
  const { lang } = useLanguage();
  const { isMember } = useUser();
  const { emptyHistory } = useDev();
  const [tab, setTab] = useState('sc');
  const TABS = [
    { key: 'sc', label: lang === 'zh' ? 'SC 收支明细' : 'SC Activity' },
    { key: 'order', label: lang === 'zh' ? '首发权兑换记录' : 'Premiere Access Orders' },
  ];
  const flows = lang === 'zh' ? SC_FLOWS : [
    { dir: 'in', label: 'SC Swap', sub: '5 DOS -> 5B SC', amount: '+5B SC', time: 'Today 17:02' },
    { dir: 'in', label: 'Subsidy Received', sub: 'Round subsidy 3.11B (+3.7%)', amount: '+3.11B SC', time: 'Today 16:40' },
    { dir: 'out', label: 'Premiere Access', sub: 'A×2  B×1', amount: '-13B SC', time: 'Today 14:23' },
  ];
  const orders = lang === 'zh' ? ORDERS : [
    { combo: 'A×12  B×7  C×23', amount: '-9B SC', time: 'Today 16:42' },
    { combo: 'A×2  B×1', amount: '-13B SC', time: 'Yesterday 20:11' },
  ];

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-[17px] w-[17px] text-tokenPrimary" strokeWidth={2} />
          <h2 className="text-[17px] font-semibold leading-[22px] text-tokenText">{lang === 'zh' ? '历史记录' : 'History'}</h2>
        </div>
        <button onClick={onMore} className="flex items-center gap-0.5 text-[13px] leading-[17px] text-tokenSub">
          {lang === 'zh' ? '更多' : 'More'} <ChevronRight className="h-[15px] w-[15px]" />
        </button>
      </div>

      <div className="mb-3 flex border-b border-tokenBorderSubtle">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => {
              if (t.key === 'order' && !isMember) { onMemberRequired?.(); return; }
              setTab(t.key);
            }}
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
        emptyHistory
          ? <EmptyState icon={History} title={lang === 'zh' ? '暂无SC收支记录' : 'No SC activity yet'} subtitle={lang === 'zh' ? '兑换或补贴到账后将在此显示' : 'Swaps and subsidies will appear here'} />
          : <div key="sc" className="tab-enter overflow-hidden bg-tokenCard" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          {flows.map((item, i) => {
            const pending = item.dir === 'pending';
            const out = item.dir === 'out';
            const iconBg = pending ? '#fff8ee' : out ? 'var(--color-danger-soft)' : 'var(--color-success-soft)';
            const amountColor = pending ? '#d97706' : out ? 'var(--color-danger)' : 'var(--color-success)';
            return (
              <div key={i} className={`flex items-center gap-3 px-4 py-3${i < SC_FLOWS.length - 1 ? ' border-b border-tokenBorderSubtle' : ''}`}>
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: iconBg }}>
                  {pending
                    ? <Clock className="h-[17px] w-[17px]" style={{ color: '#f59e0b' }} strokeWidth={2} />
                    : out
                      ? <ArrowUpRight className="h-[18px] w-[18px] text-tokenDanger" strokeWidth={2.2} />
                      : <ArrowDownLeft className="h-[18px] w-[18px] text-tokenSuccess" strokeWidth={2.2} />
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[14px] font-medium leading-[18px] text-tokenText">{item.label}</p>
                    {pending && (
                      <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none" style={{ background: '#fff8ee', border: '1px solid #fcd34d', color: '#d97706' }}>{lang === 'zh' ? '处理中' : 'Processing'}</span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[12px] leading-[16px] text-tokenSub">{item.sub}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-num text-[15px] font-semibold leading-[20px]" style={{ color: amountColor }}>{item.amount}</p>
                  <p className="mt-0.5 text-[11px] leading-[15px] text-tokenHint">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'order' && (
        emptyHistory
          ? <EmptyState icon={ReceiptText} title={lang === 'zh' ? '暂无首发权记录' : 'No premiere orders yet'} subtitle={lang === 'zh' ? '兑换首发权后将在此显示' : 'Premiere access orders will appear here'} />
          : <div key="order" className="tab-enter overflow-hidden bg-tokenCard" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
            {orders.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3${i < ORDERS.length - 1 ? ' border-b border-tokenBorderSubtle' : ''}`}>
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: 'var(--color-danger-soft)' }}>
                  <ShoppingCart className="h-[18px] w-[18px] text-tokenDanger" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium leading-[18px] text-tokenText">{item.combo}</p>
                  <p className="mt-0.5 truncate text-[12px] leading-[16px] text-tokenSub">{lang === 'zh' ? '首发权' : 'Premiere Access'}</p>
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

function AIVideoMallPreview({ onEnter, onCategory }) {
  const { lang } = useLanguage();
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlayCircle className="h-[17px] w-[17px] text-tokenPrimary" strokeWidth={2} />
          <h2 className="text-[17px] font-semibold leading-[22px] text-tokenText">{lang === 'zh' ? 'AI 生成' : 'AI Create'}</h2>
        </div>
        <button onClick={onEnter} className="flex items-center gap-0.5 text-[13px] leading-[17px] text-tokenSub">
          {lang === 'zh' ? '进入' : 'Open'} <ChevronRight className="h-[15px] w-[15px]" />
        </button>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {VISIBLE_CATEGORIES.map(cat => {
          const cardStyle = { width: 130, borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', background: 'var(--color-bg-card)' };
          const imageArea = (
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={cat.image}
                alt={lang === 'zh' ? cat.name : cat.nameEn}
                className={`h-full w-full object-cover${cat.locked ? ' grayscale-[0.45] saturate-[0.7] opacity-80' : ''}`}
              />
              {cat.locked && (
                <div className="absolute inset-0 bg-slate-200/25">
                  <div className="flex items-start justify-end p-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-600 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                      <Lock className="h-2.5 w-2.5" strokeWidth={2} />
                      {lang === 'zh' ? '敬请期待' : 'Locked'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
          const textArea = (
            <div className="px-2.5 py-2">
              <p className="truncate text-[12px] font-semibold leading-[16px] text-tokenText">
                {lang === 'zh' ? cat.name : cat.nameEn}
              </p>
            </div>
          );
          return cat.locked ? (
            <div
              key={cat.id}
              className="relative shrink-0 overflow-hidden text-left"
              style={{ ...cardStyle, opacity: 0.72 }}
              aria-disabled="true"
            >
              {imageArea}
              {textArea}
            </div>
          ) : (
            <button
              type="button"
              key={cat.id}
              onClick={() => onCategory && onCategory(cat.id)}
              className="relative shrink-0 appearance-none overflow-hidden border-0 p-0 text-left"
              style={cardStyle}
            >
              {imageArea}
              {textArea}
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default function P0Wallet() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { subsidyTrigger, setSubsidyTrigger, devScvInvalid } = useDev();
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [exchangeSubmitted, setExchangeSubmitted] = useState(null);
  const [buySubmitted, setBuySubmitted] = useState(null);
  const [buyOpen, setBuyOpen] = useState(false);
  const [devModal, setDevModal] = useState(null);
  const [membershipOpen, setMembershipOpen] = useState(false);

  useEffect(() => {
    if (subsidyTrigger !== null) {
      setDevModal(subsidyTrigger);
      setSubsidyTrigger(null);
    }
  }, [subsidyTrigger, setSubsidyTrigger]);

  return (
    <>
      <header className="flex h-[68px] items-center px-4">
        <div className="w-[86px]" />
        <h1 className="flex-1 text-center text-[20px] font-semibold text-tokenText">{lang === 'zh' ? '超级龙虾' : 'SupClaw'}</h1>
        <HeaderActions />
      </header>

      <main className="no-scrollbar h-[calc(100vh-68px-58px)] overflow-y-auto px-4 pb-8 pt-1">
        <div className="enter" style={{ animationDelay: '0ms' }}>
          <SloganBanner />
        </div>
        <div className="enter" style={{ animationDelay: '80ms' }}>
          <SCHeroCard onExchange={() => setExchangeOpen(true)} />
        </div>
        <div className="enter" style={{ animationDelay: '160ms' }}>
          <ABCCard onBuy={() => setBuyOpen(true)} />
        </div>
        <div className="enter" style={{ animationDelay: '260ms' }}>
          <SubsidyCountdown onTrigger={devModal} />
        </div>
        <div className="enter" style={{ animationDelay: '300ms' }}>
          <WalletHistory onMore={() => navigate('/history')} onMemberRequired={() => setMembershipOpen(true)} />
        </div>
        <div className="enter" style={{ animationDelay: '380ms' }}>
          <AIVideoMallPreview onEnter={() => navigate('/ai')} onCategory={(id) => navigate(`/ai/${id}`)} />
        </div>
      </main>

      {exchangeOpen && (
        <ExchangeSCSheet
          onClose={() => setExchangeOpen(false)}
          onSubmit={(amt) => setExchangeSubmitted(amt)}
          devForceInvalid={devScvInvalid}
        />
      )}
      {exchangeSubmitted !== null && (
        <ExchangeSubmittedSheet amount={exchangeSubmitted} onClose={() => setExchangeSubmitted(null)} />
      )}
      {buySubmitted && (
        <ExchangeSubmittedSheet
          detail={lang === 'zh' ? `${buySubmitted.combo} · 扣除 ${buySubmitted.total} 亿 SC` : `${buySubmitted.combo} · ${buySubmitted.total}B SC deducted`}
          onClose={() => setBuySubmitted(null)}
        />
      )}
      {buyOpen && (
        <BuyABCSheet
          onClose={() => setBuyOpen(false)}
          onOpenExchange={() => { setBuyOpen(false); setExchangeOpen(true); }}
          onSubmit={(payload) => setBuySubmitted(payload)}
          onOpenMembership={() => { setBuyOpen(false); setMembershipOpen(true); }}
        />
      )}
      {devModal !== null && <SubsidyResultModal subsidyAmount={devModal} orderTotal={9} onClose={() => setDevModal(null)} />}
      {membershipOpen && (
        <MembershipSheet
          onClose={() => setMembershipOpen(false)}
          onActivate={() => { setMembershipOpen(false); setBuyOpen(true); }}
        />
      )}
    </>
  );
}
