import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Button, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api';

export default function TareasScreen() {
  const router = useRouter();

  const [tareas, setTareas] = useState([]);

  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {

      obtenerTareas();
      
    }, [])
  );

  const obtenerTareas = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login' as any);
        return;
      }
      const data = await api.getTareas(token);
      setTareas(Array.isArray(data) ? data : (data as any).tareas || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/login' as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tareas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={tareas}
          keyExtractor={(item: any, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={({ item }: any) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.titulo || item.descripcion || 'Sin titulo'}</Text>
            </View>
          )}
          style={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No hay tareas registradas</Text>}
        />
      )}
      <View style={{ marginTop: 20 }}>
        <Button title="Cerrar Sesion" color="#ff4444" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 50 },

  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },

  list: { width: '100%' },

  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#f9f9f9', marginBottom: 5, borderRadius: 5 },


  itemText: { fontSize: 18 },

  empty: { textAlign: 'center', marginTop: 20, color: '#666', fontSize: 16 }
});