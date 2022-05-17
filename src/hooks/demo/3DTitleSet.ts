import useCesium from '/@/hooks/useCesium'
const Cesium = useCesium()

export default function use3DTitleSet(viewerName: string) {
  const viewer = new Cesium.Viewer(viewerName, {
    terrainProvider: Cesium.createWorldTerrain(),
  })

  const titleSet = new Cesium.Cesium3DTileset({
    url: Cesium.IonResource.fromAssetId(40866),
  })

  viewer.scene.primitives.add(titleSet)
  viewer.zoomTo(titleSet)
}
