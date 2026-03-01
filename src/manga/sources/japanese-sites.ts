export interface JapaneseMangaSite {
  id: string;
  name: string;
  nameJa: string;
  url: string;
  publisher: string;
  description: string;
  freeModel: 'free' | 'first-read-free' | 'partial-free';
  icon: string;
}

export const JAPANESE_MANGA_SITES: JapaneseMangaSite[] = [
  {
    id: 'shonenjump-plus',
    name: '少年Jump+',
    nameJa: '少年ジャンプ+',
    url: 'https://shonenjumpplus.com',
    publisher: '集英社',
    description: '連載初回免費。チェンソーマン、ダンダダン、SPY×FAMILY 等',
    freeModel: 'first-read-free',
    icon: 'J+',
  },
  {
    id: 'tonari-yj',
    name: '鄰座的Young Jump',
    nameJa: 'となりのヤングジャンプ',
    url: 'https://tonarinoyj.jp',
    publisher: '集英社',
    description: '免費網路漫畫。ワンパンマン 等',
    freeModel: 'free',
    icon: 'YJ',
  },
  {
    id: 'comic-walker',
    name: 'ComicWalker (カドコミ)',
    nameJa: 'カドコミ',
    url: 'https://comic-walker.com',
    publisher: '角川',
    description: '初回免費。とある科学の超電磁砲、Re:ゼロ 等',
    freeModel: 'first-read-free',
    icon: 'CW',
  },
  {
    id: 'gangan-online',
    name: 'Gangan Online',
    nameJa: 'ガンガンONLINE',
    url: 'https://www.ganganonline.com',
    publisher: 'スクウェア・エニックス',
    description: '免費連載。無能なナナ、薬屋のひとりごと 等',
    freeModel: 'free',
    icon: 'GG',
  },
  {
    id: 'magapoke',
    name: 'Magazine Pocket',
    nameJa: 'マガポケ',
    url: 'https://pocket.shonenmagazine.com',
    publisher: '講談社',
    description: '部分免費。黙示録の四騎士、ブルーロック 等',
    freeModel: 'partial-free',
    icon: 'MP',
  },
  {
    id: 'comic-days',
    name: 'Comic Days',
    nameJa: 'コミックDAYS',
    url: 'https://comic-days.com',
    publisher: '講談社',
    description: '初回免費。天国大魔境、虚構推理 等',
    freeModel: 'first-read-free',
    icon: 'CD',
  },
  {
    id: 'sunday-webry',
    name: 'Sunday Webry',
    nameJa: 'サンデーうぇぶり',
    url: 'https://www.sunday-webry.com',
    publisher: '小学館',
    description: '部分免費。名探偵コナン、フリーレン 等',
    freeModel: 'partial-free',
    icon: 'SW',
  },
  {
    id: 'pixiv-comic',
    name: 'pixiv Comic',
    nameJa: 'pixivコミック',
    url: 'https://comic.pixiv.net',
    publisher: 'pixiv',
    description: '免費連載。多出版社作品集合',
    freeModel: 'free',
    icon: 'px',
  },
];
