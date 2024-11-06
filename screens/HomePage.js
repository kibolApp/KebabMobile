import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function MapPage() {
 const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center p-5 bg-custom-beige">
     <TouchableOpacity
                className="absolute top-10 left-5"
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={30} color="#ffff" />
              </TouchableOpacity>
     </View>
  );
}
