import type { Component } from 'solid-js'

export const Header: Component = () => {
  return (
    <header
      flex="~ row" items-center justify-center
      h-12 font-bold
      border-b border-dark-200
    >
      Citidle · 城市猜
    </header>
  )
}