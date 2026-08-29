import {
    chamadosService,
} from '@/features/chamados/services';

import type {
    ChamadoDetalhado,
} from '@/features/chamados/types';

import {
    historicoMock,
} from '../mocks';

import type {
    HistoricoAtendimento,
} from '../types';

import type {
    HistoricoService,
} from './historico.service';

async function simularLatencia(
  tempo = 250
) {
  await new Promise((resolve) =>
    setTimeout(resolve, tempo)
  );
}

function formatarData(
  dataIso: string
) {
  const data =
    new Date(dataIso);

  return data.toLocaleDateString(
    'pt-BR'
  );
}

function formatarHorario(
  dataIso: string
) {
  const data =
    new Date(dataIso);

  return data.toLocaleTimeString(
    'pt-BR',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  );
}

/**
 * Converte uma ocorrência finalizada
 * para o formato utilizado pelo Histórico.
 *
 * TODO(BACKEND):
 * No backend real, o histórico deverá vir
 * pronto e consolidado pela API.
 */
function converterChamadoParaHistorico(
  chamado: ChamadoDetalhado
): HistoricoAtendimento {
  const dataFinalizacao =
    chamado.finalizadoEm ??
    chamado.recebidoEm;

  return {
    id: chamado.id,

    paciente:
      chamado.paciente,

    idade:
      chamado.idade,

    sexo:
      chamado.sexo,

    data:
      formatarData(
        dataFinalizacao
      ),

    horario:
      formatarHorario(
        dataFinalizacao
      ),

    /**
     * Temporário.
     *
     * TODO(BACKEND):
     * Confirmar o campo real que representa
     * o tipo da ocorrência.
     */
    tipoOcorrencia:
      chamado.queixa,

    classificacao:
      chamado.classificacao,

    endereco:
      chamado.endereco,

    hospitalDestino:
      chamado.hospital,

    /**
     * TODO(BACKEND):
     * O profissional responsável deve vir
     * registrado no atendimento finalizado.
     */
    profissional:
      'Profissional responsável',

    status:
      'finalizado',
  };
}

/**
 * Monta todo o Histórico disponível
 * no mock atual.
 *
 * Inclui:
 *
 * - registros históricos antigos;
 * - ocorrências finalizadas durante
 *   a execução atual do aplicativo.
 */
async function montarHistorico() {
  const chamadosFinalizados =
    await chamadosService.listarFinalizados();

  const finalizadosRecentes =
    chamadosFinalizados.map(
      converterChamadoParaHistorico
    );

  const idsRecentes =
    new Set(
      finalizadosRecentes.map(
        (item) => item.id
      )
    );

  const registrosAnteriores =
    historicoMock.filter(
      (item) =>
        !idsRecentes.has(
          item.id
        )
    );

  return [
    ...finalizadosRecentes,
    ...registrosAnteriores,
  ];
}

export const historicoMockService:
  HistoricoService = {
  async listarAtendimentos() {
    await simularLatencia();

    return montarHistorico();
  },

  /**
   * Busca um atendimento específico
   * utilizando a mesma fonte usada
   * pela lista do Histórico.
   */
  async buscarAtendimento(
    id: string
  ) {
    await simularLatencia();

    const historico =
      await montarHistorico();

    const atendimento =
      historico.find(
        (item) =>
          item.id === id
      );

    if (!atendimento) {
      throw new Error(
        'Atendimento não encontrado no histórico.'
      );
    }

    return {
      ...atendimento,
    };
  },
};