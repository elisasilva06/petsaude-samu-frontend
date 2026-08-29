import { perfilMockService } from './perfil.mock.service';
import { PerfilService } from './perfil.service';

/*
 * Enquanto o backend não estiver integrado,
 * utilizamos a implementação mock.
 *
 * Quando a API estiver disponível,
 * poderemos trocar apenas esta implementação.
 */

export const perfilService: PerfilService =
  perfilMockService;