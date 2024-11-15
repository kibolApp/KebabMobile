import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import AxiosClient from '../AxiosClient';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../contexts/AuthContext';

export default function Login({toggleForm}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await AxiosClient.post('/login', {email, password});
      const {token, user} = response.data;

      await login(user, token);

      Alert.alert('Sukces', `Witaj ${user.name}!`);
      navigation.navigate('WelcomePage');
    } catch (error) {
      console.error(
        'Error during login:',
        error.response?.data || error.message,
      );
      const message =
        error.response?.data?.message || 'Wystąpił problem z logowaniem';
      Alert.alert('Błąd', message);
    }
  };

  return (
    <View className="flex-1 justify-center p-5">
      <View className="bg-white rounded-lg p-8 shadow-lg">
        <Text className="text-2xl font-bold text-center mb-5">Logowanie</Text>
        <TextInput
          className="p-3 border border-gray-300 rounded mb-4"
          placeholder="Adres E-mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="p-3 border border-gray-300 rounded mb-4"
          placeholder="Hasło"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          className="bg-button-green py-3 mb-4 w-full items-center"
          onPress={handleLogin}>
          <Text className="text-lg font-bold text-white uppercase">
            Zaloguj się
          </Text>
        </TouchableOpacity>
        <Text className="text-center mt-4">
          Nie posiadasz konta?{' '}
          <Text onPress={toggleForm} className="text-green-700 underline">
            Zarejestruj się.
          </Text>
        </Text>
      </View>
    </View>
  );
}
