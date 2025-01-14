import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import WelcomePage from '../screens/WelcomePage';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from 'react-native';

jest.mock('../contexts/AuthContext');

describe('WelcomePage', () => {
  it('renders correctly', () => {
    useAuth.mockReturnValue({ user: null, logout: jest.fn() });

    const {getByText} = render(<WelcomePage navigation={{ navigate: jest.fn() }} />);

    expect(getByText('Legnica Kebab City Tour')).toBeTruthy();
    expect(getByText('Mapa')).toBeTruthy();
    expect(getByText('Logowanie')).toBeTruthy();
  });

  it('renders logout button when user is logged in', () => {
    useAuth.mockReturnValue({ user: { name: 'Test User' }, logout: jest.fn() });

    const { getByText } = render(<WelcomePage navigation={{ navigate: jest.fn() }} />);

    expect(getByText('Wyloguj')).toBeTruthy();
  });

  it('navigates to HomePage when "Mapa" button is pressed', () => {
    const navigateMock = jest.fn();
    useAuth.mockReturnValue({ user: null, logout: jest.fn() });

    const { getByText } = render(<WelcomePage navigation={{ navigate: navigateMock }} />);

    const mapButton = getByText('Mapa');
    fireEvent.press(mapButton);

    expect(navigateMock).toHaveBeenCalledWith('HomePage');
  });

it('logs out successfully when "Wyloguj" button is pressed', async () => {
  const logoutMock = jest.fn();
  useAuth.mockReturnValue({ user: { name: 'Test User' }, logout: logoutMock });

  jest.spyOn(Alert, 'alert');

  const { getByText } = render(<WelcomePage navigation={{ navigate: jest.fn() }} />);

  const logoutButton = getByText('Wyloguj');
  fireEvent.press(logoutButton);

  expect(logoutMock).toHaveBeenCalled();

  await new Promise(resolve => setTimeout(resolve, 0));

  expect(Alert.alert).toHaveBeenCalledWith('Wylogowano', 'Zostałeś wylogowany pomyślnie.');
});

  it('navigates to AuthPage when "Logowanie" button is pressed', () => {
    const navigateMock = jest.fn();
    useAuth.mockReturnValue({ user: null, logout: jest.fn() });

    const { getByText } = render(<WelcomePage navigation={{ navigate: navigateMock }} />);

    const loginButton = getByText('Logowanie');
    fireEvent.press(loginButton);

    expect(navigateMock).toHaveBeenCalledWith('AuthPage');
  });
});
