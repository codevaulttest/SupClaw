import { createContext, useContext, useState, useMemo } from 'react';

const DevContext = createContext(null);

export function DevProvider({ children }) {
  const [subsidyTrigger, setSubsidyTrigger] = useState(null);
  const [devScvInvalid, setDevScvInvalid] = useState(false);

  const value = useMemo(() => ({
    subsidyTrigger,
    setSubsidyTrigger,
    devScvInvalid,
    toggleDevScvInvalid: () => setDevScvInvalid(v => !v),
  }), [subsidyTrigger, devScvInvalid]);

  return <DevContext.Provider value={value}>{children}</DevContext.Provider>;
}

export function useDev() {
  const ctx = useContext(DevContext);
  if (!ctx) throw new Error('useDev must be used within DevProvider');
  return ctx;
}
