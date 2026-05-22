import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Crown, Zap, X, CheckCircle } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useUser } from './UserContext';

const PERKS = [
  {
    icon: Crown,
    zh: '首发权兑换',
    en: 'Early Access Redemption',
    subZh: '用 SC 兑换 ASC / BSC / CSC，抢先解锁 AI 视频',
    subEn: 'Redeem ASC / BSC / CSC with SC to unlock AI videos early',
  },
  {
    icon: Zap,
    zh: '更多专属权益敬请期待',
    en: 'More Benefits Coming Soon',
    subZh: '更多会员专属功能正在规划中',
    subEn: 'More member-only features are on the way',
  },
];

function SuccessSheet({ expiry, onClose, onSwap }) {
  const { lang } = useLanguage();
  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
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
          <div className="flex justify-end px-4 pt-1">
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--color-bg-card)' }}>
              <X className="h-4 w-4 text-tokenSub" strokeWidth={2} />
            </button>
          </div>
          <div className="flex flex-col items-center px-6 pt-2 pb-6">
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-full" style={{ background: 'var(--color-success-soft)' }}>
              <CheckCircle className="h-8 w-8" style={{ color: 'var(--color-success)' }} strokeWidth={1.8} />
            </div>
            <p className="text-[20px] font-semibold text-tokenText">{lang === 'zh' ? '开通成功' : 'Membership Activated'}</p>
            <p className="mt-2 text-[14px] text-tokenSub">
              {lang === 'zh' ? `有效期至 ${expiry}` : `Valid until ${expiry}`}
            </p>
            <p className="mt-3 text-center text-[13px] leading-[20px] text-tokenHint">
              {lang === 'zh' ? '您现在可以兑换首发权，抢先解锁 AI 视频。' : 'You can now redeem early access and unlock AI videos ahead of time.'}
            </p>
          </div>
          <div className="px-4 pb-8 flex flex-col gap-3">
            <button
              onClick={onSwap}
              className="w-full py-[14px] text-[15px] font-semibold text-white"
              style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
            >
              {lang === 'zh' ? '立即兑换首发权' : 'Redeem Early Access'}
            </button>
            <button onClick={onClose} className="w-full py-3 text-[15px] font-medium text-tokenSub">
              {lang === 'zh' ? '关闭' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function MembershipSheet({ onClose, onActivate }) {
  const { lang } = useLanguage();
  const { isMember, memberExpiry, toggleMembership } = useUser();
  const [showSuccess, setShowSuccess] = useState(false);

  function handleActivate() {
    toggleMembership();
    setShowSuccess(true);
  }

  function handleSuccessClose() {
    setShowSuccess(false);
    onClose?.();
  }

  function handleSwap() {
    setShowSuccess(false);
    onActivate?.();
    onClose?.();
  }

  return (
    <>
      {!showSuccess && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}
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
              {/* Handle + close */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full" style={{ background: 'var(--color-border)' }} />
              </div>
              <div className="flex items-center justify-between px-4 pt-1 pb-3">
                <p className="text-[17px] font-semibold text-tokenText">
                  {lang === 'zh' ? '超级龙虾会员' : 'SupClaw Annual Member'}
                </p>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: 'var(--color-bg-card)' }}
                >
                  <X className="h-4 w-4 text-tokenSub" strokeWidth={2} />
                </button>
              </div>

              <div className="px-4 pb-8">
                {/* Hero */}
                <div
                  className="mb-5 flex items-center gap-4 rounded-2xl px-5 py-5"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 60%, #7c3aed))',
                  }}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.18)' }}>
                    <Crown className="h-7 w-7 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-bold text-white leading-snug">
                      {lang === 'zh' ? '解锁专属首发权兑换及更多特权' : 'Unlock early access and member perks'}
                    </p>
                    <div className="mt-2 inline-block rounded-full bg-white/15 px-3 py-0.5">
                      <span className="font-num text-[12px] font-semibold text-white">
                        {lang === 'zh' ? '有效期 1 年' : 'Valid for 1 year'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Perks label */}
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-tokenHint">
                  {lang === 'zh' ? '会员权益' : 'Member Perks'}
                </p>

                {/* Perks list */}
                <div
                  className="mb-5 overflow-hidden"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-bg-card)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {PERKS.map((perk, i) => {
                    const Icon = perk.icon;
                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-3 px-4 py-3.5${i < PERKS.length - 1 ? ' border-b border-tokenBorderSubtle' : ''}`}
                      >
                        <div
                          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                          style={{ background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }}
                        >
                          <Icon className="h-4 w-4" style={{ color: 'var(--color-primary)' }} strokeWidth={1.8} />
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-tokenText">
                            {lang === 'zh' ? perk.zh : perk.en}
                          </p>
                          <p className="text-[12px] text-tokenHint">
                            {lang === 'zh' ? perk.subZh : perk.subEn}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                {isMember ? (
                  <div
                    className="flex items-center justify-center gap-2 w-full py-[14px] rounded-xl"
                    style={{ background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}
                  >
                    <CheckCircle className="h-4 w-4" style={{ color: 'var(--color-primary)' }} strokeWidth={2} />
                    <span className="text-[15px] font-semibold" style={{ color: 'var(--color-primary)' }}>
                      {lang === 'zh' ? `年会员有效期至 ${memberExpiry}` : `Active until ${memberExpiry}`}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleActivate}
                    className="w-full py-[14px] text-[15px] font-semibold text-white"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-primary)',
                      boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)',
                    }}
                  >
                    {lang === 'zh' ? '立即开通' : 'Activate Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showSuccess && (
        <SuccessSheet
          expiry={memberExpiry}
          onClose={handleSuccessClose}
          onSwap={handleSwap}
        />
      )}
    </>
  );
}
