import useCesium from '/@/hooks/useCesium'

/**
 * 3d地图自动旋转
 * @param viewer 地图实例
 * @returns 开始和结束的旋转
 */
export default function useGlobalRotate(viewer: ElRef) {
  const Cesium = useCesium()
  const autoRotate = () => {
    if (!viewer || viewer.scene.mode !== Cesium.SceneMode.SCENE3D) {
      return false
    }
    const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(viewer.clock.currentTime)
    if (Cesium.defined(icrfToFixed)) {
      const offset = Cesium.Cartesian3.clone(viewer.camera.position)
      const transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed)
      // 偏移相机，否则会场景旋转而地球不转
      viewer.camera.lookAtTransform(transform, offset)
    }
  }

  // 获取矩阵及更新相机
  const startRotate = (option: {}) => {
    // 监听每次渲染前执行矩阵求解
    viewer.scene.postUpdate.addEventListener(autoRotate)
    // 根据option修改一些参数
    if (viewer.clock) {
      const keys = Object.keys(option)
      for (const k of keys) {
        viewer.clock[k] = option[k]
      }
    }
  }

  // 移除监听
  const stopRotate = () => {
    viewer.clock.multiplier = 1
    viewer.scene.postUpdate.removeEventListener(autoRotate)
  }

  return {
    startRotate,
    stopRotate,
  }
}
