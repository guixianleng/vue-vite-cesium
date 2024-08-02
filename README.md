# Vue 3 + Typescript + Vite + cesium
据不完全统计，现有的很多都是按照[Cesium 官方的 webpack 教程](https://cesium.com/learn/cesiumjs-learn/cesiumjs-webpack/)（基本上使用vue3的都是搭配vuecli4.x）来开发的，很少使用vue3最优的vite工具开发实现，本demo项目使用Vue3.x、Vite2.x、Cesium.js进行开发，也方便学习和交流。

这里用到的是vite 搭配[vite-plugin-cesium](https://github.com/nshen/vite-plugin-cesium)，能很好实现在vite使用cesium。

### 安装

```shell
npm i vite-plugin-cesium vite -D
# yarn add vite-plugin-cesium vite -D
```

### 配置

在 `vite.config.js`使用插件配置

```shell
...
+ import cesium from 'vite-plugin-cesium';
export default defineConfig({
  ...
+  plugins: [cesium()]
});
```

### 项目运行

1. 克隆项目
```
# git clone https://github.com/guixianleng/vue-vite-cesium.git
```

2. 安装依赖

```shell
# npm install or yarn or pnpm i
```

3. 运行

```shell
# npm run dev or yarn dev or pnpm run dev
```
## 预览图
![preview](https://images.prismic.io/cesium/tutorials-imagery-layers-bing-labels.jpg?auto=compress%2Cformat&w=599)


![preview](https://images.prismic.io/cesium/tutorials-3d-tiles-styling-showAllBuildings.jpg?auto=compress%2Cformat&w=1040)

## 使用 Gitpod

在 Gitpod（适用于 GitHub 的免费在线开发环境）中打开项目，并立即开始编码.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/guixianleng/vue-vite-cesium)
