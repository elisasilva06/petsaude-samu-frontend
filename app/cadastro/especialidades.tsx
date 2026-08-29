import {
  Feather,
  Ionicons,
} from '@expo/vector-icons';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  AREAS_ATUACAO,
} from '@/constants/areas-atuacao';

import { Colors } from '@/constants/theme';

import {
  useCadastro,
} from '@/contexts/CadastroContext';

import {
  cadastroService,
} from '@/features/cadastro/services';

/**
 * Terceira e última etapa do cadastro.
 *
 * Responsabilidades:
 * - permitir seleção das áreas de atuação;
 * - reunir os dados das três etapas;
 * - enviar o cadastro completo ao CadastroService;
 * - exibir loading e erro;
 * - limpar o contexto somente após sucesso.
 *
 * Esta tela NÃO deve:
 * - chamar fetch diretamente;
 * - conhecer endpoints;
 * - interpretar status HTTP;
 * - assumir que o profissional é médico.
 *
 * Fluxo atual:
 *
 * Dados pessoais
 *      ↓
 * Dados profissionais
 *      ↓
 * Áreas de atuação
 *      ↓
 * cadastroService
 *      ↓
 * cadastroMockService
 *
 * Futuramente:
 *
 * cadastroService
 *      ↓
 * cadastroApiService
 *      ↓
 * API
 */
