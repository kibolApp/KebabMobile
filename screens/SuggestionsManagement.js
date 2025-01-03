import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AxiosClient from '../AxiosClient';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

export default function SuggestionsScreen({ navigation }) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const { token } = useAuth();

useEffect(() => {
  const fetchSuggestions = async () => {
    try {
      const response = await AxiosClient.get('/suggestions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się pobrać sugestii.');
    }
  };

  fetchSuggestions();
}, [token]);

  const deleteSuggestion = async (id) => {
    try {
      await AxiosClient.delete(`/suggestions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions((prev) => prev.filter((suggestion) => suggestion.id !== id));
      Alert.alert('Sukces', 'Sugestia została usunięta.');
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się usunąć sugestii.');
    }
  };

  const renderItem = ({ item }) => (
    <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-300">
      <Text className="text-lg font-semibold text-gray-800">{item.user}</Text>
      <Text className="text-sm text-gray-500 flex-1 mx-4">{item.contents}</Text>
      <View className="flex-row items-center">
        <TouchableOpacity
          className="mr-3"
          onPress={() => {
            setSelectedSuggestion(item);
            setModalVisible(true);
          }}
        >
          <Ionicons name="eye" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteSuggestion(item.id)}>
          <Ionicons name="trash" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-custom-beige">
      <Navbar onBackPress={() => navigation.goBack()} />

      <Text className="text-2xl font-bold text-center mt-5 text-gray-800">
        Zarządzanie Sugestiami
      </Text>

      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />

<Modal visible={isModalVisible} transparent animationType="slide">
  <View className="flex-1 bg-black/50 justify-center items-center">
    <View className="bg-white p-6 rounded-lg w-[80%] shadow-lg">
      <Text className="text-xl font-bold mb-4">Szczegóły Sugestii</Text>
      <Text className="text-gray-700 text-lg mb-4">
        <Text className="font-bold">Użytkownik: </Text>
        {selectedSuggestion?.user}
      </Text>
      <Text className="text-gray-700 text-lg">
        <Text className="font-bold">Treść: </Text>
        {selectedSuggestion?.contents}
      </Text>
      <TouchableOpacity
        className="mt-5 bg-custom-green py-2 rounded-full items-center"
        onPress={() => setModalVisible(false)}
      >
        <Text className="text-white font-bold text-lg">Zamknij</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </View>
  );
}
