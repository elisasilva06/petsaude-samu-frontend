import type {
  AlterarSenhaInput,
  RedefinirSenhaInput,
  SolicitarRecuperacaoSenhaInput,
} from '../types';

import type { SenhaService } from './senha.service';

/**
 * Implementação temporária das operações de senha.
 *
 * TODO(BACKEND):
 * Substituir por senhaApiService quando os endpoints
 * de autenticação estiverem disponíveis.
 */
export const senhaMockService: SenhaService = {
  async alterarSenha(
    dados: AlterarSenhaInput
  ) {
    if (
      !dados.senhaAtual ||
      !dados.novaSenha
    ) {
      throw new Error(
        'Dados de senha inválidos.'
      );
    }

    await Promise.resolve();
  },

  async solicitarRecuperacao(
    dados: SolicitarRecuperacaoSenhaInput
  ) {
    if (!dados.email.trim()) {
      throw new Error(
        'E-mail não informado.'
      );
    }

    // Simula apenas a latência da futura API.
    await new Promise((resolve) =>
      setTimeout(resolve, 600)
    );
  },

  async redefinirSenha(
    dados: RedefinirSenhaInput
  ) {
    if (
      !dados.credencialRecuperacao.trim() ||
      !dados.novaSenha
    ) {
      throw new Error(
        'Dados de recuperação inválidos.'
      );
    }

    // Simula apenas a latência da futura API.
    await new Promise((resolve) =>
      setTimeout(resolve, 600)
    );
  },
};