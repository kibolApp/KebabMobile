import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function Login({ toggleForm }) {
  return (
    <View className="flex-1 justify-center p-5">
      <View className="bg-white rounded-lg p-8 shadow-lg">
        <Text className="text-2xl font-bold text-center mb-5">Logowanie</Text>
        <TextInput
          className="p-3 border border-gray-300 rounded mb-4"
          placeholder="Adres E-mail"
          keyboardType="email-address"
        />
        <TextInput
          className="p-3 border border-gray-300 rounded mb-4"
          placeholder="Hasło"
          secureTextEntry
        />
        <Button title="Zaloguj się" color="#283618" onPress={() => {}} />
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
