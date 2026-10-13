import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://aplicada2-iterables-alexis-queza-production.up.railway.app';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Ingresa email y contrasena');
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || data.error || 'Credenciales incorrectas');

      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
      }
      
      router.replace('/(tabs)' as any); 
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Iniciar Sesion</Text>
      
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

      <TextInput style={styles.input} placeholder="Contrasena" value={password} onChangeText={setPassword} secureTextEntry />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <Button title="Ingresar" onPress={handleLogin} />
      )}

      <Link href={"/registro" as any} style={styles.link}>¿No tienes cuenta? Registrate</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },

  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },

  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 5 },

  link: { marginTop: 20, textAlign: 'center', color: '#007BFF', fontWeight: 'bold' }
});