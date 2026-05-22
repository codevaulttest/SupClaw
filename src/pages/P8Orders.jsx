import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, Cog, CheckCircle2, Inbox, Play } from 'lucide-react';
import HeaderActions from '../components/HeaderActions';
import EmptyState from '../components/EmptyState';
import { useLanguage } from '../components/LanguageContext';
import { useDev } from '../components/DevContext';

const MOCK = {
  pending: [
    { id: 'o001', title: '《管理的实践》', qty: 3, type: 'A', cost: '3 ASC + 1.5亿 SC', time: '2026-05-22 16:42', duration: '30s' },
    { id: 'o002', title: '《卓有成效的管理者》', qty: 1, type: 'B', cost: '1 BSC + 0.3亿 SC', time: '2026-05-22 14:05', duration: '10s' },
    { id: 'o006', title: '《管理：任务、责任、实践》', qty: 2, type: 'C', cost: '2 CSC + 0.2亿 SC', time: '2026-05-22 13:28', duration: '20s' },
    { id: 'o007', title: '《创新与企业家精神》', qty: 4, type: 'C', cost: '4 CSC + 0.4亿 SC', time: '2026-05-22 11:46', duration: '40s' },
    { id: 'o008', title: '《竞争战略》', qty: 1, type: 'B', cost: '1 BSC + 0.3亿 SC', time: '2026-05-21 22:18', duration: '10s' },
    { id: 'o009', title: '《竞争优势》', qty: 2, type: 'A', cost: '2 ASC + 1亿 SC', time: '2026-05-21 18:35', duration: '20s' },
  ],
  making: [
    { id: 'o003', title: '《地理学与生活》', qty: 5, type: 'A', cost: '5 ASC + 2.5亿 SC', time: '2026-05-21 20:11', duration: '50s' },
    { id: 'o010', title: '《人文地理学导论》', qty: 3, type: 'B', cost: '3 BSC + 0.9亿 SC', time: '2026-05-22 15:30', duration: '30s' },
    { id: 'o011', title: '《地理学思想史》', qty: 2, type: 'C', cost: '2 CSC + 0.2亿 SC', time: '2026-05-22 12:08', duration: '20s' },
    { id: 'o012', title: '《地理学的性质》', qty: 6, type: 'C', cost: '6 CSC + 0.6亿 SC', time: '2026-05-21 19:52', duration: '60s' },
    { id: 'o013', title: '《地理学中的解释》', qty: 1, type: 'B', cost: '1 BSC + 0.3亿 SC', time: '2026-05-21 17:20', duration: '10s' },
  ],
  done: [
    { id: 'o004', title: '《人文地理学导论》', qty: 2, type: 'B', cost: '2 BSC + 0.6亿 SC', time: '2026-05-20 10:15', duration: '20s' },
    { id: 'o005', title: '《地理学思想史》', qty: 4, type: 'C', cost: '4 CSC + 0.4亿 SC', time: '2026-05-19 09:30', duration: '40s' },
    { id: 'o014', title: '《国家竞争优势》', qty: 2, type: 'B', cost: '2 BSC + 0.6亿 SC', time: '2026-05-19 18:02', duration: '20s' },
    { id: 'o015', title: '《蓝海战略》', qty: 1, type: 'C', cost: '1 CSC + 0.1亿 SC', time: '2026-05-18 16:55', duration: '10s' },
    { id: 'o016', title: '《从优秀到卓越》', qty: 3, type: 'C', cost: '3 CSC + 0.3亿 SC', time: '2026-05-18 13:40', duration: '30s' },
    { id: 'o017', title: '《基业长青》', qty: 2, type: 'B', cost: '2 BSC + 0.6亿 SC', time: '2026-05-17 09:12', duration: '20s' },
  ],
};

const TABS = [
  { key: 'pending', label: '待制作', Icon: Clock,        color: 'var(--token-a-text)',    bg: 'var(--token-a-soft)' },
  { key: 'making',  label: '制作中', Icon: Cog,          color: 'var(--token-b-text)',    bg: 'var(--token-b-soft)' },
  { key: 'done',    label: '已完成', Icon: CheckCircle2, color: 'var(--color-success)',   bg: 'var(--color-success-soft)' },
];


