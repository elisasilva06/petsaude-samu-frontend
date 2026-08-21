import { Chamado } from './types';

export function criarChamadoMock(id: string): Chamado {
  return {
    id,
    paciente: 'Francisco Souza',
    idade: 55,
    sexo: 'Masculino',
    queixa: 'Dor no peito (Suspeita IAM)',
    telefone: '99988123456',

    bairro: 'Mutirão',
    endereco: 'Caxias, MA - Próximo à Escola',

    relato:
      'Paciente refere dor torácica opressiva retroesternal iniciada há 30 min. Histórico de Hipertensão e Diabetes.',

    hospital: 'HOSPITAL REGIONAL DE CAXIAS',
    setor: 'SALA VERMELHA',

    latitude: -4.8624,
    longitude: -43.3561,

    fotos: 1,
  };
}