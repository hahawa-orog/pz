<template>
    <div class="header-container">
        <div class="header-left  flex-box">
            <el-icon size="25" class="ico" @click="store.commit('changeCollapse')"><Fold /></el-icon>
            <ul class="flex-box ">
              <li v-for="(item,index) in selectMenu" :key="index"  class="tab flex-box" :class="{selected: route.path == item.path}">
                <el-icon size="12"><component :is="item.icon"></component></el-icon>
                <router-link :to="item.path" class="flex-box text">
                  {{ item.name }}
                </router-link>
                <el-icon size="12" class="close" @click="closeTab(item, index)"><Close /></el-icon>
              </li>
            </ul>
        </div>
        <div class="header-right">
          <!-- 
            下拉菜单的指令事件

            在el-dropdown组件里定义@command自定义事件
            在el-options里定义commend属性来调用自定义事件，但是所有的选项都可以调用事件，需要指定不同的命令来判断是那个事件
           -->

          <el-dropdown class="dropdown" @command="handleCommand">
            <div class="el-dropdown-link flex-box">
              <el-avatar :size="25" :src="userInfo.avatar" />
              &nbsp;
              <div class="user-name">{{userInfo.name}}</div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                
              </el-dropdown-menu>
            </template>
        </el-dropdown>
        </div>
    </div>
</template>

<script setup>
// 创建store时候使用的函数是createStore,获取store的参数和方法的时候，调用的参数是useStores
import { useStore } from "vuex";
// useRoute和useRouter相当于vue2的route和router
import {useRoute,useRouter} from 'vue-router'
import { computed } from "vue";

const route = useRoute();
const router=useRouter()

const store = useStore();
 //通过计算属性获得store数据是经过ref加工，在script里想要使用，要通过value来获取他的值
const selectMenu = computed(() => store.state.menu.selectMenu);



// 获取用户的信息，头像和name，这些在登录之后已经存储到了浏览器
const userInfo=JSON.parse(localStorage.getItem('pz_userInfo'))
// 关闭面包屑   详细理解   详细理解   详细理解   详细理解   详细理解
// item是点击的那个面包屑对象，index是索引
const closeTab=(item, index)=>{

  store.commit('closeTab',item)
    // 关闭不是当前选中的面包屑,也就是关闭的不是当前路由
  if (item.path !== route.path) {
    return;
  }
  // 如果关闭当前选中的面包屑，要考虑后面还有没有，后面有的话选中后面的，后面没有选中前面的
  // 如果是仅仅一个面包屑，则回到最初的路径
  // 删除非当前页标签的跳转逻辑
  const selectMenuData = selectMenu.value;   //通过计算属性获得store数据是经过ref加工，在script里想要使用，要通过value来获取他的值
  // 首先考虑只有一个面包屑
  if(selectMenuData.length==0){  //长度等于0，表示所有的面包屑都已经关闭
    router.push({path:'/dashboard'})
    return;
  }

  // 如果点击的最后面的，则指定倒数第二个
  if(index==selectMenuData.length){
    index--;
    let target=selectMenuData[index]
    router.push({path:target.path})
  }else{       //如果不是最后面的，则指向后一个
    let target=selectMenuData[index]
    router.push({path:target.path})
  }
}



// 下拉菜单指令
const handleCommand=(commend)=>{
  if(commend== 'logout'){
    // 退出登录，清除本地存储的内容并且进行路由跳转
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userInfo')
    localStorage.removeItem('pz_v3pz')
    window.location.href=window.location.origin
  }
}
</script>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
  height: 100%;
}
.header-container {
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-left {
    display: flex;
    align-items: center;
    height: 100%;
    .ico {
      height: 100%;
      width: 45px;
    }
    .ico:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }

    .tab {
      height: 100%;
      padding: 0 10px;
      .text {
        margin: 0 10px;
      }

      .close {
        visibility: hidden;
      }

      &.selected {
        background-color: #f5f5f5;
        i {
          color: #409eff;
        }
        a {
          color: #409eff;
        }
      }
      
    }

    
    .tab:hover {
      background-color: #f5f5f5;
      .close {
        visibility: inherit;
        cursor: pointer;
        color: #000;
      }
    }
  }

  .header-right {
    height: 100%;
    display: flex;
    align-items: center;
    width: 120px;
    cursor: pointer;

    .user-name {
      font-size: 15px;
      height: 100%;
    }
  }
}
</style>