# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## 架构搭建

### 使用 Vite 快速初始化项目雏形

1. 使用 NPM

```shell
npm init vite@latest
```

2. 使用 Yarn

```shell
yarn create vite
```

3. 使用 PNPM

```shell
pnpm create vite
```

可以通过附加的命令行选项直接指定项目名称和你想要使用的模板，本项目要构建 `Vite2 + Vue3 + TypeScript` 项目，则运行:

```shell
# npm 6.x
npm init vite@latest Vue 3 + Typescript + Vite --template vue

# npm 7+, 需要额外的双横线：
npm init vite@latest Vue 3 + Typescript + Vite -- --template vue

# yarn
yarn create vite Vue 3 + Typescript + Vite --template vue

# pnpm
pnpm create vite Vue 3 + Typescript + Vite -- --template vue
```

3. 安装依赖

```shell
yarn or npm i
```

4. 启动项目

```shell
npm run dev or yarn dev
```

## 目录结构

规范项目目录结构，结构说明如下：

```
├── public/
└── src/
    ├── api/                       ---  http请求的接口目录
    ├── assets/                    ---  静态资源目录
    ├── components/                ---  公共组件目录
    ├── enums/                     ---  全局的ts字典目录
    ├── hooks/                     ---  封装的自定义hook目录
    ├── router/                    ---  路由配置目录
    ├── store/                     ---  状态管理目录
    ├── styles/                    ---  通用 CSS 目录
    ├── types/                     ---  `typescript`类型目录
    ├── utils/                     ---  工具类函数目录
    ├── views/                     ---  页面目录
    ├── App.vue
    ├── main.ts
    ├── env.d.ts
├── index.html
├── tsconfig.json                  ---  TypeScript 配置文件
├── vite.config.ts                 ---  Vite 配置文件
└── package.json
```

## 集成路由工具 Vue Router

1. 安装

```shell
npm i vue-router@4 -S
```

2. 创建 `src/router/index.ts` 文件

```ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
```

3. 在 `main.ts` 中挂载路由配置

```
...

import router from './router/index'

createApp(App).use(router).mount('#app')

```

## 集成状态管理工具 pinia

1. 安装 `pinia`

```shell
npm i pinia -S
```

2. 在 `src/store`中创建 `user.ts` 和 `cart.ts` 文件

3. 在 `main.ts` 中挂载 `pinia` 配置

```ts
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(createPinia()).mount('#app')
```

## 集成 HTTP 工具 Axios

1. 安装

```shell
npm i axios -S
```

2. 配置 Axios

Axios 作为 HTTP 工具，在 `utils` 目录中创建 `axios.ts` 作为 Axios 配置文件

3. 使用 Axios

```ts
import axios from '../utils/axios'
...
axios
  .get('/user/login')
  .then((res) => {
    console.log('res: ', res)
  })
  .catch((err) => {
    console.log('err: ', err)
  })

# or

const { data } = await axios.get('/user/login')
console.log(data, 'data')
```

## 集成 CSS 预编译器 Stylus/Sass/Less

直接项目中安装 `Stylus/Sass/Less` 就行，跟 `webpack` 区别就是，`Webpack` 需要安装 相应的 `loader`，而 Vite 不需要

```shell
npm i less -D
# or
npm i sass -D
npm i stylus -D

```

至此，一个基于 `Vue3 + Vite + TypeScript + Vue Router + pinia + Axios + Stylus/Sass/Less` 的前端项目开发环境搭建完毕。

## 代码规范

随着前端应用逐渐变得大型化和复杂化，在同一个项目中有多个人员协同开发时，由于能力程度不等，往往会自己的编码风格和习惯在项目中写代码，长此下去，势必会让项目的健壮性越来越差，慢慢变成巨石应用，为解决这些问题，使用 `EditorConfig + Prettier + ESLint + Stylelint` 组合来实现代码规范化。

代码规范的优点就可以在协同开发中就得到很好的提现了：

- 解决团队之间代码不规范导致的可读性差和可维护性差的问题。
- 解决团队成员不同编辑器导致的编码规范不统一问题。
- 提前发现代码风格问题，给出对应规范提示，及时修复。
- 减少 bug 错误率，更高效的开发效率。
- 自动格式化，统一编码风格，更高的可读性。

