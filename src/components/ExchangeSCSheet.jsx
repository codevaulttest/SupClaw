import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDownUp, X } from 'lucide-react';

const DOS_BALANCE = 50;
const SC_BALANCE = 32.11;

export default function ExchangeSCSheet({ onClose }) {
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  const num = parseFloat(amount) || 0;
  const willReceive = num; // 1 DOS = 1亿 SC
  const insufficient = num > 0 && num > DOS_BALANCE;
  const canSubmit = num > 0 && !insufficient;

  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(onClose, 1200);
  }

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
        <div
          style={{
            borderRadius: '20px 20px 0 0',
            background: 'var(--color-bg-page)',
            boxShadow: '0 -4px 32px rgba(13,21,39,0.14)',
          }}
        >
          {/* Handle + header */}
          <div className="relative flex items-center justify-center px-4 pt-3 pb-2">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 h-1 w-10 rounded-full" style={{ background: 'var(--color-border)' }} />
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="w-8" />
              <span className="text-[17px] font-semibold text-tokenText">兑换 SC</span>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--color-bg-card)' }}>
                <X className="h-4 w-4 text-tokenSub" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="px-4 pt-2 pb-6">
            {/* 从 */}
            <div className="rounded-2xl px-4 pt-3 pb-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-medium text-tokenSub">从</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] text-tokenHint">余额：{DOS_BALANCE} DOS</span>
                  <button
                    onClick={() => setAmount(String(DOS_BALANCE))}
                    className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-tokenPrimary"
                    style={{ background: 'var(--color-primary-soft)' }}
                  >
                    全部
                  </button>
                </div>
              </div>
              <div
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-text"
                style={{ background: 'var(--color-bg-page)', border: `1.5px solid ${insufficient ? 'var(--color-danger)' : 'var(--color-primary)'}` }}
                onClick={() => inputRef.current?.focus()}
              >
                <div className="flex shrink-0 items-center gap-2">
                  <img src="/assets/DOS.svg" alt="DOS" className="h-7 w-7 shrink-0" />
                  <span className="text-[15px] font-semibold text-tokenText">DOS</span>
                </div>
                <input
                  ref={inputRef}
                  type="number"
                  min="0"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="输入数量"
                  className="min-w-0 flex-1 bg-transparent text-right font-num text-[26px] font-semibold outline-none placeholder:text-[18px] placeholder:text-tokenHint"
                  style={{ color: insufficient ? 'var(--color-danger)' : 'var(--color-text-primary)' }}
                />
              </div>
              {insufficient && (
                <p className="mt-1.5 text-right text-[11px] text-tokenDanger">余额不足</p>
              )}
            </div>

            {/* 方向箭头 */}
            <div className="flex justify-center py-3">
              <ArrowDownUp className="h-5 w-5 text-tokenSub" strokeWidth={1.8} />
            </div>

            {/* 到 */}
            <div className="rounded-2xl px-4 pt-3 pb-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] font-medium text-tokenSub">到</span>
                <span className="text-[12px] text-tokenHint">余额：{SC_BALANCE} 亿 SC</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex shrink-0 items-center gap-2">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white" style={{ background: 'linear-gradient(135deg,var(--color-primary),#0a9090)' }}>S</div>
                  <span className="text-[15px] font-semibold text-tokenText">SC</span>
                </div>
                <div className="flex flex-1 items-baseline justify-end gap-1">
                  <span className="font-num text-[26px] font-semibold" style={{ color: num > 0 && !insufficient ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                    {num > 0 && !insufficient ? willReceive : '0.00'}
                  </span>
                  <span className="text-[14px] font-medium text-tokenSub">亿</span>
                </div>
              </div>
            </div>

            {/* 汇率 */}
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <ArrowDownUp className="h-3 w-3 text-tokenHint" strokeWidth={2} />
              <span className="text-[12px] text-tokenHint">1 DOS ≈ 1 亿 SC</span>
            </div>

            {/* 提交 */}
            <div className="mt-5">
              {submitted ? (
                <div className="flex items-center justify-center gap-2 rounded-xl py-4" style={{ background: 'var(--color-success-soft)', border: '1px solid var(--color-primary-border)' }}>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="var(--color-success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[15px] font-semibold text-tokenSuccess">兑换成功</span>
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full py-[14px] text-[15px] font-semibold"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    background: canSubmit ? 'var(--color-primary)' : 'var(--color-border)',
                    color: canSubmit ? '#fff' : 'var(--color-text-hint)',
                    boxShadow: canSubmit ? '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' : 'none',
                  }}
                >
                  确认兑换
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
