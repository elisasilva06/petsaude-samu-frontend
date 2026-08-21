import { Ionicons } from '@expo/vector-icons';
import {
    router,
    useLocalSearchParams,
} from 'expo-router';

import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

import { buscarHistoricoPorId } from '@/features/historico/mocks';

export default function DetalhesHistoricoScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const atendimento =
    buscarHistoricoPorId(id ?? '');

  if (!atendimento) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={46}
            color={Colors.muted}
          />

          <Text style={styles.notFoundTitle}>
            Atendimento não encontrado
          </Text>

          <Text style={styles.notFoundText}>
            Não foi possível localizar este
            atendimento no histórico.
          </Text>

          <Text
            style={styles.backLink}
            onPress={() => router.back()}
          >
            Voltar
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const emergencia =
    atendimento.classificacao ===
    'Emergência';

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={Colors.text}
          onPress={() => router.back()}
        />

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>
            Detalhes do Atendimento
          </Text>

          <Text style={styles.headerSubtitle}>
            Ocorrência #{atendimento.id}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* STATUS */}
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <Ionicons
              name="checkmark-circle"
              size={28}
              color={Colors.success}
            />

            <View>
              <Text style={styles.statusTitle}>
                Atendimento finalizado
              </Text>

              <Text style={styles.statusSubtitle}>
                {atendimento.data} •{' '}
                {atendimento.horario}
              </Text>
            </View>
          </View>

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
        </View>

        {/* PACIENTE */}
        <Text style={styles.sectionLabel}>
          Paciente
        </Text>

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="person-outline"
              size={22}
              color={Colors.primary}
            />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.mainText}>
              {atendimento.paciente}
            </Text>

            <Text style={styles.secondaryText}>
              {atendimento.idade} anos •{' '}
              {atendimento.sexo}
            </Text>
          </View>
        </View>

        {/* OCORRÊNCIA */}
        <Text style={styles.sectionLabel}>
          Ocorrência
        </Text>

        <View style={styles.infoCard}>
          <InfoRow
            icon="medical-outline"
            label="Tipo"
            value={atendimento.tipoOcorrencia}
          />

          <InfoRow
            icon="calendar-outline"
            label="Data"
            value={atendimento.data}
          />

          <InfoRow
            icon="time-outline"
            label="Horário"
            value={atendimento.horario}
          />

          <InfoRow
            icon="location-outline"
            label="Local"
            value={atendimento.endereco}
          />
        </View>

        {/* DESTINO */}
        <Text style={styles.sectionLabel}>
          Destino
        </Text>

        <View style={styles.infoCard}>
          <InfoRow
            icon="business-outline"
            label="Hospital"
            value={
              atendimento.hospitalDestino
            }
          />
        </View>

        {/* PROFISSIONAL */}
        <Text style={styles.sectionLabel}>
          Profissional responsável
        </Text>

        <View style={styles.infoCard}>
          <InfoRow
            icon="person-circle-outline"
            label="Responsável"
            value={
              atendimento.profissional
            }
          />
        </View>

        {/* FICHA SAE */}
        <Text style={styles.sectionLabel}>
          Registro clínico
        </Text>

        <View style={styles.saeCard}>
          <View style={styles.saeIcon}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={Colors.primary}
            />
          </View>

          <View style={styles.saeContent}>
            <Text style={styles.saeTitle}>
              Ficha SAE
            </Text>

            <Text style={styles.saeText}>
              Os dados completos da ficha
              aparecerão aqui quando o backend
              disponibilizar o registro do
              atendimento.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

function InfoRow({
  icon,
  label,
  value,
}: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={18}
          color={Colors.primary}
        />
      </View>

      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceMuted,
  },

  header: {
    minHeight: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  headerText: {
    flex: 1,
  },

  headerTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '800',
  },

  headerSubtitle: {
    marginTop: 2,
    color: Colors.textSecondary,
    fontSize: 11,
  },

  content: {
    padding: 16,
    paddingBottom: 35,
  },

  statusCard: {
    marginBottom: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 15,
  },

  statusLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  statusTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '800',
  },

  statusSubtitle: {
    marginTop: 3,
    color: Colors.textSecondary,
    fontSize: 10,
  },

  riskBadge: {
    paddingHorizontal: 9,
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
    fontSize: 9,
    fontWeight: '800',
  },

  emergencyText: {
    color: Colors.danger,
  },

  urgentText: {
    color: Colors.primary,
  },

  sectionLabel: {
    marginTop: 5,
    marginBottom: 8,
    color: Colors.textLabel,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  card: {
    marginBottom: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
  },

  iconCircle: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 21,
  },

  cardContent: {
    flex: 1,
    marginLeft: 12,
  },

  mainText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '800',
  },

  secondaryText: {
    marginTop: 3,
    color: Colors.textSecondary,
    fontSize: 11,
  },

  infoCard: {
    marginBottom: 18,
    paddingHorizontal: 15,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
  },

  infoRow: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceSecondary,
  },

  infoIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 18,
  },

  infoTextContainer: {
    flex: 1,
    marginLeft: 11,
  },

  infoLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },

  infoValue: {
    marginTop: 3,
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
  },

  saeCard: {
    padding: 16,
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
  },

  saeIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 21,
  },

  saeContent: {
    flex: 1,
    marginLeft: 12,
  },

  saeTitle: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '800',
  },

  saeText: {
    marginTop: 4,
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
  },

  notFoundContainer: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notFoundTitle: {
    marginTop: 12,
    color: Colors.text,
    fontSize: 17,
    fontWeight: '800',
  },

  notFoundText: {
    marginTop: 5,
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },

  backLink: {
    marginTop: 18,
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
});