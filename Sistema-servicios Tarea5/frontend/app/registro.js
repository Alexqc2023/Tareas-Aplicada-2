import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { router, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';

export default function Registro() {
  const [nombre, setNombre] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const handleRegistro = async () => {
    if (!nombre || !email || !password) return setError('Llena todos los campos');
    setLoading(true);
    setError('');
    try {
      await api.registro({
        nombre,
        email,
        password,
        rol: isAdmin ? 'admin' : 'cliente'
      });
      alert('Cuenta creada exitosamente. Por favor, inicia sesion.');
      router.replace('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.mainContainer}
    >
      
      <View style={styles.topGraphic}>
        <Ionicons name="person-circle-outline" size={80} color="#fff" />
        <Text style={styles.welcomeText}>Bienvenido.</Text>
        <Text style={styles.subtitleText}>Crea tu cuenta para continuar</Text>
      </View>

      
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Registrarse</Text>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Nombre completo" 
            value={nombre} 
            onChangeText={setNombre} 
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Correo electronico" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address" 
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Contrasena" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Cuenta de Administrador</Text>
          <Switch 
            trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
            thumbColor={isAdmin ? "#1E3A8A" : "#f4f3f4"}
            value={isAdmin} 
            onValueChange={setIsAdmin} 
          />
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color="#1E3A8A" style={{ marginTop: 10 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleRegistro}>
            <Text style={styles.buttonText}>REGISTRARSE</Text>
          </TouchableOpacity>
        )}
        
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.linkContainer}>
            <Text style={styles.linkText}>¿Ya tienes cuenta? <Text style={styles.linkTextBold}>Inicia sesion</Text></Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1E3A8A', 
  },
  topGraphic: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    letterSpacing: 1,
  },
  subtitleText: {
    color: '#E0E7FF',
    fontSize: 15,
    marginTop: 5,
  },
  formContainer: {
    flex: 0.65,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 55,
    backgroundColor: '#F9FAFB',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  switchText: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#1E3A8A',
    height: 55,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  linkContainer: {
    marginTop: 25,
    alignItems: 'center',
    padding: 10,
  },
  linkText: {
    color: '#6B7280',
    fontSize: 14,
  },
  linkTextBold: {
    color: '#1E3A8A',
    fontWeight: 'bold',
  },
  error: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  }
});