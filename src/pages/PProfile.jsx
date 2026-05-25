import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Crown, ChevronRight, HelpCircle, Key, Send, CheckCircle, Gift, Copy, Check } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { useUser } from '../components/UserContext';
import HeaderActions from '../components/HeaderActions';
import MembershipSheet from '../components/MembershipSheet';
import ActivationCodeTransferSheet from '../components/ActivationCodeTransferSheet';

const MOCK_INVITE_CODE = 'SUPRA-8X4K';

function InviteCodeRow() {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(MOCK_INVITE_CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="flex items-center gap-3">
        <Gift className="h-[18px] w-[18px] shrink-0" style={{ color: 'var(--color-primary)' }} strokeWidth={1.8} />
        <span className="text-[14px] font-medium text-tokenText">{lang === 'zh' ? '我的邀请码' : 'My Invite Code'}</span>
      </div>
      <button onClick={handleCopy} className="flex items-center gap-1.5">
        <span className="font-num text-[14px] font-semibold" style={{ color: 'var(--color-primary)' }}>{MOCK_INVITE_CODE}</span>
        {copied
          ? <Check className="h-4 w-4" style={{ color: 'var(--color-primary)', animation: 'popIn 200ms cubic-bezier(0.22,1,0.36,1) both' }} strokeWidth={2.5} />
          : <Copy className="h-4 w-4 text-tokenHint" strokeWidth={1.8} />}
      </button>
    </div>
  );
}

function MemberCard({ onOpen }) {
  const { lang } = useLanguage();
  const { isMember, memberExpiry } = useUser();

  if (isMember) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl px-5 py-5"
        style={{ background: 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 60%, #7c3aed))' }}
      >
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-20" style={{ background: '#fff' }} />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              <Crown className="h-4 w-4 text-white/90" strokeWidth={1.5} />
              <span className="text-[13px] font-semibold text-white/90">{lang === 'zh' ? '超级龙虾会员' : 'SupClaw Member'}</span>
            </div>
            <p className="text-[12px] text-white/60">
              {lang === 'zh' ? `有效期至 ${memberExpiry}` : `Valid until ${memberExpiry}`}
            </p>
          </div>
          <button
            onClick={onOpen}
            className="rounded-full px-4 py-1.5 text-[12px] font-semibold active:opacity-70"
            style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--color-primary)' }}
          >
            {lang === 'zh' ? '续期' : 'Renew'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onOpen}
      className="w-full overflow-hidden rounded-2xl px-5 py-5 text-left"
      style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-md)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)' }}>
            <Crown className="h-5 w-5" style={{ color: 'var(--color-primary)' }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-tokenText">{lang === 'zh' ? '开通年会员' : 'Start Membership'}</p>
            <p className="text-[12px] text-tokenHint">{lang === 'zh' ? '解锁首发权兑换等专属权益' : 'Unlock early access and more'}</p>
          </div>
        </div>
        <div
          className="rounded-full px-4 py-1.5 text-[13px] font-semibold text-white"
          style={{ background: 'var(--color-primary)' }}
        >
          {lang === 'zh' ? '开通' : 'Join'}
        </div>
      </div>
    </button>
  );
}

function OwnedCodesSection({ onTransfer, onActivate }) {
  const { lang } = useLanguage();
  const { ownedCodeCount } = useUser();

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="flex items-center gap-3">
        <Key className="h-[18px] w-[18px] shrink-0" style={{ color: 'var(--color-primary)' }} strokeWidth={1.8} />
        <span className="text-[14px] font-medium text-tokenText">{lang === 'zh' ? '我的续期码' : 'My Renewal Codes'}</span>
        {ownedCodeCount > 0 && (
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            {ownedCodeCount}
          </span>
        )}
      </div>
      {ownedCodeCount > 0 ? (
        <div className="flex items-center gap-3">
          <button
            onClick={onActivate}
            className="flex items-center gap-1 text-[13px] font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            {lang === 'zh' ? '使用' : 'Use'}
          </button>
          <div className="h-3 w-px" style={{ background: 'var(--color-border)' }} />
          <button
            onClick={onTransfer}
            className="flex items-center gap-1 text-[13px] font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            <Send className="h-3.5 w-3.5" strokeWidth={2} />
            {lang === 'zh' ? '转让' : 'Transfer'}
          </button>
        </div>
      ) : (
        <span className="text-[13px] text-tokenHint">{lang === 'zh' ? '暂无' : 'None'}</span>
      )}
    </div>
  );
}

