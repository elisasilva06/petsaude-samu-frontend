import { authMockService } from './auth.mock.service';
import { senhaMockService } from './senha.mock.service';

import type { AuthService } from './auth.service';
import type { SenhaService } from './senha.service';

export const authService: AuthService =
  authMockService;

export const senhaService: SenhaService =
  senhaMockService;