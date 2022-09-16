<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <!--工具栏-->
      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <el-input v-model="query.userName" clearable size="small" placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
<!--          <date-range-picker v-model="query.createTime" class="date-item" />-->
          <rrOperation />
        </div>
        <crudOperation :permission="permission" />
      </div>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="用户名称" prop="userName">
            <el-input v-model="form.userName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户密码" prop="pwd">
            <el-input v-model="form.pwd" style="width: 370px;" />
          </el-form-item>

          <el-form-item label="业务组" prop="groups">
            <el-select
              v-model="groupDatas"
              style="width: 370px"
              placeholder="请选择"
              @change="changeGroup"
            >
              <el-option
                v-for="item in groups"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
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
        <el-table-column prop="userName" label="业务用户名称" />
        <el-table-column prop="pwd" label="业务用户密码" />
        <el-table-column prop="groupName" label="业务组名称" />
        <el-table-column prop="createBy" label="创建人" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateBy" label="更新人" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-if="checkPer(['kmsUser:manage'])" label="操作" width="150px" align="center">
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
import DateRangePicker from '@/components/DateRangePicker'
import { getAllGroup } from '@/api/tenant/group'
import { getAll } from '@/api/system/role'

let userGroups = {}
const defaultForm = { id: null, userName: null, pwd: null, groupId: null, createBy: null, createTime: null, updateBy: null, updateTime: null, groups: [] }
export default {
  name: 'KmsUser',
  components: { pagination, crudOperation, rrOperation, udOperation, DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '用户', url: 'api/kmsUser', idField: 'id', sort: 'id,desc', crudMethod: { ...crudKmsUser }})
  },
  data() {
    return {
      groups: [], groupDatas: [],
      permission: {
        add: ['kmsUser:manage'],
        edit: ['kmsUser:manage'],
        del: ['kmsUser:manage']
      },
      rules: {
        userName: [
          { required: true, message: '业务用户名称,唯一不重复不能为空', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '业务用户密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    changeGroup(value) {
      userGroups = {
        id: value
      }
    },
    getGroups() {
      getAllGroup().then(res => {
        this.groups = res.content
      }).catch(() => { })
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.getGroups()
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      this.groupDatas = null
    },
    // 初始化编辑时候的
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.groupDatas = form.group.id
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (this.groupDatas == null | this.groupDatas === undefined) {
        this.$message({
          message: '业务组不能为空',
          type: 'warning'
        })
        return false
      }
      crud.form.group = userGroups
      return true
    }
  }
}
</script>

<style scoped>

</style>
