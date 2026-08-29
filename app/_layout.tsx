import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { CadastroProvider } from '@/contexts/CadastroContext';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { PerfilProvider } from '@/features/perfil/context/PerfilContext';

/**
 * Layout raiz da aplicação.
 *
 * Este arquivo envolve todas as rotas com os providers globais
 * necessários para compartilhar estados entre diferentes telas.
 *
 * Providers atuais:
 *
 * - AuthProvider:
 *   controla a sessão do usuário, login e logout.
 *
 * - CadastroProvider:
 *   mantém temporariamente os dados preenchidos durante
 *   as etapas do cadastro.
 *
 * - PerfilProvider:
 *   disponibiliza os dados do perfil profissional para
 *   as telas que precisam consultá-los ou atualizá-los.
 *
 * IMPORTANTE:
 * Os providers não devem acessar mocks diretamente.
 * Eles devem utilizar a camada de services.
 *
 * Hoje:
 * Context -> Service -> Mock
 *
 * Futuramente:
 * Context -> Service -> API
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <CadastroProvider>
        <PerfilProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            {/*
             * Não é necessário registrar manualmente todas as rotas.
             * O Expo Router identifica os arquivos dentro de app/
             * automaticamente.
             *
             * Mantemos aqui somente os principais grupos/rotas
             * quando houver necessidade de configuração específica.
             */}
            <Stack.Screen name="index" />

            <Stack.Screen name="(tabs)" />
          </Stack>

          <StatusBar style="dark" />
        </PerfilProvider>
      </CadastroProvider>
    </AuthProvider>
  );
}