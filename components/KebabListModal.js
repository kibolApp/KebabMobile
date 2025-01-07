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
  ScrollView,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker';
import AxiosClient from '../AxiosClient';

const KebabListModal = ({modalVisible, setModalVisible}) => {
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
    const filterByStatus = kebab => {
      if (kebab.status === 'exists') {
        return 'open';
      } else if (kebab.status === 'closed') {
        return 'closed';
      } else {
        return 'planned';
      }
    };

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
          case 'year_open_asc':
            return;
            break;
          case 'year_open_desc':
            return;
            break;
          case 'rating_asc':
            return;
            break;
          case 'rating_desc':
            return;
            break;
          default:
            break;
        }
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
            <Text className="text-lg font-semibold text-gray-800">
              {item.name}
            </Text>
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
              className="text-sm text-blue-500 mt-2"
              onPress={() => Linking.openURL(item.pages['pyszne.pl'])}>
              Menu na Pyszne.pl
            </Text>
          )}
        </View>
      )}
    </View>
  );

  const CustomCheckbox = ({label, isSelected, onToggle}) => (
    <TouchableOpacity className="flex-row items-center my-1" onPress={onToggle}>
      <View
        className={`w-5 h-5 border-2 border-gray-800 ${
          isSelected ? 'bg-blue-500' : 'bg-white'
        } rounded-sm mr-2`}
      />
      <Text>{label}</Text>
    </TouchableOpacity>
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
          <Text className="text-xl font-bold mb-4 text-center">
            Lista Kebabów
          </Text>
          <View className="flex-row justify-between items-center mb-2">
            <TouchableOpacity onPress={() => setShowFilterModal(true)}>
              <Text className="text-blue-500">Pokaż filtry</Text>
            </TouchableOpacity>
            <Picker
              selectedValue={sortOption || 'name_asc'}
              style={{height: 40, width: 150, zIndex: 1}}
              onValueChange={value => setSortOption(value)}>
              <Picker.Item label="Sortuj" value={null} />
              <Picker.Item label="Nazwa rosnąco" value="name_asc" />
              <Picker.Item label="Nazwa malejąco" value="name_desc" />
              <Picker.Item label="Rok otwarcia rosnąco" value="year_open_asc" />
              <Picker.Item
                label="Rok otwarcia malejąco"
                value="year_open_desc"
              />
              <Picker.Item label="Ocena rosnąco" value="rating_asc" />
              <Picker.Item label="Ocena malejąco" value="rating_desc" />
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
              <Text className="text-blue-500">Poprzednia</Text>
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
              <Text className="text-blue-500">Następna</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}>
        <View className="flex-1 bg-black/50 justify-center">
          <View className="bg-white p-5 rounded-lg w-full max-w-md shadow-lg mt-[50px]">
            <TouchableOpacity
              className="absolute top-2 right-2"
              onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={25} color="black" />
            </TouchableOpacity>
            <Text className="text-xl font-bold mb-4 text-center">Filtry</Text>

            <ScrollView className="mb-4">
              <Text className="font-semibold">Filtruj według:</Text>

              <Picker
                selectedValue={filterStatus}
                onValueChange={value => setFilterStatus(value)}>
                <Picker.Item label="Wszystkie" value="all" />
                <Picker.Item label="Otwarte" value="open" />
                <Picker.Item label="Zamknięte" value="closed" />
                <Picker.Item label="Planujące otwarcie" value="planned" />
              </Picker>

              <View>
                <Text className="font-semibold mt-2">Wybierz mięso:</Text>
                <CustomCheckbox
                  label="Kurczak"
                  isSelected={filterMeat.includes('kurczak')}
                  onToggle={() =>
                    setFilterMeat(prev =>
                      prev.includes('kurczak')
                        ? prev.filter(item => item !== 'kurczak')
                        : [...prev, 'kurczak'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Wieprzowina"
                  isSelected={filterMeat.includes('wieprzowina')}
                  onToggle={() =>
                    setFilterMeat(prev =>
                      prev.includes('wieprzowina')
                        ? prev.filter(item => item !== 'wieprzowina')
                        : [...prev, 'wieprzowina'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Mieszane"
                  isSelected={filterMeat.includes('mieszane')}
                  onToggle={() =>
                    setFilterMeat(prev =>
                      prev.includes('mieszane')
                        ? prev.filter(item => item !== 'mieszane')
                        : [...prev, 'mieszane'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Falafel"
                  isSelected={filterMeat.includes('falafel')}
                  onToggle={() =>
                    setFilterMeat(prev =>
                      prev.includes('falafel')
                        ? prev.filter(item => item !== 'falafel')
                        : [...prev, 'falafel'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Kapsalon"
                  isSelected={filterMeat.includes('kapsalon')}
                  onToggle={() =>
                    setFilterMeat(prev =>
                      prev.includes('kapsalon')
                        ? prev.filter(item => item !== 'kapsalon')
                        : [...prev, 'kapsalon'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Baran"
                  isSelected={filterMeat.includes('baran')}
                  onToggle={() =>
                    setFilterMeat(prev =>
                      prev.includes('baran')
                        ? prev.filter(item => item !== 'baran')
                        : [...prev, 'baran'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Wołowina"
                  isSelected={filterMeat.includes('wołowina')}
                  onToggle={() =>
                    setFilterMeat(prev =>
                      prev.includes('wołowina')
                        ? prev.filter(item => item !== 'wołowina')
                        : [...prev, 'wołowina'],
                    )
                  }
                />
              </View>

              <View>
                <Text className="font-semibold mt-2">Wybierz sos:</Text>
                <CustomCheckbox
                  label="Łagodny"
                  isSelected={filterSauces.includes('łagodny')}
                  onToggle={() =>
                    setFilterSauces(prev =>
                      prev.includes('łagodny')
                        ? prev.filter(item => item !== 'łagodny')
                        : [...prev, 'łagodny'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Ostry"
                  isSelected={filterSauces.includes('ostry')}
                  onToggle={() =>
                    setFilterSauces(prev =>
                      prev.includes('ostry')
                        ? prev.filter(item => item !== 'ostry')
                        : [...prev, 'ostry'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Mieszany"
                  isSelected={filterSauces.includes('mieszany')}
                  onToggle={() =>
                    setFilterSauces(prev =>
                      prev.includes('mieszany')
                        ? prev.filter(item => item !== 'mieszany')
                        : [...prev, 'mieszany'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Czosnek"
                  isSelected={filterSauces.includes('czosnek')}
                  onToggle={() =>
                    setFilterSauces(prev =>
                      prev.includes('czosnek')
                        ? prev.filter(item => item !== 'czosnek')
                        : [...prev, 'czosnek'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Ziołowy"
                  isSelected={filterSauces.includes('ziołowy')}
                  onToggle={() =>
                    setFilterSauces(prev =>
                      prev.includes('ziołowy')
                        ? prev.filter(item => item !== 'ziołowy')
                        : [...prev, 'ziołowy'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Arabski"
                  isSelected={filterSauces.includes('arabski')}
                  onToggle={() =>
                    setFilterSauces(prev =>
                      prev.includes('arabski')
                        ? prev.filter(item => item !== 'arabski')
                        : [...prev, 'arabski'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Miętowy"
                  isSelected={filterSauces.includes('miętowy')}
                  onToggle={() =>
                    setFilterSauces(prev =>
                      prev.includes('miętowy')
                        ? prev.filter(item => item !== 'miętowy')
                        : [...prev, 'miętowy'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Musztardowy"
                  isSelected={filterSauces.includes('musztardowy')}
                  onToggle={() =>
                    setFilterSauces(prev =>
                      prev.includes('musztardowy')
                        ? prev.filter(item => item !== 'musztardowy')
                        : [...prev, 'musztardowy'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Czosnkowy"
                  isSelected={filterSauces.includes('czosnkowy')}
                  onToggle={() =>
                    setFilterSauces(prev =>
                      prev.includes('czosnkowy')
                        ? prev.filter(item => item !== 'czosnkowy')
                        : [...prev, 'czosnkowy'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Miodowo-Musztardowy"
                  isSelected={filterSauces.includes('miodowo-musztardowy')}
                  onToggle={() =>
                    setFilterSauces(prev =>
                      prev.includes('miodowo-musztardowy')
                        ? prev.filter(item => item !== 'miodowo-musztardowy')
                        : [...prev, 'miodowo-musztardowy'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Sriracha Mayo"
                  isSelected={filterSauces.includes('sriracha mayo')}
                  onToggle={() =>
                    setFilterSauces(prev =>
                      prev.includes('sriracha mayo')
                        ? prev.filter(item => item !== 'sriracha mayo')
                        : [...prev, 'sriracha mayo'],
                    )
                  }
                />
                <CustomCheckbox
                  label="Salsa Verde"
                  isSelected={filterSauces.includes('salsa verde')}
                  onToggle={() =>
                    setFilterSauces(prev =>
                      prev.includes('salsa verde')
                        ? prev.filter(item => item !== 'salsa verde')
                        : [...prev, 'salsa verde'],
                    )
                  }
                />
              </View>

              <Picker
                selectedValue={filterCraft}
                onValueChange={value => setFilterCraft(value)}>
                <Picker.Item label="Kraftowy" value={1} />
                <Picker.Item label="Bez kraftowego" value={0} />
              </Picker>

              <Picker
                selectedValue={filterPremises}
                onValueChange={value => setFilterPremises(value)}>
                <Picker.Item label="W budynku" value={1} />
                <Picker.Item label="W budce" value={0} />
              </Picker>

              <Picker
                selectedValue={filterChainstore}
                onValueChange={value => setFilterChainstore(value)}>
                <Picker.Item label="Sieciowy" value={1} />
                <Picker.Item label="Bez sieciowego" value={0} />
              </Picker>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

export default KebabListModal;
