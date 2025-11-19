<template>
    <div>
        <router-view></router-view>
        
        <van-tabbar v-model="active">
            <!-- 
                url属性是点击后跳转的链接，是在当前端口后面直接拼接   因为使用的是hash模式，所以#也是需要携带的
             -->
            <van-tabbar-item 
                v-for="(item,index) in router.options.routes[0].children" 
                :key="index" 
                :icon="item.meta.icon"
                :url="`#/${item.path}`"
                >{{item.meta.name  }}</van-tabbar-item>
            </van-tabbar>
    </div>
</template>

<script setup>
import { ref } from "vue"
import {useRouter,useRoute} from 'vue-router'
const router = useRouter()
const route = useRoute()
const active = ref(0);


console.log('router',router);
</script>

<style lang="scss" scoped>
</style>