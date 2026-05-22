import { useState } from 'react';
import { createPortal } from 'react-dom';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import P0Wallet  from './pages/P0Wallet';
import P1Exchange from './pages/P1Exchange';
import P3Lottery  from './pages/P3Lottery';
import P4Result   from './pages/P4Result';
import P5History  from './pages/P5History';
import P6Store    from './pages/P6Store';
import P6List     from './pages/P6List';
import P7Product  from './pages/P7Product';
import P8Orders   from './pages/P8Orders';
import P9Video    from './pages/P9Video';
import PProfile   from './pages/PProfile';
import PMembership from './pages/PMembership';
import { LanguageProvider } from './components/LanguageContext';
import { UserProvider } from './components/UserContext';
import { DevProvider } from './components/DevContext';
import DevPanel from './components/DevPanel';

const SHELL = 'mx-auto min-h-screen w-full max-w-[480px] overflow-x-hidden font-ui text-tokenText';

function MainLayout() {
  const [devOpen, setDevOpen] = useState(false);
  const [devVisible, setDevVisible] = useState(true);

  return (
    <div className={SHELL} style={{ background: 'var(--color-bg-page)' }}>
      <Outlet />
      <BottomNav />
      {devVisible && createPortal(
        <div
          className="fixed bottom-[92px] right-4 z-[70] flex items-center overflow-hidden"
          style={{ borderRadius: 999, background: 'rgba(13,21,39,0.55)', backdropFilter: 'blur(6px)', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
        >
          <button onClick={() => setDevOpen(true)} className="flex h-9 items-center justify-center px-3.5">
            <span className="font-num text-[11px] font-bold text-white">Dev</span>
          </button>
          <div className="w-px self-stretch" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <button onClick={() => setDevVisible(false)} className="flex h-9 w-9 items-center justify-center text-white/70" style={{ fontSize: 14 }}>×</button>
        </div>,
        document.body
      )}
      {devOpen && <DevPanel onClose={() => setDevOpen(false)} />}
    </div>
  );
}

function SubLayout() {
  return (
    <div className={SHELL} style={{ background: 'var(--color-bg-page)' }}>
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <DevProvider>
          <BrowserRouter>
            <Routes>
              {/* Pages with bottom nav */}
              <Route element={<MainLayout />}>
                <Route path="/"        element={<P0Wallet />} />
                <Route path="/ai"      element={<P6Store />} />
                <Route path="/orders"  element={<P8Orders />} />
                <Route path="/profile" element={<PProfile />} />
              </Route>

              {/* Sub-pages — no bottom nav */}
              <Route element={<SubLayout />}>
                <Route path="/exchange"              element={<P1Exchange />} />
                <Route path="/lottery"               element={<P3Lottery />} />
                <Route path="/result"                element={<P4Result />} />
                <Route path="/history"               element={<P5History />} />
                <Route path="/ai/:category"          element={<P6List />} />
                <Route path="/ai/:category/:id"      element={<P7Product />} />
                <Route path="/orders/:orderId"       element={<P9Video />} />
                <Route path="/membership"            element={<PMembership />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DevProvider>
      </UserProvider>
    </LanguageProvider>
  );
}
