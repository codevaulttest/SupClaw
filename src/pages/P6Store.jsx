import { useNavigate } from 'react-router-dom';
import { ChevronRight, PlayCircle } from 'lucide-react';
import HeaderActions from '../components/HeaderActions';

const CATEGORIES = [
  { id: 'classics',   name: '国学经典',   desc: 'BOOKLIST 001–020 · 20 部作品', image: '/assets/booklist-classics.png' },
  { id: 'business',   name: '商业经典',   desc: 'BOOKLIST 021–040 · 20 部作品', image: '/assets/booklist-business.png' },
  { id: 'humanities', name: '人文地理',   desc: 'BOOKLIST 041–060 · 20 部作品', image: '/assets/booklist-humanities.png' },
  { id: 'science',    name: '科技未来',   desc: 'BOOKLIST 061–080 · 20 部作品', image: '/assets/booklist-science.png' },
  { id: 'lifestyle',  name: '生活美学',   desc: 'BOOKLIST 081–100 · 20 部作品', image: '/assets/booklist-lifestyle.png' },
];

export default function P6Store() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[calc(100vh-58px)]">
      {/* header */}
      <header className="flex h-[68px] items-center px-4">
        <div className="w-[86px]" />
        <h1 className="flex-1 text-center text-[20px] font-semibold text-tokenText">AI 生成</h1>
        <HeaderActions />
      </header>

      {/* hero */}
      <div className="mx-4 mb-5 overflow-hidden rounded-[20px] px-5 py-5" style={{ background: 'linear-gradient(135deg,#0e2a4a 0%,#0a3d62 60%,#0d6e94 100%)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="flex items-center gap-2 mb-2">
          <PlayCircle className="h-5 w-5 text-white/80" strokeWidth={1.8} />
          <span className="text-[13px] text-white/70 font-medium">AI 视频生成专区</span>
        </div>
        <p className="text-[20px] font-extrabold text-white leading-tight mb-1">选择主题·兑换视频</p>
        <p className="text-[13px] text-white/60">使用 ASC / BSC / CSC 兑换专属视频</p>
      </div>

      {/* categories */}
      <div className="flex-1 px-4 pb-[74px]">
        <p className="mb-3 text-[13px] font-semibold text-tokenSub">全部分类</p>
        <div className="flex flex-col gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate(`/ai/${cat.id}`)}
              className="relative overflow-hidden flex items-center gap-4 text-left"
              style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}
            >
              <img
                src={cat.image}
                alt=""
                className="h-[80px] w-[90px] shrink-0 object-cover"
                loading="lazy"
              />
              <div className="flex-1 py-4 pr-4">
                <p className="text-[16px] font-semibold text-tokenText">{cat.name}</p>
                <p className="mt-0.5 text-[12px] text-tokenHint">{cat.desc}</p>
                <div className="mt-2 flex gap-1">
                  {['A','B','C'].map(k => (
                    <span key={k} className="rounded px-1.5 py-0.5 font-num text-[10px] font-bold text-white"
                      style={{ background: `var(--token-${k.toLowerCase()}-from)` }}>{k}</span>
                  ))}
                </div>
              </div>
              <ChevronRight className="mr-4 h-5 w-5 text-tokenHint shrink-0" strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
