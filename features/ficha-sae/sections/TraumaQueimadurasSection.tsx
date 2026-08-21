import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';

import { CheckListItem } from '../components/CheckListItem';
import { useFichaSae } from '../context/FichaSaeContext';

const PARTES_CORPO = [
  'Cabeça/Pescoço (9%)',
  'Tronco Ant. (18%)',
  'Tronco Post. (18%)',
  'Braço D (9%)',
  'Braço E (9%)',
  'Perna D (18%)',
  'Perna E (18%)',
  'Genitais (1%)',
  'Mão D',
  'Mão E',
  'Pé D',
  'Pé E',
];

export function TraumaQueimadurasSection() {
  const { state, dispatch } = useFichaSae();

  const trauma = state.traumaQueimaduras;

  function atualizar(
    campo: keyof typeof trauma,
    valor: string | string[] | null
  ) {
    dispatch({
      type: 'SET_TRAUMA_QUEIMADURAS',

      payload: {
        ...trauma,
        [campo]: valor,
      },
    });
  }

  function alternarLesao(parte: string) {
    const selecionada =
      trauma.lesoes.includes(parte);

    const novasLesoes = selecionada
      ? trauma.lesoes.filter(
          (item) => item !== parte
        )
      : [...trauma.lesoes, parte];

    atualizar(
      'lesoes',
      novasLesoes
    );
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>
        TRAUMA E QUEIMADURAS
      </Text>

      <View style={styles.card}>
        <Text style={styles.subTitle}>
          MECANISMO DO TRAUMA
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: Queda de altura, colisão frontal, FAB..."
          placeholderTextColor={Colors.muted}
          value={trauma.mecanismo}
          onChangeText={(valor) =>
            atualizar('mecanismo', valor)
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.subTitle}>
          LOCALIZAÇÃO DAS LESÕES
        </Text>

        <Text style={styles.helperText}>
          Regra dos Nove — selecione as áreas
          afetadas:
        </Text>

        {PARTES_CORPO.map((parte) => (
          <CheckListItem
            key={parte}
            label={parte}
            selected={
              trauma.lesoes.includes(parte)
            }
            onPress={() =>
              alternarLesao(parte)
            }
            accentColor={Colors.danger}
            selectedBackgroundColor={
              Colors.dangerSurface
            }
          />
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.subTitle}>
          DETALHES DA QUEIMADURA
        </Text>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>
              % SCQ TOTAL
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Ex.: 27"
              placeholderTextColor={Colors.muted}
              value={trauma.scqTotal}
              onChangeText={(valor) =>
                atualizar(
                  'scqTotal',
                  valor
                )
              }
            />
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>
              GRAU
            </Text>

            <View style={styles.degreeRow}>
              {['1º', '2º', '3º'].map(
                (grau) => {
                  const selecionado =
                    trauma.grauQueimadura ===
                    grau;

                  return (
                    <TouchableOpacity
                      key={grau}
                      style={[
                        styles.degreeButton,

                        selecionado &&
                          styles.degreeButtonActive,
                      ]}
                      onPress={() =>
                        atualizar(
                          'grauQueimadura',
                          grau
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.degreeText,

                          selecionado &&
                            styles.degreeTextActive,
                        ]}
                      >
                        {grau}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.subTitle}>
          OBSERVAÇÕES DO TRAUMA
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
          ]}
          multiline
          placeholder="Descreva deformidades, crepitações ou detalhes das lesões..."
          placeholderTextColor={Colors.muted}
          value={trauma.observacoes}
          onChangeText={(valor) =>
            atualizar(
              'observacoes',
              valor
            )
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 15,
    color: Colors.danger,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

  card: {
    marginBottom: 14,
    padding: 15,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },

  subTitle: {
    marginBottom: 10,
    paddingBottom: 7,
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  helperText: {
    marginBottom: 10,
    color: Colors.textSecondary,
    fontSize: 11,
  },

  label: {
    marginBottom: 6,
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },

  input: {
    minHeight: 47,
    paddingHorizontal: 11,
    color: Colors.text,
    fontSize: 14,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 9,
  },

  multilineInput: {
    minHeight: 90,
    paddingTop: 11,
    textAlignVertical: 'top',
  },

  row: {
    flexDirection: 'row',
    gap: 10,
  },

  half: {
    flex: 1,
  },

  degreeRow: {
    flexDirection: 'row',
    gap: 5,
  },

  degreeButton: {
    flex: 1,
    minHeight: 47,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 7,
  },

  degreeButtonActive: {
    backgroundColor: Colors.danger,
    borderColor: Colors.danger,
  },

  degreeText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },

  degreeTextActive: {
    color: Colors.background,
  },
});