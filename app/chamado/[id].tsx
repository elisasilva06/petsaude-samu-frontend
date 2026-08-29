import { Ionicons } from '@expo/vector-icons';

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import { StatusBar } from 'expo-status-bar';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Linking,
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
  DestinationCard,
} from '@/features/chamados/components/DestinationCard';

import {
  FinalizarOcorrenciaModal,
} from '@/features/chamados/components/FinalizarOcorrenciaModal';

import {
  LocationCard,
} from '@/features/chamados/components/LocationCard';

import {
  PatientCard,
} from '@/features/chamados/components/PatientCard';

import {
  RiskCard,
} from '@/features/chamados/components/RiskCard';

import {
  chamadosService,
} from '@/features/chamados/services';

import type {
  ChamadoDetalhado,
  GravidadeChamado,
} from '@/features/chamados/types';

import {
  fichaSaeService,
} from '@/features/ficha-sae/services';

import type {
  StatusFichaSae,
} from '@/features/ficha-sae/services';

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

/**
 * Tela de detalhes de uma ocorrência.
 *
 * Estados possíveis:
 *
 * AGUARDANDO
 * → consulta os detalhes
 * → pode aceitar a ocorrência
 *
 * EM ATENDIMENTO
 * → libera Ficha SAE
 * → libera Mensagens
 * → permite iniciar processo de finalização
 *
 * FINALIZADO
 * → atendimento encerrado
 *
 * A tela não mantém um estado local artificial
 * para representar o status do chamado.
 *
 * ChamadosService é a fonte de verdade.
 */
