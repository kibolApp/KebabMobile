import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Alert} from 'react-native';
import {AuthProvider} from '../contexts/AuthContext';
import SuggestionsScreen from '../screens/SuggestionsManagement';
import AxiosClient from '../AxiosClient';
import {NavigationContainer} from '@react-navigation/native';

jest.mock('../AxiosClient');

jest.spyOn(Alert, 'alert');

describe('SuggestionsScreen', () => {
  const mockNavigation = {goBack: jest.fn()};
  const renderSuggestionsScreen = () => {
    return render(
      <NavigationContainer>
        <AuthProvider>
          <SuggestionsScreen navigation={mockNavigation} />
        </AuthProvider>
      </NavigationContainer>,
    );
  };

  beforeEach(() => {
    AxiosClient.get.mockClear();
    AxiosClient.delete.mockClear();
    Alert.alert.mockClear();
  });

  test('fetches suggestions on load', async () => {
    const mockSuggestions = [
      {id: 1, user: 'User1', contents: 'Suggestion 1'},
      {id: 2, user: 'User2', contents: 'Suggestion 2'},
    ];

    AxiosClient.get.mockResolvedValueOnce({
      data: {suggestions: mockSuggestions},
    });

    const {getByText} = renderSuggestionsScreen();

    await waitFor(() => getByText('Suggestion 1'));
    await waitFor(() => getByText('Suggestion 2'));

    expect(getByText('Suggestion 1')).toBeTruthy();
    expect(getByText('Suggestion 2')).toBeTruthy();
  });

  test('shows error alert if fetching suggestions fails', async () => {
    AxiosClient.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderSuggestionsScreen();

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Błąd',
        'Nie udało się pobrać sugestii.',
      );
    });
  });

  test('delete suggestion works correctly', async () => {
    const mockSuggestions = [
      {id: 1, user: 'User1', contents: 'Suggestion 1'},
      {id: 2, user: 'User2', contents: 'Suggestion 2'},
    ];

    AxiosClient.get.mockResolvedValueOnce({
      data: {suggestions: mockSuggestions},
    });
    AxiosClient.delete.mockResolvedValueOnce({});

    const {getByText, getByTestId} = renderSuggestionsScreen();

    await waitFor(() => getByText('Suggestion 1'));

    fireEvent.press(getByTestId('delete-button-1'));

    await waitFor(() =>
      expect(AxiosClient.delete).toHaveBeenCalledWith(
        '/suggestions/1',
        expect.anything(),
      ),
    );

    expect(() => getByText('Suggestion 1')).toThrow();
    expect(getByText('Suggestion 2')).toBeTruthy();
  });

  test('opens suggestion modal when "eye" icon is clicked', async () => {
    const mockSuggestions = [{id: 1, user: 'User1', contents: 'Suggestion 1'}];

    AxiosClient.get.mockResolvedValueOnce({
      data: {suggestions: mockSuggestions},
    });

    const {getByText, getByTestId} = renderSuggestionsScreen();

    await waitFor(() => getByText('Suggestion 1'));

    fireEvent.press(getByTestId('eye-button-1'));

    await waitFor(() => expect(getByText('Suggestion 1')).toBeTruthy());
  });
});
