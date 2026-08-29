import type {
    DadosPessoais,
    DadosProfissionais,
} from '@/contexts/CadastroContext';

export type CriarCadastroInput = {
  dadosPessoais: DadosPessoais;
  dadosProfissionais: DadosProfissionais;
  areasAtuacao: string[];
};

/**
 * Contrato responsável pela conclusão do cadastro.
 *
 * As telas não devem enviar dados diretamente
 * para a API.
 *
 * Hoje:
 * CadastroScreen -> cadastroService -> mock
 *
 * Futuramente:
 * CadastroScreen -> cadastroService -> API
 */
export interface CadastroService {
  criarCadastro(
    dados: CriarCadastroInput
  ): Promise<void>;
}