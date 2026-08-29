/**
 * Dados completos de uma ocorrência.
 *
 * Este tipo é utilizado principalmente
 * na tela de detalhes do chamado.
 */
export type Chamado = {
  id: string;

  paciente: string;

  idade: number;

  sexo: string;

  queixa: string;

  telefone: string;

  bairro: string;

  endereco: string;

  relato: string;

  hospital: string;

  setor: string;

  latitude: number;

  longitude: number;

  fotos: number;
};

/**
 * Status operacional de uma ocorrência.
 *
 * aguardando:
 * chamada presente na fila.
 *
 * em_atendimento:
 * chamada atualmente assumida pelo profissional.
 *
 * finalizado:
 * atendimento concluído.
 *
 * cancelado:
 * ocorrência cancelada.
 *
 * TODO(BACKEND):
 * Confirmar os nomes e possíveis estados
 * quando o contrato real estiver disponível.
 */
export type StatusChamado =
  | 'aguardando'
  | 'em_atendimento'
  | 'finalizado'
  | 'cancelado';

/**
 * Classificação visual temporária.
 *
 * TODO(BACKEND):
 * Confirmar valores reais e regras de classificação.
 */
export type GravidadeChamado =
  | 'emergencia'
  | 'urgente';

/**
 * Versão resumida da ocorrência utilizada
 * na Home e na fila operacional.
 *
 * Ela não precisa carregar todos os dados
 * existentes no tipo Chamado.
 */
export type ChamadoResumo = {
  id: string;

  paciente: string;

  bairro: string;

  classificacao: string;

  gravidade: GravidadeChamado;

  queixa: string;

  /**
   * Prioridade utilizada para ordenar a fila.
   *
   * No mock atual:
   * número menor = maior prioridade.
   *
   * TODO(BACKEND):
   * A regra definitiva deve vir do backend.
   */
  prioridade: number;

  status: StatusChamado;

  /**
   * Datas em ISO facilitam ordenação,
   * cálculos de tempo e futura integração.
   */
  recebidoEm: string;

  iniciadoEm?: string;

  finalizadoEm?: string;
};

/**
 * Estado operacional exibido na Home.
 *
 * ativo:
 * ocorrência atualmente atendida.
 *
 * fila:
 * ocorrências aguardando atendimento.
 */
export type PainelChamados = {
  ativo: ChamadoResumo | null;

  fila: ChamadoResumo[];
  
};

/**
 * Dados completos da ocorrência unidos ao seu
 * estado operacional atual.
 *
 * Assim a tela de detalhes conhece tanto os
 * dados do paciente quanto o status do chamado.
 */
export type ChamadoDetalhado =
  Chamado &
    Pick<
      ChamadoResumo,
      | 'classificacao'
      | 'gravidade'
      | 'prioridade'
      | 'status'
      | 'recebidoEm'
      | 'iniciadoEm'
      | 'finalizadoEm'
    >;