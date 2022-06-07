import useCesium from '/@/hooks/useCesium'

export default function useSetOSMBuildings(viewer: ElRef) {
  const Cesium = useCesium()
  viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3 }))

  viewer.scene.primitives.add(Cesium.createOsmBuildings())

  viewer.scene.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(-74.019, 40.6912, 750),
    orientation: {
      heading: Cesium.Math.toRadians(20),
      pitch: Cesium.Math.toRadians(-20),
    },
  })
}
