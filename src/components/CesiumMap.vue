<template>
  <a-spin :spinning="spinning" size="large">
    <div id="cesium3DContainer" class="cesium-3d-container">
      <a-select class="map-select" v-model:value="demoValue" :options="mapTypes" @change="handleChange" />
      <slot></slot>
    </div>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue'
  import type { SelectProps } from 'ant-design-vue'
  import { useAppStore } from '/@/store/modules/app'

  import useCesiumMap from '/@/hooks/useCesiumMap'

  const mapTypes = ref<SelectProps['options']>([
    {
      value: 'base',
      label: '3D map',
    },
    {
      value: 'osm',
      label: 'OSM Building',
    },
    {
      value: 'tile',
      label: '3D Tiles',
    },
  ])

  const emit = defineEmits(['mapReady', 'select', 'update:modelValue'])
  const props = defineProps({
    modelValue: {
      type: String,
      default: 'osm',
    },
  })

  const appStore = useAppStore()
  const spinning = computed(() => appStore.getPageLoading)

  onMounted(async () => {
    await useCesiumMap()
    emit('mapReady')
  })

  const demoValue = computed(() => {
    return props.modelValue
  })

  const handleChange = (value: string) => {
    emit('select', value)
    emit('update:modelValue', value)
  }
</script>

<style lang="less" scoped>
  .cesium-3d-container {
    width: 100vw;
    height: 100vh;
    position: relative;
    .map-select {
      width: 150px;
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 99;
    }
  }
  :deep(.ant-spin) {
    max-height: 100% !important;
    background-color: #fff;
  }
</style>
