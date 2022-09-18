<template>
  <div class="app-container">
    <div class="head-container">
    </div>
    <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="恢复文件路径">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="KLMS日志" value="klms-log"></el-option>
            <el-option label="KMIP服务日志" value="kmip-log"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span=22>
            &nbsp;
          </el-col>
          <el-col :span=2>
            <el-button type="warning" round>执行恢复</el-button>
          </el-col>
        </el-row>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Log',
  components: { },

  // mixins: [presenter()],
  data() {
    return {
      'form': {
        'type' : null,
        'path' : null,
      }
    }
  },
  methods: {}
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 70px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.demo-table-expand .el-form-item__content {
  font-size: 12px;
}
</style>
