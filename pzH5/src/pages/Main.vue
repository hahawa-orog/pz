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
import { ref,computed } from "vue"
import {useRouter,useRoute} from 'vue-router'
import {useStore} from 'vuex'
const store=useStore()
const router = useRouter()
const active=computed(()=>store.state.tag.active)
const change=(item,index)=>{
    router.push(item.path)
    store.commit('changeActive',item.meta.name)
}


</script>

<style lang="scss" scoped>
</style>