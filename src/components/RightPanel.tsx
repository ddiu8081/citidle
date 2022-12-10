import { For, Show } from 'solid-js'
import type { Component } from 'solid-js'

import type { Check } from '../../types/types'
import { Char } from './Char'

interface Props {
  prompts: Check[]
  onPrompt: (prompt: string) => void
}

let input: HTMLInputElement

export const RightPanel: Component<Props> = (props) => {
  const handleClick = () => {
    props.onPrompt(input.value)
    input.value = ''
  }
  return (
    <div
      h-120 w-48
    >
      <div flex="~ col">
        <Show when={props.prompts.length}>
          <div flex="~ col" gap-4 mb-6>
            <For each={props.prompts}>
              {(prompt) => (
                <div flex="~ row">
                  <For each={prompt.word}>
                    {(item) => (
                      <Char char={item.detail.char} result={item} />
                    )}
                  </For>
                  {/* <p text-white text-2xl>{ prompt.location }</p> */}
                </div>
              )}
            </For>
          </div>
        </Show>
        <div>
          <input
            ref={input!} type="text"
            box-border
            h-10 w-full px-2
            bg-transparent
            border-1 border-dark-100 outline-none
            text="white base"
            focus="border-dark-50"
          />
          <button
            onClick={handleClick}
            block h-10 mt-2 w-full
            bg-dark-100 border-0
            text="white sm"
            hover="bg-dark-50"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  )
}