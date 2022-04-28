<template>
  <el-dialog width="800px" :title="tag === 'view' ? '查看' : dataForm.id ? '修改' : '新增'" :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <el-form label-width="160px" :model="dataForm" :rules="baseRule" ref="dataForm">
      <el-form-item prop="parentId" label="选择父级分类">
        <el-cascader style="width: 100%" clearable ref="cascaderMenu" v-model="dataForm.parentId" :options="alldataCataLogList" :props="dataCataLogTreeProps" @change="parentTreeChange"></el-cascader>
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入分类名称" style="width: 400px"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="foot">
      <el-button type="primary" @click="submitData">提交</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import { deepClone } from '../dataAnalysisUtils/utils'
import { adddataCatalog, infodataCatalog, updatedataCatalog, getDataCataLog } from '@/api/dataAnalysis/tagsManage'
export default {
  data () {
    return {
      visible: false,
      tag: '',
      dataForm: {
        id: '',
        parentId: [],
        name: ''
      },
      alldataCataLogList: [],
      dataCatalogParentList: [], // 保留选中的级联中完整内容
      dataCataLogTreeProps: {
        checkStrictly: true,
        label: 'name',
        value: 'id',
        children: 'dataCata'
      },
      baseRule: { // 基本信息校验规则
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  components: {},
  methods: {
    init (row, tag) {
      this.tag = row ? tag : ''
      this.dataForm = {
        id: '',
        parentId: '',
        name: ''
      }
      this.getDataCataLogList()
      this.visible = true
      if (row) {
        this.getLookData(row)
      }
    },
    // 回显
    getLookData (row) {
      let params = {
        id: row.id
      }
      infodataCatalog(params).then(({ data }) => {
        if (data && data.status === '1') {
          let parentIdData = []
          if (data.data.parentId == '0') {
            this.dataForm.parentId = []
            this.dataCatalogParentList = []
          } else {
            parentIdData = (data.data.dataCatalogParentList && data.data.dataCatalogParentList.split(',')) || []
            this.dataForm.parentId = parentIdData.map(item => { return +item })
            this.dataCatalogParentList = data.data.dataCatalogParentList && data.data.dataCatalogParentList.split(',')
          }
          this.dataForm.name = data.data.name
          this.dataForm.id = data.data.id
        }
      })
    },
    // 获取分群出参 指标列表
    getDataCataLogList () {
      getDataCataLog().then(({ data }) => {
        if (data.status === '1') {
          this.alldataCataLogList = data.data
        } else {
          this.alldataCataLogList = []
        }
      })
    },
    // 所属父级
    parentTreeChange (val) {
      this.dataCatalogParentList = val
    },
    submitData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = {
            'parentId': this.dataForm.parentId.length ? this.dataCatalogParentList[this.dataCatalogParentList.length - 1].toString() : '',
            'name': this.dataForm.name,
            'dataCatalogParentList': this.dataCatalogParentList.join(',')
          }
          console.log('params: ', params)
          if (!this.dataForm.id) {
            adddataCatalog(params).then(({ data }) => {
              if (data && data.status === '1') {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$emit('refreshDataList')
                    this.visible = false
                  }
                })
              } else {
                this.$message.error(data.msg || '数据异常')
              }
            })
          } else {
            params.id = this.dataForm.id
            updatedataCatalog(params).then(({ data }) => {
              if (data && data.status === '1') {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$emit('refreshDataList')
                    this.visible = false
                  }
                })
              } else {
                this.$message.error(data.msg || '数据异常')
              }
            })
          }
        }
      })
    }
  }
}
</script>