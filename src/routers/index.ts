import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router/auto'
import type { RouteRecordRaw, RouterOptions } from "vue-router"

// import test from "src/pages/test.vue"
const routes: Array<RouteRecordRaw> = [
    {
        path: '/test',
        name: 'test',
        component: () => import(/* webpackChunkName: "Test" */'src/pages/test.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
} as RouterOptions )

export default router