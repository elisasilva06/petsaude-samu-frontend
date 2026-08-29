import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import {
  ActivityIndicator,
  Image,
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
import { useAuth } from '@/features/auth/context/AuthContext';

type FormErrors = {
  email?: string;
  senha?: string;
  geral?: string;
};

/**
 * Formulário de autenticação da aplicação.
 *
 * Responsabilidades deste componente:
 * - coletar e validar e-mail e senha;
 * - exibir estados visuais de erro e carregamento;
 * - solicitar o login ao AuthContext;
 * - redirecionar após autenticação bem-sucedida.
 *
 * Este componente NÃO deve realizar chamadas HTTP diretamente.
 *
 * Fluxo atual:
 * LoginForm -> AuthContext -> authService -> authMockService
 *
 * Fluxo futuro:
 * LoginForm -> AuthContext -> authService -> authApiService -> API
 */
export function LoginForm() {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();

  const { login, autenticando } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * Valida somente regras pertencentes ao formulário.
   *
   * Regras de política de senha, permissões e autenticação
   * deverão ser determinadas pelo backend.
   */
  function validarFormulario() {
    const novosErros: FormErrors = {};

    const emailNormalizado = email.trim();

    if (!emailNormalizado) {
      novosErros.email = 'O e-mail é obrigatório.';
    } else if (!validarEmail(emailNormalizado)) {
      novosErros.email = 'Digite um e-mail válido.';
    }

    if (!senha.trim()) {
      novosErros.senha = 'A senha é obrigatória.';
    }

    setErrors(novosErros);

    return Object.keys(novosErros).length === 0;
  }

  function handleEmailChange(text: string) {
    setEmail(text);

    if (errors.email || errors.geral) {
      setErrors((current) => ({
        ...current,
        email: undefined,
        geral: undefined,
      }));
    }
  }

  function handleSenhaChange(text: string) {
    setSenha(text);

    if (errors.senha || errors.geral) {
      setErrors((current) => ({
        ...current,
        senha: undefined,
        geral: undefined,
      }));
    }
  }

  async function handleLogin() {
    if (!validarFormulario()) {
      return;
    }

    try {
      setErrors({});

      await login({
        email: email.trim().toLowerCase(),
        senha,
      });

      /*
       * Após o AuthContext confirmar a autenticação,
       * o usuário pode acessar a área principal.
       *
       * Futuramente a proteção das rotas também deverá
       * considerar o estado global da sessão.
       */
      router.replace('/home');
    } catch (error) {
      console.error('Erro ao realizar login:', error);

      /**
       * TODO(BACKEND):
       * Quando a API estiver disponível, o authApiService
       * deverá transformar erros HTTP em erros compreensíveis
       * para a interface, por exemplo:
       *
       * - credenciais inválidas;
       * - usuário sem autorização;
       * - falha de conexão;
       * - sessão indisponível.
       *
       * A tela não deve interpretar status HTTP diretamente.
       */
      setErrors({
        geral:
          'Não foi possível entrar. Verifique suas credenciais e tente novamente.',
      });
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Identidade visual da aplicação */}
        <View
          style={[
            styles.topSection,
            {
              height: screenHeight * 0.25,
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/samu-logo.png')}
              style={styles.logo}
            />
          </View>

          <Text style={styles.location}>
            Caxias - Maranhão
          </Text>
        </View>

        <View
          style={[
            styles.loginCard,
            {
              minHeight: screenHeight * 0.75,
            },
          ]}
        >
          <Text style={styles.title}>
            Equipe Multidisciplinar
          </Text>

          <View style={styles.form}>
            {/* E-mail */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  errors.email && styles.labelError,
                ]}
              >
                E-mail
              </Text>

              <TextInput
                style={[
                  styles.input,
                  errors.email && styles.inputError,
                ]}
                placeholder="seu.email@exemplo.com"
                placeholderTextColor={Colors.muted}
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                editable={!autenticando}
                returnKeyType="next"
              />

              {errors.email && (
                <Text style={styles.errorText}>
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Senha */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  errors.senha && styles.labelError,
                ]}
              >
                Senha
              </Text>

              <View
                style={[
                  styles.passwordContainer,
                  errors.senha && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Digite sua senha"
                  placeholderTextColor={Colors.muted}
                  value={senha}
                  onChangeText={handleSenhaChange}
                  secureTextEntry={!mostrarSenha}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  textContentType="password"
                  editable={!autenticando}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() =>
                    setMostrarSenha((current) => !current)
                  }
                  disabled={autenticando}
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
                    color={
                      errors.senha
                        ? Colors.danger
                        : Colors.muted
                    }
                  />
                </TouchableOpacity>
              </View>

              {errors.senha && (
                <Text style={styles.errorText}>
                  {errors.senha}
                </Text>
              )}
            </View>

            {/* Erro geral da autenticação */}
            {errors.geral && (
              <View style={styles.authErrorBox}>
                <Ionicons
                  name="alert-circle-outline"
                  size={19}
                  color={Colors.danger}
                />

                <Text style={styles.authErrorText}>
                  {errors.geral}
                </Text>
              </View>
            )}

            {/* Entrar */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                autenticando && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={autenticando}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Entrar na aplicação"
            >
              {autenticando ? (
                <View style={styles.loadingContent}>
                  <ActivityIndicator
                    color={Colors.background}
                    size="small"
                  />

                  <Text style={styles.loginButtonText}>
                    Entrando...
                  </Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>
                  Entrar
                </Text>
              )}
            </TouchableOpacity>

            {/* Recuperação de senha */}
            <TouchableOpacity
              onPress={() =>
                router.push('/esqueci-senha')
              }
              disabled={autenticando}
              activeOpacity={0.8}
            >
              <Text style={styles.forgotPassword}>
                Esqueci minha senha
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />

              <Text style={styles.dividerText}>
                ou
              </Text>

              <View style={styles.line} />
            </View>

            {/* Cadastro */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() =>
                router.push('/cadastro/dados-pessoais')
              }
              disabled={autenticando}
              activeOpacity={0.85}
            >
              <Text style={styles.registerButtonText}>
                Criar nova conta
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Acesso restrito a profissionais autorizados
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/**
 * Validação simples de formato.
 *
 * A confirmação de que a conta realmente existe
 * pertence ao serviço de autenticação/backend.
 */
function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  scrollContent: {
    flexGrow: 1,
  },

  topSection: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },

  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },

  logo: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
  },

  location: {
    marginTop: 8,
    color: Colors.background,
    fontSize: 13,
    fontWeight: '500',
  },

  loginCard: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: '7%',
    backgroundColor: Colors.surfaceMuted,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  title: {
    marginBottom: 28,
    color: Colors.textStrong,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },

  form: {
    flex: 1,
  },

  inputGroup: {
    marginBottom: 15,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    color: Colors.text,
    fontSize: 16,
  },

  inputError: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerSurface,
  },

  errorText: {
    marginTop: 5,
    marginLeft: 4,
    color: Colors.danger,
    fontSize: 12,
  },

  passwordContainer: {
    height: 56,
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

  authErrorBox: {
    marginBottom: 5,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.dangerSurface,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 10,
  },

  authErrorText: {
    flex: 1,
    color: Colors.danger,
    fontSize: 12,
    lineHeight: 17,
  },

  loginButton: {
    height: 56,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
  },

  buttonDisabled: {
    opacity: 0.75,
  },

  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  loginButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
  },

  forgotPassword: {
    marginTop: 15,
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },

  dividerText: {
    marginHorizontal: 10,
    color: Colors.muted,
    fontSize: 12,
  },

  registerButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },

  registerButtonText: {
    color: Colors.textLabel,
    fontSize: 15,
    fontWeight: '600',
  },

  infoBox: {
    marginTop: 'auto',
    paddingTop: 20,
  },

  infoText: {
    color: Colors.muted,
    fontSize: 11,
    textAlign: 'center',
  },
});