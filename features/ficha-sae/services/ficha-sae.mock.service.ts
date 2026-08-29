import type {
    FichaSaeService,
    StatusFichaSae,
} from './ficha-sae.service';

/**
 * Estado temporário das fichas por ocorrência.
 *
 * Exemplo:
 *
 * {
 *   "1": "concluida",
 *   "2": "em_preenchimento"
 * }
 *
 * TODO(BACKEND):
 * Este estado desaparecerá quando a API
 * for responsável pela persistência da ficha.
 */
const statusPorChamado =
  new Map<string, StatusFichaSae>();

async function simularLatencia(
  tempo = 300
) {
  await new Promise((resolve) =>
    setTimeout(resolve, tempo)
  );
}

export const fichaSaeMockService:
  FichaSaeService = {
  async buscarStatus(
    chamadoId: string
  ) {
    await simularLatencia();

    return (
      statusPorChamado.get(
        chamadoId
      ) ?? 'nao_iniciada'
    );
  },

  async marcarEmPreenchimento(
    chamadoId: string
  ) {
    await simularLatencia(150);

    const statusAtual =
      statusPorChamado.get(
        chamadoId
      );

    /**
     * Uma ficha concluída não volta automaticamente
     * para "em preenchimento".
     */
    if (
      statusAtual ===
      'concluida'
    ) {
      return;
    }

    statusPorChamado.set(
      chamadoId,
      'em_preenchimento'
    );
  },

  async marcarComoConcluida(
    chamadoId: string
  ) {
    await simularLatencia(300);

    statusPorChamado.set(
      chamadoId,
      'concluida'
    );
  },
};