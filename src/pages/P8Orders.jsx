import { useRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, Cog, CheckCircle2, Inbox, Play } from 'lucide-react';
import TokenIcon from '../components/TokenIcon';
import { useVirtualizer } from '@tanstack/react-virtual';
import HeaderActions from '../components/HeaderActions';
import EmptyState from '../components/EmptyState';
import { useLanguage } from '../components/LanguageContext';
import { useDev } from '../components/DevContext';
import { formatScText } from '../utils/formatSc';
import { getBookTitleEn } from '../data/booklists';

const MOCK = {
  pending: [
    { id: 'o001', title: '《管理的实践》',             qty: 3, type: 'A', cost: '3 ASC + 1.5亿 SC', time: '2026-05-22 16:42', duration: '30s' },
    { id: 'o002', title: '《卓有成效的管理者》',       qty: 1, type: 'B', cost: '1 BSC + 0.3亿 SC', time: '2026-05-22 14:05', duration: '10s' },
    { id: 'o006', title: '《管理：任务、责任、实践》', qty: 2, type: 'C', cost: '2 CSC + 0.2亿 SC', time: '2026-05-22 13:28', duration: '20s' },
    { id: 'o007', title: '《创新与企业家精神》',       qty: 4, type: 'C', cost: '4 CSC + 0.4亿 SC', time: '2026-05-22 11:46', duration: '40s' },
    { id: 'o008', title: '《竞争战略》',               qty: 1, type: 'B', cost: '1 BSC + 0.3亿 SC', time: '2026-05-21 22:18', duration: '10s' },
    { id: 'o009', title: '《竞争优势》',               qty: 2, type: 'A', cost: '2 ASC + 1亿 SC',   time: '2026-05-21 18:35', duration: '20s' },
  ],
  making: [
    { id: 'm001', title: '《地理学与生活》',     qty: 5, type: 'A', cost: '5 ASC + 2.5亿 SC', time: '2026-05-22 15:30', duration: '50s' },
    { id: 'm002', title: '《人文地理学导论》',   qty: 3, type: 'B', cost: '3 BSC + 0.9亿 SC', time: '2026-05-22 14:20', duration: '30s' },
    { id: 'm003', title: '《地理学思想史》',     qty: 2, type: 'C', cost: '2 CSC + 0.2亿 SC', time: '2026-05-22 13:05', duration: '20s' },
    { id: 'm004', title: '《地理学的性质》',     qty: 6, type: 'C', cost: '6 CSC + 0.6亿 SC', time: '2026-05-22 11:50', duration: '60s' },
    { id: 'm005', title: '《地理学中的解释》',   qty: 1, type: 'B', cost: '1 BSC + 0.3亿 SC', time: '2026-05-22 10:30', duration: '10s' },
    { id: 'm006', title: '《国家竞争优势》',     qty: 2, type: 'A', cost: '2 ASC + 1亿 SC',   time: '2026-05-22 09:15', duration: '20s' },
    { id: 'm007', title: '《创新与企业家精神》', qty: 3, type: 'C', cost: '3 CSC + 0.3亿 SC', time: '2026-05-21 22:40', duration: '30s' },
    { id: 'm008', title: '《竞争优势》',         qty: 1, type: 'B', cost: '1 BSC + 0.3亿 SC', time: '2026-05-21 21:10', duration: '10s' },
    { id: 'm009', title: '《管理的实践》',       qty: 4, type: 'A', cost: '4 ASC + 2亿 SC',   time: '2026-05-21 19:55', duration: '40s' },
    { id: 'm010', title: '《第五项修炼》',       qty: 2, type: 'C', cost: '2 CSC + 0.2亿 SC', time: '2026-05-21 18:30', duration: '20s' },
    { id: 'm011', title: '《蓝海战略》',         qty: 1, type: 'B', cost: '1 BSC + 0.3亿 SC', time: '2026-05-21 17:00', duration: '10s' },
    { id: 'm012', title: '《从优秀到卓越》',     qty: 3, type: 'A', cost: '3 ASC + 1.5亿 SC', time: '2026-05-21 15:45', duration: '30s' },
    { id: 'm013', title: '《基业长青》',         qty: 2, type: 'C', cost: '2 CSC + 0.2亿 SC', time: '2026-05-21 14:20', duration: '20s' },
    { id: 'm014', title: '《竞争战略》',         qty: 1, type: 'B', cost: '1 BSC + 0.3亿 SC', time: '2026-05-21 13:05', duration: '10s' },
    { id: 'm015', title: '《卓有成效的管理者》', qty: 4, type: 'A', cost: '4 ASC + 2亿 SC',   time: '2026-05-21 11:50', duration: '40s' },
    { id: 'm016', title: '《地理学与生活》',     qty: 2, type: 'C', cost: '2 CSC + 0.2亿 SC', time: '2026-05-21 10:30', duration: '20s' },
    { id: 'm017', title: '《人文地理学导论》',   qty: 1, type: 'B', cost: '1 BSC + 0.3亿 SC', time: '2026-05-21 09:10', duration: '10s' },
    { id: 'm018', title: '《国家竞争优势》',     qty: 3, type: 'A', cost: '3 ASC + 1.5亿 SC', time: '2026-05-20 22:55', duration: '30s' },
    { id: 'm019', title: '《地理学思想史》',     qty: 5, type: 'C', cost: '5 CSC + 0.5亿 SC', time: '2026-05-20 21:40', duration: '50s' },
    { id: 'm020', title: '《创新与企业家精神》', qty: 2, type: 'B', cost: '2 BSC + 0.6亿 SC', time: '2026-05-20 20:20', duration: '20s' },
    { id: 'm021', title: '《竞争优势》',         qty: 4, type: 'A', cost: '4 ASC + 2亿 SC',   time: '2026-05-20 19:00', duration: '40s' },
    { id: 'm022', title: '《管理的实践》',       qty: 1, type: 'C', cost: '1 CSC + 0.1亿 SC', time: '2026-05-20 17:45', duration: '10s' },
    { id: 'm023', title: '《第五项修炼》',       qty: 3, type: 'B', cost: '3 BSC + 0.9亿 SC', time: '2026-05-20 16:30', duration: '30s' },
    { id: 'm024', title: '《蓝海战略》',         qty: 2, type: 'A', cost: '2 ASC + 1亿 SC',   time: '2026-05-20 15:10', duration: '20s' },
    { id: 'm025', title: '《地理学的性质》',     qty: 1, type: 'C', cost: '1 CSC + 0.1亿 SC', time: '2026-05-20 13:55', duration: '10s' },
    { id: 'm026', title: '《从优秀到卓越》',     qty: 4, type: 'B', cost: '4 BSC + 1.2亿 SC', time: '2026-05-20 12:40', duration: '40s' },
    { id: 'm027', title: '《基业长青》',         qty: 2, type: 'C', cost: '2 CSC + 0.2亿 SC', time: '2026-05-20 11:20', duration: '20s' },
    { id: 'm028', title: '《竞争战略》',         qty: 3, type: 'A', cost: '3 ASC + 1.5亿 SC', time: '2026-05-20 10:05', duration: '30s' },
    { id: 'm029', title: '《卓有成效的管理者》', qty: 1, type: 'C', cost: '1 CSC + 0.1亿 SC', time: '2026-05-20 08:50', duration: '10s' },
    { id: 'm030', title: '《地理学中的解释》',   qty: 2, type: 'B', cost: '2 BSC + 0.6亿 SC', time: '2026-05-19 22:30', duration: '20s' },
  ],
  done: [
    { id: 'o004', title: '《人文地理学导论》',       qty: 2, type: 'B', cost: '2 BSC + 0.6亿 SC',  time: '2026-05-20 10:15', duration: '20s' },
    { id: 'o005', title: '《地理学思想史》',         qty: 4, type: 'C', cost: '4 CSC + 0.4亿 SC',  time: '2026-05-19 09:30', duration: '40s' },
    { id: 'o014', title: '《国家竞争优势》',         qty: 2, type: 'B', cost: '2 BSC + 0.6亿 SC',  time: '2026-05-19 18:02', duration: '20s' },
    { id: 'o015', title: '《蓝海战略》',             qty: 1, type: 'C', cost: '1 CSC + 0.1亿 SC',  time: '2026-05-18 16:55', duration: '10s' },
    { id: 'o016', title: '《从优秀到卓越》',         qty: 3, type: 'C', cost: '3 CSC + 0.3亿 SC',  time: '2026-05-18 13:40', duration: '30s' },
    { id: 'o017', title: '《基业长青》',             qty: 2, type: 'B', cost: '2 BSC + 0.6亿 SC',  time: '2026-05-17 09:12', duration: '20s' },
    { id: 'o027', title: '《竞争战略》',             qty: 1, type: 'A', cost: '1 ASC + 0.5亿 SC',  time: '2026-05-17 15:30', duration: '10s' },
    { id: 'o028', title: '《管理的实践》',           qty: 2, type: 'C', cost: '2 CSC + 0.2亿 SC',  time: '2026-05-16 11:20', duration: '20s' },
    { id: 'o029', title: '《卓有成效的管理者》',     qty: 3, type: 'B', cost: '3 BSC + 0.9亿 SC',  time: '2026-05-16 08:45', duration: '30s' },
    { id: 'o030', title: '《地理学与生活》',         qty: 1, type: 'A', cost: '1 ASC + 0.5亿 SC',  time: '2026-05-15 20:00', duration: '10s' },
  ],
};

