import { useNavigate } from 'react-router-dom';
import { PlayCircle, Lock } from 'lucide-react';
import HeaderActions from '../components/HeaderActions';
import { useLanguage } from '../components/LanguageContext';
import { VISIBLE_CATEGORIES } from '../data/booklists';

export default function P6Store() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const categories = VISIBLE_CATEGORIES.map((category) => ({
    ...category,
    name: lang === 'zh' ? category.name : category.nameEn,
  }));

  return (
    <div className="flex flex-col min-h-[calc(100vh-58px)]">
      {/* header */}
      <header className="flex h-[68px] items-center px-4">
        <div className="w-[86px]" />
        <h1 className="flex-1 text-center text-[20px] font-semibold text-tokenText">{lang === 'zh' ? 'AI 生成' : 'AI Create'}</h1>
        <HeaderActions />
      </header>

      {/* hero */}
      <div className="enter shimmer-once mx-4 mb-5 overflow-hidden rounded-[20px] px-5 py-5" style={{ background: 'linear-gradient(135deg,#0e2a4a 0%,#0a3d62 60%,#0d6e94 100%)', boxShadow: 'var(--shadow-lg)', animationDelay: '0ms' }}>
        <div className="flex items-center gap-2 mb-2">
          <PlayCircle className="h-5 w-5 text-white/80" strokeWidth={1.8} />
          <span className="text-[13px] text-white/70 font-medium">{lang === 'zh' ? 'AI 视频生成专区' : 'AI Video Studio'}</span>
        </div>
          <p className="text-[20px] font-extrabold text-white leading-tight mb-1">{lang === 'zh' ? '选择主题·兑换视频' : 'Pick a Theme, Swap for a Video'}</p>
        <p className="text-[13px] text-white/60">{lang === 'zh' ? '使用 ASC / BSC / CSC 兑换专属视频' : 'Use ASC / BSC / CSC to swap for exclusive videos'}</p>
      </div>

      {/* categories */}
      <div className="flex-1 px-4 pb-[96px]">
        <p className="enter mb-3 text-[13px] font-semibold text-tokenSub" style={{ animationDelay: '80ms' }}>{lang === 'zh' ? '全部分类' : 'All Categories'}</p>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, idx) => {
            const cardStyle = { borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' };
            const delay = `${140 + idx * 60}ms`;
            const image = (
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={cat.image}
                  alt=""
                  className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105${cat.locked ? ' grayscale-[0.45] saturate-[0.7] opacity-80' : ''}`}
                  loading="lazy"
                />
                {cat.locked && (
                  <div className="absolute inset-0 bg-slate-200/25">
                    <div className="flex items-start justify-end p-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-600 px-2 py-1 text-[11px] font-semibold text-white shadow-sm" style={{ animation: 'pulse 2.4s ease-in-out infinite' }}>
                        <Lock className="h-3 w-3" strokeWidth={2} />
                        {lang === 'zh' ? '敬请期待' : 'Locked'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
            const body = (
              <div className="px-3 py-3">
                <p className="truncate text-[16px] font-semibold text-tokenText">{cat.name}</p>
              </div>
            );

            return cat.locked ? (
              <div
                key={cat.id}
                className="enter group relative overflow-hidden bg-tokenCard text-left"
                style={{ ...cardStyle, opacity: 0.72, animationDelay: delay }}
                aria-disabled="true"
              >
                {image}
                {body}
              </div>
            ) : (
              <button
                key={cat.id}
                onClick={() => navigate(`/ai/${cat.id}`)}
                className="enter group overflow-hidden bg-tokenCard text-left transition-transform duration-150 active:scale-[0.97]"
                style={{ ...cardStyle, animationDelay: delay }}
              >
                {image}
                {body}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
