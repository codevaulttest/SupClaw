import { Play } from 'lucide-react';

export default function TokenIcon({ type, size = 'md' }) {
  const v = type.toLowerCase();
  const dim = size === 'lg' ? 'h-12 w-12' : 'h-11 w-11';
  const playSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <div
      className={`relative shrink-0 ${dim} rounded-xl overflow-hidden`}
      style={{ background: `linear-gradient(135deg, var(--token-${v}-from), var(--token-${v}-to))` }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Play className={`${playSize} fill-white text-white`} strokeWidth={0} />
      </div>
      <span
        className="absolute left-1 top-1 rounded-full h-[18px] w-[18px] flex items-center justify-center text-[9px] font-bold text-white"
        style={{ background: 'rgba(0,0,0,0.28)' }}
      >
        {type}
      </span>
    </div>
  );
}
