<template>
  <cesium-map @select="handleSelect" v-model="value" />
  <panel-menu v-model:visible="panelVisible" />
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const value = ref<string>('base')
  const panelVisible = ref<boolean>(false)

  const handleSelect = (value: string) => {
    router.push({ name: value })
  }
</script>
