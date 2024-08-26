import {createRouter, createWebHistory} from 'vue-router'
import OnlineAppView from '../views/OnlineAppView.vue'
import UnitView from '../views/UnitView.vue'
import VideoChatView from '../views/VideoChatView.vue'

const router = createRouter({
    history: createWebHistory(),
    mode: "history",
    routes: [
        {
            path: "/",
            redirect: "/chat"
        },
        {
            path: '/chat',
            name: 'online',
            meta: {title: '在线客服'},
            component: () => import("../views/OnlineAppView.vue")
        },
        {
            path: '/unit-view',
            name: 'unitView',
            meta: {title: '单元组件'},
            component: () => import("../views/UnitView.vue")
        },
        {
            path: '/video-chat',
            name: 'videoChat',
            meta: {title: '音视频聊天'},
            component: () => import("../views/VideoChatView.vue")
        }
    ]
})

export default router
