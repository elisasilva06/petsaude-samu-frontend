import { Ionicons } from '@expo/vector-icons';
import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import { useState } from 'react';

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

import { criarChamadoMock } from '@/features/chamados/mocks';

import {
  FichaSaeProvider,
  useFichaSae,
} from '@/features/ficha-sae/context/FichaSaeContext';

import { criarFichaSaeAPartirDoChamado } from '@/features/ficha-sae/mappers';

import { AvaliacaoPrimariaSection } from '@/features/ficha-sae/sections/AvaliacaoPrimariaSection';
import { AvaliacaoSecundariaSection } from '@/features/ficha-sae/sections/AvaliacaoSecundariaSection';
import { DiagnosticosIntervencoesSection } from '@/features/ficha-sae/sections/DiagnosticosIntervencoesSection';
import { FinalizacaoSection } from '@/features/ficha-sae/sections/FinalizacaoSection';
import { GlasgowSection } from '@/features/ficha-sae/sections/GlasgowSection';
import { IdentificacaoSection } from '@/features/ficha-sae/sections/IdentificacaoSection';
import { MorseSection } from '@/features/ficha-sae/sections/MorseSection';
import { RassSection } from '@/features/ficha-sae/sections/RassSection';
import { TraumaQueimadurasSection } from '@/features/ficha-sae/sections/TraumaQueimadurasSection';
import { TripsSection } from '@/features/ficha-sae/sections/TripsSection';

import { FichaSaeSectionKey } from '@/features/ficha-sae/types';

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

export default function FichaSaeScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const chamado = criarChamadoMock(
    id ?? '1'
  );

  const fichaInicial =
    criarFichaSaeAPartirDoChamado(
      chamado
    );

  return (
    <FichaSaeProvider
      initialState={fichaInicial}
    >
      <FichaSaeScreenContent />
    </FichaSaeProvider>
  );
}

function FichaSaeScreenContent() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const {
    state,
    resetFicha,
  } = useFichaSae();

  const [
    activeSection,
    setActiveSection,
  ] =
    useState<FichaSaeSectionKey>(
      'identificacao'
    );

  const activeSectionIndex =
    SECTIONS.findIndex(
      (section) =>
        section.key === activeSection
    );

  const activeSectionConfig =
    SECTIONS[activeSectionIndex];

  function voltar() {
    router.back();
  }

  function irParaAnterior() {
    if (activeSectionIndex <= 0) {
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

  function cancelarFicha() {
    Alert.alert(
      'Cancelar Ficha SAE',
      'Deseja sair da ficha? Os dados preenchidos nesta sessão serão apagados.',
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

  function concluirFicha() {
    /*
     * Temporário.
     *
     * Não vamos inventar a chamada para
     * o backend antes de conhecermos o
     * endpoint e o contrato real.
     */
    console.log(
      'Ficha SAE preenchida:',
      state
    );

    Alert.alert(
      'Ficha SAE preenchida',
      'O formulário está funcionando no frontend. O envio definitivo será conectado ao backend posteriormente.'
    );
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
          style={styles.backButton}
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
            style={styles.headerTitle}
          >
            Ficha SAE
          </Text>

          <Text
            style={
              styles.headerSubtitle
            }
          >
            Ocorrência #{id ?? '-'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={cancelarFicha}
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
            {Math.round(
              ((activeSectionIndex + 1) /
                SECTIONS.length) *
                100
            )}
            %
          </Text>
        </View>

        <View
          style={styles.progressTrack}
        >
          <View
            style={[
              styles.progressBar,
              {
                width: `${
                  ((activeSectionIndex +
                    1) /
                    SECTIONS.length) *
                  100
                }%`,
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
            (section, index) => {
              const isActive =
                section.key ===
                activeSection;

              const isPrevious =
                index <
                activeSectionIndex;

              return (
                <TouchableOpacity
                  key={section.key}
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
                  {isPrevious && (
                    <Ionicons
                      name="ellipse"
                      size={7}
                      color={
                        Colors.success
                      }
                    />
                  )}

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
        style={styles.contentScroll}
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
            ).padStart(2, '0')}
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

        {renderActiveSection()}
      </ScrollView>

      {/* NAVEGAÇÃO INFERIOR */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.previousButton,

            activeSectionIndex === 0 &&
              styles.buttonDisabled,
          ]}
          disabled={
            activeSectionIndex === 0
          }
          onPress={irParaAnterior}
        >
          <Ionicons
            name="arrow-back"
            size={18}
            color={
              activeSectionIndex === 0
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
            style={styles.nextButton}
            onPress={irParaProxima}
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
            style={
              styles.finishButton
            }
            onPress={concluirFicha}
          >
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
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.surfaceMuted,
  },

  // HEADER
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
    color: Colors.text,
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

  // PROGRESSO
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
    color: Colors.primary,
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

  // NAVEGAÇÃO DAS ETAPAS
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
    color: Colors.background,
  },

  // CONTEÚDO
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
    color: Colors.primary,
    fontSize: 28,
    fontWeight: '900',
  },

  sectionHeadingText: {
    flex: 1,
  },

  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
  },

  sectionDescription: {
    marginTop: 3,
    color:
      Colors.textSecondary,
    fontSize: 12,
  },

  // FOOTER
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
    borderColor: Colors.border,
    borderRadius: 13,
  },

  previousButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },

  previousButtonTextDisabled: {
    color: Colors.disabled,
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
    color: Colors.background,
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

  finishButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '800',
  },
});