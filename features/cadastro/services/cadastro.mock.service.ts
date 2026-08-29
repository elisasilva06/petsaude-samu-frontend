import type {
    CadastroService,
    CriarCadastroInput,
} from './cadastro.service';

/**
 * Implementação temporária do cadastro.
 *
 * TODO(BACKEND):
 * Este mock será substituído pelo cadastroApiService
 * quando o endpoint de criação de conta estiver disponível.
 */
export const cadastroMockService: CadastroService = {
  async criarCadastro(
    dados: CriarCadastroInput
  ) {
    if (
      !dados.dadosPessoais.nome ||
      !dados.dadosPessoais.email ||
      !dados.dadosProfissionais.profissao ||
      !dados.dadosProfissionais.conselho ||
      !dados.dadosProfissionais.registro ||
      dados.areasAtuacao.length === 0
    ) {
      throw new Error(
        'Dados de cadastro incompletos.'
      );
    }

    /**
     * Simula somente a latência da futura API.
     */
    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );
  },
};