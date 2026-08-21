import {
    createContext,
    Dispatch,
    ReactNode,
    useContext,
    useReducer,
} from 'react';

import { initialFichaSaeState } from '../initialState';
import {
    FichaSaeAction,
    fichaSaeReducer,
} from '../reducer';
import { FichaSaeState } from '../types';

type FichaSaeContextValue = {
  state: FichaSaeState;
  dispatch: Dispatch<FichaSaeAction>;
  resetFicha: () => void;
};

const FichaSaeContext =
  createContext<FichaSaeContextValue | undefined>(
    undefined
  );

type FichaSaeProviderProps = {
  children: ReactNode;
  initialState?: FichaSaeState;
};

export function FichaSaeProvider({
  children,
  initialState = initialFichaSaeState,
}: FichaSaeProviderProps) {
  const [state, dispatch] = useReducer(
    fichaSaeReducer,
    initialState
  );

  function resetFicha() {
    dispatch({
      type: 'RESET_FICHA',
      payload: initialState,
    });
  }

  return (
    <FichaSaeContext.Provider
      value={{
        state,
        dispatch,
        resetFicha,
      }}
    >
      {children}
    </FichaSaeContext.Provider>
  );
}

export function useFichaSae() {
  const context =
    useContext(FichaSaeContext);

  if (!context) {
    throw new Error(
      'useFichaSae deve ser usado dentro de um FichaSaeProvider.'
    );
  }

  return context;
}