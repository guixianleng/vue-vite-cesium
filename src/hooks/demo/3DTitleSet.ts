import useCesium from '/@/hooks/useCesium'
const Cesium = useCesium()

export default function use3DTitleSet(viewerName = 'cesium3DContainer') {
  const viewer = new Cesium.Viewer(viewerName, {
    terrainProvider: Cesium.createWorldTerrain(),
  })

  const titleSet = new Cesium.Cesium3DTileset({
    url: Cesium.IonResource.fromAssetId(40866),
  })

  viewer.scene.primitives.add(titleSet)
  viewer.zoomTo(titleSet)
  return viewer
}
