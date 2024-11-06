import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps';
import Navbar from '../components/Navbar';

export default function HomePage() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-custom-beige">
      <Navbar onBackPress={() => navigation.goBack()} />

      <MapView
        className="w-full h-1/2"
        initialRegion={{
          latitude: 51.2073,
          longitude: 16.1551,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />

      <View className="flex-1 justify-center items-center">
        <Text className="text-center">Lista Kebabów</Text>
      </View>
    </View>
  );
}
