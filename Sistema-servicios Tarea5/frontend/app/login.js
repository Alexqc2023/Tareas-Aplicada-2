import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

 const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Completa todos los campos');
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      const datos = res.data || res;
      
      await AsyncStorage.setItem('token', datos.token);
      
     
      const rolUsuario = datos.rol || datos.role || datos.usuario?.rol || 'cliente';
      await AsyncStorage.setItem('rol', String(rolUsuario));
      
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient 
      colors={['#b27a9b', '#79709e', '#415a99', '#2e4575']} 
      style={styles.container}
    >
      <View style={styles.card}>
        
        
        <View style={styles.avatarContainer}>
          <Ionicons name="person-outline" size={40} color="#fff" />
        </View>

        
        <View style={styles.inputContainer}>
          <View style={styles.iconBox}>
            <Ionicons name="person" size={20} color="#fff" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email ID"
            placeholderTextColor="#a0b0c0"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        
        <View style={styles.inputContainer}>
          <View style={styles.iconBox}>
            <Ionicons name="lock-closed" size={20} color="#fff" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#a0b0c0"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        
        <View style={styles.optionsRow}>
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setRememberMe(!rememberMe)}
          >
            <Ionicons 
              name={rememberMe ? "checkbox" : "square-outline"} 
              size={18} 
              color="#1a2b4c" 
            />
            <Text style={styles.optionText}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/registro')}>
            <Text style={styles.registerText}>Regístrate aquí</Text>
          </TouchableOpacity>
        </View>

        {/* Botón Login */}
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1a2b4c" />
          ) : (
            <Text style={styles.loginButtonText}>LOGIN</Text>
          )}
        </TouchableOpacity>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#dce2ec',
    borderRadius: 15,
    paddingTop: 60,
    paddingBottom: 25,
    alignItems: 'center',
    position: 'relative',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  avatarContainer: {
    position: 'absolute',
    top: -45,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#12233f',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#dce2ec',
  },
  inputContainer: {
    flexDirection: 'row',
    width: '85%',
    height: 50,
    marginTop: 15,
    borderRadius: 5,
    overflow: 'hidden',
  },
  iconBox: {
    width: 50,
    backgroundColor: '#12233f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#2b3f5c',
    color: '#ffffff',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: 20,
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    color: '#556379',
    marginLeft: 5,
    fontSize: 13,
  },
  registerText: {
    color: '#556379',
    fontSize: 13,
    fontStyle: 'italic',
  },
  loginButton: {
    marginTop: 35,
    width: '85%',
    height: 50,
    backgroundColor: '#cbd4e1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loginButtonText: {
    color: '#1a2b4c',
    fontWeight: 'bold',
    letterSpacing: 1.5,
    fontSize: 16,
  }
});