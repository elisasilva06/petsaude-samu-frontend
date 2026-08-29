import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import type {
  ReactNode,
} from 'react';

import {
  perfilService,
} from '../services';

import type {
  AtualizarPerfilInput,
  PerfilProfissional,
} from '../types';

type PerfilContextData = {
  /**
   * Perfil profissional atualmente carregado.
   *
   * Enquanto nenhum perfil foi carregado,
   * o valor permanece null.
   */
  perfil: PerfilProfissional | null;

  /**
   * Indica se o perfil está sendo buscado.
   *
   * Pode ser utilizado pela Home, Perfil e
   * outras telas para exibir loading.
   */
  carregandoPerfil: boolean;

  /**
   * Mensagem de erro ao buscar o perfil.
   *
   * null significa que não existe erro atual.
   */
  erroPerfil: string | null;

  /**
   * Atualiza os dados do perfil através
   * da camada de service.
   */
  atualizarPerfil(
    dados: AtualizarPerfilInput
  ): Promise<void>;

  /**
   * Busca novamente o perfil.
   *
   * Será útil futuramente após atualizações
   * ou quando alguma tela precisar sincronizar
   * os dados com o backend.
   */
  recarregarPerfil(): Promise<void>;
};

const PerfilContext =
  createContext<
    PerfilContextData | undefined
  >(undefined);

type PerfilProviderProps = {
  children: ReactNode;
};

/**
 * Provider responsável pelo estado compartilhado
 * do perfil profissional.
 *
 * Fluxo atual:
 *
 * Tela
 *   ↓
 * PerfilContext
 *   ↓
 * perfilService
 *   ↓
 * perfilMockService
 *
 * Fluxo futuro:
 *
 * Tela
 *   ↓
 * PerfilContext
 *   ↓
 * perfilService
 *   ↓
 * perfilApiService
 *   ↓
 * API
 *
 * Nenhuma tela deve acessar diretamente
 * mocks ou endpoints relacionados ao perfil.
 */
export function PerfilProvider({
  children,
}: PerfilProviderProps) {
  const [
    perfil,
    setPerfil,
  ] =
    useState<PerfilProfissional | null>(
      null
    );

  const [
    carregandoPerfil,
    setCarregandoPerfil,
  ] =
    useState(true);

  const [
    erroPerfil,
    setErroPerfil,
  ] =
    useState<string | null>(null);

  /**
   * Busca os dados atuais do profissional.
   */
  const recarregarPerfil =
    useCallback(async () => {
      try {
        setCarregandoPerfil(true);
        setErroPerfil(null);

        const dados =
          await perfilService.buscarPerfil();

        setPerfil(dados);
      } catch (error) {
        console.error(
          'Erro ao carregar perfil:',
          error
        );

        setPerfil(null);

        setErroPerfil(
          'Não foi possível carregar os dados do perfil.'
        );
      } finally {
        setCarregandoPerfil(false);
      }
    }, []);

  /**
   * Atualiza os dados através do service e,
   * após o sucesso, sincroniza o estado global.
   */
  async function atualizarPerfil(
    dados: AtualizarPerfilInput
  ) {
    const perfilAtualizado =
      await perfilService.atualizarPerfil(
        dados
      );

    setPerfil(perfilAtualizado);
  }

  /**
   * Carrega o perfil quando o provider é montado.
   */
  useEffect(() => {
    void recarregarPerfil();
  }, [recarregarPerfil]);

  return (
    <PerfilContext.Provider
      value={{
        perfil,
        carregandoPerfil,
        erroPerfil,
        atualizarPerfil,
        recarregarPerfil,
      }}
    >
      {children}
    </PerfilContext.Provider>
  );
}

/**
 * Hook de acesso ao estado global do perfil.
 */
export function usePerfil() {
  const context =
    useContext(PerfilContext);

  if (!context) {
    throw new Error(
      'usePerfil deve ser usado dentro de PerfilProvider.'
    );
  }

  return context;
}