import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import tailwindConfig from '../tailwind.config';

export default function Register({ toggleForm }) {
  return (
    <View className="flex-1 justify-center p-5">
      <View className="bg-white rounded-lg p-8 shadow-lg">
        <Text className="text-2xl font-bold text-center mb-5">Rejestracja</Text>
        <TextInput
          className="p-3 border border-gray-300 rounded mb-4"
          placeholder="Nazwa użytkownika"
        />
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
       <Button
         title="Zarejestruj się"
         color={tailwindConfig.theme.extend.colors['button-green']}
         onPress={() => {}}
       />
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
