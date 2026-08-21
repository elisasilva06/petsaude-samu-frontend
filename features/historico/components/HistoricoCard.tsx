import { Ionicons } from '@expo/vector-icons';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';

import { HistoricoAtendimento } from '../types';

type HistoricoCardProps = {
  atendimento: HistoricoAtendimento;
  onPress: () => void;
};

export function HistoricoCard({
  atendimento,
  onPress,
}: HistoricoCardProps) {
  const emergencia =
    atendimento.classificacao === 'Emergência';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>
            {atendimento.paciente}
          </Text>

          <Text style={styles.patientDetails}>
            {atendimento.idade} anos •{' '}
            {atendimento.sexo}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors.muted}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Ionicons
          name="calendar-outline"
          size={16}
          color={Colors.textSecondary}
        />

        <Text style={styles.infoText}>
          {atendimento.data} •{' '}
          {atendimento.horario}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons
          name="medical-outline"
          size={16}
          color={Colors.textSecondary}
        />

        <Text style={styles.infoText}>
          {atendimento.tipoOcorrencia}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons
          name="location-outline"
          size={16}
          color={Colors.textSecondary}
        />

        <Text style={styles.infoText}>
          {atendimento.endereco}
        </Text>
      </View>

      <View style={styles.footer}>
        <View
          style={[
            styles.riskBadge,

            emergencia
              ? styles.emergencyBadge
              : styles.urgentBadge,
          ]}
        >
          <Text
            style={[
              styles.riskText,

              emergencia
                ? styles.emergencyText
                : styles.urgentText,
            ]}
          >
            {atendimento.classificacao}
          </Text>
        </View>

        <View style={styles.finishedBadge}>
          <Ionicons
            name="checkmark-circle"
            size={15}
            color={Colors.success}
          />

          <Text style={styles.finishedText}>
            Finalizado
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  patientInfo: {
    flex: 1,
  },

  patientName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },

  patientDetails: {
    marginTop: 3,
    color: Colors.textSecondary,
    fontSize: 11,
  },

  divider: {
    height: 1,
    marginVertical: 13,
    backgroundColor: Colors.border,
  },

  infoRow: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  infoText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 12,
  },

  footer: {
    marginTop: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  emergencyBadge: {
    backgroundColor: Colors.dangerSurface,
  },

  urgentBadge: {
    backgroundColor: Colors.surfaceSecondary,
  },

  riskText: {
    fontSize: 10,
    fontWeight: '800',
  },

  emergencyText: {
    color: Colors.danger,
  },

  urgentText: {
    color: Colors.primary,
  },

  finishedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  finishedText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: '700',
  },
});