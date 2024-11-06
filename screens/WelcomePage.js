import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomePage({ navigation }) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
    <LinearGradient
      colors={['#D8D9CE', '#FFFFFF']}
      className="absolute inset-x-0 top-[26%] w-full h-[80%] rounded-t-[40px]"
    />

      <Image
        source={require('../assets/kebab_logo.png')}
        className="w-40 h-40 mb-5 z-10"
        resizeMode="contain"
      />

      <Text className="text-2xl font-bold text-center mb-4 z-10 text-gray-800 uppercase">
        Legnica Kebab City Tour
      </Text>

      <Text className="text-center text-sm text-gray-600 px-5 mb-8 z-10">
        Legnica Kebab City Tour jest to aplikacja oraz witryna internetowa służąca pomocą w odnalezieniu lokalizacji wszystkich dostępnych, w planach oraz zamkniętych punktów gastronomicznych serwujących słynne Kebaby. Poniższe przyciski pokierują Cię dalej. Wybierz przycisk "Mapa" aby bezpośrednio odnaleźć Kebaby rozsiane po Legnicy. Możesz też utworzyć konto lub zalogować się aby dodać Twojego ulubionego Kebaba do zakładki "Ulubione", dzięki czemu łatwiej go odnajdziesz!!
      </Text>

      <TouchableOpacity
        className="bg-button-green py-3 rounded-full mb-4 w-[75%] items-center"
        onPress={() => navigation.navigate('HomePage')}
      >
        <Text className="text-lg font-bold text-white uppercase">Mapa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-button-green py-3 rounded-full w-[75%] items-center"
        onPress={() => navigation.navigate('AuthPage')}
      >
        <Text className="text-lg font-bold text-white uppercase">Logowanie</Text>
      </TouchableOpacity>
    </View>
  );
}
