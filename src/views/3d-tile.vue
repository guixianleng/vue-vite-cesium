<template>
  <cesium-map @select="handleSelect" :use-init-map="false" :id-name="idName" @on-map-ready="mapReady" v-model="value" />
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import use3DTitleSet from '/@/hooks/demo/3DTitleSet'

  const router = useRouter()
  const idName = ref<string>('3dTile')
  const value = ref<string>('tile')

  const handleSelect = (value: string) => {
    router.push({ name: value })
  }

  const mapReady = () => {
    use3DTitleSet(idName.value)
  }
</script>
