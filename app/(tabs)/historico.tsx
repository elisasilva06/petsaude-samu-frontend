import { StyleSheet, Text, View } from 'react-native';

export default function HistoricoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
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