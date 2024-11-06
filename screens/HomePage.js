import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';

export default function MapPage() {
 const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center p-5 bg-custom-beige">
      <BackButton onPress={() => navigation.goBack()} />
     </View>
  );
}
