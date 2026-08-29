import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import {
    ActivityIndicator,
    KeyboardAvoidingView,
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
import { senhaService } from '@/features/auth/services';

type EtapaRecuperacao =
  | 'email'
  | 'enviado';

/**
 * Tela responsável por iniciar o fluxo
 * de recuperação de senha.
 *
 * Responsabilidades:
 * - coletar e validar o e-mail;
 * - solicitar a recuperação ao service;
 * - exibir loading, erro e confirmação;
 * - permitir retorno ao Login.
 *
 * Esta tela NÃO deve:
 * - acessar a API diretamente;
 * - verificar se uma conta existe;
 * - gerar tokens;
 * - permitir redefinir senha sem validação.
 *
 * Fluxo atual:
 * EsqueciSenhaScreen
 *      ↓
 * senhaService
 *      ↓
 * senhaMockService
 *
 * Fluxo futuro:
 * EsqueciSenhaScreen
 *      ↓
 * senhaService
 *      ↓
 * senhaApiService
 *      ↓
 * API
 */
export default function EsqueciSenhaScreen() {
  const [email, setEmail] =
    useState('');

  const [etapa, setEtapa] =
    useState<EtapaRecuperacao>(
      'email'
    );

  const [
    enviando,
    setEnviando,
  ] = useState(false);

  const [
    erroEmail,
    setErroEmail,
  ] = useState('');

  const [
    erroGeral,
    setErroGeral,
  ] = useState('');

  /**
   * Valida apenas o formato do campo.
   *
   * Saber se uma conta realmente existe
   * é responsabilidade exclusiva do backend.
   */
  function validarEmail() {
    const emailNormalizado =
      email.trim();

    if (!emailNormalizado) {
      setErroEmail(
        'O e-mail é obrigatório.'
      );

      return false;
    }

    const formatoValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        emailNormalizado
      );

    if (!formatoValido) {
      setErroEmail(
        'Digite um e-mail válido.'
      );

      return false;
    }

    setErroEmail('');

    return true;
  }

  async function handleEnviar() {
    if (!validarEmail()) {
      return;
    }

    try {
      setEnviando(true);
      setErroGeral('');

      await senhaService.solicitarRecuperacao(
        {
          email: email
            .trim()
            .toLowerCase(),
        }
      );

      setEtapa('enviado');
    } catch (error) {
      console.error(
        'Erro ao solicitar recuperação de senha:',
        error
      );

      /**
       * TODO(BACKEND):
       * O senhaApiService deverá transformar erros
       * HTTP em mensagens apropriadas para a UI.
       *
       * A tela não deverá interpretar códigos
       * de status diretamente.
       */
      setErroGeral(
        'Não foi possível enviar as instruções. Tente novamente.'
      );
    } finally {
      setEnviando(false);
    }
  }

  function handleEmailChange(
    value: string
  ) {
    setEmail(value);

    if (erroEmail) {
      setErroEmail('');
    }

    if (erroGeral) {
      setErroGeral('');
    }
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
      >
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
            disabled={enviando}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>

          <Text
            style={styles.headerTitle}
          >
            Recuperar senha
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          {etapa === 'email' ? (
            <>
              <View
                style={
                  styles.iconContainer
                }
              >
                <Ionicons
                  name="mail-outline"
                  size={42}
                  color={Colors.primary}
                />
              </View>

              <Text style={styles.title}>
                Esqueceu sua senha?
              </Text>

              <Text
                style={
                  styles.description
                }
              >
                Informe o e-mail associado
                à sua conta para receber
                instruções de recuperação.
              </Text>

              {/* E-MAIL */}
              <View
                style={styles.inputGroup}
              >
                <Text
                  style={[
                    styles.label,
                    erroEmail &&
                      styles.labelError,
                  ]}
                >
                  E-mail
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    erroEmail &&
                      styles.inputError,
                  ]}
                  placeholder="seu.email@exemplo.com"
                  placeholderTextColor={
                    Colors.muted
                  }
                  value={email}
                  onChangeText={
                    handleEmailChange
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  editable={!enviando}
                  returnKeyType="send"
                  onSubmitEditing={
                    handleEnviar
                  }
                />

                {erroEmail ? (
                  <Text
                    style={styles.errorText}
                  >
                    {erroEmail}
                  </Text>
                ) : null}
              </View>

              {/* ERRO DA SOLICITAÇÃO */}
              {erroGeral ? (
                <View
                  style={
                    styles.errorBox
                  }
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={19}
                    color={Colors.danger}
                  />

                  <Text
                    style={
                      styles.errorBoxText
                    }
                  >
                    {erroGeral}
                  </Text>
                </View>
              ) : null}

              {/* ENVIAR */}
              <TouchableOpacity
                style={[
                  styles.button,
                  enviando &&
                    styles.buttonDisabled,
                ]}
                onPress={handleEnviar}
                disabled={enviando}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Enviar instruções de recuperação"
              >
                {enviando ? (
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
                        styles.buttonText
                      }
                    >
                      Enviando...
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    Enviar instruções
                  </Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View
              style={
                styles.successContainer
              }
            >
              <View
                style={
                  styles.successIconContainer
                }
              >
                <Ionicons
                  name="checkmark"
                  size={46}
                  color={
                    Colors.background
                  }
                />
              </View>

              <Text
                style={
                  styles.successTitle
                }
              >
                Solicitação enviada
              </Text>

              <Text
                style={
                  styles.successDescription
                }
              >
                Se existir uma conta
                associada ao e-mail abaixo,
                as instruções de recuperação
                serão enviadas:
              </Text>

              <Text
                style={
                  styles.successEmail
                }
              >
                {email
                  .trim()
                  .toLowerCase()}
              </Text>

              {/*
               * Não navegamos diretamente para
               * /nova-senha.
               *
               * TODO(BACKEND):
               * A tela de nova senha deverá ser aberta
               * somente depois que o mecanismo de
               * recuperação for validado.
               *
               * Esse mecanismo poderá ser link, token
               * ou código, conforme contrato da API.
               */}
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  router.replace('/')
                }
                activeOpacity={0.85}
              >
                <Text
                  style={styles.buttonText}
                >
                  Voltar para o Login
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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
      color: Colors.textStrong,
      fontSize: 20,
      fontWeight: '700',
    },

    scroll: {
      flex: 1,
    },

    content: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 40,
      paddingBottom: 32,
    },

    iconContainer: {
      width: 80,
      height: 80,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.surfaceSecondary,
      borderRadius: 40,
    },

    title: {
      marginTop: 28,
      color: Colors.textStrong,
      fontSize: 24,
      fontWeight: '700',
      textAlign: 'center',
    },

    description: {
      marginTop: 12,
      marginBottom: 32,
      color:
        Colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'center',
    },

    inputGroup: {
      marginBottom: 20,
    },

    label: {
      marginBottom: 6,
      color: Colors.textLabel,
      fontSize: 14,
      fontWeight: '600',
    },

    labelError: {
      color: Colors.danger,
    },

    input: {
      height: 56,
      paddingHorizontal: 15,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: 12,
      color: Colors.text,
      fontSize: 16,
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
      fontSize: 13,
    },

    errorBox: {
      marginBottom: 15,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      backgroundColor:
        Colors.dangerSurface,
      borderWidth: 1,
      borderColor: Colors.danger,
      borderRadius: 10,
    },

    errorBoxText: {
      flex: 1,
      color: Colors.danger,
      fontSize: 12,
      lineHeight: 17,
    },

    button: {
      width: '100%',
      minHeight: 56,
      paddingHorizontal: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primary,
      borderRadius: 12,
    },

    buttonDisabled: {
      opacity: 0.7,
    },

    buttonText: {
      color: Colors.background,
      fontSize: 16,
      fontWeight: '700',
    },

    loadingContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },

    successContainer: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 40,
    },

    successIconContainer: {
      width: 90,
      height: 90,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.success,
      borderRadius: 45,
    },

    successTitle: {
      marginTop: 24,
      color: Colors.success,
      fontSize: 25,
      fontWeight: '700',
      textAlign: 'center',
    },

    successDescription: {
      maxWidth: 340,
      marginTop: 18,
      color:
        Colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'center',
    },

    successEmail: {
      marginTop: 8,
      marginBottom: 38,
      color: Colors.textStrong,
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'center',
    },
  });