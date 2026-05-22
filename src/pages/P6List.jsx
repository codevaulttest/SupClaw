import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ProductOrderSheet from '../components/ProductOrderSheet';
import BuyABCSheet from '../components/BuyABCSheet';
import ExchangeSCSheet from '../components/ExchangeSCSheet';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../components/LanguageContext';

const CATEGORY_NAMES = {
  classics:   '国学经典',
  business:   '商业经典',
  humanities: '人文地理',
  science:    '科技未来',
  lifestyle:  '生活美学',
};

const TOKEN_INFO = {
  A: { label: '品牌定制版', price: 1, color: 'var(--token-a-text)', bg: 'var(--token-a-soft)', border: 'var(--token-a-border)' },
  B: { label: '创意文案版', price: 1,  color: 'var(--token-b-text)', bg: 'var(--token-b-soft)', border: 'var(--token-b-border)' },
  C: { label: '极速盲盒版', price: 1,  color: 'var(--token-c-text)', bg: 'var(--token-c-soft)', border: 'var(--token-c-border)' },
};

// 每个分类 mock 10 个商品
function genProducts(catId) {
  const zhBases = {
    classics:   ['论语·仁义篇','道德经·自然观','孙子兵法·谋略','庄子·逍遥游','诗经·关雎','易经·卦辞','史记·本纪','唐诗三百首','宋词精选','四书五经'],
    business:   ['彼得原理','穷查理宝典','从0到1','好战略坏战略','第五项修炼','蓝海战略','创新者的窘境','竞争战略','定位','长尾理论'],
    humanities: ['丝绸之路','人类简史','枪炮病菌与钢铁','世界通史','地理大发现','文明的冲突','全球通史','人口论','地缘政治','海权论'],
    science:    ['奇点临近','未来简史','人工智能','量子力学','时间简史','宇宙的结构','基因组','纳米技术','脑科学','物理学史'],
    lifestyle:  ['断舍离','瓦尔登湖','小王子','慢生活','正念','美学散步','生活美学','侘寂','四季之美','花道茶道'],
  };
  const enBases = {
    classics: ['Analects','Tao Te Ching','The Art of War','Zhuangzi','Book of Songs','I Ching','Records of the Grand Historian','Tang Poems','Selected Song Lyrics','Four Books and Five Classics'],
    business: ['The Peter Principle','Poor Charlie\'s Almanack','Zero to One','Good Strategy Bad Strategy','The Fifth Discipline','Blue Ocean Strategy','The Innovator\'s Dilemma','Competitive Strategy','Positioning','The Long Tail'],
    humanities: ['Silk Road','Sapiens','Guns, Germs, and Steel','World History','Age of Discovery','The Clash of Civilizations','A Global History','Essay on Population','Geopolitics','The Influence of Sea Power'],
    science: ['The Singularity Is Near','Homo Deus','Artificial Intelligence','Quantum Mechanics','A Brief History of Time','The Fabric of the Cosmos','Genome','Nanotechnology','Brain Science','History of Physics'],
    lifestyle: ['The Life-Changing Magic of Tidying Up','Walden','The Little Prince','Slow Living','Mindfulness','Aesthetic Walks','The Aesthetics of Life','Wabi-Sabi','Beauty Through the Seasons','Ikebana and Tea Ceremony'],
  };
  const types = ['A','B','C','C','B','A','B','C','A','B'];
  return (zhBases[catId] || zhBases.classics).map((title, i) => ({
    id: `${catId}-${i}`,
    title,
    titleEn: (enBases[catId] || enBases.classics)[i],
    type: types[i],
    price: TOKEN_INFO[types[i]].price,
    duration: 10,
  }));
}

const FILTERS = ['全部', 'A', 'B', 'C'];

export default function P6List() {
  const { lang } = useLanguage();
  const { category } = useParams();
  const [filter, setFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buyOpen, setBuyOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);

  const products = genProducts(category);
  const visible  = filter === 'all' ? products : products.filter(p => p.type === filter);
  const catName  = lang === 'zh'
    ? (CATEGORY_NAMES[category] ?? '商品列表')
    : ({
      classics: 'Traditional Classics',
      business: 'Business Classics',
      humanities: 'Humanities & Geography',
      science: 'Future Tech',
      lifestyle: 'Lifestyle Aesthetics',
    }[category] ?? 'Video Catalog');
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
                {f === 'all' ? (lang === 'zh' ? '全部' : 'All') : `${f} · ${lang === 'zh' ? TOKEN_INFO[f].label : { A: 'Brand Custom', B: 'Creative Copy', C: 'Surprise Drop' }[f]}`}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {visible.map(p => (
            <ProductCard key={p.id} product={{ ...p, title: lang === 'zh' ? p.title : p.titleEn }} onClick={() => setSelectedProduct({ ...p, title: lang === 'zh' ? p.title : p.titleEn })} />
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
