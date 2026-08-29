import {
  criarChamadoMock,
} from '../mocks';

import type {
  ChamadoDetalhado,
  ChamadoResumo,
  PainelChamados,
} from '../types';

import type {
  ChamadosService,
} from './chamados.service';

/**
 * Estado temporário das ocorrências.
 *
 * Diferentemente de um mock puramente visual,
 * este mock possui estado e permite testar:
 *
 * - fila;
 * - prioridade;
 * - aceite;
 * - chamado ativo;
 * - finalização;
 * - histórico.
 *
 * TODO(BACKEND):
 * Quando a API estiver pronta, todo este estado
 * será controlado pelo backend.
 */
let chamados: ChamadoResumo[] = [
  {
    id: '1',

    paciente: 'Maria das Dores',

    bairro: 'Ponte',

    classificacao: 'Emergência',

    gravidade: 'emergencia',

    queixa:
      'Parada Cardiorrespiratória',

    prioridade: 1,

    status: 'aguardando',

    recebidoEm:
      '2026-08-28T14:20:00',
  },

  {
    id: '2',

    paciente: 'João Pereira',

    bairro: 'Centro',

    classificacao: 'Urgente',

    gravidade: 'urgente',

    queixa:
      'Crise Hipertensiva',

    prioridade: 2,

    status: 'aguardando',

    recebidoEm:
      '2026-08-28T14:35:00',
  },

  {
    id: '3',

    paciente: 'Ana Martins',

    bairro: 'Tresidela',

    classificacao: 'Urgente',

    gravidade: 'urgente',

    queixa:
      'Dor torácica',

    prioridade: 2,

    status: 'aguardando',

    recebidoEm:
      '2026-08-28T14:42:00',
  },
];

/**
 * Retorna uma cópia de um chamado.
 *
 * Evita que componentes alterem o estado
 * interno do mock diretamente.
 */
function copiarChamado(
  chamado: ChamadoResumo
): ChamadoResumo {
  return {
    ...chamado,
  };
}

/**
 * Junta os dados detalhados do mock
 * com o estado operacional atual.
 *
 * Exemplo:
 *
 * criarChamadoMock()
 * → telefone
 * → endereço
 * → hospital
 * → idade
 *
 * ChamadoResumo
 * → status
 * → prioridade
 * → iniciadoEm
 * → finalizadoEm
 */
function montarChamadoDetalhado(
  resumo: ChamadoResumo
): ChamadoDetalhado {
  const dadosCompletos =
    criarChamadoMock(
      resumo.id
    );

  return {
    ...dadosCompletos,

    ...copiarChamado(
      resumo
    ),
  };
}

/**
 * Ordena a fila pela prioridade.
 *
 * Critérios temporários:
 *
 * 1. prioridade;
 * 2. horário de chegada.
 *
 * TODO(BACKEND):
 * Preferencialmente a ordem final deverá
 * ser definida pelo backend.
 */
function ordenarFila(
  fila: ChamadoResumo[]
) {
  return [...fila].sort(
    (a, b) => {
      if (
        a.prioridade !==
        b.prioridade
      ) {
        return (
          a.prioridade -
          b.prioridade
        );
      }

      return (
        new Date(
          a.recebidoEm
        ).getTime() -
        new Date(
          b.recebidoEm
        ).getTime()
      );
    }
  );
}

/**
 * Constrói o painel operacional atual.
 *
 * O painel contém:
 *
 * - um atendimento ativo;
 * - ocorrências aguardando.
 *
 * Ocorrências finalizadas não aparecem
 * mais na Home.
 */
function montarPainel():
  PainelChamados {
  const ativo =
    chamados.find(
      (chamado) =>
        chamado.status ===
        'em_atendimento'
    ) ?? null;

  const fila =
    ordenarFila(
      chamados.filter(
        (chamado) =>
          chamado.status ===
          'aguardando'
      )
    );

  return {
    ativo:
      ativo
        ? copiarChamado(ativo)
        : null,

    fila:
      fila.map(
        copiarChamado
      ),
  };
}

