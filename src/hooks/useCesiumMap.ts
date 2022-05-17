import useCesium from '/@/hooks/useCesium'
const Cesium = useCesium()

/**
 * 初始化 Cesium 地图
 * @param viewerName 地图类型
 * @param extendConf 地图其他配置
 * @returns 实例化的cesium viewer
 */
export default function useCesiumMap(viewerName = 'cesium3DContainer', extendConf?: any) {
  // 设置使用的token
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYTdjZjg3Ny1hNmIyLTRiNjAtYmU4YS0wYWNhNTY0Mjk1ODMiLCJpZCI6OTMyNzEsImlhdCI6MTY1MjI0MDA4Nn0.GJWD80AG6ak6qyiLkWEcJfpHboB0GD6JLe6bWBvBlLc'

  // 设置查看的默认矩形（当前设置在中国）
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(80, 22, 130, 50)
  // 配置参数
  const baseConf = {
    // imageryProvider: false,
    selectionIndicator: false, // 去掉框选
    showRenderLoopErrors: false,
    baseLayerPicker: false, // 基础影响图层选择器
    navigationHelpButton: false, // 导航帮助按钮
    animation: false, // 动画控件
    timeline: false, // 时间控件
    shadows: false, // 显示阴影
    shouldAnimate: true, // 模型动画效果 大气
    // skyBox: false, // 天空盒
    infoBox: false, // 显示 信息框
    fullscreenButton: false, // 是否显示全屏按钮
    homeButton: true, // 是否显示首页按钮
    geocoder: false, // 默认不显示搜索栏地址
    sceneModePicker: true, // 是否显示视角切换按钮
  }
  const viewer = new Cesium.Viewer(viewerName, { ...baseConf, ...extendConf })
  // 加载Cesium 官网的地形，亦可以加载自己的地形
  // const terrainLayer = new Cesium.CesiumTerrainProvider({
  //   url: Cesium.IonResource.fromAssetId(1),
  //   requestWaterMask: true,
  //   requestVertexNormals: true,
  // })

  // viewer.scene.terrainProvider = terrainLayer
  viewer.scene.globe.enableLighting = true
  // 显示 fps
  viewer.scene.debugShowFramesPerSecond = false
  viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3 }))

  viewer.camera.setView({
    // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
    // fromDegrees()方法，将经纬度和高程转换为世界坐标
    destination: Cesium.Cartesian3.fromDegrees(104, 30, 10000000),
    orientation: {
      // 指向
      heading: Cesium.Math.toRadians(0),
      // 视角
      pitch: Cesium.Math.toRadians(-90),
      roll: 0.0,
    },
  })
  viewer.clock.shouldAnimate = true

  window.CViewer = viewer
}
