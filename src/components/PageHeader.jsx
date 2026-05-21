import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeaderActions from './HeaderActions';

export default function PageHeader({ title, onBack, right }) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <header className="flex h-[56px] items-center px-4 bg-tokenCard border-b border-tokenBorderSubtle">
      <button
        onClick={handleBack}
        className="flex h-9 w-9 items-center justify-center -ml-1 rounded-full shrink-0"
      >
        <ChevronLeft className="h-6 w-6 text-tokenText" strokeWidth={2.2} />
      </button>
      <h1 className="flex-1 text-center text-[18px] font-semibold text-tokenText">{title}</h1>
      <div className="shrink-0">
        {right !== undefined ? right : <HeaderActions />}
      </div>
    </header>
  );
}
