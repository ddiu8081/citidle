import { createSignal, For } from 'solid-js'
import type { Component } from 'solid-js'
import { Char } from './components/Char'
import { Map } from './components/Map'

import { cityMap } from './cityMap'
import pinyin from 'pinyin/lib/pinyin'

import { checkWord, type Check } from './utils/check'

let input: HTMLInputElement

const [resultArr, setResultArr] = createSignal<Check[]>([])

const answerIndex = Math.floor(Math.random() * Object.keys(cityMap).length)
const answer = Object.keys(cityMap)[answerIndex]
// const answer = '赣州'
console.log('answer', answer)

const handleClick = () => {
  // TODO: 厦门 => sha men
  const judgeText = input!.value
  const rawPinyin = pinyin(judgeText, { style: 'tone2' })
  console.log(rawPinyin)
  
  if (!cityMap[judgeText]) {
    return
  }
  setResultArr([...resultArr(), checkWord(judgeText, answer)])
  if (judgeText === answer) {
    console.log('bingo')
  }
}

const App: Component = () => {
  return (
    <>
      <h1 text-yellow-600>Citidle</h1>
      <main>
        <div text-white m="x-4 y-6" w-180 h-120>
          <Map results={resultArr()} />
        </div>
      </main>
      <input ref={input!} type="text" mt-3 />
      <button onClick={handleClick}>Click</button>
      <div pos-absolute top-4 left-4>
        <For each={resultArr()}>
          {(prompt) => (
            <>
              <For each={prompt.word}>
                {(item) => (
                  <Char char={item.detail.char} result={item} />
                )}
              </For>
              <p text-white text-2xl>{ prompt.location }</p>
            </>
          )}
        </For>
      </div>
    </>
  )
}

export default App
