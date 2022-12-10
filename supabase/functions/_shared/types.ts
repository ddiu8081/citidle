export interface CharPinyin {
  /** 声母 */
  shengmu: string;
  /** 韵母 */
  yunmu: string;
  /** 音调 */
  tone: 0 | 1 | 2 | 3 | 4;
}

export interface Check {
  judge: {
    word: string
    location: LatLng
    province: {
      id: number
      name: string
    }
  }
  word: CharCheck[]
  location: string
  same_province: boolean
}

export interface CharCheck {
  detail: {
    char: string
    pinyin: {
      shengmu: string
      yunmu: string
      tone: 0 | 1 | 2 | 3 | 4
    }
  }
  match: {
    char: MatchStatus
    pinyin: {
      shengmu: MatchStatus
      yunmu: MatchStatus
      tone: MatchStatus
    }
  }
}

export enum MatchStatus {
  missed = -1,
  misplaced = 0,
  exact = 1,
}

export type LatLng = [number, number]
