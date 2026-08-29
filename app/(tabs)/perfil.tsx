import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

import {
  LogoutConfirmModal,
} from '@/features/auth/components/LogoutConfirmModal';

import {
  useAuth,
} from '@/features/auth/context/AuthContext';

import {
  usePerfil,
} from '@/features/perfil/context/PerfilContext';

/**
 * Tela principal do perfil profissional.
 *
 * O perfil é multiprofissional e não assume
 * que o usuário seja médico.
 *
 * Fluxo:
 *
 * PerfilScreen
 *      ↓
 * PerfilContext
 *      ↓
 * perfilService
 *      ↓
 * mock atualmente
 *      ↓
 * API futuramente
 */
export default function PerfilScreen() {
  const {
    perfil,
    carregandoPerfil,
    erroPerfil,
    recarregarPerfil,
  } = usePerfil();

  const { logout } = useAuth();

  const [
    saindo,
    setSaindo,
  ] = useState(false);

  const [
    mostrarConfirmacaoLogout,
    setMostrarConfirmacaoLogout,
  ] = useState(false);

  const [
    erroLogout,
    setErroLogout,
  ] = useState<string | null>(
    null
  );

  function editarPerfil() {
    router.push('/editar-perfil');
  }

  function alterarSenha() {
    router.push('/alterar-senha');
  }

  function sair() {
    if (saindo) {
      return;
    }

    setErroLogout(null);

    setMostrarConfirmacaoLogout(
      true
    );
  }

  function cancelarLogout() {
    if (saindo) {
      return;
    }

    setErroLogout(null);

    setMostrarConfirmacaoLogout(
      false
    );
  }

  /**
   * Encerra a sessão global.
   */
  async function executarLogout() {
    try {
      setSaindo(true);
      setErroLogout(null);

      await logout();

      setMostrarConfirmacaoLogout(
        false
      );

      router.replace('/');
    } catch (error) {
      console.error(
        'Erro ao encerrar sessão:',
        error
      );

      setErroLogout(
        'Não foi possível encerrar a sessão. Tente novamente.'
      );
    } finally {
      setSaindo(false);
    }
  }

  if (carregandoPerfil) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Carregando perfil...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (erroPerfil || !perfil) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}
      >
        <View
          style={
            styles.errorContainer
          }
        >
          <View
            style={styles.errorIcon}
          >
            <Ionicons
              name="alert-circle-outline"
              size={32}
              color={Colors.danger}
            />
          </View>

          <Text
            style={
              styles.errorTitle
            }
          >
            Não foi possível carregar o perfil
          </Text>

          <Text
            style={
              styles.errorDescription
            }
          >
            {erroPerfil ??
              'Tente carregar os dados novamente.'}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              void recarregarPerfil()
            }
            activeOpacity={0.8}
          >
            <Ionicons
              name="refresh-outline"
              size={18}
              color={
                Colors.background
              }
            />

            <Text
              style={
                styles.retryButtonText
              }
            >
              Tentar novamente
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const registroCompleto = [
    perfil.conselho,
    perfil.registro,
  ]
    .filter(Boolean)
    .join(' ');

  const registroComUf =
    perfil.uf
      ? `${registroCompleto}/${perfil.uf}`
      : registroCompleto;

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <View>
          <Text
            style={
              styles.headerTitle
            }
          >
            Perfil
          </Text>

          <Text
            style={
              styles.headerSubtitle
            }
          >
            Dados do profissional
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={editarPerfil}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Editar perfil"
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* RESUMO */}
        <View
          style={styles.profileCard}
        >
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={34}
              color={
                Colors.background
              }
            />
          </View>

          <Text style={styles.name}>
            {perfil.nome}
          </Text>

          <Text style={styles.role}>
            {perfil.profissao}
          </Text>

          <Text
            style={
              styles.registration
            }
          >
            {registroComUf}
          </Text>

          <View
            style={[
              styles.statusBadge,

              perfil.status ===
              'disponivel'
                ? styles.availableBadge
                : styles.unavailableBadge,
            ]}
          >
            <View
              style={[
                styles.statusDot,

                perfil.status ===
                'disponivel'
                  ? styles.availableDot
                  : styles.unavailableDot,
              ]}
            />

            <Text
              style={[
                styles.statusText,

                perfil.status ===
                'disponivel'
                  ? styles.availableText
                  : styles.unavailableText,
              ]}
            >
              {perfil.status ===
              'disponivel'
                ? 'Disponível'
                : 'Indisponível'}
            </Text>
          </View>
        </View>

        {/* PLANTÃO */}
        <Text
          style={
            styles.sectionTitle
          }
        >
          Plantão atual
        </Text>

        <View
          style={styles.shiftCard}
        >
          <View
            style={styles.shiftIcon}
          >
            <Ionicons
              name="time-outline"
              size={22}
              color={Colors.primary}
            />
          </View>

          <View
            style={styles.shiftInfo}
          >
            <Text
              style={
                styles.shiftLabel
              }
            >
              Horário
            </Text>

            <Text
              style={
                styles.shiftValue
              }
            >
              {perfil.plantao.inicio}
              {' - '}
              {perfil.plantao.fim}
            </Text>
          </View>

          <View
            style={
              styles.shiftStatus
            }
          >
            <Text
              style={
                styles.shiftStatusText
              }
            >
              Em plantão
            </Text>
          </View>
        </View>

        {/* DADOS PESSOAIS */}
        <Text
          style={
            styles.sectionTitle
          }
        >
          Dados pessoais
        </Text>

        <View style={styles.card}>
          <InfoRow
            icon="person-outline"
            label="Nome completo"
            value={perfil.nome}
          />

          <InfoRow
            icon="mail-outline"
            label="E-mail"
            value={perfil.email}
          />

          <InfoRow
            icon="card-outline"
            label="CPF"
            value={perfil.cpf}
          />

          <InfoRow
            icon="call-outline"
            label="Telefone"
            value={perfil.telefone}
            last
          />
        </View>

        {/* DADOS PROFISSIONAIS */}
        <Text
          style={
            styles.sectionTitle
          }
        >
          Dados profissionais
        </Text>

        <View style={styles.card}>
          <InfoRow
            icon="briefcase-outline"
            label="Profissão"
            value={
              perfil.profissao
            }
          />

          <InfoRow
            icon="ribbon-outline"
            label="Conselho profissional"
            value={
              perfil.conselho
            }
          />

          <InfoRow
            icon="medkit-outline"
            label="Registro profissional"
            value={
              perfil.registro
            }
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

        {/* ÁREAS DE ATUAÇÃO */}
        <Text
          style={
            styles.sectionTitle
          }
        >
          Áreas de atuação
        </Text>

        <View
          style={
            styles.specialtiesCard
          }
        >
          {perfil.areasAtuacao
            .length > 0 ? (
            <View
              style={
                styles.specialties
              }
            >
              {perfil.areasAtuacao.map(
                (area) => (
                  <View
                    key={area}
                    style={
                      styles.specialtyBadge
                    }
                  >
                    <Ionicons
                      name="medical-outline"
                      size={14}
                      color={
                        Colors.primary
                      }
                    />

                    <Text
                      style={
                        styles.specialtyText
                      }
                    >
                      {area}
                    </Text>
                  </View>
                )
              )}
            </View>
          ) : (
            <Text
              style={
                styles.emptyText
              }
            >
              Nenhuma área de atuação cadastrada.
            </Text>
          )}
        </View>

        {/* CONTA */}
        <Text
          style={
            styles.sectionTitle
          }
        >
          Conta
        </Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.actionRow}
            activeOpacity={0.8}
            onPress={alterarSenha}
          >
            <View
              style={
                styles.actionLeft
              }
            >
              <View
                style={
                  styles.actionIcon
                }
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={19}
                  color={
                    Colors.primary
                  }
                />
              </View>

              <View>
                <Text
                  style={
                    styles.actionText
                  }
                >
                  Alterar senha
                </Text>

                <Text
                  style={
                    styles.actionDescription
                  }
                >
                  Atualize sua senha de acesso
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.muted}
            />
          </TouchableOpacity>
        </View>

        {/* EDITAR */}
        <TouchableOpacity
          style={
            styles.secondaryButton
          }
          onPress={editarPerfil}
          activeOpacity={0.8}
        >
          <Ionicons
            name="create-outline"
            size={19}
            color={Colors.primary}
          />

          <Text
            style={
              styles.secondaryButtonText
            }
          >
            Editar meus dados
          </Text>
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            saindo &&
              styles.logoutButtonDisabled,
          ]}
          onPress={sair}
          disabled={saindo}
          activeOpacity={0.8}
        >
          {saindo ? (
            <>
              <ActivityIndicator
                size="small"
                color={Colors.danger}
              />

              <Text
                style={
                  styles.logoutText
                }
              >
                Saindo...
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={Colors.danger}
              />

              <Text
                style={
                  styles.logoutText
                }
              >
                Sair da conta
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      <LogoutConfirmModal
        visible={
          mostrarConfirmacaoLogout
        }
        loading={saindo}
        error={erroLogout}
        onCancel={
          cancelarLogout
        }
        onConfirm={() => {
          void executarLogout();
        }}
      />
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
        last &&
          styles.infoRowLast,
      ]}
    >
      <View
        style={styles.infoIcon}
      >
        <Ionicons
          name={icon}
          size={18}
          color={Colors.primary}
        />
      </View>

      <View
        style={
          styles.infoContent
        }
      >
        <Text
          style={styles.infoLabel}
        >
          {label}
        </Text>

        <Text
          style={styles.infoValue}
        >
          {value ||
            'Não informado'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.surfaceMuted,
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    backgroundColor:
      Colors.background,
    borderBottomWidth: 1,
    borderBottomColor:
      Colors.border,
  },

  headerTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '900',
  },

  headerSubtitle: {
    marginTop: 3,
    color:
      Colors.textSecondary,
    fontSize: 12,
  },

  editButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Colors.surfaceSecondary,
    borderRadius: 21,
  },

  content: {
    padding: 16,
    paddingBottom: 35,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  loadingText: {
    color:
      Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },

  errorContainer: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorIcon: {
    width: 68,
    height: 68,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Colors.dangerSurface,
    borderRadius: 34,
  },

  errorTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

  errorDescription: {
    marginTop: 5,
    color:
      Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },

  retryButton: {
    minHeight: 48,
    marginTop: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor:
      Colors.primary,
    borderRadius: 12,
  },

  retryButtonText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '800',
  },

  profileCard: {
    marginBottom: 22,
    padding: 22,
    alignItems: 'center',
    backgroundColor:
      Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
  },

  avatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Colors.primary,
    borderRadius: 36,
  },

  name: {
    marginTop: 13,
    color: Colors.text,
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'center',
  },

  role: {
    marginTop: 4,
    color:
      Colors.textSecondary,
    fontSize: 12,
  },

  registration: {
    marginTop: 3,
    color: Colors.textLabel,
    fontSize: 10,
    fontWeight: '700',
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
    backgroundColor:
      '#E8F5E9',
  },

  unavailableBadge: {
    backgroundColor:
      Colors.dangerSurface,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  availableDot: {
    backgroundColor:
      Colors.success,
  },

  unavailableDot: {
    backgroundColor:
      Colors.danger,
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
    textTransform:
      'uppercase',
  },

  shiftCard: {
    marginBottom: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
  },

  shiftIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Colors.surfaceSecondary,
    borderRadius: 21,
  },

  shiftInfo: {
    flex: 1,
    marginLeft: 12,
  },

  shiftLabel: {
    color:
      Colors.textSecondary,
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
    backgroundColor:
      Colors.surfaceSecondary,
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
    backgroundColor:
      Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
  },

  infoRow: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor:
      Colors.surfaceSecondary,
  },

  infoRowLast: {
    borderBottomWidth: 0,
  },

  infoIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Colors.surfaceSecondary,
    borderRadius: 18,
  },

  infoContent: {
    flex: 1,
    marginLeft: 11,
  },

  infoLabel: {
    color:
      Colors.textSecondary,
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
    backgroundColor:
      Colors.background,
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
    backgroundColor:
      Colors.surfaceSecondary,
    borderRadius: 16,
  },

  specialtyText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },

  emptyText: {
    color:
      Colors.textSecondary,
    fontSize: 11,
  },

  actionRow: {
    minHeight: 67,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  actionIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Colors.surfaceSecondary,
    borderRadius: 18,
  },

  actionText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '700',
  },

  actionDescription: {
    marginTop: 2,
    color:
      Colors.textSecondary,
    fontSize: 9,
  },

  secondaryButton: {
    minHeight: 52,
    marginBottom: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor:
      Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
  },

  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },

  logoutButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor:
      Colors.background,
    borderWidth: 1,
    borderColor:
      Colors.dangerSurface,
    borderRadius: 14,
  },

  logoutButtonDisabled: {
    opacity: 0.65,
  },

  logoutText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '800',
  },
});