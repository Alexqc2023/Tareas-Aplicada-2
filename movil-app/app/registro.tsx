import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';


const API_URL = 'https://aplicada2-iterables-alexis-queza-production.up.railway.app';

export default function RegistroScreen() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [rol, setRol] = useState('user');
  
  const [loading, setLoading] = useState(false);

  const handleRegistro = async () => {
    if (!nombre || !email || !password) {
      return Alert.alert('Error', 'Por favor llena todos los campos obligatorios');
    }
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, rol }),
      });
      
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || data.error || 'Error al registrarse');

      Alert.alert('Exito', 'Registro completado. Ahora inicia sesion.');
      router.replace('/login' as any); 
    } catch (error: any) {
      Alert.alert('Error de registro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

      <TextInput style={styles.input} placeholder="Contrasena" value={password} onChangeText={setPassword} secureTextEntry />

      <TextInput style={styles.input} placeholder="Rol (Ej: user o admin)" value={rol} onChangeText={setRol} autoCapitalize="none" />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <Button title="Registrarse" onPress={handleRegistro} />
      )}

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