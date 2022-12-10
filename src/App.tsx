import { createSignal, For } from 'solid-js'
import type { Component } from 'solid-js'

import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { MapComponent } from './components/Map'
import { RightPanel } from './components/RightPanel'

import { supabase } from './utils/db'
import type { Check } from '../types/types'

import debugResultArr from './debug'

const [resultArr, setResultArr] = createSignal<Check[]>([])
// const [resultArr, setResultArr] = createSignal<Check[]>(debugResultArr)

const handlePrompt = async (prompt: string) => {
  const checkRes = await supabase.functions.invoke('check-word', {
    body: {
      judgeWord: prompt,
    }
  })
  if (checkRes.error || !checkRes.data) {
    console.log(checkRes.error)
    return
  }
  setResultArr([...resultArr(), checkRes.data])
}

const App: Component = () => {
  return (
    <>
      <Header />
      <main flex="~ row" justify-center gap-6 my-8>
        <MapComponent results={resultArr()} />
        <RightPanel prompts={resultArr()} onPrompt={handlePrompt} />
      </main>
      <Footer />
    </>
  )
}

export default App
