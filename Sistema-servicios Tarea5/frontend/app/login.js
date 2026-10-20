import { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Link } from 'expo-router';
import { api } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return setError('Llena todos los campos');
    setLoading(true);
    setError('');
    try {
      const res = await api.login({ email, password });
      await AsyncStorage.setItem('token', res.token);
      await AsyncStorage.setItem('rol', res.usuario.rol);
      router.replace('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesion</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <TextInput style={styles.input} placeholder="Correo electronico" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Contrasena" value={password} onChangeText={setPassword} secureTextEntry />
      
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <Button title="Ingresar" onPress={handleLogin} />}
      
      <Link href="/registro" style={styles.link}>¿No tienes cuenta? Registrate aqui</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },

  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },

  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },

  error: { color: 'red', marginBottom: 15, textAlign: 'center' },

  link: { marginTop: 20, color: 'blue', textAlign: 'center' }
});