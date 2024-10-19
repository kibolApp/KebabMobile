import React, { useState } from 'react';
import { View } from 'react-native';
import Login from '../components/Login';
import Register from '../components/Register';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <View className="flex-1 justify-center p-5 bg-[#D8D9CE]">
      {isSignUp ? (
        <Register toggleForm={toggleForm} />
      ) : (
        <Login toggleForm={toggleForm} />
      )}
    </View>
  );
}
