<template>
  <el-dialog
    :title="!dataForm.taskId ? '新增' : '配置'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
    <el-form-item label="任务id" prop="taskId" v-show="false">
      <el-input v-model="dataForm.taskId" placeholder="任务id" v-show="false"></el-input>
    </el-form-item>
    <el-form-item
      v-for="(outdata, index) in dataForm.taskDependentEntities"
      :label="'依赖关系'+index"
      :key="outdata.key"
      :rules="{
    required: true, message: '表名不能为空', trigger: 'blur'}">
      <el-row :gutter="24">
        <el-col :span="2">
          <div class="grid-content bg-purple">任务</div>
        </el-col>
        <el-col :span="11">
          <div class="grid-content bg-purple">
            <el-select v-model="outdata.taskDependentId" filterable placeholder="请选择可搜索" style="width: 250px">
              <el-option
                v-for="item in taskIdOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">时间(秒)</div>
        </el-col>
        <el-col :span="4" >
          <div class="grid-content bg-purple">
            <el-input  v-model="outdata.validTime" type="number" size="5"></el-input>
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
      <el-button @click="addDomain">新增依赖任务</el-button>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closePage()">取消</el-button>
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
          taskId: 0,
          taskDependentEntities: []
        },
        taskIdOptions: [],
        dataRule: {
        }
      }
    },
    methods: {
      addDomain () {
        this.dataForm.taskDependentEntities.push({
          taskId: this.dataForm.taskId,
          key: Date.now()
        })
      },
      removeDomain (item) {
        const index = this.dataForm.taskDependentEntities.indexOf(item)
        if (index !== -1) {
          this.dataForm.taskDependentEntities.splice(index, 1)
        }
      },
      init (id) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      clearDataForm () {
        this.dataForm.taskId = 0
        this.dataForm.taskDependentEntities = []
      },
      closePage () {
        this.visible = false
        this.clearDataForm()
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
