import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AnnotatedText, { TokenData } from '../AnnotatedText';

const sampleTokens: TokenData[] = [
  { surface: '今日', reading: 'キョウ', pos: '名詞', basic: '今日' },
  { surface: 'は', reading: 'ハ', pos: '助詞', basic: 'は' },
  { surface: 'いい', reading: 'イイ', pos: '形容詞', basic: 'いい' },
  { surface: '天気', reading: 'テンキ', pos: '名詞', basic: '天気' },
  { surface: 'です', reading: 'デス', pos: '助動詞', basic: 'です' },
  { surface: '。', reading: '', pos: '記号', basic: '。' },
];

describe('AnnotatedText', () => {
  test('renders all token surfaces', () => {
    const { getByText } = render(<AnnotatedText tokens={sampleTokens} />);
    expect(getByText('今日')).toBeTruthy();
    expect(getByText('天気')).toBeTruthy();
    expect(getByText('。')).toBeTruthy();
  });

  test('shows reading for non-symbol tokens with different reading', () => {
    const { getByText } = render(<AnnotatedText tokens={sampleTokens} />);
    expect(getByText('キョウ')).toBeTruthy();
    expect(getByText('テンキ')).toBeTruthy();
  });

  test('does not show reading for symbols', () => {
    const { queryByText } = render(
      <AnnotatedText
        tokens={[{ surface: '。', reading: '。', pos: '記号', basic: '。' }]}
      />,
    );
    // The reading should not render as a separate element for symbols
    const elements = queryByText('。');
    expect(elements).toBeTruthy();
  });

  test('calls onTokenPress when token is tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AnnotatedText tokens={sampleTokens} onTokenPress={onPress} />,
    );
    fireEvent.press(getByText('天気'));
    expect(onPress).toHaveBeenCalledWith(sampleTokens[3]);
  });
});
