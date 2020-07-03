<template>
  <el-dialog title='新增' :modal-append-to-body='false' :append-to-body="true" @close="taskDialgClose" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px"> 
      <el-form-item label="缓存名称" prop="cacheName">
        <el-input v-model="dataForm.cacheName" placeholder="请输入策略名称"/>
      </el-form-item>
      <el-form-item label="key" prop="key">
        <el-input v-model="dataForm.key" placeholder="请输入key"/>
      </el-form-item>
      <el-form-item label="类型" prop="cacheType">
        <el-select filterable v-model="dataForm.cacheType" placeholder="请选择类型" style="width:100%" @change="typeClick">
          <el-option v-for="item in typeList" :value="item.id" :key="item.id" :label="item.name"/>
        </el-select>
      </el-form-item>
         <el-form-item label="redisDb值" prop="redisDb" v-if="imDeisblad === true">
        <el-input v-model="dataForm.redisDb" placeholder="redisDb值"/>
      </el-form-item>
      <el-form-item label="缓存后缀" prop="flag">
        <el-select filterable v-model="dataForm.flag" placeholder="请选择是否需要缓存后缀" style="width:100%" @change="typeClick">
          <el-option v-for="item in flagList" :value="item.id" :key="item.id" :label="item.name"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="foot">
      <el-button @click="taskDialgClose">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { saveorupt } from '@/api/lexicon/strategy'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          cacheName: '',
          key: '',
          cacheType: '',
          flag: '',
          redisDb: ''
        },
        dataRule: {
          cacheName: [
            { required: true, message: '缓存名称不能为空', trigger: 'blur' }
          ],
          key: [
            { required: true, message: 'key不能为空', trigger: 'blur' }
          ],
          cacheType: [
            { required: true, message: '类型不能为空', trigger: 'blur' }
          ],
          flag: [
            { required: true, message: '是否需要缓存后缀不能为空', trigger: 'blur' }
          ],
          redisDb: [
            { required: true, message: 'redisDb值不能为空', trigger: 'blur' }
          ]
        },
        typeList: [
          {id: 0, name: 'EhCahe'},
          {id: 1, name: 'redis'}
        ],
        flagList: [
          {id: 0, name: '不需要'},
          {id: 1, name: '需要'}
        ],
        imDeisblad: false
      }
    },
    components: {
    },
    watch: {
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.visible = true
      },
      // 提交
      dataFormSubmit (form) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm.strategySetDetails = this.lists
            const dataBody = this.dataForm
            saveorupt(dataBody).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$refs['dataForm'].resetFields()
                  }
                })
              }
            })
          }
        })
      },
      typeClick (val) {
        if (val === 1) {
          this.imDeisblad = true
        }
      },
      taskDialgClose () {
        this.visible = false
        this.imDeisblad = false
        this.$refs['dataForm'].resetFields()
      }
    }
  }
</script>
<style scoped>
  .edit-cell {
    min-height: 35px;
    cursor: pointer;
  }
</style>