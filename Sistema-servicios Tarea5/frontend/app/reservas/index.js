import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { api } from '../../services/api';

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      
      const response = await api.get('/reservas/mis-reservas');
      setReservas(response.data || []);
    } catch (error) {
      
      Alert.alert('Error detallado', error.message || 'Hubo un fallo de conexion');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarReservas();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Servicio: {item.servicio?.nombre || 'Servicio eliminado'}</Text>

      <Text style={styles.info}>Fecha: {item.fecha}</Text>

      <Text style={styles.info}>Hora: {item.hora}</Text>

      <Text style={styles.status}>Estado: {item.estado}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Reservas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>Aún no tienes reservas.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },

  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },

  card: { padding: 15, borderRadius: 10, backgroundColor: '#fff', marginBottom: 15, elevation: 3 },

  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },

  info: { fontSize: 16, marginBottom: 5, color: '#555' },

  status: { fontSize: 16, fontWeight: 'bold', color: '#28a745', marginTop: 5 },
  
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#777' }
});