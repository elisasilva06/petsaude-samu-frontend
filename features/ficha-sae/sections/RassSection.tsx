import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';

import { ScoreOption } from '../components/ScoreOption';
import { ScoreResultCard } from '../components/ScoreResultCard';
import { useFichaSae } from '../context/FichaSaeContext';

const BLUE = '#0277BD';

const RASS_OPTIONS = [
  {
    label: '(+4) Agressivo',
    description: 'Violento, perigoso.',
    points: 4,
  },
  {
    label: '(+3) Muito agitado',
    description:
      'Conduta agressiva, remoção de tubos.',
    points: 3,
  },
  {
    label: '(+2) Agitado',
    description:
      'Movimentos sem coordenação frequente.',
    points: 2,
  },
  {
    label: '(+1) Inquieto',
    description:
      'Ansioso, mas sem movimentos vigorosos.',
    points: 1,
  },
  {
    label: '(0) Alerta e Calmo',
    description: 'Estado normal.',
    points: 0,
  },
  {
    label: '(-1) Sonolento',
    description:
      'Acorda ao chamado e mantém olhos abertos (>10s).',
    points: -1,
  },
  {
    label: '(-2) Sedação leve',
    description:
      'Acorda ao chamado com contato visual (<10s).',
    points: -2,
  },
  {
    label: '(-3) Sedação moderada',
    description:
      'Movimenta-se ao chamado, sem contato visual.',
    points: -3,
  },
  {
    label: '(-4) Sedação profunda',
    description:
      'Responde apenas a estímulo físico.',
    points: -4,
  },
  {
    label: '(-5) Não desperta',
    description:
      'Sem resposta à voz ou estímulo físico.',
    points: -5,
  },
];

export function RassSection() {
  const { state, dispatch } = useFichaSae();

  const score = state.rass.score;

  function selecionar(valor: number) {
    dispatch({
      type: 'SET_RASS',

      payload: {
        score: valor,
      },
    });
  }

  function obterStatus() {
    if (score === null) {
      return {
        label: 'SELECIONE',
        color: Colors.muted,
      };
    }

    if (score > 0) {
      return {
        label: 'AGITADO',
        color: Colors.danger,
      };
    }

    if (score === 0) {
      return {
        label: 'ALERTA / CALMO',
        color: Colors.success,
      };
    }

    return {
      label: 'SEDADO',
      color: BLUE,
    };
  }

  const status = obterStatus();

  return (
    <View>
      <Text style={styles.sectionTitle}>
        ESCALA DE RASS
      </Text>

      <Text style={styles.subtitle}>
        Agitação e Sedação
      </Text>

      <View style={styles.card}>
        {RASS_OPTIONS.map((option) => (
          <ScoreOption
            key={option.points}
            label={option.label}
            description={option.description}
            points={option.points}
            pointsLabel={
              option.points > 0
                ? `+${option.points}`
                : `${option.points}`
            }
            selected={score === option.points}
            onPress={() =>
              selecionar(option.points)
            }
            badgeBackgroundColor={
              option.points > 0
                ? '#FFEBEE'
                : option.points < 0
                  ? '#E3F2FD'
                  : '#E8F5E9'
            }
          />
        ))}
      </View>

      <ScoreResultCard
        label="PONTUAÇÃO RASS"
        value={
          score === null
            ? '--'
            : score > 0
              ? `+${score}`
              : `${score}`
        }
        status={status.label}
        backgroundColor={status.color}
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
    padding: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },
});