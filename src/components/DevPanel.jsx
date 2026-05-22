import { createPortal } from 'react-dom';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useUser } from './UserContext';
import { useDev } from './DevContext';

export default function DevPanel({ onClose }) {
  const { lang } = useLanguage();
  const [emptyOpen, setEmptyOpen] = useState(false);
  const { isMember, memberExpiry, toggleMembership } = useUser();
  const {
    devScvInvalid, toggleDevScvInvalid, setSubsidyTrigger,
    emptyOrders, toggleEmptyOrders,
    emptyHistory, toggleEmptyHistory,
    emptyProductList, toggleEmptyProductList,
  } = useDev();

  const scenarios = [
    { label: lang === 'zh' ? '折让演示' : 'Discount Demo', sub: lang === 'zh' ? '补贴 3.11 亿 < 兑换 9 亿' : 'Subsidy 3.11B < order 9B', amount: 3.11 },
    { label: lang === 'zh' ? '补贴演示' : 'Subsidy Demo', sub: lang === 'zh' ? '补贴 10.5 亿 > 兑换 9 亿' : 'Subsidy 10.5B > order 9B', amount: 10.5 },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={onClose}>
      <div className="w-full max-w-[480px] px-4 pb-6" style={{ animation: 'sheetUp 260ms cubic-bezier(0.22,1,0.36,1) both' }} onClick={e => e.stopPropagation()}>
        <div className="overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-lg)' }}>
          <div className="flex items-center justify-between border-b border-tokenBorderSubtle px-4 py-3">
            <span className="text-[13px] font-semibold text-tokenSub">{lang === 'zh' ? '🛠 开发者演示' : 'Developer Demo'}</span>
            <button onClick={onClose} className="text-[13px] text-tokenHint">{lang === 'zh' ? '关闭' : 'Close'}</button>
          </div>

          {scenarios.map((s, i) => (
            <button key={i} onClick={() => { setSubsidyTrigger(s.amount); onClose(); }}
              className="flex items-center justify-between px-4 py-3.5 w-full text-left border-b border-tokenBorderSubtle">
              <div>
                <p className="text-[14px] font-medium text-tokenText">{s.label}</p>
                <p className="text-[12px] text-tokenHint">{s.sub}</p>
              </div>
              <ChevronRight className="h-[15px] w-[15px] text-tokenHint" />
            </button>
          ))}

          <div className="flex items-center justify-between border-b border-tokenBorderSubtle px-4 py-3.5">
            <div>
              <p className="text-[14px] font-medium text-tokenText">{lang === 'zh' ? '激活码校验结果' : 'SCV Code Result'}</p>
              <p className="text-[12px] text-tokenHint">{lang === 'zh' ? '兑换面板 SCV 校验走失败分支' : 'Force SCV verify to fail'}</p>
            </div>
            <button
              onClick={toggleDevScvInvalid}
              className="relative h-[28px] w-[48px] shrink-0 rounded-full transition-colors duration-200"
              style={{ background: devScvInvalid ? 'var(--color-danger)' : 'var(--color-border)' }}
            >
              <span className="absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform duration-200"
                style={{ left: 3, transform: devScvInvalid ? 'translateX(20px)' : 'translateX(0)' }} />
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-tokenBorderSubtle px-4 py-3.5">
            <div>
              <p className="text-[14px] font-medium text-tokenText">{lang === 'zh' ? '年会员状态' : 'Annual Membership'}</p>
              <p className="text-[12px]" style={{ color: isMember ? 'var(--color-success, #16a34a)' : 'var(--color-text-hint)' }}>
                {isMember
                  ? (lang === 'zh' ? `已开通 · 有效期至 ${memberExpiry}` : `Active · Expires ${memberExpiry}`)
                  : (lang === 'zh' ? '未开通' : 'Inactive')}
              </p>
            </div>
            <button
              onClick={toggleMembership}
              className="relative h-[28px] w-[48px] shrink-0 rounded-full transition-colors duration-200"
              style={{ background: isMember ? 'var(--color-primary)' : 'var(--color-border)' }}
            >
              <span className="absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform duration-200"
                style={{ left: 3, transform: isMember ? 'translateX(20px)' : 'translateX(0)' }} />
            </button>
          </div>

          <button
            onClick={() => setEmptyOpen(v => !v)}
            className="flex w-full items-center justify-between border-t border-tokenBorderSubtle px-4 py-3"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-tokenHint">{lang === 'zh' ? '空状态' : 'Empty States'}</p>
            <ChevronRight className="h-[14px] w-[14px] text-tokenHint transition-transform duration-200" style={{ transform: emptyOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
          </button>

          {emptyOpen && [
            { label: lang === 'zh' ? '订单列表' : 'Orders', sub: lang === 'zh' ? '订单页三个 tab 全部清空' : 'Clear all order tabs', value: emptyOrders, toggle: toggleEmptyOrders },
            { label: lang === 'zh' ? '历史记录' : 'History', sub: lang === 'zh' ? 'SC收支 & 首发权记录清空' : 'SC activity & premiere orders', value: emptyHistory, toggle: toggleEmptyHistory },
            { label: lang === 'zh' ? '商品列表' : 'Product List', sub: lang === 'zh' ? 'AI 商品分类列表清空' : 'AI category product list', value: emptyProductList, toggle: toggleEmptyProductList },
          ].map((item, i, arr) => (
            <div key={i} className={`flex items-center justify-between px-4 py-3.5 border-t border-tokenBorderSubtle${i === arr.length - 1 ? ' border-b border-tokenBorderSubtle' : ''}`}>
              <div>
                <p className="text-[14px] font-medium text-tokenText">{item.label}</p>
                <p className="text-[12px] text-tokenHint">{item.sub}</p>
              </div>
              <button
                onClick={item.toggle}
                className="relative h-[28px] w-[48px] shrink-0 rounded-full transition-colors duration-200"
                style={{ background: item.value ? 'var(--color-primary)' : 'var(--color-border)' }}
              >
                <span className="absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform duration-200"
                  style={{ left: 3, transform: item.value ? 'translateX(20px)' : 'translateX(0)' }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
