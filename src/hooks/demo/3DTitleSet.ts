import useCesium from '/@/hooks/useCesium'

/**
 * 加载倾斜摄影示例
 */
export default async function use3DTitleSet(viewer: ElRef) {
  const Cesium = useCesium()
  viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3 }))

  const titleSet = new Cesium.Cesium3DTileset({
    url: Cesium.IonResource.fromAssetId(354759),
  })

  viewer.scene.primitives.add(titleSet)

  try {
    await titleSet.readyPromise
    await viewer.zoomTo(titleSet)

    // Apply the default style if it exists
    const extras = titleSet.asset.extras
    if (Cesium.defined(extras) && Cesium.defined(extras.ion) && Cesium.defined(extras.ion.defaultStyle)) {
      titleSet.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle)
    }
  } catch (error) {
    console.log(error)
  }
}
