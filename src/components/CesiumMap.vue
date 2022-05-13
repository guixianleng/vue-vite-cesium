<template>
  <div id="cesium3DContainer" class="cesium-3d-container">
    <a-select class="map-select" v-model:value="demoValue" :options="mapTypes" @change="handleChange" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import type { SelectProps } from 'ant-design-vue'
  import useCesiumMap from '/@/hooks/useCesiumMap'
  import useSetOSMBuildings from '/@/hooks/demo/setOSMBuildings'
  import use3DTitleSet from '/@/hooks/demo/3DTitleSet'

  const mapTypes = ref<SelectProps['options']>([
    {
      value: 'osm',
      label: 'OSM Building',
    },
    {
      value: 'title',
      label: '3D Title',
    },
  ])

  const demoValue = ref<string>('')
  let viewer = ref<ElRef>(null)

  onMounted(async () => {
    viewer = await useCesiumMap()
  })

  const handleChange = (value: string) => {
    switch (value) {
      case 'osm':
        useSetOSMBuildings(viewer)
        break
      case 'title':
        use3DTitleSet(viewer)
        break
      default:
        useCesiumMap()
        break
    }
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
