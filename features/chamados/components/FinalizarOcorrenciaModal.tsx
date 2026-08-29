import { Ionicons } from '@expo/vector-icons';

import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';

import type {
    StatusFichaSae,
} from '@/features/ficha-sae/services';

type FinalizarOcorrenciaModalProps = {
  visible: boolean;

  statusFicha:
    StatusFichaSae | null;

  verificandoFicha: boolean;

  finalizando: boolean;

  error?: string | null;

  onCancel: () => void;

  onOpenFicha: () => void;

  onConfirm: () => void;
};

/**
 * Confirma a finalização de uma ocorrência.
 *
 * O modal NÃO decide se a ficha está concluída.
 * Ele apenas apresenta o estado retornado pelo service.
 *
 * Fluxo:
 *
 * Finalizar ocorrência
 *        ↓
 * consultar Ficha SAE
 *        ↓
 * pendente -> abrir ficha
 *
 * concluída -> confirmar finalização
 */
export function FinalizarOcorrenciaModal({
  visible,
  statusFicha,
  verificandoFicha,
  finalizando,
  error,
  onCancel,
  onOpenFicha,
  onConfirm,
}: FinalizarOcorrenciaModalProps) {
  const fichaConcluida =
    statusFicha === 'concluida';

  const fichaPendente =
    statusFicha ===
      'nao_iniciada' ||
    statusFicha ===
      'em_preenchimento';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={
        finalizando
          ? undefined
          : onCancel
      }
    >
      <View
        style={
          styles.overlay
        }
      >
        <View
          style={
            styles.modal
          }
        >
          {verificandoFicha ? (
            <View
              style={
                styles.loadingContainer
              }
            >
              <ActivityIndicator
                size="large"
                color={
                  Colors.primary
                }
              />

              <Text
                style={
                  styles.loadingTitle
                }
              >
                Verificando Ficha SAE
              </Text>

              <Text
                style={
                  styles.loadingText
                }
              >
                Confirmando se o atendimento
                possui uma ficha concluída.
              </Text>
            </View>
          ) : fichaPendente ? (
            <>
              <View
                style={
                  styles.warningIcon
                }
              >
                <Ionicons
                  name="document-text-outline"
                  size={32}
                  color={
                    Colors.primary
                  }
                />
              </View>

              <Text
                style={
                  styles.title
                }
              >
                A Ficha SAE já foi preenchida?
              </Text>

              <Text
                style={
                  styles.description
                }
              >
                O sistema ainda não identifica
                a Ficha SAE deste atendimento
                como concluída.
              </Text>

              <View
                style={
                  styles.statusBox
                }
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color={
                    Colors.primary
                  }
                />

                <Text
                  style={
                    styles.statusText
                  }
                >
                  {statusFicha ===
                  'em_preenchimento'
                    ? 'A ficha foi iniciada, mas ainda não foi concluída.'
                    : 'A ficha ainda não foi iniciada.'}
                </Text>
              </View>

              <Text
                style={
                  styles.helperText
                }
              >
                Para finalizar a ocorrência,
                conclua primeiro a Ficha SAE.
              </Text>

              <View
                style={
                  styles.actions
                }
              >
                <TouchableOpacity
                  style={
                    styles.cancelButton
                  }
                  onPress={
                    onCancel
                  }
                >
                  <Text
                    style={
                      styles.cancelText
                    }
                  >
                    Agora não
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    styles.primaryButton
                  }
                  onPress={
                    onOpenFicha
                  }
                >
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color={
                      Colors.background
                    }
                  />

                  <Text
                    style={
                      styles.primaryText
                    }
                  >
                    Ir para Ficha SAE
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : fichaConcluida ? (
            <>
              <View
                style={
                  styles.dangerIcon
                }
              >
                <Ionicons
                  name="flag-outline"
                  size={31}
                  color={
                    Colors.danger
                  }
                />
              </View>

              <Text
                style={
                  styles.title
                }
              >
                Finalizar ocorrência?
              </Text>

              <View
                style={
                  styles.completedBox
                }
              >
                <Ionicons
                  name="checkmark-circle"
                  size={19}
                  color={
                    Colors.success
                  }
                />

                <Text
                  style={
                    styles.completedText
                  }
                >
                  Ficha SAE concluída
                </Text>
              </View>

              <Text
                style={
                  styles.description
                }
              >
                Confirme apenas se o atendimento
                realmente foi encerrado.
              </Text>

              <Text
                style={
                  styles.finalWarning
                }
              >
                Após a finalização, esta ocorrência
                sairá dos atendimentos ativos e
                seguirá para o Histórico.
              </Text>

              {error ? (
                <View
                  style={
                    styles.errorBox
                  }
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color={
                      Colors.danger
                    }
                  />

                  <Text
                    style={
                      styles.errorText
                    }
                  >
                    {error}
                  </Text>
                </View>
              ) : null}

              <View
                style={
                  styles.actions
                }
              >
                <TouchableOpacity
                  style={
                    styles.cancelButton
                  }
                  onPress={
                    onCancel
                  }
                  disabled={
                    finalizando
                  }
                >
                  <Text
                    style={
                      styles.cancelText
                    }
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    styles.finishButton
                  }
                  onPress={
                    onConfirm
                  }
                  disabled={
                    finalizando
                  }
                >
                  {finalizando ? (
                    <>
                      <ActivityIndicator
                        size="small"
                        color={
                          Colors.background
                        }
                      />

                      <Text
                        style={
                          styles.finishText
                        }
                      >
                        Finalizando...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={18}
                        color={
                          Colors.background
                        }
                      />

                      <Text
                        style={
                          styles.finishText
                        }
                      >
                        Finalizar ocorrência
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text
                style={
                  styles.title
                }
              >
                Não foi possível verificar a ficha
              </Text>

              <Text
                style={
                  styles.description
                }
              >
                Tente novamente antes de finalizar
                esta ocorrência.
              </Text>

              <TouchableOpacity
                style={
                  styles.primaryButtonFull
                }
                onPress={
                  onCancel
                }
              >
                <Text
                  style={
                    styles.primaryText
                  }
                >
                  Voltar
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles =
  StyleSheet.create({
    overlay: {
      flex: 1,
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        'rgba(0,0,0,0.45)',
    },

    modal: {
      width: '100%',
      maxWidth: 420,
      padding: 22,
      backgroundColor:
        Colors.background,
      borderRadius: 20,
    },

    loadingContainer: {
      paddingVertical: 18,
      alignItems: 'center',
    },

    loadingTitle: {
      marginTop: 16,
      color:
        Colors.textStrong,
      fontSize: 18,
      fontWeight: '800',
    },

    loadingText: {
      marginTop: 7,
      color:
        Colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
      textAlign: 'center',
    },

    warningIcon: {
      width: 62,
      height: 62,
      marginBottom: 16,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.surfaceSecondary,
      borderRadius: 31,
    },

    dangerIcon: {
      width: 62,
      height: 62,
      marginBottom: 16,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.dangerSurface,
      borderRadius: 31,
    },

    title: {
      color:
        Colors.textStrong,
      fontSize: 20,
      fontWeight: '800',
      textAlign: 'center',
    },

    description: {
      marginTop: 9,
      color:
        Colors.textSecondary,
      fontSize: 13,
      lineHeight: 20,
      textAlign: 'center',
    },

    statusBox: {
      marginTop: 17,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      backgroundColor:
        Colors.surfaceSecondary,
      borderRadius: 10,
    },

    statusText: {
      flex: 1,
      color:
        Colors.textLabel,
      fontSize: 12,
      lineHeight: 17,
    },

    helperText: {
      marginTop: 12,
      color:
        Colors.textSecondary,
      fontSize: 11,
      textAlign: 'center',
    },

    completedBox: {
      marginTop: 16,
      padding: 11,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      backgroundColor:
        '#E8F5E9',
      borderRadius: 10,
    },

    completedText: {
      color:
        Colors.success,
      fontSize: 12,
      fontWeight: '800',
    },

    finalWarning: {
      marginTop: 12,
      color:
        Colors.textLabel,
      fontSize: 12,
      lineHeight: 18,
      textAlign: 'center',
    },

    errorBox: {
      marginTop: 15,
      padding: 11,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 7,
      backgroundColor:
        Colors.dangerSurface,
      borderRadius: 10,
    },

    errorText: {
      flex: 1,
      color:
        Colors.danger,
      fontSize: 11,
      lineHeight: 16,
    },

    actions: {
      marginTop: 22,
      flexDirection: 'row',
      gap: 9,
    },

    cancelButton: {
      flex: 1,
      minHeight: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.surfaceSecondary,
      borderRadius: 11,
    },

    cancelText: {
      color:
        Colors.textLabel,
      fontSize: 12,
      fontWeight: '700',
    },

    primaryButton: {
      flex: 1.4,
      minHeight: 50,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor:
        Colors.primary,
      borderRadius: 11,
    },

    primaryButtonFull: {
      minHeight: 50,
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primary,
      borderRadius: 11,
    },

    primaryText: {
      color:
        Colors.background,
      fontSize: 12,
      fontWeight: '800',
    },

    finishButton: {
      flex: 1.5,
      minHeight: 50,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor:
        Colors.danger,
      borderRadius: 11,
    },

    finishText: {
      color:
        Colors.background,
      fontSize: 12,
      fontWeight: '800',
    },
  });