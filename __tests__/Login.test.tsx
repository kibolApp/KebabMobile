import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import Login from '../components/Login';
import AxiosClient from '../AxiosClient';
import {useAuth} from '../contexts/AuthContext';
import {Alert} from 'react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
}));

jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    login: jest.fn(),
  })),
}));

jest.mock('../AxiosClient', () => ({
  post: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('Login Component', () => {
  it('renders the login form correctly', () => {
    const {getByPlaceholderText, getByText} = render(<Login />);

    expect(getByPlaceholderText('Adres E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Hasło')).toBeTruthy();
    expect(getByText('Zaloguj się')).toBeTruthy();
  });

  it('handles input changes', () => {
    const {getByPlaceholderText} = render(<Login />);
    const emailInput = getByPlaceholderText('Adres E-mail');
    const passwordInput = getByPlaceholderText('Hasło');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('handles successful login', async () => {
    const mockLogin = jest.fn();
    useAuth.mockReturnValue({login: mockLogin});

    AxiosClient.post.mockResolvedValueOnce({
      data: {
        token: 'mockToken',
        user: {name: 'John Doe'},
      },
    });

    const {getByPlaceholderText, getByText} = render(<Login />);
    const emailInput = getByPlaceholderText('Adres E-mail');
    const passwordInput = getByPlaceholderText('Hasło');
    const loginButton = getByText('Zaloguj się');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({name: 'John Doe'}, 'mockToken');
    });
  });

  it('handles login failure', async () => {
    AxiosClient.post.mockRejectedValueOnce(new Error('Invalid credentials'));

    const {getByPlaceholderText, getByText} = render(<Login />);
    const emailInput = getByPlaceholderText('Adres E-mail');
    const passwordInput = getByPlaceholderText('Hasło');
    const loginButton = getByText('Zaloguj się');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Błąd',
        'Podano błędny adres mailowy lub hasło',
      );
    });
  });
});
