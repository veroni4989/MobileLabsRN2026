import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

export default function ProfileScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [firstName, setFirstName] = React.useState('');

  const handleRegister = () => {
    if (!email || !password || !confirmPassword || !lastName || !firstName) {
      Alert.alert('Помилка', 'Будь ласка, заповніть усі поля.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Помилка', 'Паролі не збігаються.');
      return;
    }
    Alert.alert('Успіх', 'Реєстрацію успішно завершено!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Реєстрація</Text>
      <Text style={styles.label}>Електронна пошта</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Text style={styles.label}>Пароль</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <Text style={styles.label}>Пароль (ще раз)</Text>
      <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      <Text style={styles.label}>Прізвище</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
      <Text style={styles.label}>Ім'я</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Зареєструватися</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 14, color: '#333', marginBottom: 4, marginTop: 12 },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 6, fontSize: 15, color: '#000' },
  button: { backgroundColor: '#007AFF', borderRadius: 6, paddingVertical: 14, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