const EMPTY_LABELS = {
  pending: { zh: ['暂无待制作订单', '兑换后将在这里显示'], en: ['No queued orders', 'Your pending orders will appear here'] },
  making:  { zh: ['暂无制作中订单', '制作开始后将在这里显示'], en: ['Nothing rendering', 'Orders in progress will appear here'] },
  done:    { zh: ['暂无已完成订单', '完成的视频将在这里显示'], en: ['No completed orders', 'Finished videos will appear here'] },
};

export default function P8Orders() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { emptyOrders } = useDev();
  const [tab, setTab] = useState('pending');
  const items = emptyOrders ? [] : (MOCK[tab] ?? []);
  const tabs = lang === 'zh' ? TABS : [
    { key: 'pending', label: 'Queued', Icon: Clock, color: 'var(--token-a-text)', bg: 'var(--token-a-soft)' },
    { key: 'making', label: 'Rendering', Icon: Cog, color: 'var(--token-b-text)', bg: 'var(--token-b-soft)' },
    { key: 'done', label: 'Done', Icon: CheckCircle2, color: 'var(--color-success)', bg: 'var(--color-success-soft)' },
  ];
  const localizedItems = lang === 'zh'
    ? items
    : items.map(order => ({
      ...order,
      cost: order.cost.replaceAll('亿', 'B'),
    }));

  return (
    <div className="flex flex-col min-h-[calc(100vh-58px)]">
      <header className="flex h-[68px] items-center px-4">
        <div className="w-[86px]" />
        <h1 className="flex-1 text-center text-[20px] font-semibold text-tokenText">{lang === 'zh' ? '订单' : 'Orders'}</h1>
        <HeaderActions />
      </header>

      {/* tab bar */}
      <div className="flex border-b border-tokenBorder px-4">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="mr-5 pb-3 text-[14px] font-semibold leading-[20px]"
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

      <div className="flex-1 px-4 pt-4 pb-[74px]">
        {localizedItems.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={EMPTY_LABELS[tab][lang === 'zh' ? 'zh' : 'en'][0]}
            subtitle={EMPTY_LABELS[tab][lang === 'zh' ? 'zh' : 'en'][1]}
          />
        ) : (
          <div key={tab} className="flex flex-col gap-3">
            {localizedItems.map((order, i) => {
              const tabInfo = tabs.find(t => t.key === tab);
              return (
                <button
                  key={order.id}
                  onClick={() => tab === 'done' && navigate(`/orders/${order.id}`)}
                  className="enter w-full text-left overflow-hidden"
                  style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)', animationDelay: `${i * 45}ms` }}
                >
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <div className="relative shrink-0 h-11 w-11 rounded-xl overflow-hidden" style={{ background: `linear-gradient(135deg, var(--token-${order.type.toLowerCase()}-from), var(--token-${order.type.toLowerCase()}-to))` }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-4 w-4 fill-white text-white" strokeWidth={0} />
                      </div>
                      <span className="absolute left-1 top-1 rounded px-1 py-0 text-[9px] font-bold text-white leading-4" style={{ background: 'rgba(0,0,0,0.28)' }}>{order.type}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="truncate text-[14px] font-semibold text-tokenText">{order.title}</p>
                        <span
                          className="shrink-0 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-num"
                          style={{ background: 'var(--color-bg-subtle)', color: 'var(--color-text-secondary)', fontSize: '11px', fontWeight: 500, lineHeight: 1 }}
                        >
                          <Play className="h-2.5 w-2.5" strokeWidth={2.5} />
                          {order.duration}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[12px] text-tokenSub">{order.cost}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="flex items-center gap-1 justify-end" style={{ color: tabInfo.color }}>
                        <tabInfo.Icon className="h-3.5 w-3.5" strokeWidth={2} />
                        <span className="text-[12px] font-semibold">{tabInfo.label}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-tokenHint">{order.time}</p>
                    </div>
                  </div>
                  {tab === 'done' && (
                    <div className="flex items-center justify-center border-t border-tokenBorderSubtle px-4 py-2.5">
                      <span className="flex items-center gap-1 text-[12px] font-semibold text-tokenPrimary">
                        {lang === 'zh' ? '查看视频' : 'Watch Video'} <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}