项目内集成了以下几种代码校验方式

- eslint 用于校验代码格式规范
- stylelint 用于校验 css/less 规范
- prettier 代码格式化
- Git Hook （ husky + lint-staged ） 检测和提交规范
- Commitizen 用于 git 规范提交
- commitlint 用于验证 git 提交信息规范

### 集成 EditorConfig 配置

EditorConfig 有助于为不同 IDE 编辑器上处理同一项目的多个开发人员维护一致的编码风格。

官网：http://editorconfig.org

在项目根目录下增加 `.editorconfig` 文件：

```
# Editor configuration, see http://editorconfig.org

# 表示是最顶层的 EditorConfig 配置文件
root = true

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
indent_style = space # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
end_of_line = lf # 控制换行类型(lf | cr | crlf)
trim_trailing_whitespace = true # 去除行首的任意空白字符
insert_final_newline = true # 始终在文件末尾插入一个新行

[*.md] # 表示仅 md 文件适用以下规则
max_line_length = off
trim_trailing_whitespace = false
```

### 集成 Eslint 配置

1. 安装方式

   - 本地安装

   推荐本地安装，按照傻瓜式选择安装所需要的配置

   1. 安装 eslint

   ```shell
   npm i eslint -D
   ```

   2. 配置 ESLint

   ESLint 安装成功后，执行 npx eslint --init，然后按照终端操作提示完成一系列设置来创建配置文件

   1. How would you like to use ESLint? （你想如何使用 ESLint?）
   2. What type of modules does your project use?（你的项目使用哪种类型的模块?）
   3. Which framework does your project use? （你的项目使用哪种框架?）
   4. Does your project use TypeScript?（你的项目是否使用 TypeScript？）
   5. Where does your code run?（你的代码在哪里运行?）
   6. How would you like to define a style for your project?（你想怎样为你的项目定义风格？）
   7. Which style guide do you want to follow?（你想遵循哪一种风格指南?）
   8. What format do you want your config file to be in?（你希望你的配置文件是什么格式?）
   9. Would you like to install them now with npm?（你想现在就用 NPM 安装它们吗?）

- 手动安装

```shell
npm i @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-airbnb-base eslint-plugin-import eslint-plugin-vue -D
```

2. 创建并配置文件 `.eslintrc.js`

