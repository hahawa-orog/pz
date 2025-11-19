<template>
    <div class="container">
        <div class="title">订单详情</div>
        <van-tabs v-model="activeName"  @click-tab="onClickTab">
            <van-tab title="全部" name=""></van-tab>
            <van-tab title="待支付" name="1"></van-tab>
            <van-tab title="待服务" name="2"></van-tab>
            <van-tab title="已完成" name="3"></van-tab>
            <van-tab title="已取消" name="4"></van-tab>
        </van-tabs>


        <van-row justify="space-between" v-for="(order,index) in order" :key="index" class="item" @click="goDetail(order)">
            <van-col span="5" class="image">
                <van-image
                    positin:center
                    :src="order.serviceImg"
                    class="center-image"
                    radius="5px"
                    width="70"
                    height="70"
                />
            </van-col>
            <van-col span="14" class="mid">
                <div>
                    <div class="service_name">{{ order.service_name }}</div>
                </div>
                <div>
                    <div class="hospital">{{ order.hospital_name }}</div>
                </div>
                <div>
                    <div class="startTime">{{ order.starttime }}</div>
                </div>
            </van-col>
            <van-col span="5" >
                <div  :style="{color:colorMap[order.trade_state]}">
                    {{ order.trade_state }}
                </div>
                <div class="time" v-if="order.trade_state=='待支付'">
                    <van-count-down :time="order.time"  :style="{color:colorMap[order.trade_state]}" />
                </div>
            </van-col>
        </van-row>


        
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import {useRouter,useRoute} from 'vue-router'
const router = useRouter()
const route = useRoute()

const { proxy } = getCurrentInstance();
const activeName = ref('');



// 用来接收订单列表
const order = ref([]);

// 定义颜色
const colorMap=ref({
    '待支付':'#ffa200',
    '待服务':'#1da6fd',
    '已完成':'#21c521'
})

const getOrderList = async state => {
  await proxy.$api.orderList({ state }).then(({ data }) => {
    order.value = data.data;
    // 给order加一个倒计时，两小时
    order.value.forEach(item=>{
        // console.log(item);
        let time=item.order_start_time+7200000-new Date().getTime()
        if(time>=0){
            item.time=time
        }
    })
    console.log(order.value);
  });
};
const onClickTab = item => {
  getOrderList(item.name);
};

onMounted(() => {
  getOrderList();
});


const goDetail=(item)=>{
  router.push(`/detail?oid=${item.out_trade_no}`)
}
</script>

<style lang="less" scoped>
.container{
    background-color: #eef1ee;
}
.title {
  height: 50px;
  font-size: 20px;
  background-color: #fff;
  text-align: center;
  line-height: 50px;
}

.item {
  margin-bottom: 5px;
  height: 80px;
  background-color: #fff;
  margin: 5px;
  
  .mid{
    
    padding-left: 10px;
  }
  .image{
    background-color: #fff;
  }
  .service_name {
    font-size: 18px;
    font-weight: blod;
  }
  .hospital,
  .startTime {
    font-size: 14px;
    color: gray;
  }
}
</style>