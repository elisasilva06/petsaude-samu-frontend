import type {
  AlterarSenhaInput,
  RedefinirSenhaInput,
  SolicitarRecuperacaoSenhaInput,
} from '../types';

/**
 * Contrato das operações relacionadas à senha.
 *
 * A interface é compartilhada entre:
 *
 * - senhaMockService durante o desenvolvimento;
 * - senhaApiService quando o backend estiver disponível.
 */
export interface SenhaService {
  /**
   * Altera a senha de um usuário já autenticado.
   */
  alterarSenha(
    dados: AlterarSenhaInput
  ): Promise<void>;

  /**
   * Inicia o processo de recuperação de senha.
   */
  solicitarRecuperacao(
    dados: SolicitarRecuperacaoSenhaInput
  ): Promise<void>;

  /**
   * Conclui a recuperação utilizando uma credencial
   * previamente validada pelo fluxo de recuperação.
   */
  redefinirSenha(
    dados: RedefinirSenhaInput
  ): Promise<void>;
}