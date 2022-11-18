<script setup lang="ts">
import confetti from 'canvas-confetti'
import Char from './components/Char.vue'
import Map from './components/Map.vue'
import { cityMap } from './cityMap'
import pinyin from 'pinyin/lib/pinyin'
import { startListen } from 'blive-message-listener/browser'
import { type MsgHandler } from 'blive-message-listener'

import { checkWord, type Check } from './utils/check'

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
  const rawPinyin = pinyin(text, { style: 'tone2' })
  console.log(rawPinyin)
  
  if (!cityMap[text]) {
    return
  }
  if (mapRef && cityMap[text]) {
    mapRef.addMark(cityMap[text])
  }
  history.push(text)
  resultArr.push(checkWord(text, answer))
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
// const answer = '赣州'

console.log('answer', answer)

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
      <Char v-for="item in prompt.word" :char="item.detail.char" :result="item" />
      <p text-white text-2xl>{{ prompt.location }}</p>
    </div>
  </div>
</template>
