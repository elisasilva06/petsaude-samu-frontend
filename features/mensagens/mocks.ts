import {
    ConversaOcorrencia,
    Mensagem,
} from './types';

const mensagensMock: Mensagem[] = [
  {
    id: '1',
    autor: 'central',
    nomeAutor: 'Central SAMU',
    texto:
      'Equipe, paciente masculino com dor torácica intensa. Atendimento classificado como emergência.',
    horario: '14:22',
  },
  {
    id: '2',
    autor: 'profissional',
    nomeAutor: 'Dr. Carlos Eduardo',
    texto:
      'Recebido. Estamos a caminho do local.',
    horario: '14:24',
  },
  {
    id: '3',
    autor: 'central',
    nomeAutor: 'Central SAMU',
    texto:
      'Hospital Regional de Caxias avisado sobre possível encaminhamento.',
    horario: '14:28',
  },
];

export function criarConversaMock(
  chamadoId: string
): ConversaOcorrencia {
  return {
    chamadoId,
    paciente: 'Francisco Souza',
    mensagens: mensagensMock,
  };
}