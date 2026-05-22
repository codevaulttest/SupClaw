import { Play, ChevronRight } from 'lucide-react';

const TOKEN_INFO = {
  A: { label: 'A 类视频', color: 'var(--token-a-text)' },
  B: { label: 'B 类视频', color: 'var(--token-b-text)' },
  C: { label: 'C 类视频', color: 'var(--token-c-text)' },
};

function formatBookTitle(title) {
  if (!title || title.startsWith('《') || /^[A-Za-z0-9\s',:.-]+$/.test(title)) return title;
  return `《${title}》`;
}

export default function ProductCard({ product, onClick, list = false, className = '', style = {} }) {
  const type = product.type || 'C';
  const v = type.toLowerCase();
  const info = TOKEN_INFO[type] || TOKEN_INFO.C;
  const badge = product.tag || type;
  const background = product.grad || `linear-gradient(135deg, var(--token-${v}-from), var(--token-${v}-to))`;

  if (list) {
    return (
      <button
        onClick={onClick}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-black/5 ${className}`}
        style={{ background: 'var(--color-bg-card)', ...style }}
      >
        <div className="relative shrink-0 h-11 w-11 rounded-xl overflow-hidden" style={{ background }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="h-4 w-4 fill-white text-white" strokeWidth={0} />
          </div>
          <span className="absolute left-1 top-1 rounded px-1 py-0 text-[9px] font-bold text-white leading-4" style={{ background: 'rgba(0,0,0,0.28)' }}>{badge}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-tokenText leading-snug">{formatBookTitle(product.title)}</p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-tokenHint" strokeWidth={1.8} />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`overflow-hidden text-left ${className}`}
      style={{
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-bg-card)',
        boxShadow: 'var(--shadow-sm)',
        ...style,
      }}
    >
      <div className="relative flex h-[80px] items-end px-3 pb-2" style={{ background }}>
        {product.tag && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid h-8 w-8 place-items-center rounded-full" style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(4px)' }}>
              <Play className="h-4 w-4 fill-white text-white" strokeWidth={0} />
            </div>
          </div>
        )}
        <span className="absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.3)' }}>
          {badge}
        </span>
      </div>
      <div className="px-3 py-2.5">
        <p className="truncate text-[13px] font-semibold text-tokenText">{formatBookTitle(product.title)}</p>
      </div>
    </button>
  );
}
