import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getProfileService, type UsuarioResponse } from '../services/auth.service';

interface AuthContextType {
  token: string | null;
  user: UsuarioResponse | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadToken(): string | null {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

function saveToken(token: string | null) {
  try {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(loadToken);
  const [user, setUser] = useState<UsuarioResponse | null>(null);

  useEffect(() => {
    if (!token) return;
    getProfileService(token)
      .then(setUser)
      .catch(() => {
        setToken(null);
        setUser(null);
        saveToken(null);
      });
  }, [token]);

  const login = (newToken: string) => {
    saveToken(newToken);
    setToken(newToken);
  };

  const logout = () => {
    saveToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
