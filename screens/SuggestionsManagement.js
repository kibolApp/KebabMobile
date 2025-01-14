import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AxiosClient from '../AxiosClient';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import SuggestionsModal from '../components/SuggestionsModal';

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
          testID={`eye-button-${item.id}`}
          className="mr-3"
          onPress={() => {
            setSelectedSuggestion(item);
            setModalVisible(true);
          }}
        >
          <Ionicons name="eye" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          testID={`delete-button-${item.id}`}
          onPress={() => deleteSuggestion(item.id)}
        >
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
        contentContainerStyle={{}}
        className="p-2.5"
      />

      <SuggestionsModal
        visible={isModalVisible}
        suggestion={selectedSuggestion}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
