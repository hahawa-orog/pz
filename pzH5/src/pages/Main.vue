<template>
    <div>
        <router-view></router-view>
        
        <!-- <van-tabbar v-model="active"> -->
            <!-- 
                url属性是点击后跳转的链接，是在当前端口后面直接拼接   因为使用的是hash模式，所以#也是需要携带的
             -->
            <!-- <van-tabbar-item 
                v-for="(item,index) in router.options.routes[0].children" 
                :key="index" 
                :icon="item.meta.icon"
                @click="changeOrder(item,index)"
                >{{item.meta.name  }}
            </van-tabbar-item> -->
        <!-- </van-tabbar> -->




        <van-tabbar v-model="active">
            <van-tabbar-item 
                    v-for="(item,index) in router.options.routes[0].children" 
                    :key="index" 
                    :name="item.meta.name" 
                    @click="change(item,index)"
                    :icon="item.meta.icon">{{item.meta.name }}</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script setup>
import { ref } from "vue"
import {useRouter,useRoute} from 'vue-router'
const router = useRouter()
const route = useRoute()
const active =localStorage.getItem('active') ? ref(localStorage.getItem('active')) :  ref('首页')
const change=(item,index)=>{
    router.push(item.path)
    localStorage.setItem('active',active.value)
}


</script>

<style lang="scss" scoped>
</style>