import React from 'react';
import { render } from '@testing-library/react-native';
import AuthPage from '../screens/AuthPage';
import Login from '../components/Login';
import Register from '../components/Register';
import BackButton from '../components/BackButton';
import { useNavigation } from '@react-navigation/native';

jest.mock('../components/Login', () => jest.fn(() => <></>));
jest.mock('../components/Register', () => jest.fn(() => <></>));
jest.mock('../components/BackButton', () => jest.fn(({ onPress }) => {
  onPress();
  return <></>;
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    goBack: jest.fn(),
  })),
}));

describe('AuthPage Component', () => {
  it('renders correctly with the Login form initially', () => {
    render(<AuthPage />);

    expect(BackButton).toHaveBeenCalledWith(
      expect.objectContaining({
        onPress: expect.any(Function),
        color: '#00000',
      }),
      expect.any(Object)
    );
    expect(Login).toHaveBeenCalledWith(
      expect.objectContaining({ toggleForm: expect.any(Function) }),
      expect.any(Object)
    );
    expect(Register).not.toHaveBeenCalled();
  });

  it('calls navigation.goBack when BackButton is pressed', () => {
    const mockGoBack = jest.fn();
    useNavigation.mockReturnValue({ goBack: mockGoBack });

    render(<AuthPage />);

    expect(mockGoBack).toHaveBeenCalled();
  });
});
