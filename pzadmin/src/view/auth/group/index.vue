<template>
    <div>
      <PanelHead></PanelHead>
        <!-- 添加和修改都是打开同一个弹窗 -->
        <div class="btn">
            <el-button type="primary" :icon="Plus" @click="open(null)" size="small">添加</el-button>
        </div>
        <el-table :data="tableData.list" :style="{width:' 100%'}" >
            <el-table-column prop="id" label="id" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="permissionName" label="权限" width="550"/>
            <el-table-column label="操作">
                <!-- #default="scope"  是作用域插槽，可以通过scope.row来获取该行的数据 -->
                <template #default="scope">   
                    <el-button  type="primary" size="small" @click="open(scope.row)">Edit</el-button>
                </template>
            </el-table-column>
            
        </el-table>
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




        <!-- before-close是关闭前的回调   v-model控制弹窗的显示与隐藏    draggable  控制弹窗是否可以移动-->
        <el-dialog v-model="dialogFormVisible" :before-close="beforeClose" title="权限管理" width="500" draggable="true">
            <!--label-width来指定标签的长度  label-positin来指定标签的位置   指定label-positin的时候必须指定label-width-->
            <el-form :model="formInfo" label-width="100px" label-positin="left" ref="formReg" :rules="rules">
                <el-form-item v-show="false" prop="id">
                    <el-input v-model="formInfo.id"/>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="formInfo.name" placeholder="请输入权限名称"/>
                </el-form-item>
                <el-form-item label="权限" prop="permissions">
                    <el-tree
                        ref="treeRef"
                        style="max-width: 600px"
                        :data="options"
                        show-checkbox
                        node-key="id" 
                        :default-expanded-keys="[2]" 
                        :default-checked-keys="[4,5]"
                        :props="defaultProps"
                    />
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
import { reactive, ref, onMounted, nextTick } from "vue";
import { userGetMenu, userSetMenu, menuList } from "../../../api";
import { Plus } from '@element-plus/icons-vue'
const dialogFormVisible = ref(false);
// 获取表单实例
const formReg = ref();
const formInfo = reactive({
  id: "",
  name: ""
});

// 存储表格数据
let tableData = reactive({
  list: [],
  total: 0
});

// 获取菜单权限列表需要携带的数据   getMenuList
// 列表展示的页数和一页展示的数据数量
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
});
// 获取菜单的列表
const getMenuList = () => {
  menuList(paginationData).then(({ data }) => {
    tableData.list = data.data.list;
    tableData.total = data.data.total;
  });
};

// 菜单数据   用来渲染树形菜单
let options = ref([]);
// 挂载的时候获取树形结构菜单的数据
onMounted(() => {
  // 获取权限菜单列表，用来渲染树形菜单
  userGetMenu().then(({ data }) => {
    options.value = data.data;

  });
  //   获取已经添加的权限
  getMenuList();
});
const beforeClose = () => {
  dialogFormVisible.value = false;
  // 关闭之前还需将弹窗所选择的内容清除
  formReg.value.resetFields();
  treeRef.value.setCheckedKeys([4, 5]);
};

// 获取树形结构菜单这个节点
const treeRef = ref();

// 表单校验规则
const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "必填" }]
});
// 点击确定之后表单校验
const confirm = async formEl => {
  if (!formEl) return; //如果没有收到表单实例
  await formEl.validate((valid, fields) => {
    // 获取已经选中的节点 ,接口传递参数需要string，formEl.getCheckedKeys()得到的是数组
    const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
    if (valid) {
      // 调用接口需要传递一个id，但是id那个input框是隐藏的，在添加的时候没有id，id为空，服务器自己生成id，添加到数据库
      // 在修改的时候，formReg实例会将服务器生成的id传递过来接收，
      // console.log("formInfo.id", formInfo.id);
      userSetMenu({ name: formInfo.name, permissions, id: formInfo.id }).then(
        ({ data }) => {
          //   添加完成之后获取以下已经添加的信息
          getMenuList();
          beforeClose();
        }
      );
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 打开弹窗   rowData接收形参，没有传递的话就是{}
const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  // 因为弹窗打开是异步任务，需要等完全打开之后，才能进行下一步
  // 如果是编辑菜单，则需要将信息重新渲染到弹窗当中，如果是添加，打开弹窗就已经可以了
  nextTick(() => {
    // 如果是编辑,
    if (rowData) {
      // 点击edit标签，该行的内容通过rowData传递了过来，但是想要显示在弹窗打开后的input框中，需要赋值给formInfo
      // 但是不能直接一次性赋值，那样会丢失响应式
      Object.assign(formInfo, { id: rowData.id, name: rowData.name });
      treeRef.value.setCheckedKeys(rowData.permission);
    }
  });
};



const handleSizeChange = (val) => {
  paginationData.size=val
  getMenuList()
}
const handleCurrentChange = (val) => {
  paginationData.pageNum=val
  getMenuList()
}
</script>

<style lang="less" scoped>
.pagination{
  width:100%;
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
}

.btn{
  width: 100%;
  background-color: #fff;
  padding: 10px 0 0 10px;
}

</style>