import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, Send } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useUser } from './UserContext';

export default function ActivationCodeTransferSheet({ onClose }) {
  const { lang } = useLanguage();
  const { ownedCodeCount, transferCodes } = useUser();

  const [recipient, setRecipient] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);

  const qty = parseInt(quantity) || 0;
  const qtyValid = qty >= 1 && qty <= ownedCodeCount;
  const canProceed = recipient.trim().length > 0 && qtyValid;

  function handleTransfer() {
    transferCodes(qty);
    setConfirming(false);
    setSuccess(true);
  }

  const confirmSheet = confirming && createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onClick={() => setConfirming(false)}
    >
      <div
        className="w-full max-w-[480px]"
        style={{ animation: 'sheetUp 260ms cubic-bezier(0.22,1,0.36,1) both' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ borderRadius: '20px 20px 0 0', background: 'var(--color-bg-page)', boxShadow: '0 -4px 32px rgba(13,21,39,0.14)' }}>
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full" style={{ background: 'var(--color-border)' }} />
          </div>
          <div className="px-6 pt-3 pb-3 text-center">
            <p className="text-[17px] font-semibold text-tokenText">
              {lang === 'zh' ? '确认转让？' : 'Confirm Transfer?'}
            </p>
            <p className="mt-2 text-[13px] leading-[20px] text-tokenHint">
              {lang === 'zh'
                ? `将 ${qty} 张续期码转让给 ${recipient}，转让后不可撤销，剩余 ${ownedCodeCount - qty} 张。`
                : `Transfer ${qty} renewal code${qty > 1 ? 's' : ''} to ${recipient}. This cannot be undone. ${ownedCodeCount - qty} remaining.`}
            </p>
          </div>
          <div className="px-4 pb-8 flex flex-col gap-3">
            <button
              onClick={handleTransfer}
              className="w-full py-[14px] text-[15px] font-semibold text-white"
              style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
            >
              {lang === 'zh' ? '确认转让' : 'Confirm Transfer'}
            </button>
            <button onClick={() => setConfirming(false)} className="w-full py-3 text-[15px] font-medium text-tokenSub">
              {lang === 'zh' ? '取消' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );

  return <>
    {confirmSheet}
    {createPortal(
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
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full" style={{ background: 'var(--color-border)' }} />
            </div>

            {success ? (
              <>
                <div className="flex justify-end px-4 pt-1">
                  <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--color-bg-card)' }}>
                    <X className="h-4 w-4 text-tokenSub" strokeWidth={2} />
                  </button>
                </div>
                <div className="flex flex-col items-center px-6 pt-2 pb-6">
                  <div className="mb-4 grid h-16 w-16 place-items-center rounded-full" style={{ background: 'var(--color-success-soft)' }}>
                    <CheckCircle className="h-8 w-8" style={{ color: 'var(--color-success)' }} strokeWidth={1.8} />
                  </div>
                  <p className="text-[20px] font-semibold text-tokenText">
                    {lang === 'zh' ? '转让成功' : 'Transfer Complete'}
                  </p>
                  <p className="mt-2 text-center text-[13px] leading-[20px] text-tokenHint">
                    {lang === 'zh'
                      ? `已将 ${qty} 张续期码转让给 ${recipient}。`
                      : `${qty} renewal code${qty > 1 ? 's' : ''} transferred to ${recipient}.`}
                  </p>
                </div>
                <div className="px-4 pb-8">
                  <button
                    onClick={onClose}
                    className="w-full py-[14px] text-[15px] font-semibold text-white"
                    style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
                  >
                    {lang === 'zh' ? '完成' : 'Done'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between px-4 pt-1 pb-3">
                  <p className="text-[17px] font-semibold text-tokenText">
                    {lang === 'zh' ? '转让续期码' : 'Transfer Renewal Codes'}
                  </p>
                  <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--color-bg-card)' }}>
                    <X className="h-4 w-4 text-tokenSub" strokeWidth={2} />
                  </button>
                </div>

                <div className="px-4 pb-8 flex flex-col gap-4">
                  {/* 可转让数量提示 */}
                  <p className="text-[13px] text-tokenHint">
                    {lang === 'zh' ? `当前可转让：${ownedCodeCount} 张` : `Available to transfer: ${ownedCodeCount}`}
                  </p>

                  {/* 接收方账号 */}
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-tokenHint">
                      {lang === 'zh' ? '接收方账号' : 'Recipient Account'}
                    </label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={e => setRecipient(e.target.value)}
                      placeholder={lang === 'zh' ? '请输入接收方账号' : 'Enter recipient account'}
                      className="w-full rounded-xl px-4 py-3 text-[15px] outline-none"
                      style={{ background: 'var(--color-bg-card)', border: '1.5px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                    />
                  </div>

                  {/* 转让数量 */}
                  <div>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <label className="text-[12px] font-medium text-tokenHint">
                        {lang === 'zh' ? '转让数量' : 'Quantity'}
                      </label>
                      <span className="text-[11px] text-tokenHint">
                        {lang === 'zh' ? `最多 ${ownedCodeCount} 张` : `Max ${ownedCodeCount}`}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max={ownedCodeCount}
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 text-[15px] outline-none"
                      style={{
                        background: 'var(--color-bg-card)',
                        border: `1.5px solid ${quantity && !qtyValid ? 'var(--color-danger)' : 'var(--color-border)'}`,
                        color: 'var(--color-text-primary)',
                      }}
                    />
                    {quantity && !qtyValid && (
                      <p className="mt-1 text-[12px] text-tokenDanger">
                        {lang === 'zh' ? `请输入 1 到 ${ownedCodeCount} 之间的数量` : `Enter a number between 1 and ${ownedCodeCount}`}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setConfirming(true)}
                    disabled={!canProceed}
                    className="flex w-full items-center justify-center gap-2 py-[14px] text-[15px] font-semibold text-white"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      background: canProceed ? 'var(--color-primary)' : 'var(--color-border)',
                      boxShadow: canProceed ? '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' : 'none',
                    }}
                  >
                    <Send className="h-4 w-4" strokeWidth={2} />
                    {lang === 'zh' ? '转让' : 'Transfer'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>,
      document.body
    )}
  </>;
}
