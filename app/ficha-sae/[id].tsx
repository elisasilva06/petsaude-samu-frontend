import { Ionicons } from '@expo/vector-icons';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
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
  ChamadoDetalhado,
} from '@/features/chamados/types';

import {
  ConcluirFichaModal,
} from '@/features/ficha-sae/components/ConcluirFichaModal';

import {
  FichaSaeProvider,
  useFichaSae,
} from '@/features/ficha-sae/context/FichaSaeContext';

import {
  criarFichaSaeAPartirDoChamado,
} from '@/features/ficha-sae/mappers';

import {
  fichaSaeService,
} from '@/features/ficha-sae/services';

import {
  AvaliacaoPrimariaSection,
} from '@/features/ficha-sae/sections/AvaliacaoPrimariaSection';

import {
  AvaliacaoSecundariaSection,
} from '@/features/ficha-sae/sections/AvaliacaoSecundariaSection';

import {
  DiagnosticosIntervencoesSection,
} from '@/features/ficha-sae/sections/DiagnosticosIntervencoesSection';

import {
  FinalizacaoSection,
} from '@/features/ficha-sae/sections/FinalizacaoSection';

import {
  GlasgowSection,
} from '@/features/ficha-sae/sections/GlasgowSection';

import {
  IdentificacaoSection,
} from '@/features/ficha-sae/sections/IdentificacaoSection';

import {
  MorseSection,
} from '@/features/ficha-sae/sections/MorseSection';

import {
  RassSection,
} from '@/features/ficha-sae/sections/RassSection';

import {
  TraumaQueimadurasSection,
} from '@/features/ficha-sae/sections/TraumaQueimadurasSection';

import {
  TripsSection,
} from '@/features/ficha-sae/sections/TripsSection';

import type {
  FichaSaeSectionKey,
} from '@/features/ficha-sae/types';

type SectionConfig = {
  key: FichaSaeSectionKey;
  label: string;
  shortLabel: string;
};

const SECTIONS: SectionConfig[] = [
  {
    key: 'identificacao',
    label: 'Identificação',
    shortLabel: 'Identificação',
  },
  {
    key: 'avaliacaoPrimaria',
    label: 'Avaliação Primária',
    shortLabel: 'Primária',
  },
  {
    key: 'avaliacaoSecundaria',
    label: 'Avaliação Secundária',
    shortLabel: 'Secundária',
  },
  {
    key: 'glasgow',
    label: 'Escala de Glasgow',
    shortLabel: 'Glasgow',
  },
  {
    key: 'rass',
    label: 'Escala RASS',
    shortLabel: 'RASS',
  },
  {
    key: 'trips',
    label: 'Escala TRIPS',
    shortLabel: 'TRIPS',
  },
  {
    key: 'traumaQueimaduras',
    label: 'Trauma e Queimaduras',
    shortLabel: 'Trauma',
  },
  {
    key: 'morse',
    label: 'Escala de Morse',
    shortLabel: 'Morse',
  },
  {
    key: 'diagnosticosIntervencoes',
    label: 'Diagnósticos e Intervenções',
    shortLabel: 'Diagnósticos',
  },
  {
    key: 'finalizacao',
    label: 'Finalização',
    shortLabel: 'Finalizar',
  },
];

/**
 * Carrega a ocorrência antes de criar
 * o estado da Ficha SAE.
 *
 * Fluxo:
 *
 * FichaSaeScreen
 *      ↓
 * chamadosService.buscarChamado()
 *      ↓
 * criarFichaSaeAPartirDoChamado()
 *      ↓
 * FichaSaeProvider
 */
export default function FichaSaeScreen() {
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
    erro,
    setErro,
  ] = useState('');

  useEffect(() => {
    async function carregar() {
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

        const resultado =
          await chamadosService.buscarChamado(
            id
          );

        if (
          resultado.status !==
          'em_atendimento'
        ) {
          setErro(
            'A Ficha SAE só pode ser preenchida durante um atendimento em andamento.'
          );

          return;
        }

        setChamado(resultado);

        await fichaSaeService.marcarEmPreenchimento(
          resultado.id
        );
      } catch (error) {
        console.error(
          'Erro ao carregar Ficha SAE:',
          error
        );

        setErro(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar a Ficha SAE.'
        );
      } finally {
        setCarregando(false);
      }
    }

    void carregar();
  }, [id]);

  if (carregando) {
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
            Carregando Ficha SAE...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (
    !chamado ||
    erro
  ) {
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
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color={Colors.danger}
          />

          <Text
            style={
              styles.errorTitle
            }
          >
            Ficha SAE indisponível
          </Text>

          <Text
            style={
              styles.errorText
            }
          >
            {erro ||
              'Não foi possível carregar a ficha.'}
          </Text>

          <TouchableOpacity
            style={
              styles.errorButton
            }
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                styles.errorButtonText
              }
            >
              Voltar
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const fichaInicial =
    criarFichaSaeAPartirDoChamado(
      chamado
    );

  return (
    <FichaSaeProvider
      initialState={fichaInicial}
    >
      <FichaSaeScreenContent
        chamadoId={chamado.id}
      />
    </FichaSaeProvider>
  );
}

