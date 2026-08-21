import { PerfilProfissional } from './types';

export const perfilProfissionalMock: PerfilProfissional = {
  id: '1',

  nome: 'Dr. Carlos Eduardo',
  email: 'carlos.eduardo@email.com',
  telefone: '(99) 99999-9999',
  cpf: '000.000.000-00',

  registro: 'COREN 12345',
  uf: 'MA',
  unidade: 'SAMU 192 - Caxias',

  cargo: 'Enfermeiro',

  especialidades: [
    'Urgência e Emergência',
    'Atendimento Pré-Hospitalar',
  ],

  status: 'disponivel',

  plantao: {
    inicio: '07:00',
    fim: '19:00',
  },
};