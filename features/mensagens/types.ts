export type AutorMensagem =
  | 'profissional'
  | 'central';

export type Mensagem = {
  id: string;
  autor: AutorMensagem;
  nomeAutor: string;
  texto: string;
  horario: string;
};

export type ConversaOcorrencia = {
  chamadoId: string;
  paciente: string;
  mensagens: Mensagem[];
};