<template>
    <div>
        <router-view></router-view>
        
    
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