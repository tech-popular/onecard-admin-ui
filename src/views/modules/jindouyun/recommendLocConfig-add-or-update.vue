<template>
   <el-dialog :title="id ? tag === 'view' ? '查看' : '编辑': '新增'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="800px">
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
        v-model="productNum"
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
      <el-option :value="item.productNum" :label="item.productName" v-for="item in searchResultList" :key="item.productNum"></el-option>
      </el-select>
      <el-button type="primary" style="margin-left:20px;margin-right:10px;" size="small" @click="addToTab">新增</el-button>
      <el-upload
        class="upload-file"
        ref="upload"
        :action="uploadWords"
        accept=".xlsx, .xls"
        :show-file-list="false"
        :on-success="uploadSuccess"
      >
        <el-button size="small" style="margin-right:10px;">文件导入</el-button>
      </el-upload>
      <el-button type="success" size="small"><a :href="templateUrl" style="color:#fff;text-decoration: none;">下载模板</a></el-button>
      <el-button type="danger" size="small" @click="multiRemoveClick" >批量删除</el-button>
    </div>
    <div>
      <el-table :data="tableData"  @selection-change="handleSelectionChange" @select-all="handleAllCheckedChange" border style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column label="序号" header-align="center" align="center" width="100">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column prop="productNum" label="产品编号" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="productName" label="产品名称" header-align="center" align="center"></el-table-column>
      <el-table-column header-align="center" align="center" width="100" label="操作">
        <template slot-scope="scope">
          <span @click="moveUp(scope.$index)" v-if="scope.$index !== 0"><icon-svg name="top" style="color: #2093f7"></icon-svg></span>
          <span @click="moveDown(scope.$index)" v-if="scope.$index !== tableData.length-1"><icon-svg name="down" style="color: green"></icon-svg></span>
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
import { jdyAdd, jdyEdit, jdyDetail, jdyGetPro, jdyuploadWords, jdydownloadTemplate } from '@/api/jindouyun/recommendLocConfig'
import { deepClone } from './js/utils'
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
      productNum: '',
      locIndex: '',
      tableData: [],
      tableDataChecked: [],
      dataRule: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      templateUrl: jdydownloadTemplate,
      uploadWords: jdyuploadWords
    }
  },
  methods: {
    init (row, tag) {
      this.id = ''
      this.tag = ''
      this.productNum = ''
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
        this.tableData = data.data.locationList || []
        this.visible = true
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
        })
      })
    },
    searchChange (val) {
      this.curSelectPro = this.searchResultList.filter(item => item.productNum === val)[0]
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
      if (!this.curSelectPro.productNum) return false
      if (!this.tableData.length || !this.tableData) {
        this.tableData.push(this.curSelectPro)
      } else {
        let isExist = this.tableData.filter(item => this.curSelectPro.productNum === item.productNum).length
        if (!isExist) {
          this.tableData.push(this.curSelectPro)
        } else {
          this.$message.error('该产品已添加！')
        }
      }
    },
    handleSelectionChange (val) {
      this.tableDataChecked = val
    },
    handleAllCheckedChange (val) {
      this.tableDataChecked = val
    },
    uploadSuccess (response, file) { // 上传成功时
      if (response.status === 0) {
        return this.$message({
          type: 'error',
          message: response.message
        })
      }
      // 上传文件返回的productNum是number类型，而this.tableData的productNum是string类型
      // 统一数据类型 进行去重
      response.data.forEach(item => {
        item.productNum = item.productNum.toString()
      })
      // 去重
      this.tableData = this.unique(this.tableData.concat(response.data))
    },
    // 取两个对象数组的并集且去重
    unique (arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.productNum) && res.set(arr.productNum, 1))
    },
    // 上移 将当前数组index索引与后面一个元素互换位置，向数组后面移动一位
    moveUp (index) {
      let data = deepClone(this.tableData)
      if (index === 0) return
      data.splice(index - 1, 0, (data[index])) // 在上一项插入该项
      data.splice(index + 1, 1) // 删除后一项
      this.tableData = data
    },
    // 下移 将当前数组index索引与前面一个元素互换位置，向数组前面移动一位
    moveDown (index) {
      let data = deepClone(this.tableData)
      if (index === (data.length - 1)) return
      data.splice(index + 2, 0, (data[index])) // 在下一项插入该项
      data.splice(index, 1) // 删除前一项
      this.tableData = data
    },
    multiRemoveClick () { // 批量删除
      if (!this.tableDataChecked.length) return
      this.$confirm('确定删除选中产品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = deepClone(this.tableData)
        if (data.length === this.tableDataChecked.length) {
          data = []
        } else {
          this.tableDataChecked.forEach(item => {
            data.forEach((ditem, dindex) => {
              if (item.productNum === ditem.productNum) {
                data.splice(dindex, 1)
              }
            })
          })
        }
        this.tableData = deepClone(data)
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
          if (!this.tableData.length) {
            return this.$message.error('没有提交任何产品信息，请填写后再提交！')
          }
          this.tableData.forEach((item, index) => {
            item.productLocation = index + 1
          })
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
