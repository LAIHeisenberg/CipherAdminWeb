<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="ca id">
            <el-input v-model="form.caId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="证书名称">
            <el-input v-model="form.certificateName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="证书密钥长度">
            <el-input v-model="form.keySize" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="证书签发者">
            <el-input v-model="form.certificateIssuer" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="证书使用者">
            <el-input v-model="form.certificateSubject" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="证书开始时间">
            <el-input v-model="form.startDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="证书过期时间">
            <el-input v-model="form.expireDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="证书状态">
            <el-input v-model="form.certificateStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="证书目的">
            <el-input v-model="form.certificatePurpose" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="证书内容">
            <el-input v-model="form.certificateContent" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="证书密钥">
            <el-input v-model="form.privateKey" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="keystore类型">
            <el-input v-model="form.keystoreType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="keystore内容">
            <el-input v-model="form.keystoreContent" style="width: 370px;" />
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
        <el-table-column prop="id" label="id" />
        <el-table-column prop="caId" label="ca id" />
        <el-table-column prop="certificateName" label="证书名称" />
        <el-table-column prop="keySize" label="证书密钥长度" />
        <el-table-column prop="certificateIssuer" label="证书签发者" />
        <el-table-column prop="certificateSubject" label="证书使用者" />
        <el-table-column prop="startDate" label="证书开始时间" />
        <el-table-column prop="expireDate" label="证书过期时间" />
        <el-table-column prop="certificateStatus" label="证书状态" />
        <el-table-column prop="certificatePurpose" label="证书目的" />
        <el-table-column prop="certificateContent" label="证书内容" />
        <el-table-column prop="privateKey" label="证书密钥" />
        <el-table-column prop="keystoreType" label="keystore类型" />
        <el-table-column prop="keystoreContent" label="keystore内容" />
        <el-table-column v-if="checkPer(['cert:manage'])" label="操作" width="150px" align="center">
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
import crudBsCertificate from '@/api/cert/bsCert'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, caId: null, certificateName: null, keySize: null, certificateIssuer: null, certificateSubject: null, startDate: null, expireDate: null, certificateStatus: null, certificatePurpose: null, certificateContent: null, privateKey: null, keystoreType: null, keystoreContent: null }
export default {
  name: 'BsCertificate',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '证书', url: 'api/bsCertificate', idField: 'id', sort: 'id,desc', crudMethod: { ...crudBsCertificate }})
  },
  created() {
    this.crud.optShow = {
      add: true
    }
  },
  data() {
    return {
      permission: {
        add: ['cert:manage'],
      },
      rules: {
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