export default function ChamadoScreen() {
  const params =
    useLocalSearchParams<{
      id: string | string[];
    }>();

  const id =
    Array.isArray(params.id)
      ? params.id[0]
      : params.id;

  const [
    chamado,
    setChamado,
  ] =
    useState<ChamadoDetalhado | null>(
      null
    );

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    aceitando,
    setAceitando,
  ] = useState(false);

  const [
    erro,
    setErro,
  ] = useState('');

  const [
    idChamadoAtivo,
    setIdChamadoAtivo,
  ] =
    useState<string | null>(
      null
    );

  /*
   * Estados do fluxo de finalização.
   */
  const [
    modalFinalizacaoVisivel,
    setModalFinalizacaoVisivel,
  ] = useState(false);

  const [
    statusFicha,
    setStatusFicha,
  ] =
    useState<StatusFichaSae | null>(
      null
    );

  const [
    verificandoFicha,
    setVerificandoFicha,
  ] = useState(false);

  const [
    finalizando,
    setFinalizando,
  ] = useState(false);

  const [
    erroFinalizacao,
    setErroFinalizacao,
  ] =
    useState<string | null>(
      null
    );

  /**
   * Atualiza visualmente os contadores
   * de tempo uma vez por minuto.
   */
  const [
    agora,
    setAgora,
  ] = useState(Date.now());

  useEffect(() => {
    const intervalo =
      setInterval(() => {
        setAgora(Date.now());
      }, 60_000);

    return () => {
      clearInterval(intervalo);
    };
  }, []);

  /**
   * Busca:
   *
   * - dados completos da ocorrência;
   * - estado atual do painel.
   *
   * Assim conseguimos identificar se existe
   * outro atendimento ativo.
   */
  const carregarChamado =
    useCallback(async () => {
      if (!id) {
        setErro(
          'Identificador da ocorrência inválido.'
        );

        setCarregando(false);

        return;
      }

      try {
        setCarregando(true);
        setErro('');

        const [
          dadosChamado,
          painel,
        ] = await Promise.all([
          chamadosService.buscarChamado(
            id
          ),

          chamadosService.buscarPainel(),
        ]);

        setChamado(dadosChamado);

        setIdChamadoAtivo(
          painel.ativo?.id ??
            null
        );

        setAgora(Date.now());
      } catch (error) {
        console.error(
          'Erro ao carregar ocorrência:',
          error
        );

        setErro(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar a ocorrência.'
        );
      } finally {
        setCarregando(false);
      }
    }, [id]);

  /**
   * Sempre que retornamos para esta tela,
   * buscamos novamente os dados.
   *
   * Isso permite atualizar:
   *
   * - status do chamado;
   * - status do atendimento;
   * - situação após retornar da Ficha SAE.
   */
  useFocusEffect(
    useCallback(() => {
      void carregarChamado();
    }, [carregarChamado])
  );

  /**
   * Assume uma ocorrência aguardando.
   *
   * A tela só muda após confirmação
   * do chamadosService.
   */
  async function aceitarChamado() {
    if (
      !chamado ||
      chamado.status !==
        'aguardando' ||
      aceitando
    ) {
      return;
    }

    try {
      setAceitando(true);
      setErro('');

      await chamadosService.aceitarChamado(
        chamado.id
      );

      await carregarChamado();
    } catch (error) {
      console.error(
        'Erro ao aceitar ocorrência:',
        error
      );

      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível assumir esta ocorrência.'
      );
    } finally {
      setAceitando(false);
    }
  }

  /**
   * Inicia uma ligação para o paciente.
   */
  async function ligarParaPaciente() {
    if (!chamado) {
      return;
    }

    try {
      await Linking.openURL(
        `tel:${chamado.telefone}`
      );
    } catch (error) {
      console.error(
        'Erro ao iniciar ligação:',
        error
      );

      setErro(
        'Não foi possível iniciar a ligação.'
      );
    }
  }

  /**
   * Abre o aplicativo de mapas utilizando
   * as coordenadas da ocorrência.
   */
  async function abrirGPS() {
    if (!chamado) {
      return;
    }

    const destino =
      `${chamado.latitude},${chamado.longitude}`;

    const url =
      `https://www.google.com/maps/dir/?api=1&destination=${destino}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error(
        'Erro ao abrir GPS:',
        error
      );

      setErro(
        'Não foi possível abrir o aplicativo de mapas.'
      );
    }
  }

  /**
   * Abre a Ficha SAE.
   *
   * Ao entrar na ficha, registramos que
   * seu preenchimento foi iniciado.
   *
   * TODO(BACKEND):
   * Esse estado deverá ser persistido pela API.
   */
  async function abrirFichaSae() {
    if (
      !chamado ||
      chamado.status !==
        'em_atendimento'
    ) {
      return;
    }

    try {
      await fichaSaeService.marcarEmPreenchimento(
        chamado.id
      );

      router.push({
        pathname:
          '/ficha-sae/[id]',

        params: {
          id: chamado.id,
        },
      });
    } catch (error) {
      console.error(
        'Erro ao abrir Ficha SAE:',
        error
      );

      setErro(
        'Não foi possível abrir a Ficha SAE.'
      );
    }
  }

  function abrirMensagens() {
    if (
      !chamado ||
      chamado.status !==
        'em_atendimento'
    ) {
      return;
    }

    router.push({
      pathname:
        '/mensagens/[id]',

      params: {
        id: chamado.id,
      },
    });
  }

  /**
   * Inicia o processo de finalização.
   *
   * Antes de apresentar a confirmação final,
   * verificamos o estado real da Ficha SAE.
   */
  async function solicitarFinalizacao() {
    if (
      !chamado ||
      chamado.status !==
        'em_atendimento'
    ) {
      return;
    }

    try {
      setModalFinalizacaoVisivel(
        true
      );

      setVerificandoFicha(true);

      setStatusFicha(null);

      setErroFinalizacao(null);

      const status =
        await fichaSaeService.buscarStatus(
          chamado.id
        );

      setStatusFicha(status);
    } catch (error) {
      console.error(
        'Erro ao verificar Ficha SAE:',
        error
      );

      setStatusFicha(null);

      setErroFinalizacao(
        'Não foi possível verificar a situação da Ficha SAE.'
      );
    } finally {
      setVerificandoFicha(false);
    }
  }

  /**
   * Quando a Ficha SAE ainda não estiver
   * concluída, encaminhamos o profissional
   * diretamente para ela.
   */
  async function abrirFichaParaFinalizacao() {
    setModalFinalizacaoVisivel(
      false
    );

    setStatusFicha(null);

    setErroFinalizacao(null);

    await abrirFichaSae();
  }

  /**
   * Confirma definitivamente a finalização.
   *
   * Só executamos esta operação se o service
   * confirmou que a Ficha SAE está concluída.
   *
   * IMPORTANTE:
   * A regra deverá também ser validada pelo backend.
   * A proteção do frontend é principalmente de UX.
   */
  async function confirmarFinalizacao() {
    if (
      !chamado ||
      chamado.status !==
        'em_atendimento' ||
      statusFicha !==
        'concluida' ||
      finalizando
    ) {
      return;
    }

    try {
      setFinalizando(true);

      setErroFinalizacao(null);

      await chamadosService.finalizarChamado(
        chamado.id
      );

      setModalFinalizacaoVisivel(
        false
      );

      /**
       * Após confirmação do service:
       *
       * - chamado deixa de ser ativo;
       * - profissional fica disponível para outro;
       * - ocorrência deverá aparecer no Histórico.
       */
      router.replace('/home');
    } catch (error) {
      console.error(
        'Erro ao finalizar ocorrência:',
        error
      );

      setErroFinalizacao(
        error instanceof Error
          ? error.message
          : 'Não foi possível finalizar a ocorrência.'
      );
    } finally {
      setFinalizando(false);
    }
  }

  function cancelarFinalizacao() {
    if (finalizando) {
      return;
    }

    setModalFinalizacaoVisivel(
      false
    );

    setStatusFicha(null);

    setErroFinalizacao(null);
  }

  if (carregando) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}
      >
        <StatusBar style="dark" />

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
            Carregando ocorrência...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!chamado) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}
      >
        <StatusBar style="dark" />

        <View
          style={
            styles.errorContainer
          }
        >
          <Ionicons
            name="alert-circle-outline"
            size={38}
            color={Colors.danger}
          />

          <Text
            style={
              styles.errorTitle
            }
          >
            Ocorrência indisponível
          </Text>

          <Text
            style={
              styles.errorDescription
            }
          >
            {erro ||
              'Não foi possível carregar esta ocorrência.'}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              void carregarChamado()
            }
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

          <TouchableOpacity
            style={
              styles.backHomeButton
            }
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                styles.backHomeText
              }
            >
              Voltar
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const aguardando =
    chamado.status ===
    'aguardando';

  const emAtendimento =
    chamado.status ===
    'em_atendimento';

  const finalizado =
    chamado.status ===
    'finalizado';

  const outroChamadoAtivo =
    aguardando &&
    idChamadoAtivo !== null &&
    idChamadoAtivo !==
      chamado.id;

  const gravidade =
    GRAVIDADE_STYLE[
      chamado.gravidade
    ];

  const referenciaTempo =
    emAtendimento &&
    chamado.iniciadoEm
      ? chamado.iniciadoEm
      : chamado.recebidoEm;

  const tempo =
    calcularTempo(
      referenciaTempo,
      agora
    );

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <StatusBar style="dark" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors.text}
          />
        </TouchableOpacity>

        <View
          style={
            styles.headerContent
          }
        >
          <Text
            style={
              styles.headerTitle
            }
          >
            Ocorrência #{chamado.id}
          </Text>

          <Text
            style={
              styles.headerStatus
            }
          >
            {obterStatusLabel(
              chamado.status
            )}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                gravidade.color,
            },
          ]}
        >
          <Text
            style={
              styles.statusText
            }
          >
            {chamado.classificacao.toUpperCase()}
          </Text>
        </View>

        <View
          style={styles.timerBadge}
        >
          <Ionicons
            name="time-outline"
            size={14}
            color={
              Colors.emergency
            }
          />

          <Text
            style={styles.timerText}
          >
            {tempo}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* STATUS ATIVO */}
        {emAtendimento ? (
          <View
            style={
              styles.activeNotice
            }
          >
            <View
              style={
                styles.activeNoticeIcon
              }
            >
              <Ionicons
                name="pulse-outline"
                size={22}
                color={
                  Colors.success
                }
              />
            </View>

            <View
              style={
                styles.noticeContent
              }
            >
              <Text
                style={
                  styles.activeNoticeTitle
                }
              >
                Atendimento em andamento
              </Text>

              <Text
                style={
                  styles.activeNoticeText
                }
              >
                Esta ocorrência está atualmente
                sob seu atendimento.
              </Text>
            </View>
          </View>
        ) : null}

        {/* AGUARDANDO */}
        {aguardando ? (
          <View
            style={
              styles.waitingNotice
            }
          >
            <View
              style={
                styles.waitingNoticeIcon
              }
            >
              <Ionicons
                name="time-outline"
                size={22}
                color={
                  Colors.primary
                }
              />
            </View>

            <View
              style={
                styles.noticeContent
              }
            >
              <Text
                style={
                  styles.waitingNoticeTitle
                }
              >
                Aguardando atendimento
              </Text>

              <Text
                style={
                  styles.waitingNoticeText
                }
              >
                Consulte os detalhes antes de
                assumir esta ocorrência.
              </Text>
            </View>
          </View>
        ) : null}

        {/* FINALIZADO */}
        {finalizado ? (
          <View
            style={
              styles.finishedNotice
            }
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color={
                Colors.success
              }
            />

            <Text
              style={
                styles.finishedNoticeText
              }
            >
              Atendimento finalizado
            </Text>
          </View>
        ) : null}

        {/* ERRO */}
        {erro ? (
          <View
            style={styles.errorBox}
          >
            <Ionicons
              name="alert-circle-outline"
              size={19}
              color={
                Colors.danger
              }
            />

            <Text
              style={
                styles.errorBoxText
              }
            >
              {erro}
            </Text>
          </View>
        ) : null}

        {/* PACIENTE */}
        <PatientCard
          chamado={chamado}
          onCall={() => {
            void ligarParaPaciente();
          }}
        />

        {/* LOCALIZAÇÃO */}
        <LocationCard
          chamado={chamado}
          onOpenGPS={() => {
            void abrirGPS();
          }}
        />

        {/*
         * TODO(BACKEND):
         * RiskCard ainda precisa receber os
         * dados reais de classificação.
         */}
        <RiskCard />

        {/* RELATO */}
        <Text
          style={styles.sectionTitle}
        >
          Relato do Médico Regulador
        </Text>

        <View
          style={styles.reportCard}
        >
          <Text
            style={
              styles.reportText
            }
          >
            {chamado.relato}
          </Text>
        </View>

        {/* AÇÕES */}
        <Text
          style={styles.sectionTitle}
        >
          Ações disponíveis
        </Text>

        {/* FICHA SAE */}
        <TouchableOpacity
          style={[
            styles.menuItem,

            !emAtendimento &&
              styles.menuItemDisabled,
          ]}
          disabled={
            !emAtendimento
          }
          onPress={() => {
            void abrirFichaSae();
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name="document-text-outline"
            size={23}
            color={
              emAtendimento
                ? Colors.primary
                : Colors.muted
            }
          />

          <View
            style={
              styles.menuContent
            }
          >
            <Text
              style={[
                styles.menuTitle,

                !emAtendimento &&
                  styles.menuTitleDisabled,
              ]}
            >
              Preencher Ficha SAE
            </Text>

            {!emAtendimento ? (
              <Text
                style={
                  styles.menuSubtitle
                }
              >
                Disponível após assumir o atendimento
              </Text>
            ) : null}
          </View>

          <Ionicons
            name={
              emAtendimento
                ? 'chevron-forward'
                : 'lock-closed-outline'
            }
            size={20}
            color={Colors.border}
          />
        </TouchableOpacity>

        {/* MENSAGENS */}
        <TouchableOpacity
          style={[
            styles.menuItem,
            styles.menuItemSpacing,

            !emAtendimento &&
              styles.menuItemDisabled,
          ]}
          disabled={
            !emAtendimento
          }
          onPress={
            abrirMensagens
          }
          activeOpacity={0.8}
        >
          <Ionicons
            name="chatbubble-outline"
            size={22}
            color={
              emAtendimento
                ? Colors.success
                : Colors.muted
            }
          />

          <View
            style={
              styles.menuContent
            }
          >
            <Text
              style={[
                styles.menuTitle,

                !emAtendimento &&
                  styles.menuTitleDisabled,
              ]}
            >
              Mensagens com Solicitante
            </Text>

            {!emAtendimento ? (
              <Text
                style={
                  styles.menuSubtitle
                }
              >
                Disponível após assumir o atendimento
              </Text>
            ) : null}
          </View>

          <Ionicons
            name={
              emAtendimento
                ? 'chevron-forward'
                : 'lock-closed-outline'
            }
            size={20}
            color={Colors.border}
          />
        </TouchableOpacity>

        {/* ENCAMINHAMENTO */}
        <DestinationCard
          chamado={chamado}
        />

        {/* ACEITAR */}
        {aguardando ? (
          <>
            {outroChamadoAtivo ? (
              <View
                style={
                  styles.blockedBox
                }
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={
                    Colors.muted
                  }
                />

                <View
                  style={
                    styles.blockedContent
                  }
                >
                  <Text
                    style={
                      styles.blockedTitle
                    }
                  >
                    Atendimento indisponível
                  </Text>

                  <Text
                    style={
                      styles.blockedText
                    }
                  >
                    Finalize o atendimento em andamento
                    antes de assumir outra ocorrência.
                  </Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={
                  styles.acceptButton
                }
                onPress={() => {
                  void aceitarChamado();
                }}
                disabled={
                  aceitando
                }
                activeOpacity={
                  0.85
                }
              >
                {aceitando ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color={
                        Colors.background
                      }
                    />

                    <Text
                      style={
                        styles.acceptButtonText
                      }
                    >
                      Assumindo ocorrência...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={22}
                      color={
                        Colors.background
                      }
                    />

                    <Text
                      style={
                        styles.acceptButtonText
                      }
                    >
                      ACEITAR ATENDIMENTO
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </>
        ) : null}

        {/* ATENDIMENTO ATIVO */}
        {emAtendimento ? (
          <>
            <View
              style={
                styles.inProgressButton
              }
            >
              <Ionicons
                name="pulse-outline"
                size={22}
                color={
                  Colors.background
                }
              />

              <Text
                style={
                  styles.inProgressButtonText
                }
              >
                ATENDIMENTO EM CURSO
              </Text>
            </View>

            {/*
             * FINALIZAÇÃO
             *
             * Não finaliza imediatamente.
             * Abre o fluxo de verificação
             * da Ficha SAE.
             */}
            <TouchableOpacity
              style={
                styles.finishOccurrenceButton
              }
              onPress={() => {
                void solicitarFinalizacao();
              }}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Finalizar ocorrência"
            >
              <Ionicons
                name="flag-outline"
                size={20}
                color={
                  Colors.danger
                }
              />

              <Text
                style={
                  styles.finishOccurrenceText
                }
              >
                Finalizar ocorrência
              </Text>
            </TouchableOpacity>
          </>
        ) : null}
      </ScrollView>

      {/* MODAL DE FINALIZAÇÃO */}
      <FinalizarOcorrenciaModal
        visible={
          modalFinalizacaoVisivel
        }
        statusFicha={
          statusFicha
        }
        verificandoFicha={
          verificandoFicha
        }
        finalizando={
          finalizando
        }
        error={
          erroFinalizacao
        }
        onCancel={
          cancelarFinalizacao
        }
        onOpenFicha={() => {
          void abrirFichaParaFinalizacao();
        }}
        onConfirm={() => {
          void confirmarFinalizacao();
        }}
      />
    </SafeAreaView>
  );
}

function obterStatusLabel(
  status: ChamadoDetalhado['status']
) {
  switch (status) {
    case 'aguardando':
      return 'Aguardando atendimento';

    case 'em_atendimento':
      return 'Em atendimento';

    case 'finalizado':
      return 'Finalizado';

    case 'cancelado':
      return 'Cancelado';

    default:
      return '';
  }
}

/**
 * Calcula um tempo resumido para
 * apresentação no cabeçalho.
 */
function calcularTempo(
  referencia: string,
  agora: number
) {
  const inicio =
    new Date(
      referencia
    ).getTime();

  if (
    Number.isNaN(inicio)
  ) {
    return '--';
  }

  const minutos =
    Math.floor(
      Math.max(
        0,
        agora - inicio
      ) / 60_000
    );

  if (minutos < 1) {
    return '< 1 min';
  }

  if (minutos < 60) {
    return `${minutos} min`;
  }

  const horas =
    Math.floor(
      minutos / 60
    );

  const restantes =
    minutos % 60;

  if (restantes === 0) {
    return `${horas}h`;
  }

  return `${horas}h ${restantes}m`;
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        Colors.surfaceMuted,
    },

    header: {
      minHeight: 64,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        Colors.background,
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.surfaceSecondary,
    },

    backButton: {
      paddingRight: 10,
      paddingVertical: 8,
    },

    headerContent: {
      flex: 1,
    },

    headerTitle: {
      color: Colors.text,
      fontSize: 15,
      fontWeight: '800',
    },

    headerStatus: {
      marginTop: 2,
      color:
        Colors.textSecondary,
      fontSize: 9,
    },

    statusBadge: {
      marginRight: 7,
      paddingHorizontal: 7,
      paddingVertical: 4,
      borderRadius: 10,
    },

    statusText: {
      color:
        Colors.background,
      fontSize: 9,
      fontWeight: '800',
    },

    timerBadge: {
      paddingHorizontal: 7,
      paddingVertical: 4,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        Colors.dangerSurface,
      borderRadius: 10,
    },

    timerText: {
      marginLeft: 4,
      color:
        Colors.emergency,
      fontSize: 10,
      fontWeight: '700',
    },

    scroll: {
      flex: 1,
    },

    content: {
      padding: 16,
      paddingBottom: 40,
    },

    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    loadingText: {
      marginTop: 12,
      color:
        Colors.textSecondary,
      fontSize: 13,
    },

    errorContainer: {
      flex: 1,
      paddingHorizontal: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },

    errorTitle: {
      marginTop: 12,
      color: Colors.text,
      fontSize: 18,
      fontWeight: '800',
      textAlign: 'center',
    },

    errorDescription: {
      marginTop: 7,
      color:
        Colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
      textAlign: 'center',
    },

    retryButton: {
      minHeight: 50,
      marginTop: 20,
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
      color:
        Colors.background,
      fontSize: 13,
      fontWeight: '800',
    },

    backHomeButton: {
      marginTop: 10,
      padding: 12,
    },

    backHomeText: {
      color: Colors.primary,
      fontSize: 13,
      fontWeight: '700',
    },

    activeNotice: {
      marginBottom: 14,
      padding: 13,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        '#E8F5E9',
      borderWidth: 1,
      borderColor:
        '#C8E6C9',
      borderRadius: 12,
    },

    activeNoticeIcon: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.background,
      borderRadius: 20,
    },

    waitingNotice: {
      marginBottom: 14,
      padding: 13,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        Colors.surfaceSecondary,
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderRadius: 12,
    },

    waitingNoticeIcon: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.background,
      borderRadius: 20,
    },

    noticeContent: {
      flex: 1,
      marginLeft: 10,
    },

    activeNoticeTitle: {
      color:
        Colors.success,
      fontSize: 13,
      fontWeight: '800',
    },

    activeNoticeText: {
      marginTop: 2,
      color:
        Colors.textSecondary,
      fontSize: 11,
    },

    waitingNoticeTitle: {
      color:
        Colors.primary,
      fontSize: 13,
      fontWeight: '800',
    },

    waitingNoticeText: {
      marginTop: 2,
      color:
        Colors.textSecondary,
      fontSize: 11,
    },

    finishedNotice: {
      marginBottom: 14,
      padding: 13,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor:
        '#E8F5E9',
      borderRadius: 12,
    },

    finishedNoticeText: {
      color:
        Colors.success,
      fontSize: 13,
      fontWeight: '800',
    },

    errorBox: {
      marginBottom: 14,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      backgroundColor:
        Colors.dangerSurface,
      borderWidth: 1,
      borderColor:
        Colors.danger,
      borderRadius: 10,
    },

    errorBoxText: {
      flex: 1,
      color:
        Colors.danger,
      fontSize: 12,
      lineHeight: 17,
    },

    sectionTitle: {
      marginTop: 8,
      marginBottom: 8,
      color:
        Colors.muted,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.5,
      textTransform:
        'uppercase',
    },

    reportCard: {
      marginBottom: 16,
      padding: 16,
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderLeftWidth: 4,
      borderColor:
        Colors.border,
      borderLeftColor:
        Colors.primary,
      borderRadius: 16,
    },

    reportText: {
      color:
        Colors.textLabel,
      fontSize: 14,
      lineHeight: 22,
    },

    menuItem: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        Colors.surface,
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderRadius: 16,
    },

    menuItemDisabled: {
      opacity: 0.55,
    },

    menuItemSpacing: {
      marginTop: 8,
    },

    menuContent: {
      flex: 1,
      marginLeft: 12,
    },

    menuTitle: {
      color:
        Colors.text,
      fontSize: 15,
      fontWeight: '700',
    },

    menuTitleDisabled: {
      color:
        Colors.muted,
    },

    menuSubtitle: {
      marginTop: 2,
      color:
        Colors.muted,
      fontSize: 11,
    },

    blockedBox: {
      marginTop: 12,
      padding: 15,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        Colors.surfaceSecondary,
      borderRadius: 14,
    },

    blockedContent: {
      flex: 1,
      marginLeft: 10,
    },

    blockedTitle: {
      color:
        Colors.text,
      fontSize: 13,
      fontWeight: '800',
    },

    blockedText: {
      marginTop: 3,
      color:
        Colors.textSecondary,
      fontSize: 11,
      lineHeight: 16,
    },

    acceptButton: {
      minHeight: 58,
      marginTop: 12,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      backgroundColor:
        Colors.primary,
      borderRadius: 16,
    },

    acceptButtonText: {
      color:
        Colors.background,
      fontSize: 14,
      fontWeight: '900',
    },

    inProgressButton: {
      minHeight: 58,
      marginTop: 12,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      backgroundColor:
        Colors.success,
      borderRadius: 16,
    },

    inProgressButtonText: {
      color:
        Colors.background,
      fontSize: 14,
      fontWeight: '900',
    },

    finishOccurrenceButton: {
      minHeight: 56,
      marginTop: 10,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor:
        Colors.dangerSurface,
      borderWidth: 1,
      borderColor:
        Colors.danger,
      borderRadius: 16,
    },

    finishOccurrenceText: {
      color:
        Colors.danger,
      fontSize: 14,
      fontWeight: '900',
    },
  });