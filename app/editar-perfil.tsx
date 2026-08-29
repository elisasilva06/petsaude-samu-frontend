import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import {
  useEffect,
  useState,
} from 'react';

import type {
  ReactNode,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  AREAS_ATUACAO,
} from '@/constants/areas-atuacao';

import { Colors } from '@/constants/theme';

import {
  usePerfil,
} from '@/features/perfil/context/PerfilContext';

/**
 * Tela de edição dos dados do profissional.
 *
 * Modelo atual:
 *
 * - profissão;
 * - conselho profissional;
 * - registro;
 * - UF;
 * - unidade;
 * - áreas de atuação.
 *
 * A tela conversa somente com PerfilContext.
 *
 * Hoje:
 *
 * Tela
 *  ↓
 * PerfilContext
 *  ↓
 * perfilMockService
 *
 * Futuramente:
 *
 * Tela
 *  ↓
 * PerfilContext
 *  ↓
 * perfilApiService
 */
export default function EditarPerfilScreen() {
  const {
    perfil,
    carregandoPerfil,
    atualizarPerfil,
    recarregarPerfil,
  } = usePerfil();

  const [
    nome,
    setNome,
  ] = useState('');

  const [
    email,
    setEmail,
  ] = useState('');

  const [
    cpf,
    setCpf,
  ] = useState('');

  const [
    telefone,
    setTelefone,
  ] = useState('');

  const [
    profissao,
    setProfissao,
  ] = useState('');

  const [
    conselho,
    setConselho,
  ] = useState('');

  const [
    registro,
    setRegistro,
  ] = useState('');

  const [
    uf,
    setUf,
  ] = useState('');

  const [
    unidade,
    setUnidade,
  ] = useState('');

  const [
    areasAtuacao,
    setAreasAtuacao,
  ] = useState<string[]>([]);

  const [
    salvando,
    setSalvando,
  ] = useState(false);

  const [
    salvo,
    setSalvo,
  ] = useState(false);

  /**
   * Preenche o formulário sempre que
   * o perfil carregado mudar.
   */
  useEffect(() => {
    if (!perfil) {
      return;
    }

    setNome(
      perfil.nome
    );

    setEmail(
      perfil.email
    );

    setCpf(
      perfil.cpf
    );

    setTelefone(
      perfil.telefone
    );

    setProfissao(
      perfil.profissao
    );

    setConselho(
      perfil.conselho
    );

    setRegistro(
      perfil.registro
    );

    setUf(
      perfil.uf
    );

    setUnidade(
      perfil.unidade
    );

    setAreasAtuacao([
      ...perfil.areasAtuacao,
    ]);
  }, [perfil]);

  function voltar() {
    router.back();
  }

  /**
   * Depois de qualquer alteração,
   * removemos a confirmação visual
   * de salvamento anterior.
   */
  function marcarComoAlterado() {
    setSalvo(false);
  }

  function alterarNome(
    valor: string
  ) {
    setNome(valor);
    marcarComoAlterado();
  }

  function alterarEmail(
    valor: string
  ) {
    setEmail(valor);
    marcarComoAlterado();
  }

  function alterarCpf(
    valor: string
  ) {
    setCpf(valor);
    marcarComoAlterado();
  }

  function alterarTelefone(
    valor: string
  ) {
    setTelefone(valor);
    marcarComoAlterado();
  }

  function alterarProfissao(
    valor: string
  ) {
    setProfissao(valor);
    marcarComoAlterado();
  }

  function alterarConselho(
    valor: string
  ) {
    setConselho(
      valor.toUpperCase()
    );

    marcarComoAlterado();
  }

  function alterarRegistro(
    valor: string
  ) {
    setRegistro(valor);
    marcarComoAlterado();
  }

  function alterarUf(
    valor: string
  ) {
    setUf(
      valor
        .toUpperCase()
        .slice(0, 2)
    );

    marcarComoAlterado();
  }

  function alterarUnidade(
    valor: string
  ) {
    setUnidade(valor);
    marcarComoAlterado();
  }

  function alternarAreaAtuacao(
    area: string
  ) {
    marcarComoAlterado();

    const selecionada =
      areasAtuacao.includes(
        area
      );

    if (selecionada) {
      setAreasAtuacao(
        areasAtuacao.filter(
          (item) =>
            item !== area
        )
      );

      return;
    }

    setAreasAtuacao([
      ...areasAtuacao,
      area,
    ]);
  }

  /**
   * Valida somente regras básicas
   * de formulário.
   *
   * TODO(BACKEND):
   * O servidor também deverá validar
   * todos os dados recebidos.
   */
  function validarFormulario() {
    if (
      nome.trim().length < 3
    ) {
      Alert.alert(
        'Nome inválido',
        'Informe o nome completo.'
      );

      return false;
    }

    if (
      !email.trim() ||
      !email.includes('@')
    ) {
      Alert.alert(
        'E-mail inválido',
        'Informe um endereço de e-mail válido.'
      );

      return false;
    }

    const cpfNumeros =
      cpf.replace(
        /\D/g,
        ''
      );

    if (
      cpfNumeros.length !== 11
    ) {
      Alert.alert(
        'CPF inválido',
        'Informe um CPF com 11 dígitos.'
      );

      return false;
    }

    const telefoneNumeros =
      telefone.replace(
        /\D/g,
        ''
      );

    if (
      telefoneNumeros.length < 10
    ) {
      Alert.alert(
        'Telefone inválido',
        'Informe um telefone válido.'
      );

      return false;
    }

    if (
      !profissao.trim()
    ) {
      Alert.alert(
        'Profissão obrigatória',
        'Informe sua profissão.'
      );

      return false;
    }

    if (
      !conselho.trim()
    ) {
      Alert.alert(
        'Conselho profissional',
        'Informe seu conselho profissional.'
      );

      return false;
    }

    if (
      !registro.trim()
    ) {
      Alert.alert(
        'Registro profissional',
        'Informe seu registro profissional.'
      );

      return false;
    }

    if (
      uf.trim().length !== 2
    ) {
      Alert.alert(
        'UF inválida',
        'Informe a UF com duas letras.'
      );

      return false;
    }

    if (
      !unidade.trim()
    ) {
      Alert.alert(
        'Unidade obrigatória',
        'Informe a unidade de atendimento.'
      );

      return false;
    }

    if (
      areasAtuacao.length === 0
    ) {
      Alert.alert(
        'Áreas de atuação',
        'Selecione pelo menos uma área de atuação.'
      );

      return false;
    }

    return true;
  }

  async function salvar() {
    if (
      !validarFormulario()
    ) {
      return;
    }

    try {
      setSalvando(true);
      setSalvo(false);

      /**
       * A tela não acessa mock ou API.
       *
       * O Context decide como os dados
       * serão persistidos.
       */
      await atualizarPerfil({
        nome:
          nome.trim(),

        email:
          email.trim(),

        cpf:
          cpf.trim(),

        telefone:
          telefone.trim(),

        profissao:
          profissao.trim(),

        conselho:
          conselho
            .trim()
            .toUpperCase(),

        registro:
          registro.trim(),

        uf:
          uf
            .trim()
            .toUpperCase(),

        unidade:
          unidade.trim(),

        areasAtuacao: [
          ...areasAtuacao,
        ],
      });

      setSalvo(true);
    } catch (error) {
      console.error(
        'Erro ao atualizar perfil:',
        error
      );

      Alert.alert(
        'Erro',
        'Não foi possível atualizar o perfil. Tente novamente.'
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregandoPerfil) {
    return (
      <SafeAreaView
        style={
          styles.container
        }
        edges={['top']}
      >
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
              styles.loadingText
            }
          >
            Carregando perfil...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!perfil) {
    return (
      <SafeAreaView
        style={
          styles.container
        }
        edges={['top']}
      >
        <View
          style={
            styles.errorContainer
          }
        >
          <View
            style={
              styles.errorIcon
            }
          >
            <Ionicons
              name="alert-circle-outline"
              size={32}
              color={
                Colors.danger
              }
            />
          </View>

          <Text
            style={
              styles.errorTitle
            }
          >
            Não foi possível carregar
            seu perfil
          </Text>

          <Text
            style={
              styles.errorDescription
            }
          >
            Tente carregar os dados
            novamente.
          </Text>

          <TouchableOpacity
            style={
              styles.retryButton
            }
            onPress={() => {
              void recarregarPerfil();
            }}
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

          <TouchableOpacity
            style={
              styles.backErrorButton
            }
            onPress={voltar}
            activeOpacity={0.8}
          >
            <Text
              style={
                styles.backErrorText
              }
            >
              Voltar
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={
        styles.container
      }
      edges={['top']}
    >
      {/* HEADER */}
      <View
        style={styles.header}
      >
        <TouchableOpacity
          style={
            styles.backButton
          }
          onPress={voltar}
          activeOpacity={0.8}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={
              Colors.text
            }
          />
        </TouchableOpacity>

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
            Editar Perfil
          </Text>

          <Text
            style={
              styles.headerSubtitle
            }
          >
            Atualize seus dados
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* PROFISSIONAL */}
        <View
          style={
            styles.avatarSection
          }
        >
          <View
            style={styles.avatar}
          >
            <Ionicons
              name="person"
              size={35}
              color={
                Colors.background
              }
            />
          </View>

          <Text
            style={
              styles.avatarName
            }
          >
            {nome ||
              'Profissional'}
          </Text>

          <Text
            style={
              styles.avatarRole
            }
          >
            {profissao ||
              perfil.profissao}
          </Text>

          <Text
            style={
              styles.avatarCouncil
            }
          >
            {conselho ||
              perfil.conselho}
            {' • '}
            {registro ||
              perfil.registro}
          </Text>
        </View>

        {/* DADOS PESSOAIS */}
        <Text
          style={
            styles.sectionTitle
          }
        >
          Dados pessoais
        </Text>

        <View
          style={styles.card}
        >
          <Field
            label="Nome completo"
            icon="person-outline"
          >
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={
                Colors.muted
              }
              value={nome}
              onChangeText={
                alterarNome
              }
              autoCapitalize="words"
              editable={!salvando}
            />
          </Field>

          <Field
            label="E-mail"
            icon="mail-outline"
          >
            <TextInput
              style={styles.input}
              placeholder="email@exemplo.com"
              placeholderTextColor={
                Colors.muted
              }
              value={email}
              onChangeText={
                alterarEmail
              }
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!salvando}
            />
          </Field>

          <Field
            label="CPF"
            icon="card-outline"
          >
            <TextInput
              style={styles.input}
              placeholder="000.000.000-00"
              placeholderTextColor={
                Colors.muted
              }
              value={cpf}
              onChangeText={
                alterarCpf
              }
              keyboardType="numeric"
              maxLength={14}
              editable={!salvando}
            />
          </Field>

          <Field
            label="Telefone"
            icon="call-outline"
            last
          >
            <TextInput
              style={styles.input}
              placeholder="(99) 99999-9999"
              placeholderTextColor={
                Colors.muted
              }
              value={telefone}
              onChangeText={
                alterarTelefone
              }
              keyboardType="phone-pad"
              maxLength={15}
              editable={!salvando}
            />
          </Field>
        </View>

        {/* DADOS PROFISSIONAIS */}
        <Text
          style={
            styles.sectionTitle
          }
        >
          Dados profissionais
        </Text>

        <View
          style={styles.card}
        >
          <Field
            label="Profissão"
            icon="briefcase-outline"
          >
            <TextInput
              style={styles.input}
              placeholder="Ex.: Enfermagem"
              placeholderTextColor={
                Colors.muted
              }
              value={profissao}
              onChangeText={
                alterarProfissao
              }
              autoCapitalize="words"
              editable={!salvando}
            />
          </Field>

          <Field
            label="Conselho profissional"
            icon="ribbon-outline"
          >
            <TextInput
              style={styles.input}
              placeholder="Ex.: COREN"
              placeholderTextColor={
                Colors.muted
              }
              value={conselho}
              onChangeText={
                alterarConselho
              }
              autoCapitalize="characters"
              editable={!salvando}
            />
          </Field>

          <Field
            label="Registro profissional"
            icon="medkit-outline"
          >
            <TextInput
              style={styles.input}
              placeholder="Número do registro"
              placeholderTextColor={
                Colors.muted
              }
              value={registro}
              onChangeText={
                alterarRegistro
              }
              editable={!salvando}
            />
          </Field>

          <Field
            label="UF"
            icon="map-outline"
          >
            <TextInput
              style={styles.input}
              placeholder="MA"
              placeholderTextColor={
                Colors.muted
              }
              value={uf}
              onChangeText={
                alterarUf
              }
              autoCapitalize="characters"
              maxLength={2}
              editable={!salvando}
            />
          </Field>

          <Field
            label="Unidade"
            icon="business-outline"
            last
          >
            <TextInput
              style={styles.input}
              placeholder="Unidade de atendimento"
              placeholderTextColor={
                Colors.muted
              }
              value={unidade}
              onChangeText={
                alterarUnidade
              }
              editable={!salvando}
            />
          </Field>
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
            styles.areasCard
          }
        >
          <Text
            style={
              styles.areasDescription
            }
          >
            Selecione uma ou mais áreas
            relacionadas à sua atuação
            profissional.
          </Text>

          <View
            style={
              styles.areas
            }
          >
            {AREAS_ATUACAO.map(
              (area) => {
                const selecionada =
                  areasAtuacao.includes(
                    area
                  );

                return (
                  <TouchableOpacity
                    key={area}
                    style={[
                      styles.areaButton,

                      selecionada &&
                        styles.areaButtonActive,
                    ]}
                    onPress={() =>
                      alternarAreaAtuacao(
                        area
                      )
                    }
                    disabled={
                      salvando
                    }
                    activeOpacity={
                      0.8
                    }
                  >
                    <Ionicons
                      name={
                        selecionada
                          ? 'checkmark-circle'
                          : 'medical-outline'
                      }
                      size={15}
                      color={
                        selecionada
                          ? Colors.background
                          : Colors.primary
                      }
                    />

                    <Text
                      style={[
                        styles.areaText,

                        selecionada &&
                          styles.areaTextActive,
                      ]}
                    >
                      {area}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>

          {areasAtuacao.length ===
          0 ? (
            <Text
              style={
                styles.warningText
              }
            >
              Selecione pelo menos uma
              área de atuação.
            </Text>
          ) : null}
        </View>

        {/* SUCESSO */}
        {salvo ? (
          <View
            style={
              styles.successCard
            }
          >
            <View
              style={
                styles.successIcon
              }
            >
              <Ionicons
                name="checkmark-circle"
                size={28}
                color={
                  Colors.success
                }
              />
            </View>

            <View
              style={
                styles.successContent
              }
            >
              <Text
                style={
                  styles.successTitle
                }
              >
                Alterações salvas
              </Text>

              <Text
                style={
                  styles.successDescription
                }
              >
                Seus dados foram atualizados
                com sucesso.
              </Text>
            </View>
          </View>
        ) : null}

        {/* SALVAR */}
        <TouchableOpacity
          style={[
            styles.saveButton,

            salvando &&
              styles.saveButtonDisabled,

            salvo &&
              styles.savedButton,
          ]}
          onPress={
            salvo
              ? voltar
              : () => {
                  void salvar();
                }
          }
          disabled={salvando}
          activeOpacity={0.85}
        >
          {salvando ? (
            <ActivityIndicator
              size="small"
              color={
                Colors.background
              }
            />
          ) : (
            <Ionicons
              name={
                salvo
                  ? 'arrow-back-outline'
                  : 'checkmark-outline'
              }
              size={21}
              color={
                Colors.background
              }
            />
          )}

          <Text
            style={
              styles.saveButtonText
            }
          >
            {salvando
              ? 'Salvando...'
              : salvo
                ? 'Voltar ao perfil'
                : 'Salvar alterações'}
          </Text>
        </TouchableOpacity>

        {/* CANCELAR */}
        {!salvo ? (
          <TouchableOpacity
            style={
              styles.cancelButton
            }
            onPress={voltar}
            disabled={salvando}
            activeOpacity={0.8}
          >
            <Text
              style={
                styles.cancelButtonText
              }
            >
              Cancelar
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

type FieldProps = {
  label: string;

  icon:
    keyof typeof Ionicons.glyphMap;

  children:
    ReactNode;

  last?: boolean;
};

function Field({
  label,
  icon,
  children,
  last = false,
}: FieldProps) {
  return (
    <View
      style={[
        styles.field,

        last &&
          styles.fieldLast,
      ]}
    >
      <View
        style={
          styles.fieldHeader
        }
      >
        <Ionicons
          name={icon}
          size={16}
          color={
            Colors.primary
          }
        />

        <Text
          style={
            styles.fieldLabel
          }
        >
          {label}
        </Text>
      </View>

      {children}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        Colors.surfaceMuted,
    },

    header: {
      minHeight: 66,
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

    headerText: {
      marginLeft: 5,
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
      lineHeight: 17,
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
      color:
        Colors.background,
      fontSize: 12,
      fontWeight: '800',
    },

    backErrorButton: {
      minHeight: 45,
      marginTop: 6,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },

    backErrorText: {
      color:
        Colors.textSecondary,
      fontSize: 12,
      fontWeight: '700',
    },

    avatarSection: {
      paddingVertical: 12,
      marginBottom: 14,
      alignItems: 'center',
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

    avatarName: {
      marginTop: 10,
      color: Colors.text,
      fontSize: 17,
      fontWeight: '800',
      textAlign: 'center',
    },

    avatarRole: {
      marginTop: 3,
      color:
        Colors.textSecondary,
      fontSize: 11,
      fontWeight: '700',
    },

    avatarCouncil: {
      marginTop: 2,
      color: Colors.muted,
      fontSize: 10,
    },

    sectionTitle: {
      marginTop: 7,
      marginBottom: 8,
      color:
        Colors.textLabel,
      fontSize: 11,
      fontWeight: '800',
      textTransform:
        'uppercase',
    },

    card: {
      paddingHorizontal: 15,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderRadius: 14,
    },

    field: {
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.surfaceSecondary,
    },

    fieldLast: {
      borderBottomWidth: 0,
    },

    fieldHeader: {
      marginBottom: 7,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    fieldLabel: {
      color:
        Colors.textLabel,
      fontSize: 11,
      fontWeight: '700',
    },

    input: {
      minHeight: 47,
      paddingHorizontal: 12,
      color: Colors.text,
      fontSize: 13,
      backgroundColor:
        Colors.surfaceMuted,
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderRadius: 10,
    },

    areasCard: {
      padding: 15,
      backgroundColor:
        Colors.background,
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderRadius: 14,
    },

    areasDescription: {
      marginBottom: 12,
      color:
        Colors.textSecondary,
      fontSize: 11,
      lineHeight: 16,
    },

    areas: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
    },

    areaButton: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor:
        Colors.surfaceSecondary,
      borderWidth: 1,
      borderColor:
        Colors.border,
      borderRadius: 18,
    },

    areaButtonActive: {
      backgroundColor:
        Colors.primary,
      borderColor:
        Colors.primary,
    },

    areaText: {
      color:
        Colors.primary,
      fontSize: 10,
      fontWeight: '700',
    },

    areaTextActive: {
      color:
        Colors.background,
    },

    warningText: {
      marginTop: 10,
      color:
        Colors.danger,
      fontSize: 10,
    },

    successCard: {
      marginTop: 20,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        '#E8F5E9',
      borderWidth: 1,
      borderColor:
        Colors.success,
      borderRadius: 14,
    },

    successIcon: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
    },

    successContent: {
      flex: 1,
      marginLeft: 8,
    },

    successTitle: {
      color:
        Colors.success,
      fontSize: 13,
      fontWeight: '800',
    },

    successDescription: {
      marginTop: 2,
      color:
        Colors.textSecondary,
      fontSize: 10,
    },

    saveButton: {
      minHeight: 52,
      marginTop: 22,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor:
        Colors.primary,
      borderRadius: 14,
    },

    saveButtonDisabled: {
      opacity: 0.6,
    },

    savedButton: {
      backgroundColor:
        Colors.success,
    },

    saveButtonText: {
      color:
        Colors.background,
      fontSize: 14,
      fontWeight: '800',
    },

    cancelButton: {
      minHeight: 48,
      marginTop: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cancelButtonText: {
      color:
        Colors.textSecondary,
      fontSize: 13,
      fontWeight: '700',
    },
  });