type FichaSaeScreenContentProps = {
  chamadoId: string;
};

function FichaSaeScreenContent({
  chamadoId,
}: FichaSaeScreenContentProps) {
  const {
    resetFicha,
  } = useFichaSae();

  const [
    activeSection,
    setActiveSection,
  ] =
    useState<FichaSaeSectionKey>(
      'identificacao'
    );

  const [
    concluindo,
    setConcluindo,
  ] = useState(false);

  const [
    erroConclusao,
    setErroConclusao,
  ] = useState('');

  const [
    modalConclusaoVisivel,
    setModalConclusaoVisivel,
  ] = useState(false);

  const activeSectionIndex =
    SECTIONS.findIndex(
      (section) =>
        section.key ===
        activeSection
    );

  const activeSectionConfig =
    SECTIONS[
      activeSectionIndex
    ];

  /**
   * Representa somente a posição atual
   * dentro das dez etapas.
   *
   * Não significa que todos os campos
   * anteriores estão válidos.
   */
  const percentualNavegacao =
    Math.round(
      ((activeSectionIndex + 1) /
        SECTIONS.length) *
        100
    );

  function voltar() {
    router.back();
  }

  function irParaAnterior() {
    if (
      activeSectionIndex <= 0
    ) {
      return;
    }

    setActiveSection(
      SECTIONS[
        activeSectionIndex - 1
      ].key
    );
  }

  function irParaProxima() {
    if (
      activeSectionIndex >=
      SECTIONS.length - 1
    ) {
      return;
    }

    setActiveSection(
      SECTIONS[
        activeSectionIndex + 1
      ].key
    );
  }

  /**
   * TODO(BACKEND):
   * Quando houver persistência de rascunho,
   * sair da tela não deverá necessariamente
   * apagar o preenchimento.
   */
  function cancelarFicha() {
    Alert.alert(
      'Sair da Ficha SAE',
      'Deseja sair do preenchimento? Os dados alterados nesta sessão ainda não possuem persistência definitiva.',
      [
        {
          text: 'Continuar preenchendo',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',

          onPress: () => {
            resetFicha();
            router.back();
          },
        },
      ]
    );
  }

  /**
   * Abre a confirmação própria da Ficha SAE.
   *
   * Não utilizamos Alert para a conclusão,
   * porque a operação precisa funcionar da
   * mesma forma no mobile e no Web.
   */
  function concluirFicha() {
    if (concluindo) {
      return;
    }

    setErroConclusao('');

    setModalConclusaoVisivel(
      true
    );
  }

  /**
   * Confirma a conclusão da ficha.
   *
   * Somente após o service confirmar
   * a operação retornamos para a ocorrência.
   */
  async function confirmarConclusao() {
    if (concluindo) {
      return;
    }

    try {
      setConcluindo(true);

      setErroConclusao('');

      await fichaSaeService.marcarComoConcluida(
        chamadoId
      );

      setModalConclusaoVisivel(
        false
      );

      /**
       * Ao retornar para a ocorrência,
       * o botão "Finalizar ocorrência"
       * poderá consultar novamente o service
       * e encontrar:
       *
       * statusFicha = "concluida"
       */
      router.back();
    } catch (error) {
      console.error(
        'Erro ao concluir Ficha SAE:',
        error
      );

      setErroConclusao(
        error instanceof Error
          ? error.message
          : 'Não foi possível concluir a Ficha SAE.'
      );
    } finally {
      setConcluindo(false);
    }
  }

  function cancelarConclusao() {
    if (concluindo) {
      return;
    }

    setModalConclusaoVisivel(
      false
    );

    setErroConclusao('');
  }

  function renderActiveSection() {
    switch (activeSection) {
      case 'identificacao':
        return (
          <IdentificacaoSection />
        );

      case 'avaliacaoPrimaria':
        return (
          <AvaliacaoPrimariaSection />
        );

      case 'avaliacaoSecundaria':
        return (
          <AvaliacaoSecundariaSection />
        );

      case 'glasgow':
        return (
          <GlasgowSection />
        );

      case 'rass':
        return (
          <RassSection />
        );

      case 'trips':
        return (
          <TripsSection />
        );

      case 'traumaQueimaduras':
        return (
          <TraumaQueimadurasSection />
        );

      case 'morse':
        return (
          <MorseSection />
        );

      case 'diagnosticosIntervencoes':
        return (
          <DiagnosticosIntervencoesSection />
        );

      case 'finalizacao':
        return (
          <FinalizacaoSection />
        );

      default:
        return null;
    }
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={
            styles.backButton
          }
          onPress={voltar}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors.text}
          />
        </TouchableOpacity>

        <View
          style={
            styles.headerTextContainer
          }
        >
          <Text
            style={
              styles.headerTitle
            }
          >
            Ficha SAE
          </Text>

          <Text
            style={
              styles.headerSubtitle
            }
          >
            Ocorrência #{chamadoId}
          </Text>
        </View>

        <TouchableOpacity
          style={
            styles.closeButton
          }
          onPress={
            cancelarFicha
          }
        >
          <Ionicons
            name="close"
            size={23}
            color={
              Colors.textSecondary
            }
          />
        </TouchableOpacity>
      </View>

      {/* PROGRESSO */}
      <View
        style={
          styles.progressContainer
        }
      >
        <View
          style={
            styles.progressHeader
          }
        >
          <Text
            style={
              styles.progressText
            }
          >
            Etapa{' '}
            {activeSectionIndex + 1}{' '}
            de {SECTIONS.length}
          </Text>

          <Text
            style={
              styles.progressPercentage
            }
          >
            {percentualNavegacao}%
          </Text>
        </View>

        <View
          style={
            styles.progressTrack
          }
        >
          <View
            style={[
              styles.progressBar,
              {
                width:
                  `${percentualNavegacao}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* NAVEGAÇÃO DAS SEÇÕES */}
      <View
        style={
          styles.sectionsContainer
        }
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.sectionsScroll
          }
        >
          {SECTIONS.map(
            (section) => {
              const isActive =
                section.key ===
                activeSection;

              return (
                <TouchableOpacity
                  key={
                    section.key
                  }
                  style={[
                    styles.sectionButton,

                    isActive &&
                      styles.sectionButtonActive,
                  ]}
                  onPress={() =>
                    setActiveSection(
                      section.key
                    )
                  }
                >
                  <Text
                    style={[
                      styles.sectionButtonText,

                      isActive &&
                        styles.sectionButtonTextActive,
                    ]}
                  >
                    {
                      section.shortLabel
                    }
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </ScrollView>
      </View>

      {/* CONTEÚDO */}
      <ScrollView
        style={
          styles.contentScroll
        }
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={
            styles.sectionHeading
          }
        >
          <Text
            style={
              styles.sectionNumber
            }
          >
            {String(
              activeSectionIndex + 1
            ).padStart(
              2,
              '0'
            )}
          </Text>

          <View
            style={
              styles.sectionHeadingText
            }
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              {
                activeSectionConfig.label
              }
            </Text>

            <Text
              style={
                styles.sectionDescription
              }
            >
              Preencha as informações
              desta etapa.
            </Text>
          </View>
        </View>

        {erroConclusao ? (
          <View
            style={
              styles.errorConclusionBox
            }
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
                styles.errorConclusionText
              }
            >
              {erroConclusao}
            </Text>
          </View>
        ) : null}

        {renderActiveSection()}
      </ScrollView>

      {/* NAVEGAÇÃO INFERIOR */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.previousButton,

            activeSectionIndex ===
              0 &&
              styles.buttonDisabled,
          ]}
          disabled={
            activeSectionIndex ===
            0
          }
          onPress={
            irParaAnterior
          }
        >
          <Ionicons
            name="arrow-back"
            size={18}
            color={
              activeSectionIndex ===
              0
                ? Colors.disabled
                : Colors.primary
            }
          />

          <Text
            style={[
              styles.previousButtonText,

              activeSectionIndex ===
                0 &&
                styles.previousButtonTextDisabled,
            ]}
          >
            Anterior
          </Text>
        </TouchableOpacity>

        {activeSectionIndex <
        SECTIONS.length - 1 ? (
          <TouchableOpacity
            style={
              styles.nextButton
            }
            onPress={
              irParaProxima
            }
          >
            <Text
              style={
                styles.nextButtonText
              }
            >
              Próxima
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color={
                Colors.background
              }
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.finishButton,

              concluindo &&
                styles.finishButtonDisabled,
            ]}
            onPress={
              concluirFicha
            }
            disabled={
              concluindo
            }
          >
            {concluindo ? (
              <>
                <ActivityIndicator
                  size="small"
                  color={
                    Colors.background
                  }
                />

                <Text
                  style={
                    styles.finishButtonText
                  }
                >
                  Concluindo...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={
                    Colors.background
                  }
                />

                <Text
                  style={
                    styles.finishButtonText
                  }
                >
                  Concluir Ficha
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* CONFIRMAÇÃO DE CONCLUSÃO */}
      <ConcluirFichaModal
        visible={
          modalConclusaoVisivel
        }
        concluindo={
          concluindo
        }
        erro={
          erroConclusao
        }
        onCancel={
          cancelarConclusao
        }
        onConfirm={() => {
          void confirmarConclusao();
        }}
      />
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        Colors.surfaceMuted,
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
      paddingHorizontal: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },

    errorTitle: {
      marginTop: 12,
      color:
        Colors.text,
      fontSize: 18,
      fontWeight: '800',
      textAlign: 'center',
    },

    errorText: {
      marginTop: 7,
      color:
        Colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
      textAlign: 'center',
    },

    errorButton: {
      minHeight: 48,
      marginTop: 20,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primary,
      borderRadius: 12,
    },

    errorButtonText: {
      color:
        Colors.background,
      fontSize: 13,
      fontWeight: '800',
    },

    header: {
      minHeight: 64,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        Colors.background,
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerTextContainer: {
      flex: 1,
      marginLeft: 4,
    },

    headerTitle: {
      color:
        Colors.text,
      fontSize: 18,
      fontWeight: '800',
    },

    headerSubtitle: {
      marginTop: 2,
      color:
        Colors.textSecondary,
      fontSize: 11,
    },

    closeButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },

    progressContainer: {
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: 10,
      backgroundColor:
        Colors.background,
    },

    progressHeader: {
      marginBottom: 7,
      flexDirection: 'row',
      justifyContent:
        'space-between',
    },

    progressText: {
      color:
        Colors.textSecondary,
      fontSize: 11,
      fontWeight: '600',
    },

    progressPercentage: {
      color:
        Colors.primary,
      fontSize: 11,
      fontWeight: '800',
    },

    progressTrack: {
      height: 5,
      overflow: 'hidden',
      backgroundColor:
        Colors.surfaceSecondary,
      borderRadius: 10,
    },

    progressBar: {
      height: '100%',
      backgroundColor:
        Colors.primary,
      borderRadius: 10,
    },

    sectionsContainer: {
      backgroundColor:
        Colors.background,
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    sectionsScroll: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      gap: 7,
    },

    sectionButton: {
      minHeight: 34,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor:
        Colors.surfaceSecondary,
      borderRadius: 18,
    },

    sectionButtonActive: {
      backgroundColor:
        Colors.primary,
    },

    sectionButtonText: {
      color:
        Colors.textSecondary,
      fontSize: 11,
      fontWeight: '700',
    },

    sectionButtonTextActive: {
      color:
        Colors.background,
    },

    contentScroll: {
      flex: 1,
    },

    content: {
      padding: 18,
      paddingBottom: 30,
    },

    sectionHeading: {
      marginBottom: 18,
      flexDirection: 'row',
      alignItems: 'center',
    },

    sectionNumber: {
      width: 45,
      color:
        Colors.primary,
      fontSize: 28,
      fontWeight: '900',
    },

    sectionHeadingText: {
      flex: 1,
    },

    sectionTitle: {
      color:
        Colors.text,
      fontSize: 20,
      fontWeight: '800',
    },

    sectionDescription: {
      marginTop: 3,
      color:
        Colors.textSecondary,
      fontSize: 12,
    },

    errorConclusionBox: {
      marginBottom: 16,
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

    errorConclusionText: {
      flex: 1,
      color:
        Colors.danger,
      fontSize: 12,
      lineHeight: 17,
    },

    footer: {
      minHeight: 76,
      paddingHorizontal: 18,
      paddingVertical: 11,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      backgroundColor:
        Colors.background,
      borderTopWidth: 1,
      borderTopColor:
        Colors.border,
    },

    previousButton: {
      minHeight: 46,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderRadius: 13,
    },

    previousButtonText: {
      color:
        Colors.primary,
      fontSize: 14,
      fontWeight: '700',
    },

    previousButtonTextDisabled: {
      color:
        Colors.disabled,
    },

    buttonDisabled: {
      opacity: 0.6,
    },

    nextButton: {
      minHeight: 46,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor:
        Colors.primary,
      borderRadius: 13,
    },

    nextButtonText: {
      color:
        Colors.background,
      fontSize: 14,
      fontWeight: '800',
    },

    finishButton: {
      minHeight: 46,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor:
        Colors.success,
      borderRadius: 13,
    },

    finishButtonDisabled: {
      opacity: 0.65,
    },

    finishButtonText: {
      color:
        Colors.background,
      fontSize: 14,
      fontWeight: '800',
    },
  });