import { useParams } from 'react-router-dom';
import { CheckCircle2, Download, Play } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import OrderCard from '../components/OrderCard';
import { useLanguage } from '../components/LanguageContext';
import { getBookTitleEn } from '../data/booklists';

const MOCK_ZH = {
  o004: { id: 'o004', title: '《人文地理学导论》', type: 'B', duration: '20s', cost: '2 BSC + 0.6亿 SC', time: '2026-05-20 10:15' },
  o005: { id: 'o005', title: '《地理学思想史》',   type: 'C', duration: '40s', cost: '4 CSC + 0.4亿 SC', time: '2026-05-19 09:30' },
};
const MOCK_EN = {
  o004: { ...MOCK_ZH.o004, title: getBookTitleEn('《人文地理学导论》') },
  o005: { ...MOCK_ZH.o005, title: getBookTitleEn('《地理学思想史》') },
};
const FALLBACK_ZH = { id: '-', title: '视频订单', type: 'A', duration: '10s', cost: '—', time: '—' };
const FALLBACK_EN = { ...FALLBACK_ZH, title: 'Video Order' };

export default function P9Video() {
  const { lang } = useLanguage();
  const { orderId } = useParams();
  const zh = lang === 'zh';
  const order = zh
    ? (MOCK_ZH[orderId] ?? FALLBACK_ZH)
    : (MOCK_EN[orderId] ?? FALLBACK_EN);
  const v = order.type.toLowerCase();

  const doneTabInfo = {
    label: zh ? '已完成' : 'Completed',
    Icon: CheckCircle2,
    color: 'var(--color-success)',
  };

  return (
    <>
      <PageHeader title={zh ? '查看视频' : 'Watch Video'} />

      <div className="px-4 pt-5 pb-8 flex flex-col gap-4">
        {/* 视频播放器占位 */}
        <div
          className="relative w-full overflow-hidden"
          style={{ borderRadius: 'var(--radius-lg)', paddingBottom: '56.25%', background: `linear-gradient(135deg, var(--token-${v}-from), var(--token-${v}-to))`, boxShadow: 'var(--shadow-lg)' }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <button className="grid h-16 w-16 place-items-center rounded-full" style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
              <Play className="h-7 w-7 text-white" fill="white" strokeWidth={0} />
            </button>
            <span className="text-[13px] text-white/70">{zh ? `点击播放 · ${order.duration}` : `Tap to play · ${order.duration}`}</span>
          </div>
        </div>

        {/* 订单信息卡 */}
        <OrderCard order={order} tabInfo={doneTabInfo} lang={lang} showLink={false} />

        {/* 下载按钮 */}
        <button
          className="w-full flex items-center justify-center gap-2 py-[14px] text-[15px] font-semibold text-white"
          style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
        >
          <Download className="h-5 w-5" strokeWidth={2} />
          {zh ? '下载视频' : 'Download Video'}
        </button>
      </div>
    </>
  );
}
