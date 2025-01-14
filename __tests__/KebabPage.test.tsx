import React from 'react';
import { render } from '@testing-library/react-native';
import KebabPage from '../screens/KebabPage';
import { NavigationContainer } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useRoute: jest.fn(),
  };
});

jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockKebabData = {
  name: 'Kebab Express',
  address: '123 Main Street',
  status: 'exists',
  opening_hours: {
    monday: '10:00 - 22:00',
    tuesday: '10:00 - 22:00',
  },
  sauces: ['Garlic', 'Spicy'],
  meats: ['Chicken', 'Beef'],
  pages: {
    'pyszne.pl': 'https://pyszne.pl/kebab-express',
    glovo: 'https://glovoapp.com/kebab-express',
  },
};

describe('KebabPage', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { name: 'Test User', email: 'test@example.com' },
    });

    useRoute.mockReturnValue({
      params: { kebab: mockKebabData },
    });
  });

  const renderWithNavigation = (component) => {
    return render(
      <NavigationContainer>
        {component}
      </NavigationContainer>
    );
  };

  it('renders the kebab name and address correctly', () => {
    const { getByText } = renderWithNavigation(<KebabPage />);
    expect(getByText('Kebab Express')).toBeTruthy();
    expect(getByText('123 Main Street')).toBeTruthy();
  });

  it('renders the status correctly', () => {
    const { getByText } = renderWithNavigation(<KebabPage />);
    expect(getByText('Otwarty')).toBeTruthy();
  });

  it('renders opening hours correctly when provided', () => {
    const { getByText } = renderWithNavigation(<KebabPage />);
    expect(getByText('Poniedziałek: 10:00 - 22:00')).toBeTruthy();
    expect(getByText('Wtorek: 10:00 - 22:00')).toBeTruthy();
  });

  it('renders sauces and meats when provided', () => {
    const { getByText } = renderWithNavigation(<KebabPage />);
    expect(getByText('Dostępne sosy:')).toBeTruthy();
    expect(getByText('Garlic, Spicy')).toBeTruthy();
    expect(getByText('Rodzaje mięs:')).toBeTruthy();
    expect(getByText('Chicken, Beef')).toBeTruthy();
  });

  it('renders ordering links when provided', () => {
    const { getByText } = renderWithNavigation(<KebabPage />);
    expect(getByText('Menu na Pyszne.pl')).toBeTruthy();
    expect(getByText('Zamów przez Glovo')).toBeTruthy();
  });
});
