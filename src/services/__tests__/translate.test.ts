import {
  translate,
  setTranslationProvider,
  MockTranslationProvider,
  TranslationProvider,
} from '../translate';

describe('TranslationService', () => {
  beforeEach(() => {
    setTranslationProvider(new MockTranslationProvider());
  });

  test('translates using current provider', async () => {
    const result = await translate('今日はいい天気ですね', 'ja', 'zh');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  test('mock provider returns prefixed text', async () => {
    const result = await translate('テスト');
    expect(result).toBe('[translated] テスト');
  });

  test('can swap providers', async () => {
    const custom: TranslationProvider = {
      name: 'custom',
      translate: async (text) => `custom: ${text}`,
    };
    setTranslationProvider(custom);
    const result = await translate('hello');
    expect(result).toBe('custom: hello');
  });

  test('defaults to ja -> zh', async () => {
    const spy: TranslationProvider = {
      name: 'spy',
      translate: jest.fn(async () => 'ok'),
    };
    setTranslationProvider(spy);
    await translate('test');
    expect(spy.translate).toHaveBeenCalledWith('test', 'ja', 'zh');
  });
});
