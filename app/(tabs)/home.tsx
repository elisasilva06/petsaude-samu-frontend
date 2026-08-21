import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

type Gravidade = 'emergencia' | 'urgente';

type SolicitacaoMock = {
  id: string;
  paciente: string;
  bairro: string;
  classificacao: string;
  gravidade: Gravidade;
  queixa: string;
  horario: string;
};

/*
 * MOCK TEMPORÁRIO
 *
 * Esses dados existem apenas para reconstruirmos
 * o frontend aprovado.
 *
 * Depois eles serão substituídos pelos dados reais
 * retornados pelo backend.
 */
const SOLICITACOES_MOCK: SolicitacaoMock[] = [
  {
    id: '1',
    paciente: 'Maria das Dores',
    bairro: 'Ponte',
    classificacao: 'Emergência',
    gravidade: 'emergencia',
    queixa: 'Parada Cardiorrespiratória',
    horario: '14:20',
  },
  {
    id: '2',
    paciente: 'João Pereira',
    bairro: 'Centro',
    classificacao: 'Urgente',
    gravidade: 'urgente',
    queixa: 'Crise Hipertensiva',
    horario: '14:35',
  },
];

const GRAVIDADE_STYLE = {
  emergencia: {
    color: '#B3261E',
    background: '#FCE8E6',
  },

  urgente: {
    color: '#D4A017',
    background: '#FFF6D6',
  },
};

export default function HomeScreen() {
  function abrirChamado(id: string) {
    router.push(`/chamado/${id}`);
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <StatusBar style="light" />

      {/* CABEÇALHO */}
      <View style={styles.appBar}>
        <Text style={styles.appTitle}>
          SAMU 192 Caxias
        </Text>

        <Text style={styles.appSubtitle}>
          Equipe Multidisciplinar
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* PROFISSIONAL / PLANTÃO */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/perfil')}
        >
          <LinearGradient
            colors={[
              Colors.primary,
              Colors.primaryDark,
            ]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={styles.profileCard}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  CE
                </Text>
              </View>

              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>
                  Dr. Carlos Eduardo
                </Text>

                <Text style={styles.profileRegister}>
                  Enfermeiro - COREN 12345
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="rgba(255,255,255,0.45)"
              />
            </View>

            <View style={styles.shiftRow}>
              <View style={styles.availableBadge}>
                <View style={styles.availableDot} />

                <Text style={styles.availableText}>
                  Disponível
                </Text>
              </View>

              <Text style={styles.shiftText}>
                Plantão: 07:00 - 19:00
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* NOVAS SOLICITAÇÕES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconSuccess}>
              <Ionicons
                name="medical-outline"
                size={19}
                color={Colors.primary}
              />
            </View>

            <Text style={styles.sectionTitle}>
              Novas Solicitações
            </Text>

            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>
                {SOLICITACOES_MOCK.length}
              </Text>
            </View>
          </View>

          {SOLICITACOES_MOCK.map((chamado) => {
            const gravidade =
              GRAVIDADE_STYLE[chamado.gravidade];

            return (
              <TouchableOpacity
                key={chamado.id}
                style={styles.requestCard}
                activeOpacity={0.8}
                onPress={() =>
                  abrirChamado(chamado.id)
                }
              >
                <View
                  style={[
                    styles.severityBar,
                    {
                      backgroundColor:
                        gravidade.color,
                    },
                  ]}
                />

                <View style={styles.requestContent}>
                  <View style={styles.requestHeader}>
                    <View style={styles.patientContainer}>
                      <Text style={styles.patientName}>
                        {chamado.paciente}
                      </Text>

                      <View style={styles.locationRow}>
                        <Ionicons
                          name="location-outline"
                          size={13}
                          color={Colors.textSecondary}
                        />

                        <Text style={styles.locationText}>
                          {chamado.bairro}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.severityTag,
                        {
                          backgroundColor:
                            gravidade.background,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.severityText,
                          {
                            color: gravidade.color,
                          },
                        ]}
                      >
                        {chamado.classificacao}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={styles.complaint}
                    numberOfLines={1}
                  >
                    {chamado.queixa}
                  </Text>

                  <View style={styles.requestFooter}>
                    <View style={styles.timeRow}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={Colors.muted}
                      />

                      <Text style={styles.timeText}>
                        Solicitado às {chamado.horario}
                      </Text>
                    </View>

                    <Text style={styles.detailsText}>
                      Ver detalhes
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* EM ESPERA */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWaiting}>
              <Ionicons
                name="alert-circle-outline"
                size={19}
                color={Colors.textSecondary}
              />
            </View>

            <Text style={styles.sectionTitle}>
              Em Espera
            </Text>
          </View>

          <View style={styles.waitingCard}>
            <Text style={styles.waitingText}>
              Não há outras ocorrências na sua fila.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceMuted,
  },

  appBar: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.primary,
  },

  appTitle: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: '700',
  },

  appSubtitle: {
    marginTop: 2,
    color: Colors.textOnPrimaryMuted,
    fontSize: 12,
  },

  scroll: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  // PERFIL
  profileCard: {
    marginBottom: 22,
    padding: 16,
    borderRadius: 16,

    elevation: 4,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  profileHeader: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 22,
  },

  avatarText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '700',
  },

  profileTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  profileName: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
  },

  profileRegister: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },

  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  availableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    borderRadius: 10,
  },

  availableDot: {
    width: 6,
    height: 6,
    marginRight: 5,
    backgroundColor: Colors.background,
    borderRadius: 3,
  },

  availableText: {
    color: Colors.background,
    fontSize: 10,
    fontWeight: '700',
  },

  shiftText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
  },

  // SEÇÕES
  section: {
    marginBottom: 25,
  },

  sectionHeader: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionIconSuccess: {
    width: 34,
    height: 34,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D1FAE5',
    borderRadius: 10,
  },

  sectionIconWaiting: {
    width: 34,
    height: 34,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 10,
  },

  sectionTitle: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },

  counterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },

  counterText: {
    color: Colors.background,
    fontSize: 11,
    fontWeight: '700',
  },

  // CHAMADO
  requestCard: {
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderRadius: 14,

    elevation: 2,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  severityBar: {
    width: 6,
  },

  requestContent: {
    flex: 1,
    padding: 14,
  },

  requestHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  patientContainer: {
    flex: 1,
    paddingRight: 8,
  },

  patientName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },

  locationRow: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationText: {
    marginLeft: 4,
    color: Colors.textSecondary,
    fontSize: 12,
  },

  severityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  severityText: {
    fontSize: 10,
    fontWeight: '700',
  },

  complaint: {
    marginVertical: 10,
    color: Colors.textLabel,
    fontSize: 13,
  },

  requestFooter: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceSecondary,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeText: {
    marginLeft: 5,
    color: Colors.muted,
    fontSize: 11,
  },

  detailsText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  // ESPERA
  waitingCard: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(191,218,218,0.2)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.disabled,
    borderRadius: 12,
  },

  waitingText: {
    color: Colors.muted,
    fontSize: 13,
  },
});