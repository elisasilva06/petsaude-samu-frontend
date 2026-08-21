import { Ionicons } from '@expo/vector-icons';
import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import { useMemo, useState } from 'react';

import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

import { criarConversaMock } from '@/features/mensagens/mocks';
import { Mensagem } from '@/features/mensagens/types';

export default function MensagensScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const conversaInicial = useMemo(
    () => criarConversaMock(id ?? '1'),
    [id]
  );

  const [mensagens, setMensagens] =
    useState<Mensagem[]>(
      conversaInicial.mensagens
    );

  const [novaMensagem, setNovaMensagem] =
    useState('');

  function voltar() {
    router.back();
  }

  function enviarMensagem() {
    const texto = novaMensagem.trim();

    if (!texto) {
      return;
    }

    const agora = new Date();

    const horario = agora.toLocaleTimeString(
      'pt-BR',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    );

    const mensagem: Mensagem = {
      id: Date.now().toString(),
      autor: 'profissional',
      nomeAutor: 'Dr. Carlos Eduardo',
      texto,
      horario,
    };

    setMensagens((mensagensAtuais) => [
      ...mensagensAtuais,
      mensagem,
    ]);

    setNovaMensagem('');
  }

  function renderMensagem({
    item,
  }: {
    item: Mensagem;
  }) {
    const enviadaPorProfissional =
      item.autor === 'profissional';

    return (
      <View
        style={[
          styles.messageWrapper,
          enviadaPorProfissional
            ? styles.messageWrapperRight
            : styles.messageWrapperLeft,
        ]}
      >
        {!enviadaPorProfissional && (
          <Text style={styles.author}>
            {item.nomeAutor}
          </Text>
        )}

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

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
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

          <View style={styles.headerCenter}>
            <View style={styles.avatar}>
              <Ionicons
                name="chatbubbles-outline"
                size={20}
                color={Colors.background}
              />
            </View>

            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>
                Central SAMU
              </Text>

              <Text style={styles.headerSubtitle}>
                Ocorrência #{id ?? '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* DADOS DA OCORRÊNCIA */}
        <View style={styles.occurrenceCard}>
          <View>
            <Text style={styles.occurrenceLabel}>
              Paciente
            </Text>

            <Text style={styles.occurrencePatient}>
              {conversaInicial.paciente}
            </Text>
          </View>

          <View style={styles.occurrenceBadge}>
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
              #{id ?? '-'}
            </Text>
          </View>
        </View>

        {/* LISTA DE MENSAGENS */}
        <FlatList
          data={mensagens}
          keyExtractor={(item) => item.id}
          renderItem={renderMensagem}
          style={styles.messagesList}
          contentContainerStyle={
            styles.messagesContent
          }
          showsVerticalScrollIndicator={false}
        />

        {/* CAMPO DE ENVIO */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Digite uma mensagem..."
              placeholderTextColor={
                Colors.muted
              }
              value={novaMensagem}
              onChangeText={setNovaMensagem}
              multiline
            />

            <TouchableOpacity
              style={[
                styles.sendButton,

                !novaMensagem.trim() &&
                  styles.sendButtonDisabled,
              ]}
              disabled={!novaMensagem.trim()}
              onPress={enviarMensagem}
            >
              <Ionicons
                name="send"
                size={19}
                color={Colors.background}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.mockWarning}>
            Conversa temporária no frontend
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceMuted,
  },

  keyboardContainer: {
    flex: 1,
  },

  // HEADER
  header: {
    minHeight: 68,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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

  avatar: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 19,
  },

  headerText: {
    marginLeft: 10,
  },

  headerTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },

  headerSubtitle: {
    marginTop: 2,
    color: Colors.textSecondary,
    fontSize: 11,
  },

  // OCORRÊNCIA
  occurrenceCard: {
    marginHorizontal: 14,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },

  occurrenceLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },

  occurrencePatient: {
    marginTop: 2,
    color: Colors.text,
    fontSize: 13,
    fontWeight: '700',
  },

  occurrenceBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 15,
  },

  occurrenceBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
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

  messageWrapper: {
    maxWidth: '82%',
    marginBottom: 13,
  },

  messageWrapperLeft: {
    alignSelf: 'flex-start',
  },

  messageWrapperRight: {
    alignSelf: 'flex-end',
  },

  author: {
    marginBottom: 4,
    marginLeft: 4,
    color: Colors.textSecondary,
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
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopLeftRadius: 4,
  },

  professionalBubble: {
    backgroundColor: Colors.primary,
    borderTopRightRadius: 4,
  },

  messageText: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 19,
  },

  professionalMessageText: {
    color: Colors.background,
  },

  messageTime: {
    marginTop: 5,
    color: Colors.textSecondary,
    fontSize: 9,
    textAlign: 'right',
  },

  professionalMessageTime: {
    color: Colors.textOnPrimaryMuted,
  },

  // INPUT
  inputContainer: {
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 10,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  inputWrapper: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 24,
  },

  input: {
    flex: 1,
    maxHeight: 110,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 11,
    color: Colors.text,
    fontSize: 13,
  },

  sendButton: {
    width: 40,
    height: 40,
    marginRight: 4,
    marginBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },

  sendButtonDisabled: {
    backgroundColor: Colors.disabled,
  },

  mockWarning: {
    marginTop: 5,
    color: Colors.muted,
    fontSize: 9,
    textAlign: 'center',
  },
});