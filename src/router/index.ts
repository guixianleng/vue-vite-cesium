import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import tile from '/@/views/3d-tile.vue'
import osm from '/@/views/osm-building.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'osm',
    component: osm,
  },
  {
    path: '/3d-tiles',
    name: 'tile',
    component: tile,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
