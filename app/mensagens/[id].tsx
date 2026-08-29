import { Ionicons } from '@expo/vector-icons';

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import {
  useCallback,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
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

import {
  mensagensService,
} from '@/features/mensagens/services';

import type {
  ConversaMensagens,
} from '@/features/mensagens/services';

import type {
  Mensagem,
} from '@/features/mensagens/types';

import {
  usePerfil,
} from '@/features/perfil/context/PerfilContext';

/**
 * Conversa relacionada exclusivamente
 * a uma ocorrência.
 *
 * A tela não cria ou persiste mensagens
 * diretamente.
 *
 * Fluxo:
 *
 * MensagensScreen
 *       ↓
 * mensagensService
 *       ↓
 * mock hoje
 *       ↓
 * API / realtime futuramente
 */
export default function MensagensScreen() {
  const params =
    useLocalSearchParams<{
      id: string | string[];
    }>();

  const id =
    Array.isArray(params.id)
      ? params.id[0]
      : params.id;

  const {
    perfil,
  } = usePerfil();

  const listaRef =
    useRef<FlatList<Mensagem>>(
      null
    );

  const [
    conversa,
    setConversa,
  ] =
    useState<ConversaMensagens | null>(
      null
    );

  const [
    novaMensagem,
    setNovaMensagem,
  ] = useState('');

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    enviando,
    setEnviando,
  ] = useState(false);

  const [
    erro,
    setErro,
  ] = useState('');

  /**
   * Carrega simultaneamente:
   *
   * - situação da ocorrência;
   * - conversa correspondente.
   *
   * Isso impede que a tela de mensagens
   * seja usada para uma ocorrência que
   * não esteja em atendimento.
   */
  const carregarConversa =
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
          chamado,
          conversaResultado,
        ] = await Promise.all([
          chamadosService.buscarChamado(
            id
          ),

          mensagensService.buscarConversa(
            id
          ),
        ]);

        if (
          chamado.status !==
          'em_atendimento'
        ) {
          setConversa(null);

          setErro(
            'As mensagens estão disponíveis somente durante um atendimento em andamento.'
          );

          return;
        }

        setConversa(
          conversaResultado
        );
      } catch (error) {
        console.error(
          'Erro ao carregar conversa:',
          error
        );

        setConversa(null);

        setErro(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar as mensagens.'
        );
      } finally {
        setCarregando(false);
      }
    }, [id]);

  /**
   * Recarrega a conversa sempre que
   * a tela recebe foco.
   *
   * Isso também será útil quando a API
   * ou atualização em tempo real existir.
   */
  useFocusEffect(
    useCallback(() => {
      void carregarConversa();
    }, [carregarConversa])
  );

  function voltar() {
    router.back();
  }

  /**
   * Envia uma nova mensagem através
   * do service.
   *
   * A mensagem só aparece na tela depois
   * que o service confirma o envio.
   */
  async function enviarMensagem() {
    const texto =
      novaMensagem.trim();

    if (
      !id ||
      !texto ||
      enviando ||
      !conversa
    ) {
      return;
    }

    try {
      setEnviando(true);
      setErro('');

      const mensagem =
        await mensagensService.enviarMensagem(
          {
            chamadoId: id,

            texto,

            /**
             * O nome agora vem do perfil
             * carregado pelo aplicativo.
             *
             * Não presumimos título profissional,
             * como "Dr." ou "Dra.".
             */
            nomeAutor:
              perfil?.nome ??
              'Profissional da equipe',
          }
        );

      setConversa(
        (conversaAtual) => {
          if (!conversaAtual) {
            return conversaAtual;
          }

          return {
            ...conversaAtual,

            mensagens: [
              ...conversaAtual.mensagens,
              mensagem,
            ],
          };
        }
      );

      setNovaMensagem('');

      /**
       * Aguarda a lista receber o novo item
       * antes de rolar para o final.
       */
      requestAnimationFrame(
        () => {
          listaRef.current?.scrollToEnd(
            {
              animated: true,
            }
          );
        }
      );
    } catch (error) {
      console.error(
        'Erro ao enviar mensagem:',
        error
      );

      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível enviar a mensagem.'
      );
    } finally {
      setEnviando(false);
    }
  }

  function renderMensagem({
    item,
  }: {
    item: Mensagem;
  }) {
    const enviadaPorProfissional =
      item.autor ===
      'profissional';

    return (
      <View
        style={[
          styles.messageWrapper,

          enviadaPorProfissional
            ? styles.messageWrapperRight
            : styles.messageWrapperLeft,
        ]}
      >
        {!enviadaPorProfissional ? (
          <Text
            style={styles.author}
          >
            {item.nomeAutor}
          </Text>
        ) : null}

        <View
          style={[
            styles.messageBubble,

            enviadaPorProfissional
              ? styles.professionalBubble
              : styles.centralBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,

              enviadaPorProfissional &&
                styles.professionalMessageText,
            ]}
          >
            {item.texto}
          </Text>

          <Text
            style={[
              styles.messageTime,

              enviadaPorProfissional &&
                styles.professionalMessageTime,
            ]}
          >
            {item.horario}
          </Text>
        </View>
      </View>
    );
  }

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
            Carregando mensagens...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!conversa) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}
      >
        <View
          style={styles.header}
        >
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

          <Text
            style={
              styles.headerErrorTitle
            }
          >
            Mensagens
          </Text>
        </View>

        <View
          style={
            styles.errorContainer
          }
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={42}
            color={Colors.muted}
          />

          <Text
            style={
              styles.errorTitle
            }
          >
            Conversa indisponível
          </Text>

          <Text
            style={
              styles.errorText
            }
          >
            {erro ||
              'Não foi possível acessar esta conversa.'}
          </Text>

          <TouchableOpacity
            style={
              styles.backOccurrenceButton
            }
            onPress={voltar}
          >
            <Text
              style={
                styles.backOccurrenceText
              }
            >
              Voltar para ocorrência
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const podeEnviar =
    Boolean(
      novaMensagem.trim()
    ) && !enviando;

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <KeyboardAvoidingView
        style={
          styles.keyboardContainer
        }
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
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
              styles.headerCenter
            }
          >
            <View
              style={styles.avatar}
            >
              <Ionicons
                name="chatbubbles-outline"
                size={20}
                color={
                  Colors.background
                }
              />
            </View>

            <View
              style={
                styles.headerText
              }
            >
              <Text
                style={
                  styles.headerTitle
                }
              >
                Central SAMU
              </Text>

              <Text
                style={
                  styles.headerSubtitle
                }
              >
                Ocorrência #{id}
              </Text>
            </View>
          </View>
        </View>

        {/* OCORRÊNCIA */}
        <View
          style={
            styles.occurrenceCard
          }
        >
          <View>
            <Text
              style={
                styles.occurrenceLabel
              }
            >
              Paciente
            </Text>

            <Text
              style={
                styles.occurrencePatient
              }
            >
              {conversa.paciente}
            </Text>
          </View>

          <View
            style={
              styles.occurrenceBadge
            }
          >
            <Ionicons
              name="medical-outline"
              size={15}
              color={Colors.primary}
            />

            <Text
              style={
                styles.occurrenceBadgeText
              }
            >
              #{id}
            </Text>
          </View>
        </View>

        {/* ERRO DE ENVIO */}
        {erro ? (
          <View
            style={
              styles.inlineError
            }
          >
            <Ionicons
              name="alert-circle-outline"
              size={17}
              color={Colors.danger}
            />

            <Text
              style={
                styles.inlineErrorText
              }
            >
              {erro}
            </Text>
          </View>
        ) : null}

        {/* MENSAGENS */}
        <FlatList
          ref={listaRef}
          data={
            conversa.mensagens
          }
          keyExtractor={(
            item
          ) => item.id}
          renderItem={
            renderMensagem
          }
          style={
            styles.messagesList
          }
          contentContainerStyle={[
            styles.messagesContent,

            conversa.mensagens
              .length === 0 &&
              styles.emptyMessagesContent,
          ]}
          showsVerticalScrollIndicator={
            false
          }
          onContentSizeChange={() => {
            if (
              conversa.mensagens
                .length > 0
            ) {
              listaRef.current?.scrollToEnd(
                {
                  animated: false,
                }
              );
            }
          }}
          ListEmptyComponent={
            <View
              style={
                styles.emptyMessages
              }
            >
              <Ionicons
                name="chatbubble-outline"
                size={34}
                color={Colors.muted}
              />

              <Text
                style={
                  styles.emptyMessagesTitle
                }
              >
                Nenhuma mensagem
              </Text>

              <Text
                style={
                  styles.emptyMessagesText
                }
              >
                A conversa desta ocorrência
                ainda não possui mensagens.
              </Text>
            </View>
          }
        />

        {/* ENVIO */}
        <View
          style={
            styles.inputContainer
          }
        >
          <View
            style={
              styles.inputWrapper
            }
          >
            <TextInput
              style={styles.input}
              placeholder="Digite uma mensagem..."
              placeholderTextColor={
                Colors.muted
              }
              value={novaMensagem}
              onChangeText={
                setNovaMensagem
              }
              editable={!enviando}
              multiline
              maxLength={2000}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,

                !podeEnviar &&
                  styles.sendButtonDisabled,
              ]}
              disabled={
                !podeEnviar
              }
              onPress={() => {
                void enviarMensagem();
              }}
            >
              {enviando ? (
                <ActivityIndicator
                  size="small"
                  color={
                    Colors.background
                  }
                />
              ) : (
                <Ionicons
                  name="send"
                  size={19}
                  color={
                    Colors.background
                  }
                />
              )}
            </TouchableOpacity>
          </View>

          <Text
            style={
              styles.helperText
            }
          >
            Conversa vinculada à ocorrência #{id}
          </Text>
        </View>
      </KeyboardAvoidingView>
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

    keyboardContainer: {
      flex: 1,
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

    // HEADER
    header: {
      minHeight: 68,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        Colors.background,
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border,
    },

    backButton: {
      width: 42,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerCenter: {
      flex: 1,
      marginLeft: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },

    headerText: {
      marginLeft: 10,
    },

    headerTitle: {
      color:
        Colors.text,
      fontSize: 15,
      fontWeight: '800',
    },

    headerSubtitle: {
      marginTop: 2,
      color:
        Colors.textSecondary,
      fontSize: 11,
    },

    headerErrorTitle: {
      color:
        Colors.text,
      fontSize: 16,
      fontWeight: '800',
    },

    avatar: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primary,
      borderRadius: 19,
    },

    // ERRO PRINCIPAL
    errorContainer: {
      flex: 1,
      paddingHorizontal: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },

    errorTitle: {
      marginTop: 12,
      color:
        Colors.text,
      fontSize: 17,
      fontWeight: '800',
    },

    errorText: {
      marginTop: 7,
      color:
        Colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
      textAlign: 'center',
    },

    backOccurrenceButton: {
      minHeight: 48,
      marginTop: 20,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primary,
      borderRadius: 12,
    },

    backOccurrenceText: {
      color:
        Colors.background,
      fontSize: 12,
      fontWeight: '800',
    },

    // OCORRÊNCIA
    occurrenceCard: {
      marginHorizontal: 14,
      marginTop: 12,
      paddingHorizontal: 14,
      paddingVertical: 11,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderRadius: 12,
    },

    occurrenceLabel: {
      color:
        Colors.textSecondary,
      fontSize: 10,
      fontWeight: '600',
    },

    occurrencePatient: {
      marginTop: 2,
      color:
        Colors.text,
      fontSize: 13,
      fontWeight: '700',
    },

    occurrenceBadge: {
      paddingHorizontal: 9,
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor:
        Colors.surfaceSecondary,
      borderRadius: 15,
    },

    occurrenceBadgeText: {
      color:
        Colors.primary,
      fontSize: 10,
      fontWeight: '800',
    },

    inlineError: {
      marginHorizontal: 14,
      marginTop: 10,
      padding: 10,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 7,
      backgroundColor:
        Colors.dangerSurface,
      borderRadius: 10,
    },

    inlineErrorText: {
      flex: 1,
      color:
        Colors.danger,
      fontSize: 11,
      lineHeight: 16,
    },

    // MENSAGENS
    messagesList: {
      flex: 1,
    },

    messagesContent: {
      paddingHorizontal: 14,
      paddingTop: 18,
      paddingBottom: 16,
    },

    emptyMessagesContent: {
      flexGrow: 1,
    },

    emptyMessages: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },

    emptyMessagesTitle: {
      marginTop: 10,
      color:
        Colors.text,
      fontSize: 14,
      fontWeight: '800',
    },

    emptyMessagesText: {
      maxWidth: 260,
      marginTop: 5,
      color:
        Colors.textSecondary,
      fontSize: 11,
      lineHeight: 17,
      textAlign: 'center',
    },

    messageWrapper: {
      maxWidth: '82%',
      marginBottom: 13,
    },

    messageWrapperLeft: {
      alignSelf:
        'flex-start',
    },

    messageWrapperRight: {
      alignSelf: 'flex-end',
    },

    author: {
      marginBottom: 4,
      marginLeft: 4,
      color:
        Colors.textSecondary,
      fontSize: 10,
      fontWeight: '600',
    },

    messageBubble: {
      paddingHorizontal: 13,
      paddingTop: 10,
      paddingBottom: 7,
      borderRadius: 14,
    },

    centralBubble: {
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderTopLeftRadius: 4,
    },

    professionalBubble: {
      backgroundColor:
        Colors.primary,
      borderTopRightRadius: 4,
    },

    messageText: {
      color:
        Colors.text,
      fontSize: 13,
      lineHeight: 19,
    },

    professionalMessageText: {
      color:
        Colors.background,
    },

    messageTime: {
      marginTop: 5,
      color:
        Colors.textSecondary,
      fontSize: 9,
      textAlign: 'right',
    },

    professionalMessageTime: {
      color:
        Colors.textOnPrimaryMuted,
    },

    // INPUT
    inputContainer: {
      paddingHorizontal: 12,
      paddingTop: 9,
      paddingBottom: 10,
      backgroundColor:
        Colors.background,
      borderTopWidth: 1,
      borderTopColor:
        Colors.border,
    },

    inputWrapper: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor:
        Colors.surfaceMuted,
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderRadius: 24,
    },

    input: {
      flex: 1,
      maxHeight: 110,
      paddingHorizontal: 15,
      paddingTop: 12,
      paddingBottom: 11,
      color:
        Colors.text,
      fontSize: 13,
    },

    sendButton: {
      width: 40,
      height: 40,
      marginRight: 4,
      marginBottom: 3,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        Colors.primary,
      borderRadius: 20,
    },

    sendButtonDisabled: {
      backgroundColor:
        Colors.disabled,
    },

    helperText: {
      marginTop: 5,
      color:
        Colors.muted,
      fontSize: 9,
      textAlign: 'center',
    },
  });