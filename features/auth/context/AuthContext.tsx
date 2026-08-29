import {
    createContext,
    ReactNode,
    useContext,
    useState,
} from 'react';

import { authService } from '../services';

import type {
    LoginInput,
    Sessao,
    UsuarioAutenticado,
} from '../types';

type AuthContextData = {
  usuario: UsuarioAutenticado | null;
  sessao: Sessao | null;
  autenticado: boolean;
  autenticando: boolean;

  login(
    dados: LoginInput
  ): Promise<void>;

  logout(): Promise<void>;
};

const AuthContext =
  createContext<AuthContextData | undefined>(
    undefined
  );

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [
    sessao,
    setSessao,
  ] = useState<Sessao | null>(
    null
  );

  const [
    autenticando,
    setAutenticando,
  ] = useState(false);

  async function login(
    dados: LoginInput
  ) {
    try {
      setAutenticando(true);

      const novaSessao =
        await authService.login(
          dados
        );

      setSessao(novaSessao);
    } finally {
      setAutenticando(false);
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      setSessao(null);
    }
  }

  const usuario =
    sessao?.usuario ?? null;

  const autenticado =
    sessao !== null;

  return (
    <AuthContext.Provider
      value={{
        usuario,
        sessao,
        autenticado,
        autenticando,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth deve ser usado dentro de AuthProvider.'
    );
  }

  return context;
}