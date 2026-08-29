import {
  perfilProfissionalMock,
} from '../mocks';

import type {
  AtualizarPerfilInput,
  PerfilProfissional,
} from '../types';

import type {
  PerfilService,
} from './perfil.service';

/**
 * Estado temporário do perfil enquanto o backend
 * ainda não está integrado.
 *
 * Fazemos cópias dos arrays e objetos internos
 * para evitar alterações acidentais por referência.
 */
let perfilAtual: PerfilProfissional = {
  ...perfilProfissionalMock,

  areasAtuacao: [
    ...perfilProfissionalMock.areasAtuacao,
  ],

  plantao: {
    ...perfilProfissionalMock.plantao,
  },
};

/**
 * Implementação temporária das operações de perfil.
 *
 * TODO(BACKEND):
 * Substituir por perfilApiService quando os endpoints
 * reais de perfil estiverem disponíveis.
 */
export const perfilMockService: PerfilService = {
  /**
   * Retorna o perfil atual do profissional.
   */
  async buscarPerfil() {
    // Simula o tempo de resposta da futura API.
    await new Promise((resolve) =>
      setTimeout(resolve, 300)
    );

    return {
      ...perfilAtual,

      areasAtuacao: [
        ...perfilAtual.areasAtuacao,
      ],

      plantao: {
        ...perfilAtual.plantao,
      },
    };
  },

  /**
   * Atualiza somente os campos editáveis
   * definidos por AtualizarPerfilInput.
   */
  async atualizarPerfil(
    dados: AtualizarPerfilInput
  ) {
    // Simula o tempo de resposta da futura API.
    await new Promise((resolve) =>
      setTimeout(resolve, 400)
    );

    perfilAtual = {
      ...perfilAtual,
      ...dados,

      areasAtuacao: [
        ...dados.areasAtuacao,
      ],
    };

    return {
      ...perfilAtual,

      areasAtuacao: [
        ...perfilAtual.areasAtuacao,
      ],

      plantao: {
        ...perfilAtual.plantao,
      },
    };
  },
};