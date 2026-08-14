import { StyleSheet, Text, View } from 'react-native';

export default function TarefasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#003049',
  },
});