<script setup lang="ts">
import { convertPinyin } from '../utils/pinyin'
import pinyin from 'pinyin/lib/pinyin'
import type { CharCheck, MatchStatus } from '../utils/check'

const props = defineProps<{
  char: string
  result: CharCheck
}>()

const colorDict = [
  'text-white',
  'text-yellow-500',
  'text-green-500',
]
</script>

<template>
  <div inline-flex flex-col items-center my-1>
    <!-- <div
      text-xl
      :class="colorDict[result]"
    >
      {{ convertPinyin(rawPinyin) }}
    </div> -->
    <div mb-1>
      <span :class="colorDict[props.result.match.pinyin.shengmu + 1]">{{ props.result.detail.pinyin.shengmu }}</span>
      <span :class="colorDict[props.result.match.pinyin.yunmu + 1]">{{ props.result.detail.pinyin.yunmu }}</span>
      <span :class="colorDict[props.result.match.pinyin.tone + 1]">{{ props.result.detail.pinyin.tone }}</span>
    </div>
    <div
      flex items-center justify-center
       text-2xl
      border border-white w-12 h-12
      :class="colorDict[props.result.match.char + 1]"
    >
      {{ props.result.detail.char }}
    </div>
  </div>
</template>
