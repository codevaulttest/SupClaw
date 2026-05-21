import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, Loader } from 'lucide-react';

// Usage: <Toast type="loading|success" message="..." onDone={fn} duration={ms} />
export default function Toast({ type, message, duration = 3000, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (type === 'loading') return; // loading toasts are controlled externally
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDone?.(), 300);
    }, duration);
    return () => clearTimeout(t);
  }, [type, duration, onDone]);

  return createPortal(
    <div
      className="fixed left-1/2 z-[100] -translate-x-1/2 px-4 w-full max-w-[480px]"
      style={{
        top: 'max(20px, env(safe-area-inset-top, 20px))',
        pointerEvents: 'none',
      }}
    >
      <div
        className="mx-auto flex w-fit items-center gap-2.5 rounded-full px-4 py-2.5"
        style={{
          background: 'rgba(13,21,39,0.88)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.22)',
          transition: 'opacity 280ms, transform 280ms',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-8px)',
          animation: 'toastIn 260ms cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        {type === 'loading' ? (
          <Loader className="h-4 w-4 text-white/70 animate-spin" strokeWidth={2} />
        ) : (
          <CheckCircle className="h-4 w-4 shrink-0" style={{ color: 'var(--color-primary)' }} strokeWidth={2.5} />
        )}
        <span className="whitespace-nowrap text-[14px] font-medium text-white">{message}</span>
      </div>
    </div>,
    document.body
  );
}
