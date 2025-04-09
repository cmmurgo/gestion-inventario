import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Button } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/'); // redirige al login si no hay token
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bienvenido</Text>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}
