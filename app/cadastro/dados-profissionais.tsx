import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useCadastro } from '@/contexts/CadastroContext';

const ESTADOS_BRASILEIROS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const;

type CampoTocado =
  | 'profissao'
  | 'conselho'
  | 'registro'
  | 'uf';

type CamposTocados = Record<
  CampoTocado,
  boolean
>;

/**
 * Segunda etapa do cadastro.
 *
 * Esta tela coleta dados profissionais de maneira
 * neutra para atender diferentes integrantes da
 * equipe multidisciplinar.
 *
 * Exemplos de conselhos:
 * - CRM
 * - COREN
 * - CREFITO
 * - CRP
 * - CRESS
 *
 * O frontend NÃO assume que todo profissional é médico.
 *
 * Responsabilidades:
 * - coletar profissão;
 * - coletar conselho profissional;
 * - coletar número do registro;
 * - coletar UF do registro;
 * - coletar unidade de lotação;
 * - armazenar os dados no CadastroContext.
 *
 * Esta tela NÃO cria o cadastro na API.
 *
 * TODO(BACKEND):
 * Profissões, conselhos e unidades poderão futuramente
 * ser carregados da API. A tela não deve manter regras
 * rígidas de associação entre profissão e conselho.
 */
export default function DadosProfissionaisScreen() {
  const {
    dadosProfissionais,
    atualizarDadosProfissionais,
  } = useCadastro();

  const [
    modalUfVisivel,
    setModalUfVisivel,
  ] = useState(false);

  const [
    camposTocados,
    setCamposTocados,
  ] = useState<CamposTocados>({
    profissao: false,
    conselho: false,
    registro: false,
    uf: false,
  });

  /*
   * Validações de interface.
   *
   * Não validamos aqui se o número realmente existe
   * em um conselho profissional. Essa responsabilidade
   * deverá ficar com o backend.
   */

  const profissaoValida =
    dadosProfissionais.profissao
      .trim()
      .length >= 3;

  const conselhoValido =
    dadosProfissionais.conselho
      .trim()
      .length >= 2;

  /*
   * O registro não é tratado como número porque
   * diferentes conselhos podem utilizar formatos
   * distintos ou caracteres adicionais.
   */
  const registroValido =
    dadosProfissionais.registro
      .trim()
      .length >= 3;

  const ufValida =
    dadosProfissionais.uf.length === 2;

  const formularioValido =
    profissaoValida &&
    conselhoValido &&
    registroValido &&
    ufValida;

  function marcarCampoComoTocado(
    campo: CampoTocado
  ) {
    setCamposTocados(
      (estadoAtual) => ({
        ...estadoAtual,
        [campo]: true,
      })
    );
  }

  function selecionarUf(
    uf: string
  ) {
    atualizarDadosProfissionais({
      uf,
    });

    marcarCampoComoTocado('uf');

    setModalUfVisivel(false);
  }

  /**
   * Apenas avança para a terceira etapa.
   *
   * O cadastro ainda não é enviado ao backend.
   */
  function handleContinuar() {
    if (!formularioValido) {
      return;
    }

    /*
     * Mantemos temporariamente a rota existente.
     *
     * Na próxima revisão iremos transformar
     * "especialidades" em "áreas de atuação".
     */
    router.push(
      '/cadastro/especialidades'
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.replace(
                '/cadastro/dados-pessoais'
              )
            }
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Voltar para dados pessoais"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>

          <Text
            style={
              styles.headerTitle
            }
          >
            Criar conta
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
        >
          {/* ETAPA */}
          <Text style={styles.step}>
            Etapa 2 de 3
          </Text>

          <View
            style={styles.titleRow}
          >
            <View
              style={
                styles.iconContainer
              }
            >
              <Ionicons
                name="people-outline"
                size={24}
                color={Colors.primary}
              />
            </View>

            <Text style={styles.title}>
              Dados profissionais
            </Text>
          </View>

          <Text
            style={styles.description}
          >
            Informe seus dados
            profissionais para continuar
            o cadastro.
          </Text>

          {/* PROGRESSO */}
          <View
            style={
              styles.progressContainer
            }
          >
            <View
              style={
                styles.progressActive
              }
            />

            <View
              style={
                styles.progressActive
              }
            />

            <View
              style={
                styles.progressInactive
              }
            />
          </View>

          <View style={styles.form}>
            {/* PROFISSÃO */}
            <View
              style={styles.inputGroup}
            >
              <Text
                style={[
                  styles.label,
                  camposTocados.profissao &&
                    !profissaoValida &&
                    styles.labelError,
                ]}
              >
                Profissão
              </Text>

              <TextInput
                style={[
                  styles.input,
                  camposTocados.profissao &&
                    !profissaoValida &&
                    styles.inputError,
                ]}
                placeholder="Ex: Enfermagem"
                placeholderTextColor={
                  Colors.muted
                }
                value={
                  dadosProfissionais.profissao
                }
                onChangeText={(
                  profissao
                ) =>
                  atualizarDadosProfissionais(
                    {
                      profissao,
                    }
                  )
                }
                onBlur={() =>
                  marcarCampoComoTocado(
                    'profissao'
                  )
                }
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />

              {camposTocados.profissao &&
                !profissaoValida && (
                  <Text
                    style={
                      styles.errorText
                    }
                  >
                    Informe sua profissão.
                  </Text>
                )}
            </View>

            {/* CONSELHO */}
            <View
              style={styles.inputGroup}
            >
              <Text
                style={[
                  styles.label,
                  camposTocados.conselho &&
                    !conselhoValido &&
                    styles.labelError,
                ]}
              >
                Conselho profissional
              </Text>

              <TextInput
                style={[
                  styles.input,
                  camposTocados.conselho &&
                    !conselhoValido &&
                    styles.inputError,
                ]}
                placeholder="Ex: COREN"
                placeholderTextColor={
                  Colors.muted
                }
                value={
                  dadosProfissionais.conselho
                }
                onChangeText={(
                  conselho
                ) =>
                  atualizarDadosProfissionais(
                    {
                      conselho:
                        conselho.toUpperCase(),
                    }
                  )
                }
                onBlur={() =>
                  marcarCampoComoTocado(
                    'conselho'
                  )
                }
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="next"
              />

              {camposTocados.conselho &&
                !conselhoValido && (
                  <Text
                    style={
                      styles.errorText
                    }
                  >
                    Informe seu conselho
                    profissional.
                  </Text>
                )}
            </View>

            {/* REGISTRO + UF */}
            <View style={styles.row}>
              <View
                style={
                  styles.registrationContainer
                }
              >
                <Text
                  style={[
                    styles.label,
                    camposTocados.registro &&
                      !registroValido &&
                      styles.labelError,
                  ]}
                >
                  Registro profissional
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    camposTocados.registro &&
                      !registroValido &&
                      styles.inputError,
                  ]}
                  placeholder="Ex: 123456"
                  placeholderTextColor={
                    Colors.muted
                  }
                  value={
                    dadosProfissionais.registro
                  }
                  onChangeText={(
                    registro
                  ) =>
                    atualizarDadosProfissionais(
                      {
                        registro,
                      }
                    )
                  }
                  onBlur={() =>
                    marcarCampoComoTocado(
                      'registro'
                    )
                  }
                  autoCapitalize="characters"
                  autoCorrect={false}
                  returnKeyType="next"
                />

                {camposTocados.registro &&
                  !registroValido && (
                    <Text
                      style={
                        styles.errorText
                      }
                    >
                      Informe seu registro.
                    </Text>
                  )}
              </View>

              {/* UF */}
              <View
                style={
                  styles.ufContainer
                }
              >
                <Text
                  style={[
                    styles.label,
                    camposTocados.uf &&
                      !ufValida &&
                      styles.labelError,
                  ]}
                >
                  UF
                </Text>

                <TouchableOpacity
                  style={[
                    styles.select,
                    camposTocados.uf &&
                      !ufValida &&
                      styles.inputError,
                  ]}
                  onPress={() => {
                    marcarCampoComoTocado(
                      'uf'
                    );

                    setModalUfVisivel(
                      true
                    );
                  }}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Selecionar UF do registro"
                >
                  <Text
                    style={[
                      styles.selectText,
                      !dadosProfissionais.uf &&
                        styles.placeholderText,
                    ]}
                  >
                    {dadosProfissionais
                      .uf || 'UF'}
                  </Text>

                  <Ionicons
                    name="chevron-down"
                    size={18}
                    color={Colors.muted}
                  />
                </TouchableOpacity>

                {camposTocados.uf &&
                  !ufValida && (
                    <Text
                      style={
                        styles.errorText
                      }
                    >
                      Selecione a UF.
                    </Text>
                  )}
              </View>
            </View>

            {/* UNIDADE */}
            <View
              style={styles.inputGroup}
            >
              <View
                style={styles.labelRow}
              >
                <Text
                  style={styles.label}
                >
                  Unidade de lotação
                </Text>

                <Text
                  style={
                    styles.optionalText
                  }
                >
                  Opcional
                </Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Ex: SAMU Caxias"
                placeholderTextColor={
                  Colors.muted
                }
                value={
                  dadosProfissionais.unidade
                }
                onChangeText={(
                  unidade
                ) =>
                  atualizarDadosProfissionais(
                    {
                      unidade,
                    }
                  )
                }
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={
                  formularioValido
                    ? handleContinuar
                    : undefined
                }
              />
            </View>

            {/* CONTINUAR */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                !formularioValido &&
                  styles.continueButtonDisabled,
              ]}
              onPress={handleContinuar}
              disabled={
                !formularioValido
              }
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Continuar para áreas de atuação"
            >
              <Text
                style={
                  styles.continueButtonText
                }
              >
                Próximo
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color={
                  Colors.background
                }
              />
            </TouchableOpacity>
          </View>

          {/* VOLTAR */}
          <TouchableOpacity
            style={
              styles.previousButton
            }
            onPress={() =>
              router.replace(
                '/cadastro/dados-pessoais'
              )
            }
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-back"
              size={17}
              color={Colors.primary}
            />

            <Text
              style={
                styles.previousText
              }
            >
              Voltar para etapa anterior
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* MODAL DE UF */}
        <Modal
          visible={modalUfVisivel}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() =>
            setModalUfVisivel(false)
          }
        >
          <View
            style={
              styles.modalOverlay
            }
          >
            <View
              style={
                styles.modalContent
              }
            >
              <View
                style={
                  styles.modalHeader
                }
              >
                <Text
                  style={
                    styles.modalTitle
                  }
                >
                  Selecione a UF
                </Text>

                <TouchableOpacity
                  style={
                    styles.modalCloseButton
                  }
                  onPress={() =>
                    setModalUfVisivel(
                      false
                    )
                  }
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar seleção de UF"
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={
                      Colors.textStrong
                    }
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={
                  false
                }
              >
                {ESTADOS_BRASILEIROS.map(
                  (estado) => {
                    const selecionado =
                      dadosProfissionais.uf ===
                      estado;

                    return (
                      <TouchableOpacity
                        key={estado}
                        style={[
                          styles.ufOption,
                          selecionado &&
                            styles.ufOptionSelected,
                        ]}
                        onPress={() =>
                          selecionarUf(
                            estado
                          )
                        }
                        activeOpacity={
                          0.8
                        }
                      >
                        <Text
                          style={[
                            styles.ufOptionText,
                            selecionado &&
                              styles.ufOptionTextSelected,
                          ]}
                        >
                          {estado}
                        </Text>

                        {selecionado && (
                          <Ionicons
                            name="checkmark"
                            size={20}
                            color={
                              Colors.primary
                            }
                          />
                        )}
                      </TouchableOpacity>
                    );
                  }
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        Colors.background,
    },

    container: {
      flex: 1,
      backgroundColor:
        Colors.background,
    },

    header: {
      minHeight: 64,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        Colors.background,
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    backButton: {
      width: 42,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerTitle: {
      marginLeft: 6,
      color:
        Colors.textStrong,
      fontSize: 20,
      fontWeight: '700',
    },

    content: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingBottom: 40,
    },

    step: {
      marginTop: 22,
      color: Colors.primary,
      fontSize: 13,
      fontWeight: '700',
    },

    titleRow: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },

    iconContainer: {
      width: 42,
      height: 42,
      marginRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.surfaceSecondary,
      borderRadius: 12,
    },

    title: {
      flex: 1,
      color:
        Colors.textStrong,
      fontSize: 26,
      fontWeight: '700',
    },

    description: {
      marginTop: 12,
      color:
        Colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
    },

    progressContainer: {
      marginTop: 24,
      marginBottom: 30,
      flexDirection: 'row',
      gap: 8,
    },

    progressActive: {
      flex: 1,
      height: 5,
      backgroundColor:
        Colors.primary,
      borderRadius: 999,
    },

    progressInactive: {
      flex: 1,
      height: 5,
      backgroundColor:
        Colors.border,
      borderRadius: 999,
    },

    form: {
      flex: 1,
    },

    inputGroup: {
      marginBottom: 18,
    },

    row: {
      marginBottom: 18,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },

    registrationContainer: {
      flex: 2,
    },

    ufContainer: {
      flex: 1,
    },

    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    label: {
      marginBottom: 7,
      color:
        Colors.textLabel,
      fontSize: 14,
      fontWeight: '600',
    },

    labelError: {
      color: Colors.danger,
    },

    optionalText: {
      marginBottom: 7,
      color: Colors.muted,
      fontSize: 12,
    },

    input: {
      height: 56,
      paddingHorizontal: 15,
      color: Colors.text,
      fontSize: 16,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderRadius: 12,
    },

    inputError: {
      borderColor:
        Colors.danger,
      backgroundColor:
        Colors.dangerSurface,
    },

    errorText: {
      marginTop: 6,
      color: Colors.danger,
      fontSize: 12,
      lineHeight: 17,
    },

    select: {
      height: 56,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderRadius: 12,
    },

    selectText: {
      color: Colors.text,
      fontSize: 15,
      fontWeight: '500',
    },

    placeholderText: {
      color: Colors.muted,
    },

    continueButton: {
      width: '100%',
      minHeight: 56,
      marginTop: 12,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor:
        Colors.primary,
      borderRadius: 12,
    },

    continueButtonDisabled: {
      backgroundColor:
        Colors.disabled,
    },

    continueButtonText: {
      color:
        Colors.background,
      fontSize: 16,
      fontWeight: '700',
    },

    previousButton: {
      marginTop: 28,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
    },

    previousText: {
      color: Colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },

    modalOverlay: {
      flex: 1,
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        'rgba(0, 0, 0, 0.4)',
    },

    modalContent: {
      width: '100%',
      maxWidth: 420,
      maxHeight: '70%',
      padding: 20,
      backgroundColor:
        Colors.background,
      borderRadius: 20,
    },

    modalHeader: {
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    modalTitle: {
      color:
        Colors.textStrong,
      fontSize: 20,
      fontWeight: '700',
    },

    modalCloseButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },

    ufOption: {
      minHeight: 52,
      paddingHorizontal: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    ufOptionSelected: {
      backgroundColor:
        Colors.surfaceSecondary,
    },

    ufOptionText: {
      color: Colors.text,
      fontSize: 16,
    },

    ufOptionTextSelected: {
      color: Colors.primary,
      fontWeight: '700',
    },
  });