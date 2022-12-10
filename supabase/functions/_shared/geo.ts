export const checkLatLng = ([lat, lng]: [number, number], answerCenter: [number, number]) => {
  const [answerLat, answerLng] = answerCenter
  const latDiff = answerLat - lat
  const lngDiff = answerLng - lng
  enum Judge {
    'less' = -1,
    'equal' = 0,
    'greater' = 1,
  }
  const latJudge: Judge = latDiff > 1 ? Judge.greater : latDiff < -1 ? Judge.less : Judge.equal
  const lngJudge: Judge = lngDiff > 1 ? Judge.greater : lngDiff < -1 ? Judge.less : Judge.equal
  // ➡️⬅️⬆️⬇️↗️↘️↙️↖️✅
  if (latJudge === Judge.equal) {
    if (lngJudge === Judge.equal) {
      return '✅'
    } else if (lngJudge === Judge.greater) {
      return '➡️'
    } else {
      return '⬅️'
    }
  } else if (latJudge === Judge.greater) {
    if (lngJudge === Judge.equal) {
      return '⬆️'
    } else if (lngJudge === Judge.greater) {
      return '↗️'
    } else {
      return '↖️'
    }
  } else {
    if (lngJudge === Judge.equal) {
      return '⬇️'
    } else if (lngJudge === Judge.greater) {
      return '↘️'
    } else {
      return '↙️'
    }
  }
}