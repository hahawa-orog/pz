<template>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <van-icon name="arrow-left" size="30"  @click="goBack"/>
            </div>
            订单详情
        </div>
        <schedule :item="stateMap[orderData.trade_state]" />


        <div class="tips">
            <div class="dzf" v-if="orderData.trade_state=='待支付'">
                <div class="text1">待支付</div>
                <div class="text2">
                    请在 <div class="cutdown"><van-count-down :time="countDown"  /></div> 内完成支付
                </div>
                <van-button type="primary" size="large" @click="openPay">去支付{{ orderData.price }}元</van-button>
            </div>
            <div class="dzf" v-if="orderData.trade_state === '待服务'">
                <div class="text1">正在为您安排服务专员...</div>
                <div class="text2">请保持手机畅通，稍后将有服务专员与您联系</div>
            </div>
            <div class="dzf" v-if="orderData.trade_state === '已完成'">
                <div class="text1">服务已完成</div>
                <div class="text2">感谢您的使用，如有售后问题请联系客服</div>
            </div>
            <div class="dzf" v-if="orderData.trade_state === '已取消'">
                <div class="text1">订单已取消</div>
                <div class="text2">期待下次为您服务，如需帮助可咨询客服</div>
            </div>
        </div>



        <van-cell-group class="card">
            <div class="header-text">预约信息</div>

            <van-cell
                v-for="(item, key) in makeIfo"
                :title="item"
                :key="key"
                :value="formatData(key)"
            />
        </van-cell-group>

        
        <van-cell-group class="card">
        <div class="header-text">订单信息</div>
        <van-cell
            v-for="(item, key) in orderInfo"
            :title="item"
            :key="key"
            :value="formatData(key)"
        />
        <van-cell title="联系客服" value="疑问或投诉>" />
        </van-cell-group>


        <!-- 这里是支付弹窗 -->
        <div>
          <van-dialog :show="showPay" title="扫码支付" :showConfirmButton="false">
            <van-icon name="cross" class="close" @click="showPay=false"/>
             <div class="context">
                <img :src="imageUrl" />
                <div>请使用本人微信扫码支付</div>
             </div>
          </van-dialog>
        
        </div>


    </div>
</template>

<script setup>
import { onMounted,getCurrentInstance,ref,computed } from 'vue';
import {useRouter,useRoute} from 'vue-router'
import qrcode from 'qrcode'


const router = useRouter()
const route = useRoute()
const {proxy} = getCurrentInstance()


// 订单详情
const orderData=ref({})

// 存储进度条的状态
const stateMap=ref({
    '待支付':10,
    '待服务':20,
    '已完成':30,
    '已取消':40
})

const countDown=computed(()=>{
    return orderData.value.order_start_time+7200000-new Date().getTime()>0 ?orderData.value.order_start_time+7200000-new Date().getTime():0 
})

onMounted(()=>{
    proxy.$api.orderDetail(route.query.oid).then(({data})=>{
        orderData.value=data.data
    })
})
const goBack=()=>{
    router.go(-1)
}


// 支付
const imageUrl=ref('')
const showPay=ref(false)

const openPay=()=>{
    showPay.value=true
    qrcode.toDataURL(orderData.value.code_url)
            .then(url => {   //是响应成功后返回一个二维码
            // console.log(url);
            imageUrl.value=url
            })
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份是从0开始的，所以需要+1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


const makeIfo = ref({
  service_name: "预约服务",
  hospital_name: "就诊医院",
  starttime: "期望就诊时间",
  "client.name": "就诊人",
  "client.mobile": "就诊人电话",
  receiveAddress: "接送地址",
  demand: "其他需求",
});
const orderInfo = ref({
  "client.mobile": "联系电话",
  order_start_time: "下单时间",
  price: "应付金额",
  out_trade_no: "订单编号",
});

const formatData = (key) => {
  if (key.indexOf(".") === -1) {
    if (key === "order_start_time") {
      return formatTimestamp(orderData.value[key]);
    }
    return orderData.value[key];
  }
  let arr = key.split(".").reduce((o, p) => {
    return (o || {})[p];
  }, orderData.value);
  return arr;
};
</script>

<style lang="less" scoped>

.container{
    margin: 5px;
    background-color: #eef1ee;
}
.header {
  padding: 10px 0;
  text-align: center;
  line-height: 30px;
  font-size: 15px;
  .header-left {
    float: left;
  }
}

.text1{
    font-size: 18px;
    font-weight: blod;
}

.text2{
    display: flex;
    // justify-content: center;
    align-items: center;
    .cutdown{
        font-size: 18px;
    }
}

.tips{
    padding:0 35px;
}

.close{
    position: absolute;
    top: 20px;
    right: 20px;
}

.context{

    text-align: center;
}

.card{
    margin:15px 0;
}
</style>