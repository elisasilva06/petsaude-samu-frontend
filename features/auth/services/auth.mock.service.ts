import type {
    LoginInput,
    Sessao,
} from '../types';

import type { AuthService } from './auth.service';

export const authMockService: AuthService = {
  async login(
    dados: LoginInput
  ): Promise<Sessao> {
    if (
      !dados.email.trim() ||
      !dados.senha.trim()
    ) {
      throw new Error(
        'E-mail e senha são obrigatórios.'
      );
    }

    // Simula o tempo de resposta da API.
    await new Promise((resolve) =>
      setTimeout(resolve, 600)
    );

    return {
      usuario: {
        id: '1',
        nome: 'Profissional SAMU',
        email: dados.email,
      },
    };
  },

  async logout(): Promise<void> {
    await Promise.resolve();
  },
};