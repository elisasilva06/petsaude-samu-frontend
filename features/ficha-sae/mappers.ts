import { Chamado } from '@/features/chamados/types';

import { initialFichaSaeState } from './initialState';
import {
    FichaSaeState,
    SexoPaciente,
} from './types';

function converterSexo(
  sexo: string
): SexoPaciente {
  const valor = sexo
    .trim()
    .toLowerCase();

  if (
    valor === 'masculino' ||
    valor === 'm'
  ) {
    return 'M';
  }

  if (
    valor === 'feminino' ||
    valor === 'f'
  ) {
    return 'F';
  }

  return null;
}

export function criarFichaSaeAPartirDoChamado(
  chamado: Chamado
): FichaSaeState {
  return {
    ...initialFichaSaeState,

    identificacao: {
      ...initialFichaSaeState.identificacao,

      chamado: {
        ...initialFichaSaeState.identificacao.chamado,

        numero: chamado.id,

        /*
         * Ainda não temos esses dados
         * no mock/contrato real.
         */
        data: '',
        pontoReferencia: '',

        endereco: chamado.endereco,
      },

      paciente: {
        ...initialFichaSaeState.identificacao.paciente,

        nome: chamado.paciente,

        idade: String(chamado.idade),

        sexo: converterSexo(
          chamado.sexo
        ),
      },

      /*
       * O Chamado atual ainda não possui
       * um campo confiável para isso.
       */
      tipoOcorrencia: null,
    },
  };
}