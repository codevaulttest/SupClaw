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
import { LanguageProvider } from './components/LanguageContext';
import { UserProvider } from './components/UserContext';
import PMembership from './pages/PMembership';

const SHELL = 'mx-auto min-h-screen w-full max-w-[480px] overflow-x-hidden font-ui text-tokenText';

function MainLayout() {
  return (
    <div className={SHELL} style={{ background: 'var(--color-bg-page)' }}>
      <Outlet />
      <BottomNav />
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
      </UserProvider>
    </LanguageProvider>
  );
}
