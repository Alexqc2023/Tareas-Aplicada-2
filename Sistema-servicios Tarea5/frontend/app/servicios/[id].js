import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function DetalleServicio() {
  const router = useRouter();
  
  const { id, nombre, descripcion, precio, duracion } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{nombre}</Text>
      <Text style={styles.desc}>{descripcion}</Text>
      <Text style={styles.info}>Duración: {duracion} min</Text>
      <Text style={styles.info}>Precio: ${precio}</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push({ pathname: '/reservas/nueva', params: { servicioId: id, nombreServicio: nombre } })}
      >
        <Text style={styles.buttonText}>Reservar este servicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  desc: { fontSize: 16, color: '#666', marginBottom: 20 },
  info: { fontSize: 18, marginBottom: 10 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});