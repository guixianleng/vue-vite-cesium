<template>
  <cesium-map @select="handleSelect" @map-ready="mapReady" v-model="value" />
</template>
<script setup lang="ts">
  import { ref, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import useSetOSMBuildings from '/@/hooks/demo/setOSMBuildings'
  import useRemoveTools from '/@/hooks/removeTools'

  const router = useRouter()
  const value = ref<string>('osm')

  const { removePrimitives } = useRemoveTools()

  const handleSelect = (value: string) => {
    router.push({ name: value })
  }

  const mapReady = () => {
    useSetOSMBuildings(window.CViewer)
  }

  onUnmounted(() => {
    removePrimitives(window.CViewer)
  })
</script>
