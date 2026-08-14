import { StyleSheet, Text, View } from 'react-native';

export default function OcorrenciasScreen() {
  return (
    <View style={styles.container}>
      <Text>Ocorrências</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});