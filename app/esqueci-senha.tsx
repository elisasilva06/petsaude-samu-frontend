import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';

type EtapaRecuperacao = 'email' | 'enviado';

export default function EsqueciSenhaScreen() {
    const [email, setEmail] = useState('');
    const [etapa, setEtapa] = useState<EtapaRecuperacao>('email');
    const [erro, setErro] = useState('');

    function handleEnviar() {
        if (!email.trim() || !email.includes('@')) {
            setErro('Por favor, insira um e-mail válido.');
            return;
        }

        setErro('');

        // Temporário.
        // Quando integrarmos o backend, essa mudança de etapa
        // acontecerá somente após uma resposta de sucesso da API.
        setEtapa('enviado');
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={Colors.primary}
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Recuperar senha
                </Text>
            </View>

            <View style={styles.content}>
                {etapa === 'email' ? (
                    <>
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name="mail-outline"
                                size={42}
                                color={Colors.primary}
                            />
                        </View>

                        <Text style={styles.title}>
                            Esqueceu sua senha?
                        </Text>

                        <Text style={styles.description}>
                            Informe o e-mail associado à sua conta para receber as instruções
                            de recuperação da senha.
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>

                            <TextInput
                                style={[
                                    styles.input,
                                    erro ? styles.inputError : undefined,
                                ]}
                                placeholder="seu.email@exemplo.com"
                                placeholderTextColor={Colors.muted}
                                value={email}
                                onChangeText={(value) => {
                                    setEmail(value);

                                    if (erro) {
                                        setErro('');
                                    }
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            {erro ? (
                                <Text style={styles.errorText}>
                                    {erro}
                                </Text>
                            ) : null}
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleEnviar}
                        >
                            <Text style={styles.buttonText}>
                                Enviar Link
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.successContainer}>
                        <View style={styles.successIconContainer}>
                            <Ionicons
                                name="checkmark"
                                size={46}
                                color={Colors.background}
                            />
                        </View>

                        <Text style={styles.successTitle}>
                            E-mail Enviado!
                        </Text>

                        <Text style={styles.successDescription}>
                            Enviamos as instruções para:
                        </Text>

                        <Text style={styles.successEmail}>
                            {email}
                        </Text>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => router.push('/nova-senha')}
                        >
                            <Text style={styles.buttonText}>
                                Criar Nova Senha
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={() => router.replace('/')}
                        >
                            <Text style={styles.loginButtonText}>
                                Voltar para o Login
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
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
        paddingBottom: 20,
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
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },

    iconContainer: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surfaceSecondary,
        borderRadius: 40,
    },

    title: {
        marginTop: 28,
        color: Colors.textStrong,
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
    },

    description: {
        marginTop: 12,
        marginBottom: 32,
        color: Colors.textSecondary,
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
    },

    inputGroup: {
        marginBottom: 20,
    },

    label: {
        marginBottom: 6,
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
    },

    button: {
        width: '100%',
        minHeight: 56,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 12,
    },

    buttonText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: '700',
    },

    successContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
    },

    successIconContainer: {
        width: 90,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.success,
        borderRadius: 45,
    },

    successTitle: {
        marginTop: 24,
        color: Colors.success,
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center',
    },

    successDescription: {
        marginTop: 18,
        color: Colors.textSecondary,
        fontSize: 15,
        textAlign: 'center',
    },

    successEmail: {
        marginTop: 5,
        marginBottom: 38,
        color: Colors.textStrong,
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },

    loginButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },

    loginButtonText: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '700',
    },
});