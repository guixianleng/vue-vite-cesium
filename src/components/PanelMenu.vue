<template>
  <div class="panel-wrap" :class="{ hide: !dialogVisible }">
    <slot v-if="$slots.default"></slot>
    <div class="panel" v-else>
      <header class="panel-header">
        <span>{{ props.title }}</span>
        <close-outlined @click="toggle" class="close-btn" />
      </header>
      <div class="content">
        <div class="content-wrap">
          <a-space>
            <a-button v-for="(item, index) in operates" size="small" :key="index" @click="clickHandler(item.value)">
              {{ item.label }}
            </a-button>
          </a-space>
        </div>
      </div>
    </div>
    <aside class="bar-icon" @click="toggle">
      <left-outlined :rotate="rotate" />
    </aside>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watchEffect, computed } from 'vue'
  import { CloseOutlined, LeftOutlined } from '@ant-design/icons-vue'

  const operates = reactive([
    {
      label: '测距',
      value: 'line',
    },
    {
      label: '测面积',
      value: 'area',
    },
  ])

  const emits = defineEmits(['update:visible', 'on-click'])

  const props = defineProps({
    title: {
      type: String,
      default: '菜单',
    },
    width: {
      type: String,
      default: '30%',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  })
  const dialogVisible = ref<boolean>(false)

  watchEffect(() => {
    dialogVisible.value = props.visible
  })

  const rotate = computed(() => {
    return dialogVisible.value ? 180 : 0
  })

  const toggle = () => {
    dialogVisible.value = !dialogVisible.value
    emits('update:visible', dialogVisible.value)
  }

  const clickHandler = (value: string) => {
    emits('on-click', value)
  }
</script>
<style scoped lang="less">
  .panel-wrap {
    font-size: 14px;
    position: fixed;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 200px;
    height: auto;
    background: rgba(0, 0, 0, 0.4);
    transition: right 0.24s ease-in-out;
    border-radius: 5px;
    border: 1px solid steelblue;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    z-index: 100;
    &.hide {
      right: -200px;
    }
    .panel {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .panel-header {
      padding: 5px 10px;
      color: #fff;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid steelblue;
      align-items: center;
      span {
        font-weight: bold;
      }
      .close-btn {
        cursor: pointer;
        font-size: 16px;
      }
    }
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0 10px;
      overflow: auto;
      &-wrap {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        margin: 10px 0;
      }
    }
    .bar-icon {
      width: 20px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-items: center;
      font-size: 18px;
      color: #fff;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      position: absolute;
      left: -21px;
      top: calc(50% - 15px);
      color: #fff;
      background: rgb(70, 131, 180);
      cursor: pointer;
      opacity: 0.6;
      transition: all 0.25s ease-in-out;
      &:hover {
        opacity: 1;
      }
    }
  }
</style>
