import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UserContext = createContext(null);

const BASE_EXPIRY = '2027-01-15';
const DEFAULT_CODE_COUNT = 2;

function addOneYear(dateStr) {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

export function UserProvider({ children }) {
  const [isMember, setIsMember] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('supclaw-user-member') ?? 'false');
    } catch {
      return false;
    }
  });
  const [memberExpiry, setMemberExpiry] = useState(BASE_EXPIRY);
  const [ownedCodeCount, setOwnedCodeCount] = useState(DEFAULT_CODE_COUNT);

  useEffect(() => {
    localStorage.setItem('supclaw-user-member', JSON.stringify(isMember));
  }, [isMember]);

  const value = useMemo(() => ({
    isMember,
    memberExpiry,
    ownedCodeCount,
    toggleMembership: () => setIsMember(v => !v),
    activateMembership: () => {
      const base = isMember ? memberExpiry : new Date().toISOString().slice(0, 10);
      const newExpiry = addOneYear(base);
      setMemberExpiry(newExpiry);
      setIsMember(true);
      return newExpiry;
    },
    useOwnedCode: () => setOwnedCodeCount(n => Math.max(0, n - 1)),
    transferCodes: (count) => setOwnedCodeCount(n => Math.max(0, n - count)),
    resetForDemo: (memberState, codesCount) => {
      setIsMember(memberState);
      setMemberExpiry(BASE_EXPIRY);
      setOwnedCodeCount(codesCount);
    },
  }), [isMember, memberExpiry, ownedCodeCount]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
