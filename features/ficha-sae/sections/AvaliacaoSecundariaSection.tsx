import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useFichaSae } from '../context/FichaSaeContext';

type SelectOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function SelectOption({
  label,
  selected,
  onPress,
}: SelectOptionProps) {
  return (
    <TouchableOpacity
      style={[
        styles.selectOption,
        selected && styles.selectOptionActive,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.checkbox,
          selected && styles.checkboxActive,
        ]}
      >
        {selected && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>

      <Text
        style={[
          styles.selectText,
          selected && styles.selectTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function AvaliacaoSecundariaSection() {
  const { state, dispatch } = useFichaSae();

  const avaliacao =
    state.avaliacaoSecundaria;

  function atualizarSinaisVitais(
    campo: keyof typeof avaliacao.sinaisVitais,
    valor: string
  ) {
    dispatch({
      type: 'SET_AVALIACAO_SECUNDARIA',

      payload: {
        ...avaliacao,

        sinaisVitais: {
          ...avaliacao.sinaisVitais,
          [campo]: valor,
        },
      },
    });
  }

  function atualizarSampla(
    campo: keyof typeof avaliacao.sampla,
    valor: string | boolean | null
  ) {
    dispatch({
      type: 'SET_AVALIACAO_SECUNDARIA',

      payload: {
        ...avaliacao,

        sampla: {
          ...avaliacao.sampla,
          [campo]: valor,
        },
      },
    });
  }

  function atualizarBalanco(
    campo: keyof typeof avaliacao.balancoSuporte,
    valor: string | null
  ) {
    dispatch({
      type: 'SET_AVALIACAO_SECUNDARIA',

      payload: {
        ...avaliacao,

        balancoSuporte: {
          ...avaliacao.balancoSuporte,
          [campo]: valor,
        },
      },
    });
  }

  function atualizarSaida(
    campo: keyof typeof avaliacao.balancoSuporte.saidas,
    valor: string
  ) {
    dispatch({
      type: 'SET_AVALIACAO_SECUNDARIA',

      payload: {
        ...avaliacao,

        balancoSuporte: {
          ...avaliacao.balancoSuporte,

          saidas: {
            ...avaliacao.balancoSuporte.saidas,
            [campo]: valor,
          },
        },
      },
    });
  }

  return (
    <View>
      {/* SINAIS VITAIS */}
      <Text style={styles.groupTitle}>
        S — Sinais Vitais
      </Text>

      <View style={styles.card}>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>
              PA
            </Text>

            <TextInput
              style={styles.input}
              placeholder="00/00"
              placeholderTextColor={Colors.muted}
              value={
                avaliacao.sinaisVitais.pa
              }
              onChangeText={(valor) =>
                atualizarSinaisVitais(
                  'pa',
                  valor
                )
              }
            />
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.label}>
              FC
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="bpm"
              placeholderTextColor={Colors.muted}
              value={
                avaliacao.sinaisVitais.fc
              }
              onChangeText={(valor) =>
                atualizarSinaisVitais(
                  'fc',
                  valor
                )
              }
            />
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.label}>
              FR
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="irpm"
              placeholderTextColor={Colors.muted}
              value={
                avaliacao.sinaisVitais.fr
              }
              onChangeText={(valor) =>
                atualizarSinaisVitais(
                  'fr',
                  valor
                )
              }
            />
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.label}>
              SPO2
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="%"
              placeholderTextColor={Colors.muted}
              value={
                avaliacao.sinaisVitais.spo2
              }
              onChangeText={(valor) =>
                atualizarSinaisVitais(
                  'spo2',
                  valor
                )
              }
            />
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.label}>
              TAX
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="°C"
              placeholderTextColor={Colors.muted}
              value={
                avaliacao.sinaisVitais.tax
              }
              onChangeText={(valor) =>
                atualizarSinaisVitais(
                  'tax',
                  valor
                )
              }
            />
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.label}>
              GLI
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="mg/dL"
              placeholderTextColor={Colors.muted}
              value={
                avaliacao.sinaisVitais.glicemia
              }
              onChangeText={(valor) =>
                atualizarSinaisVitais(
                  'glicemia',
                  valor
                )
              }
            />
          </View>
        </View>
      </View>

      {/* SAMPLA */}
      <Text style={styles.groupTitle}>
        Histórico — SAMPLA
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          A — Alergias
        </Text>

        <View style={styles.optionsRow}>
          <SelectOption
            label="Não"
            selected={
              avaliacao.sampla.temAlergia ===
              false
            }
            onPress={() =>
              atualizarSampla(
                'temAlergia',
                false
              )
            }
          />

          <SelectOption
            label="Sim"
            selected={
              avaliacao.sampla.temAlergia ===
              true
            }
            onPress={() =>
              atualizarSampla(
                'temAlergia',
                true
              )
            }
          />
        </View>

        {avaliacao.sampla.temAlergia ===
          true && (
          <>
            <Text style={styles.label}>
              Qual alergia?
            </Text>

            <TextInput
              style={styles.inputFull}
              placeholder="Informe a alergia"
              placeholderTextColor={
                Colors.muted
              }
              value={
                avaliacao.sampla
                  .alergiaQual
              }
              onChangeText={(valor) =>
                atualizarSampla(
                  'alergiaQual',
                  valor
                )
              }
            />
          </>
        )}

        <Text style={styles.label}>
          M — Medicações em uso
        </Text>

        <TextInput
          style={[
            styles.inputFull,
            styles.multilineInput,
          ]}
          multiline
          placeholder="Informe as medicações"
          placeholderTextColor={Colors.muted}
          value={
            avaliacao.sampla.medicacoes
          }
          onChangeText={(valor) =>
            atualizarSampla(
              'medicacoes',
              valor
            )
          }
        />

        <Text style={styles.label}>
          P — Passado médico
        </Text>

        <TextInput
          style={[
            styles.inputFull,
            styles.multilineInput,
          ]}
          multiline
          placeholder="Histórico médico relevante"
          placeholderTextColor={Colors.muted}
          value={
            avaliacao.sampla.passadoMedico
          }
          onChangeText={(valor) =>
            atualizarSampla(
              'passadoMedico',
              valor
            )
          }
        />

        <Text style={styles.label}>
          L — Líquidos e alimentos
        </Text>

        <TextInput
          style={styles.inputFull}
          placeholder="Última ingestão"
          placeholderTextColor={Colors.muted}
          value={
            avaliacao.sampla
              .liquidosAlimentos
          }
          onChangeText={(valor) =>
            atualizarSampla(
              'liquidosAlimentos',
              valor
            )
          }
        />
      </View>

      {/* BALANÇO E SUPORTE */}
      <Text style={styles.groupTitle}>
        Balanço e Suporte
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Via de administração
        </Text>

        <View style={styles.optionsWrap}>
          {[
            'VO',
            'SNE',
            'SNG',
            'Gastrostomia',
            'Parenteral',
          ].map((opcao) => (
            <SelectOption
              key={opcao}
              label={opcao}
              selected={
                avaliacao.balancoSuporte
                  .viaAdministracao === opcao
              }
              onPress={() =>
                atualizarBalanco(
                  'viaAdministracao',
                  opcao
                )
              }
            />
          ))}
        </View>

        <Text style={styles.label}>
          Solução
        </Text>

        <View style={styles.optionsWrap}>
          {[
            'Ringer',
            'SF 0,9%',
            'SG 0,5%',
          ].map((opcao) => (
            <SelectOption
              key={opcao}
              label={opcao}
              selected={
                avaliacao.balancoSuporte
                  .solucao === opcao
              }
              onPress={() =>
                atualizarBalanco(
                  'solucao',
                  opcao
                )
              }
            />
          ))}
        </View>

        <View style={styles.twoColumns}>
          <View style={styles.half}>
            <Text style={styles.label}>
              Sedação
            </Text>

            <TextInput
              style={styles.inputFull}
              placeholder="Informar"
              placeholderTextColor={
                Colors.muted
              }
              value={
                avaliacao.balancoSuporte
                  .sedacao
              }
              onChangeText={(valor) =>
                atualizarBalanco(
                  'sedacao',
                  valor
                )
              }
            />
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>
              DVA
            </Text>

            <TextInput
              style={styles.inputFull}
              placeholder="Informar"
              placeholderTextColor={
                Colors.muted
              }
              value={
                avaliacao.balancoSuporte
                  .dva
              }
              onChangeText={(valor) =>
                atualizarBalanco(
                  'dva',
                  valor
                )
              }
            />
          </View>
        </View>

        <Text style={styles.subTitle}>
          Saídas (ml)
        </Text>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.smallLabel}>
              Vômito
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={
                avaliacao.balancoSuporte
                  .saidas.vomito
              }
              onChangeText={(valor) =>
                atualizarSaida(
                  'vomito',
                  valor
                )
              }
            />
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.smallLabel}>
              Evacuação
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={
                avaliacao.balancoSuporte
                  .saidas.evacuacao
              }
              onChangeText={(valor) =>
                atualizarSaida(
                  'evacuacao',
                  valor
                )
              }
            />
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.smallLabel}>
              Sangue
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={
                avaliacao.balancoSuporte
                  .saidas.sangue
              }
              onChangeText={(valor) =>
                atualizarSaida(
                  'sangue',
                  valor
                )
              }
            />
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.smallLabel}>
              Diurese
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={
                avaliacao.balancoSuporte
                  .saidas.diurese
              }
              onChangeText={(valor) =>
                atualizarSaida(
                  'diurese',
                  valor
                )
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupTitle: {
    marginTop: 10,
    marginBottom: 8,
    color: Colors.textLabel,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  card: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
  },

  label: {
    marginTop: 8,
    marginBottom: 6,
    color: Colors.textLabel,
    fontSize: 12,
    fontWeight: '700',
  },

  smallLabel: {
    marginBottom: 5,
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },

  subTitle: {
    marginTop: 18,
    marginBottom: 10,
    color: Colors.textLabel,
    fontSize: 12,
    fontWeight: '800',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  gridItem: {
    width: '31%',
    marginBottom: 10,
  },

  input: {
    minHeight: 45,
    paddingHorizontal: 10,
    color: Colors.text,
    fontSize: 13,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
  },

  inputFull: {
    minHeight: 48,
    paddingHorizontal: 12,
    color: Colors.text,
    fontSize: 14,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
  },

  multilineInput: {
    minHeight: 80,
    paddingTop: 11,
    textAlignVertical: 'top',
  },

  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 5,
  },

  optionsWrap: {
    marginBottom: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  selectOption: {
    minHeight: 40,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
  },

  selectOptionActive: {
    backgroundColor: Colors.surfaceSecondary,
    borderColor: Colors.primary,
  },

  checkbox: {
    width: 17,
    height: 17,
    marginRight: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderRadius: 4,
  },

  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  checkmark: {
    color: Colors.background,
    fontSize: 11,
    fontWeight: '900',
  },

  selectText: {
    color: Colors.text,
    fontSize: 11,
  },

  selectTextActive: {
    fontWeight: '700',
  },

  twoColumns: {
    flexDirection: 'row',
    gap: 10,
  },

  half: {
    flex: 1,
  },
});