<template>
<!-- 
  多级菜单的渲染可以考虑递归
  如果是固定的两级菜单，直接渲染就可以了，但是多层级使用递归更加方便

  碰见没有子菜单的菜单，直接渲染，如果有子菜单，进行递归

  要熟悉element-plus的层级关系   没有子菜单的使用el-sub-menu，有子菜单的使用el-menu-item
 -->
  <div>
    <template v-for="(item, index) in props.menuData">
      <!-- 没有子菜单的情况 
        index是element-plus里固定的属性，用于识别不同的节点，如果所有节点的index都相同，则点击一个，所有都会变化
      -->
      <el-menu-item
        v-if="!item.children || item.children.length == 0" 
        :index="`${props.index}-${item.meta.id}`"   
        :key="`${props.index}-${item.meta.id}`"
        @click="handler(item,`${props.index}-${item.meta.id}`)"
      >
        <el-icon size="20">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ isCollapse ? '' : item.meta.name }}</span>
      </el-menu-item>
      <!-- 有子菜单的情况 -->
      <el-sub-menu
        v-else
        :index="`${props.index}-${item.meta.id}`"
        :key="index"
      >
        <template #title>
          <el-icon size="20">
            <!-- 动态地根据item.meta.icon的值渲染对应的组件 -->
            <component :is="item.meta.icon"></component>
          </el-icon>
          <!-- 这里必须要用span包裹，要不然有bug -->
          <span>{{ isCollapse ? '' : item.meta.name }}</span>
        </template>
        <!-- 进行递归 -->
        <tree-menu
          :index="`${props.index}-${item.meta.id}`"
          :menuData="item.children"
        />
      </el-sub-menu>
    </template>
  </div>
</template>

<script  setup>

  import {useStore} from 'vuex'
  import {computed} from 'vue'
  import {useRouter} from 'vue-router'
  const props=defineProps(['menuData','index'])
  //创建router实例
  const router = useRouter()

  const store =useStore()
  const isCollapse = computed(()=> store.state.menu.isCollapse)
  const handler=(item,active)=>{
    // 实现路由跳转
    router.push(item.meta.path)
    // 还要给store中存储一份，以便实现面包屑的功能
     //为什么传递item.meat,因为在面包屑渲染之后，点击面包屑可以实现路由跳转，item.meta里不仅有name,还有path
    store.commit('addMenu',item.meta)   
    // 修改激活菜单的id
    store.commit('changeActive',active)
  }
</script>

<style lang="less" scoped>

</style>