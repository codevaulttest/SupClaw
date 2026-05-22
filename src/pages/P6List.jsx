import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ProductOrderSheet from '../components/ProductOrderSheet';
import BuyABCSheet from '../components/BuyABCSheet';
import ExchangeSCSheet from '../components/ExchangeSCSheet';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../components/LanguageContext';
import { CATEGORY_NAME_BY_ID, CATEGORY_NAME_EN_BY_ID, TOKEN_LABELS, getProductsByCategory } from '../data/booklists';

const TOKEN_INFO = {
  A: { label: TOKEN_LABELS.A, price: 1, color: 'var(--token-a-text)', bg: 'var(--token-a-soft)', border: 'var(--token-a-border)' },
  B: { label: TOKEN_LABELS.B, price: 1,  color: 'var(--token-b-text)', bg: 'var(--token-b-soft)', border: 'var(--token-b-border)' },
  C: { label: TOKEN_LABELS.C, price: 1,  color: 'var(--token-c-text)', bg: 'var(--token-c-soft)', border: 'var(--token-c-border)' },
};

export default function P6List() {
  const { lang } = useLanguage();
  const { category } = useParams();
  const [filter, setFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buyOpen, setBuyOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);

  const products = getProductsByCategory(category);
  const visible  = filter === 'all' ? products : products.filter(p => p.type === filter);
  const catName  = lang === 'zh'
    ? (CATEGORY_NAME_BY_ID[category] ?? '商品列表')
    : (CATEGORY_NAME_EN_BY_ID[category] ?? 'Video Catalog');
  const filters = ['all', 'A', 'B', 'C'];

  return (
    <>
      <PageHeader title={catName} />

      <div className="px-4 pt-4 pb-8">
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
                {f === 'all' ? (lang === 'zh' ? '推荐' : 'Recommended') : `${f} · ${lang === 'zh' ? TOKEN_INFO[f].label : { A: 'Brand Custom', B: 'Creative Copy', C: 'Surprise Drop' }[f]}`}
              </button>
            );
          })}
        </div>

        <div className="overflow-hidden" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
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
    </>
  );
}
