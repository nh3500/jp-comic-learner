export interface KanaChar {
  char: string;
  romaji: string;
  row: string;
}

export const HIRAGANA: KanaChar[] = [
  // a row
  { char: 'あ', romaji: 'a', row: 'a' },
  { char: 'い', romaji: 'i', row: 'a' },
  { char: 'う', romaji: 'u', row: 'a' },
  { char: 'え', romaji: 'e', row: 'a' },
  { char: 'お', romaji: 'o', row: 'a' },
  // ka row
  { char: 'か', romaji: 'ka', row: 'ka' },
  { char: 'き', romaji: 'ki', row: 'ka' },
  { char: 'く', romaji: 'ku', row: 'ka' },
  { char: 'け', romaji: 'ke', row: 'ka' },
  { char: 'こ', romaji: 'ko', row: 'ka' },
  // sa row
  { char: 'さ', romaji: 'sa', row: 'sa' },
  { char: 'し', romaji: 'shi', row: 'sa' },
  { char: 'す', romaji: 'su', row: 'sa' },
  { char: 'せ', romaji: 'se', row: 'sa' },
  { char: 'そ', romaji: 'so', row: 'sa' },
  // ta row
  { char: 'た', romaji: 'ta', row: 'ta' },
  { char: 'ち', romaji: 'chi', row: 'ta' },
  { char: 'つ', romaji: 'tsu', row: 'ta' },
  { char: 'て', romaji: 'te', row: 'ta' },
  { char: 'と', romaji: 'to', row: 'ta' },
  // na row
  { char: 'な', romaji: 'na', row: 'na' },
  { char: 'に', romaji: 'ni', row: 'na' },
  { char: 'ぬ', romaji: 'nu', row: 'na' },
  { char: 'ね', romaji: 'ne', row: 'na' },
  { char: 'の', romaji: 'no', row: 'na' },
  // ha row
  { char: 'は', romaji: 'ha', row: 'ha' },
  { char: 'ひ', romaji: 'hi', row: 'ha' },
  { char: 'ふ', romaji: 'fu', row: 'ha' },
  { char: 'へ', romaji: 'he', row: 'ha' },
  { char: 'ほ', romaji: 'ho', row: 'ha' },
  // ma row
  { char: 'ま', romaji: 'ma', row: 'ma' },
  { char: 'み', romaji: 'mi', row: 'ma' },
  { char: 'む', romaji: 'mu', row: 'ma' },
  { char: 'め', romaji: 'me', row: 'ma' },
  { char: 'も', romaji: 'mo', row: 'ma' },
  // ya row
  { char: 'や', romaji: 'ya', row: 'ya' },
  { char: 'ゆ', romaji: 'yu', row: 'ya' },
  { char: 'よ', romaji: 'yo', row: 'ya' },
  // ra row
  { char: 'ら', romaji: 'ra', row: 'ra' },
  { char: 'り', romaji: 'ri', row: 'ra' },
  { char: 'る', romaji: 'ru', row: 'ra' },
  { char: 'れ', romaji: 're', row: 'ra' },
  { char: 'ろ', romaji: 'ro', row: 'ra' },
  // wa row
  { char: 'わ', romaji: 'wa', row: 'wa' },
  { char: 'を', romaji: 'wo', row: 'wa' },
  // n
  { char: 'ん', romaji: 'n', row: 'n' },
];

export const KATAKANA: KanaChar[] = [
  // a row
  { char: 'ア', romaji: 'a', row: 'a' },
  { char: 'イ', romaji: 'i', row: 'a' },
  { char: 'ウ', romaji: 'u', row: 'a' },
  { char: 'エ', romaji: 'e', row: 'a' },
  { char: 'オ', romaji: 'o', row: 'a' },
  // ka row
  { char: 'カ', romaji: 'ka', row: 'ka' },
  { char: 'キ', romaji: 'ki', row: 'ka' },
  { char: 'ク', romaji: 'ku', row: 'ka' },
  { char: 'ケ', romaji: 'ke', row: 'ka' },
  { char: 'コ', romaji: 'ko', row: 'ka' },
  // sa row
  { char: 'サ', romaji: 'sa', row: 'sa' },
  { char: 'シ', romaji: 'shi', row: 'sa' },
  { char: 'ス', romaji: 'su', row: 'sa' },
  { char: 'セ', romaji: 'se', row: 'sa' },
  { char: 'ソ', romaji: 'so', row: 'sa' },
  // ta row
  { char: 'タ', romaji: 'ta', row: 'ta' },
  { char: 'チ', romaji: 'chi', row: 'ta' },
  { char: 'ツ', romaji: 'tsu', row: 'ta' },
  { char: 'テ', romaji: 'te', row: 'ta' },
  { char: 'ト', romaji: 'to', row: 'ta' },
  // na row
  { char: 'ナ', romaji: 'na', row: 'na' },
  { char: 'ニ', romaji: 'ni', row: 'na' },
  { char: 'ヌ', romaji: 'nu', row: 'na' },
  { char: 'ネ', romaji: 'ne', row: 'na' },
  { char: 'ノ', romaji: 'no', row: 'na' },
  // ha row
  { char: 'ハ', romaji: 'ha', row: 'ha' },
  { char: 'ヒ', romaji: 'hi', row: 'ha' },
  { char: 'フ', romaji: 'fu', row: 'ha' },
  { char: 'ヘ', romaji: 'he', row: 'ha' },
  { char: 'ホ', romaji: 'ho', row: 'ha' },
  // ma row
  { char: 'マ', romaji: 'ma', row: 'ma' },
  { char: 'ミ', romaji: 'mi', row: 'ma' },
  { char: 'ム', romaji: 'mu', row: 'ma' },
  { char: 'メ', romaji: 'me', row: 'ma' },
  { char: 'モ', romaji: 'mo', row: 'ma' },
  // ya row
  { char: 'ヤ', romaji: 'ya', row: 'ya' },
  { char: 'ユ', romaji: 'yu', row: 'ya' },
  { char: 'ヨ', romaji: 'yo', row: 'ya' },
  // ra row
  { char: 'ラ', romaji: 'ra', row: 'ra' },
  { char: 'リ', romaji: 'ri', row: 'ra' },
  { char: 'ル', romaji: 'ru', row: 'ra' },
  { char: 'レ', romaji: 're', row: 'ra' },
  { char: 'ロ', romaji: 'ro', row: 'ra' },
  // wa row
  { char: 'ワ', romaji: 'wa', row: 'wa' },
  { char: 'ヲ', romaji: 'wo', row: 'wa' },
  // n
  { char: 'ン', romaji: 'n', row: 'n' },
];
