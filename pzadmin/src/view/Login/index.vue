<template>
    <div style="height:100%">   
        <el-row class="login-container" justify="center" align="middle">
          <el-card style="max-width:480px">
            <template #header>
                <div class="card-header">
                    <img :src="imgUrl" alt="">
                </div>
            </template>
            <div class="jump-link">
                <el-link type="primary" @click="changeType">{{ formType ? '注册账号' : '返回登陆' }}</el-link>
            </div>
            <div>
              <!-- model是用来绑定表单绑定的数据收集到哪里 
                  表单校验： 表单校验是通过rule属性来实现的，需要在form-item搭配prop属性，
                  将 form-Item 的 prop 属性设置为需要验证的特殊键值即可


                  prefix-icon是element-plus里的一个参数，用于设置图标


                  vue3当中，给子组件指定ref可以获取该组件的实例,但是需要在script里获取  const loginFormRef=ref()
              -->
              <el-form :model="formInfo" :rules="rules" ref="loginFormRef">  
                  <el-form-item prop="userName">
                      <el-input v-model="formInfo.userName" placeholder="输入电话号" prefix-icon="Iphone"/>
                  </el-form-item>
                  <el-form-item prop="passWord">
                      <el-input v-model="formInfo.passWord" placeholder="密码" type="password" prefix-icon="Lock"/>
                  </el-form-item>
                  <el-form-item v-if="!formType" prop="validCode">
                      <el-input v-model="formInfo.validCode" placeholder="验证码" prefix-icon="Lock">
                            <template #append >
                              <span @click="sendCode"> {{ countdown.msg }}</span>
                            </template>
                      </el-input>
                      
                  </el-form-item>
                  <el-form-item>
                        <el-button type="primary" :style="{width:'100%'}" @click="sumbitForm(loginFormRef)">
                          {{ formType ? '登录账号' : '注册账号' }}
                        </el-button>
                  </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-row>
    </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
import { ref, reactive,computed,toRaw } from "vue";
import {useStore} from 'vuex'
import { getCode, userAuthentication,login,menuPermissions } from "../../api/index";
const imgUrl = new URL("../../../public/login-head.png", import.meta.url).href;
const formType = ref(0); //表单的状态，1是登录，0是注册
const store = useStore()

const router=useRouter()
// 收集表单信息
const formInfo = reactive({
  userName: "",
  passWord: "",
  validCode: ""
});
//切换表单状态
const changeType = () => {
  formType.value = formType.value ? 0 : 1;
};

// 提交表表单
const loginFormRef = ref(); //获取组件实例,用于提交前检验
// 点击提交表单之后，有个自定义校验，这里的代码直接从element-plus里复制粘贴即可
const sumbitForm = async (formEl) => {
  //点击注册之后，进行 校验      直接从element-plus里复制粘贴即可
  if (!formEl) return;      //如果没有收到表单实例
  await formEl.validate((valid, fields) => {     //接收到了表单实例，需要验证
    if (valid) {//复制粘贴即可
      //验证成功
      if (!formType.value) {        //是注册页面
        userAuthentication(formInfo).then((res) => {
          if(res.data.code==10000){
              ElMessage.success('注册成功')
              formType.value=1
          }
        });
      }else{                   //是登录界面
        login(formInfo).then(({data})=>{
          if(data.code==10000){
            ElMessage.success('登录成功')
            // console.log(data.data.userInfo);
            // 登录成功之后会返回一个token，将token存储到localStorage中
            localStorage.setItem('pz_token',data.data.token)
            // 将用户信息也存储起来，方便后续使用，localStorage只能存储字符串，可以使用JSON.stringify()来转换
            localStorage.setItem('pz_userInfo',JSON.stringify(data.data.userInfo))
            menuPermissions().then(({data})=>{
              // 这是获取菜单权限信息，组件属性还是组件名  例如：component:'/dashboard'
              // console.log('login.vue 的data',data);  
              // 生成完整的路由数据  好好了解了解
              // 生成完整的路由数据  好好了解了解
              // 生成完整的路由数据  好好了解了解
              // 生成完整的路由数据  好好了解了解
              store.commit('dynamicMenu',data.data)
              // 生成完整的路由数据  好好了解了解
              // 生成完整的路由数据  好好了解了解
              // 生成完整的路由数据  好好了解了解
              // 生成完整的路由数据  好好了解了解
              // 获取完整的路由数据
              // console.log('routerList.value',routerList.value);  //这里routerList还是一个ref处理的响应式数据
              // 将routerList转变为一个普通对象，然后通过router.addRoute添加到路由当中
              // routerList是通过computed从store中得到的，属于ref对象，可以通过toRaw转化成普通对象
              toRaw(routerList.value).forEach(item=>{
                // console.log('routerList转化为普通对象之后的每一项',item);
                router.addRoute('main',item)
              })
              router.push('/')
            })
           

          }
        })
      }
    } else {
      // 失败
      console.log("error submit!", fields);
    }
  });
};

// 获取完整的路由数据
const routerList=computed(()=>store.state.menu.routerList)


// validateUserName 自定义校验手机号
const validateUserName = (rule, value, callback) => {
  const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
  if (value === "") {
    //值为空，没有输入手机号
    callback(new Error("请输入手机号"));
  } else if (!phoneReg.test(value)) {
    callback(new Error("请输入正确的手机号"));
  } else {
    callback();
  }
};

// validatePWD 校验密码
const validatePWD = (rule, value, callback) => {
  const pwdReg = /^[a-zA-Z0-9_-]{4,16}$/;
  if (value === "") {
    //值为空，没有输入密码
    callback(new Error("请输入密码"));
  } else if (!pwdReg.test(value)) {
    callback(new Error("密码格式错误"));
  } else {
    callback();
  }
};

// 表单验证,rules需要reactive来定义
const rules = reactive({
  userName: [
    {
      // validator是自定义校验规则   trigger 是什么时候校验
      validator: validateUserName, //validateUserName是个函数，即自定义规则
      trigger: "blur"
    }
  ],
  passWord: [
    {
      validator: validatePWD,
      trigger: "blur"
    }
  ]
});

// 发送短信
const countdown = reactive({
  msg: "发送验证码",
  count: 60 //倒计时
});
let flag = false; //根据flag值判断点击按钮之后是否需要发送验证码，如果已经点击且倒计时没有结束，则不用发送,false用发送
const sendCode = () => {
  if (flag) return; //flag是true，则不用发送，
  // 验证手机号，手机号错误给出提示，并且不发送
  const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
  // 如果手机号为空或者手机号校验不通过，不发送
  if (!formInfo.userName || !phoneReg.test(formInfo.userName)) {
    return ElMessage({
      message: "请检查手机号是否正确",
      type: "warning"
    });
  }
  let timer = setInterval(() => {
    if (countdown.count <= 0) {
      countdown.count = 60;
      countdown.msg = "发送验证码";
      flag = false;
      clearInterval(timer);
    } else {
      flag = true;
      countdown.count -= 1;
      countdown.msg = `剩余${countdown.count}s`;
    }
  }, 1000);
  getCode({ tel: formInfo.userName })
    .then(({ data }) => {
      //then(code)，code用于接收 Promise 成功时返回的值，{data} 解构赋值
      console.log("getCode", data);
      if (data.code == 10000) {
        ElMessage.success("发送成功");
      }
    })
    .catch(error => {
      //在发送失败的时候给个提醒，比如没有网络
      console.log("getCode", error);
      ElMessage.error("发送失败");
    });
};
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100%;
  .card-header {
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>