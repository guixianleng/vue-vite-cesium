<template>
  <cesium-map @select="handleSelect" @map-ready="mapReady" v-model="value" />
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import use3DTitleSet from '/@/hooks/demo/3DTitleSet'

  const router = useRouter()
  const value = ref<string>('tile')

  const handleSelect = (value: string) => {
    router.push({ name: value })
  }

  const mapReady = () => {
    use3DTitleSet(window.CViewer)
  }
</script>
