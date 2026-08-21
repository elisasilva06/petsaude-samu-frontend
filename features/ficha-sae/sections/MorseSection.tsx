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

export function MorseSection() {
  const { state, dispatch } = useFichaSae();

  const morse = state.morse;

  function atualizar(
    campo: keyof typeof morse,
    valor: number
  ) {
    dispatch({
      type: 'SET_MORSE',

      payload: {
        ...morse,
        [campo]: valor,
      },
    });
  }

  const preenchida =
    morse.historicoQuedas !== null &&
    morse.diagnosticoSecundario !== null &&
    morse.auxilioDeambulacao !== null &&
    morse.terapiaEndovenosa !== null &&
    morse.marcha !== null &&
    morse.estadoMental !== null;

  const total = preenchida
    ? morse.historicoQuedas! +
      morse.diagnosticoSecundario! +
      morse.auxilioDeambulacao! +
      morse.terapiaEndovenosa! +
      morse.marcha! +
      morse.estadoMental!
    : null;

  function obterRisco() {
    if (total === null) {
      return {
        label: 'PREENCHIMENTO PENDENTE',
        color: Colors.muted,
      };
    }

    if (total <= 24) {
      return {
        label: 'RISCO BAIXO',
        color: Colors.success,
      };
    }

    if (total <= 44) {
      return {
        label: 'RISCO MÉDIO',
        color: WARNING,
      };
    }

    return {
      label: 'RISCO ELEVADO',
      color: Colors.danger,
    };
  }

  const risco = obterRisco();

  return (
    <View>
      <Text style={styles.sectionTitle}>
        ESCALA DE MORSE
      </Text>

      <Text style={styles.subtitle}>
        Risco de Queda
      </Text>

      <View style={styles.card}>
        <Text style={styles.question}>
          1. Histórico de Quedas?
        </Text>

        <ScoreOption
          label="Não"
          points={0}
          selected={
            morse.historicoQuedas === 0
          }
          onPress={() =>
            atualizar(
              'historicoQuedas',
              0
            )
          }
        />

        <ScoreOption
          label="Sim"
          points={25}
          selected={
            morse.historicoQuedas === 25
          }
          onPress={() =>
            atualizar(
              'historicoQuedas',
              25
            )
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>
          2. Diagnóstico Secundário?
        </Text>

        <ScoreOption
          label="Não"
          points={0}
          selected={
            morse.diagnosticoSecundario ===
            0
          }
          onPress={() =>
            atualizar(
              'diagnosticoSecundario',
              0
            )
          }
        />

        <ScoreOption
          label="Sim"
          points={15}
          selected={
            morse.diagnosticoSecundario ===
            15
          }
          onPress={() =>
            atualizar(
              'diagnosticoSecundario',
              15
            )
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>
          3. Auxílio na Deambulação?
        </Text>

        <ScoreOption
          label="Nenhum / Acamado / Cadeira de Rodas"
          points={0}
          selected={
            morse.auxilioDeambulacao === 0
          }
          onPress={() =>
            atualizar(
              'auxilioDeambulacao',
              0
            )
          }
        />

        <ScoreOption
          label="Muletas / Bengala / Andador"
          points={15}
          selected={
            morse.auxilioDeambulacao === 15
          }
          onPress={() =>
            atualizar(
              'auxilioDeambulacao',
              15
            )
          }
        />

        <ScoreOption
          label="Mobiliário / Parede"
          points={30}
          selected={
            morse.auxilioDeambulacao === 30
          }
          onPress={() =>
            atualizar(
              'auxilioDeambulacao',
              30
            )
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>
          4. Terapia EV / Dispositivo Salinizado?
        </Text>

        <ScoreOption
          label="Não"
          points={0}
          selected={
            morse.terapiaEndovenosa === 0
          }
          onPress={() =>
            atualizar(
              'terapiaEndovenosa',
              0
            )
          }
        />

        <ScoreOption
          label="Sim"
          points={20}
          selected={
            morse.terapiaEndovenosa === 20
          }
          onPress={() =>
            atualizar(
              'terapiaEndovenosa',
              20
            )
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>
          5. Marcha / Deambulação?
        </Text>

        <ScoreOption
          label="Normal / Sem deambulação"
          points={0}
          selected={morse.marcha === 0}
          onPress={() =>
            atualizar('marcha', 0)
          }
        />

        <ScoreOption
          label="Fraca"
          points={10}
          selected={morse.marcha === 10}
          onPress={() =>
            atualizar('marcha', 10)
          }
        />

        <ScoreOption
          label="Comprometida / Cambaleante"
          points={20}
          selected={morse.marcha === 20}
          onPress={() =>
            atualizar('marcha', 20)
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>
          6. Estado Mental?
        </Text>

        <ScoreOption
          label="Orientado / Capaz quanto à sua limitação"
          points={0}
          selected={
            morse.estadoMental === 0
          }
          onPress={() =>
            atualizar(
              'estadoMental',
              0
            )
          }
        />

        <ScoreOption
          label="Superestima capacidade / Esquece limitações"
          points={15}
          selected={
            morse.estadoMental === 15
          }
          onPress={() =>
            atualizar(
              'estadoMental',
              15
            )
          }
        />
      </View>

      <ScoreResultCard
        label="PONTUAÇÃO TOTAL"
        value={
          total === null
            ? '--'
            : `${total} pontos`
        }
        status={risco.label}
        backgroundColor={risco.color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 3,
    marginBottom: 15,
    color: Colors.textSecondary,
    fontSize: 11,
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