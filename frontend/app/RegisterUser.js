import { View, TextInput, Button, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function RegisterUser() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // valor por defecto
  const [errorMessage, setErrorMessage] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      const role = await AsyncStorage.getItem('userRole');
      
      if (!token) {
        router.replace('/');
      } else {
        setUserRole(role);
        if (role !== 'admin') {
          router.replace('/HomeScreen');
        }
      }
    };

    checkAuth();
  }, []);

  const handleRegister = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.post(
            'http://192.168.100.9:3000/api/auth/register',
            {
              email,
              password,
              role,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

      console.log(response.data); // éxito
    } catch (error) {
      console.error(error);
      setErrorMessage('Error al registrar usuario');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={{ borderWidth: 1, marginBottom: 10 }}
      >
        <Picker.Item label="Usuario" value="user" />
        <Picker.Item label="Administrador" value="admin" />
      </Picker>

      {errorMessage !== '' && (
        <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>
      )}
      <Button title="Registrar usuario" onPress={handleRegister} />
    </View>
  );
}
