import React from 'react';
import { View, Image } from 'react-native';
import BackButton from './BackButton';

export default function Navbar({ onBackPress }) {
  return (
    <View className="flex-row items-center justify-between bg-button-green w-full p-4">
      <BackButton onPress={onBackPress} color="#FFFFFF" />
      <Image
        source={require('../assets/kebab_logo.png')}
        className="w-12 h-12"
        resizeMode="contain"
      />
    </View>
  );
}
