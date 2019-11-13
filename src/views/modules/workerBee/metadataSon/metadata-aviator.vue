<template>
    <div class="aviator">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="30%">
        <el-form-item label="请求参数的fieldId数组" prop="http.requestFields">
        <el-input v-model="dataForm.http.requestFields" placeholder="请求参数的fieldId数组"/>
        </el-form-item>
        <el-form-item label="响应参数的fieldId数组" prop="http.responseFields">
        <el-input v-model="dataForm.http.responseFields" placeholder="响应参数的fieldId数组"/>
        </el-form-item>
        <el-form-item label="响应参数的数据类型" prop="http.responseType">
          <el-select filterable v-model="dataForm.http.responseType" placeholder="请选择">
          <el-option v-for="item in responseTypeList" :value="item.value" :key="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="http.enable">
        <el-radio-group v-model="dataForm.http.enable">
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
          id: 0,
          http: {
            requestFields: '', // 请求参数的fieldId数组
            responseFields: '', // 响应参数的fieldId数组
            responseType: '', // 响应参数的数据类型
            enable: 1
          }
        },
        responseTypeList: [
          {
            value: '0',
            label: '数据类型1'
          },
          {
            value: '1',
            label: '数据类型2'
          }
        ],
        dataRule: {
          responseType: [
            { required: true, message: '请选择数据类型', trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init (id) {
        this.id = this.fatherData.id
        console.log(this.id)
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/gongFeng/beeTask/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.fatherData = data.beeTaskDef
                this.dataForm.http = data.http
              }
            })
          }
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
        let res = this.$parent.$parent.$parent.fatherCheck()
        this.$refs['dataForm'].validate((valid) => {
          if (valid && res) {
            this.$http({
              url: this.$http.adornUrl(`/gongFeng/beeTask/${!this.dataForm.id ? 'saveBeeTask' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'beeTaskDef': this.fatherData,
                'http': this.dataForm.http,
                'gdbc': null,
                'kafka': null,
                'cassandra': null,
                'groovy': null,
                'aviator': null,
                'decision': null
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$emit('hideVisibleClick', this.hideVisible)
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
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