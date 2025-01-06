import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AxiosClient from '../AxiosClient';

const KebabListModal = ({ modalVisible, setModalVisible }) => {
  const [kebabs, setKebabs] = useState([]);
  const [filteredKebabs, setFilteredKebabs] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState('name');
  const [filterStatus, setFilterStatus] = useState('all');

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

  useEffect(() => {
    const filterByStatus = (kebab) => {
      if (kebab.status === 'exists') {
        return 'open';
      } else if (kebab.status === 'closed') {
      return 'closed';
      } else {
      return 'planned';
      }

      const now = new Date();
      const dayOfWeek = now.toLocaleString('en-EN', { weekday: 'long' }).toLowerCase();
      const openingHours = kebab.opening_hours[dayOfWeek];

      if (openingHours) {
        const [start, end] = openingHours.split('-');
        const startTime = new Date(`${now.toDateString()} ${start}`);
        const endTime = new Date(`${now.toDateString()} ${end}`);

        if (now >= startTime && now <= endTime) {
          return 'open';
        } else {
          return 'closed';
        }
      }
      return 'planned';
    };


    let filteredList = kebabs;

    if (filterStatus !== 'all') {
      filteredList = kebabs.filter(kebab => {
        const status = filterByStatus(kebab);
        return (filterStatus === 'open' && status === 'open') ||
               (filterStatus === 'closed' && status === 'closed') ||
               (filterStatus === 'planned' && status === 'planned');
      });
    } else {
      filteredList = kebabs.map(kebab => ({
        ...kebab,
        status: filterByStatus(kebab),
      }));
    }

    const statusPriority = {
      'open': 1,
      'planned': 2,
      'closed': 3
    };

    filteredList.sort((a, b) => {
      const statusA = a.status;
      const statusB = b.status;
      const statusComparison = statusPriority[statusA] - statusPriority[statusB];

      if (statusComparison !== 0) {
        return statusComparison;
      }

      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'openingYear') {
        return a.opening_year - b.opening_year;
      } else if (sortBy === 'closingYear') {
        return a.closing_year - b.closing_year;
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      }

      return 0;
    });

    setFilteredKebabs(filteredList);
  }, [kebabs, sortBy, filterStatus]);

  const currentPageData = filteredKebabs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const renderItem = ({ item }) => (
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

        {item.pages && item.pages['pyszne.pl'] && (
          <Text className="text-sm text-blue-500 mt-2" onPress={() => Linking.openURL(item.pages['pyszne.pl'])}>
            Menu na Pyszne.pl
          </Text>
        )}
      </View>
    </View>
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

          <View className="mb-4">
            <Picker
              selectedValue={filterStatus}
              onValueChange={value => setFilterStatus(value)}
            >
              <Picker.Item label="Wszystkie" value="all" />
              <Picker.Item label="Otwarte" value="open" />
              <Picker.Item label="Zamknięte" value="closed" />
              <Picker.Item label="Planujące otwarcie" value="planned" />
            </Picker>

            <Picker
              selectedValue={sortBy}
              onValueChange={value => setSortBy(value)}
            >
              <Picker.Item label="Sortuj po nazwie" value="name" />
              <Picker.Item label="Sortuj po roku otwarcia" value="openingYear" />
              <Picker.Item label="Sortuj po roku zamknięcia" value="closingYear" />
              <Picker.Item label="Sortuj po ocenie" value="rating" />
            </Picker>
          </View>

          <FlatList
            data={currentPageData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 10 }}
          />

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={() => setPage(page > 1 ? page - 1 : page)}
              disabled={page <= 1}
            >
              <Text className="text-blue-500">Poprzednia</Text>
            </TouchableOpacity>
            <Text>{`Strona ${page}`}</Text>
            <TouchableOpacity
              onPress={() => setPage(page < Math.ceil(filteredKebabs.length / itemsPerPage) ? page + 1 : page)}
              disabled={page >= Math.ceil(filteredKebabs.length / itemsPerPage)}
            >
              <Text className="text-blue-500">Następna</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default KebabListModal;
