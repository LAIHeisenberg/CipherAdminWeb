<template>
  <div class="app-container">
    <div class="head-container">
      <crudOperation show="" :permission="permission" />
    </div>
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="570px">
      <el-form ref="form" :inline="true" :model="form" size="small" label-width="120px">
        <el-form-item label="策略名称" prop="form.policyName">
          <el-input v-model="form.secKeyName" />
        </el-form-item>
        <el-form-item label="特性" prop="form.propertys">
          <el-input v-model="form.secKeyName" />
        </el-form-item>
        <el-form-item label="起始日期" prop="form.startDay">
          <el-input v-model="form.secKeyName" />
        </el-form-item>
        <el-form-item label="起始小时" prop="form.startMin">
          <el-input v-model="form.secKeyName" />
        </el-form-item>
        <el-form-item label="结束日期" prop="form.endDay">
          <el-input v-model="form.secKeyName" />
        </el-form-item>
        <el-form-item label="结束小时" prop="form.endHour">
          <el-input v-model="form.secKeyName" />
        </el-form-item>
        <el-form-item label="结束分钟" prop="form.endMin">
          <el-input v-model="form.secKeyName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="policyName" label="策略名称" />
      <el-table-column prop="propertys" label="特性" />
      <el-table-column prop="startDay" label="开始日期" />
      <el-table-column prop="startHour" label="起始小时" />
      <el-table-column prop="startMin" label="起始分钟" />
      <el-table-column prop="endDay" label="结束日期" />
      <el-table-column prop="endHour" label="结束小时" />
      <el-table-column prop="endMin" label="结束分钟" />
      <el-table-column :show-overflow-tooltip="true" prop="address" label="创建人" />
      <el-table-column label="操作" width="70px" fixed="right">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.$index"
            v-permission="['admin','seckey:manage']"
            placement="top"
            width="180"
          >
            <p>确定要删除该策略吗?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.key, scope.$index)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudSecKeyStrategy from '@/api/seckey/strategy'
import CRUD, { presenter, header, crud, form } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
const defaultForm = {policyName:null,propertys:null,startDay:null,startHour:null,startMin:null,endDay:null,endHour:null,endMin:null}
export default {
  name: 'seckeyStrategy',
  components: { pagination, crudOperation },
  cruds() {
    return CRUD({ url: 'http://127.0.0.1:3000/mock/11/api/bsStrategy', crudMethod: { ...crudSecKeyStrategy }, title: '策略' })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'seckey:manage'],
        del: ['admin', 'seckey:manage']
      }
    }
  },
  created() {
    this.crud.optShow = {
      add: true
    }
  },
  methods: {

  }
}
</script>
