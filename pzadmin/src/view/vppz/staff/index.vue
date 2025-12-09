<template>
    <div>
        
        <PanelHead></PanelHead>
        <div class="btns">
            <el-button type="primary" :icon="Plus" @click="open(null)" size="small">添加</el-button>
            <el-popconfirm title="是否删除" 
                        confirm-button-text="是"
                        cancel-button-text="否"
                        @confirm="confirmEvent"
                        >
                <template #reference>
                    <el-button  :icon="Delete" type="danger" size="small">删除</el-button>
                </template>
            </el-popconfirm>
        </div>

        <!-- 展示陪护师列表        select事件是选中checkbox之后的回调，选中之后会传递一个数组，里面是被选中的所有行-->
        <el-table :data="companionListOptions.list" :style="{width:' 100%'}" ref="table"  @select="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="id" width="80" />
            <el-table-column prop="name" label="昵称" width="180" />
            <el-table-column prop="avatar" label="头像" width="150">  
                <template #default="scope">
                    <el-image :src="scope.row.avatar" 
                            style="width:50px;height:50px;">
                    </el-image>
                </template>
            </el-table-column>
            
            <el-table-column prop="mobile" label="电话" width="150"/>
            
            <el-table-column prop="sex" label="性别" width="150">
                <template #default="scope">
                    {{ scope.row ? '男' : '女' }}
                </template>
            </el-table-column> 

            <el-table-column prop="active" label="状态" width="90">
                <template #default="scope">
                    <el-tag
                        :type="scope.row.active ? 'primary' : 'danger'"
                        effect="dark"
                        >
                        {{ scope.row.active ? '正常' : '异常' }}
                    </el-tag>
                </template>
            </el-table-column> 
            <el-table-column prop="create_time" label="加入时间" width="190">
                <template #default="scope">
                    {{scope.row.create_time}}
                </template>
            </el-table-column> 
            <el-table-column label="操作">
                <!-- #default="scope"  是作用域插槽，可以通过scope.row来获取该行的数据 -->
                <template #default="scope">   
                    <el-button  type="primary" size="small" @click="open(scope.row)">Edit</el-button>
                </template>
            </el-table-column>
           </el-table>

           <!-- 分页 -->
           <div class="pagination">
                <el-pagination
                v-model="paginationData.pageNum"
                :page-size="paginationData.pageSize"
                size="default"
                :background="false"
                layout="total, prev, pager, next"
                :total="companionListOptions.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                />
            </div>


        <el-dialog  v-model="dialogFormVisible" :before-close="beforeClose" title="添加陪护师" width="500" draggable="true">
            <el-form  :model="formInfo" label-width="100px" label-positin="left" ref="formReg" :rules="rules">
                <el-form-item v-show="false" prop="id">
                    <el-input v-model="formInfo.id"/>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="formInfo.name" placeholder="请输入昵称"/>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <el-button v-if="!formInfo.avatar" type="primary" @click="dialogImgVisable=true">点击上传</el-button>
                    <el-image v-else :src="formInfo.avatar" @click="dialogImgVisable=true" style="width:100px;height:100px;"></el-image>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="formInfo.sex" placeholder="请选择性别">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input-number v-model="formInfo.age" :min="18" :max="50" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="formInfo.mobile" placeholder="请输入手机号"/>
                </el-form-item>
                <el-form-item label="是否生效" prop="active">
                    <el-radio-group v-model="formInfo.active">
                        <el-radio :value="0" >失效</el-radio>
                        <el-radio :value="1" >生效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <!-- 点击确定之后进行表单校验，跟login那里的校验一样    formReg是表单实例-->
                    <el-button type="primary" @click="confirm(formReg)">确定</el-button>
                </div>
            </template>
        </el-dialog>


