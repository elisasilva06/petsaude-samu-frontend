import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';

import {
    Animated,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type AppSplashProps = {
  onFinish: () => void;
};

export function AppSplash({
  onFinish,
}: AppSplashProps) {
  const logoScale =
    useRef(
      new Animated.Value(0.88)
    ).current;

  const logoOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const contentOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const contentTranslateY =
    useRef(
      new Animated.Value(8)
    ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(
          logoScale,
          {
            toValue: 1,
            friction: 7,
            tension: 45,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          logoOpacity,
          {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }
        ),
      ]),

      Animated.parallel([
        Animated.timing(
          contentOpacity,
          {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          contentTranslateY,
          {
            toValue: 0,
            duration: 450,
            useNativeDriver: true,
          }
        ),
      ]),
    ]).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 1800);

    return () => {
      clearTimeout(timer);
    };
  }, [
    contentOpacity,
    contentTranslateY,
    logoOpacity,
    logoScale,
    onFinish,
  ]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
      />

      <LinearGradient
        colors={[
          '#2D4F4F',
          '#1F3D3D',
        ]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,

              transform: [
                {
                  scale: logoScale,
                },
              ],
            },
          ]}
        >
          <Image
            source={require('../../../assets/images/samu-logo.png')}
            style={styles.logo}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContent,
            {
              opacity: contentOpacity,

              transform: [
                {
                  translateY:
                    contentTranslateY,
                },
              ],
            },
          ]}
        >
          <Text style={styles.appName}>
            SAMU 192 Caxias
          </Text>

          <Text style={styles.location}>
            Caxias - Maranhão
          </Text>

          <View style={styles.divider} />

          <Text style={styles.message}>
            Cada segundo salva uma vida.
          </Text>

          <Text style={styles.message}>
            Sua missão começa agora.
          </Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.loadingDot} />

        <Text style={styles.footerText}>
          Equipe Multidisciplinar
        </Text>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#2D4F4F',
    },

    content: {
      flex: 1,
      paddingHorizontal: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },

    logoContainer: {
      width: 142,
      height: 142,
      marginBottom: 25,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 71,

      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.16,
      shadowRadius: 10,

      elevation: 8,
    },

    logo: {
      width: 102,
      height: 102,
      resizeMode: 'contain',
    },

    textContent: {
      alignItems: 'center',
    },

    appName: {
      color: '#FFFFFF',
      fontSize: 21,
      fontWeight: '800',
      letterSpacing: 0.4,
      textAlign: 'center',
    },

    location: {
      marginTop: 5,
      color:
        'rgba(255,255,255,0.72)',
      fontSize: 13,
      fontWeight: '500',
      letterSpacing: 0.4,
    },

    divider: {
      width: 38,
      height: 1,
      marginVertical: 19,
      backgroundColor:
        'rgba(255,255,255,0.30)',
    },

    message: {
      color:
        'rgba(255,255,255,0.90)',
      fontSize: 14,
      lineHeight: 21,
      textAlign: 'center',
    },

    footer: {
      paddingBottom: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },

    loadingDot: {
      width: 5,
      height: 5,
      marginBottom: 9,
      backgroundColor:
        'rgba(255,255,255,0.65)',
      borderRadius: 3,
    },

    footerText: {
      color:
        'rgba(255,255,255,0.48)',
      fontSize: 10,
      fontWeight: '600',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
  });