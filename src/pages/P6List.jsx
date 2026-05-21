import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const CATEGORY_NAMES = {
  classics:   '国学经典',
  business:   '商业经典',
  humanities: '人文地理',
  science:    '科技未来',
  lifestyle:  '生活美学',
};

const TOKEN_INFO = {
  A: { label: '品牌定制版', price: 10, color: 'var(--token-a-text)', bg: 'var(--token-a-soft)', border: 'var(--token-a-border)' },
  B: { label: '创意文案版', price: 6,  color: 'var(--token-b-text)', bg: 'var(--token-b-soft)', border: 'var(--token-b-border)' },
  C: { label: '极速盲盒版', price: 2,  color: 'var(--token-c-text)', bg: 'var(--token-c-soft)', border: 'var(--token-c-border)' },
};

// 每个分类 mock 10 个商品
function genProducts(catId) {
  const bases = {
    classics:   ['论语·仁义篇','道德经·自然观','孙子兵法·谋略','庄子·逍遥游','诗经·关雎','易经·卦辞','史记·本纪','唐诗三百首','宋词精选','四书五经'],
    business:   ['彼得原理','穷查理宝典','从0到1','好战略坏战略','第五项修炼','蓝海战略','创新者的窘境','竞争战略','定位','长尾理论'],
    humanities: ['丝绸之路','人类简史','枪炮病菌与钢铁','世界通史','地理大发现','文明的冲突','全球通史','人口论','地缘政治','海权论'],
    science:    ['奇点临近','未来简史','人工智能','量子力学','时间简史','宇宙的结构','基因组','纳米技术','脑科学','物理学史'],
    lifestyle:  ['断舍离','瓦尔登湖','小王子','慢生活','正念','美学散步','生活美学','侘寂','四季之美','花道茶道'],
  };
  const types = ['A','B','C','C','B','A','B','C','A','B'];
  return (bases[catId] || bases.classics).map((title, i) => ({
    id: `${catId}-${i}`,
    title,
    type: types[i],
    price: TOKEN_INFO[types[i]].price,
    duration: 10,
  }));
}

const FILTERS = ['全部', 'A', 'B', 'C'];

export default function P6List() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('全部');

  const products = genProducts(category);
  const visible  = filter === '全部' ? products : products.filter(p => p.type === filter);
  const catName  = CATEGORY_NAMES[category] ?? '商品列表';

  return (
    <>
      <PageHeader title={catName} />

      <div className="px-4 pt-4 pb-8">
        {/* filter chips */}
        <div className="mb-4 flex gap-2">
          {FILTERS.map(f => {
            const active = filter === f;
            const v = f.toLowerCase();
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all"
                style={{
                  background: active ? (f === '全部' ? 'var(--color-primary)' : `var(--token-${v}-from)`) : 'var(--color-bg-card)',
                  color: active ? '#fff' : 'var(--color-text-secondary)',
                  border: active ? 'none' : '1px solid var(--color-border)',
                  boxShadow: active ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {f === '全部' ? '全部' : `${f} · ${TOKEN_INFO[f].label}`}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {visible.map(p => {
            const info = TOKEN_INFO[p.type];
            const v = p.type.toLowerCase();
            return (
              <button
                key={p.id}
                onClick={() => navigate(`/ai/${category}/${p.id}`)}
                className="overflow-hidden text-left"
                style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-sm)' }}
              >
                {/* thumbnail */}
                <div
                  className="relative h-[80px] flex items-end px-3 pb-2"
                  style={{ background: `linear-gradient(135deg, var(--token-${v}-from), var(--token-${v}-to))` }}
                >
                  <span className="absolute top-2 left-2 rounded px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.3)' }}>{p.type}</span>
                  <span className="text-[10px] text-white/80">{p.duration}s / 个</span>
                </div>
                {/* info */}
                <div className="px-3 py-2.5">
                  <p className="truncate text-[13px] font-semibold text-tokenText mb-1">{p.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium" style={{ color: info.color }}>{info.label}</span>
                    <span className="font-num text-[13px] font-bold" style={{ color: `var(--token-${v}-text)` }}>{p.price}亿</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
