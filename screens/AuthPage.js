import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Login from '../components/Login';
import Register from '../components/Register';
import BackButton from '../components/BackButton';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigation = useNavigation();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <View className="flex-1 justify-center p-5 bg-custom-beige">
      <BackButton onPress={() => navigation.goBack()} />
      {isSignUp ? (
        <Register toggleForm={toggleForm} />
      ) : (
        <Login toggleForm={toggleForm} />
      )}
    </View>
  );
}
