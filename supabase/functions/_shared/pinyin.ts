interface CharPinyin {
  /** 声母 */
  shengmu: string;
  /** 韵母 */
  yunmu: string;
  /** 音调 */
  tone: 0 | 1 | 2 | 3 | 4;
}

const shengmuList = [
  'zh', 'ch', 'sh',
  'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x',
  'r', 'z', 'c', 's', 'y', 'w',
]

const yunmuDic: Record<string, number> = {
  a: 0,
  ai: 0,
  an: 0,
  ang: 0,
  ao: 0,
  e: 0,
  ei: 0,
  en: 0,
  eng: 0,
  er: 0,
  i: 0,
  ia: 1,
  ian: 1,
  iang: 1,
  iao: 1,
  ie: 0,
  in: 0,
  ing: 0,
  io: 1,
  iong: 1,
  iu: 1,
  o: 0,
  ong: 0,
  ou: 0,
  u: 0,
  ua: 1,
  uai: 1,
  uan: 1,
  uang: 1,
  ui: 0,
  un: 0,
  uo: 1,
  ü: 0,
  üan: 0,
  üe: 0,
  ün: 0,
}

export const toneSvgPath = [
  'M3.35 8C2.60442 8 2 8.60442 2 9.35V10.35C2 11.0956 2.60442 11.7 3.35 11.7H17.35C18.0956 11.7 18.7 11.0956 18.7 10.35V9.35C18.7 8.60442 18.0956 8 17.35 8H3.35Z',
  'M16.581 3.71105C16.2453 3.27254 15.6176 3.18923 15.1791 3.52498L3.26924 12.6439C2.83073 12.9796 2.74743 13.6073 3.08318 14.0458L4.29903 15.6338C4.63478 16.0723 5.26244 16.1556 5.70095 15.8199L17.6108 6.70095C18.0493 6.3652 18.1327 5.73754 17.7969 5.29903L16.581 3.71105Z',
  'M1.70711 7.70712C1.31658 7.3166 1.31658 6.68343 1.70711 6.29291L2.41421 5.5858C2.80474 5.19528 3.4379 5.19528 3.82843 5.5858L9.31502 11.0724C9.70555 11.4629 10.3387 11.4629 10.7292 11.0724L16.2158 5.5858C16.6064 5.19528 17.2395 5.19528 17.63 5.5858L18.3372 6.29291C18.7277 6.68343 18.7277 7.3166 18.3372 7.70712L10.7292 15.315C10.3387 15.7056 9.70555 15.7056 9.31502 15.315L1.70711 7.70712Z',
  'M4.12282 3.71105C4.45857 3.27254 5.08623 3.18923 5.52474 3.52498L17.4346 12.6439C17.8731 12.9796 17.9564 13.6073 17.6207 14.0458L16.4048 15.6338C16.0691 16.0723 15.4414 16.1556 15.0029 15.8199L3.09303 6.70095C2.65452 6.3652 2.57122 5.73754 2.90697 5.29903L4.12282 3.71105Z',
]

export const convertPinyinChar = (rawPinyinChar: string): CharPinyin => {
  // bei3
  const tone = (parseInt(rawPinyinChar.slice(-1)) || 0) as 0 | 1 | 2 | 3 | 4
  const purePinyinValue = tone === 0 ? rawPinyinChar : rawPinyinChar.slice(0, -1)
  const shengmu = shengmuList.find(sm => purePinyinValue.startsWith(sm)) || ''
  const yunmu = purePinyinValue.slice(shengmu.length)
  return {
    shengmu,
    yunmu,
    tone,
  }
}

export const getTonePosition = (yunmu: string): number => {
  const tone = yunmuDic[yunmu] ?? -1
  return tone
}