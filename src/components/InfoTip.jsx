import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';

export default function InfoTip({ text, size = 11 }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const ref = useRef(null);
  const tooltipWidth = 180;

  const updatePosition = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const margin = 8;
    const left = Math.min(
      Math.max(rect.left + rect.width / 2, tooltipWidth / 2 + margin),
      window.innerWidth - tooltipWidth / 2 - margin
    );
    const showAbove = rect.bottom + 82 > window.innerHeight;

    setPos({
      left,
      top: showAbove ? rect.top - margin : rect.bottom + margin,
      transform: showAbove ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return undefined;
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex items-center" style={{ lineHeight: 0 }}>
      <span
        className="cursor-pointer inline-flex items-center"
        onPointerDown={(e) => { e.stopPropagation(); setOpen(v => !v); }}
      >
        <Info style={{ width: size, height: size }} className="text-tokenHint opacity-60" strokeWidth={1.8} />
      </span>
      {open && pos && createPortal(
        <span
          className="fixed z-[100] whitespace-pre-wrap text-[12px] leading-[18px]"
          style={{
            top: pos.top,
            left: pos.left,
            transform: pos.transform,
            width: tooltipWidth,
            background: 'rgba(13,21,39,0.88)',
            boxShadow: '0 4px 16px rgba(13,21,39,0.25)',
            borderRadius: 10,
            padding: '8px 10px',
            color: 'rgba(255,255,255,0.9)',
            pointerEvents: 'none',
          }}
        >
          {text}
        </span>,
        document.body
      )}
    </span>
  );
}
