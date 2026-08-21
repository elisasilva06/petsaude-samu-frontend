import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';

export function RiskCard() {
  return (
    <>
      <Text style={styles.sectionTitle}>
        Classificação de Risco
      </Text>

      <View style={styles.card}>
        <View style={styles.dot} />

        <View>
          <Text style={styles.label}>
            PROTOCOLO DEFINIDO:
          </Text>

          <Text style={styles.value}>
            EMERGÊNCIA (VERMELHO)
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
    color: Colors.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  card: {
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.emergency,
    borderRadius: 12,
  },

  dot: {
    width: 14,
    height: 14,
    marginRight: 12,
    backgroundColor: Colors.emergency,
    borderRadius: 7,
  },

  label: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },

  value: {
    marginTop: 2,
    color: Colors.emergency,
    fontSize: 16,
    fontWeight: '900',
  },
});