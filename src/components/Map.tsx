import { onMount, createEffect } from 'solid-js'
import type { Component } from 'solid-js'
import L from 'leaflet'

import type { Check } from '../utils/check'

let instance: L.Map
let dom: HTMLDivElement
let lastPromptCenter: [number, number]

interface Props {
  results: Check[]
}

const pointOptions = {
  radius: 10,
  color: '#ffffff',
  weight: 10,
}

const buildMap = (container: HTMLElement) => {
  console.log('buildMap')
  instance = L.map(container, {
    center: [37, 110],
    zoom: 5,
    attributionControl: false,
    zoomControl: false,
    // dragging: false,
    layers: [
      // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png'),
      // L.tileLayer('https://wprd02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=8&scl=2'),
      // L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'),
      // L.tileLayer('http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'),
    ],
  })
}

export const addMark = (center: [number, number], positionJudge: string) => {
  if (instance) {
    // const marker = L.marker(center).addTo(instance)

    // var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    // svgElement.setAttribute('viewBox', '0 0 32 32');
    // svgElement.innerHTML = '<path fill="currentColor" d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z"></path>';
    // const latLngBounds = L.latLngBounds([center[0] - 1, center[1] - 1], [center[0] + 1, center[1] + 1])

    // var svgOverlay = L.svgOverlay(svgElement, latLngBounds).addTo(instance)

    // draw lines
    if (lastPromptCenter) {
      const line = L.polyline([lastPromptCenter, center], {
        color: '#ffffff7f',
        weight: 2,
      }).addTo(instance)
    }
    lastPromptCenter = center

    // Add marker
    const marker = L.circle(center, pointOptions).addTo(instance)
    marker.bindTooltip(positionJudge).openTooltip()

    // Fit bounds
    instance.flyTo(center)
  }
}

export const Map: Component<Props> = (props) => {
  let mapDom: HTMLDivElement

  onMount(() => buildMap(mapDom!))

  createEffect(() => {
    console.log("The count is now", props.results)
    if (props.results.length > 0) {
      const lastResult = props.results[props.results.length - 1]
      addMark(lastResult.judge.location, lastResult.location)
    }
  })
  return (
    <>
      <div
        ref={mapDom!}
        h-120 w-120
        bg="#212121"
        border border-dark-200
      ></div>
    </>
  )
}