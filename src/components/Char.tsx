import type { Component } from 'solid-js'
import type { CharCheck } from '../utils/check'

interface Props {
  char: string
  result: CharCheck
}

const palette = {
  foreground: [
    'text-[#999999]',
    'text-[#e2c97e]',
    'text-[#66b395]',
  ],
  background: [
    'bg-[#393939]',
    'bg-[#9D8849]',
    'bg-[#568A76]',
  ],
}

export const Char: Component<Props> = (props) => {
  return (
    <div inline-flex flex-col items-center w-11>
      <div mb-1 text-xs>
        <span class={palette.foreground[props.result.match.pinyin.shengmu + 1]}>{ props.result.detail.pinyin.shengmu }</span>
        <span class={palette.foreground[props.result.match.pinyin.yunmu + 1]}>{ props.result.detail.pinyin.yunmu }</span>
        <span class={palette.foreground[props.result.match.pinyin.tone + 1]}>{ props.result.detail.pinyin.tone }</span>
      </div>
      <div
        flex items-center justify-center
        text="xl white"
        w-10 h-10
        class={palette.background[props.result.match.char + 1]}
      >
        { props.result.detail.char }
      </div>
    </div>
  )
}