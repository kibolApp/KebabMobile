import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function BackButton({ onPress, color = '#000000' }) {
 const navigation = useNavigation();
  return (
     <TouchableOpacity
               onPress={() => navigation.goBack()}
             >
               <Ionicons name="arrow-back" size={30} color={color} />
             </TouchableOpacity>
         );
}
