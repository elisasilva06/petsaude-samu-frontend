import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import { StatusBar } from 'expo-status-bar';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

import {
  chamadosService,
} from '@/features/chamados/services';

import type {
  ChamadoResumo,
  GravidadeChamado,
  PainelChamados,
} from '@/features/chamados/types';

import {
  usePerfil,
} from '@/features/perfil/context/PerfilContext';

/**
 * Aparência temporária das classificações
 * utilizadas nos cards.
 *
 * TODO(BACKEND):
 * Confirmar classificações, cores e níveis
 * quando o contrato real estiver disponível.
 */
const GRAVIDADE_STYLE: Record<
  GravidadeChamado,
  {
    color: string;
    background: string;
  }
> = {
  emergencia: {
    color: '#B3261E',
    background: '#FCE8E6',
  },

  urgente: {
    color: '#D4A017',
    background: '#FFF6D6',
  },
};

const PAINEL_INICIAL: PainelChamados = {
  ativo: null,
  fila: [],
};

type ChamadoAtivoCardProps = {
  chamado: ChamadoResumo;
  agora: number;
  onContinuar: () => void;
};

/**
 * Card do atendimento atualmente assumido
 * pelo profissional.
 */
function ChamadoAtivoCard({
  chamado,
  agora,
  onContinuar,
}: ChamadoAtivoCardProps) {
  const gravidade =
    GRAVIDADE_STYLE[chamado.gravidade];

  return (
    <View style={styles.activeCard}>
      <View
        style={[
          styles.activeSeverityBar,
          {
            backgroundColor:
              gravidade.color,
          },
        ]}
      />

      <View style={styles.activeContent}>
        <View style={styles.activeTopRow}>
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />

            <Text style={styles.activeBadgeText}>
              Em atendimento
            </Text>
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

        <Text style={styles.activePatient}>
          {chamado.paciente}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={Colors.textSecondary}
          />

          <Text style={styles.locationText}>
            {chamado.bairro}
          </Text>
        </View>

        <Text
          style={styles.activeComplaint}
          numberOfLines={2}
        >
          {chamado.queixa}
        </Text>

        {chamado.iniciadoEm ? (
          <View style={styles.activeTimeBox}>
            <Ionicons
              name="time-outline"
              size={16}
              color={Colors.primary}
            />

            <View>
              <Text style={styles.activeTimeLabel}>
                Iniciado às{' '}
                {formatarHorario(
                  chamado.iniciadoEm
                )}
              </Text>

              <Text style={styles.activeDuration}>
                {calcularTempoDecorrido(
                  chamado.iniciadoEm,
                  agora
                )}
              </Text>
            </View>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.continueAttendanceButton}
          onPress={onContinuar}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`Continuar atendimento de ${chamado.paciente}`}
        >
          <Ionicons
            name="medical-outline"
            size={19}
            color={Colors.background}
          />

          <Text
            style={
              styles.continueAttendanceText
            }
          >
            Continuar atendimento
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color={Colors.background}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

type FilaChamadoCardProps = {
  chamado: ChamadoResumo;

  posicao: number;

  agora: number;

  possuiAtendimentoAtivo: boolean;

  aceitando: boolean;

  onVerDetalhes: () => void;

  onAceitar: () => void;
};

/**
 * Card de uma ocorrência que ainda aguarda
 * atendimento.
 *
 * A posição exibida já vem da ordem retornada
 * pelo service.
 *
 * A Home não decide a prioridade.
 */
function FilaChamadoCard({
  chamado,
  posicao,
  agora,
  possuiAtendimentoAtivo,
  aceitando,
  onVerDetalhes,
  onAceitar,
}: FilaChamadoCardProps) {
  const gravidade =
    GRAVIDADE_STYLE[chamado.gravidade];

  return (
    <View style={styles.queueCard}>
      <View
        style={[
          styles.severityBar,
          {
            backgroundColor:
              gravidade.color,
          },
        ]}
      />

      <View style={styles.queueContent}>
        <View style={styles.queueHeader}>
          <View style={styles.positionBadge}>
            <Text style={styles.positionText}>
              {posicao}º
            </Text>
          </View>

          <View style={styles.patientContainer}>
            <Text style={styles.patientName}>
              {chamado.paciente}
            </Text>

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={13}
                color={
                  Colors.textSecondary
                }
              />

              <Text
                style={styles.locationText}
              >
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
          numberOfLines={2}
        >
          {chamado.queixa}
        </Text>

        <View style={styles.waitingInfo}>
          <View style={styles.timeRow}>
            <Ionicons
              name="time-outline"
              size={14}
              color={Colors.muted}
            />

            <Text style={styles.timeText}>
              Recebido às{' '}
              {formatarHorario(
                chamado.recebidoEm
              )}
            </Text>
          </View>

          <Text style={styles.waitingTime}>
            {calcularTempoEspera(
              chamado.recebidoEm,
              agora
            )}
          </Text>
        </View>

        <View style={styles.queueActions}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={onVerDetalhes}
            activeOpacity={0.8}
          >
            <Text style={styles.detailsButtonText}>
              Ver detalhes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.acceptButton,

              possuiAtendimentoAtivo &&
                styles.acceptButtonDisabled,
            ]}
            onPress={onAceitar}
            disabled={
              possuiAtendimentoAtivo ||
              aceitando
            }
            activeOpacity={0.85}
          >
            {aceitando ? (
              <ActivityIndicator
                size="small"
                color={Colors.background}
              />
            ) : (
              <>
                <Ionicons
                  name={
                    possuiAtendimentoAtivo
                      ? 'lock-closed-outline'
                      : 'checkmark-circle-outline'
                  }
                  size={17}
                  color={
                    possuiAtendimentoAtivo
                      ? Colors.muted
                      : Colors.background
                  }
                />

                <Text
                  style={[
                    styles.acceptButtonText,

                    possuiAtendimentoAtivo &&
                      styles.acceptButtonTextDisabled,
                  ]}
                >
                  {possuiAtendimentoAtivo
                    ? 'Indisponível'
                    : 'Aceitar'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {possuiAtendimentoAtivo ? (
          <Text style={styles.activeWarning}>
            Finalize o atendimento atual antes
            de assumir outra ocorrência.
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/**
 * Home operacional da equipe multidisciplinar.
 *
 * Responsabilidades:
 *
 * - apresentar o profissional e plantão;
 * - apresentar um atendimento ativo;
 * - apresentar a fila ordenada de ocorrências;
 * - permitir assumir uma ocorrência;
 * - impedir múltiplos atendimentos ativos;
 * - atualizar o painel quando a tela recebe foco;
 * - permitir atualização manual.
 *
 * Fluxo:
 *
 * Home
 *   ↓
 * chamadosService
 *   ↓
 * buscarPainel()
 *
 * Fila
 *   ↓ aceitarChamado()
 * Chamado ativo
 *   ↓ finalizarChamado()
 * Finalizado
 *
 * TODO(BACKEND):
 * A API será a autoridade sobre:
 *
 * - prioridade;
 * - status;
 * - ordem da fila;
 * - concorrência entre profissionais;
 * - disponibilidade da ocorrência.
 */
export default function HomeScreen() {
  const {
    perfil,
    carregandoPerfil,
    erroPerfil,
    recarregarPerfil,
  } = usePerfil();

  const [
    painel,
    setPainel,
  ] = useState<PainelChamados>(
    PAINEL_INICIAL
  );

  const [
    carregandoPainel,
    setCarregandoPainel,
  ] = useState(true);

  const [
    atualizando,
    setAtualizando,
  ] = useState(false);

  const [
    aceitandoId,
    setAceitandoId,
  ] = useState<string | null>(
    null
  );

  const [
    erroPainel,
    setErroPainel,
  ] = useState('');

  /**
   * Utilizado somente para atualizar visualmente
   * o tempo de espera e duração do atendimento.
   *
   * A cada minuto a Home renderiza novamente.
   */
  const [
    agora,
    setAgora,
  ] = useState(Date.now());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setAgora(Date.now());
    }, 60_000);

    return () => {
      clearInterval(intervalo);
    };
  }, []);

  /**
   * Busca o estado operacional atual.
   */
  const carregarPainel =
    useCallback(async () => {
      try {
        setCarregandoPainel(true);
        setErroPainel('');

        const resultado =
          await chamadosService.buscarPainel();

        setPainel(resultado);
        setAgora(Date.now());
      } catch (error) {
        console.error(
          'Erro ao carregar painel de chamados:',
          error
        );

        setErroPainel(
          'Não foi possível carregar a fila de ocorrências.'
        );
      } finally {
        setCarregandoPainel(false);
      }
    }, []);

  /**
   * Quando a Home volta a receber foco,
   * sincronizamos novamente o painel.
   *
   * Isso será importante depois que o usuário
   * aceitar ou finalizar um atendimento.
   */
  useFocusEffect(
    useCallback(() => {
      void carregarPainel();
    }, [carregarPainel])
  );

  /**
   * Atualização manual da tela.
   */
  async function atualizarHome() {
    if (atualizando) {
      return;
    }

    try {
      setAtualizando(true);

      await Promise.all([
        carregarPainel(),
        recarregarPerfil(),
      ]);
    } finally {
      setAtualizando(false);
    }
  }

  /**
   * Assume uma ocorrência da fila.
   *
   * O card só é movido para "Atendimento
   * em andamento" depois que o service
   * confirma a operação.
   */
  async function aceitarChamado(
    id: string
  ) {
    if (
      painel.ativo ||
      aceitandoId
    ) {
      return;
    }

    try {
      setAceitandoId(id);
      setErroPainel('');

      const novoPainel =
        await chamadosService.aceitarChamado(
          id
        );

      setPainel(novoPainel);

      /**
       * Depois do aceite confirmado,
       * abrimos o atendimento.
       */
      router.push(
        `/chamado/${id}`
      );
    } catch (error) {
      console.error(
        'Erro ao aceitar chamado:',
        error
      );

      setErroPainel(
        error instanceof Error
          ? error.message
          : 'Não foi possível aceitar a ocorrência.'
      );

      /**
       * Caso tenha ocorrido alguma alteração
       * concorrente, buscamos o painel novamente.
       */
      await carregarPainel();
    } finally {
      setAceitandoId(null);
    }
  }

  function abrirChamado(
    id: string
  ) {
    router.push(
      `/chamado/${id}`
    );
  }

  const iniciais =
    obterIniciais(perfil?.nome);

  const statusDisponivel =
    perfil?.status ===
    'disponivel';

  const possuiAtendimentoAtivo =
    painel.ativo !== null;

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
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={atualizarHome}
          />
        }
      >
        {/* PERFIL */}
        {carregandoPerfil ? (
          <View
            style={
              styles.profileLoadingCard
            }
          >
            <ActivityIndicator
              size="small"
              color={Colors.primary}
            />

            <Text
              style={
                styles.profileLoadingText
              }
            >
              Carregando perfil...
            </Text>
          </View>
        ) : erroPerfil || !perfil ? (
          <View
            style={
              styles.profileErrorCard
            }
          >
            <Ionicons
              name="person-circle-outline"
              size={30}
              color={Colors.danger}
            />

            <View
              style={
                styles.profileErrorContent
              }
            >
              <Text
                style={
                  styles.profileErrorTitle
                }
              >
                Perfil indisponível
              </Text>

              <Text
                style={
                  styles.profileErrorText
                }
              >
                {erroPerfil ??
                  'Não foi possível carregar o perfil.'}
              </Text>
            </View>

            <TouchableOpacity
              style={
                styles.retryIconButton
              }
              onPress={() =>
                void recarregarPerfil()
              }
            >
              <Ionicons
                name="refresh"
                size={21}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              router.push('/perfil')
            }
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
              <View
                style={
                  styles.profileHeader
                }
              >
                <View
                  style={styles.avatar}
                >
                  <Text
                    style={
                      styles.avatarText
                    }
                  >
                    {iniciais}
                  </Text>
                </View>

                <View
                  style={
                    styles.profileTextContainer
                  }
                >
                  <Text
                    style={
                      styles.profileName
                    }
                  >
                    {perfil.nome}
                  </Text>

                  <Text
                    style={
                      styles.profileRegister
                    }
                  >
                    {perfil.profissao}
                    {' • '}
                    {perfil.conselho}{' '}
                    {perfil.registro}

                    {perfil.uf
                      ? `/${perfil.uf}`
                      : ''}
                  </Text>

                  {perfil.unidade ? (
                    <Text
                      style={
                        styles.profileUnit
                      }
                    >
                      {perfil.unidade}
                    </Text>
                  ) : null}
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="rgba(255,255,255,0.45)"
                />
              </View>

              <View
                style={
                  styles.shiftRow
                }
              >
                <View
                  style={[
                    styles.statusBadge,

                    statusDisponivel
                      ? styles.availableBadge
                      : styles.unavailableBadge,
                  ]}
                >
                  <View
                    style={
                      styles.statusDot
                    }
                  />

                  <Text
                    style={
                      styles.statusText
                    }
                  >
                    {statusDisponivel
                      ? 'Disponível'
                      : 'Indisponível'}
                  </Text>
                </View>

                <Text
                  style={
                    styles.shiftText
                  }
                >
                  Plantão:{' '}
                  {perfil.plantao.inicio}
                  {' - '}
                  {perfil.plantao.fim}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* ERRO */}
        {erroPainel ? (
          <View
            style={
              styles.queueErrorCard
            }
          >
            <Ionicons
              name="alert-circle-outline"
              size={23}
              color={Colors.danger}
            />

            <View
              style={
                styles.queueErrorContent
              }
            >
              <Text
                style={
                  styles.queueErrorTitle
                }
              >
                Atenção
              </Text>

              <Text
                style={
                  styles.queueErrorText
                }
              >
                {erroPainel}
              </Text>
            </View>

            <TouchableOpacity
              style={
                styles.retryIconButton
              }
              onPress={() =>
                void carregarPainel()
              }
            >
              <Ionicons
                name="refresh"
                size={21}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        {carregandoPainel &&
        !painel.ativo &&
        painel.fila.length === 0 ? (
          <View style={styles.loadingPanel}>
            <ActivityIndicator
              size="small"
              color={Colors.primary}
            />

            <Text
              style={
                styles.loadingPanelText
              }
            >
              Carregando ocorrências...
            </Text>
          </View>
        ) : (
          <>
            {/* ATENDIMENTO ATIVO */}
            <View style={styles.section}>
              <View
                style={
                  styles.sectionHeader
                }
              >
                <View
                  style={
                    styles.sectionIconActive
                  }
                >
                  <Ionicons
                    name="pulse-outline"
                    size={20}
                    color={Colors.primary}
                  />
                </View>

                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Atendimento em andamento
                </Text>
              </View>

              {painel.ativo ? (
                <ChamadoAtivoCard
                  chamado={painel.ativo}
                  agora={agora}
                  onContinuar={() =>
                    abrirChamado(
                      painel.ativo!.id
                    )
                  }
                />
              ) : (
                <View
                  style={
                    styles.noActiveCard
                  }
                >
                  <View
                    style={
                      styles.noActiveIcon
                    }
                  >
                    <Ionicons
                      name="medical-outline"
                      size={25}
                      color={Colors.muted}
                    />
                  </View>

                  <Text
                    style={
                      styles.noActiveTitle
                    }
                  >
                    Nenhum atendimento em andamento
                  </Text>

                  <Text
                    style={
                      styles.noActiveText
                    }
                  >
                    {painel.fila.length > 0
                      ? 'Escolha uma ocorrência da fila abaixo para iniciar um atendimento.'
                      : 'Quando uma ocorrência estiver disponível, ela aparecerá na fila.'}
                  </Text>
                </View>
              )}
            </View>

            {/* FILA */}
            <View style={styles.section}>
              <View
                style={
                  styles.sectionHeader
                }
              >
                <View
                  style={
                    styles.sectionIconQueue
                  }
                >
                  <Ionicons
                    name="list-outline"
                    size={20}
                    color={
                      Colors.textSecondary
                    }
                  />
                </View>

                <View
                  style={
                    styles.queueTitleContainer
                  }
                >
                  <Text
                    style={
                      styles.sectionTitle
                    }
                  >
                    Fila de prioridade
                  </Text>

                  <Text
                    style={
                      styles.queueSubtitle
                    }
                  >
                    Ocorrências aguardando atendimento
                  </Text>
                </View>

                <View
                  style={
                    styles.queueCounter
                  }
                >
                  <Text
                    style={
                      styles.queueCounterText
                    }
                  >
                    {painel.fila.length}
                  </Text>
                </View>
              </View>

              {painel.fila.length > 0 ? (
                painel.fila.map(
                  (chamado, index) => (
                    <FilaChamadoCard
                      key={chamado.id}
                      chamado={chamado}
                      posicao={index + 1}
                      agora={agora}
                      possuiAtendimentoAtivo={
                        possuiAtendimentoAtivo
                      }
                      aceitando={
                        aceitandoId ===
                        chamado.id
                      }
                      onVerDetalhes={() =>
                        abrirChamado(
                          chamado.id
                        )
                      }
                      onAceitar={() =>
                        void aceitarChamado(
                          chamado.id
                        )
                      }
                    />
                  )
                )
              ) : (
                <View
                  style={
                    styles.emptyQueueCard
                  }
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={27}
                    color={Colors.success}
                  />

                  <Text
                    style={
                      styles.emptyQueueTitle
                    }
                  >
                    Fila vazia
                  </Text>

                  <Text
                    style={
                      styles.emptyQueueText
                    }
                  >
                    Não há outras ocorrências aguardando atendimento.
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Retorna até duas iniciais para o avatar.
 */
function obterIniciais(
  nome?: string
) {
  if (!nome?.trim()) {
    return '--';
  }

  const partes =
    nome.trim().split(/\s+/);

  if (partes.length === 1) {
    return partes[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${partes[0][0]}${
    partes[partes.length - 1][0]
  }`.toUpperCase();
}

/**
 * Formata uma data ISO somente para
 * apresentação na interface.
 */
function formatarHorario(
  dataIso: string
) {
  const data =
    new Date(dataIso);

  if (
    Number.isNaN(data.getTime())
  ) {
    return '--:--';
  }

  return data.toLocaleTimeString(
    'pt-BR',
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  );
}

/**
 * Calcula há quanto tempo uma ocorrência
 * está aguardando.
 *
 * A prioridade da ocorrência NÃO depende
 * deste cálculo no frontend.
 */
function calcularTempoEspera(
  recebidoEm: string,
  agora: number
) {
  const recebido =
    new Date(
      recebidoEm
    ).getTime();

  if (
    Number.isNaN(recebido)
  ) {
    return 'Tempo indisponível';
  }

  const diferenca =
    Math.max(
      0,
      agora - recebido
    );

  const minutos =
    Math.floor(
      diferenca / 60_000
    );

  if (minutos < 1) {
    return 'Aguardando há menos de 1 min';
  }

  if (minutos < 60) {
    return `Aguardando há ${minutos} min`;
  }

  const horas =
    Math.floor(
      minutos / 60
    );

  const minutosRestantes =
    minutos % 60;

  if (
    minutosRestantes === 0
  ) {
    return `Aguardando há ${horas}h`;
  }

  return `Aguardando há ${horas}h ${minutosRestantes}min`;
}

/**
 * Calcula o tempo do atendimento atual.
 */
function calcularTempoDecorrido(
  inicio: string,
  agora: number
) {
  const inicioMs =
    new Date(inicio).getTime();

  if (
    Number.isNaN(inicioMs)
  ) {
    return 'Tempo de atendimento indisponível';
  }

  const diferenca =
    Math.max(
      0,
      agora - inicioMs
    );

  const minutos =
    Math.floor(
      diferenca / 60_000
    );

  if (minutos < 1) {
    return 'Em atendimento há menos de 1 min';
  }

  if (minutos < 60) {
    return `Em atendimento há ${minutos} min`;
  }

  const horas =
    Math.floor(
      minutos / 60
    );

  const minutosRestantes =
    minutos % 60;

  if (
    minutosRestantes === 0
  ) {
    return `Em atendimento há ${horas}h`;
  }

  return `Em atendimento há ${horas}h ${minutosRestantes}min`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.surfaceMuted,
  },

  appBar: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor:
      Colors.primary,
  },

  appTitle: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: '700',
  },

  appSubtitle: {
    marginTop: 2,
    color:
      Colors.textOnPrimaryMuted,
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
    backgroundColor:
      'rgba(255,255,255,0.2)',
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
    paddingRight: 8,
  },

  profileName: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
  },

  profileRegister: {
    marginTop: 2,
    color:
      'rgba(255,255,255,0.78)',
    fontSize: 12,
  },

  profileUnit: {
    marginTop: 3,
    color:
      'rgba(255,255,255,0.58)',
    fontSize: 11,
  },

  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },

  availableBadge: {
    backgroundColor:
      Colors.success,
  },

  unavailableBadge: {
    backgroundColor:
      Colors.danger,
  },

  statusDot: {
    width: 6,
    height: 6,
    marginRight: 5,
    backgroundColor:
      Colors.background,
    borderRadius: 3,
  },

  statusText: {
    color: Colors.background,
    fontSize: 10,
    fontWeight: '700',
  },

  shiftText: {
    color:
      'rgba(255,255,255,0.65)',
    fontSize: 11,
  },

  profileLoadingCard: {
    minHeight: 105,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor:
      Colors.surface,
    borderRadius: 16,
  },

  profileLoadingText: {
    color:
      Colors.textSecondary,
    fontSize: 13,
  },

  profileErrorCard: {
    marginBottom: 22,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      Colors.dangerSurface,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 14,
  },

  profileErrorContent: {
    flex: 1,
    marginLeft: 10,
  },

  profileErrorTitle: {
    color: Colors.textStrong,
    fontSize: 14,
    fontWeight: '700',
  },

  profileErrorText: {
    marginTop: 2,
    color:
      Colors.textSecondary,
    fontSize: 12,
  },

  retryIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ERRO
  queueErrorCard: {
    marginBottom: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      Colors.dangerSurface,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 12,
  },

  queueErrorContent: {
    flex: 1,
    marginLeft: 10,
  },

  queueErrorTitle: {
    color: Colors.textStrong,
    fontSize: 13,
    fontWeight: '800',
  },

  queueErrorText: {
    marginTop: 2,
    color:
      Colors.textSecondary,
    fontSize: 12,
  },

  loadingPanel: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingPanelText: {
    marginTop: 10,
    color:
      Colors.textSecondary,
    fontSize: 13,
  },

  // SEÇÕES
  section: {
    marginBottom: 27,
  },

  sectionHeader: {
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionIconActive: {
    width: 36,
    height: 36,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Colors.surfaceSecondary,
    borderRadius: 10,
  },

  sectionIconQueue: {
    width: 36,
    height: 36,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Colors.surfaceSecondary,
    borderRadius: 10,
  },

  sectionTitle: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
  },

  queueTitleContainer: {
    flex: 1,
  },

  queueSubtitle: {
    marginTop: 2,
    color:
      Colors.textSecondary,
    fontSize: 10,
  },

  queueCounter: {
    minWidth: 29,
    height: 29,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Colors.primary,
    borderRadius: 15,
  },

  queueCounterText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '800',
  },

  // ATIVO
  activeCard: {
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor:
      Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,

    elevation: 3,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  activeSeverityBar: {
    width: 7,
  },

  activeContent: {
    flex: 1,
    padding: 16,
  },

  activeTopRow: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  activeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      Colors.surfaceSecondary,
    borderRadius: 12,
  },

  activeDot: {
    width: 7,
    height: 7,
    marginRight: 6,
    backgroundColor:
      Colors.success,
    borderRadius: 4,
  },

  activeBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
  },

  activePatient: {
    color: Colors.textStrong,
    fontSize: 18,
    fontWeight: '800',
  },

  activeComplaint: {
    marginTop: 12,
    color: Colors.textLabel,
    fontSize: 14,
    lineHeight: 20,
  },

  activeTimeBox: {
    marginTop: 14,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor:
      Colors.surfaceMuted,
    borderRadius: 10,
  },

  activeTimeLabel: {
    color:
      Colors.textSecondary,
    fontSize: 10,
  },

  activeDuration: {
    marginTop: 2,
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
  },

  continueAttendanceButton: {
    minHeight: 52,
    marginTop: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor:
      Colors.primary,
    borderRadius: 12,
  },

  continueAttendanceText: {
    color: Colors.background,
    fontSize: 13,
    fontWeight: '800',
  },

  // SEM ATIVO
  noActiveCard: {
    padding: 22,
    alignItems: 'center',
    backgroundColor:
      Colors.surface,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.disabled,
    borderRadius: 14,
  },

  noActiveIcon: {
    width: 48,
    height: 48,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Colors.surfaceSecondary,
    borderRadius: 24,
  },

  noActiveTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },

  noActiveText: {
    maxWidth: 310,
    marginTop: 6,
    color:
      Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },

  // FILA
  queueCard: {
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor:
      Colors.surface,
    borderRadius: 14,

    elevation: 2,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },

  severityBar: {
    width: 6,
  },

  queueContent: {
    flex: 1,
    padding: 14,
  },

  queueHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  positionBadge: {
    width: 31,
    height: 31,
    marginRight: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Colors.surfaceSecondary,
    borderRadius: 16,
  },

  positionText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  patientContainer: {
    flex: 1,
    paddingRight: 8,
  },

  patientName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },

  locationRow: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationText: {
    marginLeft: 4,
    color:
      Colors.textSecondary,
    fontSize: 12,
  },

  severityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  severityText: {
    fontSize: 10,
    fontWeight: '800',
  },

  complaint: {
    marginVertical: 11,
    color: Colors.textLabel,
    fontSize: 13,
  },

  waitingInfo: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    borderTopWidth: 1,
    borderTopColor:
      Colors.surfaceSecondary,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeText: {
    marginLeft: 5,
    color: Colors.muted,
    fontSize: 10,
  },

  waitingTime: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },

  queueActions: {
    marginTop: 13,
    flexDirection: 'row',
    gap: 8,
  },

  detailsButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Colors.surfaceSecondary,
    borderRadius: 10,
  },

  detailsButtonText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  acceptButton: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor:
      Colors.primary,
    borderRadius: 10,
  },

  acceptButtonDisabled: {
    backgroundColor:
      Colors.surfaceSecondary,
  },

  acceptButtonText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '800',
  },

  acceptButtonTextDisabled: {
    color: Colors.muted,
  },

  activeWarning: {
    marginTop: 8,
    color:
      Colors.textSecondary,
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
  },

  // FILA VAZIA
  emptyQueueCard: {
    padding: 24,
    alignItems: 'center',
    backgroundColor:
      Colors.surface,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.disabled,
    borderRadius: 14,
  },

  emptyQueueTitle: {
    marginTop: 8,
    color: Colors.text,
    fontSize: 14,
    fontWeight: '800',
  },

  emptyQueueText: {
    marginTop: 5,
    color:
      Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});