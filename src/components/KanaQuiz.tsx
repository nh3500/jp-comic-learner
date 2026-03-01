import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { KanaChar } from '../data/kana';

export interface QuizQuestion {
  target: KanaChar;
  choices: string[];
}

export function getQuizQuestion(kanaSet: KanaChar[]): QuizQuestion {
  const targetIndex = Math.floor(Math.random() * kanaSet.length);
  const target = kanaSet[targetIndex];

  const wrongChoices: string[] = [];
  const used = new Set<number>([targetIndex]);

  while (wrongChoices.length < 3) {
    const idx = Math.floor(Math.random() * kanaSet.length);
    if (!used.has(idx)) {
      used.add(idx);
      wrongChoices.push(kanaSet[idx].romaji);
    }
  }

  const choices = [target.romaji, ...wrongChoices];
  // Fisher-Yates shuffle
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  return { target, choices };
}

export function checkAnswer(target: KanaChar, answer: string): boolean {
  return target.romaji === answer;
}

interface KanaQuizProps {
  kanaSet: KanaChar[];
  title: string;
}

export default function KanaQuiz({ kanaSet, title }: KanaQuizProps) {
  const [question, setQuestion] = useState(() => getQuizQuestion(kanaSet));
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handleSelect = useCallback(
    (choice: string) => {
      if (selected !== null) return;
      setSelected(choice);
      const isCorrect = checkAnswer(question.target, choice);
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
    },
    [selected, question],
  );

  const handleNext = useCallback(() => {
    setQuestion(getQuizQuestion(kanaSet));
    setSelected(null);
  }, [kanaSet]);

  const getButtonStyle = (choice: string) => {
    if (selected === null) return styles.choiceButton;
    if (choice === question.target.romaji) return styles.choiceCorrect;
    if (choice === selected) return styles.choiceWrong;
    return styles.choiceButton;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.score}>
        {score.correct}/{score.total}
      </Text>
      <Text style={styles.kanaChar}>{question.target.char}</Text>
      <View style={styles.choicesContainer}>
        {question.choices.map((choice) => (
          <TouchableOpacity
            key={choice}
            style={getButtonStyle(choice)}
            onPress={() => handleSelect(choice)}
            disabled={selected !== null}
          >
            <Text style={styles.choiceText}>{choice}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selected !== null && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>下一題</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  score: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  kanaChar: {
    fontSize: 96,
    marginBottom: 40,
  },
  choicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  choiceButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  choiceCorrect: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  choiceWrong: {
    backgroundColor: '#F44336',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  choiceText: {
    fontSize: 18,
    fontWeight: '500',
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
