import { View, TextInput, Button, Text, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { width } = useWindowDimensions();

  const handleLogin = async () => {
    setErrorMessage('');
    try {
      const response = await axios.post('http://192.168.100.9:3000/api/auth/login', {
        email,
        password,
      });

      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        router.replace('/HomeScreen');
      } else {
        setErrorMessage('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage('Usuario o contraseña incorrectos');
      } else {
        setErrorMessage('Error al conectar con el servidor');
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', // ⬅️ centrado en horizontal
        padding: 20,
        backgroundColor: '#f5f5f5',
      }}
    >
      <View
        style={{
          width: width > 600 ? 400 : '100%', // ⬅️ si la pantalla es ancha (web), usa 400px
        }}
      >
        <TextInput
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          style={{
            borderWidth: 1,
            marginBottom: 10,
            padding: 8,
            backgroundColor: 'white',
            borderRadius: 5,
          }}
        />
        <TextInput
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          style={{
            borderWidth: 1,
            marginBottom: 10,
            padding: 8,
            backgroundColor: 'white',
            borderRadius: 5,
          }}
        />
        {errorMessage !== '' && (
          <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>
        )}
        <Button title="Iniciar sesión" onPress={handleLogin} />
      </View>
    </View>
  );
}
