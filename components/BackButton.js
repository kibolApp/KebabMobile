import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function BackButton({ onPress }) {
 const navigation = useNavigation();
  return (
     <TouchableOpacity
               className="absolute top-10 left-5"
               onPress={() => navigation.goBack()}
             >
               <Ionicons name="arrow-back" size={30} color="#00000" />
             </TouchableOpacity>
         );
}
