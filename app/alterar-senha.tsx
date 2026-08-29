import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
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

export default function AlterarSenhaScreen() {
  const [senhaAtual, setSenhaAtual] =
    useState('');

  const [novaSenha, setNovaSenha] =
    useState('');

  const [
    confirmarSenha,
    setConfirmarSenha,
  ] = useState('');

  const [
    mostrarSenhaAtual,
    setMostrarSenhaAtual,
  ] = useState(false);

  const [
    mostrarNovaSenha,
    setMostrarNovaSenha,
  ] = useState(false);

  const [
    mostrarConfirmacao,
    setMostrarConfirmacao,
  ] = useState(false);

  const [
    salvando,
    setSalvando,
  ] = useState(false);

  const [
    salvo,
    setSalvo,
  ] = useState(false);

  const senhaTemTamanho =
    novaSenha.length >= 8;

  const senhaTemNumero =
    /\d/.test(novaSenha);

  const senhaTemMaiuscula =
    /[A-Z]/.test(novaSenha);

  const senhasIguais =
    novaSenha.length > 0 &&
    novaSenha === confirmarSenha;

  const formularioValido =
    senhaAtual.length > 0 &&
    senhaTemTamanho &&
    senhaTemNumero &&
    senhaTemMaiuscula &&
    senhasIguais;

  function voltar() {
    router.back();
  }

  function alterarSenhaAtual(
    valor: string
  ) {
    setSenhaAtual(valor);
    setSalvo(false);
  }

  function alterarNovaSenha(
    valor: string
  ) {
    setNovaSenha(valor);
    setSalvo(false);
  }

  function alterarConfirmacao(
    valor: string
  ) {
    setConfirmarSenha(valor);
    setSalvo(false);
  }

  async function salvarNovaSenha() {
    if (!senhaAtual) {
      Alert.alert(
        'Senha atual',
        'Informe sua senha atual.'
      );

      return;
    }

    if (!senhaTemTamanho) {
      Alert.alert(
        'Nova senha inválida',
        'A nova senha deve possuir pelo menos 8 caracteres.'
      );

      return;
    }

    if (!senhaTemMaiuscula) {
      Alert.alert(
        'Nova senha inválida',
        'A nova senha deve possuir pelo menos uma letra maiúscula.'
      );

      return;
    }

    if (!senhaTemNumero) {
      Alert.alert(
        'Nova senha inválida',
        'A nova senha deve possuir pelo menos um número.'
      );

      return;
    }

    if (!senhasIguais) {
      Alert.alert(
        'Senhas diferentes',
        'A confirmação deve ser igual à nova senha.'
      );

      return;
    }

    try {
      setSalvando(true);
      setSalvo(false);

      /*
       * A tela conversa apenas
       * com o service.
       *
       * Hoje:
       * senhaService -> mock
       *
       * Depois:
       * senhaService -> API
       */
      await senhaService.alterarSenha({
        senhaAtual,
        novaSenha,
      });

      setSalvo(true);

      /*
       * Limpamos os campos por
       * segurança após o sucesso.
       */
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');

      setMostrarSenhaAtual(false);
      setMostrarNovaSenha(false);
      setMostrarConfirmacao(false);
    } catch (error) {
      console.error(
        'Erro ao alterar senha:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível alterar a senha. Tente novamente.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={voltar}
          disabled={salvando}
          activeOpacity={0.8}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors.text}
          />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text
            style={styles.headerTitle}
          >
            Alterar senha
          </Text>

          <Text
            style={
              styles.headerSubtitle
            }
          >
            Atualize sua senha de acesso
          </Text>
        </View>
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
        {/* ÍCONE */}
        <View style={styles.iconSection}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="lock-closed-outline"
              size={34}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.title}>
            Segurança da conta
          </Text>

          <Text
            style={styles.description}
          >
            Informe sua senha atual e escolha
            uma nova senha para continuar.
          </Text>
        </View>

        {/* FORMULÁRIO */}
        {!salvo && (
          <View style={styles.card}>
            <Text style={styles.label}>
              Senha atual
            </Text>

            <View
              style={
                styles.passwordContainer
              }
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Digite sua senha atual"
                placeholderTextColor={
                  Colors.muted
                }
                value={senhaAtual}
                onChangeText={
                  alterarSenhaAtual
                }
                secureTextEntry={
                  !mostrarSenhaAtual
                }
                editable={!salvando}
              />

              <TouchableOpacity
                style={styles.eyeButton}
                disabled={salvando}
                onPress={() =>
                  setMostrarSenhaAtual(
                    !mostrarSenhaAtual
                  )
                }
              >
                <Ionicons
                  name={
                    mostrarSenhaAtual
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={20}
                  color={
                    Colors.textSecondary
                  }
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>
              Nova senha
            </Text>

            <View
              style={
                styles.passwordContainer
              }
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Digite a nova senha"
                placeholderTextColor={
                  Colors.muted
                }
                value={novaSenha}
                onChangeText={
                  alterarNovaSenha
                }
                secureTextEntry={
                  !mostrarNovaSenha
                }
                editable={!salvando}
              />

              <TouchableOpacity
                style={styles.eyeButton}
                disabled={salvando}
                onPress={() =>
                  setMostrarNovaSenha(
                    !mostrarNovaSenha
                  )
                }
              >
                <Ionicons
                  name={
                    mostrarNovaSenha
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={20}
                  color={
                    Colors.textSecondary
                  }
                />
              </TouchableOpacity>
            </View>

            {/* REQUISITOS */}
            <View
              style={styles.requirements}
            >
              <Requirement
                valid={senhaTemTamanho}
                label="Pelo menos 8 caracteres"
              />

              <Requirement
                valid={
                  senhaTemMaiuscula
                }
                label="Uma letra maiúscula"
              />

              <Requirement
                valid={senhaTemNumero}
                label="Pelo menos um número"
              />
            </View>

            <Text style={styles.label}>
              Confirmar nova senha
            </Text>

            <View
              style={
                styles.passwordContainer
              }
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Digite novamente"
                placeholderTextColor={
                  Colors.muted
                }
                value={confirmarSenha}
                onChangeText={
                  alterarConfirmacao
                }
                secureTextEntry={
                  !mostrarConfirmacao
                }
                editable={!salvando}
              />

              <TouchableOpacity
                style={styles.eyeButton}
                disabled={salvando}
                onPress={() =>
                  setMostrarConfirmacao(
                    !mostrarConfirmacao
                  )
                }
              >
                <Ionicons
                  name={
                    mostrarConfirmacao
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={20}
                  color={
                    Colors.textSecondary
                  }
                />
              </TouchableOpacity>
            </View>

            {confirmarSenha.length >
              0 && (
              <View
                style={
                  styles.matchContainer
                }
              >
                <Ionicons
                  name={
                    senhasIguais
                      ? 'checkmark-circle'
                      : 'alert-circle'
                  }
                  size={16}
                  color={
                    senhasIguais
                      ? Colors.success
                      : Colors.danger
                  }
                />

                <Text
                  style={[
                    styles.matchText,

                    {
                      color:
                        senhasIguais
                          ? Colors.success
                          : Colors.danger,
                    },
                  ]}
                >
                  {senhasIguais
                    ? 'As senhas coincidem'
                    : 'As senhas não coincidem'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* CONFIRMAÇÃO */}
        {salvo && (
          <View
            style={styles.successCard}
          >
            <View
              style={styles.successIcon}
            >
              <Ionicons
                name="checkmark-circle"
                size={38}
                color={Colors.success}
              />
            </View>

            <Text
              style={styles.successTitle}
            >
              Senha atualizada
            </Text>

            <Text
              style={
                styles.successDescription
              }
            >
              Sua senha foi alterada com
              sucesso.
            </Text>

            <Text
              style={styles.successHelper}
            >
              Você já pode continuar usando
              sua conta normalmente.
            </Text>
          </View>
        )}

        {/* SALVAR / VOLTAR */}
        <TouchableOpacity
          style={[
            styles.saveButton,

            !salvo &&
              (!formularioValido ||
                salvando) &&
              styles.saveButtonDisabled,

            salvo &&
              styles.savedButton,
          ]}
          disabled={
            salvo
              ? false
              : !formularioValido ||
                salvando
          }
          onPress={
            salvo
              ? voltar
              : salvarNovaSenha
          }
          activeOpacity={0.85}
        >
          {salvando ? (
            <ActivityIndicator
              size="small"
              color={Colors.background}
            />
          ) : (
            <Ionicons
              name={
                salvo
                  ? 'arrow-back-outline'
                  : 'shield-checkmark-outline'
              }
              size={20}
              color={Colors.background}
            />
          )}

          <Text
            style={
              styles.saveButtonText
            }
          >
            {salvando
              ? 'Salvando...'
              : salvo
                ? 'Voltar ao perfil'
                : 'Salvar nova senha'}
          </Text>
        </TouchableOpacity>

        {/* CANCELAR */}
        {!salvo && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={voltar}
            disabled={salvando}
            activeOpacity={0.8}
          >
            <Text
              style={
                styles.cancelButtonText
              }
            >
              Cancelar
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type RequirementProps = {
  valid: boolean;
  label: string;
};

function Requirement({
  valid,
  label,
}: RequirementProps) {
  return (
    <View
      style={styles.requirementRow}
    >
      <Ionicons
        name={
          valid
            ? 'checkmark-circle'
            : 'ellipse-outline'
        }
        size={15}
        color={
          valid
            ? Colors.success
            : Colors.muted
        }
      />

      <Text
        style={[
          styles.requirementText,

          valid &&
            styles.requirementTextValid,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.surfaceMuted,
  },

  header: {
    minHeight: 66,
    paddingHorizontal: 14,
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

  headerText: {
    marginLeft: 5,
  },

  headerTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
  },

  headerSubtitle: {
    marginTop: 2,
    color: Colors.textSecondary,
    fontSize: 11,
  },

  content: {
    padding: 16,
    paddingBottom: 35,
  },

  iconSection: {
    paddingVertical: 22,
    alignItems: 'center',
  },

  iconCircle: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Colors.surfaceSecondary,
    borderRadius: 36,
  },

  title: {
    marginTop: 12,
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
  },

  description: {
    maxWidth: 280,
    marginTop: 5,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },

  card: {
    padding: 16,
    backgroundColor:
      Colors.background,
    borderWidth: 1,
    borderColor:
      Colors.border,
    borderRadius: 14,
  },

  label: {
    marginTop: 6,
    marginBottom: 7,
    color: Colors.textLabel,
    fontSize: 11,
    fontWeight: '700',
  },

  passwordContainer: {
    minHeight: 49,
    marginBottom: 13,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      Colors.surfaceMuted,
    borderWidth: 1,
    borderColor:
      Colors.border,
    borderRadius: 10,
  },

  passwordInput: {
    flex: 1,
    minHeight: 47,
    paddingHorizontal: 12,
    color: Colors.text,
    fontSize: 13,
  },

  eyeButton: {
    width: 45,
    height: 47,
    alignItems: 'center',
    justifyContent: 'center',
  },

  requirements: {
    marginBottom: 15,
    padding: 12,
    gap: 7,
    backgroundColor:
      Colors.surfaceSecondary,
    borderRadius: 10,
  },

  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  requirementText: {
    color: Colors.textSecondary,
    fontSize: 10,
  },

  requirementTextValid: {
    color: Colors.success,
    fontWeight: '600',
  },

  matchContainer: {
    marginTop: -3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  matchText: {
    fontSize: 10,
    fontWeight: '600',
  },

  successCard: {
    padding: 24,
    alignItems: 'center',
    backgroundColor:
      Colors.background,
    borderWidth: 1,
    borderColor:
      Colors.success,
    borderRadius: 16,
  },

  successIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 30,
  },

  successTitle: {
    color: Colors.success,
    fontSize: 17,
    fontWeight: '800',
  },

  successDescription: {
    marginTop: 5,
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  successHelper: {
    maxWidth: 260,
    marginTop: 5,
    color: Colors.textSecondary,
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
  },

  saveButton: {
    minHeight: 52,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor:
      Colors.primary,
    borderRadius: 14,
  },

  saveButtonDisabled: {
    backgroundColor:
      Colors.disabled,
  },

  savedButton: {
    backgroundColor:
      Colors.success,
  },

  saveButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '800',
  },

  cancelButton: {
    minHeight: 48,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
});