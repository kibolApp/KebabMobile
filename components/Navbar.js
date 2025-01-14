import React from 'react';
import { View, Image } from 'react-native';
import BackButton from '../components/BackButton';

export default function Navbar({ onBackPress }) {
  return (
    <View className="flex-row items-center justify-between bg-custom-green w-full p-4">
      <BackButton testID="back-button" onPress={onBackPress} color="#FFFFFF" />
      <Image
        source={require('../assets/kebab_logo.png')}
        testID="logo-image"
        className="w-12 h-12"
        resizeMode="contain"
      />
    </View>
  );
}

