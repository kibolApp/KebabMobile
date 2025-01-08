import React from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';

export default function SuggestionsModal({visible, suggestion, onClose}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white p-6 rounded-lg w-[80%] shadow-lg">
          <Text className="text-xl font-bold mb-4">Szczegóły Sugestii</Text>
          <Text className="text-gray-700 text-lg mb-4">
            <Text className="font-bold">Użytkownik: </Text>
            {suggestion?.user}
          </Text>
          <Text className="text-gray-700 text-lg">
            <Text className="font-bold">Treść: </Text>
            {suggestion?.contents}
          </Text>
          <TouchableOpacity
            className="mt-5 bg-custom-green py-2 rounded-full items-center"
            onPress={onClose}>
            <Text className="text-white font-bold text-lg">Zamknij</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
