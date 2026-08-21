export type PerfilProfissional = {
  id: string;

  nome: string;
  email: string;
  telefone: string;
  cpf: string;

  registro: string;
  uf: string;
  unidade: string;

  cargo: string;
  especialidades: string[];

  status: 'disponivel' | 'indisponivel';

  plantao: {
    inicio: string;
    fim: string;
  };
};