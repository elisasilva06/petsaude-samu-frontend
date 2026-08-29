import {
    AtualizarPerfilInput,
    PerfilProfissional,
} from '../types';

export interface PerfilService {
  buscarPerfil(): Promise<PerfilProfissional>;

  atualizarPerfil(
    dados: AtualizarPerfilInput
  ): Promise<PerfilProfissional>;
}