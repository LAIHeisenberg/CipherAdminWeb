<template>
  <div class="app-container">
    <div class="head-container">
      <crudOperation show="" :permission="permission" />
    </div>
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="570px">
      <el-form ref="form" :inline="true" :model="form" size="small" label-width="120px">
        <el-form-item label="密钥名称" prop="secKeyName">
          <el-input v-model="form.secKeyName" />
        </el-form-item>
        <el-form-item prop="objectTypeArr" label="Object Type">
          <el-select
            v-model="form.objectType"
            style="width: 220px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in objectTypeArr"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="cryptographicAlgorithm" label="加密算法">
          <el-select
            v-model="form.cryptographicAlgorithm"
            style="width: 220px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in cryptAlgorithmArr"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="cryptographicLength" label="加密长度">
          <el-select
            v-model="form.cryptographicLength"
            style="width: 220px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in seckeyLengthArr"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="cryptographicUsageMask" label="加密使用掩码">
          <el-select
            v-model="form.cryptographicUsageMask"
            style="width: 220px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in cryptMaskArr"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作策略名称" prop="operationPolicyName">
          <el-input v-model="form.operationPolicyName" />
        </el-form-item>
        <el-form-item label="处理开始日期" prop="processStartDate">
          <el-input v-model="form.processStartDate" />
        </el-form-item>
        <el-form-item label="保护停止时间" prop="protectStopDate">
          <el-input v-model="form.protectStopDate" />
        </el-form-item>
        <el-form-item label="qlength" prop="qlength">
          <el-input v-model="form.qlength" />
        </el-form-item>
        <el-form-item label="推荐曲线" prop="recommendedCurve">
          <el-input v-model="form.recommendedCurve" />
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
      <el-table-column prop="cryptographicAlgorithm" label="加密算法" />
      <el-table-column prop="cryptographicLength" label="加密长度" />
      <el-table-column prop="cryptographicUsageMask" label="加密使用掩码" />
      <el-table-column prop="deactivationDate" label="停用日期" />
      <el-table-column prop="operationPolicyName" label="操作策略名称" />
      <el-table-column prop="processStartDate" label="处理开始日期" />
      <el-table-column prop="protectStopDate" label="保护停止时间" />
      <el-table-column prop="qlength" label="qlength" />
      <el-table-column prop="recommendedCurve" label="推荐曲线" />
      <el-table-column label="操作" width="70px" fixed="right">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            msg="确定要删除该模板吗?"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudSecKeyTemplate from '@/api/seckey/template'
import CRUD, { presenter, header, crud, form } from '@crud/crud'
import udOperation from '@crud/UD.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
const defaultForm = {cryptographicAlgorithm:null,cryptographicLength:null,cryptographicUsageMask:null,deactivationDate:null,operationPolicyName:null,processStartDate:null,protectStopDate:null,qlength:null,recommendedCurve:null}
export default {
  name: 'secKeyTemplate',
  components: { pagination, crudOperation,udOperation },
  cruds() {
    return CRUD({ url: '/api/template', crudMethod: { ...crudSecKeyTemplate }, title: '模板' })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      objectTypeArr: [{
        'label': 'Certificate',
        'value': 1
      }, {
        'label': 'Symmetric Key',
        'value': 2
      }, {
        'label': 'Public Key',
        'value': 3
      }, {
        'label': 'Private Key',
        'value': 4
      }, {
        'label': 'Split Key',
        'value': 5
      }, {
        'label': 'Template',
        'value': 6
      }],
      cryptAlgorithmArr: [{
        'label': 'DES',
        'value': 1
      }, {
        'label': '3DES',
        'value': 2
      }, {
        'label': 'AES',
        'value': 3
      }, {
        'label': 'RSA',
        'value': 4
      }, {
        'label': 'DSA',
        'value': 5
      }, {
        'label': 'ECDSA',
        'value': 6
      }, {
        'label': 'HMAC-SHA1',
        'value': 7
      }, {
        'label': 'HMAC-SHA224',
        'value': 8
      }, {
        'label': 'HMAC-SHA256',
        'value': 9
      }],
      cryptMaskArr: [{
        'label': 'Sign',
        'value': 1
      }, {
        'label': 'Verify',
        'value': 2
      }, {
        'label': 'Encrypt',
        'value': 4
      }, {
        'label': 'Decrypt',
        'value': 8
      }, {
        'label': 'Wrap Key',
        'value': 10
      }, {
        'label': 'Unwrap Key',
        'value': 20
      }],
      permission: {
        add: ['admin', 'seckey:manage'],
        edit: ['admin', 'no-edit'],
        del: ['admin', 'seckey:manage']
      }
    }
  },
  computed: {
    // 计算属性的 getter
    seckeyLengthArr: function() {
      if (this.form.cryptAlgorithm == 3 || this.form.cryptAlgorithm == 1 || this.form.cryptAlgorithm == 2) {
        return [{
          'label': '128',
          'value': 128
        }, {
          'label': '256',
          'value': 256
        }, {
          'label': '384',
          'value': 384
        }, {
          'label': '512',
          'value': 512
        }]
      }
      if (this.form.cryptAlgorithm == 4) {
        return [{
          'label': '1024',
          'value': 1024
        }, {
          'label': '2048',
          'value': 2048
        }, {
          'label': '3072',
          'value': 3072
        }, {
          'label': '4096',
          'value': 4096
        }]
      }
      return [{
        'label': '0',
        'value': 0
      }]
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
