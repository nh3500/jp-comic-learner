import { StyleSheet, Text, View } from 'react-native';

export default function KanaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>50音</Text>
      <Text style={styles.subtitle}>平假名・片假名學習</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});
