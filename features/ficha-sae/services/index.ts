import {
    fichaSaeMockService,
} from './ficha-sae.mock.service';

import type {
    FichaSaeService,
} from './ficha-sae.service';

/**
 * Ponto único de acesso às operações
 * relacionadas à Ficha SAE.
 *
 * TODO(BACKEND):
 * Trocar fichaSaeMockService por
 * fichaSaeApiService.
 */
export const fichaSaeService:
  FichaSaeService =
  fichaSaeMockService;

export type {
    StatusFichaSae
} from './ficha-sae.service';
