import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';

import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '@/constants/theme';

/**
 * Tela exibida somente após a confirmação
 * de sucesso do CadastroService.
 *
 * Esta tela é apenas de apresentação.
 *
 * Ela NÃO deve:
 * - criar o cadastro;
 * - chamar a API;
 * - limpar o CadastroContext;
 * - manipular dados pessoais/profissionais.
 *
 * O fluxo correto é:
 *
 * Áreas de atuação
 *      ↓
 * cadastroService.criarCadastro()
 *      ↓
 * sucesso confirmado
 *      ↓
 * limparCadastro()
 *      ↓
 * CadastroSucessoScreen
 *      ↓
 * Login
 */
export default function CadastroSucessoScreen() {
  const scaleAnim = useRef(
    new Animated.Value(0)
  ).current;

  const opacityAnim = useRef(
    new Animated.Value(0)
  ).current;

  /**
   * Redireciona para o Login.
   *
   * Usamos replace para impedir que o usuário
   * volte para a tela de sucesso pelo botão Voltar.
   */
  function irParaLogin() {
    router.replace('/');
  }

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 55,
        useNativeDriver: true,
      }),

      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    /**
     * Redirecionamento automático apenas por conveniência.
     *
     * A criação da conta já foi concluída antes desta tela,
     * portanto nenhuma operação de backend acontece aqui.
     */
    const timer = setTimeout(() => {
      irParaLogin();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [opacityAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.checkCircle,
            {
              transform: [
                {
                  scale: scaleAnim,
                },
              ],
            },
          ]}
        >
          <Ionicons
            name="checkmark-sharp"
            size={66}
            color={Colors.successDark}
          />
        </Animated.View>

        <Text style={styles.title}>
          Conta criada com sucesso!
        </Text>

        <Text style={styles.subtitle}>
          Seu cadastro foi concluído.
        </Text>

        <Text style={styles.description}>
          Agora você já pode voltar ao Login para acessar sua conta.
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={irParaLogin}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Ir para o Login"
        >
          <Text style={styles.loginButtonText}>
            Ir para o Login
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color={Colors.primary}
          />
        </TouchableOpacity>

        <View style={styles.redirectContainer}>
          <Text style={styles.redirectText}>
            Redirecionando automaticamente...
          </Text>

          <View style={styles.loaderBarContainer}>
            <View style={styles.loaderBar} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },

  content: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },

  checkCircle: {
    width: 118,
    height: 118,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 59,

    elevation: 8,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  title: {
    color: Colors.background,
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 12,
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  description: {
    maxWidth: 340,
    marginTop: 7,
    color: Colors.textOnPrimaryMuted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },

  loginButton: {
    width: '100%',
    maxWidth: 340,
    minHeight: 56,
    marginTop: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.background,
    borderRadius: 12,
  },

  loginButtonText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },

  redirectContainer: {
    marginTop: 24,
    alignItems: 'center',
  },

  redirectText: {
    color: Colors.textOnPrimaryMuted,
    fontSize: 11,
    textAlign: 'center',
  },

  loaderBarContainer: {
    width: 42,
    height: 4,
    marginTop: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 2,
  },

  loaderBar: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
    opacity: 0.55,
  },
});