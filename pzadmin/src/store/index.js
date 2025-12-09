// vuex-persistedstate是用来缓存vuex的数据到本地存储当中
// vuex分了模块，那么vuex-persistedstate中也是分为一个个模块
import createPersistedstate from 'vuex-persistedstate'

import { createStore } from 'vuex'
import menu from './menu'
import user from './user'

// 创建一个新的 store 实例
export default  createStore({
    // 使用plugins来在本地存储当中存储vuex的数据   在menu.js里使用了，可以看看
    plugins:[new createPersistedstate({
        key:'pz_v3pz'
    })],
    modules:{
        menu,
        user
    }
})


