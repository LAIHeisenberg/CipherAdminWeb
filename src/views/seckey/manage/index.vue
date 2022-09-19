<template>
  <div class="app-container">
    <div class="head-container">
      <el-row>
        <crudOperation show="" :permission="permission" />
        <el-button type="success" @click="handleImportKey">导入密钥</el-button>
      </el-row>
    </div>
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="570px">
      <el-form ref="form" :inline="true" :model="form" size="small" label-width="120px">
        <el-form-item label="密钥名称" prop="secKeyName">
          <el-input v-model="form.secKeyName" />
        </el-form-item>
        <el-form-item prop="secKeyUserArr" label="密钥用户">
          <el-select
            v-model="form.secKeyUser"
            style="width: 220px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in secKeyUserArr"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="showImportKey" :title="'导入秘钥'" width="570px">
      <el-form ref="form" :inline="true" :model="form" size="small" label-width="120px">
        <el-tabs v-model="importKeyType" type="card">
          <el-tab-pane label="对称秘钥" name="symKey">
            <el-input
              type="textarea"
              :rows="10"
              placeholder="请输入对称密钥"
              v-model="symmetricKeyContent">
            </el-input>
          </el-tab-pane>
          <el-tab-pane label="非对称密钥" name="asymKey">
            <el-row>
              <el-col :span="12">
                <el-form-item prop="privateKeyAlgorithm" label="私钥算法">
                  <el-select
                    v-model="privateKeyAlgorithm"
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
              </el-col>
              <el-col :span="12">
                <el-form-item prop="privateKeyLength" label="私钥长度">
                  <el-input v-model="form.privateKeyLength" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-input
              type="textarea"
              :rows="10"
              placeholder="请输入私钥"
              v-model="privateKeyContent">
            </el-input>
            </el-row>
            <el-row style="margin-top:10px">
              <el-input
              type="textarea"
              :rows="10"
              placeholder="请输入公钥"
              v-model="publicKeyContent">
            </el-input>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="showImportKey=false">取消</el-button>
        <el-button type="primary" @click="doImportKey">导入</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="index" width="55" />
      <el-table-column prop="uuidkey" label="uuidkey" />
      <el-table-column prop="seckeyName" label="密钥名称" />
      <el-table-column prop="nickName" label="密钥类型" />
      <el-table-column prop="dept" label="密钥算法" />
      <el-table-column prop="length" label="长度" />
      <el-table-column prop="status" label="状态" />
      <el-table-column :show-overflow-tooltip="true" prop="address" label="创建人" />
      <el-table-column prop="browser" label="创建时间" />
      <el-table-column label="策略" width="150px" fixed="right">
        <template slot-scope="scope">
          <el-select v-model="scope.row.strategy" multiple placeholder="请选择" @change="changeStrategy(scope.row)">
            <el-option
              v-for="item in strategyArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" fixed="right">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="8">
              <el-popover
                :ref="scope.$index+'active'"
                placement="top"
                width="180"
              >
                <p>确定激活该密钥？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.$index+'active'].doClose()">取消</el-button>
                  <el-button type="primary" size="mini" @click="doActivate(scope.row.uuidkey)">确定</el-button>
                </div>
                <el-button slot="reference" size="mini" type="text">激活</el-button>
              </el-popover>
            </el-col>
            <el-col :span="8">
          <el-popover
            :ref="scope.$index+'link'"
            placement="top"
            width="180"
          >
            <p>确定链接该密钥？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index+'link'].doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="doLink(scope.row.uuidkey)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">链接</el-button>
          </el-popover>
            </el-col>
            <el-col :span="8">
              <el-popover
            :ref="scope.$index+'update'"
            placement="top"
            width="180"
          >
            <p>确定更新该密钥</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index+'update'].doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="doUpdate(scope.row.uuidkey)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">更新</el-button>
          </el-popover>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-popover
            :ref="scope.$index+'cancel'"
            placement="top"
            width="180"
          >
            <p>确定注销该密钥？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index+'cancel'].doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="doCancel(scope.row.uuidkey)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">注销</el-button>
          </el-popover>
            </el-col>
            <el-col :span="8">
              <el-popover
            :ref="scope.$index+'destroy'"
            placement="top"
            width="180"
          >
            <p>确定销毁该密钥？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index+'destroy'].doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="doDestroy(scope.row.uuidkey)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">销毁</el-button>
          </el-popover>
            </el-col>
            <el-col :span="8">
              <el-popover
            :ref="scope.$index+'delete'"
            placement="top"
            width="180"
          >
            <p>确定删除该密钥？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index+'delete'].doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="doDelete(scope.row.uuidkey)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">删除</el-button>
          </el-popover>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-popover
            :ref="scope.$index+'archive'"
            placement="top"
            width="180"
          >
            <p>确定归档该密钥？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index+'archive'].doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="doArchive(scope.row.uuidkey)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">归档</el-button>
          </el-popover>
            </el-col>
            <el-col :span="8">
              <el-popover
            :ref="scope.$index+'backup'"
            placement="top"
            width="180"
          >
            <p>确定备份该密钥？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index+'backup'].doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="doBackup(scope.row.uuidkey)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">备份</el-button>
          </el-popover>
            </el-col>
            <el-col :span="8">
              <el-popover
            :ref="scope.$index+'recover'"
            placement="top"
            width="180"
          >
            <p>确定恢复该密钥？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.$index+'recover'].doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="doRecover(scope.row.uuidkey)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">恢复</el-button>
          </el-popover>
            </el-col>
          </el-row> 
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
const defaultForm = { secKeyUser: null, secKeyName: null, cryptMask: null, objectType: null, cryptAlgorithm: null, seckeyLength: null }
export default {
  name: 'SeckeyManage',
  components: { pagination, crudOperation },
  cruds() {
    return CRUD({ url: 'http://localhost:3000/mock/11/api/seckey/list', crudMethod: { ...crudSecKeyOperate }, title: '密钥' })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      showImportKey: false,
      importKeyType: 'symKey',
      privateKeyAlgorithm: null,
      privateKeyLength: null,
      privateKeyContent: null,
      publicKeyContent: null,
      symmetricKeyContent: null,
      secKeyUserArr: [{
        'label': '业务用户1',
        'value': 1
      }, {
        'label': '业务用户2',
        'value': 2
      }, {
        'label': '业务用户3',
        'value': 3
      }],
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
      },
      
      strategyArr: [{
        'label': '策略1',
        'value': 1
      },{
        'label': '策略2',
        'value': 2
      },{
        'label': '策略3',
        'value': 3
      }],
      mockTableData: [{
        'uuidkey' : '2234',
        'seckeyName': '测试秘钥1',
        'length' : '25',

      },{
        'uuidkey' : '2235',
        'seckeyName': '测试秘钥2',
        'length' : '16',
        
      },{
        'uuidkey' : '2236',
        'seckeyName': '测试秘钥3',
        'length' : '32'
      }]



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
    changeStrategy(row){
      console.log('change strategy')
      console.log(row)
    },
    doActivate(uuidKey){
      console.log('激活密钥..'+uuidKey)
    },
    doLink(uuidKey){
      console.log('链接密钥..')
    },
    doUpdate(uuidKey){
      console.log('更新密钥..')
    },
    doCancel(uuidKey){
      console.log('注销密钥')
    },
    doDelete(uuidKey){
      console.log('删除密钥')
    },
    doDestroy(uuidKey){
      console.log('销毁密钥')
    },
    doArchive(uuidKey){
      console.log('归档密钥')
    },
    doBackup(uuidKey){
      console.log('备份密钥')
    },
    doRecover(uuidKey){
      console.log('恢复密钥')
    },
    handleImportKey(){
      this.showImportKey = true
    },
    doImportKey(){
      console.log('导入秘钥')
      this.showImportKey = false
    }
  }
}
</script>
