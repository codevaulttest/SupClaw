import { useState } from 'react';
import { ArrowDownLeft, ShoppingCart, History, ReceiptText } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { useLanguage } from '../components/LanguageContext';
import { useUser } from '../components/UserContext';
import { useDev } from '../components/DevContext';
import MembershipSheet from '../components/MembershipSheet';

const SC_FLOWS = [
  { label: '补贴到账', sub: '本轮补贴 +3.7%',              amount: '+3.11 亿 SC', time: '今天 16:40',  color: 'success' },
  { label: '兑换 SC',  sub: '10 DOS → 10 亿 SC',           amount: '+10 亿 SC',   time: '今天 14:23',  color: 'success' },
  { label: '补贴到账', sub: '本轮折让 36%',                 amount: '+5.20 亿 SC', time: '昨天 20:08',  color: 'success' },
  { label: '兑换 SC',  sub: '5 DOS → 5 亿 SC',             amount: '+5 亿 SC',    time: '昨天 10:15',  color: 'success' },
  { label: '补贴到账', sub: '本轮补贴 +2.1%',              amount: '+2.88 亿 SC', time: '3天前 18:33', color: 'success' },
  { label: '兑换 SC',  sub: '20 DOS → 20 亿 SC',           amount: '+20 亿 SC',   time: '3天前 09:00', color: 'success' },
];

const ORDERS = [
  { combo: 'A×12  B×7  C×23', amount: '−9 亿 SC',  time: '今天 16:42' },
  { combo: 'A×2  B×1',        amount: '−13 亿 SC', time: '昨天 20:11' },
  { combo: 'B×5  C×10',       amount: '−25 亿 SC', time: '2天前 14:05' },
  { combo: 'A×3',             amount: '−15 亿 SC', time: '3天前 19:22' },
];

const TABS = [{ key: 'sc', label: 'SC 收支明细' }, { key: 'order', label: '首发权兑换记录' }];

export default function P5History() {
  const { lang } = useLanguage();
  const { isMember } = useUser();
  const { emptyHistory } = useDev();
  const [tab, setTab] = useState('sc');
  const [showMembership, setShowMembership] = useState(false);
  const tabs = [
    { key: 'sc', label: lang === 'zh' ? 'SC 收支明细' : 'SC Activity' },
    { key: 'order', label: lang === 'zh' ? '首发权兑换记录' : 'Premiere Access Orders' },
  ];
  const flows = lang === 'zh' ? SC_FLOWS : [
    { label: 'Subsidy Received', sub: 'Round subsidy 3.11B (+3.7%)', amount: '+3.11B SC', time: 'Today 16:40' },
    { label: 'SC Swap', sub: '10 DOS -> 10B SC', amount: '+10B SC', time: 'Today 14:23' },
    { label: 'Subsidy Received', sub: 'Round discount 36%', amount: '+5.20B SC', time: 'Yesterday 20:08' },
    { label: 'SC Swap', sub: '5 DOS -> 5B SC', amount: '+5B SC', time: 'Yesterday 10:15' },
    { label: 'Subsidy Received', sub: 'Round subsidy 2.88B (+2.1%)', amount: '+2.88B SC', time: '3d ago 18:33' },
    { label: 'SC Swap', sub: '20 DOS -> 20B SC', amount: '+20B SC', time: '3d ago 09:00' },
  ];
  const orders = lang === 'zh' ? ORDERS : [
    { combo: 'A×12  B×7  C×23', amount: '-9B SC', time: 'Today 16:42' },
    { combo: 'A×2  B×1', amount: '-13B SC', time: 'Yesterday 20:11' },
    { combo: 'B×5  C×10', amount: '-25B SC', time: '2d ago 14:05' },
    { combo: 'A×3', amount: '-15B SC', time: '3d ago 19:22' },
  ];

  return (
    <>
      <PageHeader title={lang === 'zh' ? '历史记录' : 'History'} />

      <div className="px-4 pt-4 pb-8">
        {/* tab bar */}
        <div className="mb-4 flex border-b border-tokenBorderSubtle">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => {
                if (t.key === 'order' && !isMember) { setShowMembership(true); return; }
                setTab(t.key);
              }}
              className="mr-5 pb-2 text-[14px] font-semibold leading-[20px]"
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
            : (
              <div className="tab-enter overflow-hidden bg-tokenCard" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                {flows.map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-3${i < SC_FLOWS.length - 1 ? ' border-b border-tokenBorderSubtle' : ''}`}>
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
            )
        )}

        {tab === 'order' && (
          emptyHistory
            ? <EmptyState icon={ReceiptText} title={lang === 'zh' ? '暂无首发权记录' : 'No premiere orders yet'} subtitle={lang === 'zh' ? '兑换首发权后将在此显示' : 'Premiere access orders will appear here'} />
            : (
              <div className="tab-enter overflow-hidden bg-tokenCard" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                {orders.map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 px-4 py-3${i < ORDERS.length - 1 ? ' border-b border-tokenBorderSubtle' : ''}`}>
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: 'var(--color-danger-soft)' }}>
                      <ShoppingCart className="h-[18px] w-[18px] text-tokenDanger" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium leading-[18px] text-tokenText">{item.combo}</p>
                      <p className="mt-0.5 text-[12px] leading-[16px] text-tokenSub">{lang === 'zh' ? '首发权' : 'Premiere Access'}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-num text-[15px] font-semibold leading-[20px] text-tokenDanger">{item.amount}</p>
                      <p className="mt-0.5 text-[11px] leading-[15px] text-tokenHint">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
        )}
      </div>

      {showMembership && (
        <MembershipSheet
          onClose={() => setShowMembership(false)}
          onActivate={() => setTab('order')}
        />
      )}
    </>
  );
}
