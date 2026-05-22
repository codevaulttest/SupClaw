import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Clock } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function ExchangeSubmittedSheet({ amount, detail, onClose }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px]"
        style={{ animation: 'sheetUp 260ms cubic-bezier(0.22,1,0.36,1) both' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ borderRadius: '20px 20px 0 0', background: 'var(--color-bg-page)', boxShadow: '0 -4px 32px rgba(13,21,39,0.14)' }}>
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full" style={{ background: 'var(--color-border)' }} />
          </div>

          {/* Close */}
          <div className="flex justify-end px-4 pt-1">
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--color-bg-card)' }}>
              <X className="h-4 w-4 text-tokenSub" strokeWidth={2} />
            </button>
          </div>

          {/* 图标 + 状态 */}
          <div className="flex flex-col items-center px-6 pt-2 pb-6">
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-full" style={{ background: '#fff8ee' }}>
              <Clock className="h-8 w-8" style={{ color: '#f59e0b' }} strokeWidth={1.8} />
            </div>
            <p className="text-[20px] font-semibold text-tokenText">{lang === 'zh' ? '兑换已提交' : 'Request Submitted'}</p>
            {amount > 0 && (
              <p className="mt-1.5 text-[14px] text-tokenSub">{amount} DOS → {amount} {lang === 'zh' ? '亿 SC' : 'B SC'}</p>
            )}
            {detail && (
              <p className="mt-1.5 text-[14px] text-tokenSub">{detail}</p>
            )}
            <p className="mt-3 text-center text-[13px] leading-[20px] text-tokenHint">
              {lang === 'zh' ? '兑换正在处理中，到账时间取决于网络状态，可在记录页查看最新进度。' : 'Your request is being processed. Arrival time depends on network conditions. You can check the latest status in History.'}
            </p>
          </div>

          {/* 操作区 */}
          <div className="px-4 pb-8 flex flex-col gap-3">
            <button
              onClick={() => { onClose(); navigate('/history'); }}
              className="w-full py-[14px] text-[15px] font-semibold text-white"
              style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
            >
              {lang === 'zh' ? '查看记录' : 'View History'}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-[15px] font-medium text-tokenSub"
            >
              {lang === 'zh' ? '关闭' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
