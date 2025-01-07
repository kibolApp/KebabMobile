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
  const [sortBy, setSortBy] = useState('nameAsc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedKebab, setExpandedKebab] = useState(null);

  const daysOfWeekPL = {
    monday: 'Poniedziałek',
    tuesday: 'Wtorek',
    wednesday: 'Środa',
    thursday: 'Czwartek',
    friday: 'Piątek',
    saturday: 'Sobota',
    sunday: 'Niedziela',
  };

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
    };

    let filteredList = kebabs;

    if (filterStatus !== 'all') {
      filteredList = kebabs.filter((kebab) => {
        const status = filterByStatus(kebab);
        return (
          (filterStatus === 'open' && status === 'open') ||
          (filterStatus === 'closed' && status === 'closed') ||
          (filterStatus === 'planned' && status === 'planned')
        );
      });
    } else {
      filteredList = kebabs.map((kebab) => ({
        ...kebab,
        status: filterByStatus(kebab),
      }));
    }

    const sortData = (list) => {
      switch (sortBy) {
        case 'nameAsc':
          return list.sort((a, b) => a.name.localeCompare(b.name));
        case 'nameDesc':
          return list.sort((a, b) => b.name.localeCompare(a.name));
       case 'openingYearAsc':
          return;
        case 'openingYearDesc':
          return;
        case 'closingYearAsc':
          return;
        case 'closingYearDesc':
          return;
        case 'ratingAsc':
          return;
        case 'ratingDesc':
          return ;
        default:
          return list;
      }
    };

    setFilteredKebabs(sortData(filteredList));
  }, [kebabs, filterStatus, sortBy]);

  const currentPageData = filteredKebabs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const renderItem = ({ item }) => (
    <View className="border-b border-gray-300">
      <TouchableOpacity
        className="flex-row justify-between items-center p-4"
        onPress={() => setExpandedKebab(expandedKebab === item.id ? null : item.id)}
      >
        <View className="flex-row items-center">
          {item.logo && (
            <Image source={{ uri: item.logo }} className="w-12 h-12 rounded-lg mr-2" />
          )}
          <View>
            <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
            <Text className="text-sm text-gray-500">{item.address}</Text>
          </View>
        </View>
        <Ionicons
          name={expandedKebab === item.id ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="black"
        />
      </TouchableOpacity>

      {expandedKebab === item.id && (
        <View className="p-4 bg-gray-100">
          <Text className="text-sm text-gray-600">Godziny otwarcia:</Text>
          {Object.entries(item.opening_hours).map(([day, hours]) => (
            <Text key={day} className="text-sm text-gray-500">
              {`${daysOfWeekPL[day]}: ${hours}`}
            </Text>
          ))}

          <Text className="text-sm text-gray-600 mt-2">Dostępne sosy:</Text>
          <Text className="text-sm text-gray-500">{item.sauces.join(', ')}</Text>

          <Text className="text-sm text-gray-600 mt-2">Rodzaje mięs:</Text>
          <Text className="text-sm text-gray-500">{item.meats.join(', ')}</Text>

          <Text className="text-sm text-gray-600 mt-2">Opcje zamówienia:</Text>
          <Text className="text-sm text-gray-500">{item.ordering_options.join(', ')}</Text>

          {item.pages && item.pages['pyszne.pl'] && (
            <Text
              className="text-sm text-blue-500 mt-2"
              onPress={() => Linking.openURL(item.pages['pyszne.pl'])}
            >
              Menu na Pyszne.pl
            </Text>
          )}
        </View>
      )}
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
            <Picker selectedValue={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
              <Picker.Item label="Wszystkie" value="all" />
              <Picker.Item label="Otwarte" value="open" />
              <Picker.Item label="Zamknięte" value="closed" />
              <Picker.Item label="Planujące otwarcie" value="planned" />
            </Picker>

            <Picker selectedValue={sortBy} onValueChange={(value) => setSortBy(value)}>
              <Picker.Item label="Nazwa rosnąco" value="nameAsc" />
              <Picker.Item label="Nazwa malejąco" value="nameDesc" />
              <Picker.Item label="Rok otwarcia rosnąco" value="openingYearAsc" />
              <Picker.Item label="Rok otwarcia malejąco" value="openingYearDesc" />
              <Picker.Item label="Rok zamknięcia rosnąco" value="closingYearAsc" />
              <Picker.Item label="Rok zamknięcia malejąco" value="closingYearDesc" />
              <Picker.Item label="Ocena rosnąco" value="ratingAsc" />
              <Picker.Item label="Ocena malejąco" value="ratingDesc" />
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
              onPress={() =>
                setPage(page < Math.ceil(filteredKebabs.length / itemsPerPage) ? page + 1 : page)
              }
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
