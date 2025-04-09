import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null); // estado para el rol

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      const role = await AsyncStorage.getItem('userRole');
      
      if (!token) {
        router.replace('/'); // redirige al login si no hay token
      } else {
        setUserRole(role); // guardar el rol en el estado
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userRole');
    router.replace('/');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bienvenido</Text>

      {userRole === 'admin' && (
        <Button
          title="Registrar nuevo usuario"
          onPress={() => router.push('/RegisterUser')}
        />
      )}

      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}
