import { onMount, createEffect } from 'solid-js'
import type { Component } from 'solid-js'
import L from 'leaflet'

import type { Check } from '../utils/check'

let instance: L.Map

interface Props {
  results: Check[]
}

const buildMap = (container: HTMLElement) => {
  console.log('buildMap')
  instance = L.map(container, {
    center: [37, 110],
    zoom: 3,
    attributionControl: false,
    zoomControl: false,
    // dragging: false,
    layers: [
      // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png'),
      L.tileLayer('https://wprd02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=8&scl=2'),
      // L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'),
      // L.tileLayer('http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'),
    ],
  })
}

export const addMark = (center: [number, number]) => {
  if (instance) {
    const marker = L.marker(center).addTo(instance);
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
      addMark(lastResult.judge.location)
    }
  })
  return <div ref={mapDom!} h-120 bg="#242424"></div>
}