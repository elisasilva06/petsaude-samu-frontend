import {
    mensagensMockService,
} from './mensagens.mock.service';

import type {
    MensagensService,
} from './mensagens.service';

export const mensagensService:
  MensagensService =
  mensagensMockService;

export type {
    ConversaMensagens,
    EnviarMensagemInput
} from './mensagens.service';
