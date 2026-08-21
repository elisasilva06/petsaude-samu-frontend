import { Ionicons } from '@expo/vector-icons';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { Chamado } from '../types';

type DestinationCardProps = {
  chamado: Chamado;
};

export function DestinationCard({
  chamado,
}: DestinationCardProps) {
  return (
    <>
      <Text style={styles.sectionTitle}>
        Encaminhamento
      </Text>

      <View style={styles.card}>
        <View style={styles.item}>
          <Ionicons
            name="business-outline"
            size={21}
            color={Colors.primary}
          />

          <View style={styles.content}>
            <Text style={styles.label}>
              Hospital de Destino
            </Text>

            <Text style={styles.value}>
              {chamado.hospital}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.item}>
          <Ionicons
            name="document-text-outline"
            size={21}
            color={Colors.primary}
          />

          <View style={styles.content}>
            <Text style={styles.label}>
              Setor
            </Text>

            <Text style={styles.value}>
              {chamado.setor}
            </Text>
          </View>
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  label: {
    color: Colors.textSecondary,
    fontSize: 11,
  },

  value: {
    marginTop: 2,
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    marginVertical: 12,
    backgroundColor: Colors.surfaceSecondary,
  },
});