export default function EspecialidadesScreen() {
  const {
    dadosPessoais,
    dadosProfissionais,
    areasAtuacao,
    atualizarAreasAtuacao,
    limparCadastro,
  } = useCadastro();

  const [
    cadastrando,
    setCadastrando,
  ] = useState(false);

  const [
    erroCadastro,
    setErroCadastro,
  ] = useState('');

  const possuiArea =
    areasAtuacao.length > 0;

  /**
   * Adiciona ou remove uma área da seleção.
   */
  function toggleArea(
    area: string
  ) {
    setErroCadastro('');

    if (
      areasAtuacao.includes(area)
    ) {
      atualizarAreasAtuacao(
        areasAtuacao.filter(
          (item) => item !== area
        )
      );

      return;
    }

    atualizarAreasAtuacao([
      ...areasAtuacao,
      area,
    ]);
  }

  /**
   * Conclui o fluxo de cadastro.
   *
   * Esta é a única etapa responsável por
   * enviar todos os dados reunidos ao service.
   */
  async function handleFinalizar() {
    if (
      !possuiArea ||
      cadastrando
    ) {
      return;
    }

    try {
      setCadastrando(true);
      setErroCadastro('');

      await cadastroService.criarCadastro({
        dadosPessoais,
        dadosProfissionais,
        areasAtuacao,
      });

      /**
       * Limpamos o contexto somente depois que
       * o service confirma o sucesso.
       */
      limparCadastro();

      router.replace(
        '/cadastro/sucesso'
      );
    } catch (error) {
      console.error(
        'Erro ao criar cadastro:',
        error
      );

      /**
       * TODO(BACKEND):
       * O cadastroApiService deverá transformar
       * erros técnicos da API em mensagens adequadas,
       * por exemplo:
       *
       * - CPF já cadastrado;
       * - e-mail já cadastrado;
       * - registro profissional inválido;
       * - falha de conexão;
       * - erro inesperado.
       *
       * Esta tela não deverá interpretar status HTTP.
       */
      setErroCadastro(
        'Não foi possível concluir o cadastro. Revise os dados e tente novamente.'
      );
    } finally {
      setCadastrando(false);
    }
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >
      <StatusBar style="light" />

      <View style={styles.container}>
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.replace(
                '/cadastro/dados-profissionais'
              )
            }
            disabled={cadastrando}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Voltar para dados profissionais"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={
                Colors.background
              }
            />
          </TouchableOpacity>

          <View>
            <Text
              style={
                styles.headerTitle
              }
            >
              Criar conta
            </Text>

            <Text
              style={
                styles.stepText
              }
            >
              Etapa 3 de 3 — Áreas de atuação
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          <View style={styles.card}>
            <View
              style={
                styles.iconCircle
              }
            >
              <Feather
                name="users"
                size={38}
                color={Colors.primary}
              />
            </View>

            <Text style={styles.title}>
              Áreas de atuação
            </Text>

            <Text
              style={
                styles.description
              }
            >
              Selecione uma ou mais áreas
              relacionadas à sua atuação
              profissional.
            </Text>

            {/*
             * TODO(BACKEND):
             * AREAS_ATUACAO é uma lista temporária.
             * Futuramente poderá ser carregada
             * dinamicamente pela API.
             */}
            <View
              style={
                styles.chipContainer
              }
            >
              {AREAS_ATUACAO.map(
                (area) => {
                  const selecionada =
                    areasAtuacao.includes(
                      area
                    );

                  return (
                    <TouchableOpacity
                      key={area}
                      style={[
                        styles.chip,

                        selecionada &&
                          styles.chipSelected,
                      ]}
                      onPress={() =>
                        toggleArea(area)
                      }
                      disabled={
                        cadastrando
                      }
                      activeOpacity={0.8}
                      accessibilityRole="checkbox"
                      accessibilityState={{
                        checked:
                          selecionada,
                      }}
                    >
                      {selecionada && (
                        <Ionicons
                          name="checkmark"
                          size={15}
                          color={
                            Colors.background
                          }
                        />
                      )}

                      <Text
                        style={[
                          styles.chipText,

                          selecionada &&
                            styles.chipTextSelected,
                        ]}
                      >
                        {area}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>

            {!possuiArea && (
              <Text
                style={
                  styles.helperText
                }
              >
                Selecione pelo menos uma
                área de atuação.
              </Text>
            )}

            {/* ERRO DO CADASTRO */}
            {erroCadastro ? (
              <View
                style={
                  styles.errorBox
                }
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={19}
                  color={
                    Colors.danger
                  }
                />

                <Text
                  style={
                    styles.errorText
                  }
                >
                  {erroCadastro}
                </Text>
              </View>
            ) : null}

            {/* FINALIZAR */}
            <TouchableOpacity
              style={[
                styles.finishButton,

                (!possuiArea ||
                  cadastrando) &&
                  styles.finishButtonDisabled,
              ]}
              onPress={
                handleFinalizar
              }
              disabled={
                !possuiArea ||
                cadastrando
              }
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Criar minha conta"
            >
              {cadastrando ? (
                <View
                  style={
                    styles.loadingContent
                  }
                >
                  <ActivityIndicator
                    size="small"
                    color={
                      Colors.background
                    }
                  />

                  <Text
                    style={
                      styles.finishButtonText
                    }
                  >
                    Criando conta...
                  </Text>
                </View>
              ) : (
                <Text
                  style={
                    styles.finishButtonText
                  }
                >
                  Criar minha conta
                </Text>
              )}
            </TouchableOpacity>

            {/* VOLTAR */}
            <TouchableOpacity
              style={
                styles.previousButton
              }
              onPress={() =>
                router.replace(
                  '/cadastro/dados-profissionais'
                )
              }
              disabled={cadastrando}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-back"
                size={17}
                color={
                  Colors.textSecondary
                }
              />

              <Text
                style={
                  styles.previousText
                }
              >
                Voltar para etapa anterior
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        Colors.primaryDark,
    },

    container: {
      flex: 1,
      backgroundColor:
        Colors.primaryDark,
    },

    header: {
      minHeight: 90,
      paddingHorizontal: 20,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        Colors.primaryDark,
    },

    backButton: {
      width: 42,
      height: 42,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerTitle: {
      color:
        Colors.background,
      fontSize: 20,
      fontWeight: '700',
    },

    stepText: {
      marginTop: 3,
      color: Colors.muted,
      fontSize: 12,
    },

    scrollContent: {
      flexGrow: 1,
    },

    card: {
      flexGrow: 1,
      width: '100%',
      paddingTop: 35,
      paddingHorizontal: '7%',
      paddingBottom: 40,
      alignItems: 'center',
      backgroundColor:
        Colors.surfaceMuted,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
    },

    iconCircle: {
      width: 80,
      height: 80,
      marginBottom: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.surfaceSecondary,
      borderRadius: 40,
    },

    title: {
      marginBottom: 6,
      color:
        Colors.textStrong,
      fontSize: 22,
      fontWeight: '700',
      textAlign: 'center',
    },

    description: {
      maxWidth: 350,
      marginBottom: 25,
      color:
        Colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },

    chipContainer: {
      width: '100%',
      marginBottom: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent:
        'center',
    },

    chip: {
      margin: 5,
      paddingVertical: 10,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderRadius: 25,
    },

    chipSelected: {
      backgroundColor:
        Colors.primary,
      borderColor:
        Colors.primary,
    },

    chipText: {
      color:
        Colors.textLabel,
      fontSize: 13,
      fontWeight: '500',
    },

    chipTextSelected: {
      color:
        Colors.background,
      fontWeight: '700',
    },

    helperText: {
      marginTop: 10,
      color:
        Colors.textSecondary,
      fontSize: 13,
      textAlign: 'center',
    },

    errorBox: {
      width: '100%',
      marginTop: 16,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      backgroundColor:
        Colors.dangerSurface,
      borderWidth: 1,
      borderColor:
        Colors.danger,
      borderRadius: 10,
    },

    errorText: {
      flex: 1,
      color:
        Colors.danger,
      fontSize: 12,
      lineHeight: 17,
    },

    finishButton: {
      width: '100%',
      minHeight: 56,
      marginTop: 20,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryDark,
      borderRadius: 12,
    },

    finishButtonDisabled: {
      backgroundColor:
        Colors.disabled,
    },

    loadingContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },

    finishButtonText: {
      color:
        Colors.background,
      fontSize: 16,
      fontWeight: '700',
    },

    previousButton: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    previousText: {
      color:
        Colors.textSecondary,
      fontSize: 14,
      fontWeight: '500',
    },
  });