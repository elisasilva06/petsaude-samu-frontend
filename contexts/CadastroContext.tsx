import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';

/**
 * Dados pessoais coletados na primeira etapa
 * do cadastro.
 *
 * Estes dados representam o modelo interno do frontend.
 * O formato enviado futuramente para a API poderá ser
 * adaptado por um service/mapper.
 */
export type DadosPessoais = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
};

/**
 * Dados profissionais utilizados por profissionais
 * de diferentes áreas da equipe multidisciplinar.
 *
 * O cadastro NÃO deve assumir que todo profissional
 * possui CRM.
 *
 * Exemplos:
 *
 * Medicina
 * conselho: CRM
 *
 * Enfermagem
 * conselho: COREN
 *
 * Fisioterapia
 * conselho: CREFITO
 *
 * TODO(BACKEND):
 * Profissões, conselhos e unidades poderão futuramente
 * ser carregados da API em vez de serem definidos
 * diretamente pelo frontend.
 */
export type DadosProfissionais = {
  profissao: string;
  conselho: string;
  registro: string;
  uf: string;
  unidade: string;
};

type CadastroContextData = {
  dadosPessoais: DadosPessoais;

  dadosProfissionais: DadosProfissionais;

  /**
   * Utilizamos "áreas de atuação" em vez de
   * "especialidades médicas" para contemplar
   * toda a equipe multidisciplinar.
   */
  areasAtuacao: string[];

  atualizarDadosPessoais: (
    dados: Partial<DadosPessoais>
  ) => void;

  atualizarDadosProfissionais: (
    dados: Partial<DadosProfissionais>
  ) => void;

  atualizarAreasAtuacao: (
    areas: string[]
  ) => void;

  limparCadastro: () => void;
};

type CadastroProviderProps = {
  children: ReactNode;
};

const dadosPessoaisIniciais: DadosPessoais = {
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
};

const dadosProfissionaisIniciais: DadosProfissionais = {
  profissao: '',
  conselho: '',
  registro: '',
  uf: '',
  unidade: '',
};

const CadastroContext =
  createContext<CadastroContextData | undefined>(
    undefined
  );

/**
 * Provider responsável por manter temporariamente
 * os dados preenchidos durante o fluxo de cadastro.
 *
 * Exemplo:
 *
 * dados-pessoais
 *      ↓
 * dados-profissionais
 *      ↓
 * áreas de atuação
 *      ↓
 * envio final
 *
 * O Context NÃO deve realizar chamadas HTTP.
 *
 * Sua responsabilidade é apenas preservar os dados
 * entre as etapas do formulário.
 *
 * Fluxo futuro:
 *
 * Telas
 *   ↓
 * CadastroContext
 *   ↓
 * CadastroService
 *   ↓
 * API
 *
 * A chamada ao CadastroService acontecerá apenas
 * quando o usuário concluir todas as etapas.
 */
export function CadastroProvider({
  children,
}: CadastroProviderProps) {
  const [
    dadosPessoais,
    setDadosPessoais,
  ] = useState<DadosPessoais>(
    dadosPessoaisIniciais
  );

  const [
    dadosProfissionais,
    setDadosProfissionais,
  ] = useState<DadosProfissionais>(
    dadosProfissionaisIniciais
  );

  const [
    areasAtuacao,
    setAreasAtuacao,
  ] = useState<string[]>([]);

  /**
   * Atualiza apenas os campos recebidos,
   * preservando os demais dados já preenchidos.
   */
  function atualizarDadosPessoais(
    dados: Partial<DadosPessoais>
  ) {
    setDadosPessoais(
      (dadosAtuais) => ({
        ...dadosAtuais,
        ...dados,
      })
    );
  }

  /**
   * Atualiza os dados profissionais sem assumir
   * um conselho específico.
   */
  function atualizarDadosProfissionais(
    dados: Partial<DadosProfissionais>
  ) {
    setDadosProfissionais(
      (dadosAtuais) => ({
        ...dadosAtuais,
        ...dados,
      })
    );
  }

  /**
   * Substitui as áreas selecionadas pelo profissional.
   */
  function atualizarAreasAtuacao(
    novasAreas: string[]
  ) {
    setAreasAtuacao(novasAreas);
  }

  /**
   * Limpa todo o cadastro.
   *
   * Deve ser usado após uma conclusão bem-sucedida
   * ou quando for necessário reiniciar o fluxo.
   */
  function limparCadastro() {
    setDadosPessoais(
      dadosPessoaisIniciais
    );

    setDadosProfissionais(
      dadosProfissionaisIniciais
    );

    setAreasAtuacao([]);
  }

  return (
    <CadastroContext.Provider
      value={{
        dadosPessoais,
        dadosProfissionais,
        areasAtuacao,
        atualizarDadosPessoais,
        atualizarDadosProfissionais,
        atualizarAreasAtuacao,
        limparCadastro,
      }}
    >
      {children}
    </CadastroContext.Provider>
  );
}

/**
 * Hook utilizado pelas telas do fluxo de cadastro.
 *
 * Garante que o contexto seja usado somente
 * dentro de CadastroProvider.
 */
export function useCadastro() {
  const context =
    useContext(CadastroContext);

  if (!context) {
    throw new Error(
      'useCadastro deve ser utilizado dentro de CadastroProvider.'
    );
  }

  return context;
}