在项目根目录中新建文件 `.eslintrc.js` 配置文件，`.eslintignore` 规范忽略配置

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['plugin:vue/essential', 'airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {},
}
```

3. 在`package.json` script 中添加 `eslint` 命令

```
"lint:eslint": "eslint --cache --max-warnings 0 \"{src,mock}/**/*.{vue,ts,tsx}\" --fix",
```

### 集成 Prettier 配置

Prettier 是一款强大的代码格式化工具，支持 JavaScript、TypeScript、CSS、SCSS、Less、JSX、Angular、Vue、GraphQL、JSON、Markdown 等语言，基本上前端能用到的文件格式它都可以搞定，是当下最流行的代码格式化工具。

官网：https://prettier.io/

1. 安装

```shell
npm i prettier -D
```

2. 创建 `Prettier` 配置文件

在本项目根目录下创建 `prettier.config.js` 文件

3. 配置 `prettier.config.js`

```js
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  vueIndentScriptAndStyle: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  bracketSpacing: true,
  trailingComma: 'all',
  jsxSingleQuote: false,
  arrowParens: 'always',
  insertPragma: false,
  requirePragma: false,
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'auto',
}
```

4. 安装并配置好之后，使用命令来格式化项目代码

```
# 格式化所有文件（. 表示所有文件）
npx prettier --write .
```

5. 在`package.json` script 中添加 `prettier` 命令

```
"lint:prettier": "prettier --write  \"src/**/*.{js,json,tsx,css,less,scss,vue,html,md}\"",
```

### 解决 Prettier 和 ESLint 的冲突

项目中实际情况会由于额外的 ESLint 和 Prettier 配置规则，存在规则冲突情况，需要用到 eslint-plugin-prettier 和 eslint-config-prettier。

- eslint-plugin-prettier 将 Prettier 的规则设置到 ESLint 的规则中。
- eslint-config-prettier 关闭 ESLint 中与 Prettier 中会发生冲突的规则。

最后形成优先级：`Prettier` 配置规则 > `ESLint` 配置规则。

- 安装插件：

```shell
npm i eslint-plugin-prettier eslint-config-prettier -D
```

- 在 `.eslintrc.js` 添加 `prettier` 插件

```js
module.exports = {
  ...
  extends: [
    ...
    'plugin:prettier/recommended' // 添加 prettier 插件
  ],
  ...
}
```

### 集成 Stylelint 配置

`Stylelint` 负责对样式的格式化规范，先安装插件

官网：https://stylelint.io/

1. 安装 `Stylelint`

```shell
npm i stylelint postcss-html stylelint-config-html  stylelint-config-prettier stylelint-config-recommended stylelint-config-standard stylelint-order -D
```

2. 创建并配置`stylelint.config.js`文件

```js
module.exports = {
  rules: {
    'block-no-empty': null,
    'color-no-invalid-hex': true,
    'comment-empty-line-before': [
      'always',
      {
        ignore: ['stylelint-commands', 'between-comments'],
      },
    ],
    'declaration-colon-space-after': 'always',
    indentation: [
      'tab',
      {
        except: ['value'],
      },
    ],
    'max-empty-lines': 2,
    'rule-nested-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'unit-whitelist': ['em', 'rem', '%', 's'],
  },
}
```

3. 在`package.json` script 中添加 `stylelint` 命令

```
"lint:stylelint": "stylelint --cache --fix \"**/*.{vue,less,postcss,css,scss}\" --cache --cache-location node_modules/.cache/stylelint/",
```

## 集成 husky 和 lint-staged 配置

上面代码规范是写代码的时候，对我们的代码进行了实时校验，但是有些团队成员觉得这些条条框框影响自己的开发效率，觉得麻烦。往往就禁用这些工具，依然按照自己的风格编写代码，直接将不合格、不规范的代码提交到仓库去了，为了限制这些情景，让没通过 `Eslint + Stylelint` 检测和修复的代码禁止提交。

为了解决这个问题，我们需要用到 Git Hook，在本地执行 git commit 的时候，就对所提交的代码进行 `Eslint + Stylelint` 检测和修复，如果这些代码没通过 ESLint 规则校验，则禁止提交。

借助 husky + lint-staged 来处理提交校验

> husky —— Git Hook 工具，可以设置在 git 各个阶段（pre-commit、commit-msg、pre-push 等）触发我们的命令。  
> lint-staged —— 在 git 暂存的文件上运行 linters。

### 配置 husky

- 自动配置（推荐）

使用 `husky-init` 命令快速在项目初始化一个 `husky` 配置。

```shell
npx husky-init && npm install
```

此命令做了如下四件操作：

1. 安装 husky 到开发依赖

2. 在项目根目录下创建 .husky 目录

3. 在 .husky 目录创建 pre-commit hook，并初始化 pre-commit 命令为 npm test

4. 修改 package.json 的 scripts，增加 "prepare": "husky install"

#### 如何关闭

```shell
# 删除husky依赖即可
yarn remove huksy
```

#### 如何跳过某一个检查

```shell
# 加上 --no-verify即可跳过git hook校验（--no-verify 简写为 -n）
git commit -m "xxx" --no-verify
```

### 配置 lint-staged

`lint-staged` 自动修复提交文件风格，这个工具一般结合 husky 来使用，它可以让 husky 的 hook 触发的命令只作用于 git add 那些文件（即 git 暂存区的文件），而不会影响到其他文件。

1. 安装 lint-staged

```shell
npm i lint-staged -D
```

2. 在 package.json 里增加 lint-staged 配置项

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.vue": [
    "eslint --fix",
    "stylelint --fix",
    "prettier --write"
  ],
  "*.{scss,less,styl}": [
    "stylelint --fix",
    "prettier --write"
  ]
}
```

3. 修改 `.husky/pre-commit` hook 的触发命令为：npx lint-staged

```
- npm test
+ npx lint-staged
```

## 提交规范

在多人协作的开发的项目中，在 git 提交代码时，也存在一种情况：不能保证每个人对提交信息的准确描述，因此会出现提交信息紊乱、风格不一致的情况；

如果 `git commit` 的描述信息精准，在后期维护和 Bug 处理时会变得有据可查，项目开发周期内还可以根据规范的提交信息快速生成开发日志，从而方便我们追踪项目和把控进度。

