
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabase } from '../_shared/supabase.ts'

import { convertPinyinChar } from '../_shared/pinyin.ts'
import { checkLatLng } from '../_shared/geo.ts'
import { MatchStatus } from '../_shared/types.ts'
import type { Check, CharCheck, LatLng } from '../_shared/types.ts'

interface City {
  name: string
  pinyin: string
  lat: number
  lng: number
  province: string
}

const checkWord = async (prompt: string): Promise<Check> => {
  const promptCity = await getCityData(prompt)
  const answerCity = await getAnswerCityData()

  const promptChars = promptCity.name.split('')
  const answerChars = answerCity.name.split('')

  // 北京
  // ['北', '京']
  // ['b', 'j']
  // ['ei', 'ing']
  // [3, 1]

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
    },
    word: wordCheckResult,
    location: locationCheckResult,
  }
  return result
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

const getCityData = async (cityName: string) => {
  const response = await supabase
    .from('citys')
    .select()
    .eq('name', cityName)
  const city: City = response.data?.[0]
  return city
}

const getAnswerCityData = async () => {
  const answer = await supabase
    .from('daily_answers')
    .select('date, city (*)')
    .eq('date', new Date().toISOString().split('T')[0])
  const city: City = answer.data?.[0].city
  return city
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const { judgeWord } = await req.json()

  const result = await checkWord(judgeWord)
  return new Response(JSON.stringify(result), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })
})
