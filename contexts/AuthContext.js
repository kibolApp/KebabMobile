import React, {createContext, useState, useContext, useEffect} from 'react';
import AxiosClient from '../AxiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        setAuthToken(storedToken);
      }
    };

    checkUser();
  }, []);

  const login = async (userData, token) => {
    setUser(userData);
    setAuthToken(token);
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      if (authToken) {
        await AxiosClient.post(
          '/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
      }

      setUser(null);
      setAuthToken(null);
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {}
  };

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
