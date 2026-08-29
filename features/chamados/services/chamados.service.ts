import type {
  ChamadoDetalhado,
  PainelChamados,
} from '../types';

/**
 * Contrato responsável pelo fluxo
 * operacional das ocorrências.
 */
export interface ChamadosService {
  buscarPainel(): Promise<PainelChamados>;

  buscarChamado(
    id: string
  ): Promise<ChamadoDetalhado>;

  /**
   * Retorna ocorrências já finalizadas.
   *
   * Hoje será usado pelo mock do Histórico.
   *
   * TODO(BACKEND):
   * O Histórico provavelmente terá endpoint
   * próprio e paginação no backend.
   */
  listarFinalizados(): Promise<
    ChamadoDetalhado[]
  >;

  aceitarChamado(
    id: string
  ): Promise<PainelChamados>;

  finalizarChamado(
    id: string
  ): Promise<PainelChamados>;
}