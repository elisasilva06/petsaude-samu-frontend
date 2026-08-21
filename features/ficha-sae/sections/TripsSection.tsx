import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';

import { ScoreOption } from '../components/ScoreOption';
import { ScoreResultCard } from '../components/ScoreResultCard';
import { useFichaSae } from '../context/FichaSaeContext';

export function TripsSection() {
  const { state, dispatch } = useFichaSae();

  const trips = state.trips;

  function atualizar(
    campo: keyof typeof trips,
    valor: number
  ) {
    dispatch({
      type: 'SET_TRIPS',

      payload: {
        ...trips,
        [campo]: valor,
      },
    });
  }

  const preenchida =
    trips.temperatura !== null &&
    trips.pressaoSistolica !== null &&
    trips.estadoNeurologico !== null &&
    trips.statusRespiratorio !== null;

  const total = preenchida
    ? trips.temperatura! +
      trips.pressaoSistolica! +
      trips.estadoNeurologico! +
      trips.statusRespiratorio!
    : null;

  return (
    <View>
      <Text style={styles.sectionTitle}>
        ESTABILIDADE NO TRANSPORTE
      </Text>

      <Text style={styles.subtitle}>
        TRIPS
      </Text>

      <View style={styles.card}>
        <Text style={styles.question}>
          1. Temperatura Axilar
        </Text>

        <ScoreOption
          label="36.1°C - 37.6°C"
          points={0}
          selected={trips.temperatura === 0}
          onPress={() =>
            atualizar('temperatura', 0)
          }
        />

        <ScoreOption
          label="< 36.1°C ou > 37.6°C"
          points={6}
          selected={trips.temperatura === 6}
          onPress={() =>
            atualizar('temperatura', 6)
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>
          2. P.A Sistólica
        </Text>

        <ScoreOption
          label="> 40 mmHg"
          points={0}
          selected={
            trips.pressaoSistolica === 0
          }
          onPress={() =>
            atualizar('pressaoSistolica', 0)
          }
        />

        <ScoreOption
          label="31 - 40 mmHg"
          points={8}
          selected={
            trips.pressaoSistolica === 8
          }
          onPress={() =>
            atualizar('pressaoSistolica', 8)
          }
        />

        <ScoreOption
          label="20 - 30 mmHg"
          points={19}
          selected={
            trips.pressaoSistolica === 19
          }
          onPress={() =>
            atualizar('pressaoSistolica', 19)
          }
        />

        <ScoreOption
          label="< 20 mmHg"
          points={24}
          selected={
            trips.pressaoSistolica === 24
          }
          onPress={() =>
            atualizar('pressaoSistolica', 24)
          }
        />

        <ScoreOption
          label="Uso de Vasopressores"
          points={15}
          selected={
            trips.pressaoSistolica === 15
          }
          onPress={() =>
            atualizar('pressaoSistolica', 15)
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>
          3. Estado Neurológico
        </Text>

        <ScoreOption
          label="Ativo, chorando"
          points={0}
          selected={
            trips.estadoNeurologico === 0
          }
          onPress={() =>
            atualizar(
              'estadoNeurologico',
              0
            )
          }
        />

        <ScoreOption
          label="Letárgico, não chora"
          points={10}
          selected={
            trips.estadoNeurologico === 10
          }
          onPress={() =>
            atualizar(
              'estadoNeurologico',
              10
            )
          }
        />

        <ScoreOption
          label="Sem resposta / Convulsão / Relaxante"
          points={21}
          selected={
            trips.estadoNeurologico === 21
          }
          onPress={() =>
            atualizar(
              'estadoNeurologico',
              21
            )
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>
          4. Status Respiratório
        </Text>

        <ScoreOption
          label="Sem necessidade de suporte"
          points={0}
          selected={
            trips.statusRespiratorio === 0
          }
          onPress={() =>
            atualizar(
              'statusRespiratorio',
              0
            )
          }
        />

        <ScoreOption
          label="Suporte com FiO2 ≤ 0.49"
          points={5}
          selected={
            trips.statusRespiratorio === 5
          }
          onPress={() =>
            atualizar(
              'statusRespiratorio',
              5
            )
          }
        />

        <ScoreOption
          label="Suporte com FiO2 0.50 - 0.74"
          points={15}
          selected={
            trips.statusRespiratorio === 15
          }
          onPress={() =>
            atualizar(
              'statusRespiratorio',
              15
            )
          }
        />

        <ScoreOption
          label="Suporte com FiO2 0.75 - 1.00"
          points={18}
          selected={
            trips.statusRespiratorio === 18
          }
          onPress={() =>
            atualizar(
              'statusRespiratorio',
              18
            )
          }
        />

        <ScoreOption
          label="Apnéia ou Gasping"
          points={30}
          selected={
            trips.statusRespiratorio === 30
          }
          onPress={() =>
            atualizar(
              'statusRespiratorio',
              30
            )
          }
        />
      </View>

      <ScoreResultCard
        label="SCORE TRIPS (INSTABILIDADE)"
        value={
          total === null
            ? '--'
            : `${total} pontos`
        }
        status=""
        backgroundColor={Colors.primary}
        badge="NEONATAL"
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
    fontWeight: '700',
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