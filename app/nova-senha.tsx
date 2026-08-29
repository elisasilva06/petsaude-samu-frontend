import {
  Feather,
  Ionicons,
} from '@expo/vector-icons';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

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
  useWindowDimensions,
  View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { senhaService } from '@/features/auth/services';

type RequisitoProps = {
  label: string;
  concluido: boolean;
};

/**
 * Item visual utilizado para apresentar os requisitos
 * definidos atualmente para criação da nova senha.
 */
function Requisito({
  label,
  concluido,
}: RequisitoProps) {
  return (
    <View style={styles.requisitoRow}>
      <Ionicons
        name={
          concluido
            ? 'checkmark-circle'
            : 'ellipse-outline'
        }
        size={18}
        color={
          concluido
            ? Colors.successDark
            : Colors.muted
        }
      />

      <Text
        style={[
          styles.requisitoText,
          concluido &&
            styles.requisitoConcluido,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/**
 * Tela responsável por concluir a recuperação
 * de uma senha esquecida.
 *
 * Esta tela é diferente de `alterar-senha.tsx`:
 *
 * - alterar-senha:
 *   usuário já está autenticado;
 *
 * - nova-senha:
 *   usuário precisa apresentar uma credencial
 *   obtida pelo fluxo de recuperação.
 *
 * Fluxo futuro esperado:
 *
 * Link/código de recuperação
 *        ↓
 * NovaSenhaScreen
 *        ↓
 * senhaService.redefinirSenha()
 *        ↓
 * senhaApiService
 *        ↓
 * API
 *
 * A tela não deve interpretar tokens, códigos
 * ou respostas HTTP diretamente.
 */
export default function NovaSenhaScreen() {
  const { height: screenHeight } =
    useWindowDimensions();

  const params =
    useLocalSearchParams<{
      credencial?: string | string[];
    }>();

  /**
   * Parâmetro interno e genérico.
   *
   * TODO(BACKEND):
   * Quando o mecanismo real de recuperação estiver
   * definido, o link/deep link/código recebido deverá
   * ser convertido para esta credencial interna.
   *
   * Não assumimos aqui se o backend usará token,
   * código numérico ou outro formato.
   */
  const credencialRecuperacao =
    Array.isArray(params.credencial)
      ? params.credencial[0]
      : params.credencial;

  const [senha, setSenha] =
    useState('');

  const [
    confirmarSenha,
    setConfirmarSenha,
  ] = useState('');

  const [
    mostrarSenha,
    setMostrarSenha,
  ] = useState(false);

  const [
    redefinindo,
    setRedefinindo,
  ] = useState(false);

  const [
    erroGeral,
    setErroGeral,
  ] = useState('');

  const [
    redefinida,
    setRedefinida,
  ] = useState(false);

  const temOitoCaracteres =
    senha.length >= 8;

  const temMaiuscula =
    /[A-Z]/.test(senha);

  const temNumero =
    /[0-9]/.test(senha);

  const senhasCoincidem =
    senha.length > 0 &&
    confirmarSenha.length > 0 &&
    senha === confirmarSenha;

  const podeRedefinir =
    temOitoCaracteres &&
    temMaiuscula &&
    temNumero &&
    senhasCoincidem &&
    Boolean(credencialRecuperacao);

  function handleSenhaChange(
    value: string
  ) {
    setSenha(value);

    if (erroGeral) {
      setErroGeral('');
    }
  }

  function handleConfirmarSenhaChange(
    value: string
  ) {
    setConfirmarSenha(value);

    if (erroGeral) {
      setErroGeral('');
    }
  }

  /**
   * Envia a nova senha para a camada de service.
   *
   * A tela não acessa a API diretamente.
   */
  async function handleRedefinir() {
    if (
      !podeRedefinir ||
      !credencialRecuperacao
    ) {
      return;
    }

    try {
      setRedefinindo(true);
      setErroGeral('');

      await senhaService.redefinirSenha({
        credencialRecuperacao,
        novaSenha: senha,
      });

      setSenha('');
      setConfirmarSenha('');
      setMostrarSenha(false);
      setRedefinida(true);
    } catch (error) {
      console.error(
        'Erro ao redefinir senha:',
        error
      );

      /**
       * TODO(BACKEND):
       * O senhaApiService deverá converter erros
       * técnicos da API em erros compreensíveis
       * para a interface, como:
       *
       * - credencial expirada;
       * - credencial inválida;
       * - falha de conexão;
       * - erro inesperado.
       *
       * A tela não deve interpretar status HTTP.
       */
      setErroGeral(
        'Não foi possível redefinir sua senha. Solicite uma nova recuperação e tente novamente.'
      );
    } finally {
      setRedefinindo(false);
    }
  }

  /**
   * A rota não deve permitir redefinição de senha
   * quando não recebeu autorização do fluxo anterior.
   */
  if (!credencialRecuperacao) {
    return (
      <View style={styles.invalidContainer}>
        <StatusBar style="dark" />

        <View style={styles.invalidIcon}>
          <Ionicons
            name="link-outline"
            size={38}
            color={Colors.danger}
          />
        </View>

        <Text style={styles.invalidTitle}>
          Recuperação inválida
        </Text>

        <Text
          style={styles.invalidDescription}
        >
          Não encontramos uma autorização válida
          para redefinir sua senha. Solicite uma
          nova recuperação pelo Login.
        </Text>

        <TouchableOpacity
          style={styles.invalidButton}
          onPress={() =>
            router.replace(
              '/esqueci-senha'
            )
          }
          activeOpacity={0.85}
        >
          <Text
            style={
              styles.invalidButtonText
            }
          >
            Recuperar senha
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLoginButton}
          onPress={() =>
            router.replace('/')
          }
          activeOpacity={0.8}
        >
          <Text
            style={
              styles.backLoginButtonText
            }
          >
            Voltar para o Login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (redefinida) {
    return (
      <View style={styles.successScreen}>
        <StatusBar style="dark" />

        <View
          style={
            styles.successIconContainer
          }
        >
          <Ionicons
            name="checkmark"
            size={46}
            color={Colors.background}
          />
        </View>

        <Text style={styles.successTitle}>
          Senha atualizada
        </Text>

        <Text
          style={
            styles.successDescription
          }
        >
          Sua nova senha foi salva com sucesso.
          Você já pode utilizá-la para acessar sua
          conta.
        </Text>

        <TouchableOpacity
          style={styles.successButton}
          onPress={() =>
            router.replace('/')
          }
          activeOpacity={0.85}
        >
          <Text
            style={
              styles.successButtonText
            }
          >
            Voltar para o Login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <StatusBar style="light" />

      <View
        style={[
          styles.topSection,
          {
            height:
              screenHeight * 0.25,
          },
        ]}
      >
        <View style={styles.iconCircle}>
          <Feather
            name="shield"
            size={50}
            color={Colors.primary}
          />
        </View>

        <Text
          style={styles.headerTitle}
        >
          Segurança SAMU
        </Text>
      </View>

      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.scrollContent
          }
        >
          <Text style={styles.title}>
            Criar nova senha
          </Text>

          <Text
            style={styles.description}
          >
            Defina uma nova senha para recuperar
            o acesso à sua conta.
          </Text>

          {/* NOVA SENHA */}
          <View
            style={styles.inputGroup}
          >
            <Text style={styles.label}>
              Nova senha
            </Text>

            <View
              style={
                styles.passwordContainer
              }
            >
              <TextInput
                style={
                  styles.passwordInput
                }
                placeholder="Crie uma senha forte"
                placeholderTextColor={
                  Colors.muted
                }
                value={senha}
                onChangeText={
                  handleSenhaChange
                }
                secureTextEntry={
                  !mostrarSenha
                }
                autoCapitalize="none"
                autoCorrect={false}
                editable={!redefinindo}
                textContentType="newPassword"
              />

              <TouchableOpacity
                style={styles.eyeButton}
                disabled={redefinindo}
                onPress={() =>
                  setMostrarSenha(
                    (current) =>
                      !current
                  )
                }
                accessibilityRole="button"
                accessibilityLabel={
                  mostrarSenha
                    ? 'Ocultar senha'
                    : 'Mostrar senha'
                }
              >
                <Ionicons
                  name={
                    mostrarSenha
                      ? 'eye-outline'
                      : 'eye-off-outline'
                  }
                  size={22}
                  color={Colors.muted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* CONFIRMAÇÃO */}
          <View
            style={styles.inputGroup}
          >
            <Text style={styles.label}>
              Confirmar senha
            </Text>

            <View
              style={
                styles.passwordContainer
              }
            >
              <TextInput
                style={
                  styles.passwordInput
                }
                placeholder="Repita a senha"
                placeholderTextColor={
                  Colors.muted
                }
                value={confirmarSenha}
                onChangeText={
                  handleConfirmarSenhaChange
                }
                secureTextEntry={
                  !mostrarSenha
                }
                autoCapitalize="none"
                autoCorrect={false}
                editable={!redefinindo}
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={
                  podeRedefinir
                    ? handleRedefinir
                    : undefined
                }
              />

              <TouchableOpacity
                style={styles.eyeButton}
                disabled={redefinindo}
                onPress={() =>
                  setMostrarSenha(
                    (current) =>
                      !current
                  )
                }
                accessibilityRole="button"
                accessibilityLabel={
                  mostrarSenha
                    ? 'Ocultar senha'
                    : 'Mostrar senha'
                }
              >
                <Ionicons
                  name={
                    mostrarSenha
                      ? 'eye-outline'
                      : 'eye-off-outline'
                  }
                  size={22}
                  color={Colors.muted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* REQUISITOS */}
          <View
            style={styles.validacaoBox}
          >
            <Text
              style={
                styles.validacaoTitle
              }
            >
              Requisitos de segurança:
            </Text>

            <Requisito
              label="Mínimo de 8 caracteres"
              concluido={
                temOitoCaracteres
              }
            />

            <Requisito
              label="Pelo menos uma letra maiúscula"
              concluido={temMaiuscula}
            />

            <Requisito
              label="Pelo menos um número"
              concluido={temNumero}
            />

            <Requisito
              label="As senhas coincidem"
              concluido={
                senhasCoincidem
              }
            />
          </View>

          {/* ERRO */}
          {erroGeral ? (
            <View
              style={styles.errorBox}
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

          {/* SALVAR */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!podeRedefinir ||
                redefinindo) &&
                styles.saveButtonDisabled,
            ]}
            onPress={handleRedefinir}
            disabled={
              !podeRedefinir ||
              redefinindo
            }
            activeOpacity={0.85}
          >
            {redefinindo ? (
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
                    styles.saveButtonText
                  }
                >
                  Salvando...
                </Text>
              </View>
            ) : (
              <Text
                style={
                  styles.saveButtonText
                }
              >
                Salvar nova senha
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text
              style={styles.infoText}
            >
              SAMU 192 — Unidade Caxias/MA
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        Colors.primary,
    },

    topSection: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    iconCircle: {
      width: 100,
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.background,
      borderRadius: 50,
      elevation: 8,
    },

    headerTitle: {
      marginTop: 12,
      color: Colors.background,
      fontSize: 18,
      fontWeight: '700',
    },

    card: {
      flex: 1,
      paddingTop: 35,
      paddingHorizontal: 25,
      paddingBottom: 20,
      backgroundColor:
        Colors.surfaceMuted,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
    },

    scrollContent: {
      flexGrow: 1,
    },

    title: {
      marginBottom: 8,
      color: Colors.textStrong,
      fontSize: 24,
      fontWeight: '700',
      textAlign: 'center',
    },

    description: {
      marginBottom: 25,
      color:
        Colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
      textAlign: 'center',
    },

    inputGroup: {
      marginBottom: 15,
    },

    label: {
      marginBottom: 8,
      color: Colors.textLabel,
      fontSize: 14,
      fontWeight: '600',
    },

    passwordContainer: {
      height: 58,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: 12,
    },

    passwordInput: {
      flex: 1,
      height: '100%',
      paddingHorizontal: 15,
      color: Colors.text,
      fontSize: 16,
    },

    eyeButton: {
      paddingHorizontal: 15,
    },

    validacaoBox: {
      marginTop: 10,
      marginBottom: 20,
      padding: 18,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: 15,
    },

    validacaoTitle: {
      marginBottom: 10,
      color:
        Colors.textSecondary,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
    },

    requisitoRow: {
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },

    requisitoText: {
      marginLeft: 10,
      color: Colors.muted,
      fontSize: 14,
    },

    requisitoConcluido: {
      color:
        Colors.successDark,
      fontWeight: '600',
    },

    errorBox: {
      marginBottom: 5,
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

    saveButton: {
      width: '100%',
      minHeight: 58,
      marginTop: 10,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primaryDark,
      borderRadius: 12,
    },

    saveButtonDisabled: {
      backgroundColor:
        Colors.disabled,
    },

    saveButtonText: {
      color: Colors.background,
      fontSize: 16,
      fontWeight: '700',
    },

    loadingContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },

    infoBox: {
      marginTop: 30,
      paddingBottom: 10,
    },

    infoText: {
      color: Colors.muted,
      fontSize: 11,
      textAlign: 'center',
    },

    invalidContainer: {
      flex: 1,
      paddingHorizontal: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.background,
    },

    invalidIcon: {
      width: 78,
      height: 78,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.dangerSurface,
      borderRadius: 39,
    },

    invalidTitle: {
      color: Colors.textStrong,
      fontSize: 22,
      fontWeight: '800',
      textAlign: 'center',
    },

    invalidDescription: {
      maxWidth: 350,
      marginTop: 10,
      color:
        Colors.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      textAlign: 'center',
    },

    invalidButton: {
      width: '100%',
      maxWidth: 340,
      minHeight: 54,
      marginTop: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primary,
      borderRadius: 12,
    },

    invalidButtonText: {
      color: Colors.background,
      fontSize: 15,
      fontWeight: '700',
    },

    backLoginButton: {
      marginTop: 12,
      padding: 12,
    },

    backLoginButtonText: {
      color: Colors.primary,
      fontSize: 14,
      fontWeight: '700',
    },

    successScreen: {
      flex: 1,
      paddingHorizontal: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.background,
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
      maxWidth: 350,
      marginTop: 12,
      color:
        Colors.textSecondary,
      fontSize: 14,
      lineHeight: 21,
      textAlign: 'center',
    },

    successButton: {
      width: '100%',
      maxWidth: 340,
      minHeight: 56,
      marginTop: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primary,
      borderRadius: 12,
    },

    successButtonText: {
      color: Colors.background,
      fontSize: 15,
      fontWeight: '700',
    },
  });