<template>
  <div :id="idName" class="cesium-3d-container">
    <a-select class="map-select" v-model:value="demoValue" :options="mapTypes" @change="handleChange" />
    <panel-menu v-model:visible="panelVisible" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue'
  import type { SelectProps } from 'ant-design-vue'

  import useCesiumMap from '/@/hooks/useCesiumMap'

  const mapTypes = ref<SelectProps['options']>([
    {
      value: 'osm',
      label: 'OSM Building',
    },
    {
      value: 'tile',
      label: '3D Tiles',
    },
  ])

  const emit = defineEmits(['onMapReady', 'select', 'update:modelValue'])
  const props = defineProps({
    modelValue: {
      type: String,
      default: 'osm',
    },
    useInitMap: {
      type: Boolean,
      default: true,
    },
    idName: {
      type: String,
      default: 'cesium3DContainer',
    },
  })

  onMounted(async () => {
    props.useInitMap && (await useCesiumMap())
    emit('onMapReady')
  })

  const demoValue = computed(() => {
    return props.modelValue
  })
  const panelVisible = ref<boolean>(false)

  const handleChange = (value: string) => {
    emit('select', value)
    emit('update:modelValue', value)
  }
</script>

<style lang="less" scoped>
  .cesium-3d-container {
    width: 100%;
    height: 100%;
    position: relative;
    .map-select {
      width: 150px;
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 99;
    }
  }
</style>
