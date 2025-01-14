import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  Linking,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker';
import AxiosClient from '../AxiosClient';
import FilterKebabModal from './FilterKebabModal';

const KebabListModal = ({modalVisible, setModalVisible, user}) => {
  const [kebabs, setKebabs] = useState([]);
  const [filteredKebabs, setFilteredKebabs] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMeat, setFilterMeat] = useState([]);
  const [filterSauces, setFilterSauces] = useState([]);
  const [filterCraft, setFilterCraft] = useState(null);
  const [filterPremises, setFilterPremises] = useState(null);
  const [filterChainstore, setFilterChainstore] = useState(null);
  const [expandedKebab, setExpandedKebab] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [meatOptions, setMeatOptions] = useState([]);
  const [sauceOptions, setSauceOptions] = useState([]);
  const [favoriteKebabs, setFavoriteKebabs] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    open: 0,
    closed: 0,
    planned: 0,
  });
  const userId = user?.id;

  const handleFavoriteToggle = async kebabId => {
    if (!userId) {
      Alert.alert('Błąd', 'Nie jesteś zalogowany.');
      return;
    }

    try {
      const isFavorite = favoriteKebabs.includes(kebabId);

      if (isFavorite) {
        await AxiosClient.post('/remfav', {user_id: userId, kebab_id: kebabId});
        setFavoriteKebabs(prev => prev.filter(id => id !== kebabId));
      } else {
        await AxiosClient.post('/addfav', {user_id: userId, kebab_id: kebabId});
        setFavoriteKebabs(prev => [...prev, kebabId]);
      }

      setKebabs(prev =>
        prev.map(kebab =>
          kebab.id === kebabId ? {...kebab, isFavorite: !isFavorite} : kebab,
        ),
      );
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się zmienić ulubionych.');
    }
  };

  const daysOfWeekPL = {
    monday: 'Poniedziałek',
    tuesday: 'Wtorek',
    wednesday: 'Środa',
    thursday: 'Czwartek',
    friday: 'Piątek',
    saturday: 'Sobota',
    sunday: 'Niedziela',
  };

  const filterByStatus = kebab => {
    if (kebab.status === 'exists') {
      return 'open';
    } else if (kebab.status === 'closed') {
      return 'closed';
    } else {
      return 'planned';
    }
  };

  useEffect(() => {
    const fetchKebabs = async () => {
      try {
        const kebabResponse = await AxiosClient.get('/kebabs');
        const kebabsData = kebabResponse.data || [];
        setKebabs(kebabsData);

        let userFavorites = [];
        if (userId) {
          const favoriteResponse = await AxiosClient.get(`/fav/${userId}`);
          userFavorites = favoriteResponse.data.favorites || [];
          setFavoriteKebabs(userFavorites);
        }

        const updatedKebabs = kebabsData.map(kebab => ({
          ...kebab,
          isFavorite: userFavorites.includes(kebab.id),
        }));
        setKebabs(updatedKebabs);

        const counts = {open: 0, closed: 0, planned: 0};
        kebabsData.forEach(kebab => {
          const status = filterByStatus(kebab);
          counts[status]++;
        });
        setStatusCounts(counts);

        const uniqueMeats = new Set();
        const uniqueSauces = new Set();
        kebabsData.forEach(kebab => {
          kebab.meats.forEach(meat => uniqueMeats.add(meat));
          kebab.sauces.forEach(sauce => uniqueSauces.add(sauce));
        });

        setMeatOptions([...uniqueMeats]);
        setSauceOptions([...uniqueSauces]);
      } catch (error) {
        Alert.alert('Błąd', 'Nie udało się pobrać listy kebabów.');
      }
    };

    if (modalVisible) {
      fetchKebabs();
    }
  }, [modalVisible, userId]);

  useEffect(() => {
    const filterKebabs = () => {
      let filteredList = kebabs;

      if (filterStatus !== 'all') {
        filteredList = filteredList.filter(kebab => {
          const status = filterByStatus(kebab);
          return (
            (filterStatus === 'open' && status === 'open') ||
            (filterStatus === 'closed' && status === 'closed') ||
            (filterStatus === 'planned' && status === 'planned')
          );
        });
      }

      if (filterMeat.length > 0) {
        filteredList = filteredList.filter(kebab =>
          filterMeat.every(meat => kebab.meats.includes(meat)),
        );
      }

      if (filterSauces.length > 0) {
        filteredList = filteredList.filter(kebab =>
          filterSauces.every(sauce => kebab.sauces.includes(sauce)),
        );
      }

      if (filterCraft !== null) {
        filteredList = filteredList.filter(
          kebab => kebab.is_crafted === filterCraft,
        );
      }

      if (filterPremises !== null) {
        filteredList = filteredList.filter(
          kebab => kebab.is_premises === filterPremises,
        );
      }

      if (filterChainstore !== null) {
        filteredList = filteredList.filter(
          kebab => kebab.is_chainstore === filterChainstore,
        );
      }

      if (sortOption) {
        switch (sortOption) {
          case 'name_asc':
            filteredList = filteredList.sort((a, b) =>
              b.name.localeCompare(a.name),
            );
            break;
          case 'name_desc':
            filteredList = filteredList.sort((a, b) =>
              a.name.localeCompare(b.name),
            );
            break;
          default:
            break;
        }
      }

      if (!sortOption) {
        const favoriteKebabsList = filteredList.filter(kebab =>
          favoriteKebabs.includes(kebab.id),
        );
        const nonFavoriteKebabsList = filteredList.filter(
          kebab => !favoriteKebabs.includes(kebab.id),
        );

        filteredList = [...favoriteKebabsList, ...nonFavoriteKebabsList];
      }

      setFilteredKebabs(filteredList);
    };

    filterKebabs();
  }, [
    kebabs,
    filterStatus,
    filterMeat,
    filterSauces,
    filterCraft,
    filterPremises,
    filterChainstore,
    sortOption,
    favoriteKebabs,
  ]);

  const currentPageData = filteredKebabs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const renderItem = ({item}) => (
    <View className="border-b border-gray-300">
      <TouchableOpacity
        className="flex-row justify-between items-center p-4"
        onPress={() =>
          setExpandedKebab(expandedKebab === item.id ? null : item.id)
        }>
        <View className="flex-row items-center">
          {item.logo && (
            <Image
              source={{uri: item.logo}}
              className="w-12 h-12 rounded-lg mr-2"
            />
          )}
          <View>
            <Text className="text-lg font-semibold text-gray-800 max-w-[220px] truncate">
              {item.name}
            </Text>
            <Text className="text-sm text-gray-500">{item.address}</Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => handleFavoriteToggle(item.id)}
            className="mr-2">
            <Ionicons
              name={item.isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={item.isFavorite ? 'red' : 'black'}
            />
          </TouchableOpacity>
          <Ionicons
            name={expandedKebab === item.id ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="black"
          />
        </View>
      </TouchableOpacity>
      {expandedKebab === item.id && (
        <View className="p-4 bg-gray-100">
          <Text className="text-sm text-gray-600">Godziny otwarcia:</Text>
          {Object.entries(item.opening_hours).map(([day, hours]) => (
            <Text key={day} className="text-sm text-gray-500">
              {daysOfWeekPL[day]}: {hours}
            </Text>
          ))}

          <Text className="text-sm text-gray-600 mt-2">Dostępne sosy:</Text>
          <Text className="text-sm text-gray-500">
            {item.sauces.join(', ')}
          </Text>

          <Text className="text-sm text-gray-600 mt-2">Rodzaje mięs:</Text>
          <Text className="text-sm text-gray-500">{item.meats.join(', ')}</Text>

          <Text className="text-sm text-gray-600 mt-2">Opcje zamówienia:</Text>
          <Text className="text-sm text-gray-500">
            {item.ordering_options.join(', ')}
          </Text>

          {item.pages && item.pages['pyszne.pl'] && (
            <Text
              className="text-sm text-custom-green mt-2"
              onPress={() => Linking.openURL(item.pages['pyszne.pl'])}>
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
      onRequestClose={() => setModalVisible(false)}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white p-5 rounded-t-lg w-full max-h-[90%] shadow-lg">
          <TouchableOpacity
            className="absolute top-2 right-2"
            onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={25} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold mb-4 text-center text-custom-green">
            Lista Kebabów
          </Text>

          <View className="flex-row justify-around mb-4">
            <Text className="text-gray-800">Otwarte: {statusCounts.open}</Text>
            <Text className="text-gray-800">
              Zamknięte: {statusCounts.closed}
            </Text>
            <Text className="text-gray-800">
              Planowane: {statusCounts.planned}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mb-2">
            <TouchableOpacity onPress={() => setShowFilterModal(true)}>
              <Text className="text-custom-green">Pokaż filtry</Text>
            </TouchableOpacity>
            <Picker
              selectedValue={sortOption || 'name_asc'}
              style={{height: 40, width: 150, zIndex: 1}}
              onValueChange={value => setSortOption(value)}>
              <Picker.Item label="Sortuj" value={null} />
              <Picker.Item label="Nazwa rosnąco" value="name_asc" />
              <Picker.Item label="Nazwa malejąco" value="name_desc" />
            </Picker>
          </View>
          <FlatList
            data={currentPageData}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
          />
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={() => setPage(page > 1 ? page - 1 : page)}
              disabled={page <= 1}>
              <Text className="text-custom-green">Poprzednia</Text>
            </TouchableOpacity>
            <Text>{`Strona ${page}`}</Text>
            <TouchableOpacity
              onPress={() =>
                setPage(
                  page < Math.ceil(filteredKebabs.length / itemsPerPage)
                    ? page + 1
                    : page,
                )
              }
              disabled={
                page >= Math.ceil(filteredKebabs.length / itemsPerPage)
              }>
              <Text className="text-custom-green">Następna</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showFilterModal && (
        <FilterKebabModal
          visible={showFilterModal}
          setShowFilterModal={setShowFilterModal}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterMeat={filterMeat}
          setFilterMeat={setFilterMeat}
          filterSauces={filterSauces}
          setFilterSauces={setFilterSauces}
          filterCraft={filterCraft}
          setFilterCraft={setFilterCraft}
          filterPremises={filterPremises}
          setFilterPremises={setFilterPremises}
          filterChainstore={filterChainstore}
          setFilterChainstore={setFilterChainstore}
          meatOptions={meatOptions}
          sauceOptions={sauceOptions}
        />
      )}
    </Modal>
  );
};

export default KebabListModal;
