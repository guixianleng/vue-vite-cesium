<template>
  <cesium-map @select="handleSelect" v-model="value" />
  <panel-menu v-model:visible="panelVisible" @on-click="handleOperate" />
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import useMeasureLineSpace from '/@/hooks/measureLine'
  import useMeasureAreaSpace from '/@/hooks/measureArea'

  const router = useRouter()
  const value = ref<string>('base')
  const panelVisible = ref<boolean>(false)

  const handleSelect = (value: string) => {
    router.push({ name: value })
  }

  const handleOperate = (type: string) => {
    console.log(type)
    switch (type) {
      case 'line':
        useMeasureLineSpace(window.CViewer)
        break
      case 'area':
        useMeasureAreaSpace(window.CViewer)
        break
      default:
        break
    }
  }
</script>
