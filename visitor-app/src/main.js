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
    NoticeBar as TNoticeBar
} from 'tdesign-mobile-vue'



// const VConsole = require("vconsole");


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
/*vConsole.show();
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    beforeCreate() {
    }
})*/
