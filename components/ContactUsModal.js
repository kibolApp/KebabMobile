import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ContactUsModal({ visible, onClose }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      alert('Wysłano sugestie do administratora!');
      setMessage('');
      onClose();
    } else {
      alert('Proszę wprowadzić sugestie przed wysłaniem.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">

        <View className="m-5 p-5 bg-white rounded-lg w-11/12 shadow-lg relative">

          <TouchableOpacity className="absolute top-2 right-2 p-1" onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>

          <Text className="text-lg font-bold mb-4 text-center">Skontaktuj się z nami</Text>

          <TextInput
            className="h-24 border border-gray-400 mb-4 p-2 rounded-md text-base text-top"
            placeholder="Opisz swoje sugestie..."
            value={message}
            onChangeText={setMessage}
            multiline
            style={{ textAlignVertical: 'top' }}
          />

          <TouchableOpacity
            className="bg-custom-green py-2 px-6 rounded-md items-center self-center"
            onPress={handleSend}
          >
            <Text className="text-white font-bold">Wyślij</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