const HELP_ITEMS = [
  {
    zhLabel: '什么是续期码？',
    enLabel: 'What is a renewal code?',
    zhContent: '续期码是用来开通或续期超级龙虾年会员的凭证。有主码直接使用即可；无主码需要输入码上印的账号和密码才能激活。',
    enContent: 'A renewal code is a voucher to activate or renew your SupClaw annual membership. Owned codes can be used directly; unowned codes require the account and password printed on the voucher.',
  },
  {
    zhLabel: '什么是首发权？',
    enLabel: 'What is Early Access?',
    zhContent: 'ASC / BSC / CSC 是用于抢先兑换 AI 视频的权益凭证，分别对应 A / B / C 三类视频。持有首发权才能参与视频兑换。',
    enContent: 'ASC, BSC, and CSC are early access passes for Type A, B, and C AI videos. You need the matching pass to redeem a video.',
  },
  {
    zhLabel: '如何获得 SC？',
    enLabel: 'How do I get SC?',
    zhContent: '你可以通过将 DOS 或 SCV 兑换为 SC，或参与 100 秒补贴活动获得 SC 奖励。SC 是平台的基础词元，可用于兑换首发权及支付手续费。',
    enContent: 'You can get SC by swapping DOS or redeeming an SCV activation code. SC is the base token used for early access and service fees.',
  },
  {
    zhLabel: '会员有哪些权益？',
    enLabel: 'What do members get?',
    zhContent: '年会员可使用 SC 兑换首发权（ASC / BSC / CSC），把 SC 换回 DOS，以及参与 100 秒补贴活动。更多专属权益正在规划中。',
    enContent: 'Annual members can redeem early access passes, convert SC back to DOS, and join the 100-second subsidy activity. More benefits are on the way.',
  },
];

