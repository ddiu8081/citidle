import type { Component, JSX } from 'solid-js'
import type { CharCheck } from '../../types/types'
import { getTonePosition, toneSvgPath } from '../utils/pinyin'

interface Props {
  char: string
  result: CharCheck
}

const palette = {
  foregroundColor: [
    '#999999',
    '#e2c97e',
    '#66b395',
  ],
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
  const detail = props.result.detail
  const match = props.result.match
  const tonePos = getTonePosition(detail.pinyin.yunmu)
  const needReplaceToneI = tonePos === 0 && detail.pinyin.yunmu[0] === 'i'
  const needShortenToneOffset = tonePos === 1 && detail.pinyin.yunmu[0] === 'i'

  const toneLeftOffset = needReplaceToneI ? -0.1 : (tonePos * 0.64 + (needShortenToneOffset ? -0.36 : 0))
  const toneStyle: JSX.CSSProperties = {
    position: 'absolute',
    top: '-0.02em',
    left: `${toneLeftOffset}em`,
    width: '0.5em',
    height: '0.5em',
    color: palette.foregroundColor[match.pinyin.tone + 1],
  }

  return (
    <div inline-flex flex-col items-center w-11>
      <div mb-1 text-sm font-sans>
        <span class={palette.foreground[match.pinyin.shengmu + 1]}>
          { detail.pinyin.shengmu }
        </span>
        <span
          class={palette.foreground[match.pinyin.yunmu + 1]}
          relative
        >
          { needReplaceToneI ? detail.pinyin.yunmu.replace('i', 'ı') : detail.pinyin.yunmu }
          <div style={toneStyle}>
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-ok absolute w-100% top-0 left-0">
              <path
                d={toneSvgPath[detail.pinyin.tone - 1]}
                fill="currentColor"
              />
            </svg>
          </div>
        </span>
      </div>
      <div
        flex items-center justify-center
        text="xl white"
        w-10 h-10
        class={palette.background[match.char + 1]}
      >
        { detail.char }
      </div>
    </div>
  )
}