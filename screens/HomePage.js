import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, TextInput, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MapView, {Marker, Callout} from 'react-native-maps';
import {Ionicons} from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import KebabListModal from '../components/KebabListModal';
import ContactUsModal from '../components/ContactUsModal';
import AxiosClient from '../AxiosClient';
import {useAuth} from '../contexts/AuthContext';
import kebabIcon from '../assets/kebab_icon.png';

function HomePage() {
  const navigation = useNavigation();
  const {user} = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [kebabs, setKebabs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredKebabs, setFilteredKebabs] = useState([]);
  const [selectedKebab, setSelectedKebab] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = React.useRef(null);

  useEffect(() => {
    AxiosClient.get('/kebabs')
      .then(response => {
        setKebabs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching kebabs:', error);
        setLoading(false);
      });
  }, []);

  const handleSearch = text => {
    setSearchText(text);

    if (text.length >= 3) {
      const suggestions = kebabs.filter(
        kebab =>
          kebab.name.toLowerCase().startsWith(text.toLowerCase()) ||
          kebab.address.toLowerCase().startsWith(text.toLowerCase()),
      );
      setFilteredKebabs(suggestions);
    } else {
      setFilteredKebabs([]);
      if (text === '') {
        setSelectedKebab(null);
      }
    }
  };

  const handleKebabSelect = kebab => {
    navigation.navigate('KebabPage', {kebab});
  };

  const handleSuggestionSelect = kebab => {
    setSelectedKebab(kebab);
    setFilteredKebabs([]);
    setSearchText(kebab.name);

    mapRef.current.animateToRegion(
      {
        latitude: kebab.coordinates.lat,
        longitude: kebab.coordinates.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000,
    );
  };

  const displayedKebabs = selectedKebab ? [selectedKebab] : kebabs;

  return (
    <View className="flex-1 bg-custom-beige">
      <Navbar onBackPress={() => navigation.goBack()} />

      <MapView
        ref={mapRef}
        className="flex-1"
        initialRegion={{
          latitude: 51.2073,
          longitude: 16.1551,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {!loading &&
          displayedKebabs.map(kebab => (
            <Marker
              key={kebab.id}
              coordinate={{
                latitude: kebab.coordinates.lat,
                longitude: kebab.coordinates.lng,
              }}
              title={kebab.name}
              description={kebab.address}
              image={kebabIcon}>
              <Callout onPress={() => handleKebabSelect(kebab)}>
                <View className="w-64 p-3 bg-white rounded-lg">
                  <Text className="font-bold text-lg">{kebab.name}</Text>
                  <Text className="text-gray-700 mt-1">{kebab.address}</Text>
                  <TouchableOpacity>
                    <Text className="text-blue-500 mt-2">Szczegóły</Text>
                  </TouchableOpacity>
                </View>
              </Callout>
            </Marker>
          ))}
      </MapView>

      <View className="absolute top-24 left-5 flex-row space-x-4">
        {user && (
          <TouchableOpacity
            className="bg-custom-green p-3 rounded-md"
            onPress={() => setContactModalVisible(true)}>
            <Ionicons name="mail" size={25} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {user?.isAdmin && (
          <TouchableOpacity
            className="bg-custom-green p-3 rounded-md"
            onPress={() => navigation.navigate('SuggestionsManagement')}>
            <Ionicons name="list" size={25} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        className="absolute top-24 right-5 bg-custom-green p-3 rounded-md flex-row items-center"
        onPress={() => setModalVisible(true)}>
        <Ionicons name="restaurant" size={25} color="#FFFFFF" />
        <Ionicons name="chevron-down" size={25} color="#FFFFFF" />
      </TouchableOpacity>

      <KebabListModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        kebabs={kebabs}
      />

      <ContactUsModal
        visible={contactModalVisible}
        onClose={() => setContactModalVisible(false)}
      />

      <View className="absolute bottom-5 left-2.5 right-2.5 bg-gray-100 rounded-lg p-2 shadow-lg">
        {filteredKebabs.length > 0 && (
          <FlatList
            data={filteredKebabs}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                className="p-2 border-b border-gray-200"
                onPress={() => handleSuggestionSelect(item)}>
                <Text>
                  {item.name}{' '}
                  <Text className="text-black">({item.address})</Text>
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
        <TextInput
          className="h-10 border bg-white rounded px-2"
          placeholder="Wyszukaj kebaba..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
}

export default HomePage;
