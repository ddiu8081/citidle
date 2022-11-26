import { createSignal, For } from 'solid-js'
import type { Component } from 'solid-js'

import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Map } from './components/Map'
import { RightPanel } from './components/RightPanel'

import { cityMap } from './cityMap'
import pinyin from 'pinyin/lib/pinyin'

import { checkWord, type Check } from './utils/check'

let input: HTMLInputElement

import debugResultArr from './debug'

const [resultArr, setResultArr] = createSignal<Check[]>([])
// const [resultArr, setResultArr] = createSignal<Check[]>(debugResultArr)

const answerIndex = Math.floor(Math.random() * Object.keys(cityMap).length)
const answer = Object.keys(cityMap)[answerIndex]
// const answer = '赣州'
console.log('answer', answer)

const handlePrompt = (prompt: string) => {
  // TODO: 厦门 => sha men
  const rawPinyin = pinyin(prompt, { style: 'tone2' })
  console.log(rawPinyin)
  
  if (!cityMap[prompt]) {
    return
  }
  setResultArr([...resultArr(), checkWord(prompt, answer)])
  if (prompt === answer) {
    console.log('bingo')
  }
}

const App: Component = () => {
  return (
    <>
      <Header />
      <main
        flex="~ row" justify-center gap-6
        my-8
      >
        <Map results={resultArr()} />
        <RightPanel prompts={resultArr()} onPrompt={handlePrompt} />
      </main>
      <Footer />
    </>
  )
}

export default App
