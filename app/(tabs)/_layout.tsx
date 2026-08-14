import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name="ocorrencias"
        options={{
          title: 'Ocorrências',
        }}
      />

      <Tabs.Screen
        name="tarefas"
        options={{
          title: 'Tarefas',
        }}
      />

      <Tabs.Screen
        name="historico"
        options={{
          title: 'Histórico',
        }}
      />

      <Tabs.Screen
        name="mensagens"
        options={{
          title: 'Mensagens',
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}