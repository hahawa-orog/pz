import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 因为项目中使用了element的图标，这样的代码是引入全局图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './style.css'



// 引入全局组件
import PanelHead from './components/PanelHead.vue'
// 引入vuex
import store from './store/index'

//路由
import router from './router'

// 本来在登录之后，获取动态路由，侧边导航栏是根据动态路由里meta的信息生成，路由是根据动态路由生成
//  在登录之后，再刷新，本地存储的token还存在，但是store和router会清空，而且也不会回到登录页，不能重新生成动态路由，所以就会出错
// 解决办法就是使用vuex-persistedstate来存储vuex的数据，但是store存储了，侧边导航栏可以正常出现，但是路由还是不存在
// 这里就是解决路由不存在的问题
const localStorageData=JSON.parse(localStorage.getItem('pz_v3pz'))

if(localStorageData){
  // 加工路由，添加component属性
    store.commit('dynamicMenu',localStorageData.menu.routerList)
    store.state.menu.routerList.forEach((item)=>{
    router.addRoute('main',item)
  })
}
// routerSet(localStorageData.menu.routerList)

const app=createApp(App)


// 注册全局组件
app.component('PanelHead',PanelHead)
// 图标全局引入
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  } 
app.use(store)
app.use(router)

app.use(ElementPlus)
app.mount('#app')
