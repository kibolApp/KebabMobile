import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SuggestionsModal from '../components/SuggestionsModal';

describe('SuggestionsModal', () => {
  it('should render correctly when visible is true', () => {
    const suggestion = {
      user: 'Jan Kowalski',
      contents: 'Świetna aplikacja!',
    };

    const {getByText} = render(
      <SuggestionsModal
        visible={true}
        suggestion={suggestion}
        onClose={() => {}}
      />,
    );

    expect(getByText('Szczegóły Sugestii')).toBeTruthy();
    expect(getByText('Użytkownik: Jan Kowalski')).toBeTruthy();
    expect(getByText('Treść: Świetna aplikacja!')).toBeTruthy();
    expect(getByText('Zamknij')).toBeTruthy();
  });

  it('should not be visible when visible is false', () => {
    const {queryByText} = render(
      <SuggestionsModal visible={false} suggestion={{}} onClose={() => {}} />,
    );

    expect(queryByText('Szczegóły Sugestii')).toBeNull();
  });

  it('should call onClose when the close button is pressed', () => {
    const onCloseMock = jest.fn();
    const suggestion = {
      user: 'Anna Nowak',
      contents: 'Bardzo pomocna aplikacja.',
    };

    const {getByText} = render(
      <SuggestionsModal
        visible={true}
        suggestion={suggestion}
        onClose={onCloseMock}
      />,
    );

    fireEvent.press(getByText('Zamknij'));

    expect(onCloseMock).toHaveBeenCalled();
  });
});
