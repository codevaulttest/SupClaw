import { createPortal } from 'react-dom';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useUser } from './UserContext';
import { useDev } from './DevContext';
import { formatScAmount } from '../utils/formatSc';

export default function DevPanel({ onClose }) {
  const { lang } = useLanguage();
  const [emptyOpen, setEmptyOpen] = useState(false);
  const { isMember, memberExpiry, toggleMembership, ownedCodeCount, resetForDemo } = useUser();
  const {
    devScvInvalid, toggleDevScvInvalid, setSubsidyTrigger,
    emptyOrders, toggleEmptyOrders,
    emptyHistory, toggleEmptyHistory,
    emptyProductList, toggleEmptyProductList,
  } = useDev();

  const subsidyScenarios = [
    { label: lang === 'zh' ? '折让演示' : 'Discount Demo', sub: lang === 'zh' ? '补贴 3.11 亿 < 兑换 9 亿' : `Subsidy ${formatScAmount(3.11, lang).text} < order ${formatScAmount(9, lang).text}`, amount: 3.11 },
    { label: lang === 'zh' ? '补贴演示' : 'Subsidy Demo', sub: lang === 'zh' ? '补贴 10.5 亿 > 兑换 9 亿' : `Subsidy ${formatScAmount(10.5, lang).text} > order ${formatScAmount(9, lang).text}`, amount: 10.5 },
    { label: lang === 'zh' ? '未中奖演示' : 'No Win Demo', sub: lang === 'zh' ? '本轮未获得补贴' : 'No subsidy this round', amount: 0 },
    { label: lang === 'zh' ? '接口异常演示' : 'API Error Demo', sub: lang === 'zh' ? '补贴结果获取失败' : 'Subsidy result fetch failed', amount: 'error' },
  ];

  const codePresets = [
    { zh: '未开通 · 2张码', en: 'No Member · 2 codes', member: false, codes: 2 },
    { zh: '未开通 · 无码', en: 'No Member · 0 codes', member: false, codes: 0 },
    { zh: '已开通 · 2张码', en: 'Member · 2 codes',   member: true,  codes: 2 },
    { zh: '已开通 · 无码', en: 'Member · 0 codes',    member: true,  codes: 0 },
  ];

  function Toggle({ value, onToggle, active }) {
    return (
      <button
        onClick={onToggle}
        className="relative h-[28px] w-[48px] shrink-0 rounded-full transition-colors duration-200"
        style={{ background: value ? (active ?? 'var(--color-primary)') : 'var(--color-border)' }}
      >
        <span
          className="absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform duration-200"
          style={{ left: 3, transform: value ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </button>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={onClose}>
      <div className="w-full max-w-[480px] px-4 pb-[80px]" style={{ animation: 'sheetUp 260ms cubic-bezier(0.22,1,0.36,1) both', maxHeight: 'calc(100vh - 16px)' }} onClick={e => e.stopPropagation()}>
        <div className="overflow-y-auto" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-lg)', maxHeight: 'calc(100vh - 96px)' }}>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-tokenBorderSubtle px-4 py-3">
            <span className="text-[13px] font-semibold text-tokenSub">{lang === 'zh' ? '开发者演示' : 'Developer Demo'}</span>
            <button onClick={onClose} className="text-[13px] text-tokenHint">{lang === 'zh' ? '关闭' : 'Close'}</button>
          </div>

          {/* Subsidy scenarios */}
          {subsidyScenarios.map((s, i) => (
            <button key={i} onClick={() => { setSubsidyTrigger(s.amount); onClose(); }}
              className="flex items-center justify-between px-4 py-3.5 w-full text-left border-b border-tokenBorderSubtle">
              <div>
                <p className="text-[14px] font-medium text-tokenText">{s.label}</p>
                <p className="text-[12px] text-tokenHint">{s.sub}</p>
              </div>
              <ChevronRight className="h-[15px] w-[15px] text-tokenHint" />
            </button>
          ))}

          {/* SCV invalid toggle */}
          <div className="flex items-center justify-between border-b border-tokenBorderSubtle px-4 py-3.5">
            <div>
              <p className="text-[14px] font-medium text-tokenText">{lang === 'zh' ? '激活码校验结果' : 'SCV Code Result'}</p>
              <p className="text-[12px] text-tokenHint">{lang === 'zh' ? '兑换面板 SCV 校验走失败分支' : 'Force SCV verify to fail'}</p>
            </div>
            <Toggle value={devScvInvalid} onToggle={toggleDevScvInvalid} active="var(--color-danger)" />
          </div>

          {/* Membership toggle */}
          <div className="flex items-center justify-between border-b border-tokenBorderSubtle px-4 py-3.5">
            <div>
              <p className="text-[14px] font-medium text-tokenText">{lang === 'zh' ? '年会员状态' : 'Annual Membership'}</p>
              <p className="text-[12px]" style={{ color: isMember ? 'var(--color-success, #16a34a)' : 'var(--color-text-hint)' }}>
                {isMember
                  ? (lang === 'zh' ? `已开通 · 有效期至 ${memberExpiry}` : `Active · Expires ${memberExpiry}`)
                  : (lang === 'zh' ? '未开通' : 'Inactive')}
              </p>
            </div>
            <Toggle value={isMember} onToggle={toggleMembership} />
          </div>

          {/* Activation code presets */}
          <button
            onClick={() => setEmptyOpen(v => !v)}
            className="flex w-full items-center justify-between border-b border-tokenBorderSubtle px-4 py-3"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-tokenHint">{lang === 'zh' ? '激活码演示预设' : 'Code Demo Presets'}</p>
              <p className="text-[12px] text-tokenHint">
                {lang === 'zh' ? `当前：${isMember ? '已开通' : '未开通'} · ${ownedCodeCount} 张码` : `Now: ${isMember ? 'member' : 'no member'} · ${ownedCodeCount} codes`}
              </p>
            </div>
            <ChevronRight className="h-[14px] w-[14px] text-tokenHint transition-transform duration-200" style={{ transform: emptyOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
          </button>

          {emptyOpen && codePresets.map((p, i) => {
            const isActive = isMember === p.member && ownedCodeCount === p.codes;
            return (
              <button
                key={i}
                onClick={() => { resetForDemo(p.member, p.codes); onClose(); }}
                className="flex w-full items-center justify-between border-b border-tokenBorderSubtle px-4 py-3.5"
                style={{ background: isActive ? 'color-mix(in srgb, var(--color-primary) 6%, transparent)' : 'transparent' }}
              >
                <p className="text-[14px] font-medium text-tokenText">{lang === 'zh' ? p.zh : p.en}</p>
                {isActive && (
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--color-primary)' }}>
                    {lang === 'zh' ? '当前' : 'Active'}
                  </span>
                )}
              </button>
            );
          })}

          {/* Empty states section */}
          <button
            onClick={() => {}}
            className="flex w-full items-center justify-between border-t border-tokenBorderSubtle px-4 py-3"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-tokenHint">{lang === 'zh' ? '空状态' : 'Empty States'}</p>
          </button>

          {[
            { label: lang === 'zh' ? '订单列表' : 'Orders', sub: lang === 'zh' ? '订单页三个 tab 全部清空' : 'Clear all order tabs', value: emptyOrders, toggle: toggleEmptyOrders },
            { label: lang === 'zh' ? '历史记录' : 'History', sub: lang === 'zh' ? 'SC收支 & 首发权记录清空' : 'SC activity & early access orders', value: emptyHistory, toggle: toggleEmptyHistory },
            { label: lang === 'zh' ? '商品列表' : 'Product List', sub: lang === 'zh' ? 'AI 商品分类列表清空' : 'AI category product list', value: emptyProductList, toggle: toggleEmptyProductList },
          ].map((item, i, arr) => (
            <div key={i} className={`flex items-center justify-between px-4 py-3.5 border-t border-tokenBorderSubtle${i === arr.length - 1 ? ' border-b border-tokenBorderSubtle' : ''}`}>
              <div>
                <p className="text-[14px] font-medium text-tokenText">{item.label}</p>
                <p className="text-[12px] text-tokenHint">{item.sub}</p>
              </div>
              <Toggle value={item.value} onToggle={item.toggle} />
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
