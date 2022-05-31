import useCesium from '/@/hooks/useCesium'
const Cesium = useCesium()

//测量空间面积
export default function useMeasureArea(viewer: ElRef) {
  const _this: any = {}
  // 取消双击事件-追踪该位置
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  // 鼠标事件
  _this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection)
  const positions = <any>[]
  const tempPoints = <any>[]
  let polygon = null
  let areaText = null
  let cartesian: any = null
  const areaArray = <any>[]
  let floatingPoint

  _this.handler.setInputAction(function (movement) {
    const ray = viewer.camera.getPickRay(movement.endPosition)
    cartesian = viewer.scene.globe.pick(ray, viewer.scene)
    if (positions.length >= 2) {
      if (!Cesium.defined(polygon)) {
        polygon = new PolygonPrimitive(positions)
      } else {
        positions.pop()
        positions.push(cartesian)
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  _this.handler.setInputAction(function (movement) {
    const ray = viewer.camera.getPickRay(movement.position)
    cartesian = viewer.scene.globe.pick(ray, viewer.scene)
    if (positions.length == 0) {
      positions.push(cartesian.clone())
    }
    positions.push(cartesian)
    //在三维场景中添加点
    const cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1])
    const longitudeString = Cesium.Math.toDegrees(cartographic.longitude)
    const latitudeString = Cesium.Math.toDegrees(cartographic.latitude)
    const heightString = cartographic.height
    tempPoints.push({ lon: longitudeString, lat: latitudeString, hei: heightString })
    floatingPoint = viewer.entities.add({
      name: '多边形面积',
      position: positions[positions.length - 1],
      point: {
        pixelSize: 5,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    })
    areaArray.push(floatingPoint)
    _this.areapointArray = areaArray
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  _this.handler.setInputAction(function () {
    _this.handler.destroy()
    positions.pop()

    const textArea = getArea(tempPoints) + '平方公里'
    areaText = viewer.entities.add({
      name: '多边形面积',
      position: positions[positions.length - 1],
      point: {
        pixelSize: 5,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
      label: {
        text: textArea,
        font: '18px sans-serif',
        fillColor: Cesium.Color.GOLD,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(20, -40),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    })

    areaArray.push(areaText)
    _this.areapointArray = areaArray
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

  const radiansPerDegree = Math.PI / 180.0 //角度转化为弧度(rad)
  const degreesPerRadian = 180.0 / Math.PI //弧度转化为角度

  //计算多边形面积
  function getArea(points) {
    let res = 0
    //拆分三角曲面

    for (let i = 0; i < points.length - 2; i++) {
      const j = (i + 1) % points.length
      const k = (i + 2) % points.length
      const totalAngle = Angle(points[i], points[j], points[k])

      const dis_temp1 = distance(positions[i], positions[j])
      const dis_temp2 = distance(positions[j], positions[k])
      res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle))
      // console.log(res);
    }

    return (res / 1000000.0).toFixed(4)
  }

  //角度
  function Angle(p1, p2, p3) {
    const bearing21 = Bearing(p2, p1)
    const bearing23 = Bearing(p2, p3)
    let angle = bearing21 - bearing23
    if (angle < 0) {
      angle += 360
    }
    return angle
  }

  //方向
  function Bearing(from, to) {
    const lat1 = from.lat * radiansPerDegree
    const lon1 = from.lon * radiansPerDegree
    const lat2 = to.lat * radiansPerDegree
    const lon2 = to.lon * radiansPerDegree
    let angle = -Math.atan2(
      Math.sin(lon1 - lon2) * Math.cos(lat2),
      Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2),
    )
    if (angle < 0) {
      angle += Math.PI * 2.0
    }
    angle = angle * degreesPerRadian //角度
    return angle
  }

  const PolygonPrimitive = (function () {
    function _(positions) {
      _this.options = {
        id: 'areaPolygon',
        name: '多边形',
        polygon: {
          hierarchy: [],
          material: Cesium.Color.GREEN.withAlpha(0.5),
          heightReference: 20000,
        },
      }

      _this.hierarchy = { positions }

      const _update = function () {
        return _this.hierarchy
      }
      //实时更新polygon.hierarchy
      _this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false)
      viewer.entities.add(_this.options)
    }

    return _
  })()

  function distance(point1, point2) {
    const point1cartographic = Cesium.Cartographic.fromCartesian(point1)
    const point2cartographic = Cesium.Cartographic.fromCartesian(point2)
    //根据经纬度计算出距离
    const geodesic = new Cesium.EllipsoidGeodesic()
    geodesic.setEndPoints(point1cartographic, point2cartographic)
    let s = geodesic.surfaceDistance
    //返回两点之间的距离
    s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2))
    return s
  }
}
