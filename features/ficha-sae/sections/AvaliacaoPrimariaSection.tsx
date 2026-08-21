import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useFichaSae } from '../context/FichaSaeContext';

type CheckOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function CheckOption({
  label,
  selected,
  onPress,
}: CheckOptionProps) {
  return (
    <TouchableOpacity
      style={[
        styles.checkOption,
        selected && styles.checkOptionActive,
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
          styles.checkLabel,
          selected && styles.checkLabelActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

type ChoiceOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function ChoiceOption({
  label,
  selected,
  onPress,
}: ChoiceOptionProps) {
  return (
    <TouchableOpacity
      style={[
        styles.choiceOption,
        selected && styles.choiceOptionActive,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.choiceText,
          selected && styles.choiceTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function AvaliacaoPrimariaSection() {
  const { state, dispatch } = useFichaSae();

  const avaliacao = state.avaliacaoPrimaria;

  function atualizarHemorragias(
    campo: keyof typeof avaliacao.hemorragias,
    valor: boolean | string
  ) {
    dispatch({
      type: 'SET_AVALIACAO_PRIMARIA',
      payload: {
        ...avaliacao,

        hemorragias: {
          ...avaliacao.hemorragias,
          [campo]: valor,
        },
      },
    });
  }

  function atualizarViasAereas(
    campo: keyof typeof avaliacao.viasAereas,
    valor: boolean
  ) {
    dispatch({
      type: 'SET_AVALIACAO_PRIMARIA',
      payload: {
        ...avaliacao,

        viasAereas: {
          ...avaliacao.viasAereas,
          [campo]: valor,
        },
      },
    });
  }

  function atualizarControleColuna(
    campo: keyof typeof avaliacao.controleColuna,
    valor: boolean
  ) {
    dispatch({
      type: 'SET_AVALIACAO_PRIMARIA',
      payload: {
        ...avaliacao,

        controleColuna: {
          ...avaliacao.controleColuna,
          [campo]: valor,
        },
      },
    });
  }

  function atualizarRespiracao(
    campo: keyof typeof avaliacao.respiracao,
    valor: string | null
  ) {
    dispatch({
      type: 'SET_AVALIACAO_PRIMARIA',
      payload: {
        ...avaliacao,

        respiracao: {
          ...avaliacao.respiracao,
          [campo]: valor,
        },
      },
    });
  }

  return (
    <View>
      {/* X — HEMORRAGIAS */}
      <Text style={styles.groupTitle}>
        X — Hemorragias
      </Text>

      <View style={styles.card}>
        <Text style={styles.helperText}>
          Medidas realizadas
        </Text>

        <View style={styles.optionsContainer}>
          <CheckOption
            label="Contenção"
            selected={
              avaliacao.hemorragias.contencao
            }
            onPress={() =>
              atualizarHemorragias(
                'contencao',
                !avaliacao.hemorragias.contencao
              )
            }
          />

          <CheckOption
            label="Compressão"
            selected={
              avaliacao.hemorragias.compressao
            }
            onPress={() =>
              atualizarHemorragias(
                'compressao',
                !avaliacao.hemorragias.compressao
              )
            }
          />

          <CheckOption
            label="Preenchimento"
            selected={
              avaliacao.hemorragias.preenchimento
            }
            onPress={() =>
              atualizarHemorragias(
                'preenchimento',
                !avaliacao.hemorragias.preenchimento
              )
            }
          />

          <CheckOption
            label="Torniquete"
            selected={
              avaliacao.hemorragias.torniquete
            }
            onPress={() =>
              atualizarHemorragias(
                'torniquete',
                !avaliacao.hemorragias.torniquete
              )
            }
          />
        </View>

        <Text style={styles.label}>
          Hemorragia direta / observação
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
          ]}
          multiline
          placeholder="Descreva, se necessário"
          placeholderTextColor={Colors.muted}
          value={
            avaliacao.hemorragias.hemorragiaDireta
          }
          onChangeText={(valor) =>
            atualizarHemorragias(
              'hemorragiaDireta',
              valor
            )
          }
        />
      </View>

      {/* A — VIAS AÉREAS */}
      <Text style={styles.groupTitle}>
        A — Vias Aéreas
      </Text>

      <View style={styles.card}>
        <View style={styles.optionsContainer}>
          <CheckOption
            label="Pérvias"
            selected={avaliacao.viasAereas.pervias}
            onPress={() =>
              atualizarViasAereas(
                'pervias',
                !avaliacao.viasAereas.pervias
              )
            }
          />

          <CheckOption
            label="Obstruídas"
            selected={avaliacao.viasAereas.obstruidas}
            onPress={() =>
              atualizarViasAereas(
                'obstruidas',
                !avaliacao.viasAereas.obstruidas
              )
            }
          />

          <CheckOption
            label="Parcialmente obstruídas"
            selected={
              avaliacao.viasAereas
                .parcialmenteObstruidas
            }
            onPress={() =>
              atualizarViasAereas(
                'parcialmenteObstruidas',
                !avaliacao.viasAereas
                  .parcialmenteObstruidas
              )
            }
          />

          <CheckOption
            label="Aspiração"
            selected={avaliacao.viasAereas.aspiracao}
            onPress={() =>
              atualizarViasAereas(
                'aspiracao',
                !avaliacao.viasAereas.aspiracao
              )
            }
          />

          <CheckOption
            label="Guedel"
            selected={avaliacao.viasAereas.guedel}
            onPress={() =>
              atualizarViasAereas(
                'guedel',
                !avaliacao.viasAereas.guedel
              )
            }
          />

          <CheckOption
            label="Intubação"
            selected={avaliacao.viasAereas.intubacao}
            onPress={() =>
              atualizarViasAereas(
                'intubacao',
                !avaliacao.viasAereas.intubacao
              )
            }
          />

          <CheckOption
            label="Cricotireoidostomia"
            selected={
              avaliacao.viasAereas
                .cricotireoidostomia
            }
            onPress={() =>
              atualizarViasAereas(
                'cricotireoidostomia',
                !avaliacao.viasAereas
                  .cricotireoidostomia
              )
            }
          />
        </View>
      </View>

      {/* CONTROLE DA COLUNA */}
      <Text style={styles.groupTitle}>
        Controle da Coluna
      </Text>

      <View style={styles.card}>
        <View style={styles.optionsContainer}>
          <CheckOption
            label="Colar cervical"
            selected={
              avaliacao.controleColuna
                .colarCervical
            }
            onPress={() =>
              atualizarControleColuna(
                'colarCervical',
                !avaliacao.controleColuna
                  .colarCervical
              )
            }
          />

          <CheckOption
            label="Talas"
            selected={
              avaliacao.controleColuna.talas
            }
            onPress={() =>
              atualizarControleColuna(
                'talas',
                !avaliacao.controleColuna.talas
              )
            }
          />

          <CheckOption
            label="Protetor lateral"
            selected={
              avaliacao.controleColuna
                .protetorLateral
            }
            onPress={() =>
              atualizarControleColuna(
                'protetorLateral',
                !avaliacao.controleColuna
                  .protetorLateral
              )
            }
          />

          <CheckOption
            label="Head Block"
            selected={
              avaliacao.controleColuna.headBlock
            }
            onPress={() =>
              atualizarControleColuna(
                'headBlock',
                !avaliacao.controleColuna.headBlock
              )
            }
          />

          <CheckOption
            label="Prancha"
            selected={
              avaliacao.controleColuna.prancha
            }
            onPress={() =>
              atualizarControleColuna(
                'prancha',
                !avaliacao.controleColuna.prancha
              )
            }
          />
        </View>
      </View>

      {/* B — RESPIRAÇÃO */}
      <Text style={styles.groupTitle}>
        B — Respiração
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Padrão respiratório
        </Text>

        <View style={styles.choiceContainer}>
          {[
            'Eupneico',
            'Taquipneico',
            'Bradipneico',
            'Apneia',
          ].map((opcao) => (
            <ChoiceOption
              key={opcao}
              label={opcao}
              selected={
                avaliacao.respiracao.padrao ===
                opcao
              }
              onPress={() =>
                atualizarRespiracao(
                  'padrao',
                  opcao
                )
              }
            />
          ))}
        </View>

        <Text style={styles.label}>
          Suporte respiratório
        </Text>

        <View style={styles.choiceContainer}>
          {[
            'Ar ambiente',
            'Cateter nasal',
            'Máscara',
            'Ventilação mecânica',
          ].map((opcao) => (
            <ChoiceOption
              key={opcao}
              label={opcao}
              selected={
                avaliacao.respiracao.suporte ===
                opcao
              }
              onPress={() =>
                atualizarRespiracao(
                  'suporte',
                  opcao
                )
              }
            />
          ))}
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>
              FiO₂
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex.: 40%"
              placeholderTextColor={Colors.muted}
              value={avaliacao.respiracao.fio2}
              onChangeText={(valor) =>
                atualizarRespiracao(
                  'fio2',
                  valor
                )
              }
            />
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>
              TOT
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Informar"
              placeholderTextColor={Colors.muted}
              value={avaliacao.respiracao.tot}
              onChangeText={(valor) =>
                atualizarRespiracao(
                  'tot',
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

  helperText: {
    marginBottom: 12,
    color: Colors.textSecondary,
    fontSize: 12,
  },

  optionsContainer: {
    gap: 8,
    marginBottom: 14,
  },

  checkOption: {
    minHeight: 44,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },

  checkOptionActive: {
    backgroundColor: Colors.surfaceSecondary,
    borderColor: Colors.primary,
  },

  checkbox: {
    width: 21,
    height: 21,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
  },

  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  checkmark: {
    color: Colors.background,
    fontSize: 13,
    fontWeight: '900',
  },

  checkLabel: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },

  checkLabelActive: {
    color: Colors.text,
  },

  label: {
    marginTop: 4,
    marginBottom: 7,
    color: Colors.textLabel,
    fontSize: 12,
    fontWeight: '700',
  },

  input: {
    minHeight: 48,
    paddingHorizontal: 13,
    color: Colors.text,
    fontSize: 14,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },

  multilineInput: {
    minHeight: 90,
    paddingTop: 12,
    textAlignVertical: 'top',
  },

  choiceContainer: {
    marginBottom: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  choiceOption: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
  },

  choiceOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  choiceText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },

  choiceTextActive: {
    color: Colors.background,
  },

  row: {
    flexDirection: 'row',
    gap: 10,
  },

  half: {
    flex: 1,
  },
});