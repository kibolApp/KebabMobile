import React from 'react';
import { render } from '@testing-library/react-native';
import Navbar from '../components/Navbar';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

describe('Navbar', () => {
  it('renders the BackButton component', () => {
    const { getByRole } = render(<Navbar onBackPress={() => {}} />);
    const backButton = getByRole('button');
    expect(backButton).toBeTruthy();
  });

  it('renders the logo image', () => {
    const { getByTestId } = render(<Navbar onBackPress={() => {}} />);
    const logoImage = getByTestId('logo-image');
    expect(logoImage).toBeTruthy();
  });

});
