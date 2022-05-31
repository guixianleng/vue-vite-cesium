import useCesium from '/@/hooks/useCesium'

const Cesium = useCesium()

/**
 * 距离测量 -- 线长度
 * @param viewer 3d地图实例
 */
export default function useMeasureLineSpace(viewer: ElRef) {
  const _this: any = {}
  // 取消双击事件-追踪该位置
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

  _this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection)
  const positions = <any>[]
  let poly = null
  let distance = 0
  let cartesian: any = null
  const floatingPointArray = <any>[]

  // 鼠标移动事件
  _this.handler.setInputAction(function (movement) {
    const ray = viewer.camera.getPickRay(movement.endPosition)
    cartesian = viewer.scene.globe.pick(ray, viewer.scene)
    if (positions.length >= 2) {
      if (!Cesium.defined(poly)) {
        poly = new PolyLinePrimitive(positions)
      } else {
        positions.pop()
        positions.push(cartesian)
      }
      distance = getSpaceDistance(positions)
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  // 鼠标左键点击事件
  _this.handler.setInputAction(function (movement) {
    const ray = viewer.camera.getPickRay(movement.position)
    cartesian = viewer.scene.globe.pick(ray, viewer.scene)
    if (positions.length == 0) {
      positions.push(cartesian.clone())
    }
    positions.push(cartesian)
    //在三维场景中添加Label
    const textDistance = distance + '米'
    _this.floatingPoint = viewer.entities.add({
      name: '空间直线距离',
      position: positions[positions.length - 1],
      point: {
        pixelSize: 4,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
      },
      label: {
        text: textDistance,
        font: '18px sans-serif',
        fillColor: Cesium.Color.GOLD,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(20, -20),
      },
    })

    floatingPointArray.push(_this.floatingPoint)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  // 鼠标右键点击事件
  _this.handler.setInputAction(function () {
    _this.handler.destroy() //关闭事件句柄
    positions.pop() //最后一个点无效
    floatingPointArray.pop()
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

  const PolyLinePrimitive = (function () {
    function _(positions) {
      _this.options = {
        id: 'distancePolyline',
        name: '直线',
        polyline: {
          show: true,
          positions: [],
          material: Cesium.Color.CHARTREUSE,
          width: 2,
          clampToGround: true,
        },
      }
      _this.positions = positions
      // 实时更新线的位置
      const _update = function () {
        return _this.positions
      }
      // 实时更新 polyline.positions
      _this.options.polyline.positions = new Cesium.CallbackProperty(_update, false)
      viewer.entities.add(_this.options)
    }

    return _
  })()

  //空间两点距离计算函数
  function getSpaceDistance(positions) {
    let distance = 0
    for (let i = 0; i < positions.length - 1; i++) {
      const point1cartographic = Cesium.Cartographic.fromCartesian(positions[i])
      const point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1])
      /**根据经纬度计算出距离**/
      const geodesic = new Cesium.EllipsoidGeodesic()
      geodesic.setEndPoints(point1cartographic, point2cartographic)
      let s = geodesic.surfaceDistance
      //返回两点之间的距离
      s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2))
      distance = distance + s
    }
    return Number(distance.toFixed(2))
  }
}
