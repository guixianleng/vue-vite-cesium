import useCesium from '/@/hooks/useCesium'
const Cesium = useCesium()

export default function useSetOSMBuildings(viewer: ElRef) {
  // const viewer = new Cesium.Viewer('cesium3DContainer', {
  //   terrainProvider: Cesium.createWorldTerrain(),
  // })
  if (!viewer) return false

  viewer.scene.primitives.add(Cesium.createOsmBuildings())

  viewer.scene.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(-74.019, 40.6912, 750),
    orientation: {
      heading: Cesium.Math.toRadians(20),
      pitch: Cesium.Math.toRadians(-20),
    },
  })
}
