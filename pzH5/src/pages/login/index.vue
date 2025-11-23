<template>
    <div>
        <h1>登录</h1>
        <van-form @submit="onSubmit">
            <van-cell-group>
                <van-field
                v-model="userInfo.userName"
                name="username"
                label="用户名"
                placeholder="用户名"
                :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                v-model="userInfo.passWord"
                type="password"
                name="password"
                label="密码"
                placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]"
                />
            </van-cell-group>
            <div class="sub">
                <!-- native-type="submit"是原生button的type属性 -->
                <van-button type="primary" native-type="submit" block  round>登录</van-button>
            </div>
        </van-form>

    </div>
</template>

<script setup>
// 在定义好api之后进行全局挂载(app.config.globeProperties=api)，通过getCurrentInstance可以获取实例
import {reactive,getCurrentInstance} from 'vue'
import {useRouter} from 'vue-router'
const router=useRouter()
const userInfo=reactive({
    userName:'',
    passWord:''
})

// 获取vue实例
const {proxy} = getCurrentInstance()
const onSubmit=async ()=>{
    const {data}=await proxy.$api.login(userInfo)
    if(data.code===10000){
        localStorage.setItem('h5_token',data.data.token)
        localStorage.setItem('userInfo',JSON.stringify(data.data.userInfo))
        router.push('/home')
    }
}
</script>

<style lang="less" scoped>
 h1{
    width: 100%;
    text-align:center;
    margin: 0 auto;
 }

 .sub{
    margin:16px;
 }
</style>