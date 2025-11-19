import { createApp } from 'vue'
import api from './api/index'
// import './style.css'
import App from './App.vue'
import router from './router'

const app=createApp(App)

// 将api全局挂载   记住这句代码   
// 全局挂载之后，在需要使用api的组件里通过getCurrentInstance来获取，
app.config.globalProperties.$api=api
app.use(router)
app.mount('#app')
