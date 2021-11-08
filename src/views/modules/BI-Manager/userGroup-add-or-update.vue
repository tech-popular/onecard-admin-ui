<template>
<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
    <el-form-item label="用户组名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="用户组名称"></el-input>
    </el-form-item>
		<el-form-item label="用户组所属租户" prop="tenantId">
      <el-select v-model="dataForm.tenantId"  placeholder="请选择" style="width:100%" filterable>
        <el-option
          v-for="item in tenantIdList"
          :key="item.value"
          :label="item.lable"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
     <el-form-item label="用户组成员" prop="userId">
      <el-select v-model="dataForm.userId" multiple placeholder="请选择" style="width:100%" filterable>
        <el-option
          v-for="item in userIdList"
          :key="item.value"
          :label="item.lable"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否失效" prop="enable">
      <el-radio-group v-model="dataForm.enable">
        <el-radio :label="0">否</el-radio>
        <el-radio :label="1">是</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取消</el-button>
    <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        enable: 1,
        tenantId: '',
        userId: []
      },
      tenantIdList: [],
      userIdList: [],
      dataRule: {
        name: [{
          required: true,
          message: '用户组名称不能为空',
          trigger: 'blur'
        }],
        userId: [{
          required: true,
          message: '请选择用户组成员',
          trigger: 'blur'
        }],
        tenantId: [{
          required: true,
          message: '请选择用户组所属租户',
          trigger: 'blur'
        }],
        enable: [{
          required: true,
          message: '是否失效不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
        }
      })
    }
  }
}
</script>
