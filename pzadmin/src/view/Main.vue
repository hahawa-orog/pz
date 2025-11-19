<template>
    <div  class="common-layout">
        <el-container>
            <Aside></Aside>
            <el-container>
                <el-header>
                    <Header></Header>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
    import Aside from '../components/Aside.vue'
    import Header from '../components/Header.vue'
</script>

<style lang="less" scoped>
.common-layout{
    height: 100%;
    .el-container{
        height: 100%;
    }
}
</style>