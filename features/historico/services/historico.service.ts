import type {
    HistoricoAtendimento,
} from '../types';

/**
 * Contrato das operações relacionadas
 * ao Histórico de atendimentos.
 */
export interface HistoricoService {
  listarAtendimentos(): Promise<
    HistoricoAtendimento[]
  >;

  /**
   * Busca um atendimento específico
   * dentro do Histórico.
   */
  buscarAtendimento(
    id: string
  ): Promise<HistoricoAtendimento>;
}