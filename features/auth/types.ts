export type LoginInput = {
  email: string;
  senha: string;
};

export type UsuarioAutenticado = {
  id: string;
  nome: string;
  email: string;
};

export type Sessao = {
  usuario: UsuarioAutenticado;
};

export type AlterarSenhaInput = {
  senhaAtual: string;
  novaSenha: string;
};

export type SolicitarRecuperacaoSenhaInput = {
  email: string;
};

/**
 * Dados internos necessários para concluir uma
 * recuperação de senha.
 *
 * `credencialRecuperacao` é propositalmente genérico.
 * O backend poderá utilizar token, código ou outro
 * mecanismo sem obrigar as telas a conhecerem esse formato.
 */
export type RedefinirSenhaInput = {
  credencialRecuperacao: string;
  novaSenha: string;
};