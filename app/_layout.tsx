import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { CadastroProvider } from '@/contexts/CadastroContext';

export default function RootLayout() {
  return (
    <CadastroProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>

      <StatusBar style="dark" />
    </CadastroProvider>
  );
}