<script setup lang="ts">
import pinyin from 'pinyin/lib/pinyin'

const props = defineProps<{
  char: string
  result: 'right' | 'wrong' | 'normal'
}>()

const colorDict = {
  right: 'text-green-500',
  wrong: 'text-yellow-500',
  normal: 'text-white',
}
</script>

<template>
  <div inline-flex flex-col items-center my-1>
    <div
      text-xl
      :class="colorDict[result]"
    >
      {{ pinyin(props.char)[0][0] }}
    </div>
    <div
      flex items-center justify-center
       text-2xl
      border border-white w-12 h-12
      :class="colorDict[result]"
    >
      {{ props.char }}
    </div>
  </div>
</template>
