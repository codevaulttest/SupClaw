import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Copy, Check, ChevronRight, HelpCircle, Gift, Wallet } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { useUser } from '../components/UserContext';
import HeaderActions from '../components/HeaderActions';
import MembershipSheet from '../components/MembershipSheet';

const MOCK_INVITE_CODE = 'SUPRA-8X4K';
const MOCK_WALLET = '0x3f2a8b1c9e4d7f0a5b3c2e1d8f6a9b4c7e2d5f8a';

function WalletRow() {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  const short = `${MOCK_WALLET.slice(0, 6)}...${MOCK_WALLET.slice(-4)}`;

  function handleCopy() {
    navigator.clipboard.writeText(MOCK_WALLET).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2.5 px-4 py-3">
      <Wallet className="h-4 w-4 shrink-0 text-tokenHint" strokeWidth={1.8} />
      <span className="font-num text-[13px] text-tokenSub">{short}</span>
      <button onClick={handleCopy} className="flex items-center">
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
          <div className="rounded-full bg-white/20 px-3 py-1">
            <span className="text-[12px] font-semibold text-white">{lang === 'zh' ? '已开通' : 'Active'}</span>
          </div>
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

const HELP_ITEMS = [
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
    zhLabel: '补贴是怎么计算的？',
    enLabel: 'How are subsidies calculated?',
    zhContent: '在 100 秒结算窗口结束后，系统将根据你的订单金额随机发放补贴。',
    enContent: 'After each 100-second settlement window, the system issues a random subsidy based on your order amount.',
  },
  {
    zhLabel: '会员有哪些权益？',
    enLabel: 'What do members get?',
    zhContent: '年会员可使用 SC 兑换首发权（ASC / BSC / CSC），更多专属权益正在规划中，敬请期待。',
    enContent: 'Annual members can redeem early access passes with SC. More member-only benefits are planned.',
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
  const [membershipOpen, setMembershipOpen] = useState(false);

  return (
    <>
      <header className="flex h-[68px] items-center px-4 bg-white border-b border-tokenBorderSubtle">
        <div className="w-[86px]" />
        <h1 className="flex-1 text-center text-[20px] font-semibold text-tokenText">{lang === 'zh' ? '我的' : 'Profile'}</h1>
        <HeaderActions />
      </header>
      <div className="no-scrollbar h-[calc(100vh-68px-58px)] overflow-y-auto px-4 pb-8 pt-3">

      <div className="enter mb-4 w-fit overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)', animationDelay: '0ms' }}>
        <WalletRow />
      </div>

      <div className="enter mb-4" style={{ animationDelay: '60ms' }}>
        <MemberCard onOpen={() => setMembershipOpen(true)} />
      </div>

      <div className="enter mb-4 overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)', animationDelay: '120ms' }}>
        <InviteCodeRow />
      </div>

      <div className="enter" style={{ animationDelay: '180ms' }}>
        <HelpSection />
      </div>
    </div>

    {membershipOpen && (
      <MembershipSheet
        onClose={() => setMembershipOpen(false)}
        onActivate={() => { setMembershipOpen(false); navigate('/'); }}
      />
    )}
    </>
  );
}
