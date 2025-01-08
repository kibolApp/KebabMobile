import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Modal} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import AxiosClient from '../AxiosClient';

export default function ContactUsModal({visible, onClose}) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      alert('Proszę wprowadzić sugestie przed wysłaniem.');
      return;
    }

    setLoading(true);
    try {
      const userResponse = await AxiosClient.get('/getCurrentUser');
      const user = userResponse.data.user?.name || 'Anonimowy użytkownik';

      await AxiosClient.post('/suggestions', {
        user,
        contents: message,
      });

      alert('Sugestia została wysłana!');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Błąd podczas wysyłania sugestii:', error);
      alert('Nie udało się wysłać sugestii. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="m-5 p-5 bg-white rounded-lg w-11/12 shadow-lg relative">
          <TouchableOpacity
            className="absolute top-2 right-2 p-1"
            onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>

          <Text className="text-lg font-bold mb-4 text-center">
            Skontaktuj się z nami
          </Text>

          <TextInput
            className="h-24 border border-gray-400 mb-4 p-2 rounded-md text-base flex flex-col justify-start"
            placeholder="Opisz swoje sugestie..."
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            className="bg-custom-green py-2 px-6 rounded-md items-center self-center"
            onPress={handleSend}
            disabled={loading}>
            <Text className="text-white font-bold">
              {loading ? 'Wysyłanie...' : 'Wyślij'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}