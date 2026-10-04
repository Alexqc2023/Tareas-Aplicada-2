import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { useRouter } from 'expo-router';


const datos = [
  { id: '1', nombre: 'Sancocho' },

  { id: '2', nombre: 'Mondongo' },

  { id: '3', nombre: 'Mofongo' },

  { id: '4', nombre: 'Yaroa' },

  { id: '5', nombre: 'Mariscada' },
];

export default function TwoScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comidas Favoritas</Text>
      
    
      <FlatList
        data={datos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.nombre}</Text>
          </View>
        )}
        style={styles.list}
      />

      
      <Button
        title="Volver al Home"
        onPress={() => router.push('/')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    width: '100%',
    marginBottom: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 18,
  },
});