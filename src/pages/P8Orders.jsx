import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, Cog, CheckCircle2 } from 'lucide-react';
import HeaderActions from '../components/HeaderActions';
import { useLanguage } from '../components/LanguageContext';

const MOCK = {
  pending: [
    { id: 'o001', title: '论语·仁义篇 × 3', type: 'A', cost: '30亿 ASC + 15亿 SC', time: '今天 16:42', duration: '30s' },
    { id: 'o002', title: '道德经·自然观 × 1', type: 'B', cost: '6亿 BSC + 3亿 SC', time: '今天 14:05', duration: '10s' },
  ],
  making: [
    { id: 'o003', title: '孙子兵法·谋略 × 5', type: 'A', cost: '50亿 ASC + 25亿 SC', time: '昨天 20:11', duration: '50s' },
  ],
  done: [
    { id: 'o004', title: '唐诗三百首 × 2', type: 'C', cost: '4亿 CSC + 2亿 SC',  time: '2天前 10:15', duration: '20s' },
    { id: 'o005', title: '庄子·逍遥游 × 4', type: 'B', cost: '24亿 BSC + 12亿 SC', time: '3天前 09:30', duration: '40s' },
  ],
};

const TABS = [
  { key: 'pending', label: '待制作', Icon: Clock,        color: 'var(--token-a-text)',    bg: 'var(--token-a-soft)' },
  { key: 'making',  label: '制作中', Icon: Cog,          color: 'var(--token-b-text)',    bg: 'var(--token-b-soft)' },
  { key: 'done',    label: '已完成', Icon: CheckCircle2, color: 'var(--color-success)',   bg: 'var(--color-success-soft)' },
];

const TYPE_COLOR = { A: 'var(--token-a-text)', B: 'var(--token-b-text)', C: 'var(--token-c-text)' };
const TYPE_BG    = { A: 'var(--token-a-soft)', B: 'var(--token-b-soft)', C: 'var(--token-c-soft)' };

export default function P8Orders() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [tab, setTab] = useState('pending');
  const items = MOCK[tab] ?? [];
  const tabs = lang === 'zh' ? TABS : [
    { key: 'pending', label: 'Queued', Icon: Clock, color: 'var(--token-a-text)', bg: 'var(--token-a-soft)' },
    { key: 'making', label: 'Rendering', Icon: Cog, color: 'var(--token-b-text)', bg: 'var(--token-b-soft)' },
    { key: 'done', label: 'Done', Icon: CheckCircle2, color: 'var(--color-success)', bg: 'var(--color-success-soft)' },
  ];
  const localizedItems = lang === 'zh' ? items : {
    pending: [
      { id: 'o001', title: 'Analects × 3', type: 'A', cost: '30B ASC + 15B SC', time: 'Today 16:42', duration: '30s' },
      { id: 'o002', title: 'Tao Te Ching × 1', type: 'B', cost: '6B BSC + 3B SC', time: 'Today 14:05', duration: '10s' },
    ],
    making: [
      { id: 'o003', title: 'The Art of War × 5', type: 'A', cost: '50B ASC + 25B SC', time: 'Yesterday 20:11', duration: '50s' },
    ],
    done: [
      { id: 'o004', title: 'Tang Poems × 2', type: 'C', cost: '4B CSC + 2B SC', time: '2d ago 10:15', duration: '20s' },
      { id: 'o005', title: 'Zhuangzi × 4', type: 'B', cost: '24B BSC + 12B SC', time: '3d ago 09:30', duration: '40s' },
    ],
  }[tab] ?? [];

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
          <div className="flex flex-col items-center justify-center py-20 text-tokenHint">
            <p className="text-[14px]">{lang === 'zh' ? '暂无订单' : 'No orders yet'}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {localizedItems.map(order => {
              const tabInfo = tabs.find(t => t.key === tab);
              return (
                <button
                  key={order.id}
                  onClick={() => tab === 'done' && navigate(`/orders/${order.id}`)}
                  className="w-full text-left overflow-hidden"
                  style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}
                >
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: TYPE_BG[order.type] }}>
                      <span className="font-num text-[16px] font-bold" style={{ color: TYPE_COLOR[order.type] }}>{order.type}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[14px] font-semibold text-tokenText">{order.title}</p>
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
                    <div className="flex items-center justify-between border-t border-tokenBorderSubtle px-4 py-2.5">
                      <span className="text-[12px] text-tokenHint">{lang === 'zh' ? `时长 ${order.duration}` : `Duration ${order.duration}`}</span>
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