/**
 * Simula a latência da futura API.
 */
async function simularLatencia(
  tempo = 400
) {
  await new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        tempo
      )
  );
}

export const chamadosMockService:
  ChamadosService = {
  /**
   * Retorna o painel operacional atual.
   */
  async buscarPainel() {
    await simularLatencia();

    return montarPainel();
  },

  /**
   * Retorna os dados completos de
   * uma ocorrência.
   */
  async buscarChamado(
    id: string
  ) {
    await simularLatencia();

    const resumo =
      chamados.find(
        (chamado) =>
          chamado.id === id
      );

    if (!resumo) {
      throw new Error(
        'Ocorrência não encontrada.'
      );
    }

    return montarChamadoDetalhado(
      resumo
    );
  },

  /**
   * Retorna todas as ocorrências
   * que já foram finalizadas.
   *
   * Hoje este método alimenta
   * o Histórico.
   *
   * TODO(BACKEND):
   * O histórico provavelmente terá
   * endpoint próprio no servidor.
   */
  async listarFinalizados() {
    await simularLatencia();

    return chamados
      .filter(
        (chamado) =>
          chamado.status ===
          'finalizado'
      )
      .map(
        montarChamadoDetalhado
      )
      .sort(
        (a, b) => {
          const dataA =
            new Date(
              a.finalizadoEm ??
                a.recebidoEm
            ).getTime();

          const dataB =
            new Date(
              b.finalizadoEm ??
                b.recebidoEm
            ).getTime();

          /**
           * Mais recente primeiro.
           */
          return dataB - dataA;
        }
      );
  },

  /**
   * Move uma ocorrência aguardando
   * para atendimento ativo.
   */
  async aceitarChamado(
    id: string
  ) {
    await simularLatencia();

    const chamadoAtivo =
      chamados.find(
        (chamado) =>
          chamado.status ===
          'em_atendimento'
      );

    /**
     * Regra temporária:
     *
     * um profissional só pode possuir
     * um atendimento ativo por vez.
     *
     * TODO(BACKEND):
     * A regra definitiva deverá ser
     * validada pelo servidor.
     */
    if (chamadoAtivo) {
      throw new Error(
        'Já existe um atendimento em andamento.'
      );
    }

    const indice =
      chamados.findIndex(
        (chamado) =>
          chamado.id === id
      );

    if (indice === -1) {
      throw new Error(
        'Ocorrência não encontrada.'
      );
    }

    const chamado =
      chamados[indice];

    if (
      chamado.status !==
      'aguardando'
    ) {
      throw new Error(
        'Esta ocorrência não está disponível para atendimento.'
      );
    }

    chamados[indice] = {
      ...chamado,

      status:
        'em_atendimento',

      iniciadoEm:
        new Date().toISOString(),
    };

    return montarPainel();
  },

  /**
   * Finaliza o atendimento ativo.
   *
   * Depois desta operação:
   *
   * - ele deixa de aparecer como ativo;
   * - deixa de aparecer na fila;
   * - continua armazenado com status finalizado;
   * - pode ser recuperado pelo Histórico.
   */
  async finalizarChamado(
    id: string
  ) {
    await simularLatencia();

    const indice =
      chamados.findIndex(
        (chamado) =>
          chamado.id === id
      );

    if (indice === -1) {
      throw new Error(
        'Ocorrência não encontrada.'
      );
    }

    const chamado =
      chamados[indice];

    if (
      chamado.status !==
      'em_atendimento'
    ) {
      throw new Error(
        'Esta ocorrência não está em atendimento.'
      );
    }

    chamados[indice] = {
      ...chamado,

      status:
        'finalizado',

      finalizadoEm:
        new Date().toISOString(),
    };

    return montarPainel();
  },
};