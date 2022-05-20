import { unref } from 'vue'

import useCesium from '/@/hooks/useCesium'

const Cesium = useCesium()

/**
 * 根据类型绘制对象
 * @param type point、polyline、polygon
 */
export default function useDraw(viewer: ElRef, type: 'point' | 'polyline' | 'polygon') {
  const activeShapePoints = unref<any>([])
  let activeShape = unref<ElRef>(null)
  let floatingPoint = unref<ElRef>(null)

  // Zoom in to an area with mountains
  // viewer.camera.lookAt(
  //   Cesium.Cartesian3.fromDegrees(-122.2058, 46.1955, 1000.0),
  //   new Cesium.Cartesian3(5000.0, 5000.0, 5000.0),
  // )
  // viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)

  // 开启深度检测
  viewer.scene.globe.depthTestAgainstTerrain = true
  //双击鼠标左键清除默认事件
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)

  // 绘制点
  const drawPoint = (position: Array<any>) => {
    const pointer = viewer.entities.add({
      name: '点',
      position: position,
      point: {
        color: Cesium.Color.WHITE,
        pixelSize: 10,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 3,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    })
    return pointer
  }

  // 绘制线
  const drawPolyline = (positions: Array<any>) => {
    const polyline = viewer.entities.add({
      name: '线',
      polyline: {
        positions: positions,
        clampToGround: true,
        width: 5,
      },
    })
    return polyline
  }

  // 绘制面
  const drawPolygon = (positions: Array<any>) => {
    const polygon = viewer.entities.add({
      name: '面',
      // polyline: {
      //   positions: positions,
      //   clampToGround: true,
      //   width: 2,
      // },
      polygon: {
        hierarchy: positions,
        material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.7)),
      },
    })
    return polygon
  }

  const drawShape = (positionData) => {
    let shape = null
    switch (type) {
      case 'polyline':
        shape = drawPolyline(positionData)
        return shape
      case 'polygon':
        shape = drawPolygon(positionData)
        return shape
      default:
        return shape
    }
  }

  // 鼠标左键
  handler.setInputAction(function (event) {
    // scene.pickPosition只有在开启地形深度检测，且不使用默认地形时是准确的。
    const ray = viewer.camera.getPickRay(event.position)
    const earthPosition = viewer.scene.globe.pick(ray, viewer.scene)
    // const earthPosition = viewer.scene.pickPosition(event.position)

    if (activeShapePoints.length === 0) {
      console.log(111)
      floatingPoint = drawPoint(earthPosition)
      activeShapePoints.push(earthPosition)
      const dynamicPositions = new Cesium.CallbackProperty(function () {
        if (type === 'polygon') {
          return new Cesium.PolygonHierarchy(activeShapePoints)
        }
        return activeShapePoints
      }, false)
      activeShape = drawShape(dynamicPositions) //绘制动态图
    }
    drawPoint(earthPosition)
    activeShapePoints.push(earthPosition)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  // 鼠标移动
  handler.setInputAction(function (event) {
    if (Cesium.defined(floatingPoint)) {
      const newPosition = viewer.scene.pickPosition(event.endPosition)
      if (Cesium.defined(newPosition)) {
        floatingPoint.position.setValue(newPosition)
        activeShapePoints.pop()
        activeShapePoints.push(newPosition)
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  // 左键双击停止绘制
  handler.setInputAction(function () {
    terminateShape() //关闭事件句柄
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

  // Redraw the shape so it's not dynamic and remove the dynamic shape.
  const terminateShape = () => {
    handler.destroy() //关闭事件句柄
    activeShapePoints.pop() //去除最后一个动态点
    if (activeShapePoints.length) {
      drawShape(activeShapePoints) //绘制最终图
    }
    viewer.entities.remove(floatingPoint) //去除动态点图形（当前鼠标点）
    viewer.entities.remove(activeShape) //去除动态图形
    floatingPoint = null
    activeShape = null
    // activeShapePoints.splice(0, activeShapePoints.length) // 清空数组
  }

  handler.setInputAction(function () {
    terminateShape()
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
}
