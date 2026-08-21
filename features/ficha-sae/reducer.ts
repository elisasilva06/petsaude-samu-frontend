import { initialFichaSaeState } from './initialState';

import {
    AvaliacaoPrimaria,
    AvaliacaoSecundaria,
    DiagnosticosIntervencoes,
    EscalaGlasgow,
    EscalaMorse,
    EscalaRass,
    EscalaTrips,
    FichaSaeState,
    FinalizacaoSae,
    IdentificacaoSae,
    TraumaQueimaduras,
} from './types';

export type FichaSaeAction =
  | {
      type: 'SET_IDENTIFICACAO';
      payload: IdentificacaoSae;
    }
  | {
      type: 'SET_AVALIACAO_PRIMARIA';
      payload: AvaliacaoPrimaria;
    }
  | {
      type: 'SET_AVALIACAO_SECUNDARIA';
      payload: AvaliacaoSecundaria;
    }
  | {
      type: 'SET_GLASGOW';
      payload: EscalaGlasgow;
    }
  | {
      type: 'SET_RASS';
      payload: EscalaRass;
    }
  | {
      type: 'SET_TRIPS';
      payload: EscalaTrips;
    }
  | {
      type: 'SET_TRAUMA_QUEIMADURAS';
      payload: TraumaQueimaduras;
    }
  | {
      type: 'SET_MORSE';
      payload: EscalaMorse;
    }
  | {
      type: 'SET_DIAGNOSTICOS_INTERVENCOES';
      payload: DiagnosticosIntervencoes;
    }
  | {
      type: 'SET_FINALIZACAO';
      payload: FinalizacaoSae;
    }
  | {
      type: 'RESET_FICHA';
      payload?: FichaSaeState;
    };

export function fichaSaeReducer(
  state: FichaSaeState,
  action: FichaSaeAction
): FichaSaeState {
  switch (action.type) {
    case 'SET_IDENTIFICACAO':
      return {
        ...state,
        identificacao: action.payload,
      };

    case 'SET_AVALIACAO_PRIMARIA':
      return {
        ...state,
        avaliacaoPrimaria: action.payload,
      };

    case 'SET_AVALIACAO_SECUNDARIA':
      return {
        ...state,
        avaliacaoSecundaria: action.payload,
      };

    case 'SET_GLASGOW':
      return {
        ...state,
        glasgow: action.payload,
      };

    case 'SET_RASS':
      return {
        ...state,
        rass: action.payload,
      };

    case 'SET_TRIPS':
      return {
        ...state,
        trips: action.payload,
      };

    case 'SET_TRAUMA_QUEIMADURAS':
      return {
        ...state,
        traumaQueimaduras: action.payload,
      };

    case 'SET_MORSE':
      return {
        ...state,
        morse: action.payload,
      };

    case 'SET_DIAGNOSTICOS_INTERVENCOES':
      return {
        ...state,
        diagnosticosIntervencoes: action.payload,
      };

    case 'SET_FINALIZACAO':
      return {
        ...state,
        finalizacao: action.payload,
      };

    case 'RESET_FICHA':
      return action.payload ?? initialFichaSaeState;

    default:
      return state;
  }
}