import React from 'react';
import {Modal, View, Text, TextInput, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

const AddCommentModal = ({
  modalVisible,
  setModalVisible,
  newComment,
  setNewComment,
  handleAddComment,
}) => {
  return (
    <Modal visible={modalVisible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="m-5 p-5 bg-white rounded-lg w-11/12 shadow-lg relative">
          <TouchableOpacity
            className="absolute top-2 right-2 p-1"
            onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>

          <Text className="text-lg font-bold mb-4 text-center">
            Dodaj komentarz
          </Text>

          <TextInput
            className="h-24 border border-gray-400 mb-4 p-2 rounded-md text-base flex flex-col justify-start"
            placeholder="Wpisz swój komentarz..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            className="bg-custom-green py-2 px-6 rounded-md items-center self-center"
            onPress={handleAddComment}>
            <Text className="text-white font-bold">Wyślij</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddCommentModal;