社区最流行、最知名、最受认可的 [Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) 团队提交规范

### commit message 格式规范

```
<type>(<scope>): <subject>
```

#### type

用于说明 commit 的提交类型（必须是以下几种之一）

- feat：增加新功能
- fix：修复问题/BUG
- style：代码风格相关无影响运行结果的
- perf：优化/性能提升
- refactor：重构
- revert：撤销修改
- test：测试相关
- docs：文档/注释
- chore：依赖更新/脚手架配置修改等
- workflow：工作流改进
- ci：持续集成
- mod：不确定分类的修改
- wip：开发中
- types：类型修改

#### scope

scope 用于指定本次 commit 影响的范围

#### subject

subject 是本次 commit 的简洁描述，长度约定在 50 个字符以内

#### 规范 commit message 的好处

- 首行就是简洁实用的关键信息，方便在 git history 中快速浏览。
- 具有更加详细的 body 和 footer，可以清晰的看出某次提交的目的和影响。
- 可以通过 type 过滤出想要查找的信息，也可以通过关键字快速查找相关提交。
- 可以直接从 commit 生成 change log。

### 集成 Commitizen 实现规范提交

为提高生产效率，不用具体写 `type subject body footer`，因此使用 `Commitizen` 工具来帮助我们自动生成 commit message 格式，从而实现规范提交。

> Commitizen 是一个帮助撰写规范 commit message 的工具。它有一个命令行工具 cz-cli。

1. 安装 `Commitizen`

```shell
npm install commitizen -D
```

2. 初始化项目

```shell
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

这行命令做了两件事：

- 安装 cz-conventional-changelog 到开发依赖（devDependencies）
- 在 package.json 中增加了 config.commitizen

```json
"config": {
  "commitizen": {
    "path": "./node_modules/cz-conventional-changelog"
  }
}
```

3. 使用 Commitizen

以前我们提交代码都是 git commit -m "xxx"，现在改为 git cz，然后按照终端操作提示，逐步填入信息，就能自动生成规范的 commit message。

注意：若本地提示无此（git cz）命令，需要全局安装 `commitizen`

```shell
npm install -g commitizen
```

### 集成 commitlint 验证提交规范

1. 安装 `commitlint`

```shell
npm i @commitlint/config-conventional @commitlint/cli -D
```

2. 配置 `commitlint`

- 创建 commitlint.config.js 文件

执行命令，自动创建配置

```shell
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

- 使用 husky 的 commit-msg hook 触发验证提交信息的命令

在 `.husky` 目录下创建 `commit-msg` 文件，并在此执行 commit message 的验证命令

