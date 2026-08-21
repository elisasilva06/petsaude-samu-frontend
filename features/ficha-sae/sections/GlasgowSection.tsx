import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';

import { ScoreOption } from '../components/ScoreOption';
import { ScoreResultCard } from '../components/ScoreResultCard';
import { useFichaSae } from '../context/FichaSaeContext';

const WARNING = '#F9A825';

export function GlasgowSection() {
  const { state, dispatch } = useFichaSae();

  const glasgow = state.glasgow;

  function atualizar(
    campo: keyof typeof glasgow,
    valor: number
  ) {
    dispatch({
      type: 'SET_GLASGOW',

      payload: {
        ...glasgow,
        [campo]: valor,
      },
    });
  }

  const preenchida =
    glasgow.ocular !== null &&
    glasgow.verbal !== null &&
    glasgow.motor !== null &&
    glasgow.pupilar !== null;

  const total = preenchida
    ? glasgow.ocular! +
      glasgow.verbal! +
      glasgow.motor! -
      glasgow.pupilar!
    : null;

  function obterStatus() {
    if (total === null) {
      return {
        label: 'PREENCHIMENTO PENDENTE',
        color: Colors.muted,
      };
    }

    if (total >= 13) {
      return {
        label: 'TRAUMA LEVE',
        color: Colors.success,
      };
    }

    if (total >= 9) {
      return {
        label: 'TRAUMA MODERADO',
        color: WARNING,
      };
    }

    return {
      label: 'TRAUMA GRAVE',
      color: Colors.danger,
    };
  }

  const status = obterStatus();

  return (
    <View>
      <Text style={styles.sectionTitle}>
        GLASGOW (ECG-P)
      </Text>

      <View style={styles.card}>
        <Text style={styles.question}>
          Abertura Ocular
        </Text>

        <ScoreOption
          label="4 - Espontânea"
          points={4}
          selected={glasgow.ocular === 4}
          onPress={() =>
            atualizar('ocular', 4)
          }
        />

        <ScoreOption
          label="3 - Resposta à fala"
          points={3}
          selected={glasgow.ocular === 3}
          onPress={() =>
            atualizar('ocular', 3)
          }
        />

        <ScoreOption
          label="2 - Resposta à dor"
          points={2}
          selected={glasgow.ocular === 2}
          onPress={() =>
            atualizar('ocular', 2)
          }
        />

        <ScoreOption
          label="1 - Nenhuma"
          points={1}
          selected={glasgow.ocular === 1}
          onPress={() =>
            atualizar('ocular', 1)
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>
          Melhor Resposta Verbal
        </Text>

        <ScoreOption
          label="5 - Orientada"
          points={5}
          selected={glasgow.verbal === 5}
          onPress={() =>
            atualizar('verbal', 5)
          }
        />

        <ScoreOption
          label="4 - Confusa"
          points={4}
          selected={glasgow.verbal === 4}
          onPress={() =>
            atualizar('verbal', 4)
          }
        />

        <ScoreOption
          label="3 - Inadequada"
          points={3}
          selected={glasgow.verbal === 3}
          onPress={() =>
            atualizar('verbal', 3)
          }
        />

        <ScoreOption
          label="2 - Incompreensível"
          points={2}
          selected={glasgow.verbal === 2}
          onPress={() =>
            atualizar('verbal', 2)
          }
        />

        <ScoreOption
          label="1 - Nenhuma"
          points={1}
          selected={glasgow.verbal === 1}
          onPress={() =>
            atualizar('verbal', 1)
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>
          Melhor Resposta Motora
        </Text>

        <ScoreOption
          label="6 - Obedece comandos"
          points={6}
          selected={glasgow.motor === 6}
          onPress={() =>
            atualizar('motor', 6)
          }
        />

        <ScoreOption
          label="5 - Localiza dor"
          points={5}
          selected={glasgow.motor === 5}
          onPress={() =>
            atualizar('motor', 5)
          }
        />

        <ScoreOption
          label="4 - Flexão normal"
          points={4}
          selected={glasgow.motor === 4}
          onPress={() =>
            atualizar('motor', 4)
          }
        />

        <ScoreOption
          label="3 - Decorticação"
          points={3}
          selected={glasgow.motor === 3}
          onPress={() =>
            atualizar('motor', 3)
          }
        />

        <ScoreOption
          label="2 - Descerebração"
          points={2}
          selected={glasgow.motor === 2}
          onPress={() =>
            atualizar('motor', 2)
          }
        />

        <ScoreOption
          label="1 - Nenhuma"
          points={1}
          selected={glasgow.motor === 1}
          onPress={() =>
            atualizar('motor', 1)
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>
          Resposta Pupilar (Subtração)
        </Text>

        <ScoreOption
          label="0 - Reação bilateral"
          points={0}
          selected={glasgow.pupilar === 0}
          onPress={() =>
            atualizar('pupilar', 0)
          }
        />

        <ScoreOption
          label="1 - Apenas uma reage"
          points={1}
          selected={glasgow.pupilar === 1}
          onPress={() =>
            atualizar('pupilar', 1)
          }
        />

        <ScoreOption
          label="2 - Nenhuma reage"
          points={2}
          selected={glasgow.pupilar === 2}
          onPress={() =>
            atualizar('pupilar', 2)
          }
        />
      </View>

      <ScoreResultCard
        label="SCORE TOTAL (P)"
        value={
          total === null
            ? '--'
            : `${total} pts`
        }
        status={status.label}
        backgroundColor={status.color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 15,
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

  card: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },

  question: {
    marginBottom: 8,
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});