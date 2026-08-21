import { Ionicons } from '@expo/vector-icons';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { Chamado } from '../types';

type PatientCardProps = {
  chamado: Chamado;
  onCall: () => void;
};

export function PatientCard({
  chamado,
  onCall,
}: PatientCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.patientHeader}>
        <View style={styles.avatar}>
          <Ionicons
            name="person-outline"
            size={30}
            color={Colors.textSecondary}
          />
        </View>

        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>
            {chamado.paciente}
          </Text>

          <Text style={styles.patientSubtitle}>
            {chamado.idade} anos • {chamado.sexo}
          </Text>
        </View>
      </View>

      <View style={styles.alertBox}>
        <Ionicons
          name="alert-circle-outline"
          size={20}
          color={Colors.emergency}
        />

        <Text style={styles.alertText}>
          Queixa: {chamado.queixa}
        </Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onCall}
        >
          <Ionicons
            name="call-outline"
            size={19}
            color={Colors.primary}
          />

          <Text style={styles.secondaryButtonText}>
            Ligar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            styles.secondaryButtonSpacing,
          ]}
        >
          <Ionicons
            name="image-outline"
            size={19}
            color={Colors.primary}
          />

          <Text style={styles.secondaryButtonText}>
            Fotos ({chamado.fotos})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
  },

  patientHeader: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 50,
    height: 50,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 25,
  },

  patientInfo: {
    flex: 1,
  },

  patientName: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
  },

  patientSubtitle: {
    marginTop: 2,
    color: Colors.textSecondary,
    fontSize: 13,
  },

  alertBox: {
    marginBottom: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dangerSurface,
    borderRadius: 10,
  },

  alertText: {
    flex: 1,
    marginLeft: 8,
    color: Colors.emergency,
    fontSize: 14,
    fontWeight: '600',
  },

  actionRow: {
    flexDirection: 'row',
  },

  secondaryButton: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
  },

  secondaryButtonSpacing: {
    marginLeft: 8,
  },

  secondaryButtonText: {
    marginLeft: 8,
    color: Colors.textLabel,
    fontWeight: '600',
  },
});