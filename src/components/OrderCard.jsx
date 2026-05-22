import { ChevronRight, Play } from 'lucide-react';
import TokenIcon from './TokenIcon';

export default function OrderCard({ order, tabInfo, lang, onClick, showLink = true, animated = false, index = 0 }) {
  return (
    <button
      onClick={onClick}
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
      {showLink && (
        <div className="flex items-center justify-center border-t border-tokenBorderSubtle px-4 py-2.5">
          <span className="flex items-center gap-1 text-[12px] font-semibold text-tokenPrimary">
            {lang === 'zh' ? '查看视频' : 'Watch Video'} <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      )}
    </button>
  );
}
