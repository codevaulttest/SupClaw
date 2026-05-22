import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UserContext = createContext(null);

const MOCK_EXPIRY = '2027-01-15';

export function UserProvider({ children }) {
  const [isMember, setIsMember] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('supclaw-user-member') ?? 'false');
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('supclaw-user-member', JSON.stringify(isMember));
  }, [isMember]);

  const value = useMemo(() => ({
    isMember,
    memberExpiry: MOCK_EXPIRY,
    toggleMembership: () => setIsMember(v => !v),
  }), [isMember]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
