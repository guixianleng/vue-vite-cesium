<template>
  <a-config-provider>
    <a-spin :spinning="spinning" tip="加载中..." size="large">
      <router-view />
    </a-spin>
  </a-config-provider>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useAppStore } from '/@/store/modules/app'

  const appStore = useAppStore()
  const spinning = computed(() => appStore.getPageLoading)
</script>

<style lang="less">
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 100%;
    :deep(.ant-spin) {
      max-height: 100% !important;
      background-color: #fff;
    }
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(163, 163, 163, 0.4);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(163, 163, 163, 0.6);
  }

  // =================================
  // ==============nprogress==========
  // =================================
  #nprogress {
    pointer-events: none;

    .bar {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99999;
      width: 100%;
      height: 3px;
      background-color: #1890ff;
    }
  }
</style>
