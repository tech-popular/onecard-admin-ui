<template>
  <el-dialog
    title="配置"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm"  :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
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
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    export default {
      data () {
        return {
          visible: false,
          selectionDataId: '',
          dataForm: {
            charts: [{
              chartId: '',
              order: 0,
              id: 0
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
        init (selectionDataId) {
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
          this.dataForm.selectionDataId = selectionDataId || 0
          this.visible = true
          this.$nextTick(() => {
            if (this.dataForm.selectionDataId <= 0) {
              this.$refs['dataForm'].resetFields()
            }
            if (this.dataForm.selectionDataId) {
              this.$http({
                url: this.$http.adornUrl(`/phoenix/phoenixselectiondata/selectonrelcharts/${this.dataForm.selectionDataId}`),
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
        dataFormSubmit () {
          this.$refs['dataForm'].validate((valid) => {
            console.log(this.selectionDataId + 'selectionDataId')
            if (valid) {
              this.$http({
                url: this.$http.adornUrl(`/phoenix/phoenixselectiondata/screenrelcharts/save`),
                method: 'post',
                data: this.$http.adornData({
                  'selectionDataId': this.dataForm.selectionDataId,
                  'charts': this.dataForm.charts
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
