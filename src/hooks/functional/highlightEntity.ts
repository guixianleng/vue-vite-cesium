import useCesium from '/@/hooks/useCesium'

export default function useHighLightEntity(viewer: ElRef) {
  const Cesium = useCesium()
  // 鼠标hover样式
  const nameOverlay = document.createElement('div')
  viewer.container.appendChild(nameOverlay)
  nameOverlay.className = 'backdrop'
  nameOverlay.style.display = 'none'
  nameOverlay.style.position = 'absolute'
  nameOverlay.style.bottom = '0'
  nameOverlay.style.left = '0'
  nameOverlay.style['pointer-events'] = 'none'
  nameOverlay.style.padding = '4px'
  nameOverlay.style.backgroundColor = 'black'

  interface selectedType {
    feature: any
    originalColor: any
  }

  // Information about the currently selected feature
  const selected: selectedType = {
    feature: undefined,
    originalColor: new Cesium.Color(),
  }

  // An entity object which will hold info about the currently selected feature for infobox display
  const selectedEntity: ElRef = new Cesium.Entity()

  // Get default left click handler for when a feature is not picked on left click
  const clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)

  if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)) {
    // Silhouettes are supported
    const silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage()
    silhouetteBlue.uniforms.color = Cesium.Color.BLUE
    silhouetteBlue.uniforms.length = 0.01
    silhouetteBlue.selected = []

    const silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage()
    silhouetteGreen.uniforms.color = Cesium.Color.LIME
    silhouetteGreen.uniforms.length = 0.01
    silhouetteGreen.selected = []

    viewer.scene.postProcessStages.add(
      Cesium.PostProcessStageLibrary.createSilhouetteStage([silhouetteBlue, silhouetteGreen]),
    ) // Silhouette a feature blue on hover.
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
      // If a feature was previously highlighted, undo the highlight
      silhouetteBlue.selected = []

      // Pick a new feature
      const pickedFeature = viewer.scene.pick(movement.endPosition)
      if (!Cesium.defined(pickedFeature)) {
        nameOverlay.style.display = 'none'
        return
      }

      // A feature was picked, so show it's overlay content
      nameOverlay.style.display = 'block'
      nameOverlay.style.bottom = `${viewer.canvas.clientHeight - movement.endPosition.y}px`
      nameOverlay.style.left = `${movement.endPosition.x}px`
      const name = pickedFeature.getProperty('BIN')
      nameOverlay.textContent = name

      // Highlight the feature if it's not already selected.
      if (pickedFeature !== selected.feature) {
        silhouetteBlue.selected = [pickedFeature]
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // Silhouette a feature on selection and show metadata in the InfoBox.
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
      // If a feature was previously selected, undo the highlight
      silhouetteGreen.selected = []

      // Pick a new feature
      const pickedFeature = viewer.scene.pick(movement.position)
      if (!Cesium.defined(pickedFeature)) {
        clickHandler(movement)
        return
      }

      // Select the feature if it's not already selected
      if (silhouetteGreen.selected[0] === pickedFeature) {
        return
      }

      // Save the selected feature's original color
      const highlightedFeature = silhouetteBlue.selected[0]
      if (pickedFeature === highlightedFeature) {
        silhouetteBlue.selected = []
      }

      // Highlight newly selected feature
      silhouetteGreen.selected = [pickedFeature]

      // Set feature infobox description
      const featureName = pickedFeature.getProperty('name')
      selectedEntity.name = featureName
      selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>'
      viewer.selectedEntity = selectedEntity
      selectedEntity.description =
        `${'<table class="cesium-infoBox-defaultTable"><tbody>' + '<tr><th>BIN</th><td>'}${pickedFeature.getProperty(
          'BIN',
        )}</td></tr>` +
        `<tr><th>DOITT ID</th><td>${pickedFeature.getProperty('DOITT_ID')}</td></tr>` +
        `<tr><th>SOURCE ID</th><td>${pickedFeature.getProperty('SOURCE_ID')}</td></tr>` +
        `</tbody></table>`
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  } else {
    // Silhouettes are not supported. Instead, change the feature color.

    // Information about the currently highlighted feature
    const highlighted: selectedType = {
      feature: undefined,
      originalColor: new Cesium.Color(),
    }

    // Color a feature yellow on hover.
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
      // If a feature was previously highlighted, undo the highlight
      if (Cesium.defined(highlighted.feature)) {
        highlighted.feature.color = highlighted.originalColor
        highlighted.feature = undefined
      }
      // Pick a new feature
      const pickedFeature = viewer.scene.pick(movement.endPosition)
      if (!Cesium.defined(pickedFeature)) {
        nameOverlay.style.display = 'none'
        return
      }
      // A feature was picked, so show it's overlay content
      nameOverlay.style.display = 'block'
      nameOverlay.style.bottom = `${viewer.canvas.clientHeight - movement.endPosition.y}px`
      nameOverlay.style.left = `${movement.endPosition.x}px`
      let name = pickedFeature.getProperty('name')
      if (!Cesium.defined(name)) {
        name = pickedFeature.getProperty('id')
      }
      nameOverlay.textContent = name
      // Highlight the feature if it's not already selected.
      if (pickedFeature !== selected.feature) {
        highlighted.feature = pickedFeature
        Cesium.Color.clone(pickedFeature.color, highlighted.originalColor)
        pickedFeature.color = Cesium.Color.YELLOW
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // Color a feature on selection and show metadata in the InfoBox.
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
      // If a feature was previously selected, undo the highlight
      if (Cesium.defined(selected.feature)) {
        selected.feature.color = selected.originalColor
        selected.feature = undefined
      }
      // Pick a new feature
      const pickedFeature = viewer.scene.pick(movement.position)
      if (!Cesium.defined(pickedFeature)) {
        clickHandler(movement)
        return
      }
      // Select the feature if it's not already selected
      if (selected.feature === pickedFeature) {
        return
      }
      selected.feature = pickedFeature
      // Save the selected feature's original color
      if (pickedFeature === highlighted.feature) {
        Cesium.Color.clone(highlighted.originalColor, selected.originalColor)
        highlighted.feature = undefined
      } else {
        Cesium.Color.clone(pickedFeature.color, selected.originalColor)
      }
      // Highlight newly selected feature
      pickedFeature.color = Cesium.Color.LIME
      // Set feature infobox description
      const featureName = pickedFeature.getProperty('name')
      selectedEntity.name = featureName
      selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>'
      viewer.selectedEntity = selectedEntity
      selectedEntity.description =
        `${'<table class="cesium-infoBox-defaultTable"><tbody>' + '<tr><th>BIN</th><td>'}${pickedFeature.getProperty(
          'BIN',
        )}</td></tr>` +
        `<tr><th>DOITT ID</th><td>${pickedFeature.getProperty('DOITT_ID')}</td></tr>` +
        `<tr><th>SOURCE ID</th><td>${pickedFeature.getProperty('SOURCE_ID')}</td></tr>` +
        `<tr><th>Longitude</th><td>${pickedFeature.getProperty('longitude')}</td></tr>` +
        `<tr><th>Latitude</th><td>${pickedFeature.getProperty('latitude')}</td></tr>` +
        `<tr><th>Height</th><td>${pickedFeature.getProperty('height')}</td></tr>` +
        `<tr><th>Terrain Height (Ellipsoid)</th><td>${pickedFeature.getProperty('TerrainHeight')}</td></tr>` +
        `</tbody></table>`
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
}
