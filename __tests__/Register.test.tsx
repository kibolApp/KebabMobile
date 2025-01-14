import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import Register from '../components/Register';
import AxiosClient from '../AxiosClient';
import {Alert} from 'react-native';

jest.mock('../AxiosClient', () => ({
  post: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('Register Component', () => {
  it('renders the registration form correctly', () => {
    const {getByPlaceholderText, getByText} = render(<Register />);

    expect(getByPlaceholderText('Nazwa użytkownika')).toBeTruthy();
    expect(getByPlaceholderText('Adres E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Hasło')).toBeTruthy();
    expect(getByPlaceholderText('Potwierdź hasło')).toBeTruthy();
    expect(getByText('Zarejestruj się')).toBeTruthy();
  });

  it('handles input changes', () => {
    const {getByPlaceholderText} = render(<Register />);
    const nameInput = getByPlaceholderText('Nazwa użytkownika');
    const emailInput = getByPlaceholderText('Adres E-mail');
    const passwordInput = getByPlaceholderText('Hasło');
    const passwordConfirmationInput = getByPlaceholderText('Potwierdź hasło');

    fireEvent.changeText(nameInput, 'Jan Kowalski');
    fireEvent.changeText(emailInput, 'jan.kowalski@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(passwordConfirmationInput, 'password123');

    expect(nameInput.props.value).toBe('Jan Kowalski');
    expect(emailInput.props.value).toBe('jan.kowalski@example.com');
    expect(passwordInput.props.value).toBe('password123');
    expect(passwordConfirmationInput.props.value).toBe('password123');
  });

  it('handles successful registration', async () => {
    const mockToggleForm = jest.fn();
    AxiosClient.post.mockResolvedValueOnce({});

    const {getByPlaceholderText, getByText} = render(<Register toggleForm={mockToggleForm} />);
    const nameInput = getByPlaceholderText('Nazwa użytkownika');
    const emailInput = getByPlaceholderText('Adres E-mail');
    const passwordInput = getByPlaceholderText('Hasło');
    const passwordConfirmationInput = getByPlaceholderText('Potwierdź hasło');
    const registerButton = getByText('Zarejestruj się');

    fireEvent.changeText(nameInput, 'Jan Kowalski');
    fireEvent.changeText(emailInput, 'jan.kowalski@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(passwordConfirmationInput, 'password123');
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(AxiosClient.post).toHaveBeenCalledWith('/register', {
        name: 'Jan Kowalski',
        email: 'jan.kowalski@example.com',
        password: 'password123',
        password_confirmation: 'password123',
      });
      expect(Alert.alert).toHaveBeenCalledWith('Sukces', 'Rejestracja zakończona pomyślnie');
      expect(mockToggleForm).toHaveBeenCalled();
    });
  });

  it('handles registration failure', async () => {
    AxiosClient.post.mockRejectedValueOnce(new Error('Error'));

    const {getByPlaceholderText, getByText} = render(<Register />);
    const nameInput = getByPlaceholderText('Nazwa użytkownika');
    const emailInput = getByPlaceholderText('Adres E-mail');
    const passwordInput = getByPlaceholderText('Hasło');
    const passwordConfirmationInput = getByPlaceholderText('Potwierdź hasło');
    const registerButton = getByText('Zarejestruj się');

    fireEvent.changeText(nameInput, 'Jan Kowalski');
    fireEvent.changeText(emailInput, 'jan.kowalski@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(passwordConfirmationInput, 'password123');
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Błąd', 'Wystąpił problem z rejestracją');
    });
  });
});
