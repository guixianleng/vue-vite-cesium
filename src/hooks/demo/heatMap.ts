import h337 from 'heatmap.js'
import useCesium from '/@/hooks/useCesium'
const Cesium = useCesium()

interface DataEnum {
  x: number
  y: number
  value: number
  radius?: number
}

export default function useHeatMap() {
  // 生成len个随机数据
  const getRandomData = (len: number) => {
    //构建一些随机数据点
    const points: Array<DataEnum> = []
    let max = 0
    const width = 840
    const height = 400
    while (len--) {
      const val = Math.floor(Math.random() * 100)
      max = Math.max(max, val)
      const point = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        value: val,
      }
      points.push(point)
    }
    return { max: max, data: points }
  }

  // 生成热力图
  const createHeatMap = (max: number, data: any) => {
    // 获取元素
    const heatDoc = document.createElement('div')
    heatDoc.setAttribute('style', 'width: 100px; height: 100px; margin: 0px; display: none;')
    document.body.appendChild(heatDoc)
    // 创建热力图对象
    const heatmap = h337.create({
      container: heatDoc,
      radius: 5,
      maxOpacity: 0.5,
      minOpacity: 0,
      gradient: {
        '0.9': 'red',
        '0.8': 'orange',
        '0.7': 'yellow',
        '0.5': 'blue',
        '0.3': 'green',
      },
    })
    // 添加数据
    heatmap.setData({
      max: max,
      data: data,
    })
    return heatmap
  }

  // 创建正方形 绑定热力图
  const createRectangle = (viewer: ElRef, coordinate: Array<number>, heatMap: ElRef) => {
    viewer.entities.add({
      name: '热力图',
      show: true,
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(coordinate[0], coordinate[1], coordinate[2], coordinate[3]),
        material: heatMap._renderer.canvas,
        transparent: true,
      },
    })
    viewer.zoomTo(viewer.entities)
  }

  return {
    createRectangle,
    getRandomData,
    createHeatMap,
  }
}
