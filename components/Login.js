import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

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
        <TouchableOpacity
          className="bg-button-green py-3 mb-4 w-full items-center"
          onPress={() => console.log('Login')}
        >
          <Text className="text-lg font-bold text-white uppercase">Zaloguj się</Text>
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
