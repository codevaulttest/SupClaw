import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Crown, Zap, CheckCircle, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../components/LanguageContext';
import { useUser } from '../components/UserContext';

const PERKS = [
  {
    icon: Crown,
    zh: '首发权兑换',
    en: 'Premiere Access Redemption',
    subZh: '用 SC 兑换 ASC / BSC / CSC，抢先解锁 AI 视频',
    subEn: 'Swap SC for ASC / BSC / CSC to unlock AI videos first',
  },
  {
    icon: Zap,
    zh: '更多专属权益敬请期待',
    en: 'More Benefits Coming Soon',
    subZh: '更多会员专属功能正在规划中',
    subEn: 'More member-only features are on the way',
  },
];

function SuccessSheet({ expiry, onClose }) {
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
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full" style={{ background: 'var(--color-border)' }} />
          </div>
          <div className="flex justify-end px-4 pt-1">
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--color-bg-card)' }}>
              <X className="h-4 w-4 text-tokenSub" strokeWidth={2} />
            </button>
          </div>
          <div className="flex flex-col items-center px-6 pt-2 pb-6">
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-full" style={{ background: 'var(--color-success-soft, #dcfce7)' }}>
              <CheckCircle className="h-8 w-8" style={{ color: 'var(--color-success, #16a34a)' }} strokeWidth={1.8} />
            </div>
            <p className="text-[20px] font-semibold text-tokenText">{lang === 'zh' ? '开通成功' : 'Membership Activated'}</p>
            <p className="mt-2 text-[14px] text-tokenSub">
              {lang === 'zh' ? `有效期至 ${expiry}` : `Valid until ${expiry}`}
            </p>
            <p className="mt-3 text-center text-[13px] leading-[20px] text-tokenHint">
              {lang === 'zh' ? '您现在可以兑换首发权，抢先解锁 AI 视频。' : 'You can now redeem premiere access to unlock AI videos first.'}
            </p>
          </div>
          <div className="px-4 pb-8 flex flex-col gap-3">
            <button
              onClick={() => { onClose(); navigate('/buy'); }}
              className="w-full py-[14px] text-[15px] font-semibold text-white"
              style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
            >
              {lang === 'zh' ? '立即兑换首发权' : 'Swap for Premiere Access'}
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

export default function PMembership() {
  const { lang } = useLanguage();
  const { isMember, memberExpiry, toggleMembership } = useUser();
  const [showSuccess, setShowSuccess] = useState(false);

  function handleActivate() {
    toggleMembership();
    setShowSuccess(true);
  }

  return (
    <>
      <PageHeader title={lang === 'zh' ? '开通会员' : 'Annual Membership'} />

      <div className="px-4 pt-5 pb-10">
        {/* Hero */}
        <div
          className="mb-6 flex flex-col items-center rounded-2xl px-6 py-8"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 60%, #7c3aed))' }}
        >
          <Crown className="mb-3 h-10 w-10 text-white/90" strokeWidth={1.5} />
          <p className="text-[22px] font-bold text-white">{lang === 'zh' ? '超级龙虾会员' : 'SupClaw Annual Member'}</p>
          <p className="mt-1 text-[13px] text-white/70">{lang === 'zh' ? '解锁专属首发权兑换及更多特权' : 'Unlock premiere access redemption & more'}</p>
          <div className="mt-5 rounded-full bg-white/15 px-5 py-1.5">
            <span className="font-num text-[13px] font-semibold text-white">
              {lang === 'zh' ? '有效期 1 年' : 'Valid for 1 year'}
            </span>
          </div>
        </div>

        {/* Perks */}
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-tokenHint">
          {lang === 'zh' ? '会员权益' : 'Member Perks'}
        </p>
        <div className="mb-6 overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
          {PERKS.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div
                key={i}
                className={`flex items-start gap-3 px-4 py-3.5${i < PERKS.length - 1 ? ' border-b border-tokenBorderSubtle' : ''}`}
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }}>
                  <Icon className="h-4 w-4" style={{ color: 'var(--color-primary)' }} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-tokenText">{lang === 'zh' ? perk.zh : perk.en}</p>
                  <p className="text-[12px] text-tokenHint">{lang === 'zh' ? perk.subZh : perk.subEn}</p>
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

      {showSuccess && <SuccessSheet expiry={memberExpiry} onClose={() => setShowSuccess(false)} />}
    </>
  );
}
