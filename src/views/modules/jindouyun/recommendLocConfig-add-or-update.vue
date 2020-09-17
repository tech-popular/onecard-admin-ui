<template>
   <el-dialog :title="id ? tag === 'view' ? '查看' : '编辑': '新增'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="600px">
    <h3 id="title">基本信息</h3>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="任务ID:" prop="id" v-if="!!id" >
        <el-input v-model="dataForm.id" placeholder="" disabled/>
      </el-form-item>
      <el-form-item label="任务名称:" prop="name">
        <el-input v-model="dataForm.name" placeholder="" :disabled="tag === 'view'" />
      </el-form-item>
    </el-form>
    <h3 id="title" style="border-top:1px dashed #c0c0c0;padding-top:20px">位置顺序配置</h3>
    <div style="display:flex;margin-bottom:20px">
      <el-select
        ref="searchEl"
        v-model="productId"
        filterable
        clearable
        remote
        placeholder="可根据产品名称或产品编号查询"
        :remote-method="remoteMethod"
        :loading="loading"
        style="width: 400px"
        @change="searchChange"
        @focus="searchFocus"
      >
        <el-option :value="item.productId" :label="item.productName" v-for="item in searchResultList" :key="item.productId"></el-option>
      </el-select>
      <el-button type="primary" style="margin-left:20px" @click="addToTab">新增</el-button>
    </div>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="productNum" label="产品编号" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column prop="productName" label="产品名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="productLocation" label="位置编号" header-align="center" align="center" width="200">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.productLocation" :min="0" placeholder="位置编号" style="width:150px"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" width="100" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-close" circle  size="mini" @click="deleteHandle(scope.$index, scope.row)" style="padding:5px"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="dataSubmit" v-if="tag !== 'view'">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { jdyAdd, jdyEdit, jdyDetail, jdyGetPro } from '@/api/jindouyun/recommendLocConfig'
export default {
  data () {
    return {
      tag: '',
      isTreeRoot: true,
      id: '',
      visible: false,
      dataForm: {
        id: '',
        name: ''
      },
      loading: false,
      searchResultList: [],
      curSelectPro: {},
      productId: '',
      locIndex: '',
      tableData: [],
      dataRule: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (row, tag) {
      this.id = ''
      this.tag = ''
      this.dataForm = { // 初始化
        id: '',
        name: ''
      }
      this.tableData = []
      if (row && row.id) {
        this.id = row.id
        this.tag = tag
        this.getInfo()
      } else {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      }
    },
    getInfo () {
      jdyDetail(this.id).then(({data}) => { // 查看详情信息
        if (data.status * 1 !== 1) {
          return this.$message.error(data.message)
        }
        this.dataForm = {
          id: data.data.id,
          name: data.data.name
        }
        console.log(data)
        this.tableData = data.data.locationList
        this.visible = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      })
    },
    searchChange (val) {
      this.curSelectPro = this.searchResultList.filter(item => item.productId === val)[0]
    },
    searchFocus (e) {
      if (!e.srcElement.value) {
        this.searchResultList = []
        return false
      }
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        this.getSearchResultList(query)
      } else {
        this.searchResultList = []
      }
    },
    getSearchResultList (query) {
      jdyGetPro({
        param: query
      }).then(({data}) => {
        if (data && data.status * 1 === 1) {
          this.searchResultList = data.data
        } else {
          this.searchResultList = []
        }
        this.loading = false
      })
    },
    addToTab () {
      if (!this.curSelectPro.productId) return false
      let isExist = this.tableData.filter(item => this.curSelectPro.productId === item.productId).length
      if (!isExist) {
        this.tableData.push(this.curSelectPro)
      } else {
        this.$message.error('该产品已添加！')
      }
    },
    deleteHandle (index, row) {
      this.$confirm(`确定提删除【${row.productName}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确认创建分群时的操作
        this.tableData.splice(index, 1)
      }).catch(() => {
        console.log('取消')
      })
    },
    cancel () {
      this.visible = false
    },
    dataSubmit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let len = this.tableData.filter(item => !item.productLocation).length
          if (len > 0) {
            return this.$message.error('位置编号不可为空！')
          }
          if (!this.tableData.length) {
            return this.$message.error('没有提交任何产品信息，请填写后再提交！')
          }
          let url = jdyAdd
          let params = {
            name: this.dataForm.name,
            locationList: this.tableData
          }
          if (this.id) {
            url = jdyEdit
            params.id = this.dataForm.id
          }
          url(params).then(({data}) => {
            if (data && data.status * 1 === 1) {
              this.$message.success(data.message)
              this.visible = false
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.message)
            }
          })
        }
      })
    }
  }
}
</script>
