import { useParams } from 'react-router-dom';
import { Download, Play } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../components/LanguageContext';

const MOCK_ORDERS = {
  o004: { title: '人文地理学导论 × 2', type: 'B', duration: '20s', time: '2天前 10:15' },
  o005: { title: '地理学思想史 × 4', type: 'C', duration: '40s', time: '3天前 09:30' },
};

export default function P9Video() {
  const { lang } = useLanguage();
  const { orderId } = useParams();
  const order = lang === 'zh'
    ? (MOCK_ORDERS[orderId] ?? { title: '视频订单', type: 'A', duration: '10s', time: '-' })
    : ({
      o004: { title: '人文地理学导论 × 2', type: 'B', duration: '20s', time: '2d ago 10:15' },
      o005: { title: '地理学思想史 × 4', type: 'C', duration: '40s', time: '3d ago 09:30' },
    }[orderId] ?? { title: 'Video Order', type: 'A', duration: '10s', time: '-' });
  const v = order.type.toLowerCase();

  return (
    <>
      <PageHeader title={lang === 'zh' ? '查看视频' : 'Watch Video'} />

      <div className="px-4 pt-5 pb-8">
        {/* 视频播放器占位 */}
        <div
          className="relative w-full overflow-hidden mb-5"
          style={{ borderRadius: 'var(--radius-lg)', paddingBottom: '56.25%', background: `linear-gradient(135deg, var(--token-${v}-from), var(--token-${v}-to))`, boxShadow: 'var(--shadow-lg)' }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <button className="grid h-16 w-16 place-items-center rounded-full" style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
              <Play className="h-7 w-7 text-white" fill="white" strokeWidth={0} />
            </button>
            <span className="text-[13px] text-white/70">{lang === 'zh' ? `点击播放 · ${order.duration}` : `Tap to play · ${order.duration}`}</span>
          </div>
        </div>

        {/* 视频信息 */}
        <div className="mb-5 rounded-xl px-5 py-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
          <p className="text-[16px] font-semibold text-tokenText mb-1">{order.title}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="rounded-full px-2.5 py-1 font-num text-[11px] font-bold text-white" style={{ background: `var(--token-${v}-from)` }}>{order.type} · {lang === 'zh' ? '已完成' : 'Done'}</span>
            <span className="text-[12px] text-tokenHint">{order.duration}</span>
            <span className="text-[12px] text-tokenHint">{order.time}</span>
          </div>
        </div>

        {/* 下载按钮 */}
        <button
          className="w-full flex items-center justify-center gap-2 py-[14px] text-[15px] font-semibold text-white"
          style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
        >
          <Download className="h-5 w-5" strokeWidth={2} />
          {lang === 'zh' ? '下载视频' : 'Download Video'}
        </button>
      </div>
    </>
  );
}
