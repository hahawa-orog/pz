<template>
    <div>
        <PanelHead></PanelHead>
        <div class="form">
            <el-form :model="searchData" class="search">
                <el-form-item>
                    <el-input v-model="searchData.out_trade_no" placeholder="输入订单号查询" style='width:350px'></el-input>
                    
                </el-form-item>
                <el-form-item class="search">
                    <el-button type="primary" @click="searchOrder">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="listData.list" style="width: 100%">
            <el-table-column prop="out_trade_no" label="订单号" width="140" />
            <el-table-column prop="hospital_name" label="就诊医院" />
            <el-table-column prop="service_name" label="陪诊服务" width="160"/>
            <el-table-column  label="陪护师">
                <template #default="scope">
                    <el-image style="width:40px height:40px" :src="scope.row.companion.avatar"></el-image>
                </template>
            </el-table-column>
            
            <el-table-column prop="companion.mobile" label="陪诊师电话" />
            <el-table-column prop="price" label="总价" />
            <el-table-column prop="paidPrice" label="已付" width="50"/>
            <el-table-column prop="starttime" label="下单时间" />
            <el-table-column prop="service_state" label="订单状态" >
                <template #default="scope">
                    <el-tag :type="statusMap(scope.row.trade_state)">{{ scope.row.trade_state }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="client.mobile" label="联系人电话" width="115" />
            <el-table-column  label="操作" >
                <template #default="scope">
                    <el-popconfirm
                    class="box-item"
                    title="服务是否完成"
                    confirm-button-text="是"
                    cancel-button-text="否"
                    placement="right-start"
                    @confirm="confirmService(scope.row )"
                >
                    <template #reference  v-if="scope.row.trade_state=='待服务'">
                        <el-button type="primary" link >完成服务</el-button>
                    </template>
                    <template #reference  v-else>
                        <el-button type="primary" disabled link >暂无服务</el-button>
                </template>
                </el-popconfirm>
               
                </template>
                 
            </el-table-column>
            
        </el-table>
        <el-pagination
            class="pagination"
            v-model="paginationData.pageNum"
            :current-page="paginationData.pageNum"
            :page-size="paginationData.pageSize"
            layout="total, prev, pager, next"
            :total="listData.total"
            @current-change="changePage"
            />
    </div>
</template>

<script setup>

    import {adminOrder,updateOrder} from '../../../api/index'
    import {ref,reactive,onMounted,toRaw} from 'vue'
    // 列表当前页和一页的数量
const paginationData = reactive({
  pageNum: 1,
  pageSize: 5
});

const listData=reactive({
    list:[],
    total:''
})


// 搜索框内容
const searchData=reactive({
    out_trade_no:''
})

// 获取列表
const getOrderList=()=>{
    adminOrder(paginationData).then(({data})=>{
        Object.assign(listData,data.data)
    })
}



// 点击搜索
const searchOrder=()=>{
    // console.log(1212,toRaw(Object.assign(paginationData,searchData)));
    adminOrder(toRaw(Object.assign(paginationData,searchData))).then((data)=>{
        // console.log(data.data);
        Object.assign(listData,data.data.data)
        getOrderList()
    })
}


onMounted(()=>{
    getOrderList()
})

const statusMap=(key)=>{
    const obj={
        '已取消':'info',
        '待支付':'warning',
        '已完成':'success'
    }
    return obj[key]
}

// 点击服务完成按钮
const confirmService=(item)=>{
    updateOrder({id:item.out_trade_no}).then((data)=>{
        console.log(data);
        // getOrderList()
    })
}

const changePage=(val)=>{
    paginationData.pageNum=val
    getOrderList()
}



</script>

<style lang="less" scoped>
.pagination{
    background-color: #fff;
    width: 100%;
    display: flex;
    justify-content: right;
}

.form{
    background-color: #fff;
    padding: 10px;
    .search{
    display: flex;
   
    justify-content: right;
    align-items: center;
}
}

</style>