import type {
  Mensagem,
} from '../types';

export type ConversaMensagens = {
  chamadoId: string;
  paciente: string;
  mensagens: Mensagem[];
};

export type EnviarMensagemInput = {
  chamadoId: string;
  texto: string;
  nomeAutor: string;
};

export interface MensagensService {
  buscarConversa(
    chamadoId: string
  ): Promise<ConversaMensagens>;

  enviarMensagem(
    dados: EnviarMensagemInput
  ): Promise<Mensagem>;
}