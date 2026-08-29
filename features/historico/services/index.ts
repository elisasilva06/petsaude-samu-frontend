import {
    historicoMockService,
} from './historico.mock.service';

import type {
    HistoricoService,
} from './historico.service';

/**
 * Ponto único de entrada para operações
 * relacionadas ao Histórico.
 *
 * TODO(BACKEND):
 * Substituir historicoMockService por
 * historicoApiService.
 */
export const historicoService:
  HistoricoService =
  historicoMockService;