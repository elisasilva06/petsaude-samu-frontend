import type {
    LoginInput,
    Sessao,
} from '../types';

export interface AuthService {
  login(
    dados: LoginInput
  ): Promise<Sessao>;

  logout(): Promise<void>;
}