import { convertPinyin } from './pinyin'
import { cityMap } from '../cityMap'

export enum MatchStatus {
  missed = -1,
  misplaced = 0,
  exact = 1,
}

export interface CharCheck {
  detail: {
    char: string
    pinyin: {
      shengmu: string
      yunmu: string
      tone: 0 | 1 | 2 | 3 | 4
    }
  }
  match: {
    char: MatchStatus
    pinyin: {
      shengmu: MatchStatus
      yunmu: MatchStatus
      tone: MatchStatus
    }
  }
}

export interface Check {
  word: CharCheck[]
  location: string
}

function matchComponent<T>(prompt: T, judgeList: T[], judgeIndex: number): MatchStatus {
  if (prompt === judgeList[judgeIndex]) {
    return MatchStatus.exact
  }
  if (judgeList.includes(prompt)) {
    return MatchStatus.misplaced
  }
  return MatchStatus.missed
}

export const checkWord = (prompt: string, answer: string): Check => {
  const charArr = prompt.split('')
  const answerArr = answer.split('')

  // 北京
  // ['北', '京']
  // ['b', 'j']
  // ['ei', 'ing']
  // [3, 1]

  const charPinyinArr = charArr.map(convertPinyin)
  const charDetailArr = {
    charList: charArr,
    shengmuList: charPinyinArr.map(p => p.shengmu),
    yunmuList: charPinyinArr.map(p => p.yunmu),
    toneList: charPinyinArr.map(p => p.tone),
  }

  const answerPinyinArr = answerArr.map(convertPinyin)
  const answerDetailArr = {
    charList: answerArr,
    shengmuList: answerPinyinArr.map(p => p.shengmu),
    yunmuList: answerPinyinArr.map(p => p.yunmu),
    toneList: answerPinyinArr.map(p => p.tone),
  }

  const wordCheckResult: CharCheck[] = []
  charArr.forEach((judgeChar, index) => {
    if (judgeChar === answerArr[index]) {
      wordCheckResult.push({
        detail: {
          char: judgeChar,
          pinyin: {
            shengmu: charDetailArr.shengmuList[index],
            yunmu: charDetailArr.yunmuList[index],
            tone: charDetailArr.toneList[index],
          },
        },
        match: {
          char: 1,
          pinyin: {
            shengmu: 1,
            yunmu: 1,
            tone: 1,
          }
        }
      })
    } else {
      wordCheckResult.push({
        detail: {
          char: judgeChar,
          pinyin: {
            shengmu: charDetailArr.shengmuList[index],
            yunmu: charDetailArr.yunmuList[index],
            tone: charDetailArr.toneList[index],
          },
        },
        match: {
          char: matchComponent(judgeChar, answerDetailArr.charList, index),
          pinyin: {
            shengmu: matchComponent(charDetailArr.shengmuList[index], answerDetailArr.shengmuList, index),
            yunmu: matchComponent(charDetailArr.yunmuList[index], answerDetailArr.yunmuList, index),
            tone: matchComponent(charDetailArr.toneList[index], answerDetailArr.toneList, index),
          }
        }
      })
    }
  })
  const answerCenter = cityMap[answer]
  const locationCheckResult = checkLatLng(cityMap[prompt], answerCenter)
  const result = {
    word: wordCheckResult,
    location: locationCheckResult,
  }
  console.log('result', result)
  return result
}

const checkLatLng = ([lat, lng]: [number, number], answerCenter: [number, number]) => {
  const [answerLat, answerLng] = answerCenter
  const latDiff = answerLat - lat
  const lngDiff = answerLng - lng
  enum Judge {
    'less' = -1,
    'equal' = 0,
    'greater' = 1,
  }
  const latJudge: Judge = latDiff > 1 ? Judge.greater : latDiff < -1 ? Judge.less : Judge.equal
  const lngJudge: Judge = lngDiff > 1 ? Judge.greater : lngDiff < -1 ? Judge.less : Judge.equal
  // ➡️⬅️⬆️⬇️↗️↘️↙️↖️✅
  if (latJudge === Judge.equal) {
    if (lngJudge === Judge.equal) {
      return '✅'
    } else if (lngJudge === Judge.greater) {
      return '➡️'
    } else {
      return '⬅️'
    }
  } else if (latJudge === Judge.greater) {
    if (lngJudge === Judge.equal) {
      return '⬆️'
    } else if (lngJudge === Judge.greater) {
      return '↗️'
    } else {
      return '↖️'
    }
  } else {
    if (lngJudge === Judge.equal) {
      return '⬇️'
    } else if (lngJudge === Judge.greater) {
      return '↘️'
    } else {
      return '↙️'
    }
  }
  return ''
}