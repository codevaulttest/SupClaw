import { Play } from 'lucide-react';

const TOKEN_INFO = {
  A: { label: '品牌定制版', color: 'var(--token-a-text)' },
  B: { label: '创意文案版', color: 'var(--token-b-text)' },
  C: { label: '极速盲盒版', color: 'var(--token-c-text)' },
};

export default function ProductCard({ product, onClick, className = '', style = {} }) {
  const type = product.type || 'C';
  const v = type.toLowerCase();
  const info = TOKEN_INFO[type] || TOKEN_INFO.C;
  const badge = product.tag || type;
  const duration = product.dur || `${product.duration}s / 个`;
  const price = product.displayPrice || `${product.price}亿`;
  const background = product.grad || `linear-gradient(135deg, var(--token-${v}-from), var(--token-${v}-to))`;

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
        <span className="font-num text-[10px] text-white/80">{duration}</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="mb-1 truncate text-[13px] font-semibold text-tokenText">{product.title}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="min-w-0 truncate text-[11px] font-medium" style={{ color: info.color }}>{info.label}</span>
          <span className="shrink-0 font-num text-[13px] font-bold" style={{ color: `var(--token-${v}-text)` }}>{price}</span>
        </div>
      </div>
    </button>
  );
}
