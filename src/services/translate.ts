export interface TranslationProvider {
  name: string;
  translate(text: string, from: string, to: string): Promise<string>;
}

export class DeepLProvider implements TranslationProvider {
  name = 'DeepL';
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, useFreeApi = true) {
    this.apiKey = apiKey;
    this.baseUrl = useFreeApi
      ? 'https://api-free.deepl.com/v2'
      : 'https://api.deepl.com/v2';
  }

  async translate(text: string, from: string, to: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/translate`, {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        source_lang: from.toUpperCase(),
        target_lang: to.toUpperCase(),
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translations[0].text;
  }
}

export class MockTranslationProvider implements TranslationProvider {
  name = 'Mock';

  async translate(text: string, _from: string, _to: string): Promise<string> {
    return `[translated] ${text}`;
  }
}

let currentProvider: TranslationProvider = new MockTranslationProvider();

export function setTranslationProvider(provider: TranslationProvider) {
  currentProvider = provider;
}

export function getTranslationProvider(): TranslationProvider {
  return currentProvider;
}

export async function translate(
  text: string,
  from: string = 'ja',
  to: string = 'zh',
): Promise<string> {
  return currentProvider.translate(text, from, to);
}
