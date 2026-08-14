import { Feather, Ionicons } from '@expo/vector-icons';
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
    useWindowDimensions,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';

type RequisitoProps = {
  label: string;
  concluido: boolean;
};

function Requisito({ label, concluido }: RequisitoProps) {
  return (
    <View style={styles.requisitoRow}>
      <Ionicons
        name={concluido ? 'checkmark-circle' : 'ellipse-outline'}
        size={18}
        color={concluido ? Colors.successDark : Colors.muted}
      />

      <Text
        style={[
          styles.requisitoText,
          concluido && styles.requisitoConcluido,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function NovaSenhaScreen() {
  const { height: screenHeight } = useWindowDimensions();

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const temOitoCaracteres = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);

  const senhasCoincidem =
    senha.length > 0 &&
    confirmarSenha.length > 0 &&
    senha === confirmarSenha;

  const podeRedefinir =
    temOitoCaracteres &&
    temMaiuscula &&
    temNumero &&
    senhasCoincidem;

  function handleRedefinir() {
    if (!podeRedefinir) {
      return;
    }

    // TEMPORÁRIO:
    // Quando conectarmos o backend, essa navegação
    // só acontecerá depois da confirmação da API.
    router.replace('/');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />

      <View
        style={[
          styles.topSection,
          { height: screenHeight * 0.25 },
        ]}
      >
        <View style={styles.iconCircle}>
          <Feather
            name="shield"
            size={50}
            color={Colors.primary}
          />
        </View>

        <Text style={styles.headerTitle}>
          Segurança SAMU
        </Text>
      </View>

      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>
            Criar Nova Senha
          </Text>

          <Text style={styles.description}>
            Sua nova senha deve ser diferente das anteriores para sua proteção.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nova Senha
            </Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Crie uma senha forte"
                placeholderTextColor={Colors.muted}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!mostrarSenha}
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setMostrarSenha((current) => !current)
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Confirmar Senha
            </Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Repita a senha"
                placeholderTextColor={Colors.muted}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={!mostrarSenha}
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setMostrarSenha((current) => !current)
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

          <View style={styles.validacaoBox}>
            <Text style={styles.validacaoTitle}>
              Requisitos de segurança:
            </Text>

            <Requisito
              label="Mínimo de 8 caracteres"
              concluido={temOitoCaracteres}
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
              concluido={senhasCoincidem}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              !podeRedefinir && styles.saveButtonDisabled,
            ]}
            onPress={handleRedefinir}
            disabled={!podeRedefinir}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              Salvar e Entrar
            </Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              SAMU 192 — Unidade Caxias/MA
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  topSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.surfaceMuted,
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
    color: Colors.textSecondary,
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
    backgroundColor: Colors.surface,
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
    marginBottom: 25,
    padding: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 15,
  },

  validacaoTitle: {
    marginBottom: 10,
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  requisitoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  requisitoText: {
    marginLeft: 10,
    color: Colors.muted,
    fontSize: 14,
  },

  requisitoConcluido: {
    color: Colors.successDark,
    fontWeight: '600',
  },

  saveButton: {
    width: '100%',
    minHeight: 58,
    marginTop: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
  },

  saveButtonDisabled: {
    backgroundColor: Colors.disabled,
  },

  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
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
});