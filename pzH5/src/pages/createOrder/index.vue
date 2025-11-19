<template>
    <div class="container">
        <div class="header">
            <div class="header-left">
                <van-icon name="arrow-left" size="30"  @click="goBack"/>
            </div>
            订单详情
        </div>
        <schedule :item="0" />

        <van-cell class="cell">
          <template #title>
                
                  <div class="title">
                    <van-image
                    :src="createInfo.service.serviceImg"
                    class="center-image"
                    radius="5px"
                    width="25"
                    height="25"
                />
               
                <div class="serve-name">{{ createInfo.service.serviceName }}</div>
                  </div>
          </template>
          <template #default>
            <div class="service-text">服务内容</div>
          </template>
        </van-cell>


        <van-cell-group  class="cell">
            <van-cell >
                <template #title>
                        <div class="title">
                              <div class="serve-name">就诊医院</div>
                        </div>
                </template>
                <template #default>
                    <div @click="openHospital">
                      {{ formData.hospital_name || '请选择医院' }}
                      <van-icon name="arrow" />
                    </div>
                  
                </template>
            </van-cell>
            <van-cell >
                <template #title>
                        <div class="title">
                              <div class="serve-name">就诊时间</div>
                        </div>
                </template>
                <template #default>
                    <div @click="openShowTime">
                      {{ selectTime || '请选择就诊时间' }}
                      <van-icon name="arrow" />
                    </div>
                  
                </template>
            </van-cell>

            <!-- 陪诊师 -->
            <van-cell >
                <template #title>
                        <div class="title">
                              <div class="serve-name">陪诊师选择</div>
                        </div>
                </template>
                <template #default>
                    <div @click="openShowCompanion">
                      {{ selectCompanion || '请选择陪诊师' }}
                      <van-icon name="arrow" />
                    </div>
                  
                </template>
            </van-cell>

            <!-- 接送地址 -->
            <van-cell >
                <template #title>
                        <div  class="title">
                              <div class="serve-name">请输入接送地址</div>
                        </div>
                </template>
                <template #default>
                    <van-field class="ipt" input-align="right" v-model="formData.receiveAddress"  placeholder="请输入接送地址" />
                
                </template>
            </van-cell>

            <!-- 联系电话 -->
            <van-cell >
                <template #title>
                        <div  class="title">
                              <div class="serve-name">请输入电话</div>
                        </div>
                </template>
                <template #default>
                    <van-field class="ipt" input-align="right" v-model="formData.tel"  placeholder="请输入联系电话" />
                
                </template>
            </van-cell>
        </van-cell-group>

        <van-cell-group title="服务需求" class="cell">
          <template #default>
            <van-field
                v-model="formData.demand"
                rows="2"
                autosize
                type="textarea"
                maxlength="50"
                placeholder="请输入服务需求"
              />
                </template>
        </van-cell-group>

        <van-button type="primary" class="submit"  block @click="createOrder">确认订单</van-button>

<!-- 这里是医院弹窗 -->
        <div>
          <van-popup
                  :show="showHospitals"
                  position="bottom"
                  :style="{ height: '30%' }"
          >

<!--:columns="showHospColumns"  是vant里展示的数据，数据格式可以查看vant，text是展示显示的数据，value是选中的值 -->
              <van-picker
                :columns="showHospColumns"
                @confirm="confirmHospital"
                @cancel="cancelHospital"
              />
          </van-popup>
        </div>


        <!-- 这里是日期选择弹窗 -->
        <div>
              <van-popup
                      :show="showStartTime"
                      position="bottom"
                      :style="{ height: '30%' }"
              >
                    <van-date-picker
                      @confirm="confirmStartTime"
                      @cancel="cancelStartTime"
                      v-model="currentDate"
                      title="选择日期"
                      :min-date="minDate"
                    />
            </van-popup>
        
        </div>

        <!-- 这里是弹出陪诊师弹窗 -->
        <div>
              <van-popup
                      :show="showCompanion"
                      position="bottom"
                      :style="{ height: '30%' }"
              >
                  <van-picker
                    :columns="companions"
                    @confirm="confirmCompanion"
                    @cancel="cancelCompanion"
                  />
            </van-popup>
        
        </div>


        <!-- 这里是支付弹窗 -->
        <div>
          <van-dialog :show="showPay" title="扫码支付" :showConfirmButton="false">
            <van-icon name="cross" class="close" @click="clickClose"/>
              <img :src="imageUrl" />
             <div>请使用本人微信扫码支付</div>
          </van-dialog>
        
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import schedule from "../../components/schedule.vue";
import qrcode from 'qrcode'
const router = useRouter();
const { proxy } = getCurrentInstance();

