import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  Alert,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import AxiosClient from '../AxiosClient';
import Navbar from '../components/Navbar';
import {useAuth} from '../contexts/AuthContext';
import AddCommentModal from '../components/AddCommentModal';

const daysOfWeekPL = {
  monday: 'Poniedziałek',
  tuesday: 'Wtorek',
  wednesday: 'Środa',
  thursday: 'Czwartek',
  friday: 'Piątek',
  saturday: 'Sobota',
  sunday: 'Niedziela',
};

const KebabPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const kebab = route.params.kebab;

  const [comments, setComments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const {user} = useAuth();
  const [page, setPage] = useState(1);
  const commentsPerPage = 4;

  const statusTranslation = kebab.status === 'exists' ? 'Otwarty' : 'Zamknięty';
  const iconColor = '#2c6e49';

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await AxiosClient.get(`/comments/${kebab.id}`);
        setComments(response.data || []);
      } catch (error) {}
    };

    fetchComments();
  }, [kebab.id]);

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) {
      return;
    }

    try {
      const response = await AxiosClient.post(`/kebabs/${kebab.id}/comments`, {
        id_user: user.id,
        user_name: user.name,
        comment: newComment.trim(),
      });

      setComments(response.data.comments);
      setNewComment('');
      setModalVisible(false);
    } catch (error) {}
  };

  const handleRemoveComment = async comment => {
    Alert.alert(
      'Potwierdzenie usunięcia',
      'Czy na pewno chcesz usunąć komentarz?',
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await AxiosClient.delete(
                `/kebabs/${kebab.id}/comments`,
                {
                  data: {id_user: user.id, comment},
                },
              );
              setComments(response.data.comments);
            } catch (error) {}
          },
        },
      ],
    );
  };

  const currentPageComments = comments.slice(
    (page - 1) * commentsPerPage,
    page * commentsPerPage,
  );

  return (
    <ScrollView contentContainerStyle={{}} className="bg-white grow">
      <Navbar onBackPress={() => navigation.goBack()} />
      <View className="p-4 pt-5">
        <View className="items-center mb-6">
          {kebab.logo && (
            <Image
              source={{uri: kebab.logo}}
              className="w-32 h-32 rounded-lg mb-4 shadow-md"
            />
          )}
          <Text className="text-3xl font-bold text-gray-800 text-center">
            {kebab.name}
          </Text>
          <Text className="text-lg text-gray-600 text-center">
            {kebab.address}
          </Text>
        </View>

        {kebab.opening_hours && Object.keys(kebab.opening_hours).length > 0 && (
          <View className="bg-custom-beige rounded-lg p-4 shadow-lg mb-4">
            <Text className="text-xl font-bold text-gray-800 mb-2">
              <Ionicons name="time" size={20} color={iconColor} /> Godziny
              otwarcia:
            </Text>
            {Object.entries(kebab.opening_hours).map(([day, hours]) => (
              <Text key={day} className="text-gray-700 mb-1">
                {daysOfWeekPL[day]}: {hours}
              </Text>
            ))}
          </View>
        )}

        {kebab.sauces && kebab.sauces.length > 0 && (
          <View className="bg-custom-beige rounded-lg p-4 shadow-lg mb-4">
            <Text className="text-xl font-bold text-gray-800 mb-2">
              <Ionicons name="flask-outline" size={20} color={iconColor} />{' '}
              Dostępne sosy:
            </Text>
            <Text className="text-gray-700">{kebab.sauces.join(', ')}</Text>
          </View>
        )}

        {kebab.meats && kebab.meats.length > 0 && (
          <View className="bg-custom-beige rounded-lg p-4 shadow-lg mb-4">
            <Text className="text-xl font-bold text-gray-800 mb-2">
              <Ionicons name="fast-food-outline" size={20} color={iconColor} />{' '}
              Rodzaje mięs:
            </Text>
            <Text className="text-gray-700">{kebab.meats.join(', ')}</Text>
          </View>
        )}

        {kebab.status && (
          <View className="bg-custom-beige rounded-lg p-4 shadow-lg mb-4">
            <Text className="text-xl font-bold text-gray-800 mb-2">
              <Ionicons name="checkmark-circle" size={20} color={iconColor} />{' '}
              Status:
            </Text>
            <Text
              className={`text-lg ${
                kebab.status === 'exists' ? 'text-green-600' : 'text-red-600'
              }`}>
              {statusTranslation}
            </Text>
          </View>
        )}

        <View className="bg-custom-beige rounded-lg p-4 shadow-lg mb-4">
          {kebab.is_crafted !== undefined && (
            <Text className="text-gray-700">
              <Ionicons name="star" size={16} color={iconColor} /> Kraftowy:{' '}
              {kebab.is_crafted ? 'Tak' : 'Nie'}
            </Text>
          )}
          {kebab.is_premises !== undefined && (
            <Text className="text-gray-700 mt-2">
              <Ionicons name="home" size={16} color={iconColor} /> Lokal:{' '}
              {kebab.is_premises ? 'Tak' : 'Nie'}
            </Text>
          )}
          {kebab.is_chainstore !== undefined && (
            <Text className="text-gray-700 mt-2">
              <Ionicons name="grid-outline" size={16} color={iconColor} /> Sieć:{' '}
              {kebab.is_chainstore ? 'Tak' : 'Nie'}
            </Text>
          )}
        </View>

        {kebab.ordering_options && kebab.ordering_options.length > 0 && (
          <View className="bg-custom-beige rounded-lg p-4 shadow-lg mb-4">
            <Text className="text-xl font-bold text-gray-800 mb-2">
              <Ionicons name="cart" size={20} color={iconColor} /> Opcje
              zamówienia:
            </Text>
            <Text className="text-gray-700">
              {kebab.ordering_options.join(', ')}
            </Text>
          </View>
        )}

        <View className="mt-4">
          {kebab.pages?.['pyszne.pl'] && (
            <TouchableOpacity
              onPress={() => Linking.openURL(kebab.pages['pyszne.pl'])}
              className="bg-custom-green rounded-lg p-3 mb-3 shadow-lg">
              <Text className="text-white text-center font-bold">
                Menu na Pyszne.pl
              </Text>
            </TouchableOpacity>
          )}
          {kebab.pages?.glovo && (
            <TouchableOpacity
              onPress={() => Linking.openURL(kebab.pages.glovo)}
              className="bg-custom-green rounded-lg p-3 shadow-lg">
              <Text className="text-white text-center font-bold">
                Zamów przez Glovo
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-custom-green p-3 rounded-lg mt-16 mb-4 flex-row items-center justify-center space-x-2">
          <Ionicons name="chatbubbles-outline" size={20} color="white" />
          <Text className="text-white font-bold">Dodaj komentarz</Text>
        </TouchableOpacity>

        <View className="p-4">
          <Text className="text-xl font-bold mb-4">Komentarze:</Text>

          {currentPageComments.length === 0 ? (
            <Text className="text-gray-600 text-center">
              Brak komentarzy, dodaj swoją opinię
            </Text>
          ) : (
            currentPageComments.map((comment, index) => (
              <View key={index} className="bg-gray-100 p-3 rounded-lg mb-2">
                <Text className="font-bold text-gray-800">
                  {comment.user_name}
                </Text>
                <Text>{comment.comment}</Text>
                {user.id === comment.id_user && (
                  <TouchableOpacity
                    onPress={() => handleRemoveComment(comment.comment)}>
                    <Text className="text-red-500">Usuń</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}

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
                  page < Math.ceil(comments.length / commentsPerPage)
                    ? page + 1
                    : page,
                )
              }
              disabled={page >= Math.ceil(comments.length / commentsPerPage)}>
              <Text className="text-custom-green">Następna</Text>
            </TouchableOpacity>
          </View>
        </View>

        <AddCommentModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
        />
      </View>
    </ScrollView>
  );
};

export default KebabPage;
