import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useCadastro } from '@/contexts/CadastroContext';

const estados = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

export default function DadosProfissionaisScreen() {
  const {
    dadosProfissionais,
    atualizarDadosProfissionais,
  } = useCadastro();

  const [modalUfVisivel, setModalUfVisivel] =
    useState(false);

  const [camposTocados, setCamposTocados] =
    useState({
      crm: false,
      uf: false,
    });

  const crmValido =
    dadosProfissionais.crm.trim().length >= 4;

  const ufValida =
    dadosProfissionais.uf.trim().length === 2;

  const formularioValido =
    crmValido && ufValida;

  function marcarCampoComoTocado(
    campo: keyof typeof camposTocados,
  ) {
    setCamposTocados((atual) => ({
      ...atual,
      [campo]: true,
    }));
  }

  function selecionarUf(uf: string) {
    atualizarDadosProfissionais({ uf });

    setCamposTocados((atual) => ({
      ...atual,
      uf: true,
    }));

    setModalUfVisivel(false);
  }

  function handleContinuar() {
    if (!formularioValido) {
      return;
    }

    router.push('/cadastro/especialidades');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.replace(
              '/cadastro/dados-pessoais',
            )
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors.primary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Criar Conta
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.step}>
          Etapa 2 de 3
        </Text>

        <View style={styles.titleRow}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="medical-outline"
              size={24}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.title}>
            Dados Profissionais
          </Text>
        </View>

        <Text style={styles.description}>
          Informe seus dados profissionais para
          continuar o cadastro.
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressActive} />
          <View style={styles.progressActive} />
          <View style={styles.progressInactive} />
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            {/* CRM */}
            <View style={styles.crmContainer}>
              <Text style={styles.label}>
                CRM
              </Text>

              <TextInput
                style={[
                  styles.input,
                  camposTocados.crm &&
                    !crmValido &&
                    styles.inputError,
                ]}
                placeholder="Ex: 12345"
                placeholderTextColor={
                  Colors.muted
                }
                value={dadosProfissionais.crm}
                onChangeText={(crm) =>
                  atualizarDadosProfissionais({
                    crm,
                  })
                }
                onBlur={() =>
                  marcarCampoComoTocado('crm')
                }
                keyboardType="numeric"
              />

              {camposTocados.crm &&
                !crmValido && (
                  <Text style={styles.errorText}>
                    Digite um CRM válido.
                  </Text>
                )}
            </View>

            {/* UF */}
            <View style={styles.ufContainer}>
              <Text style={styles.label}>
                UF
              </Text>

              <TouchableOpacity
                style={[
                  styles.select,
                  camposTocados.uf &&
                    !ufValida &&
                    styles.inputError,
                ]}
                onPress={() => {
                  marcarCampoComoTocado('uf');
                  setModalUfVisivel(true);
                }}
              >
                <Text
                  style={[
                    styles.selectText,
                    !dadosProfissionais.uf &&
                      styles.placeholderText,
                  ]}
                >
                  {dadosProfissionais.uf ||
                    'UF'}
                </Text>

                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={Colors.muted}
                />
              </TouchableOpacity>

              {camposTocados.uf &&
                !ufValida && (
                  <Text style={styles.errorText}>
                    Selecione a UF.
                  </Text>
                )}
            </View>
          </View>

          {/* UNIDADE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Unidade de lotação
            </Text>

            <Text style={styles.optionalText}>
              Opcional
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: SAMU Caxias"
              placeholderTextColor={
                Colors.muted
              }
              value={
                dadosProfissionais.unidade
              }
              onChangeText={(unidade) =>
                atualizarDadosProfissionais({
                  unidade,
                })
              }
            />
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              !formularioValido &&
                styles.continueButtonDisabled,
            ]}
            onPress={handleContinuar}
            disabled={!formularioValido}
          >
            <Text
              style={
                styles.continueButtonText
              }
            >
              Próximo
            </Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color={Colors.background}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.previousButton}
          onPress={() =>
            router.replace(
              '/cadastro/dados-pessoais',
            )
          }
        >
          <Ionicons
            name="arrow-back"
            size={17}
            color={Colors.primary}
          />

          <Text style={styles.previousText}>
            Voltar para etapa anterior
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL UF */}
      <Modal
        visible={modalUfVisivel}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setModalUfVisivel(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Selecione a UF
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setModalUfVisivel(false)
                }
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={Colors.textStrong}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              {estados.map((estado) => (
                <TouchableOpacity
                  key={estado}
                  style={[
                    styles.ufOption,
                    dadosProfissionais.uf ===
                      estado &&
                      styles.ufOptionSelected,
                  ]}
                  onPress={() =>
                    selecionarUf(estado)
                  }
                >
                  <Text
                    style={[
                      styles.ufOptionText,
                      dadosProfissionais.uf ===
                        estado &&
                        styles.ufOptionTextSelected,
                    ]}
                  >
                    {estado}
                  </Text>

                  {dadosProfissionais.uf ===
                    estado && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={Colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    marginLeft: 8,
    color: Colors.textStrong,
    fontSize: 20,
    fontWeight: '700',
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  step: {
    marginTop: 12,
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  iconContainer: {
    width: 42,
    height: 42,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      Colors.surfaceSecondary,
    borderRadius: 12,
  },

  title: {
    color: Colors.textStrong,
    fontSize: 26,
    fontWeight: '700',
  },

  description: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },

  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
    marginBottom: 30,
  },

  progressActive: {
    flex: 1,
    height: 5,
    backgroundColor: Colors.primary,
    borderRadius: 999,
  },

  progressInactive: {
    flex: 1,
    height: 5,
    backgroundColor: Colors.border,
    borderRadius: 999,
  },

  form: {
    flex: 1,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },

  crmContainer: {
    flex: 2,
  },

  ufContainer: {
    flex: 1,
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    marginBottom: 7,
    color: Colors.textLabel,
    fontSize: 14,
    fontWeight: '600',
  },

  optionalText: {
    position: 'absolute',
    right: 0,
    top: 2,
    color: Colors.muted,
    fontSize: 12,
  },

  input: {
    height: 56,
    paddingHorizontal: 15,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    color: Colors.text,
    fontSize: 16,
  },

  inputError: {
    borderColor: Colors.danger,
  },

  errorText: {
    marginTop: 6,
    color: Colors.danger,
    fontSize: 12,
  },

  select: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },

  selectText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '500',
  },

  placeholderText: {
    color: Colors.muted,
  },

  continueButton: {
    width: '100%',
    minHeight: 56,
    marginTop: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },

  continueButtonDisabled: {
    backgroundColor: Colors.disabled,
  },

  continueButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
  },

  previousButton: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  previousText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  modalContent: {
    width: '100%',
    maxHeight: '70%',
    padding: 20,
    backgroundColor: Colors.background,
    borderRadius: 20,
  },

  modalHeader: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalTitle: {
    color: Colors.textStrong,
    fontSize: 20,
    fontWeight: '700',
  },

  ufOption: {
    minHeight: 52,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  ufOptionSelected: {
    backgroundColor:
      Colors.surfaceSecondary,
  },

  ufOptionText: {
    color: Colors.text,
    fontSize: 16,
  },

  ufOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
});