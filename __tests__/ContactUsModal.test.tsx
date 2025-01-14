import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ContactUsModal from '../components/ContactUsModal';
import AxiosClient from '../AxiosClient';
import { Alert } from 'react-native';

jest.mock('../AxiosClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

global.alert = jest.fn();

describe('ContactUsModal Component', () => {
  beforeEach(() => {
    AxiosClient.get.mockResolvedValue({ data: { user: { name: 'Test User' } } });
  });

  it('renders the contact form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<ContactUsModal />);

    expect(getByPlaceholderText('Opisz swoje sugestie...')).toBeTruthy();
    expect(getByText('Wyślij')).toBeTruthy();
  });

  it('handles input changes', () => {
    const { getByPlaceholderText } = render(<ContactUsModal />);
    const messageInput = getByPlaceholderText('Opisz swoje sugestie...');

    fireEvent.changeText(messageInput, 'To jest testowa wiadomość.');

    expect(messageInput.props.value).toBe('To jest testowa wiadomość.');
  });

  it('handles successful message submission', async () => {
    AxiosClient.post.mockResolvedValueOnce({});

    const { getByPlaceholderText, getByText } = render(<ContactUsModal />);
    const messageInput = getByPlaceholderText('Opisz swoje sugestie...');
    const sendButton = getByText('Wyślij');

    fireEvent.changeText(messageInput, 'To jest testowa wiadomość.');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(AxiosClient.post).toHaveBeenCalledWith('/suggestions', {
        user: 'Test User',
        contents: 'To jest testowa wiadomość.',
      });
      expect(global.alert).toHaveBeenCalledWith('Sugestia została wysłana!');
    });
  });

  it('handles message submission failure', async () => {
    AxiosClient.post.mockRejectedValueOnce(new Error('Error'));

    const { getByPlaceholderText, getByText } = render(<ContactUsModal />);
    const messageInput = getByPlaceholderText('Opisz swoje sugestie...');
    const sendButton = getByText('Wyślij');

    fireEvent.changeText(messageInput, 'To jest testowa wiadomość.');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Nie udało się wysłać sugestii. Spróbuj ponownie później.');
    });
  });
});
