<template>
  <div class="app-container">
    <div class="head-container">
      <el-row>
        <el-col :span="24"><div>系统根密钥信息</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table ref="table" :data="sysRootKeyData" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
            <el-table-column>系统根密钥</el-table-column>
            <el-table-column prop="secretkey" />
          </el-table>
        </el-col>
      </el-row>
    </div>
    <el-row >
      <el-col :span="24">
        &nbsp;
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div>系统根证书</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table ref="table" :data="sysRootCertData" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
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
      </el-col>
    </el-row>
    <el-row >
      <el-col :span="24">
        &nbsp;
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row>
          <el-col :span="2">
            <div>工作密钥</div>
          </el-col>
          
        </el-row>
        <el-row>
          <el-col :span="22">
            &nbsp;
          </el-col>
          <el-col :span="2">
            <el-button type="success" size="mini" @click="generateWorkKey">生成密钥</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
          <el-table-column prop="secretkey" label="密钥" />
          <el-table-column prop="cryptographicAlgorithmName" label="算法" />
          <el-table-column prop="cryptographicLength" label="长度" />
          <el-table-column v-if="checkPer(['admin','sysRootSecretkey:del'])" label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <udOperation
                :data="scope.row"
                :permission="permission"
                :disabledDle="true"
              />
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import syskeyApi from '@/api/sysconf/syskey'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
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
        title: '系统根密钥',
        url: 'api/sysWorkSecretkey',
        idField: 'id',
        sort: 'id,desc',
        crudMethod: { ...syskeyApi }
      })
    },
    created() {
      const parntThis = this;
      syskeyApi.getSysRootKey().then(function(resp){
        parntThis.sysRootKeyData = resp.content;
      })
      syskeyApi.getSysRootCert().then(function(resp){
        parntThis.sysRootCertData = resp.content;
      })
    },
    data() {
      return {
        sysRootCertData : null,
        sysWorkKeyData : null,
        sysRootKeyData : null,
        permission: {
          del: ['admin', 'sysRootSecretkey:del'],
          edit: ['no-edit']
        }
      }
    },
    methods: {
      generateWorkKey(){
        const parentThis = this;
        syskeyApi.createWorkKey().then(function(resp){
          console.log(resp);
          parentThis.crud.toQuery()
        })
      }
    }
  }
</script>