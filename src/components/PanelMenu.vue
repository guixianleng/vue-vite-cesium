<template>
  <div class="panel-wrap" :class="{ hide: !dialogVisible }">
    <slot v-if="$slots.default"></slot>
    <div class="panel" v-else>
      <header class="panel-header">
        <span>{{ props.title }}</span>
        <close-outlined @click="toggle" class="close-btn" />
      </header>
      <div class="content">
        <div v-for="(btn, i) in operates" :key="i" class="content-item">
          <header class="item-header">
            {{ btn.label }}
          </header>
          <div class="content-wrap">
            <a-space>
              <a-button
                v-for="(item, index) in btn.list"
                size="small"
                :type="currentValue === item.value ? 'primary' : 'default'"
                :key="index"
                @click="clickHandler(item.value)"
              >
                {{ item.label }}
              </a-button>
            </a-space>
          </div>
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

  import useMeasureLineSpace from '/@/hooks/measure/line'
  import useMeasureArea from '/@/hooks/measure/area'
  import useDraw from '/@/hooks/draw'
  import useRemoveTools from '/@/hooks/removeTools'
  import useHeatMap from '/@/hooks/demo/heatMap'

  const operates = reactive([
    {
      label: '量测',
      list: [
        {
          label: '线距',
          value: 'line',
        },
        {
          label: '面积',
          value: 'area',
        },
      ],
    },
    {
      label: '绘制',
      list: [
        {
          label: '点',
          value: 'point',
        },
        {
          label: '线',
          value: 'polyline',
        },
        {
          label: '面',
          value: 'polygon',
        },
        {
          label: '清除',
          value: 'clear',
        },
      ],
    },
    {
      label: '图层',
      list: [
        {
          label: '热力图',
          value: 'heatmap',
        },
        {
          label: '清空热力图',
          value: 'clearHeatmap',
        },
      ],
    },
  ])

  const emits = defineEmits(['update:visible', 'on-click'])
  const props = defineProps({
    title: {
      type: String,
      default: '菜单操作',
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

  const { removeAllDraw } = useRemoveTools()
  const { createRectangle, getRandomData, createHeatMap } = useHeatMap()

  const dialogVisible = ref<boolean>(false)
  const currentValue = ref<string>('')
  const heatMap = ref<ElRef>(null)

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
    currentValue.value = value
    switch (value) {
      case 'line':
        useMeasureLineSpace(window.CViewer)
        break
      case 'area':
        useMeasureArea(window.CViewer)
        break
      case 'point':
      case 'polyline':
      case 'polygon':
        useDraw(window.CViewer, value)
        break
      case 'clear':
        removeAllDraw(window.CViewer)
        currentValue.value = ''
        break
      case 'heatmap':
        const coordinate = [80, 22, 130, 50]
        const { max, data } = getRandomData(200)
        heatMap.value = createHeatMap(max, data)
        createRectangle(window.CViewer, coordinate, heatMap.value)
        break
      case 'clearHeatmap':
        removeAllDraw(window.CViewer, ['热力图'])
        break
      default:
        break
    }
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
      &-wrap {
        flex: 1;
        display: flex;
        margin: 5px 0 10px;
        .ant-space {
          flex-wrap: wrap;
        }
      }
      &-item {
        border-bottom: 1px solid steelblue;
        &:last-child {
          border-bottom: none;
        }
      }
      .item-header {
        text-align: left;
        font-size: 13px;
        color: #fff;
        margin-top: 5px;
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
