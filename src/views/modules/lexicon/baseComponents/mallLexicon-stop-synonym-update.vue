<template>
  <div>
    <div class="add-wrap">
      <div class="query-title"><span style="color:red">*</span>目前词组里的Query</div>
      <el-card shadow="never" class="query-card-content">
        <el-form :model="dataForm" inline ref="dataForm">
          <el-form-item>
            <el-input v-model.trim="dataForm.query" placeholder="手动填入Query名" style="width: 400px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addQuery" size="small">确定</el-button>
            <el-upload
              class="upload-file"
              ref="upload"
              :action="uploadWords"
              accept=".xlsx, .xls"
              :show-file-list="false"
              :on-success="uploadSuccess"
            >
              <el-button size="small">文件导入</el-button>
            </el-upload>
            <el-button type="success" size="small"><a :href="templateUrl" style="color:#fff;text-decoration: none;">下载模板</a></el-button>
          </el-form-item>
          <div class="upload-name"><span v-if="excelFile">上传文件名：{{excelFile}}</span></div>
        </el-form>
        <query-tag-list :data="dynamicQuery" @tagChange="tagChangeEvent" @multiAdd="multiAddClick"></query-tag-list>
      </el-card>
      <query-table-list :data="tableData" @multiRemove="multiRemoveClick"></query-table-list>
    </div>
  </div>
</template>
<script>
import { findParent } from '../assets/js/utils'
import queryTagList from '../components/queryTagList'
import queryTableList from '../components/queryTableList'
import { downloadTemplate, uploadWords } from '@/api/lexicon/mallLexiconList'
export default {
  data () {
    return {
      templateUrl: downloadTemplate,
      uploadWords: uploadWords,
      excelFile: '',
      dataForm: {
        query: ''
      },
      dynamicQuery: [],
      tableData: []
    }
  },
  components: { queryTagList, queryTableList },
  created () {
    this.data.forEach(item => {
      this.tableData.push({
        name: item
      })
    })
  },
  mounted () {
    this.parent = findParent(this.$parent)
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    searchWords () {
      if (!this.tableData.length) {
        return {
          checkedLen: 0,
          msg: '搜索词不能为空！',
          list: []
        }
      }
      let arr = []
      this.tableData.forEach(item => {
        arr.push(item.name)
      })
      return {
        checkedLen: arr.length,
        list: arr
      }
    }
  },
  methods: {
    tagChangeEvent (data) {
      this.dynamicQuery = data
    },
    addQuery () { // 手动添加query
      let query = this.dataForm.query
      if (query !== '' && !this.dynamicQuery.includes(query)) {
        this.dynamicQuery.push(query)
        this.dataForm.query = ''
      }
    },
    uploadSuccess (response, file) { // 上传成功时
      if (response.code !== 0) {
        return this.$message({
          type: 'error',
          message: response.msg
        })
      }
      this.excelFile = file.name
      response.data.forEach(item => {
        if (!this.dynamicQuery.includes(item)) {
          this.dynamicQuery.push(item)
        }
      })
    },
    multiAddClick () { // 批量新增至以下词组中
      console.log('批量新增')
      this.dynamicQuery.forEach(item => {
        // 判断上面手动添加的数据是否已经存在于表格中，不存在时再添加至表格，已存在则不添加
        let isInArray = this.tableData.filter(ritem => ritem.name === item).length
        if (isInArray === 0) { // 不存在
          this.tableData.push({
            name: item
          })
        }
      })
      this.dynamicQuery = []
    },
    multiRemoveClick (data) { // 批量删除
      console.log('批量删除', data)
      this.tableData = data
    }
  }
}
</script>
<style scoped>
  @import "../assets/style/update-base.css";
</style>
