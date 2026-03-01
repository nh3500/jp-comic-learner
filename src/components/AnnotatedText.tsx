import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export interface TokenData {
  surface: string;
  reading: string;
  pos: string;
  basic: string;
}

interface AnnotatedTextProps {
  tokens: TokenData[];
  onTokenPress?: (token: TokenData) => void;
}

export default function AnnotatedText({ tokens, onTokenPress }: AnnotatedTextProps) {
  return (
    <View style={styles.container}>
      {tokens.map((token, index) => {
        const showReading =
          token.reading &&
          token.reading !== token.surface &&
          token.pos !== '記号';

        return (
          <TouchableOpacity
            key={`${token.surface}-${index}`}
            style={styles.tokenContainer}
            onPress={() => onTokenPress?.(token)}
            activeOpacity={0.6}
          >
            {showReading && (
              <Text style={styles.reading}>{token.reading}</Text>
            )}
            <Text style={styles.surface}>{token.surface}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    padding: 8,
  },
  tokenContainer: {
    alignItems: 'center',
    marginHorizontal: 1,
    marginBottom: 4,
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 4,
  },
  reading: {
    fontSize: 10,
    color: '#888',
    marginBottom: 1,
  },
  surface: {
    fontSize: 18,
    color: '#333',
  },
});
