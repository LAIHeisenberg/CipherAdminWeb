<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="业务用户ID">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="业务用户名称,唯一不重复" prop="userName">
            <el-input v-model="form.userName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="业务用户密码" prop="pwd">
            <el-input v-model="form.pwd" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="业务组ID">
            <el-input v-model="form.groupId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建人">
            <el-input v-model="form.createBy" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新人">
            <el-input v-model="form.updateBy" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="业务用户ID" />
        <el-table-column prop="userName" label="业务用户名称,唯一不重复" />
        <el-table-column prop="pwd" label="业务用户密码" />
        <el-table-column prop="groupId" label="业务组ID" />
        <el-table-column prop="createBy" label="创建人" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateBy" label="更新人" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin','kmsUser:edit','kmsUser:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudKmsUser from '@/api/tenant/bsUser'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, userName: null, pwd: null, groupId: null, createBy: null, createTime: null, updateBy: null, updateTime: null }
export default {
  name: 'KmsUser',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '/bsUser', url: 'api/kmsUser', idField: 'id', sort: 'id,desc', crudMethod: { ...crudKmsUser }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'kmsUser:add'],
        edit: ['admin', 'kmsUser:edit'],
        del: ['admin', 'kmsUser:del']
      },
      rules: {
        userName: [
          { required: true, message: '业务用户名称,唯一不重复不能为空', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '业务用户密码不能为空', trigger: 'blur' }
        ]
      }    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
