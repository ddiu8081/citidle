<script setup lang="ts">
import confetti from 'canvas-confetti'
import Char from './components/Char.vue'
import Map from './components/Map.vue'
import { cityMap } from './cityMap'

import { startListen } from 'blive-message-listener/browser'
import { type MsgHandler } from 'blive-message-listener'

interface CharCheck {
  char: string
  status: 'right' | 'wrong' | 'normal'
}

interface Check {
  word: CharCheck[]
  location: string
}

let text = $ref('')
const mapRef = $ref<InstanceType<typeof Map> | null>(null)
const history = $ref<any>([])
const resultArr = $ref<Check[]>([])
const log = $ref<string[]>([])

const handler: MsgHandler = {
onIncomeDanmu: (msg) => {
  console.log(msg.id, msg.body.content)
  log.push(`${msg.body.user.uname}: ${msg.body.content}`)
  text = msg.body.content
  handleClick()
},
}
startListen(652581, handler)

const handleClick = () => {
  if (!cityMap[text]) {
    return
  }
  if (mapRef && cityMap[text]) {
    mapRef.addMark(cityMap[text])
  }
  history.push(text)
  resultArr.push(checkWord(text))
  if (text === answer) {
    confetti({
      angle: 60,
      spread: 55,
      origin: { x: -0.05 },
    })
    confetti({
      angle: 120,
      spread: 55,
      origin: { x: 1.05 },
    })
    setTimeout(() => {
      location.reload()
    }, 10000);
  }
}

const answerIndex = Math.floor(Math.random() * Object.keys(cityMap).length)
const answer = Object.keys(cityMap)[answerIndex]
const answerCenter = cityMap[answer]

const checkWord = (word: string) => {
  const charArr = word.split('')
  const answerArr = answer.split('')
  const wordCheckResult: CharCheck[] = []
  charArr.forEach((char, index) => {
    if (char === answerArr[index]) {
      wordCheckResult.push({
        char,
        status: 'right',
      })
    } else if (answerArr.includes(char)) {
      wordCheckResult.push({
        char,
        status: 'wrong',
      })
    } else {
      wordCheckResult.push({
        char,
        status: 'normal',
      })
    }
  })
  const locationCheckResult = checkLatLng(cityMap[word])
  return {
    word: wordCheckResult,
    location: locationCheckResult,
  }
}

const checkLatLng = ([lat, lng]: [number, number]) => {
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

</script>

<template>
  <h1 text-yellow-600>Citidle</h1>
  <main>
    <div text-white m="x-4 y-6" w-180 h-120>
      <Map ref="mapRef" />
    </div>
  </main>
  <input type="text" v-model="text" mt-3>
  <button @click="handleClick">Click</button>
  <p text-sm text-white v-for="logItem in log">{{ logItem }}</p>
  <div pos-absolute top-4 left-4>
    <div v-for="prompt in resultArr">
      <Char v-for="item in prompt.word" :char="item.char" :result="item.status" />
      <p text-white text-2xl>{{ prompt.location }}</p>
    </div>
  </div>
</template>
