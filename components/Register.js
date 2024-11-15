import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import AxiosClient from '../AxiosClient';

export default function Register({toggleForm}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleRegister = async () => {
    try {
      await AxiosClient.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      Alert.alert('Sukces', 'Rejestracja zakończona pomyślnie');
      toggleForm();
    } catch (error) {
      const message = 'Wystąpił problem z rejestracją';
      Alert.alert('Błąd', message);
    }
  };

  return (
    <View className="flex-1 justify-center p-5">
      <View className="bg-white rounded-lg p-8 shadow-lg">
        <Text className="text-2xl font-bold text-center mb-5">Rejestracja</Text>
        <TextInput
          className="p-3 border border-gray-300 rounded mb-4"
          placeholder="Nazwa użytkownika"
          value={name}
          onChangeText={setName}
        />
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
        <TextInput
          className="p-3 border border-gray-300 rounded mb-4"
          placeholder="Potwierdź hasło"
          secureTextEntry
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
        />
        <TouchableOpacity
          className="bg-button-green py-3 mb-4 w-full items-center"
          onPress={handleRegister}>
          <Text className="text-lg font-bold text-white uppercase">
            Zarejestruj się
          </Text>
        </TouchableOpacity>
        <Text className="text-center mt-4">
          Posiadasz już konto?{' '}
          <Text onPress={toggleForm} className="text-green-700 underline">
            Zaloguj się.
          </Text>
        </Text>
      </View>
    </View>
  );
}
