export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div
        className="mb-4 grid h-14 w-14 place-items-center rounded-full"
        style={{ background: 'var(--color-border-subtle, #f0f4f8)' }}
      >
        <Icon className="h-6 w-6 text-tokenHint" strokeWidth={1.6} />
      </div>
      <p className="text-[15px] font-semibold text-tokenSub">{title}</p>
      {subtitle && (
        <p className="mt-1.5 text-center text-[13px] leading-[18px] text-tokenHint">{subtitle}</p>
      )}
    </div>
  );
}
