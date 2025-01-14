import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import BackButton from '../components/BackButton';
import {useNavigation} from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('BackButton', () => {
  it('should render correctly', () => {
    const goBackMock = jest.fn();
    useNavigation.mockReturnValue({goBack: goBackMock});

    const {getByRole} = render(<BackButton />);

    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('should call goBack when pressed', () => {
    const goBackMock = jest.fn();
    useNavigation.mockReturnValue({goBack: goBackMock});

    const {getByRole} = render(<BackButton />);

    const button = getByRole('button');
    fireEvent.press(button);

    expect(goBackMock).toHaveBeenCalled();
  });
});
