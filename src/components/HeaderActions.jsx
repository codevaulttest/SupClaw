import { MoreHorizontal } from 'lucide-react';

export default function HeaderActions() {
  return (
    <div
      className="flex h-9 w-[86px] items-center justify-center overflow-hidden rounded-full border border-tokenBorder bg-white/85 backdrop-blur"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      <MoreHorizontal className="h-[23px] w-[23px] text-tokenText" strokeWidth={3} />
      <div className="mx-3 h-[22px] w-px bg-tokenBorder" />
      <svg className="h-[22px] w-[22px] text-tokenText" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}
