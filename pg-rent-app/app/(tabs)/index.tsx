import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { API_URL } from '../../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.owner_id) {
          await AsyncStorage.setItem('owner_id', String(data.owner_id));
        }
        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
        }
        alert('Login Successful');
        router.push('./dashboard');
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch {
      alert('Error connecting to server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome..!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push('./register')}
      >
        <Text style={styles.buttonText}>Create a New Account</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push('./forgot-password')}
      >
        <Text style={styles.buttonText}>Forgot Password?</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center', backgroundColor: '#f8f9fa' },
  heading: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2600ffff',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
