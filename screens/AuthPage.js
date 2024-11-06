import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Login from '../components/Login';
import Register from '../components/Register';
import { Ionicons } from '@expo/vector-icons';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigation = useNavigation();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <View className="flex-1 justify-center p-5 bg-custom-beige">
     <TouchableOpacity
            className="absolute top-10 left-5"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={30} color="#ffff" />
          </TouchableOpacity>
      {isSignUp ? (
        <Register toggleForm={toggleForm} />
      ) : (
        <Login toggleForm={toggleForm} />
      )}
    </View>
  );
}
