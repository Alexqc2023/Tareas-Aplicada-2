import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { api } from '../../services/api';
import { cancelarRecordatorioReserva } from '../../services/notificaciones';

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reservas/mis-reservas');
      setReservas(response.data || response || []);
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudieron cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarReservas();
    }, [])
  );

  const handleCancelar = (id) => {
    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro de que deseas cancelar esta reserva?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/reservas/${id}`);
              await cancelarRecordatorioReserva(id);
              Alert.alert('Cancelada', 'La reserva y su recordatorio fueron cancelados');
              cargarReservas();
            } catch (error) {
              Alert.alert('Error', error.message || 'No se pudo cancelar la reserva');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Servicio: {item.servicio?.nombre || 'Servicio eliminado'}</Text>
      <Text style={styles.info}>Fecha: {item.fecha}</Text>
      <Text style={styles.info}>Hora: {item.hora}</Text>
      <Text style={styles.status}>Estado: {item.estado}</Text>

      {item.estado === 'pendiente' && (
        <TouchableOpacity style={styles.btnCancelar} onPress={() => handleCancelar(item.id)}>
          <Text style={styles.btnCancelarText}>Cancelar Reserva</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnAtras} onPress={() => router.push('/')}>
        <Text style={styles.btnAtrasText}>← Volver al Menú</Text>
      </TouchableOpacity>

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
  btnAtras: { backgroundColor: '#6c757d', padding: 10, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 10 },
  btnAtrasText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { padding: 15, borderRadius: 10, backgroundColor: '#fff', marginBottom: 15, elevation: 3 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  info: { fontSize: 16, marginBottom: 5, color: '#555' },
  status: { fontSize: 16, fontWeight: 'bold', color: '#28a745', marginTop: 5 },
  btnCancelar: { marginTop: 12, backgroundColor: '#dc3545', padding: 10, borderRadius: 6, alignItems: 'center' },
  btnCancelarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#777' }
});