<!-- 选择头像的 弹窗 -->
        <el-dialog v-model="dialogImgVisable" :before-close="()=>{dialogImgVisable=false}" title="选择头像" width="680">
            <div class="image-list">
                <div class="img-box" v-for="(item,index) in fileList" :key="item.name" @click="selectIndex=index">
                    <div v-if="selectIndex==index" class="select">
                        <el-icon color="#fff"><Check /></el-icon>
                    </div>
                    <el-image style="width:148px;height:148px" :src="item.url"></el-image>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <!-- 点击确定之后进行表单校验，跟login那里的校验一样    formReg是表单实例-->
                    <el-button type="primary" @click="dialogImgVisable=false">取消</el-button>
                    <el-button type="primary" @click="confirmImage">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import dayjs from "dayjs";
import { Plus,Delete } from '@element-plus/icons-vue'
import { ref, reactive, onMounted,nextTick,toRaw } from "vue";
import { photoList, Companion, CompanionList,deleteCompanion } from "../../../api/index";
import { ElMessage } from "element-plus";

const dialogFormVisible = ref(false);
const dialogImgVisable = ref(false);
const type=ref(0)    //type是0，表示是修改，1表示添加
// 选中的头像的index
const selectIndex = ref(0);
// 获取表单实例
const formReg = ref();
const formInfo = reactive({
  id: "",
  mobile: "",
  name: "",
  active: 1,
  age: "",
  avatar: "",
  sex: ""
});

// 列表当前页和一页的数量
const paginationData = reactive({
  pageNum: 1,
  pageSize: 5
});

// 陪护师列表
const companionListOptions = reactive({
  list: [],
  total: 0
});
// 获取陪护师列表
const getCompanionList = () => {
  CompanionList(paginationData).then(({ data }) => {
    Object.assign(companionListOptions, data.data);
    companionListOptions.list.forEach((item)=>{
        item.create_time=dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')
    })
  });
};

// 存储头像
const fileList = reactive([]);
onMounted(() => {
  photoList().then(({ data }) => {
    Object.assign(fileList, data.data);
    
  });
  getCompanionList();
});

// 确认头像
const confirmImage = () => {
  formInfo.avatar = fileList[selectIndex.value].url;
  dialogImgVisable.value = false;
};

const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "必填" }],
  sex: [{ required: true, trigger: "blur", message: "必填" }],
  mobile: [{ required: true, trigger: "blur", message: "必填" }]
});
const beforeClose = () => {
  dialogFormVisible.value = false;
  formReg.value.resetFields();
};

// 点击确定之后表单校验
const confirm = async formEl => {
  if (!formEl) return; //如果没有收到表单实例
  await formEl.validate((valid, fields) => {
    if (valid) {
      Companion(formInfo).then(({ data }) => {
        if (data.code == 10000) {
          dialogFormVisible.value = false;
          ElMessage.success("添加成功");
          getCompanionList();
          formReg.value.resetFields();
        } else {
          ElMessage.error("添加失败");
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  // 因为弹窗打开是异步任务，需要等完全打开之后，才能进行下一步
  // 如果是编辑菜单，则需要将信息重新渲染到弹窗当中，如果是添加，打开弹窗就已经可以了
  nextTick(() => {
    // 如果是编辑,
    if (rowData) {
      // 点击edit标签，该行的内容通过rowData传递了过来，但是想要显示在弹窗打开后的input框中，需要赋值给formInfo
      // 但是不能直接一次性赋值，那样会丢失响应式
      Object.assign(formInfo,rowData);

    }
  });
};



// 分页
const handleSizeChange = (val) => {
  paginationData.size=val
  getCompanionList()
}
const handleCurrentChange = (val) => {
  paginationData.pageNum=val
  getCompanionList()
}

const multipleSelection=ref([])
// 选中某一行的回调
// 选择某一行的checkbox之后，这个回调会传递一个数组，数组是被选中的所有对象
const handleSelectionChange=(val)=>{
  multipleSelection.value=val
}


const table=ref()
// 点击删除按钮的回调
const confirmEvent=()=>{
  if (!multipleSelection.value.length) {
    return ElMessage({
      showClose: true,
      message: '请选择至少一个删除项',
      type: 'warning',
    })
  }
  
  deleteCompanion({ id: multipleSelection.value }).then(({ data }) => {
    getCompanionList()
  })
}       
</script>

<style lang="less" scoped>
.pagination{
    width:100%;
    background-color: #fff;
    display: flex;
    justify-content:right;
}
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>