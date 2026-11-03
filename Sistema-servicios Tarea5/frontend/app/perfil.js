import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { api } from '../services/api';

export default function Perfil() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      const res = await api.get('/usuarios/perfil');
      const datos = res.data || res;
      setNombre(datos.nombre);
      setEmail(datos.email);
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo cargar la información del perfil');
    } finally {
      setLoading(false);
    }
  };

  const guardarCambios = async () => {
    if (!nombre.trim()) return Alert.alert('Error', 'El nombre no puede estar vacío');
    try {
      setGuardando(true);
      const res = await api.put('/usuarios/perfil', { nombre });
      const datos = res.data || res;
      setNombre(datos.nombre);
      Alert.alert('Éxito', 'Nombre actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
    } finally {
      setGuardando(false);
    }
  };

  const cerrarSesion = async () => {
    await AsyncStorage.multiRemove(['token', 'rol']);
    router.replace('/login');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnAtras} onPress={() => router.push('/')}>
        <Text style={styles.btnAtrasText}>← Volver al Menú</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Mi Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Correo Electrónico:</Text>
        <Text style={styles.emailText}>{email}</Text>

        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Escribe tu nombre"
        />

        <TouchableOpacity style={styles.btnGuardar} onPress={guardarCambios} disabled={guardando}>
          {guardando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnSalir} onPress={cerrarSesion}>
        <Text style={styles.btnText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 3, marginBottom: 25 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  emailText: { fontSize: 16, color: '#666', marginBottom: 20, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20, backgroundColor: '#fafafa' },
  btnAtras: { backgroundColor: '#6c757d', padding: 10, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 10 },
  btnAtrasText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  btnGuardar: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnSalir: { backgroundColor: '#dc3545', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});