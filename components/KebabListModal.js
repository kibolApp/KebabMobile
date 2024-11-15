import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const KebabListModal = ({ modalVisible, setModalVisible }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 relative">
        <View className="flex-1" />
        <View className="absolute top-1/4 left-8 right-8 bg-white p-5 rounded-lg items-center">
          <TouchableOpacity
            className="absolute top-2 right-2"
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={25} color="black" />
          </TouchableOpacity>
          <Text className="text-lg mb-4">Lista kebabów</Text>
        </View>
      </View>
    </Modal>
  );
};

export default KebabListModal;
