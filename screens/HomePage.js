import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import KebabListModal from '../components/KebabListModal';
import ContactUsModal from '../components/ContactUsModal';

export default function HomePage() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);

  return (
    <View className="flex-1 bg-custom-beige">
      <Navbar onBackPress={() => navigation.goBack()} />

      <MapView
        className="flex-1"
        initialRegion={{
          latitude: 51.2073,
          longitude: 16.1551,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />

      <TouchableOpacity
        className="absolute top-24 left-5 bg-custom-green p-3 rounded-md"
        onPress={() => setContactModalVisible(true)}
      >
        <Ionicons name="mail" size={25} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        className="absolute top-24 right-5 bg-custom-green p-3 rounded-md flex-row items-center"
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="restaurant" size={25} color="#FFFFFF" />
        <Ionicons name="chevron-down" size={25} color="#FFFFFF" />
      </TouchableOpacity>

      <KebabListModal modalVisible={modalVisible} setModalVisible={setModalVisible} />

      <ContactUsModal visible={contactModalVisible} onClose={() => setContactModalVisible(false)} />
    </View>
  );
}
