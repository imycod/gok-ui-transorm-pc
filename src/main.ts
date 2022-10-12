import router from './routers'
import { createApp } from 'vue'
import { createHead } from '@vueuse/head'

import './tailwind.css'
import App from './App.vue'
import one from './one-builder'

import { setupProdMockServer } from 'src/mock';

// 我希望打包后开发或者生产都能使用Mock数据，当然也可以去oneBuilder，setMockMode关掉此模式
const BUILD_ENV_MOCK='production' || 'development'
if (import.meta.env.VITE_APP_NODE_ENV === 'development') {
    setupProdMockServer();
}

const app = createApp(App)
const head = createHead()

app.use(router)
app.use(head)
app.mount(document.body)
