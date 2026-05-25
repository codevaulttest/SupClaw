import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Minus, Plus, X, Paperclip, Trash2 } from 'lucide-react';
import TokenIcon from './TokenIcon';
import { useLanguage } from './LanguageContext';
import { formatScAmount } from '../utils/formatSc';

const BALANCES = { A: 3, B: 5, C: 8 };
const SC_BALANCE = 32.11;
const SC_RATE = { A: 5, B: 3, C: 1 };
const TYPE_INFO = {
  A: { label: 'A · 品牌定制', v: 'a' },
  B: { label: 'B · 创意文案', v: 'b' },
  C: { label: 'C · 极速盲盒', v: 'c' },
};

function formatBookTitle(title) {
  if (!title || title.startsWith('《') || !/[\u4e00-\u9fff]/.test(title)) return title;
  return `《${title}》`;
}

export default function ProductOrderSheet({ product, onClose, onOrdered, onOpenBuy, onOpenExchange }) {
  const { lang } = useLanguage();
  const [qty, setQty] = useState(1);
  const [qtyDraft, setQtyDraft] = useState('');
  const [title, setTitle] = useState('');
  const [coreMsg, setCoreMsg] = useState('');
  const [assets, setAssets] = useState([]);
  const fileInputRef = useRef(null);

  const type = product.type;
  const info = TYPE_INFO[type];
  const v = info.v;
  const unitABC = product.price;
  const totalABC = qty * unitABC;
  const totalSC = +(totalABC * SC_RATE[type] * 0.1).toFixed(2);
  const totalScDisplay = formatScAmount(totalSC, lang);
  const scBalanceDisplay = formatScAmount(SC_BALANCE, lang);
  const duration = qty * product.duration;

  const abcBal = BALANCES[type];
  const abcInsufficient = totalABC > abcBal;
  const scInsufficient = totalSC > SC_BALANCE;
  const canOrder = !abcInsufficient && !scInsufficient;

  function handleOrder() {
    if (!canOrder) return;
    onClose();
    onOrdered?.();
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
          className="max-h-[86vh] overflow-y-auto no-scrollbar"
          style={{
            borderRadius: '20px 20px 0 0',
            background: 'var(--color-bg-page)',
            boxShadow: '0 -4px 32px rgba(13,21,39,0.14)',
          }}
        >
          <div className="relative flex items-center justify-center px-4 pt-3 pb-2">
            <div className="absolute top-3 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full" style={{ background: 'var(--color-border)' }} />
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="w-8" />
              <span className="text-[17px] font-semibold text-tokenText">{formatBookTitle(product.title)}</span>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--color-bg-card)' }}>
                <X className="h-4 w-4 text-tokenSub" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="px-4 pb-6 pt-2">
            <div className="mb-5 flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              <TokenIcon type={type} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-tokenText">{formatBookTitle(product.title)}</p>
                <p className="mt-0.5 text-[12px]" style={{ color: `var(--token-${v}-text)` }}>
                  {lang === 'zh' ? info.label : { A: 'A · Brand Custom', B: 'B · Creative Copy', C: 'C · Blind Box' }[type]}
                  <span className="text-tokenHint"> · {lang === 'zh' ? '每' : 'Each'} {product.duration}{lang === 'zh' ? '秒需' : 's video costs '}{unitABC} {type}SC</span>
                </p>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-xl px-5 py-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="min-w-0">
                <p className="text-[13px] text-tokenSub">{lang === 'zh' ? '视频时长' : 'Video Length'}</p>
                <p className="mt-1 flex items-baseline gap-1 whitespace-nowrap">
                  <span className="font-num text-[28px] font-bold leading-none" style={{ color: `var(--token-${v}-from)` }}>{duration}</span>
                  <span className="text-[15px] font-semibold" style={{ color: `var(--token-${v}-from)` }}>{lang === 'zh' ? '秒视频' : 'sec video'}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { const next = Math.max(1, qty - 1); setQty(next); setQtyDraft(''); }} className="flex h-9 w-9 items-center justify-center rounded-full border border-tokenBorder">
                  <Minus className="h-4 w-4 text-tokenText" strokeWidth={2} />
                </button>
                <input
                  type="number"
                  min="1"
                  value={qtyDraft !== '' ? qtyDraft : qty}
                  onChange={e => {
                    setQtyDraft(e.target.value);
                    const n = parseInt(e.target.value, 10);
                    if (Number.isFinite(n) && n >= 1) setQty(n);
                  }}
                  onBlur={() => { setQtyDraft(''); if (qty < 1) setQty(1); }}
                  className="text-center font-num text-[22px] font-semibold text-tokenText bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ width: '4rem' }}
                />
                <button onClick={() => { setQty(q => q + 1); setQtyDraft(''); }} className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: `var(--token-${v}-from)` }}>
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="mb-4 rounded-xl px-5 py-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              <p className="mb-3 text-[13px] font-semibold text-tokenText">{lang === 'zh' ? '费用明细' : 'Payment Summary'}</p>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[13px] text-tokenSub">{type}SC</span>
                <span className="font-num text-[15px] font-semibold" style={{ color: `var(--token-${v}-text)` }}>{totalABC} {type}SC</span>
              </div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13px] text-tokenSub">SC (+10%)</span>
                <span className="font-num text-[15px] font-semibold text-tokenPrimary">{totalScDisplay.text}</span>
              </div>
              <div className="mb-3 h-px bg-tokenBorderSubtle" />
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-tokenHint">{lang === 'zh' ? `${type}SC 余额 / SC 余额` : `${type}SC Balance / SC Balance`}</span>
                <span className="text-[12px]" style={{ color: abcInsufficient || scInsufficient ? 'var(--color-danger)' : 'var(--color-success)' }}>
                  {abcBal} {type}SC / {scBalanceDisplay.text}
                </span>
              </div>
            </div>

            {abcInsufficient && (
              <div className="mb-3 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'var(--color-danger-soft)' }}>
                <span className="text-[12px] text-tokenDanger">{lang === 'zh' ? `${type}SC 余额不足` : `Insufficient ${type}SC balance`}</span>
                <button onClick={onOpenBuy} className="text-[12px] font-semibold text-tokenDanger underline">{lang === 'zh' ? '去兑换首发权' : 'Redeem Early Access'}</button>
              </div>
            )}
            {!abcInsufficient && scInsufficient && (
              <div className="mb-3 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'var(--color-danger-soft)' }}>
                <span className="text-[12px] text-tokenDanger">{lang === 'zh' ? 'SC 余额不足' : 'Insufficient SC balance'}</span>
                <button onClick={onOpenExchange} className="text-[12px] font-semibold text-tokenDanger underline">{lang === 'zh' ? '去兑换 SC' : 'Swap SC'}</button>
              </div>
            )}

            {(type === 'B' || type === 'A') && (
              <div className="mb-4 flex flex-col gap-3 rounded-xl px-4 py-4" style={{ background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}>
                <p className="text-[13px] font-semibold text-tokenText">
                  {lang === 'zh' ? '创作信息' : 'Creative Brief'}
                  <span className="ml-1.5 text-[11px] font-normal text-tokenHint">{lang === 'zh' ? '可选' : 'Optional'}</span>
                </p>

                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-tokenHint">
                    {lang === 'zh' ? '视频标题' : 'Video Title'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={lang === 'zh' ? '请输入视频标题' : 'Enter video title'}
                    className="w-full rounded-xl px-3 py-2.5 text-[14px] outline-none"
                    style={{ background: 'var(--color-bg-page)', border: '1.5px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-tokenHint">
                    {lang === 'zh' ? '核心表达' : 'Core Message'}
                  </label>
                  <textarea
                    value={coreMsg}
                    onChange={e => setCoreMsg(e.target.value)}
                    rows={3}
                    placeholder={lang === 'zh' ? '请描述视频想传达的核心内容' : 'Describe the core message for this video'}
                    className="w-full resize-none rounded-xl px-3 py-2.5 text-[14px] outline-none"
                    style={{ background: 'var(--color-bg-page)', border: '1.5px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                  />
                </div>

                {type === 'A' && (
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-tokenHint">
                      {lang === 'zh' ? '素材（品牌元素、LOGO、风格参考等）' : 'Assets (brand elements, logo, style references, etc.)'}
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={e => {
                        const picked = Array.from(e.target.files || []);
                        setAssets(prev => [...prev, ...picked]);
                        e.target.value = '';
                      }}
                    />
                    {assets.length > 0 && (
                      <div className="mb-2 flex flex-col gap-1.5">
                        {assets.map((f, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'var(--color-bg-page)', border: '1px solid var(--color-border)' }}>
                            <span className="truncate text-[13px] text-tokenSub">{f.name}</span>
                            <button onClick={() => setAssets(prev => prev.filter((_, j) => j !== i))} className="ml-2 shrink-0">
                              <Trash2 className="h-3.5 w-3.5 text-tokenHint" strokeWidth={1.8} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium"
                      style={{ background: 'var(--color-bg-page)', border: '1.5px dashed var(--color-border)', color: 'var(--color-text-secondary)', width: '100%' }}
                    >
                      <Paperclip className="h-4 w-4 shrink-0 text-tokenHint" strokeWidth={1.8} />
                      {lang === 'zh' ? '添加素材' : 'Add Assets'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleOrder}
              disabled={!canOrder}
              className="w-full py-[14px] text-[15px] font-semibold text-white"
              style={{
                borderRadius: 'var(--radius-md)',
                background: canOrder ? `linear-gradient(135deg, var(--token-${v}-from), var(--token-${v}-to))` : 'var(--color-border)',
                color: canOrder ? '#fff' : 'var(--color-text-hint)',
                boxShadow: canOrder ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {lang === 'zh' ? `确认兑换 · ${duration} 秒视频` : `Confirm Order · ${duration}s video`}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
