import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

import { perfilProfissionalMock } from '@/features/perfil/mocks';

export default function PerfilScreen() {
  const perfil = perfilProfissionalMock;

  function sair() {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            /*
             * Temporário.
             *
             * Quando integrarmos autenticação,
             * o logout real será feito aqui.
             */
            router.replace('/');
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            Perfil
          </Text>

          <Text style={styles.headerSubtitle}>
            Dados do profissional
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.8}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* PROFISSIONAL */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={34}
              color={Colors.background}
            />
          </View>

          <Text style={styles.name}>
            {perfil.nome}
          </Text>

          <Text style={styles.role}>
            {perfil.cargo}
          </Text>

          <View
            style={[
              styles.statusBadge,
              perfil.status === 'disponivel'
                ? styles.availableBadge
                : styles.unavailableBadge,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                perfil.status === 'disponivel'
                  ? styles.availableDot
                  : styles.unavailableDot,
              ]}
            />

            <Text
              style={[
                styles.statusText,
                perfil.status === 'disponivel'
                  ? styles.availableText
                  : styles.unavailableText,
              ]}
            >
              {perfil.status === 'disponivel'
                ? 'Disponível'
                : 'Indisponível'}
            </Text>
          </View>
        </View>

        {/* PLANTÃO */}
        <Text style={styles.sectionTitle}>
          Plantão atual
        </Text>

        <View style={styles.shiftCard}>
          <View style={styles.shiftIcon}>
            <Ionicons
              name="time-outline"
              size={22}
              color={Colors.primary}
            />
          </View>

          <View style={styles.shiftInfo}>
            <Text style={styles.shiftLabel}>
              Horário
            </Text>

            <Text style={styles.shiftValue}>
              {perfil.plantao.inicio} -{' '}
              {perfil.plantao.fim}
            </Text>
          </View>

          <View style={styles.shiftStatus}>
            <Text style={styles.shiftStatusText}>
              Em plantão
            </Text>
          </View>
        </View>

        {/* DADOS PESSOAIS */}
        <Text style={styles.sectionTitle}>
          Dados pessoais
        </Text>

        <View style={styles.card}>
          <InfoRow
            icon="mail-outline"
            label="E-mail"
            value={perfil.email}
          />

          <InfoRow
            icon="call-outline"
            label="Telefone"
            value={perfil.telefone}
          />

          <InfoRow
            icon="card-outline"
            label="CPF"
            value={perfil.cpf}
            last
          />
        </View>

        {/* DADOS PROFISSIONAIS */}
        <Text style={styles.sectionTitle}>
          Dados profissionais
        </Text>

        <View style={styles.card}>
          <InfoRow
            icon="medkit-outline"
            label="Registro"
            value={perfil.registro}
          />

          <InfoRow
            icon="map-outline"
            label="UF"
            value={perfil.uf}
          />

          <InfoRow
            icon="business-outline"
            label="Unidade"
            value={perfil.unidade}
            last
          />
        </View>

        {/* ESPECIALIDADES */}
        <Text style={styles.sectionTitle}>
          Especialidades
        </Text>

        <View style={styles.specialtiesCard}>
          <View style={styles.specialties}>
            {perfil.especialidades.map(
              (especialidade) => (
                <View
                  key={especialidade}
                  style={styles.specialtyBadge}
                >
                  <Ionicons
                    name="medical-outline"
                    size={14}
                    color={Colors.primary}
                  />

                  <Text
                    style={styles.specialtyText}
                  >
                    {especialidade}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* CONTA */}
        <Text style={styles.sectionTitle}>
          Conta
        </Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.actionRow}
            activeOpacity={0.8}
          >
            <View style={styles.actionLeft}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.primary}
              />

              <Text style={styles.actionText}>
                Alterar senha
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.muted}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={sair}
          activeOpacity={0.8}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={Colors.danger}
          />

          <Text style={styles.logoutText}>
            Sair da conta
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
};

function InfoRow({
  icon,
  label,
  value,
  last = false,
}: InfoRowProps) {
  return (
    <View
      style={[
        styles.infoRow,
        last && styles.infoRowLast,
      ]}
    >
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={18}
          color={Colors.primary}
        />
      </View>

      <View style={styles.infoContent}>
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
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  headerTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '900',
  },

  headerSubtitle: {
    marginTop: 3,
    color: Colors.textSecondary,
    fontSize: 12,
  },

  editButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 21,
  },

  content: {
    padding: 16,
    paddingBottom: 35,
  },

  profileCard: {
    marginBottom: 22,
    padding: 22,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
  },

  avatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 36,
  },

  name: {
    marginTop: 13,
    color: Colors.text,
    fontSize: 19,
    fontWeight: '900',
  },

  role: {
    marginTop: 4,
    color: Colors.textSecondary,
    fontSize: 12,
  },

  statusBadge: {
    marginTop: 11,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 15,
  },

  availableBadge: {
    backgroundColor: '#E8F5E9',
  },

  unavailableBadge: {
    backgroundColor: Colors.dangerSurface,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  availableDot: {
    backgroundColor: Colors.success,
  },

  unavailableDot: {
    backgroundColor: Colors.danger,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },

  availableText: {
    color: Colors.success,
  },

  unavailableText: {
    color: Colors.danger,
  },

  sectionTitle: {
    marginTop: 5,
    marginBottom: 8,
    color: Colors.textLabel,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  shiftCard: {
    marginBottom: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
  },

  shiftIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 21,
  },

  shiftInfo: {
    flex: 1,
    marginLeft: 12,
  },

  shiftLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
  },

  shiftValue: {
    marginTop: 3,
    color: Colors.text,
    fontSize: 14,
    fontWeight: '800',
  },

  shiftStatus: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
  },

  shiftStatusText: {
    color: Colors.primary,
    fontSize: 9,
    fontWeight: '800',
  },

  card: {
    marginBottom: 20,
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

  infoRowLast: {
    borderBottomWidth: 0,
  },

  infoIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 18,
  },

  infoContent: {
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

  specialtiesCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
  },

  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  specialtyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 16,
  },

  specialtyText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },

  actionRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  actionText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '700',
  },

  logoutButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.dangerSurface,
    borderRadius: 14,
  },

  logoutText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '800',
  },
});