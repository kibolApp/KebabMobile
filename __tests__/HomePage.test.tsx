import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import HomePage from '../screens/HomePage';
import AxiosClient from '../AxiosClient';
import {AuthProvider} from '../contexts/AuthContext';
import {NavigationContainer} from '@react-navigation/native';
import {Alert} from 'react-native';

jest.mock('../AxiosClient');

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

jest.spyOn(Alert, 'alert');

describe('HomePage', () => {
  const mockKebabs = [
    {
      id: 1,
      name: 'Kebab King',
      address: 'Main Street 1',
      coordinates: {lat: 51.2073, lng: 16.1551},
    },
    {
      id: 2,
      name: 'Tasty Kebab',
      address: 'Market Square 5',
      coordinates: {lat: 51.21, lng: 16.16},
    },
  ];

  const renderHomePage = () =>
    render(
      <AuthProvider>
        <NavigationContainer>
          <HomePage />
        </NavigationContainer>
      </AuthProvider>,
    );

  beforeEach(() => {
    AxiosClient.get.mockClear();
    Alert.alert.mockClear();
  });

  it('renders the map and fetches kebabs on load', async () => {
    AxiosClient.get.mockResolvedValueOnce({data: mockKebabs});

    const {getByPlaceholderText, queryByText} = renderHomePage();

    expect(queryByText('Kebab King')).toBeNull();

    await waitFor(() => {
      expect(AxiosClient.get).toHaveBeenCalledWith('/kebabs');
      expect(queryByText('Kebab King')).not.toBeNull();
      expect(queryByText('Tasty Kebab')).not.toBeNull();
    });

    expect(getByPlaceholderText('Wyszukaj kebaba...')).toBeTruthy();
  });

  it('navigates to kebab details on marker click', async () => {
    const mockNavigate = jest.fn();
    AxiosClient.get.mockResolvedValueOnce({data: mockKebabs});
    jest
      .spyOn(require('@react-navigation/native'), 'useNavigation')
      .mockReturnValue({
        navigate: mockNavigate,
        goBack: jest.fn(),
      });

    const {queryByText} = renderHomePage();

    await waitFor(() => queryByText('Kebab King'));

    fireEvent.press(queryByText('Kebab King'));

    expect(mockNavigate).toHaveBeenCalledWith('KebabPage', {
      kebab: mockKebabs[0],
    });
  });
});
