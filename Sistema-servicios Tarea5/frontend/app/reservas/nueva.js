import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { api } from '../../services/api'; 

export default function NuevaReserva() {
  const router = useRouter();
  const { servicioId, nombreServicio } = useLocalSearchParams();
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [loading, setLoading] = useState(false);

  const reservar = async () => {
    if (!fecha || !hora) return Alert.alert('Error', 'Completa la fecha y la hora');
    setLoading(true);
    try {
      await api.post('/reservas', { servicioId, fecha, hora });
      Alert.alert('Éxito', 'Reserva creada exitosamente');
      router.push('/reservas'); 
    } catch (error) {
      // Ahora sí te mostrará el motivo real del error
      Alert.alert('Error', error.message || 'No se pudo crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservar: {nombreServicio}</Text>
      
      <Text style={styles.label}>Fecha (Día-Mes-Año):</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ej: 25-10-2026" 
        value={fecha} 
        onChangeText={setFecha} 
      />
      
      <Text style={styles.label}>Hora (12 Horas con AM/PM):</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ej: 03:30 PM" 
        value={hora} 
        onChangeText={setHora} 
      />

      <TouchableOpacity style={styles.button} onPress={reservar} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Confirmar Reserva</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 20, borderRadius: 5, fontSize: 16 },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});