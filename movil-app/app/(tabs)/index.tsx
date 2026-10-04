import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const [texto, setTexto] = useState('');

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Alexis Quezada</Text>
      <Text style={styles.subtitle}>Matricula: 2023-0458</Text>

      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Escribe en este lugar "
          value={texto}
          onChangeText={setTexto}
        />
        <Button
          title="Mostrar Texto"
          onPress={() => Alert.alert('Ingresaste:', texto)}
        />
      </View>

      
      <Button
        title="Ir a la Lista"
        onPress={() => router.push('/two')}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#666',
  },
  form: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});