<template>
  <div>
    <div class="add-wrap">
      <div class="query-title"><span style="color:red">*</span>手动填入词组里的Query</div>
      <el-card shadow="never" class="query-card-content">
        <el-form :model="dataForm" inline ref="dataForm">
          <el-form-item>
            <el-input v-model.trim="dataForm.query" placeholder="请填入Query名" style="width: 400px"/>
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
        <div class="query-tag-content">
          <el-tag
            :key="tag"
            v-for="tag in dynamicQuery"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
            class="tag-item"
          >
          {{tag}}
        </el-tag>
        <p v-if="dynamicQuery.length === 0">暂无内容</p>
        </div>
        <div class="query-tag-total">共选择 <span>{{dynamicQuery.length}}</span> 条</div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { findParent } from '../assets/js/utils'
import { downloadTemplate, uploadWords } from '@/api/lexicon/mallLexiconList'
export default {
  data () {
    return {
      templateUrl: downloadTemplate,
      dataForm: {
        query: ''
      },
      dynamicQuery: [],
      uploadWords: uploadWords,
      excelFile: ''
    }
  },
  mounted () {
    this.parent = findParent(this.$parent)
  },
  computed: {
    searchWords () {
      if (!this.dynamicQuery.length) {
        return {
          checkedLen: 0,
          msg: '请至少填入一个Query!',
          list: []
        }
      }
      return {
        checkedLen: this.dynamicQuery.length,
        list: this.dynamicQuery
      }
    }
  },
  methods: {
    handleClose (tag) {
      this.dynamicQuery.splice(this.dynamicQuery.indexOf(tag), 1)
    },
    addQuery () {
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
    initData () {
      this.dynamicQuery = []
      this.dataForm.query = ''
      this.excelFile = ''
    }
  }
}
</script>
<style scoped>
  @import '../assets/style/add-base.css';
</style>
