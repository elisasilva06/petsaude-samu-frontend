import {
  criarConversaMock,
} from '../mocks';

import type {
  Mensagem,
} from '../types';

import type {
  EnviarMensagemInput,
  MensagensService,
} from './mensagens.service';

const mensagensPorChamado =
  new Map<string, Mensagem[]>();

let sequenciaMensagem = 0;

async function simularLatencia(
  tempo = 300
) {
  await new Promise((resolve) =>
    setTimeout(resolve, tempo)
  );
}

function copiarMensagem(
  mensagem: Mensagem
): Mensagem {
  return {
    ...mensagem,
  };
}

function obterOuCriarConversa(
  chamadoId: string
) {
  const conversaBase =
    criarConversaMock(chamadoId);

  let mensagens =
    mensagensPorChamado.get(
      chamadoId
    );

  if (!mensagens) {
    mensagens =
      conversaBase.mensagens.map(
        copiarMensagem
      );

    mensagensPorChamado.set(
      chamadoId,
      mensagens
    );
  }

  return {
    chamadoId,

    paciente:
      conversaBase.paciente,

    mensagens:
      mensagens.map(
        copiarMensagem
      ),
  };
}

export const mensagensMockService:
  MensagensService = {
  async buscarConversa(
    chamadoId: string
  ) {
    await simularLatencia();

    return obterOuCriarConversa(
      chamadoId
    );
  },

  async enviarMensagem(
    dados: EnviarMensagemInput
  ) {
    await simularLatencia();

    const texto =
      dados.texto.trim();

    if (!texto) {
      throw new Error(
        'A mensagem não pode estar vazia.'
      );
    }

    obterOuCriarConversa(
      dados.chamadoId
    );

    sequenciaMensagem += 1;

    const agora =
      new Date();

    const mensagem: Mensagem = {
      id:
        `${Date.now()}-${sequenciaMensagem}`,

      autor: 'profissional',

      nomeAutor:
        dados.nomeAutor,

      texto,

      horario:
        agora.toLocaleTimeString(
          'pt-BR',
          {
            hour: '2-digit',
            minute: '2-digit',
          }
        ),
    };

    const mensagensAtuais =
      mensagensPorChamado.get(
        dados.chamadoId
      ) ?? [];

    mensagensPorChamado.set(
      dados.chamadoId,
      [
        ...mensagensAtuais,
        mensagem,
      ]
    );

    return {
      ...mensagem,
    };
  },
};