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
        <el-form-item prop="cryptAlgorithm" label="密钥算法">
          <el-select
            v-model="form.cryptAlgorithm"
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
        <el-form-item prop="seckeyLength" label="密钥长度">
          <el-select
            v-model="form.seckeyLength"
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
        <el-form-item prop="cryptMask" label="Cryptographic Usage Mask">
          <el-select
            v-model="form.cryptMask"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="uuidkey" label="uuidkey" />
      <el-table-column prop="seckeyName" label="密钥名称" />
      <el-table-column prop="nickName" label="密钥类型" />
      <el-table-column prop="dept" label="密钥算法" />
      <el-table-column prop="length" label="长度" />
      <el-table-column prop="status" label="状态" />
      <el-table-column :show-overflow-tooltip="true" prop="address" label="创建人" />
      <el-table-column prop="browser" label="创建时间" />
      <el-table-column label="操作" width="70px" fixed="right">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.$index"
            v-permission="['admin']"
            placement="top"
            width="180"
          >
            <p>确定强制退出该用户吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.key, scope.$index)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">强退</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudSecKeyOperate from '@/api/seckey/operate'
import CRUD, { presenter, header, crud, form } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
const defaultForm = { secKeyName: null, cryptMask: null, objectType: null, cryptAlgorithm: null, seckeyLength: null }
export default {
  name: 'SeckeyManage',
  components: { pagination, crudOperation },
  cruds() {
    return CRUD({ url: 'api/seckey/list', crudMethod: { ...crudSecKeyOperate }, title: '密钥' })
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
