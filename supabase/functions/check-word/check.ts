import { convertPinyinChar } from '../_shared/pinyin.ts'
import { checkLatLng } from '../_shared/geo.ts'
import type { Check, CharCheck, LatLng } from '../_shared/types.ts'
import { getCityData, getAnswerCityData } from './db.ts'

export const checkWord = async (prompt: string): Promise<Check> => {
  const promptCity = await getCityData(prompt)
  const answerCity = await getAnswerCityData()

  const promptChars = promptCity.name.split('')
  const answerChars = answerCity.name.split('')

  const charPinyinArr = promptCity.pinyin.split(' ').map(convertPinyinChar)
  const charDetailArr = {
    charList: promptChars,
    shengmuList: charPinyinArr.map(p => p.shengmu),
    yunmuList: charPinyinArr.map(p => p.yunmu),
    toneList: charPinyinArr.map(p => p.tone),
  }

  const answerPinyinArr = answerCity.pinyin.split(' ').map(convertPinyinChar)
  const answerDetailArr = {
    charList: answerChars,
    shengmuList: answerPinyinArr.map(p => p.shengmu),
    yunmuList: answerPinyinArr.map(p => p.yunmu),
    toneList: answerPinyinArr.map(p => p.tone),
  }

  const wordCheckResult: CharCheck[] = []
  promptChars.forEach((judgeChar, index) => {
    if (judgeChar === answerChars[index]) {
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
  const promptCenter: LatLng = [promptCity.lat, promptCity.lng]
  const answerCenter: LatLng = [answerCity.lat, answerCity.lng]
  const locationCheckResult = checkLatLng(promptCenter, answerCenter)
  const result = {
    judge: {
      word: prompt,
      location: promptCenter,
      province: promptCity.province
    },
    word: wordCheckResult,
    location: locationCheckResult,
    same_province: promptCity.province.id === answerCity.province.id,
  }
  return result
}

import { MatchStatus } from '../_shared/types.ts'

function matchComponent<T>(prompt: T, judgeList: T[], judgeIndex: number): MatchStatus {
  if (prompt === judgeList[judgeIndex]) {
    return MatchStatus.exact
  }
  if (judgeList.includes(prompt)) {
    return MatchStatus.misplaced
  }
  return MatchStatus.missed
}