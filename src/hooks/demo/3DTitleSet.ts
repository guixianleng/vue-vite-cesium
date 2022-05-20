import useCesium from '/@/hooks/useCesium'
const Cesium = useCesium()

/**
 * 加载倾斜摄影示例
 */
export default function use3DTitleSet() {
  const viewer = new Cesium.Viewer('cesium3DContainer', {
    terrainProvider: Cesium.createWorldTerrain(),
  })
  const titleSet = new Cesium.Cesium3DTileset({
    url: Cesium.IonResource.fromAssetId(40866),
  })

  viewer.scene.primitives.add(titleSet)
  viewer.zoomTo(titleSet)
  return viewer
}