function HelpSection() {
  const { lang } = useLanguage();
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div>
      <p className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-wider text-tokenHint">
        {lang === 'zh' ? '帮助说明' : 'Help'}
      </p>
      <div className="overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
        {HELP_ITEMS.map((item, i) => (
          <div key={i} className={i < HELP_ITEMS.length - 1 ? 'border-b border-tokenBorderSubtle' : ''}>
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4 shrink-0 text-tokenHint" strokeWidth={1.8} />
                <span className="text-[14px] font-medium text-tokenText">{lang === 'zh' ? item.zhLabel : item.enLabel}</span>
              </div>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-tokenHint transition-transform duration-200"
                style={{ transform: openIdx === i ? 'rotate(90deg)' : 'rotate(0deg)' }}
                strokeWidth={1.8}
              />
            </button>
            {openIdx === i && (
              <div className="px-4 pb-4 pt-0">
                <p className="text-[13px] leading-relaxed text-tokenSub">{lang === 'zh' ? item.zhContent : item.enContent}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PProfile() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { isMember, ownedCodeCount, activateMembership, useOwnedCode } = useUser();
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [useConfirming, setUseConfirming] = useState(false);
  const [useSuccess, setUseSuccess] = useState(null); // { expiry, wasRenewal }

  function handleDirectUse() {
    const wasRenewal = isMember;
    const newExpiry = activateMembership();
    useOwnedCode();
    setUseConfirming(false);
    setUseSuccess({ expiry: newExpiry, wasRenewal });
  }

  return (
    <>
      <header className="flex h-[68px] items-center px-4 bg-white border-b border-tokenBorderSubtle">
        <div className="w-[86px]" />
        <h1 className="flex-1 text-center text-[20px] font-semibold text-tokenText">{lang === 'zh' ? '我的' : 'Profile'}</h1>
        <HeaderActions />
      </header>
      <div
        className="no-scrollbar h-[calc(100vh-68px-58px)] overflow-y-auto px-4 pb-8 pt-3"
        style={{ background: 'linear-gradient(180deg, #e2f8f5 0%, #f7fbff 18%)' }}
      >
        <div className="enter mb-4" style={{ animationDelay: '0ms' }}>
          <MemberCard onOpen={() => setMembershipOpen(true)} />
        </div>

        <div className="enter mb-4 overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)', animationDelay: '60ms' }}>
          <OwnedCodesSection
            onTransfer={() => setTransferOpen(true)}
            onActivate={() => setUseConfirming(true)}
          />
        </div>

        <div className="enter mb-4 overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)', animationDelay: '90ms' }}>
          <InviteCodeRow />
        </div>

        <div className="enter" style={{ animationDelay: '120ms' }}>
          <HelpSection />
        </div>
      </div>

      {membershipOpen && (
        <MembershipSheet
          onClose={() => setMembershipOpen(false)}
          onActivate={() => { setMembershipOpen(false); navigate('/'); }}
        />
      )}
      {transferOpen && (
        <ActivationCodeTransferSheet onClose={() => setTransferOpen(false)} />
      )}

      {/* 直接使用有主续期码：确认 sheet */}
      {useConfirming && createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={() => setUseConfirming(false)}>
          <div className="w-full max-w-[480px]" style={{ animation: 'sheetUp 260ms cubic-bezier(0.22,1,0.36,1) both' }} onClick={e => e.stopPropagation()}>
            <div style={{ borderRadius: '20px 20px 0 0', background: 'var(--color-bg-page)', boxShadow: '0 -4px 32px rgba(13,21,39,0.14)' }}>
              <div className="flex justify-center pt-3 pb-1"><div className="h-1 w-10 rounded-full" style={{ background: 'var(--color-border)' }} /></div>
              <div className="px-6 pt-3 pb-3 text-center">
                <p className="text-[17px] font-semibold text-tokenText">{lang === 'zh' ? '确认使用续期码？' : 'Use Renewal Code?'}</p>
                <p className="mt-2 text-[13px] leading-[20px] text-tokenHint">
                  {lang === 'zh'
                    ? `将使用 1 张续期码，会员有效期增加 1 年，剩余 ${ownedCodeCount - 1} 张。`
                    : `1 renewal code will be used. Membership extended by 1 year. ${ownedCodeCount - 1} remaining.`}
                </p>
              </div>
              <div className="px-4 pb-8 flex flex-col gap-3">
                <button onClick={handleDirectUse} className="w-full py-[14px] text-[15px] font-semibold text-white" style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}>
                  {lang === 'zh' ? '确认使用' : 'Confirm'}
                </button>
                <button onClick={() => setUseConfirming(false)} className="w-full py-3 text-[15px] font-medium text-tokenSub">{lang === 'zh' ? '取消' : 'Cancel'}</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 使用成功 sheet */}
      {useSuccess && createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={() => setUseSuccess(null)}>
          <div className="w-full max-w-[480px]" style={{ animation: 'sheetUp 260ms cubic-bezier(0.22,1,0.36,1) both' }} onClick={e => e.stopPropagation()}>
            <div style={{ borderRadius: '20px 20px 0 0', background: 'var(--color-bg-page)', boxShadow: '0 -4px 32px rgba(13,21,39,0.14)' }}>
              <div className="flex justify-center pt-3 pb-1"><div className="h-1 w-10 rounded-full" style={{ background: 'var(--color-border)' }} /></div>
              <div className="flex flex-col items-center px-6 pt-4 pb-6">
                <div className="mb-4 grid h-16 w-16 place-items-center rounded-full" style={{ background: 'var(--color-success-soft)' }}>
                  <CheckCircle className="h-8 w-8" style={{ color: 'var(--color-success)' }} strokeWidth={1.8} />
                </div>
                <p className="text-[20px] font-semibold text-tokenText">{lang === 'zh' ? (useSuccess.wasRenewal ? '续期成功' : '开通成功') : (useSuccess.wasRenewal ? 'Renewed' : 'Activated')}</p>
                <p className="mt-2 text-[14px] text-tokenSub">{lang === 'zh' ? `有效期至 ${useSuccess.expiry}` : `Valid until ${useSuccess.expiry}`}</p>
              </div>
              <div className="px-4 pb-8">
                <button onClick={() => setUseSuccess(null)} className="w-full py-[14px] text-[15px] font-semibold text-white" style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' }}>
                  {lang === 'zh' ? '完成' : 'Done'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