```shell
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

### 如何关闭

在 .husky/commit-msg 内注释里面的代码即可

```shell
# npx --no-install commitlint --edit "$1"
```

## 配置环境变量文件

创建相应文件，可以让项目使用环境变量：

- .env

- .env.development

- .env.production

## IDE 插件

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
- Volar：Vue3 的一款语法提示的插件
- EditorConfig for VS Code：编辑器编码风格
- Prettier-Code formatter：prettier 的格式化插件
- Eslint：eslint 的插件
- Stylelint：样式文件格式化插件
- JavaScript and TypeScript Nightly：起用 ts 最新语法
- DotENV：.env 文件 高亮

## vscode 设置

主要配置一些 `Eslint、Prettier、Stylelint` 的使用，以及保存自动调用插件进行格式化，项目新建一个 `.vscode` 文件夹，文件夹里新建一个 `settings.json`

```json
{
  //========================================
  //============== 编辑器 ===================
  //========================================
  // 光标的动画样式
  "editor.cursorBlinking": "phase",
  // 光标是否启用平滑插入的动画
  "editor.cursorSmoothCaretAnimation": true,
  // vscode重命名文件或移动文件自动更新导入路径
  "typescript.updateImportsOnFileMove.enabled": "always",
  // 自动替换为当前项目的内置的typescript版本
  "typescript.tsdk": "./node_modeles/typescript/lib",
  // 一个制表符占的空格数(可能会被覆盖)
  "editor.tabSize": 2,
  // 定义一个默认和的格式程序 (prettier)
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  // 取消差异编辑器忽略前空格和尾随空格的更改
  "diffEditor.ignoreTrimWhitespace": false,
  // 定义函数参数括号前的处理方式
  "javascript.format.insertSpaceBeforeFunctionParenthesis": true,
  // 在键入的时候是否启动快速建议
  "editor.quickSuggestions": {
    "other": true,
    "comments": true,
    "strings": true
  },
  //========================================
  //============== Other ===================
  //========================================
  // 启用导航路径
  "breadcrumbs.enabled": true,
  //========================================
  //============== Other ===================
  //========================================
  // 按下Tab键展开缩写 （例如Html的div,在键入的时候按Tab，快捷生成出来）
  "emmet.triggerExpansionOnTab": true,
  // 建议是否缩写 (如Html的<div />)
  "emmet.showAbbreviationSuggestions": true,
  // 建议是否展开 （如Html的 <div></div>）
  "emmet.showExpandedAbbreviation": "always",
  // 为制定语法文件定义当前的语法规则
  "emmet.syntaxProfiles": {
    "vue-html": "html",
    "vue": "html",
    "xml": {
      "arrt_quotes": "single"
    }
  },
  // 在不受支持的语言中添加规则映射
  "emmet.includeLanguages": {
    "jsx-sublime-babel-tags": "javascriptreact"
  },
  //========================================
  //============== Files ==================
  //========================================
  // 删除行位空格
  "files.trimTrailingWhitespace": true,
  // 末尾插入一个新的空格
  "files.insertFinalNewline": true,
  // 删除新行后面的所有新行
  "files.trimFinalNewlines": true,
  // 默认行尾的字符
  "files.eol": "\n",
  // 在查找搜索的时候集成的文件
  "search.exclude": {
    "**/node_modules": true,
    "**/*.log": true,
    "**/*.log*": true,
    "**/bower_components": true,
    "**/dist": true,
    "**/elehukouben": true,
    "**/.git": true,
    "**/.gitignore": true,
    "**/.svn": true,
    "**/.DS_Store": true,
    "**/.idea": true,
    "**/.vscode": false,
    "**/yarn.lock": true,
    "**/tmp": true,
    "out": true,
    "dist": true,
    "node_modules": true,
    "CHANGELOG.md": true,
    "examples": true,
    "res": true,
    "screenshots": true
  },
  // 搜索文件夹时候排外的文件夹
  "files.exclude": {
    "**/bower_components": true,
    "**/.idea": true,
    "**/tmp": true,
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.DS_Store": true,
    "**/node_modules": false
  },
  // 文件监视器排外的文件 可减少初始化打开项目的占用大量cpu
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/.vscode/**": true,
    "**/node_modules/**": true,
    "**/tmp/**": true,
    "**/bower_components/**": true,
    "**/dist/**": true,
    "**/yarn.lock": true
  },
  "stylelint.enable": true,
  "stylelint.packageManager": "yarn",
  //========================================
  //============== Eslint ==================
  //========================================
  // 状态栏显示Eslint的开启状态
  "eslint.alwaysShowStatus": true,
  // Eslint的选项
  "eslint.options": {
    // 要检查的文件拓展名数组
    "extensions": [".js", ".jsx", ".ts", ".tsx", ".vue"]
  },
  // Eslint校验的
  "eslint.validate": [
    "javascript",
    "typescript",
    "reacttypescript",
    "reactjavascript",
    "html",
    "vue"
  ],
  //========================================
  //============== Prettier ================
  //========================================
  //  使用当前项目的prettier配置文件，如果没有则使用默认的配置
  "prettier.requireConfig": true,
  "editor.formatOnSave": true,
  // 以下程序使用prettier默认进行格式化
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[less]": {
    "editor.defaultFormatter": "stylelint.vscode-stylelint"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // 保存文件的时候的配置
  "editor.codeActionsOnSave": {
    // 使用Eslint格式化代码
    "source.fixAll.eslint": true,
    // 使用stylelint格式化代码
    "source.fixAll.stylelint": true
  },
  "[vue]": {
    "editor.codeActionsOnSave": {
      // 使用Eslint格式化代码
      "source.fixAll.eslint": true,
      // 使用stylelint格式化代码
      "source.fixAll.stylelint": true
    },
    "editor.defaultFormatter": "johnsoncodehk.volar"
  },
  "compile-hero.disable-compile-files-on-did-save-code": true
}
```
