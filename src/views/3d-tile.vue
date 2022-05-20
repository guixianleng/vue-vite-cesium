<template>
  <cesium-map @select="handleSelect" :use-init-map="false" v-model="value" />
</template>
<script setup lang="ts">
  import { ref, onUnmounted, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import use3DTitleSet from '/@/hooks/demo/3DTitleSet'
  import useRemoveTools from '/@/hooks/removeTools'

  const router = useRouter()
  const value = ref<string>('tile')
  const entity = ref<ElRef>('null')

  const { removePrimitives } = useRemoveTools()

  const handleSelect = (value: string) => {
    router.push({ name: value })
  }

  onMounted(() => {
    entity.value = use3DTitleSet()
  })

  onUnmounted(() => {
    removePrimitives(entity.value)
  })
</script>
