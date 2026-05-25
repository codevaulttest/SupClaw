import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, Loader, Info, AlertCircle } from 'lucide-react';

// Usage: <Toast type="loading|success|info|error" message="..." onDone={fn} duration={ms} position="center|top" />
export default function Toast({ type, message, duration = 3000, onDone, position = 'center' }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (type === 'loading') return;
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDone?.(), 300);
    }, duration);
    return () => clearTimeout(t);
  }, [type, duration, onDone]);

  const positionClass = position === 'top'
    ? 'fixed left-1/2 top-[calc(env(safe-area-inset-top,0px)+56px)] z-[100] -translate-x-1/2 px-4 w-full max-w-[480px]'
    : 'fixed left-1/2 top-1/2 z-[100] -translate-x-1/2 -translate-y-1/2 px-4 w-full max-w-[480px]';

  return createPortal(
    <div className={positionClass} style={{ pointerEvents: 'none' }}>
      <div
        className="mx-auto flex w-fit items-center gap-2.5 rounded-full px-4 py-2.5"
        style={{
          background: type === 'error' ? 'rgba(185,28,28,0.92)' : 'rgba(13,21,39,0.88)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.22)',
          transition: 'opacity 280ms, transform 280ms',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-8px)',
          animation: 'toastIn 260ms cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        {type === 'loading' && <Loader className="h-4 w-4 text-white/70 animate-spin" strokeWidth={2} />}
        {type === 'success' && <CheckCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--color-primary)' }} strokeWidth={2.5} />}
        {type === 'info' && <Info className="h-4 w-4 shrink-0 text-white/70" strokeWidth={2} />}
        {type === 'error' && <AlertCircle className="h-4 w-4 shrink-0 text-white/80" strokeWidth={2} />}
        <span className="text-[14px] font-medium text-white" style={{ maxWidth: '260px' }}>{message}</span>
      </div>
    </div>,
    document.body
  );
}
