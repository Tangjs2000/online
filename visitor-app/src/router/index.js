import {createRouter, createWebHistory} from 'vue-router'
import OnlineAppView from '../views/OnlineAppView.vue'
import UnitView from '../views/UnitView.vue'
import VideoChatView from '../views/VideoChatView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'online',
            meta: { title: '在线客服' },
            component: () => OnlineAppView
        },
        {
            path: '/unit-view',
            name: 'unitView',
            meta: { title: '单元组件' },
            component: () => UnitView
        },
        {
            path: '/video-chat',
            name: 'videoChat',
            meta: { title: '音视频聊天' },
            component: () => VideoChatView
        }
    ]
})

export default router
