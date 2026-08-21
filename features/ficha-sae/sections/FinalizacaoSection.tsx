import { Ionicons } from '@expo/vector-icons';

import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';

import { useFichaSae } from '../context/FichaSaeContext';

export function FinalizacaoSection() {
  const { state, dispatch } = useFichaSae();

  const finalizacao = state.finalizacao;

  function atualizar(
    campo: keyof typeof finalizacao,
    valor: string
  ) {
    dispatch({
      type: 'SET_FINALIZACAO',

      payload: {
        ...finalizacao,
        [campo]: valor,
      },
    });
  }

  return (
    <View>
      <View style={styles.headerSection}>
        <Ionicons
          name="shield-checkmark-outline"
          size={42}
          color={Colors.primary}
        />

        <Text style={styles.title}>
          Finalização da SAE
        </Text>

        <Text style={styles.subtitle}>
          Assinatura do Profissional Responsável
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          NOME COMPLETO
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nome do Enfermeiro(a)"
          placeholderTextColor={Colors.muted}
          value={
            finalizacao.nomeProfissional
          }
          onChangeText={(valor) =>
            atualizar(
              'nomeProfissional',
              valor
            )
          }
        />

        <Text style={styles.label}>
          COREN / MATRÍCULA
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: COREN-MA 123.456"
          placeholderTextColor={Colors.muted}
          value={
            finalizacao.corenMatricula
          }
          onChangeText={(valor) =>
            atualizar(
              'corenMatricula',
              valor
            )
          }
        />
      </View>

      <View style={styles.infoBox}>
        <Ionicons
          name="information-circle-outline"
          size={22}
          color={Colors.textSecondary}
        />

        <Text style={styles.infoText}>
          Ao concluir, esta ficha será enviada ao
          sistema. Verifique se as escalas Glasgow,
          RASS, Morse e TRIPS foram preenchidas.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    marginBottom: 25,
    alignItems: 'center',
  },

  title: {
    marginTop: 7,
    color: Colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 4,
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },

  card: {
    padding: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 15,
  },

  label: {
    marginTop: 8,
    marginBottom: 8,
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },

  input: {
    minHeight: 50,
    marginBottom: 13,
    paddingHorizontal: 14,
    color: Colors.text,
    fontSize: 15,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
  },

  infoBox: {
    marginTop: 22,
    padding: 15,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
  },

  infoText: {
    flex: 1,
    color: Colors.primary,
    fontSize: 12,
    lineHeight: 18,
  },
});