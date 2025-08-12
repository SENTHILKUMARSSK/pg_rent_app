import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import { API_URL } from '../constants/config';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        alert('Password reset email sent!');
      } else {
        alert(data.message || 'Error sending email');
      }
    } catch {
      alert('Error connecting to server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        onChangeText={setEmail}
        value={email}
      />
      <Button title="Send Reset Link" onPress={handleForgotPassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  heading: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 },
});
