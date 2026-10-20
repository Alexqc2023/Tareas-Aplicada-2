import { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { api } from '../services/api';

export default function Servicios() {
  const [servicios, setServicios] = useState([]);

  const [rol, setRol] = useState('');

  const [loading, setLoading] = useState(true);


  
  const [nombre, setNombre] = useState('');

  const [descripcion, setDescripcion] = useState('');

  const [duracion, setDuracion] = useState('');

  const [precio, setPrecio] = useState('');

  const [creando, setCreando] = useState(false);
  
  const [idEditando, setIdEditando] = useState(null); 

  useFocusEffect(
    useCallback(() => {
      verificarSesion();
    }, [])
  );

  const verificarSesion = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    const userRol = await AsyncStorage.getItem('rol');
    setRol(userRol);
    cargarServicios();
  };

  const cargarServicios = async () => {
    setLoading(true);
    try {
      const data = await api.getServicios();
      setServicios(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarServicio = async () => {
    if (!nombre || !descripcion || !duracion || !precio) return alert('Llena todos los campos');
    setCreando(true);
    try {
      if (idEditando) {
        
        await api.editarServicio(idEditando, { nombre, descripcion, duracion: Number(duracion), precio: Number(precio) });
      } else {
        
        await api.crearServicio({ nombre, descripcion, duracion: Number(duracion), precio: Number(precio) });
      }
      cancelarEdicion();
      cargarServicios();
    } catch (error) {
      alert(error.message);
    } finally {
      setCreando(false);
    }
  };

  const prepararEdicion = (item) => {
    setIdEditando(item.id);

    setNombre(item.nombre);

    setDescripcion(item.descripcion);

    setDuracion(item.duracion.toString());

    setPrecio(item.precio.toString());
  };

  const cancelarEdicion = () => {
    setIdEditando(null);

    setNombre('');

    setDescripcion('');

    setDuracion('');

    setPrecio('');
  };

  const handleEliminarServicio = (id, nombreServicio) => {
    Alert.alert(
      "Eliminar Servicio",
      `¿Estas seguro de que deseas eliminar "${nombreServicio}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              await api.eliminarServicio(id);
              cargarServicios();
            } catch (error) {
              alert(error.message);
            }
          }
        }
      ]
    );
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'rol']);
    router.replace('/login');
  };

  if (loading && servicios.length === 0) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.title}>Servicios Disponibles</Text>

        <Button title="Cerrar Sesion" color="red" onPress={logout} />

      </View>

      {rol === 'admin' && (
        <View style={styles.adminBox}>
          <Text style={styles.adminTitle}>{idEditando ? "Editar Servicio" : "Crear Nuevo Servicio"} (Solo Admin)</Text>

          <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />

          <TextInput style={styles.input} placeholder="Descripcion" value={descripcion} onChangeText={setDescripcion} />

          <TextInput style={styles.input} placeholder="Duracion (minutos)" value={duracion} onChangeText={setDuracion} keyboardType="numeric" />

          <TextInput style={styles.input} placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
          
          {creando ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.buttonRow}>
              <View style={{ flex: 1, marginRight: idEditando ? 10 : 0 }}>
                <Button 
                  title={idEditando ? "Guardar Cambios" : "Agregar Servicio"} 
                  onPress={handleGuardarServicio} 
                  color={idEditando ? "#28a745" : "#007bff"} 
                />
              </View>
              {idEditando && (
                <View style={{ flex: 1 }}>
                  <Button title="Cancelar" onPress={cancelarEdicion} color="gray" />
                </View>
              )}
            </View>
          )}
        </View>
      )}

      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={cargarServicios}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              {rol === 'admin' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity onPress={() => prepararEdicion(item)}>
                    <Text style={styles.editText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleEliminarServicio(item.id, item.nombre)}>
                    <Text style={styles.deleteText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <Text>{item.descripcion}</Text>
            <Text style={styles.details}>Duracion: {item.duracion} min | Precio: ${item.precio}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No hay servicios registrados.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 20 },

  title: { fontSize: 20, fontWeight: 'bold' },

  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 2 },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },

  cardTitle: { fontSize: 18, fontWeight: 'bold', flex: 1 },

  actionButtons: { flexDirection: 'row' },

  editText: { color: 'blue', fontWeight: 'bold', marginRight: 15 },

  deleteText: { color: 'red', fontWeight: 'bold' },

  details: { color: 'green', marginTop: 5, fontWeight: 'bold' },

  adminBox: { backgroundColor: '#e8f4f8', padding: 15, borderRadius: 8, marginBottom: 20 },

  adminTitle: { fontWeight: 'bold', marginBottom: 10 },

  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 },

  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' }
});