import { MatchStatus } from '../../types/types'
import type { Check, CharCheck } from '../../types/types'

const charDict = {
  charMissed: '⬜️',
  charMisplaced: '🟨',
  charExact: '🟩',
  pinyinMisplaced: '🟡',
  pinyinExactMisplaced: '🟠',
  pinyinExact: '🟢',
}

const generateCharShareText = ({ match }: CharCheck): string => {
  if (match.char === MatchStatus.exact) {
    return charDict.charExact
  }
  if (match.char === MatchStatus.misplaced) {
    return charDict.charMisplaced
  }
  if (match.pinyin.shengmu === MatchStatus.exact && match.pinyin.yunmu === MatchStatus.exact) {
    return charDict.pinyinExact
  }
  if (match.pinyin.shengmu === MatchStatus.exact || match.pinyin.yunmu === MatchStatus.exact) {
    return charDict.pinyinExactMisplaced
  }
  if (match.pinyin.shengmu === MatchStatus.misplaced || match.pinyin.yunmu === MatchStatus.misplaced) {
    return charDict.pinyinMisplaced
  }
  return charDict.charMissed
}

export const generateShareText = (result: Check[]): string => {
  const shareTexts = ['Citidle', '']
  result.forEach((check) => {
    const charShareText = check.word.map(generateCharShareText)
    const provinceShareText = check.same_province ? '🔶' : ''
    const locationShareText = check.location
    const shareText = `${charShareText.join('')} ${provinceShareText}${locationShareText}`
    shareTexts.push(shareText)
  })
  return shareTexts.join('\n')
}