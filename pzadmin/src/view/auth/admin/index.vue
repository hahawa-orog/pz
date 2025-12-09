<template>
    <div>
      <PanelHead></PanelHead>
        <el-table :data="tableData.list" :style="{width:' 100%'}" >
            <el-table-column prop="id" label="id" width="180" />
            <el-table-column prop="name" label="昵称" width="180" />
            <el-table-column prop="permissions_id" label="所属类别" >
                 <!-- #default="scope"  是作用域插槽，可以通过scope.row来获取该行的数据 -->
                <template #default="scope">   
                   {{ findName(scope.row.permissions_id) }}
                </template>
            </el-table-column>
            <el-table-column prop="mobile"  label="手机号"/>
            <el-table-column prop="active" label="状态" >
                <template #default="scope">   
                    <el-tag :type="scope.row.active ? 'success' :'danger'">{{ scope ? '正常' :'异常' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间">
                <template #default="scope">
                    <div class="time">
                        <el-icon><PieChart /></el-icon>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <span>{{ scope.row.create_time }}</span>
                    </div>
                    
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
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        </div>



        <!-- 弹窗 -->
        <el-dialog v-model="dialogFormVisible" :before-close="beforeClose" title="" width="500" draggable="true">
            <el-form :model="formInfo" label-width="100px" label-positin="left" ref="formReg" :rules="rules">
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="formInfo.mobile" disabled/>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="formInfo.name"/>
                </el-form-item>
                <el-form-item label="菜单权限">
                    <el-select v-model="formInfo.permissions_id" style="width: 100%">
                        <!-- 
                            el-option里label是显示的内容    value是选中后的值
                         -->
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <!-- 点击确定之后进行表单校验，跟login那里的校验一样    formReg是表单实例-->
                    <el-button type="primary" @click="confirm(formReg)">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import dayjs from "dayjs";
import { onMounted, reactive, ref } from "vue";
import { authAdmin, menuSelectList,updateUser } from "../../../api/index";
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
});

// 接收列表数据
const tableData = reactive({
  list: [],
  total:0
});

// 来接收菜单权限下拉列表的选项
const options = ref([]);
// 根据id去匹配所属类别的昵称
const findName = id => {
  const res = options.value.find(item => item.id == id);
  return res ? res.name : "超级管理员";
};


// 获取用户列表
const getAuthAdmin=()=>{
    authAdmin(paginationData).then(({ data }) => {
    tableData.list = data.data.list;
    tableData.total=data.data.total
    // 获取到list数据之后，直接对其进行格式化
    data.data.list.forEach(item => {
      item.create_time = dayjs(item.create_time).format("YYYY/MM/DD");
    });
  })
}


onMounted(() => {
    getAuthAdmin()
  
    menuSelectList().then(({ data }) => {
      options.value = data.data;
    });
});




const handleSizeChange = (val) => {
  console.log('handleSizeChange',val);
  paginationData.size=val
  getAuthAdmin()
}
const handleCurrentChange = (val) => {
  paginationData.pageNum=val
  getAuthAdmin()
}


// 弹窗
const formReg=ref()    //弹窗实例,后续可以用于校验
const dialogFormVisible=ref(false)
// 弹窗数据
const formInfo=reactive({
    mobile:'',
    permissions_id:'',
    name:'',

})

const beforeClose=()=>{
    dialogFormVisible.value=false;

}
// 打开弹窗
const open=(item)=>{
    dialogFormVisible.value=true;
    // formInfo.phone = item.mobile
    // formInfo.permissions_id=item.permissions_id
    // formInfo.name=item.name
    Object.assign(formInfo,item)
}

const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "必填" }]
});
// 确定按钮
const confirm = async formEl => {
  if (!formEl) return; //如果没有收到表单实例
  await formEl.validate((valid, fields) => {
    if (valid) {
        updateUser({name:formInfo.name,permissions_id:formInfo.permissions_id}).then((data)=>{
            beforeClose()
            getAuthAdmin()
        })
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style lang="less" scoped>
.time {
    display: flex;
    align-items: center;
}


.pagination{
  width:100%;
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
}
</style>