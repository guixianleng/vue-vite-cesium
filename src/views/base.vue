<template>
  <cesium-map @select="handleSelect" v-model="value" @map-ready="mapOnReady" />
  <panel-menu v-model:visible="panelVisible" />
</template>
<script setup lang="ts">
  import { ref, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import useGlobalRotate from '/@/hooks/functional/useRotate'

  const router = useRouter()

  const value = ref<string>('base')
  const panelVisible = ref<boolean>(false)

  const handleSelect = (value: string) => {
    router.push({ name: value })
  }
  const mapOnReady = () => {
    const { startRotate } = useGlobalRotate(window.CViewer)
    startRotate({ multiplier: 300 })
  }
  onUnmounted(() => {
    const { stopRotate } = useGlobalRotate(window.CViewer)
    stopRotate()
  })
</script>
