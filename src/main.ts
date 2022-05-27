import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import { setupStore } from '/@/store'

// 由于插件无法处理非组件模块 样式需手动加载
import { message } from 'ant-design-vue'
import 'ant-design-vue/es/message/style/css'

const app = createApp(App)

app.use(router).use(createPinia()).mount('#app')

setupStore(app)

app.config.globalProperties.$message = message
