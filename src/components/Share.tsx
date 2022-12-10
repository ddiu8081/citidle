import type { Component} from 'solid-js'
import type { CharCheck } from '../../types/types'

interface Props {
  char: string
  result: CharCheck
}


export const Share: Component<Props> = (props) => {
  return (
    <div>
      Result Share
    </div>
  )
}