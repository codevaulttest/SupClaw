import { createContext, useContext, useState, useMemo } from 'react';

const DevContext = createContext(null);

export function DevProvider({ children }) {
  const [subsidyTrigger, setSubsidyTrigger] = useState(null);
  const [devScvInvalid, setDevScvInvalid] = useState(false);
  const [emptyOrders, setEmptyOrders] = useState(false);
  const [emptyHistory, setEmptyHistory] = useState(false);
  const [emptyProductList, setEmptyProductList] = useState(false);

  const value = useMemo(() => ({
    subsidyTrigger,
    setSubsidyTrigger,
    devScvInvalid,
    toggleDevScvInvalid: () => setDevScvInvalid(v => !v),
    emptyOrders,
    toggleEmptyOrders: () => setEmptyOrders(v => !v),
    emptyHistory,
    toggleEmptyHistory: () => setEmptyHistory(v => !v),
    emptyProductList,
    toggleEmptyProductList: () => setEmptyProductList(v => !v),
  }), [subsidyTrigger, devScvInvalid, emptyOrders, emptyHistory, emptyProductList]);

  return <DevContext.Provider value={value}>{children}</DevContext.Provider>;
}

export function useDev() {
  const ctx = useContext(DevContext);
  if (!ctx) throw new Error('useDev must be used within DevProvider');
  return ctx;
}
