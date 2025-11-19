<template>
    <div>
        <!-- 菜单的高度不是占满整个高度，所以需要设置高度 
        
        注意添加行内样式的写法

         default-active是默认激活的菜单
        -->
        <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="aside"
            :default-active="avtive"
            text-color="#fff"
            :style="{width:isCollapse ? '64px' : '230px'}"   
            @open="handleOpen"
            @close="handleClose"
            :collapse='isCollapse' 
            :collapse-transition='false'
                
        >
        <!-- 本来上方的style和下方的tit都是固定的，但是Aside组件需要被收缩，就改成了表达式 -->
        <p class="tit">{{ isCollapse ? 'DIDI' : 'DIDI陪诊' }}</p>
        <TreeMenu :menuData="menuData" :index="1"/>
      </el-menu>
    </div>
</template>

<script  setup>
import TreeMenu from './TreeMenu.vue'
import { reactive,computed } from 'vue';
import {useRouter} from 'vue-router'       //useRouter是个函数，可以获取路由信息
const router = useRouter() 

// 获取默认激活的菜单的id
const avtive=computed(()=>store.state.menu.menuActive)


// 这是获取的死的路由信息，登录之后获取了动态的路由信息，需要重新获取
// const menuData = reactive(router.options.routes[0].children) //这里获取的是侧边导航栏的路由信息，将其传递给TreeMenu组件
const menuData =computed(()=>store.state.menu.routerList)
console.log('menuData',menuData);
import {useStore} from 'vuex'

console.log('router',router);


const store = useStore()

// 在获取store里的state和getters的时候，需要在computed里获取
const isCollapse = computed(()=>store.state.menu.isCollapse)
const handleOpen = (key, keyPath) => {
  // console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  // console.log(key, keyPath);
}; 
</script>

<style lang="less" scoped>
//aside的高度设置成100%，是继承父亲的高度，父亲在Main组件里
.aside{
    height:100%;
    .tit{
        font-size: 20px;
        color: #fff;
        line-height: 50px;
        height: 50px;
        text-align: center;
    }
}
</style>