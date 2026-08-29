import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import {
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
import { useCadastro } from '@/contexts/CadastroContext';

type CamposTocados = {
  nome: boolean;
  email: boolean;
  cpf: boolean;
  telefone: boolean;
};

/**
 * Primeira etapa do cadastro.
 *
 * Responsabilidades:
 * - coletar os dados pessoais do profissional;
 * - realizar validações básicas de interface;
 * - armazenar temporariamente os dados no CadastroContext;
 * - encaminhar o usuário para a próxima etapa.
 *
 * Esta tela NÃO deve:
 * - chamar a API;
 * - criar o usuário;
 * - verificar se CPF ou e-mail já existem;
 * - conhecer o formato esperado pelo backend.
 *
 * Fluxo:
 *
 * DadosPessoaisScreen
 *        ↓
 * CadastroContext
 *        ↓
 * DadosProfissionaisScreen
 *
 * O envio real para o backend acontecerá somente
 * após a conclusão de todas as etapas do cadastro.
 */
export default function DadosPessoaisScreen() {
  const {
    dadosPessoais,
    atualizarDadosPessoais,
  } = useCadastro();

  const [
    camposTocados,
    setCamposTocados,
  ] = useState<CamposTocados>({
    nome: false,
    email: false,
    cpf: false,
    telefone: false,
  });

  /*
   * Validações básicas da interface.
   *
   * TODO(BACKEND):
   * Validações definitivas, como existência de CPF,
   * e-mail já cadastrado ou outras regras de negócio,
   * devem ser realizadas pela API.
   */

  const nomeValido =
    dadosPessoais.nome.trim().length >= 3;

  const emailValido =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      dadosPessoais.email.trim()
    );

  const cpfNumeros =
    dadosPessoais.cpf.replace(
      /\D/g,
      ''
    );

  /*
   * Aqui validamos apenas a quantidade de dígitos.
   *
   * A validação oficial do CPF pode ser executada
   * posteriormente em uma camada específica ou
   * confirmada pelo backend.
   */
  const cpfValido =
    cpfNumeros.length === 11;

  const telefoneNumeros =
    dadosPessoais.telefone.replace(
      /\D/g,
      ''
    );

  const telefoneValido =
    telefoneNumeros.length >= 10 &&
    telefoneNumeros.length <= 11;

  const formularioValido =
    nomeValido &&
    emailValido &&
    cpfValido &&
    telefoneValido;

  function marcarCampoComoTocado(
    campo: keyof CamposTocados
  ) {
    setCamposTocados(
      (estadoAtual) => ({
        ...estadoAtual,
        [campo]: true,
      })
    );
  }

  function handleNomeChange(
    nome: string
  ) {
    atualizarDadosPessoais({
      nome,
    });
  }

  function handleEmailChange(
    email: string
  ) {
    atualizarDadosPessoais({
      email,
    });
  }

  function handleCpfChange(
    valor: string
  ) {
    atualizarDadosPessoais({
      cpf: formatarCpf(valor),
    });
  }

  function handleTelefoneChange(
    valor: string
  ) {
    atualizarDadosPessoais({
      telefone:
        formatarTelefone(valor),
    });
  }

  /**
   * Apenas avança para a próxima etapa.
   *
   * Nenhum usuário é criado neste momento.
   */
  function handleContinuar() {
    if (!formularioValido) {
      return;
    }

    router.push(
      '/cadastro/dados-profissionais'
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
              router.replace('/')
            }
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Voltar para o Login"
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
            Etapa 1 de 3
          </Text>

          <Text style={styles.title}>
            Dados pessoais
          </Text>

          <Text
            style={styles.description}
          >
            Informe seus dados pessoais
            para iniciar o cadastro.
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
                styles.progressInactive
              }
            />

            <View
              style={
                styles.progressInactive
              }
            />
          </View>

          <View style={styles.form}>
            {/* NOME */}
            <View
              style={styles.inputGroup}
            >
              <Text
                style={[
                  styles.label,
                  camposTocados.nome &&
                    !nomeValido &&
                    styles.labelError,
                ]}
              >
                Nome completo
              </Text>

              <TextInput
                style={[
                  styles.input,
                  camposTocados.nome &&
                    !nomeValido &&
                    styles.inputError,
                ]}
                placeholder="Digite seu nome completo"
                placeholderTextColor={
                  Colors.muted
                }
                value={
                  dadosPessoais.nome
                }
                onChangeText={
                  handleNomeChange
                }
                onBlur={() =>
                  marcarCampoComoTocado(
                    'nome'
                  )
                }
                autoCapitalize="words"
                autoCorrect={false}
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
              />

              {camposTocados.nome &&
                !nomeValido && (
                  <Text
                    style={
                      styles.errorText
                    }
                  >
                    Digite um nome válido
                    com pelo menos 3
                    caracteres.
                  </Text>
                )}
            </View>

            {/* E-MAIL */}
            <View
              style={styles.inputGroup}
            >
              <Text
                style={[
                  styles.label,
                  camposTocados.email &&
                    !emailValido &&
                    styles.labelError,
                ]}
              >
                E-mail
              </Text>

              <TextInput
                style={[
                  styles.input,
                  camposTocados.email &&
                    !emailValido &&
                    styles.inputError,
                ]}
                placeholder="seu.email@exemplo.com"
                placeholderTextColor={
                  Colors.muted
                }
                value={
                  dadosPessoais.email
                }
                onChangeText={
                  handleEmailChange
                }
                onBlur={() =>
                  marcarCampoComoTocado(
                    'email'
                  )
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
              />

              {camposTocados.email &&
                !emailValido && (
                  <Text
                    style={
                      styles.errorText
                    }
                  >
                    Digite um e-mail
                    válido.
                  </Text>
                )}
            </View>

            {/* CPF */}
            <View
              style={styles.inputGroup}
            >
              <Text
                style={[
                  styles.label,
                  camposTocados.cpf &&
                    !cpfValido &&
                    styles.labelError,
                ]}
              >
                CPF
              </Text>

              <TextInput
                style={[
                  styles.input,
                  camposTocados.cpf &&
                    !cpfValido &&
                    styles.inputError,
                ]}
                placeholder="000.000.000-00"
                placeholderTextColor={
                  Colors.muted
                }
                value={
                  dadosPessoais.cpf
                }
                onChangeText={
                  handleCpfChange
                }
                onBlur={() =>
                  marcarCampoComoTocado(
                    'cpf'
                  )
                }
                keyboardType="number-pad"
                maxLength={14}
                returnKeyType="next"
              />

              {camposTocados.cpf &&
                !cpfValido && (
                  <Text
                    style={
                      styles.errorText
                    }
                  >
                    O CPF deve possuir 11
                    dígitos.
                  </Text>
                )}
            </View>

            {/* TELEFONE */}
            <View
              style={styles.inputGroup}
            >
              <Text
                style={[
                  styles.label,
                  camposTocados.telefone &&
                    !telefoneValido &&
                    styles.labelError,
                ]}
              >
                Telefone
              </Text>

              <TextInput
                style={[
                  styles.input,
                  camposTocados.telefone &&
                    !telefoneValido &&
                    styles.inputError,
                ]}
                placeholder="(99) 99999-9999"
                placeholderTextColor={
                  Colors.muted
                }
                value={
                  dadosPessoais.telefone
                }
                onChangeText={
                  handleTelefoneChange
                }
                onBlur={() =>
                  marcarCampoComoTocado(
                    'telefone'
                  )
                }
                keyboardType="phone-pad"
                maxLength={15}
                returnKeyType="done"
                onSubmitEditing={
                  formularioValido
                    ? handleContinuar
                    : undefined
                }
              />

              {camposTocados.telefone &&
                !telefoneValido && (
                  <Text
                    style={
                      styles.errorText
                    }
                  >
                    Digite um telefone
                    válido com DDD.
                  </Text>
                )}
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
              accessibilityLabel="Continuar para dados profissionais"
            >
              <Text
                style={
                  styles.continueButtonText
                }
              >
                Continuar
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

          {/* LOGIN */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() =>
              router.replace('/')
            }
            activeOpacity={0.8}
          >
            <Text
              style={
                styles.loginLinkText
              }
            >
              Já possui uma conta?{' '}

              <Text
                style={
                  styles.loginLinkStrong
                }
              >
                Entrar
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/**
 * Formata CPF apenas para apresentação.
 *
 * O backend não deve depender desta máscara.
 * Na integração, o service/mapper poderá enviar
 * somente os números caso esse seja o contrato.
 */
function formatarCpf(
  valor: string
) {
  const numeros = valor
    .replace(/\D/g, '')
    .slice(0, 11);

  return numeros
    .replace(
      /(\d{3})(\d)/,
      '$1.$2'
    )
    .replace(
      /(\d{3})(\d)/,
      '$1.$2'
    )
    .replace(
      /(\d{3})(\d{1,2})$/,
      '$1-$2'
    );
}

/**
 * Formata telefone brasileiro com DDD.
 *
 * Aceita números com 10 ou 11 dígitos.
 */
function formatarTelefone(
  valor: string
) {
  const numeros = valor
    .replace(/\D/g, '')
    .slice(0, 11);

  if (numeros.length <= 10) {
    return numeros
      .replace(
        /^(\d{2})(\d)/,
        '($1) $2'
      )
      .replace(
        /(\d{4})(\d)/,
        '$1-$2'
      );
  }

  return numeros
    .replace(
      /^(\d{2})(\d)/,
      '($1) $2'
    )
    .replace(
      /(\d{5})(\d)/,
      '$1-$2'
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

    title: {
      marginTop: 8,
      color:
        Colors.textStrong,
      fontSize: 27,
      fontWeight: '700',
    },

    description: {
      marginTop: 8,
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
      fontSize: 13,
      lineHeight: 18,
    },

    continueButton: {
      width: '100%',
      minHeight: 56,
      marginTop: 10,
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

    loginLink: {
      marginTop: 30,
      alignItems: 'center',
    },

    loginLinkText: {
      color:
        Colors.textSecondary,
      fontSize: 14,
    },

    loginLinkStrong: {
      color: Colors.primary,
      fontWeight: '700',
    },
  });