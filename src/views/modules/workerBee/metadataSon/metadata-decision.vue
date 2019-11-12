<template>
    <div class="aviator">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="30%">
        <el-form-item label="主键" prop="id">
        <el-input v-model="dataForm.id" placeholder="主键"/>
        </el-form-item>
        <el-form-item label="判断case参数" prop="caseValueParam">
        <el-input v-model="dataForm.caseValueParam" placeholder="判断case参数"/>
        </el-form-item>
        <el-form-item label="判断表达式" prop="caseExpression">
        <el-input v-model="dataForm.caseExpression" placeholder="判断表达式"/>
        </el-form-item>
        <el-form-item label="switch判断项集合" prop="caseSwitch">
          <el-select filterable v-model="dataForm.caseSwitch" placeholder="请选择">
          <el-option v-for="item in caseSwitchList" :value="item.value" :key="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
        <el-radio-group v-model="dataForm.enable">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
    </el-form>
    <div slot="footer" class="foot">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
    </div>
</template>

<script>
  export default {
    props: [
      'hideVisibleClick',
      'fatherData'
    ],
    data () {
      return {
        dataForm: {
          id: 0, // 主键id
          caseValueParam: '', // 判断case参数
          caseExpression: '', // 判断表达式
          caseSwitch: '', // switch判断项集合
          enable: 1
        },
        caseSwitchList: [],
        dataRule: {
          id: [
            { required: true, message: '主键id不能为空', trigger: 'blur' }
          ],
          caseValueParam: [
            { required: true, message: '判断case参数不能为空', trigger: 'blur' }
          ],
          caseExpression: [
            { required: true, message: '判断表达式不能为空', trigger: 'blur' }
          ],
          caseSwitch: [
            { required: true, message: '请选择switch判断项集合', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init () {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 取消
      cancel () {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.$emit('hideVisibleClick', this.hideVisible)
      },
      // 表单提交
      dataFormSubmit () {
        let res = this.$emit('fatherCheck')
        if (res === false) { // 如果父组件没有检查成功, 就停止
          return false
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>
<style>
  .aviator {
    border-top: 1px solid #eee;
    padding-top: 3%;
  }
  .foot {
    width: 100%;
    text-align: right;
  }
</style>