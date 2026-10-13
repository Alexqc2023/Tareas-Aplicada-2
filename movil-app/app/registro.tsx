import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { api } from '../services/api'; 

export default function RegistroScreen() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [rol, setRol] = useState('user');
  
  const [loading, setLoading] = useState(false);

  const handleRegistro = async () => {
    if (!nombre || !email || !password) return Alert.alert('Error', 'Llena todos los campos');
    setLoading(true);
    
    try {
      await api.registro({ nombre, email, password, rol });
      Alert.alert('exito', 'Registro completado');
      router.replace('/login' as any);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />

      <TextInput style={styles.input} placeholder="Contrasena" value={password} onChangeText={setPassword} secureTextEntry />

      <TextInput style={styles.input} placeholder="Rol" value={rol} onChangeText={setRol} autoCapitalize="none" />

      {loading ? <ActivityIndicator size="large" /> : <Button title="Registrarse" onPress={handleRegistro} />}

      <Link href={"/login" as any} style={styles.link}>¿Ya tienes cuenta? Inicia sesion</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },

  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },

  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 5 },

  link: { marginTop: 20, textAlign: 'center', color: '#007BFF', fontWeight: 'bold' }
});