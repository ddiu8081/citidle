<script setup lang="ts">
import L from 'leaflet';
import { onMounted } from 'vue';

let instance = $ref<L.Map | null>(null)
const mapDom = $ref<HTMLElement | null>(null)

const addMark = (center: [number, number]) => {
  if (instance) {
    const marker = L.marker(center).addTo(instance);
    instance.flyTo(center)
  }
}

onMounted(() => {
  if (!mapDom) {
    return
  }
  instance = L.map(mapDom, {
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
})

defineExpose({
  addMark,
})
</script>

<template>
  <div ref="mapDom" h-120 bg="#242424"></div>
</template>
