export type SexoPaciente = 'M' | 'F' | null;

/**
 * Identificação
 */

export type HorariosChamado = {
  saidaBase: string;
  chegadaLocal: string;
  saidaLocal: string;
  chegadaDestino: string;
};

export type InformacoesChamado = {
  numero: string;
  data: string;
  horarios: HorariosChamado;
  endereco: string;
  pontoReferencia: string;
};

export type IdentificacaoPaciente = {
  nome: string;
  nomeSocial: string;
  idade: string;
  sexo: SexoPaciente;
};

export type IdentificacaoSae = {
  chamado: InformacoesChamado;
  paciente: IdentificacaoPaciente;
  tipoOcorrencia: string | null;
};

/**
 * Avaliação Primária — XABCDE
 */

export type Hemorragias = {
  contencao: boolean;
  compressao: boolean;
  preenchimento: boolean;
  torniquete: boolean;
  hemorragiaDireta: string;
};

export type ViasAereas = {
  pervias: boolean;
  obstruidas: boolean;
  parcialmenteObstruidas: boolean;
  aspiracao: boolean;
  guedel: boolean;
  intubacao: boolean;
  cricotireoidostomia: boolean;
};

export type ControleColuna = {
  colarCervical: boolean;
  talas: boolean;
  protetorLateral: boolean;
  headBlock: boolean;
  prancha: boolean;
};

export type Respiracao = {
  padrao: string | null;
  suporte: string | null;
  fio2: string;
  tot: string;
};

export type AvaliacaoPrimaria = {
  hemorragias: Hemorragias;
  viasAereas: ViasAereas;
  controleColuna: ControleColuna;
  respiracao: Respiracao;
};

/**
 * Avaliação Secundária
 */

export type SinaisVitais = {
  pa: string;
  fc: string;
  fr: string;
  spo2: string;
  tax: string;
  glicemia: string;
};

export type HistoricoSampla = {
  temAlergia: boolean | null;
  alergiaQual: string;
  medicacoes: string;
  passadoMedico: string;
  liquidosAlimentos: string;
};

export type SaidasPaciente = {
  vomito: string;
  evacuacao: string;
  sangue: string;
  diurese: string;
};

export type BalancoSuporte = {
  viaAdministracao: string | null;
  solucao: string | null;
  sedacao: string;
  dva: string;
  saidas: SaidasPaciente;
};

export type AvaliacaoSecundaria = {
  sinaisVitais: SinaisVitais;
  sampla: HistoricoSampla;
  balancoSuporte: BalancoSuporte;
};

/**
 * Escala de Glasgow
 */

export type EscalaGlasgow = {
  ocular: number | null;
  verbal: number | null;
  motor: number | null;
  pupilar: number | null;
};

/**
 * Escala RASS
 */

export type EscalaRass = {
  score: number | null;
};

/**
 * Escala TRIPS
 */

export type EscalaTrips = {
  temperatura: number | null;
  pressaoSistolica: number | null;
  estadoNeurologico: number | null;
  statusRespiratorio: number | null;
};

/**
 * Trauma e Queimaduras
 */

export type TraumaQueimaduras = {
  mecanismo: string;
  lesoes: string[];
  scqTotal: string;
  grauQueimadura: string | null;
  observacoes: string;
};

/**
 * Escala de Morse
 */

export type EscalaMorse = {
  historicoQuedas: number | null;
  diagnosticoSecundario: number | null;
  auxilioDeambulacao: number | null;
  terapiaEndovenosa: number | null;
  marcha: number | null;
  estadoMental: number | null;
};

/**
 * Diagnósticos e Intervenções
 */

export type DiagnosticosIntervencoes = {
  diagnosticos: string[];
  outrosDiagnosticos: string;

  intervencoes: string[];
  outrasIntervencoes: string;
};

/**
 * Finalização
 */

export type FinalizacaoSae = {
  nomeProfissional: string;
  corenMatricula: string;
};

/**
 * Estado completo da Ficha SAE
 */

export type FichaSaeState = {
  identificacao: IdentificacaoSae;

  avaliacaoPrimaria: AvaliacaoPrimaria;

  avaliacaoSecundaria: AvaliacaoSecundaria;

  glasgow: EscalaGlasgow;

  rass: EscalaRass;

  trips: EscalaTrips;

  traumaQueimaduras: TraumaQueimaduras;

  morse: EscalaMorse;

  diagnosticosIntervencoes: DiagnosticosIntervencoes;

  finalizacao: FinalizacaoSae;
};

/**
 * Identificadores das seções da Ficha SAE.
 *
 * Isso será usado pela navegação interna da ficha.
 */
export type FichaSaeSectionKey =
  | 'identificacao'
  | 'avaliacaoPrimaria'
  | 'avaliacaoSecundaria'
  | 'glasgow'
  | 'rass'
  | 'trips'
  | 'traumaQueimaduras'
  | 'morse'
  | 'diagnosticosIntervencoes'
  | 'finalizacao';