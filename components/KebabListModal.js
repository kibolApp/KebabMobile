import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AxiosClient from '../AxiosClient';

const KebabListModal = ({ modalVisible, setModalVisible }) => {
  const [kebabs, setKebabs] = useState([]);

  useEffect(() => {
    const fetchKebabs = async () => {
      try {
        const response = await AxiosClient.get('/kebabs');
        setKebabs(response.data || []);
      } catch (error) {
        Alert.alert('Błąd', 'Nie udało się pobrać listy kebabów.');
      }
    };

    if (modalVisible) {
      fetchKebabs();
    }
  }, [modalVisible]);

 const renderItem = ({ item }) => (
   <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
     <View className="flex-row justify-between items-start p-4 border-b border-gray-300">
       {item.logo && (
         <Image
           source={{ uri: item.logo }}
          className="w-12 h-12 rounded-lg mr-2"
         />
       )}

       <View className="flex-1">
         <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
         <Text className="text-sm text-gray-500">{item.address}</Text>

         <Text className="text-sm text-gray-600 mt-2">Godziny otwarcia:</Text>
         <View className="mt-2">
           {Object.entries(item.opening_hours).map(([day, hours]) => (
             <Text key={day} className="text-sm text-gray-500">
               {`${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours}`}
             </Text>
           ))}
         </View>

         <Text className="text-sm text-gray-600 mt-2">Dostępne sosy:</Text>
         <Text className="text-sm text-gray-500">{item.sauces.join(', ')}</Text>

         <Text className="text-sm text-gray-600 mt-2">Rodzaje mięs:</Text>
         <Text className="text-sm text-gray-500">{item.meats.join(', ')}</Text>

         <Text className="text-sm text-gray-600 mt-2">Opcje zamówienia:</Text>
         <Text className="text-sm text-gray-500">{item.ordering_options.join(', ')}</Text>

       </View>
     </View>
   </ScrollView>
 );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white p-5 rounded-t-lg w-full max-h-[90%] shadow-lg">
          <TouchableOpacity
            className="absolute top-2 right-2"
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={25} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold mb-4 text-center">Lista Kebabów</Text>
          <FlatList
            data={kebabs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default KebabListModal;