// 所有选项选择的值
const formData = reactive({
  hospital_id: "",
  hospital_name: "",
  starttime:0,
  companion_id:0,
  receiveAddress:'',
  tel:'',
  demand:''
});
const createInfo = reactive({
  companion: [],
  hospitals: [],
  service: {}
});
onMounted(async () => {
  const { data } = await proxy.$api.h5Companion();
  Object.assign(createInfo, data.data);
  console.log(createInfo);
});
const goBack = () => {
  router.go(-1);
};

// 弹出层

// 医院弹出层
const showHospitals = ref(false);
// 就诊时间弹出层
const showStartTime = ref(false);
// 陪诊师弹出层
const showCompanion=ref(false)

// 选择好之后展示出来的日期
const selectTime=ref('')

// 陪诊师展示
const selectCompanion=ref('')


// 日期选择器打开的时候的第一个时间，应该获取当前日期
const currentDate = ref([]);
// const minDate=new Date(date.getFullYear(),date.getMonth()+1,date.getDate())
const date=new Date()
currentDate.value.push(date.getFullYear())
currentDate.value.push(date.getMonth()+1)
currentDate.value.push(date.getDate())



const openHospital = () => {
  showHospitals.value = true;
};
const cancelHospital = () => {
  showHospitals.value = false;
};
const openShowTime = () => {
  showStartTime.value = true;
};

const cancelStartTime = () => {
  showStartTime.value = false;
};

const openShowCompanion=()=>{
  showCompanion.value=true
}

const cancelCompanion=()=>{
  showCompanion.value=false
}

// 加工处理hosptila的格式，
const showHospColumns = computed(() => {
  return createInfo.hospitals.map(item => {
    return { text: item.name, value: item.id };
  });
});

// 加工处理陪诊师的格式
const companions=computed(()=>{
  return createInfo.companion.map(item=>{
    return {text:item.name,value:item.id}
  })
})
const confirmHospital = item => {
  formData.hospital_id = item.selectedOptions[0].value;
  formData.hospital_name = item.selectedOptions[0].text;
  showHospitals.value = false;
};


// 选择日期点击确定
const confirmStartTime=item =>{
  currentDate[0]=item.selectedValues[0]
  currentDate[1]=item.selectedValues[1]
  currentDate[2]=item.selectedValues[2]
  selectTime.value=item.selectedValues.join('-')
  showStartTime.value=false
  formData.starttime=new Date(item.selectedValues.join('-')).getTime()
  // console.log('formData',formData);
}


// 陪诊师确认
const confirmCompanion=item=>{
  formData.companion_id=item.selectedValues[0]
  selectCompanion.value=item.selectedOptions[0].text
  showCompanion.value=false;
}

// 支付显示与隐藏
const showPay=ref(false)
// 二维码图片路径
const imageUrl=ref('')
// 点击确认按钮
const createOrder=()=>{
  const params=[
    'hospital_id',
    'hospital_name',
    'starttime',
    'companion_id',
    'receiveAddress',
    'tel',
    'demand']
  for(let i of params){
    if(!formData[i]){
      return showNotify({ type: 'danger', message: '请将信息填写完整' });
    }
    
  }
  proxy.$api.createOrder(formData).then(({data})=>{
    qrcode.toDataURL(data.data.wx_code)
    .then(url => {   //是响应成功后返回一个二维码
      // console.log(url);
      imageUrl.value=url
      showPay.value=true   
    })  
    .catch(err => {
      console.error(err)
    })
    })
}



// 在支付的时候点击关闭
const clickClose=()=>{
  router.push('/order')
}
</script>


<style lang="less" scoped>
.container {
  background-color: #f0f0f0;
  height: 100vh;
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

.title {
  display: flex;
  align-items: center;

  .serve-name {
    padding-left: 15px;
  }
}

.cell {
  width: 95%;
  margin: 5px auto;
  background-color: #fff;
  ::v-deep(.van-field__control) {
    color: var(--van-cell-value-color);
  }
}
.service-text {
  background: url(data:image/png;base64,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)
    no-repeat center center;
  background-size: 20px;
}
.sumbit {
  position: absolute;
  bottom: 0;
}
::v-deep(.van-dialog__content) {
  text-align: center;
  padding: 20px;
  .close {
    position: absolute;
    right: 20px;
    top: 15px;
  }
}
.ipt{
  padding: 0;
  margin: 0;
}

.submit{
  position:absolute;
  bottom:0;
}
</style>
