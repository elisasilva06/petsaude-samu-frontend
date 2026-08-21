import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useFichaSae } from '../context/FichaSaeContext';
import { SexoPaciente } from '../types';

export function IdentificacaoSection() {
  const { state, dispatch } = useFichaSae();

  const identificacao = state.identificacao;

  function atualizarChamado(
    campo: keyof typeof identificacao.chamado,
    valor: string
  ) {
    dispatch({
      type: 'SET_IDENTIFICACAO',
      payload: {
        ...identificacao,

        chamado: {
          ...identificacao.chamado,
          [campo]: valor,
        },
      },
    });
  }

  function atualizarHorario(
    campo: keyof typeof identificacao.chamado.horarios,
    valor: string
  ) {
    dispatch({
      type: 'SET_IDENTIFICACAO',
      payload: {
        ...identificacao,

        chamado: {
          ...identificacao.chamado,

          horarios: {
            ...identificacao.chamado.horarios,
            [campo]: valor,
          },
        },
      },
    });
  }

  function atualizarPaciente(
    campo: keyof typeof identificacao.paciente,
    valor: string | SexoPaciente
  ) {
    dispatch({
      type: 'SET_IDENTIFICACAO',
      payload: {
        ...identificacao,

        paciente: {
          ...identificacao.paciente,
          [campo]: valor,
        },
      },
    });
  }

  function atualizarTipoOcorrencia(valor: string) {
    dispatch({
      type: 'SET_IDENTIFICACAO',
      payload: {
        ...identificacao,
        tipoOcorrencia: valor,
      },
    });
  }

  return (
    <View style={styles.container}>
      {/* DADOS DO CHAMADO */}

      <Text style={styles.groupTitle}>
        Dados do chamado
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Número do chamado
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: 00125"
          placeholderTextColor={Colors.muted}
          value={identificacao.chamado.numero}
          onChangeText={(valor) =>
            atualizarChamado('numero', valor)
          }
        />

        <Text style={styles.label}>
          Data
        </Text>

        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          placeholderTextColor={Colors.muted}
          value={identificacao.chamado.data}
          onChangeText={(valor) =>
            atualizarChamado('data', valor)
          }
        />

        <Text style={styles.label}>
          Endereço
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Endereço da ocorrência"
          placeholderTextColor={Colors.muted}
          value={identificacao.chamado.endereco}
          onChangeText={(valor) =>
            atualizarChamado('endereco', valor)
          }
        />

        <Text style={styles.label}>
          Ponto de referência
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ponto de referência"
          placeholderTextColor={Colors.muted}
          value={
            identificacao.chamado.pontoReferencia
          }
          onChangeText={(valor) =>
            atualizarChamado(
              'pontoReferencia',
              valor
            )
          }
        />
      </View>

      {/* HORÁRIOS */}

      <Text style={styles.groupTitle}>
        Horários
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>
              Saída da base
            </Text>

            <TextInput
              style={styles.input}
              placeholder="00:00"
              placeholderTextColor={Colors.muted}
              value={
                identificacao.chamado.horarios
                  .saidaBase
              }
              onChangeText={(valor) =>
                atualizarHorario(
                  'saidaBase',
                  valor
                )
              }
            />
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>
              Chegada ao local
            </Text>

            <TextInput
              style={styles.input}
              placeholder="00:00"
              placeholderTextColor={Colors.muted}
              value={
                identificacao.chamado.horarios
                  .chegadaLocal
              }
              onChangeText={(valor) =>
                atualizarHorario(
                  'chegadaLocal',
                  valor
                )
              }
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>
              Saída do local
            </Text>

            <TextInput
              style={styles.input}
              placeholder="00:00"
              placeholderTextColor={Colors.muted}
              value={
                identificacao.chamado.horarios
                  .saidaLocal
              }
              onChangeText={(valor) =>
                atualizarHorario(
                  'saidaLocal',
                  valor
                )
              }
            />
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>
              Chegada ao destino
            </Text>

            <TextInput
              style={styles.input}
              placeholder="00:00"
              placeholderTextColor={Colors.muted}
              value={
                identificacao.chamado.horarios
                  .chegadaDestino
              }
              onChangeText={(valor) =>
                atualizarHorario(
                  'chegadaDestino',
                  valor
                )
              }
            />
          </View>
        </View>
      </View>

      {/* PACIENTE */}

      <Text style={styles.groupTitle}>
        Identificação do paciente
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Nome
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor={Colors.muted}
          value={identificacao.paciente.nome}
          onChangeText={(valor) =>
            atualizarPaciente('nome', valor)
          }
        />

        <Text style={styles.label}>
          Nome social
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nome social, se aplicável"
          placeholderTextColor={Colors.muted}
          value={
            identificacao.paciente.nomeSocial
          }
          onChangeText={(valor) =>
            atualizarPaciente(
              'nomeSocial',
              valor
            )
          }
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>
              Idade
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Idade"
              keyboardType="numeric"
              placeholderTextColor={Colors.muted}
              value={identificacao.paciente.idade}
              onChangeText={(valor) =>
                atualizarPaciente(
                  'idade',
                  valor
                )
              }
            />
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>
              Sexo
            </Text>

            <View style={styles.optionRow}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  identificacao.paciente.sexo ===
                    'M' &&
                    styles.optionButtonActive,
                ]}
                onPress={() =>
                  atualizarPaciente(
                    'sexo',
                    'M'
                  )
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    identificacao.paciente.sexo ===
                      'M' &&
                      styles.optionTextActive,
                  ]}
                >
                  M
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  identificacao.paciente.sexo ===
                    'F' &&
                    styles.optionButtonActive,
                ]}
                onPress={() =>
                  atualizarPaciente(
                    'sexo',
                    'F'
                  )
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    identificacao.paciente.sexo ===
                      'F' &&
                      styles.optionTextActive,
                  ]}
                >
                  F
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* TIPO DA OCORRÊNCIA */}

      <Text style={styles.groupTitle}>
        Tipo de ocorrência
      </Text>

      <View style={styles.card}>
        <View style={styles.typeContainer}>
          {[
            'Clínica',
            'Trauma',
            'Obstétrica',
            'Psiquiátrica',
            'Pediátrica',
            'Outra',
          ].map((tipo) => {
            const selecionado =
              identificacao.tipoOcorrencia ===
              tipo;

            return (
              <TouchableOpacity
                key={tipo}
                style={[
                  styles.typeButton,
                  selecionado &&
                    styles.typeButtonActive,
                ]}
                onPress={() =>
                  atualizarTipoOcorrencia(tipo)
                }
              >
                <Text
                  style={[
                    styles.typeText,
                    selecionado &&
                      styles.typeTextActive,
                  ]}
                >
                  {tipo}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },

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
    marginBottom: 6,
    color: Colors.textLabel,
    fontSize: 12,
    fontWeight: '700',
  },

  input: {
    minHeight: 48,
    marginBottom: 14,
    paddingHorizontal: 13,
    color: Colors.text,
    fontSize: 14,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },

  row: {
    flexDirection: 'row',
    gap: 10,
  },

  half: {
    flex: 1,
  },

  optionRow: {
    flexDirection: 'row',
    gap: 8,
  },

  optionButton: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },

  optionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  optionText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },

  optionTextActive: {
    color: Colors.background,
  },

  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  typeButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
  },

  typeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  typeText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },

  typeTextActive: {
    color: Colors.background,
  },
});