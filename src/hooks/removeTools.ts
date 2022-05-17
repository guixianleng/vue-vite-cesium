import useCesium from '/@/hooks/useCesium'

const Cesium = useCesium()
/**
 * 清除测量数据
 * @param viewer 3d地图实例
 * @param handler 事件处理器
 * @param arrayPoint 坐标点
 */
export default function useRemoveMeasure(viewer: ElRef, arrayPoint: Array<any>) {
  let handler: any = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection)
  if (handler) {
    handler.destroy()
    handler = null
  }
  if (arrayPoint && Array.isArray(arrayPoint)) {
    for (let i = 0; i < arrayPoint.length; i++) {
      viewer.entities.remove(arrayPoint[i])
    }
  }
}
