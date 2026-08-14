import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';

type DadosPessoais = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
};

type DadosProfissionais = {
  crm: string;
  uf: string;
  unidade: string;
};

type CadastroContextData = {
  dadosPessoais: DadosPessoais;
  dadosProfissionais: DadosProfissionais;
  especialidades: string[];

  atualizarDadosPessoais: (
    dados: Partial<DadosPessoais>,
  ) => void;

  atualizarDadosProfissionais: (
    dados: Partial<DadosProfissionais>,
  ) => void;

  atualizarEspecialidades: (
    especialidades: string[],
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
  crm: '',
  uf: '',
  unidade: '',
};

const CadastroContext =
  createContext<CadastroContextData | undefined>(
    undefined,
  );

export function CadastroProvider({
  children,
}: CadastroProviderProps) {
  const [dadosPessoais, setDadosPessoais] =
    useState<DadosPessoais>(
      dadosPessoaisIniciais,
    );

  const [
    dadosProfissionais,
    setDadosProfissionais,
  ] = useState<DadosProfissionais>(
    dadosProfissionaisIniciais,
  );

  const [
    especialidades,
    setEspecialidades,
  ] = useState<string[]>([]);

  function atualizarDadosPessoais(
    dados: Partial<DadosPessoais>,
  ) {
    setDadosPessoais((dadosAtuais) => ({
      ...dadosAtuais,
      ...dados,
    }));
  }

  function atualizarDadosProfissionais(
    dados: Partial<DadosProfissionais>,
  ) {
    setDadosProfissionais((dadosAtuais) => ({
      ...dadosAtuais,
      ...dados,
    }));
  }

  function atualizarEspecialidades(
    novasEspecialidades: string[],
  ) {
    setEspecialidades(novasEspecialidades);
  }

  function limparCadastro() {
    setDadosPessoais(dadosPessoaisIniciais);

    setDadosProfissionais(
      dadosProfissionaisIniciais,
    );

    setEspecialidades([]);
  }

  return (
    <CadastroContext.Provider
      value={{
        dadosPessoais,
        dadosProfissionais,
        especialidades,
        atualizarDadosPessoais,
        atualizarDadosProfissionais,
        atualizarEspecialidades,
        limparCadastro,
      }}
    >
      {children}
    </CadastroContext.Provider>
  );
}

export function useCadastro() {
  const context = useContext(CadastroContext);

  if (!context) {
    throw new Error(
      'useCadastro deve ser utilizado dentro de CadastroProvider',
    );
  }

  return context;
}