const TABS = [
  { key: 'pending', label: '待制作', Icon: Clock,        color: 'var(--token-a-text)' },
  { key: 'making',  label: '制作中', Icon: Cog,          color: 'var(--token-b-text)' },
  { key: 'done',    label: '已完成', Icon: CheckCircle2, color: 'var(--color-success)' },
];

const EMPTY_LABELS = {
  pending: { zh: ['暂无待制作订单', '兑换后将在这里显示'],     en: ['No queued orders',    'Your pending orders will appear here'] },
  making:  { zh: ['暂无制作中订单', '制作开始后将在这里显示'], en: ['No videos rendering', 'Orders in progress will appear here'] },
  done:    { zh: ['暂无已完成订单', '完成的视频将在这里显示'], en: ['No completed orders', 'Finished videos will appear here'] },
};

const ITEM_SIZE = { pending: 84, making: 84, done: 130 };

function OrderCard({ order, tabInfo, tab, lang, navigate, index }) {
  const animated = index < 10;
  return (
    <button
      onClick={() => tab === 'done' && navigate(`/orders/${order.id}`)}
      className={`${animated ? 'enter' : ''} w-full text-left overflow-hidden`}
      style={{
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-bg-card)',
        boxShadow: 'var(--shadow-sm)',
        ...(animated ? { animationDelay: `${index * 45}ms` } : {}),
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        <TokenIcon type={order.type} />
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
}

export default function P8Orders() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { emptyOrders } = useDev();
  const [tab, setTab] = useState('pending');
  const scrollRef = useRef(null);

  const tabs = lang === 'zh' ? TABS : [
    { key: 'pending', label: 'Queued',    Icon: Clock,        color: 'var(--token-a-text)' },
    { key: 'making',  label: 'Rendering', Icon: Cog,          color: 'var(--token-b-text)' },
    { key: 'done',    label: 'Completed', Icon: CheckCircle2, color: 'var(--color-success)' },
  ];

  const rawItems = emptyOrders ? [] : (MOCK[tab] ?? []);
  const items = useMemo(
    () => lang === 'zh' ? rawItems : rawItems.map(o => ({ ...o, title: getBookTitleEn(o.title), cost: formatScText(o.cost, lang) })),
    [rawItems, lang],
  );

  const tabInfo = tabs.find(t => t.key === tab);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ITEM_SIZE[tab],
    overscan: 5,
    measureElement: el => el?.getBoundingClientRect().height,
  });

  return (
    <div className="flex flex-col min-h-[calc(100vh-58px)]">
      <header className="flex h-[68px] items-center px-4 bg-white border-b border-tokenBorderSubtle">
        <div className="w-[86px]" />
        <h1 className="flex-1 text-center text-[20px] font-semibold text-tokenText">{lang === 'zh' ? '订单' : 'Orders'}</h1>
        <HeaderActions />
      </header>

      <div className="flex border-b border-tokenBorder px-4 mt-3">
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

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-4 pb-[74px]">
        {items.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={EMPTY_LABELS[tab][lang === 'zh' ? 'zh' : 'en'][0]}
            subtitle={EMPTY_LABELS[tab][lang === 'zh' ? 'zh' : 'en'][1]}
          />
        ) : (
          <>
            <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
              {virtualizer.getVirtualItems().map(vItem => (
                <div
                  key={vItem.key}
                  ref={virtualizer.measureElement}
                  data-index={vItem.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    transform: `translateY(${vItem.start}px)`,
                    paddingBottom: '12px',
                  }}
                >
                  <OrderCard
                    order={items[vItem.index]}
                    index={vItem.index}
                    tabInfo={tabInfo}
                    tab={tab}
                    lang={lang}
                    navigate={navigate}
                  />
                </div>
              ))}
            </div>
            <p className="py-6 text-center text-[12px] text-tokenHint">
              {lang === 'zh' ? '已显示全部记录' : 'All records loaded'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
