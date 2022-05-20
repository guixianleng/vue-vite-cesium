import { unref } from 'vue'
import { drawConfig } from './types'

import useCesium from '/@/hooks/useCesium'
import useRemoveTools from '/@/hooks/removeTools'

const Cesium = useCesium()
const { removeEntities } = useRemoveTools()

/**
 * 根据类型绘制对象
 * @param type point、polyline、polygon
 */
export default function useDraw(viewer: ElRef, type: 'point' | 'polyline' | 'polygon') {
  const _this: any = {}
  //绘制点
  let position = unref<any>([])
  const tempPoints = unref<any>([])
  const tempEntities = unref<any>([])
  const poly = null
  let cartesian: any = null
  // 开启深度检测
  viewer.scene.globe.depthTestAgainstTerrain = true
  //双击鼠标左键清除默认事件
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

  const drawPoint = (position: Array<any>) => {
    return viewer.entities.add({
      name: '点',
      position: position,
      point: {
        color: Cesium.Color.SKYBLUE,
        pixelSize: 10,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 3,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    })
  }
  const drawPolyline = (positions, config_?: drawConfig) => {
    if (positions.length < 1) return
    const config: drawConfig = config_ ?? {}
    return viewer.entities.add({
      name: '线',
      polyline: {
        positions: positions,
        width: config.width ? config.width : 5.0,
        material: new Cesium.PolylineGlowMaterialProperty({
          color: Cesium.Color.GOLD,
        }),
        depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
          color: Cesium.Color.GOLD,
        }),
        // new Cesium.Color.fromCssColorString(config.color)
        clampToGround: true,
      },
    })
  }
  const drawPolygon = (positions) => {
    if (positions.length < 2) return
    return viewer.entities.add({
      name: '面',
      polygon: {
        hierarchy: positions,
        material: Cesium.Color.fromCssColorString('#FFD700').withAlpha(0.2),
      },
    })
  }

  switch (type) {
    case 'point':
      // 监听鼠标左键点击事件
      handler.setInputAction(function (movement) {
        // 从相机位置通过windowPosition 世界坐标中的像素创建一条射线。返回Cartesian3射线的位置和方向。
        const ray = viewer.camera.getPickRay(movement.position)
        // 查找射线与渲染的地球表面之间的交点。射线必须以世界坐标给出。返回Cartesian3对象
        position = viewer.scene.globe.pick(ray, viewer.scene)
        const point = drawPoint(position)
        tempEntities.push(point)
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      // 左键双击停止绘制
      handler.setInputAction(function () {
        handler.destroy() //关闭事件句柄
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

      // 右击单击结束绘制
      handler.setInputAction(function () {
        handler.destroy() //关闭事件句柄
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
      break
    case 'polyline':
      //左键点击操作
      handler.setInputAction(function (click) {
        //调用获取位置信息的接口
        const ray = viewer.camera.getPickRay(click.position)
        cartesian = viewer.scene.globe.pick(ray, viewer.scene)
        tempPoints.push(cartesian)
        const tempLength = tempPoints.length
        //调用绘制点的接口
        const point = drawPoint(tempPoints[tempPoints.length - 1])
        tempEntities.push(point)
        if (tempLength > 1) {
          const pointLine = drawPolyline([tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1]])
          tempEntities.push(pointLine)
        } else {
          // tooltip.innerHTML = "请绘制下一个点，右键结束";
        }
        // if (tempPoints.length == 0) {
        //   tempPoints.push(cartesian.clone())
        // }
        // tempPoints.push(cartesian)
        // const pointLine = drawPoint(tempPoints[tempPoints.length - 1])
        // tempEntities.push(pointLine)
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      // 鼠标移动事件
      handler.setInputAction(function (movement) {
        const ray = viewer.camera.getPickRay(movement.endPosition)
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
        if (tempPoints.length >= 2) {
          if (!Cesium.defined(poly)) {
            // poly = new updatePrimitive(tempPoints)
          } else {
            tempPoints.pop()
            tempPoints.push(cartesian)
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      // 右键点击操作
      handler.setInputAction(function () {
        handler.destroy() //关闭事件句柄
        tempPoints.pop()
        removeEntities(window.CViewer, tempEntities)
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

      // const updatePrimitive = (function () {
      //   function _(positions) {
      //     console.log(111)
      //     _this.options = {
      //       id: 'distancePolyline',
      //       name: '直线',
      //       polyline: {
      //         show: true,
      //         positions: [],
      //         material: Cesium.Color.CHARTREUSE,
      //         width: 2,
      //         clampToGround: true,
      //       },
      //     }
      //     // 实时更新线的位置
      //     const _update = function () {
      //       return positions
      //     }
      //     // 实时更新 polyline.positions
      //     _this.options.polyline.positions = new Cesium.CallbackProperty(_update, false)
      //     viewer.entities.add(_this.options)
      //   }

      //   return _
      // })()
      break
    case 'polygon':
      // 左键点击操作
      handler.setInputAction(function (click) {
        //调用获取位置信息的接口
        const ray = viewer.camera.getPickRay(click.position)
        position = viewer.scene.globe.pick(ray, viewer.scene)
        tempPoints.push(position)
        const tempLength = tempPoints.length
        //调用绘制点的接口
        const point = drawPoint(position)
        tempEntities.push(point)
        if (tempLength > 1) {
          const pointLine = drawPolyline([tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1]])
          tempEntities.push(pointLine)
        } else {
          // tooltip.innerHTML = "请绘制下一个点，右键结束";
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      // 右键点击操作
      handler.setInputAction(function (click) {
        const cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid)

        if (cartesian) {
          if (tempPoints.length < 3) {
            alert('请选择3个以上的点再执行闭合操作命令')
          } else {
            //闭合最后一条线
            const pointLine = drawPolyline([tempPoints[tempPoints.length - 1], tempPoints[0]])
            tempEntities.push(pointLine)
            drawPolygon(tempPoints)
            tempEntities.push(tempPoints)
            handler.destroy() //关闭事件句柄
          }
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
      break
  }
}
