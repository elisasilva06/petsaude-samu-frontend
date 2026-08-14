import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';

import { Colors } from '@/constants/theme';

export default function LoginScreen() {
    const { height: screenHeight } = useWindowDimensions();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);

    function handleLogin() {
        // Temporário.
        // Depois será substituído pela autenticação real da API.
        router.replace('/home');
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style="light" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <View
                    style={[
                        styles.topSection,
                        { height: screenHeight * 0.25 },
                    ]}
                >
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/images/samu-logo.png')}
                            style={styles.logo}
                        />
                    </View>

                    <Text style={styles.location}>
                        Caxias - Maranhão
                    </Text>
                </View>

                <View
                    style={[
                        styles.loginCard,
                        { minHeight: screenHeight * 0.75 },
                    ]}
                >
                    <Text style={styles.title}>
                        Equipe Multidisciplinar
                    </Text>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="seu.email@exemplo.com"
                                placeholderTextColor={Colors.muted}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Senha</Text>

                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Digite sua senha"
                                    placeholderTextColor={Colors.muted}
                                    value={senha}
                                    onChangeText={setSenha}
                                    secureTextEntry={!mostrarSenha}
                                />

                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setMostrarSenha((current) => !current)}
                                >
                                    <Ionicons
                                        name={
                                            mostrarSenha
                                                ? 'eye-outline'
                                                : 'eye-off-outline'
                                        }
                                        size={22}
                                        color={Colors.muted}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                        >
                            <Text style={styles.loginButtonText}>
                                Entrar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/esqueci-senha')}
                        >
                            <Text style={styles.forgotPassword}>
                                Esqueci minha senha
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.line} />

                            <Text style={styles.dividerText}>
                                ou
                            </Text>

                            <View style={styles.line} />
                        </View>

                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={() => router.push('/cadastro/dados-pessoais')}
                        >
                            <Text style={styles.registerButtonText}>
                                Criar nova conta
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            Acesso restrito a profissionais autorizados
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },

    scrollContent: {
        flexGrow: 1,
    },

    topSection: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
    },

    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
    },

    logo: {
        width: 75,
        height: 75,
        resizeMode: 'contain',
    },

    location: {
        marginTop: 8,
        color: Colors.background,
        fontSize: 13,
        fontWeight: '500',
    },

    loginCard: {
        paddingTop: 30,
        paddingBottom: 30,
        paddingHorizontal: '7%',
        backgroundColor: Colors.surfaceMuted,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },

    title: {
        marginBottom: 28,
        color: Colors.textStrong,
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
    },

    form: {
        flex: 1,
    },

    inputGroup: {
        marginBottom: 15,
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

    passwordContainer: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
    },

    passwordInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 15,
        color: Colors.text,
        fontSize: 16,
    },

    eyeButton: {
        paddingHorizontal: 15,
    },

    loginButton: {
        height: 56,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryDark,
        borderRadius: 12,
    },

    loginButtonText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: '700',
    },

    forgotPassword: {
        marginTop: 15,
        color: Colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
    },

    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },

    dividerText: {
        marginHorizontal: 10,
        color: Colors.muted,
        fontSize: 12,
    },

    registerButton: {
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surfaceSecondary,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
    },

    registerButtonText: {
        color: Colors.textLabel,
        fontSize: 15,
        fontWeight: '600',
    },

    infoBox: {
        marginTop: 'auto',
        paddingTop: 20,
    },

    infoText: {
        color: Colors.muted,
        fontSize: 11,
        textAlign: 'center',
    },
});