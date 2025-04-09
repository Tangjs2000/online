import './assets/main.css'
import 'element-plus/dist/index.css'
import 'tdesign-mobile-vue/es/style/index.css'

import {createApp} from 'vue'
import '/src/stores/tool/MockServer.js'
import App from './App.vue'
import { createPinia } from 'pinia'
import routes from './router'
import TDesign from 'tdesign-mobile-vue'
import ElementPlus from 'element-plus'
import {APP_STORAGE} from "./stores/AppStorage.ts";
import {keepAlive} from "./application/ApplicationBackend";


const app = createApp(App)
app.use(createPinia())
// app.use(store)  // vuex
app.use(routes)
app.use(TDesign)
app.use(ElementPlus)
// app.use(globalComponents)
app.config.globalProperties.$globalStorage = APP_STORAGE()
app.mount('#app')


setTimeout(() => {
    keepAlive.openConn();
})

/**
 * 自定义Html5
 */
/*customElements.define('mention', class Mention extends HTMLElement {
    constructor() {
        super();
        // 元素功能代码
        // 创建 Shadow DOM
        this.attachShadow({mode: 'open'});

        // 定义样式和内容
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          border: 1px solid #ccc;
          padding: 15px;
          margin: 10px 0;
        }
        
        .title {
          color: var(--primary-color, #0066cc);
          font-size: 1.2em;
          margin-bottom: 10px;
        }
        
        ::slotted(p) {
          color: #666;
        }
      </style>
      
      <div class="title"><slot name="title">默认标题</slot></div>
      <div class="content"><slot></slot></div>
    `;
    }

    connectedCallback() {
        this.innerHTML = `<p>自定义元素内容</p>`;
    }
})*/
