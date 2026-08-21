import { Ionicons } from '@expo/vector-icons';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { Chamado } from '../types';

type LocationCardProps = {
  chamado: Chamado;
  onOpenGPS: () => void;
};

export function LocationCard({
  chamado,
  onOpenGPS,
}: LocationCardProps) {
  return (
    <>
      <Text style={styles.sectionTitle}>
        Localização da Ocorrência
      </Text>

      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <Ionicons
            name="location-outline"
            size={25}
            color={Colors.emergency}
          />

          <View style={styles.locationTextContainer}>
            <Text style={styles.addressTitle}>
              {chamado.bairro}
            </Text>

            <Text style={styles.addressSubtitle}>
              {chamado.endereco}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.routeButton}
          onPress={onOpenGPS}
        >
          <Ionicons
            name="navigate-outline"
            size={20}
            color={Colors.background}
          />

          <Text style={styles.routeButtonText}>
            ABRIR NAVEGAÇÃO (GPS)
          </Text>
        </TouchableOpacity>
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

  locationCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: 16,
  },

  locationHeader: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  addressTitle: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  addressSubtitle: {
    marginTop: 2,
    color: Colors.textLabel,
    fontSize: 13,
  },

  routeButton: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.emergency,
    borderRadius: 12,
  },

  routeButtonText: {
    marginLeft: 8,
    color: Colors.background,
    fontSize: 13,
    fontWeight: '800',
  },
});