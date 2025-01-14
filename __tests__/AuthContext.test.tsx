import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AxiosClient from '../AxiosClient';
import { Text, Button } from 'react-native';

jest.mock('../AxiosClient', () => ({
  post: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const TestComponent = () => {
  const { user, login, logout } = useAuth();
  return (
    <>
      <Text>{user ? user.name : 'No User'}</Text>
      <Button title="Login" onPress={() => login({ name: 'John Doe' }, 'token')} />
      <Button title="Logout" onPress={logout} />
    </>
  );
};

describe('AuthContext', () => {
  it('should initialize with no user and token', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByText('No User')).toBeTruthy();
  });

  it('should initialize with user and token from AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('token');
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({ name: 'John Doe' }));

    const { findByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(await findByText('John Doe')).toBeTruthy();
  });

  it('should call login and update user and token', async () => {
    AsyncStorage.setItem.mockResolvedValueOnce();

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', 'token');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ name: 'John Doe' }));
  });

  it('should call logout and remove user and token', async () => {
    AsyncStorage.removeItem.mockResolvedValueOnce();

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    await act(async () => {
      fireEvent.press(getByText('Logout'));
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('authToken');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user');
  });

  it('should call logout API if token exists', async () => {
    AxiosClient.post.mockResolvedValueOnce({});
    AsyncStorage.getItem.mockResolvedValueOnce('token');
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({ name: 'John Doe' }));

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    await act(async () => {
      fireEvent.press(getByText('Logout'));
    });

    expect(AxiosClient.post).toHaveBeenCalledWith('/logout', {}, {
      headers: {
        Authorization: 'Bearer token',
      },
    });
  });
});
