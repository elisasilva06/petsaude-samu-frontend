import {
  chamadosMockService,
} from './chamados.mock.service';

import type {
  ChamadosService,
} from './chamados.service';

/**
 * Ponto único de acesso às operações
 * relacionadas aos chamados.
 *
 * TODO(BACKEND):
 * Trocar chamadosMockService por
 * chamadosApiService.
 */
export const chamadosService:
  ChamadosService =
  chamadosMockService;