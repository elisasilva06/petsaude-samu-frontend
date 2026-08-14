import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useCadastro } from '@/contexts/CadastroContext';

export default function CadastroSucessoScreen() {
  const scaleAnim = useRef(
    new Animated.Value(0),
  ).current;

  const { limparCadastro } = useCadastro();

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      limparCadastro();
      router.replace('/');
    }, 3500);

    return () => {
      clearTimeout(timer);
    };
  }, [limparCadastro, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
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
            size={70}
            color={Colors.successDark}
          />
        </Animated.View>

        <Text style={styles.title}>
          Conta criada com sucesso!
        </Text>

        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>
            Seu cadastro foi realizado.
          </Text>

          <Text style={styles.subtitle}>
            Redirecionando para o login...
          </Text>
        </View>

        <View style={styles.loaderBarContainer}>
          <View style={styles.loaderBar} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },

  content: {
    width: '80%',
    alignItems: 'center',
  },

  checkCircle: {
    width: 120,
    height: 120,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 60,

    elevation: 10,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  title: {
    marginBottom: 20,
    color: Colors.background,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },

  textContainer: {
    alignItems: 'center',
  },

  subtitle: {
    color: Colors.textOnPrimaryMuted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },

  loaderBarContainer: {
    width: 40,
    height: 4,
    marginTop: 40,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
  },

  loaderBar: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
    opacity: 0.5,
  },
});