import pinyin from 'pinyin/lib/pinyin'

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

export const convertPinyin = (rawChar: string): CharPinyin => {
  const rawPinyin = pinyin(rawChar, { style: 'tone2'})[0][0]
  const tone = (parseInt(rawPinyin.slice(-1)) || 0) as 0 | 1 | 2 | 3 | 4
  const purePinyinValue = tone === 0 ? rawPinyin : rawPinyin.slice(0, -1)
  const shengmu = shengmuList.find(sm => purePinyinValue.startsWith(sm)) || ''
  const yunmu = purePinyinValue.slice(shengmu.length)
  return {
    shengmu,
    yunmu,
    tone,
  }
}