/**
 * Situação operacional atual do profissional.
 *
 * TODO(BACKEND):
 * Confirmar os possíveis status quando o contrato
 * real da API estiver disponível.
 */
export type StatusProfissional =
  | 'disponivel'
  | 'indisponivel';

/**
 * Informações de plantão exibidas no aplicativo.
 *
 * Por enquanto armazenamos somente horário
 * inicial e final.
 *
 * TODO(BACKEND):
 * O backend poderá futuramente retornar outras
 * informações, como data, escala, equipe ou unidade.
 */
export type PlantaoProfissional = {
  inicio: string;
  fim: string;
};

/**
 * Representa o perfil completo do profissional
 * autenticado.
 *
 * Este modelo é multiprofissional e não assume
 * que o usuário seja médico.
 *
 * Exemplos:
 *
 * profissao: "Enfermagem"
 * conselho: "COREN"
 *
 * profissao: "Fisioterapia"
 * conselho: "CREFITO"
 *
 * profissao: "Medicina"
 * conselho: "CRM"
 *
 * TODO(BACKEND):
 * Este é o modelo interno utilizado pelo frontend.
 * Quando a API estiver disponível, um mapper poderá
 * adaptar o formato recebido pelo backend para este tipo.
 */
export type PerfilProfissional = {
  id: string;

  nome: string;
  email: string;
  cpf: string;
  telefone: string;

  profissao: string;

  conselho: string;

  registro: string;

  uf: string;

  unidade: string;

  areasAtuacao: string[];

  status: StatusProfissional;

  plantao: PlantaoProfissional;
};

/**
 * Dados permitidos atualmente na edição de perfil.
 *
 * Não incluímos:
 *
 * - id;
 * - status;
 * - plantão.
 *
 * Esses dados não devem ser alterados pelo formulário
 * comum de edição de informações profissionais.
 */
export type AtualizarPerfilInput = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;

  profissao: string;

  conselho: string;

  registro: string;

  uf: string;

  unidade: string;

  areasAtuacao: string[];
};