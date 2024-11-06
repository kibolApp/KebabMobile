import React from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps';
import BackButton from '../components/BackButton';

export default function HomePage() {
 const navigation = useNavigation();

  return (
    <View className="flex-1 bg-custom-beige">
      <View className="flex-row items-center justify-between bg-button-green w-full p-4">
        <BackButton onPress={() => navigation.goBack()} color="#FFFFFF" />

        <Image
          source={require('../assets/kebab_logo.png')}
          className="w-12 h-12"
          resizeMode="contain"
        />
      </View>

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
              <Text className="text-center">
                Lista Kebabów
              </Text>
            </View>
    </View>
  );
}
