import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../components/LanguageContext';

const DOS_BALANCE = 50;
const SC_BALANCE  = 32.11;

export default function P1Exchange() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const num = parseFloat(amount) || 0;
  const willReceive = num;
  const insufficient = num > 0 && num > DOS_BALANCE;
  const canSubmit = num > 0 && !insufficient;

  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => navigate('/'), 1200);
  }

  return (
    <>
      <PageHeader title={lang === 'zh' ? '兑换 SC' : 'Swap SC'} />

      <div className="px-4 pt-5 pb-8">
        {/* 余额卡片 */}
        <div className="mb-5 flex gap-3">
          <div className="flex-1 rounded-xl px-4 py-3" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-[11px] text-tokenHint">{lang === 'zh' ? 'DOS 余额' : 'DOS Balance'}</p>
            <p className="mt-1 font-num text-[20px] font-semibold text-tokenText">{DOS_BALANCE} <span className="text-[13px] font-normal">DOS</span></p>
          </div>
          <div className="flex-1 rounded-xl px-4 py-3" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-[11px] text-tokenHint">{lang === 'zh' ? 'SC 余额' : 'SC Balance'}</p>
            <p className="mt-1 font-num text-[20px] font-semibold text-tokenPrimary">{SC_BALANCE} <span className="text-[13px] font-normal">{lang === 'zh' ? '亿 SC' : 'B SC'}</span></p>
          </div>
        </div>

        {/* 汇率 */}
        <div className="mb-4 flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: 'var(--color-primary-soft)', border: '1px solid var(--color-primary-border)' }}>
          <ArrowLeftRight className="h-4 w-4 text-tokenPrimary shrink-0" strokeWidth={2} />
          <p className="text-[13px] text-tokenPrimary font-medium">{lang === 'zh' ? '兑换汇率：1 DOS = 1 亿 SC' : 'Rate: 1 DOS = 1B SC'}</p>
        </div>

        {/* 输入框 */}
        <div className="mb-2">
          <label className="mb-2 block text-[13px] font-medium text-tokenSub">{lang === 'zh' ? '输入 DOS 数量' : 'Enter DOS amount'}</label>
          <div
            className="flex items-center gap-3 px-4 py-3.5"
            style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-bg-card)', border: `1px solid ${insufficient ? 'var(--color-danger)' : 'var(--color-border)'}`, boxShadow: 'var(--shadow-sm)' }}
          >
            <input
              type="number"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              className="flex-1 bg-transparent font-num text-[22px] font-semibold text-tokenText outline-none placeholder:text-tokenHint"
            />
            <span className="text-[14px] font-medium text-tokenSub">DOS</span>
            <button onClick={() => setAmount(String(DOS_BALANCE))} className="text-[12px] font-semibold text-tokenPrimary">{lang === 'zh' ? '全部' : 'Max'}</button>
          </div>
        </div>
        {insufficient && <p className="mb-3 text-[12px] text-tokenDanger">{lang === 'zh' ? `DOS 余额不足（可用：${DOS_BALANCE} DOS）` : `Insufficient DOS balance (${DOS_BALANCE} DOS available)`}</p>}

        {/* 预计获得 */}
        {num > 0 && !insufficient && (
          <div className="mb-5 rounded-xl px-4 py-3" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-[12px] text-tokenHint">{lang === 'zh' ? '预计获得' : 'You will receive'}</p>
            <p className="mt-1 font-num text-[22px] font-semibold text-tokenPrimary">{willReceive} <span className="text-[14px] font-normal">{lang === 'zh' ? '亿 SC' : 'B SC'}</span></p>
          </div>
        )}

        {/* 提交 */}
        {submitted ? (
          <div className="flex items-center justify-center gap-2 rounded-xl py-4" style={{ background: 'var(--color-success-soft)', border: '1px solid var(--color-primary-border)' }}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="var(--color-success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span className="text-[15px] font-semibold text-tokenSuccess">{lang === 'zh' ? '兑换成功' : 'Swap completed'}</span>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-[14px] text-[15px] font-semibold text-white"
            style={{
              borderRadius: 'var(--radius-md)',
              background: canSubmit ? 'var(--color-primary)' : 'var(--color-border)',
              boxShadow: canSubmit ? '0 2px 8px color-mix(in srgb, var(--color-primary) 40%, transparent)' : 'none',
              color: canSubmit ? '#fff' : 'var(--color-text-hint)',
            }}
          >
            {lang === 'zh' ? '确认兑换' : 'Confirm Swap'}
          </button>
        )}
      </div>
    </>
  );
}
