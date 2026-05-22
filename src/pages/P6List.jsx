import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, X, PackageSearch } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ExchangeSubmittedSheet from '../components/ExchangeSubmittedSheet';
import ProductOrderSheet from '../components/ProductOrderSheet';
import BuyABCSheet from '../components/BuyABCSheet';
import ExchangeSCSheet from '../components/ExchangeSCSheet';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { useLanguage } from '../components/LanguageContext';
import { useDev } from '../components/DevContext';
import { CATEGORY_NAME_BY_ID, CATEGORY_NAME_EN_BY_ID, TOKEN_LABELS, getProductsByCategory } from '../data/booklists';

const TOKEN_INFO = {
  A: { label: TOKEN_LABELS.A, price: 1, color: 'var(--token-a-text)', bg: 'var(--token-a-soft)', border: 'var(--token-a-border)' },
  B: { label: TOKEN_LABELS.B, price: 1,  color: 'var(--token-b-text)', bg: 'var(--token-b-soft)', border: 'var(--token-b-border)' },
  C: { label: TOKEN_LABELS.C, price: 1,  color: 'var(--token-c-text)', bg: 'var(--token-c-soft)', border: 'var(--token-c-border)' },
};

export default function P6List() {
  const { lang } = useLanguage();
  const { emptyProductList } = useDev();
  const { category } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buyOpen, setBuyOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [snack, setSnack] = useState(false);

  const products = emptyProductList ? [] : getProductsByCategory(category);
  const q = query.trim().toLowerCase();
  const visible = products
    .filter(p => filter === 'all' || p.type === filter)
    .filter(p => !q || p.title.toLowerCase().includes(q) || (p.titleEn && p.titleEn.toLowerCase().includes(q)));
  const catName  = lang === 'zh'
    ? (CATEGORY_NAME_BY_ID[category] ?? '商品列表')
    : (CATEGORY_NAME_EN_BY_ID[category] ?? 'Video Catalog');
  const filters = ['all', 'A', 'B', 'C'];

  return (
    <>
      <PageHeader title={catName} />

      <div className="px-4 pt-4 pb-8">
        {/* search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tokenHint" strokeWidth={1.8} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={lang === 'zh' ? '搜索…' : 'Search…'}
            className="w-full py-2.5 pl-9 pr-9 text-[14px] text-tokenText placeholder:text-tokenHint outline-none"
            style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-tokenHint" strokeWidth={1.8} />
            </button>
          )}
        </div>

        {/* filter chips */}
        <div className="no-scrollbar mb-4 flex flex-nowrap gap-2 overflow-x-auto">
          {filters.map(f => {
            const active = filter === f;
            const v = f === 'all' ? 'a' : f.toLowerCase();
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all"
                style={{
                  background: active ? (f === 'all' ? 'var(--color-primary)' : `var(--token-${v}-from)`) : 'var(--color-bg-card)',
                  color: active ? '#fff' : 'var(--color-text-secondary)',
                  border: active ? 'none' : '1px solid var(--color-border)',
                  boxShadow: active ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {f === 'all' ? (lang === 'zh' ? '推荐' : 'Recommended') : (lang === 'zh' ? TOKEN_INFO[f].label : { A: 'Type A', B: 'Type B', C: 'Type C' }[f])}
              </button>
            );
          })}
        </div>

        {visible.length === 0 && (
          <EmptyState
            icon={PackageSearch}
            title={lang === 'zh' ? '没有找到相关内容' : 'No results found'}
            subtitle={lang === 'zh' ? '换个关键词或筛选条件试试' : 'Try a different search or filter'}
          />
        )}
        <div className="overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', boxShadow: visible.length ? 'var(--shadow-sm)' : 'none' }}>
          {visible.map((p, i) => (
            <div key={p.id}>
              {i > 0 && <div className="mx-4 h-px" style={{ background: 'var(--color-border)' }} />}
              <ProductCard
                product={{ ...p, title: lang === 'zh' ? p.title : p.titleEn }}
                onClick={() => setSelectedProduct({ ...p, title: lang === 'zh' ? p.title : p.titleEn })}
                list
              />
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductOrderSheet
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOrdered={() => setSnack(true)}
          onOpenBuy={() => {
            setSelectedProduct(null);
            setBuyOpen(true);
          }}
          onOpenExchange={() => {
            setSelectedProduct(null);
            setExchangeOpen(true);
          }}
        />
      )}
      {buyOpen && (
        <BuyABCSheet
          onClose={() => setBuyOpen(false)}
          onOpenExchange={() => {
            setBuyOpen(false);
            setExchangeOpen(true);
          }}
        />
      )}
      {exchangeOpen && <ExchangeSCSheet onClose={() => setExchangeOpen(false)} />}
      {snack && (
        <ExchangeSubmittedSheet
          variant="success"
          actionTo="/orders"
          onClose={() => setSnack(false)}
        />
      )}
    </>
  );
}
