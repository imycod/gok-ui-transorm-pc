import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Components from 'unplugin-vue-components/vite'
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from "path";
import {viteMockServe} from "vite-plugin-mock";

export default ()=>{
  return defineConfig({
    base: './',
    plugins: [
      VueRouter({}),
      vue(),
      Components({ resolvers: [HeadlessUiResolver()] }),
      AutoImport({
        imports: ['vue', '@vueuse/head', VueRouterAutoImports],
      }),
      viteMockServe({
        mockPath: "./src/mock/source", // 解析，路径可根据实际变动
        localEnabled: false, // 此处可以手动设置为true，也可以根据官方文档格式
        supportTs: true, // 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件。
        watchFiles: true, // 监视文件更改
        injectCode: ` import { setupProdMockServer } from './src/mock'; setupProdMockServer(); `,
        injectFile: resolve("src/main.ts"), // 在main.ts注册后需要在此处注入，否则可能报找不到setupProdMockServer的错误
      }),
    ],
    resolve: {
      alias: {
        src: resolve(__dirname, 'src'),
      }
    },
    // define:{
    //   'process.env':{
    //
    //   }
    // },
    build:{
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    server: {
      open: true,
    },
  })
}
