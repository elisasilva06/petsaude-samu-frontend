import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
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

export default function DadosPessoaisScreen() {
    const {
        dadosPessoais,
        atualizarDadosPessoais,
    } = useCadastro();

    const [camposTocados, setCamposTocados] = useState({
        nome: false,
        email: false,
        cpf: false,
        telefone: false,
    });

    // -------------------------
    // Validações
    // -------------------------

    const nomeValido =
        dadosPessoais.nome.trim().length >= 3;

    const emailValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            dadosPessoais.email.trim(),
        );

    const cpfNumeros =
        dadosPessoais.cpf.replace(/\D/g, '');

    const cpfValido =
        cpfNumeros.length === 11;

    const telefoneNumeros =
        dadosPessoais.telefone.replace(/\D/g, '');

    const telefoneValido =
        telefoneNumeros.length >= 10 &&
        telefoneNumeros.length <= 11;

    const formularioValido =
        nomeValido &&
        emailValido &&
        cpfValido &&
        telefoneValido;

    function marcarCampoComoTocado(
        campo: keyof typeof camposTocados,
    ) {
        setCamposTocados((atual) => ({
            ...atual,
            [campo]: true,
        }));
    }

    function handleContinuar() {
        if (!formularioValido) {
            return;
        }

        router.push('/cadastro/dados-profissionais');
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace('/')}
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
                    Etapa 1 de 3
                </Text>

                <Text style={styles.title}>
                    Dados Pessoais
                </Text>

                <Text style={styles.description}>
                    Informe seus dados pessoais para iniciar o cadastro.
                </Text>

                <View style={styles.progressContainer}>
                    <View style={styles.progressActive} />
                    <View style={styles.progressInactive} />
                    <View style={styles.progressInactive} />
                </View>

                <View style={styles.form}>
                    {/* NOME */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Nome completo
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                camposTocados.nome &&
                                !nomeValido &&
                                styles.inputError,
                            ]}
                            placeholder="Digite seu nome completo"
                            placeholderTextColor={Colors.muted}
                            value={dadosPessoais.nome}
                            onChangeText={(nome) =>
                                atualizarDadosPessoais({ nome })
                            }
                            onBlur={() =>
                                marcarCampoComoTocado('nome')
                            }
                            autoCapitalize="words"
                        />

                        {camposTocados.nome && !nomeValido && (
                            <Text style={styles.errorText}>
                                Digite um nome válido com pelo menos 3 caracteres.
                            </Text>
                        )}
                    </View>

                    {/* EMAIL */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Email
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                camposTocados.email &&
                                !emailValido &&
                                styles.inputError,
                            ]}
                            placeholder="seu.email@exemplo.com"
                            placeholderTextColor={Colors.muted}
                            value={dadosPessoais.email}
                            onChangeText={(email) =>
                                atualizarDadosPessoais({ email })
                            }
                            onBlur={() =>
                                marcarCampoComoTocado('email')
                            }
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        {camposTocados.email && !emailValido && (
                            <Text style={styles.errorText}>
                                Digite um e-mail válido.
                            </Text>
                        )}
                    </View>

                    {/* CPF */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            CPF
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                camposTocados.cpf &&
                                !cpfValido &&
                                styles.inputError,
                            ]}
                            placeholder="000.000.000-00"
                            placeholderTextColor={Colors.muted}
                            value={dadosPessoais.cpf}
                            onChangeText={(cpf) =>
                                atualizarDadosPessoais({ cpf })
                            }
                            onBlur={() =>
                                marcarCampoComoTocado('cpf')
                            }
                            keyboardType="numeric"
                            maxLength={14}
                        />

                        {camposTocados.cpf && !cpfValido && (
                            <Text style={styles.errorText}>
                                O CPF deve possuir 11 dígitos.
                            </Text>
                        )}
                    </View>

                    {/* TELEFONE */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Telefone
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                camposTocados.telefone &&
                                !telefoneValido &&
                                styles.inputError,
                            ]}
                            placeholder="(99) 99999-9999"
                            placeholderTextColor={Colors.muted}
                            value={dadosPessoais.telefone}
                            onChangeText={(telefone) =>
                                atualizarDadosPessoais({ telefone })
                            }
                            onBlur={() =>
                                marcarCampoComoTocado('telefone')
                            }
                            keyboardType="phone-pad"
                            maxLength={15}
                        />

                        {camposTocados.telefone &&
                            !telefoneValido && (
                                <Text style={styles.errorText}>
                                    Digite um telefone válido com DDD.
                                </Text>
                            )}
                    </View>

                    {/* CONTINUAR */}
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            !formularioValido &&
                            styles.continueButtonDisabled,
                        ]}
                        onPress={handleContinuar}
                        disabled={!formularioValido}
                    >
                        <Text style={styles.continueButtonText}>
                            Continuar
                        </Text>

                        <Ionicons
                            name="arrow-forward"
                            size={20}
                            color={Colors.background}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.loginLink}
                    onPress={() => router.replace('/')}
                >
                    <Text style={styles.loginLinkText}>
                        Já possui uma conta?{' '}
                        <Text style={styles.loginLinkStrong}>
                            Entrar
                        </Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
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

    title: {
        marginTop: 8,
        color: Colors.textStrong,
        fontSize: 27,
        fontWeight: '700',
    },

    description: {
        marginTop: 8,
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

    inputGroup: {
        marginBottom: 18,
    },

    label: {
        marginBottom: 7,
        color: Colors.textLabel,
        fontSize: 14,
        fontWeight: '600',
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
        fontSize: 13,
        lineHeight: 18,
    },

    continueButton: {
        width: '100%',
        minHeight: 56,
        marginTop: 10,
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

    loginLink: {
        marginTop: 30,
        alignItems: 'center',
    },

    loginLinkText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },

    loginLinkStrong: {
        color: Colors.primary,
        fontWeight: '700',
    },
});