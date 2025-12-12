'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
 
type User = {

  fullName?: string;

  email?: string;

  sessionToken?: string;

  sessionId?: string;

};
 
type AuthContextType = {

  user: User | null;

  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  logout: () => Promise<void>;

};
 
const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
 
  useEffect(() => {

    const sessionId = localStorage.getItem('sessionId');

    if (sessionId) {

      fetch('/api/checksession', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ sessionId }),

        cache: 'no-store',

      })

        .then(res => res.json())

        .then(data => {

          if (data.fullName || data.email) {

            setUser({

              fullName: data.fullName,

              email: data.email,

              sessionId,

              sessionToken: localStorage.getItem('sessionToken') || '',

            });

          }

        })

        .catch(err => console.error('Session fetch failed:', err));

    }

  }, []);
 
  const logout = async () => {

    if (user?.email) {

      await fetch('/api/logout', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ email: user.email }),

      });

    }

    localStorage.clear();

    setUser(null);

  };
 
  return (
<AuthContext.Provider value={{ user, setUser, logout }}>

      {children}
</AuthContext.Provider>

  );

}
 
export function useAuth() {

  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error('useAuth must be used within AuthProvider');

  return ctx;

}

 
