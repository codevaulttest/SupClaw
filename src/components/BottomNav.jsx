import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlayCircle, ReceiptText } from 'lucide-react';

const FilledHome = () => (
  <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);
const FilledPlay = () => (
  <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
  </svg>
);
const FilledOrders = () => (
  <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor">
    <path d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V2l-1.5 1.5zM17 18H7v-1h10v1zm0-3H7v-1h10v1zm0-3H7v-1h10v1z"/>
  </svg>
);

const TABS = [
  { label: '首页',    path: '/',       Icon: Home,        FilledIcon: FilledHome },
  { label: 'AI 生成', path: '/ai',     Icon: PlayCircle,  FilledIcon: FilledPlay },
  { label: '订单',    path: '/orders', Icon: ReceiptText, FilledIcon: FilledOrders },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <div
      className="fixed left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 px-5"
      style={{ bottom: 'max(14px, env(safe-area-inset-bottom))' }}
    >
      <nav
        className="grid h-[68px] grid-cols-3 rounded-full p-1.5"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.78), rgba(255,255,255,0.58))',
          backdropFilter: 'saturate(190%) blur(28px)',
          WebkitBackdropFilter: 'saturate(190%) blur(28px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.92), 0 10px 28px rgba(13,21,39,0.12), 0 2px 8px rgba(13,21,39,0.06)',
          border: '1px solid rgba(255,255,255,0.72)',
        }}
      >
        {TABS.map(({ label, path, Icon, FilledIcon }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="relative flex min-w-0 flex-col items-center justify-center gap-[3px] overflow-hidden rounded-full text-[11px] leading-[15px] transition-transform duration-150 active:scale-95"
              style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
            >
              {active && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(180deg, rgba(237,250,248,0.98), rgba(224,247,244,0.9))',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.86), 0 6px 16px rgba(20,199,181,0.10)',
                  }}
                />
              )}
              <span className="relative" style={{ transform: active ? 'scale(1.08)' : 'scale(1)', transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1)' }}>
                {active ? <FilledIcon /> : <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />}
              </span>
              <span className={`relative ${active ? 'font-semibold' : ''}`}>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
