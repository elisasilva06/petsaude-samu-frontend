import type {
  PerfilProfissional,
} from './types';

/**
 * Perfil temporário utilizado enquanto o backend
 * ainda não está integrado.
 *
 * Este mock representa um profissional da equipe
 * multidisciplinar e não deve assumir que o usuário
 * seja médico.
 *
 * TODO(BACKEND):
 * Remover este mock quando perfilService passar
 * a utilizar a API real.
 */
export const perfilProfissionalMock:
  PerfilProfissional = {
  id: '1',

  nome: 'Carlos Eduardo',
  email: 'carlos.eduardo@email.com',
  telefone: '(99) 99999-9999',
  cpf: '000.000.000-00',

  /**
   * Dados profissionais separados para permitir
   * diferentes categorias profissionais.
   */
  profissao: 'Enfermagem',

  conselho: 'COREN',

  registro: '12345',

  uf: 'MA',

  unidade: 'SAMU 192 - Caxias',

  /**
   * Áreas relacionadas à atuação do profissional.
   *
   * Não utilizamos mais "especialidades médicas"
   * como conceito global do aplicativo.
   */
  areasAtuacao: [
    'Urgência e Emergência',
    'Atendimento Pré-Hospitalar',
  ],

  /**
   * Estado operacional atual.
   *
   * TODO(BACKEND):
   * Este dado deverá vir da situação real
   * do profissional no sistema.
   */
  status: 'disponivel',

  /**
   * Plantão temporário para desenvolvimento.
   *
   * TODO(BACKEND):
   * A escala real deverá ser fornecida pelo backend.
   */
  plantao: {
    inicio: '07:00',
    fim: '19:00',
  },
};