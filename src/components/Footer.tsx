import type { Component } from 'solid-js'

export const Footer: Component = () => {
  return (
    <footer op-80>
      <p mt-1 text-center text-xs text-truegray-500>
        <span pr-1>Made by</span>
        <a
          text-truegray-500 hover:text-truegray-400
          href="https://ddiu.io" target="_blank"
        >
          Diu
        </a>
        <span px-1>|</span>
        <a
          text-truegray-500 hover:text-truegray-400
          href="https://github.com/ddiu8081/citidle" target="_blank"
        >
          Source Code
        </a>
      </p>
    </footer>
  )
}