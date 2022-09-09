<template>
  <div class="app-container">
    <div class="head-container">
      <div>系统根密钥信息</div>
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column>系统根密钥</el-table-column>
        <el-table-column prop="secretkey" />
      </el-table>

      <div style="width: 100px;height: 20px">系统根证书</div>
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column prop="certificateName" label="证书名字" />
        <el-table-column prop="keySize" label="证书大小" />
        <el-table-column prop="certificateIssuer" label="证书签发者" />
        <el-table-column prop="startDate" label="证书开始时间" />
        <el-table-column prop="certificateStatus" label="证书状态" />
        <el-table-column prop="certificateContent" label="证书内容" />
        <el-table-column prop="privateKey" label="证书密钥" />
        <el-table-column prop="keystoreType" label="keystore类型" />
        <el-table-column prop="keystoreContent" label="keystore 内容" />
      </el-table>
    </div>

    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="主键ID" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="secretkey">
            <el-input v-model="form.secretkey" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="密码卡密钥">
            <el-input v-model="form.key1" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="超级管理员创建时初始化">
            <el-input v-model="form.key2" style="width: 370px;" />
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
        <el-table-column prop="id" label="主键ID" />
        <el-table-column prop="secretkey" label="secretkey" />
        <el-table-column prop="key1" label="密码卡密钥" />
        <el-table-column prop="key2" label="超级管理员创建时初始化" />
        <el-table-column v-if="checkPer(['admin','sysRootSecretkey:edit','sysRootSecretkey:del'])" label="操作" width="150px" align="center">
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
import crudSysRootSecretkey from '@/api/sysconfig/syskey'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
// import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, secretkey: null, key1: null, key2: null }
export default {
  name: 'SysRootSecretkey',
  components: { pagination, crudOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '/rootSecretkey',
      url: 'api/sysRootSecretkey',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudSysRootSecretkey }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'sysRootSecretkey:add'],
        edit: ['admin', 'sysRootSecretkey:edit'],
        del: ['admin', 'sysRootSecretkey:del']
      },
      rules: {
        id: [
          { required: true, message: '主键ID不能为空', trigger: 'blur' }
        ]
      }
    }
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
