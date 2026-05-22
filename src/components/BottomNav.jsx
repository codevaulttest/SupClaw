import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlayCircle, ReceiptText, UserCircle2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const tabs = [
    { label: t('首页', 'Home'), path: '/', Icon: Home },
    { label: t('AI 生成', 'Create'), path: '/ai', Icon: PlayCircle },
    { label: t('订单', 'Orders'), path: '/orders', Icon: ReceiptText },
    { label: t('我的', 'Me'), path: '/profile', Icon: UserCircle2 },
  ];

  const isActive = (path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <div
      className="pointer-events-none fixed left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 px-5"
      style={{ bottom: 'max(14px, env(safe-area-inset-bottom))' }}
    >
      <nav
        className="pointer-events-auto grid h-[68px] grid-cols-4 overflow-hidden rounded-full p-1.5"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.78), rgba(255,255,255,0.58))',
          backdropFilter: 'saturate(190%) blur(28px)',
          WebkitBackdropFilter: 'saturate(190%) blur(28px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.92), 0 10px 28px rgba(13,21,39,0.12), 0 2px 8px rgba(13,21,39,0.06)',
          border: '1px solid rgba(255,255,255,0.72)',
        }}
      >
        {tabs.map(({ label, path, Icon }) => {
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
                <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.4 : 1.8} />
              </span>
              <span className={`relative ${active ? 'font-semibold' : ''}`}>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
