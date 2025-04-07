import './assets/main.css'

import {createApp} from 'vue'
import '/src/stores/tool/MockServer.js'
// import {createPinia} from 'pinia'
import App from './App.vue'
import Router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

/* TDesign */
import 'tdesign-mobile-vue/es/style/index.css'
import {
    Search as TSearch,
    Tag as TTag,
    Swiper as TSwiper,
    SwiperItem as TSwiperItem,
    Button as TButton,
    TabBar as TTabBar,
    TabBarItem as TTabBarItem,
    Icon as TIcon,
    Grid as TGrid,
    GridItem as TGridItem,
    Divider as TDivider,
    Avatar as TAvatar,
    Input as TInput,
    Textarea as TTextarea,
    Form as TForm,
    FormItem as TFormItem,
    Progress as TProgress,
    Tabs as TTabs,
    TabPanel as TTabPanel,
    Popup as TPopup,
    PullDownRefresh as TPullDownRefresh,
    Loading as TLoading,
    RadioGroup as TRadioGroup,
    Radio as TRadio,
    CheckboxGroup as TCheckboxGroup,
    Checkbox as TCheckbox,
    Upload as TUpload,
    Navbar as TNavbar,
    Image as TImage,
    ImageViewer as TImageViewer,
    Badge as TBadge,
    Fab as TFab,
    DateTimePicker as TDateTimePicker,
    Stepper as TStepper,
    Calendar as TCalendar,
    Skeleton as TSkeleton,
    NoticeBar as TNoticeBar,
    Indexes as TIndexes,
    IndexesAnchor as TIndexesAnchor,
    CellGroup as TCellGroup,
    Cell as TCell,
} from 'tdesign-mobile-vue'
import {keepAlive} from "./application/ApplicationBackend";

const app = createApp(App)
// app.use(createPinia())
app.use(Router)
app.use(ElementPlus)
app.mount('#app')
/* 按需引入TDesign组件 */
app.use(TSearch)
app.use(TTag)
app.use(TSwiper)
app.use(TSwiperItem)
app.use(TButton)
app.use(TTabBar)
app.use(TTabBarItem)
app.use(TIcon)
app.use(TGrid)
app.use(TGridItem)
app.use(TDivider)
app.use(TAvatar)
app.use(TInput)
app.use(TTextarea)
app.use(TForm)
app.use(TFormItem)
app.use(TProgress)
app.use(TTabs)
app.use(TTabPanel)
app.use(TPopup)
app.use(TPullDownRefresh)
app.use(TLoading)
app.use(TRadioGroup)
app.use(TRadio)
app.use(TCheckboxGroup)
app.use(TCheckbox)
app.use(TUpload)
app.use(TNavbar)
app.use(TImage)
app.use(TImageViewer)
app.use(TBadge)
app.use(TFab)
app.use(TDateTimePicker)
app.use(TStepper)
app.use(TCalendar)
app.use(TSkeleton)
app.use(TNoticeBar)
app.use(TIndexes)
app.use(TIndexesAnchor)
app.use(TCellGroup)
app.use(TCell)

setTimeout(() => {
    keepAlive.openConn();
})

/**
 * 自定义Html5
 */
customElements.define('mention', class Mention extends HTMLElement {
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
})
