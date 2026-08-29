/**
 * Estado operacional da Ficha SAE.
 *
 * TODO(BACKEND):
 * Confirmar os estados reais quando o contrato
 * da API estiver disponível.
 */
export type StatusFichaSae =
  | 'nao_iniciada'
  | 'em_preenchimento'
  | 'concluida';

/**
 * Contrato das operações relacionadas
 * ao estado da Ficha SAE.
 *
 * Hoje:
 *
 * Tela -> fichaSaeService -> mock
 *
 * Futuramente:
 *
 * Tela -> fichaSaeService -> API
 */
export interface FichaSaeService {
  /**
   * Retorna o estado atual da ficha
   * vinculada a uma ocorrência.
   */
  buscarStatus(
    chamadoId: string
  ): Promise<StatusFichaSae>;

  /**
   * Marca que o preenchimento da ficha começou.
   */
  marcarEmPreenchimento(
    chamadoId: string
  ): Promise<void>;

  /**
   * Marca a ficha como concluída.
   *
   * Futuramente esta operação será chamada
   * somente depois que todas as validações
   * obrigatórias da ficha forem satisfeitas.
   */
  marcarComoConcluida(
    chamadoId: string
  ): Promise<void>;
}