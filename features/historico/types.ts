export type HistoricoAtendimento = {
  id: string;
  paciente: string;
  idade: number;
  sexo: string;
  data: string;
  horario: string;
  tipoOcorrencia: string;
  classificacao: string;
  endereco: string;
  hospitalDestino: string;
  profissional: string;
  status: 'finalizado';
};