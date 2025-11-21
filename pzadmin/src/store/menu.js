// 为了刷新之后store依然存在，在index.js里使用了vuex-persistedstate让store长久保存，这里可以直接获取
// const localStorageData = localStorage.getItem('pz_v3pz')
// const state=localStorageData ? JSON.parse(localStorageData).menu :{
//     isCollapse:false,
//     selectMenu:[],  //面包屑展示,
//     routerList:[],   //路由数据
//     menuActive:'1-1'    //激活的菜单id
// }

const state={
    isCollapse:false,
    selectMenu:[],  //面包屑展示,
    routerList:[],   //路由数据
    menuActive:'1-1'    //激活的菜单id
}


const mutations={
    changeCollapse(state){
        state.isCollapse = !state.isCollapse
    },

    addMenu(state,payload){
        // findIndex函数的作用是查找满足条件的第一个索引，找不到就是-1
        // 这里是根据在treeMenu组件里的点击来修改selectMenu，如果两次点击同一个菜单，需要进行去重
        if(state.selectMenu.findIndex(item=>item.path==payload.path)==-1){   //没有点击过当前菜单
            state.selectMenu.push(payload)
        }
    },

    // 关闭面包屑
    closeTab(state,payload){
         // findIndex函数的作用是查找满足条件的第一个索引，找不到就是-1
        let index=state.selectMenu.findIndex(item=>item.name==payload.name)
        state.selectMenu.splice(index,1)
    },
    dynamicMenu(state,payload){
        // import.meta.glob是vite提供的一个强大的动态导入功能，用于在构建时静态分析并批量导入模块。
        // 返回的其实是一个对象  获取的是view文件下所有的组件路径以及导入的语句    key是路径   值是导入的语句
        const modules=import.meta.glob('../view/**/*.vue')  //这里的路径必须写在函数里，不能定义一个变量，函数里写个变量
        // console.log('modules',modules);    //../view/auth/admin/index.vue: () => import("/src/view/auth/admin/index.vue")
       
        // routerSet函数中，router是payload  route是payload的每一项
        function routerSet(router){
            router.forEach((route)=>{
                // 没有子菜单
                if(!route.children){
                    const url =`../view${route.meta.path}/index.vue`
                    // console.log('url',url);
                    // 给对应的路由绑定对应的组件
                    route.component=modules[url]
                }else{
                    routerSet(route.children)
                }
            })
        }
        routerSet(payload)   //处理payload
        state.routerList=payload
        
    },


    changeActive(state,payload){
        state.menuActive=payload
    },

    
}

export default {
        state,
        mutations,
}

