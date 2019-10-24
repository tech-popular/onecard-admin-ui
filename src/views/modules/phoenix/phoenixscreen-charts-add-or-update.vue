<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm"  :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit(dataForm.screenId)" label-width="80px">
      <el-form-item label="新增大屏配置"></el-form-item>
      <el-form-item
        v-for="(outdata, index) in dataForm.charts"
        :label="'大屏配置'+index"
        :key="outdata.key"
        :rules="{
      required: true, message: '表名不能为空', trigger: 'blur'}">
        <el-row :gutter="24">
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <el-select v-model="outdata.chartId" placeholder="请选择">
                <el-option
                  v-for="item in chartsoptions"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <el-input type="number" min="0" v-model="outdata.order"></el-input>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <el-button @click.prevent="removeDomain(outdata)">删除</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button @click="addDomain">新增大屏配置</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit(dataForm.screenId)">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    export default {
      data () {
        return {
          visible: false,
          screenId: '',
          dataForm: {
            charts: [{
              chartId: '',
              order: 0
            }]
          },
          chartsoptions: [],
          dataRule: {
          }
        }
      },
      methods: {
        addDomain () {
          this.dataForm.charts.push({
            order: '',
            key: Date.now()
          })
        },
        removeDomain (item) {
          const index = this.dataForm.charts.indexOf(item)
          if (index !== -1) {
            this.dataForm.charts.splice(index, 1)
          }
        },
        init (id) {
                // 所有charts
          this.$http({
            url: this.$http.adornUrl(`/phoenix/phoenixchart/select`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.chartsoptions = data.phoenixChartEntities
            }
          })
          this.dataForm.screenId = id || 0
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            if (this.dataForm.screenId) {
              this.$http({
                url: this.$http.adornUrl(`/phoenix/phoenixscreen/screenrelcharts/${this.dataForm.screenId}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm.charts = data.charts
                }
              })
            } else {
              this.dataForm.charts = []
            }
          })
        },
            // 表单提交
        dataFormSubmit (screenId) {
          console.log(this.dataForm.id + 'id')
          this.$refs['dataForm'].validate((valid) => {
            this.dataForm.screenId = screenId
            console.log(screenId + 'screenId')
            if (valid) {
              this.$http({
                url: this.$http.adornUrl(`/phoenix/phoenixscreen/screenrelcharts/${!this.dataForm.id ? 'save' : 'update'}`),
                method: 'post',
                data: this.$http.adornData({
                  'id': this.dataForm.id || undefined,
                  'screenId': this.dataForm.screenId,
                  'chartId': this.dataForm.chartId,
                  'order': this.dataForm.order
                  // 'charts': this.dataForm.charts
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.$emit('refreshDataList')
                    }
                  })
                } else {
                  this.$message.error(data.msg)
                }
              })
            }
          })
        }
      }
    }
</script>
