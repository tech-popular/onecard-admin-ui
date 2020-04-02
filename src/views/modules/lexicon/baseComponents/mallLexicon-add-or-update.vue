<template>
  <el-dialog :title="id ? '查看/编辑': '新增'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="900px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="词组名称:" prop="wordName">
        <el-input v-model="dataForm.wordName" placeholder="" :disabled="!!id" />
      </el-form-item>
      <el-form-item label="所属词组类型:" prop="wordType">
        <el-radio-group v-model="dataForm.wordType" @change="wordTypeChange">
          <el-radio
            v-for="item in typeList"
            :key="item"
            :label="item"
          >
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!--近义词 or 同义词新增-->
    <div v-if="!id">
      <near-synonym-add v-if="dataForm.wordType === '近义词' || dataForm.wordType === '同义词'" ref="addSynonym"></near-synonym-add>
      <!--热门词新增-->
      <hot-synonym-add v-if="dataForm.wordType ==='热门词'" ref="addSynonym"></hot-synonym-add>
      <!--敏感词和停用词新增-->
      <stop-synonym-add v-if="dataForm.wordType ==='敏感词' || dataForm.wordType ==='停用词'" ref="addSynonym"></stop-synonym-add>
    </div>
    <div v-else>
      <!--近义词 or 同义词修改-->
      <near-synonym-update v-if="dataForm.wordType === '近义词' || dataForm.wordType === '同义词'" ref="updateSynonym" :data="searchWords"></near-synonym-update>
      <!-- 热门词修改 -->
      <hot-synonym-update v-if="dataForm.wordType ==='热门词'" ref="updateSynonym" :data="searchWords"></hot-synonym-update>
      <!--敏感词和停用词修改-->
      <stop-synonym-update v-if="dataForm.wordType ==='敏感词' || dataForm.wordType ==='停用词'" ref="updateSynonym" :data="searchWords"></stop-synonym-update>
    </div>
    <div slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="dataSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import nearSynonymAdd from './mallLexicon-near-synonym-add'
import hotSynonymAdd from './mallLexicon-hot-synonym-add'
import stopSynonymAdd from './mallLexicon-stop-synonym-add'
import nearSynonymUpdate from './mallLexicon-near-synonym-update'
import hotSynonymUpdate from './mallLexicon-hot-synonym-update'
import stopSynonymUpdate from './mallLexicon-stop-synonym-update'
import { showWordsInfo, addWordsInfo, updateWordsInfo } from '@/api/lexicon/mallLexiconList'
export default {
  data () {
    return {
      isTreeRoot: true,
      id: '',
      visible: false,
      dataForm: {
        wordName: '',
        wordType: '近义词'
      },
      dataRule: {
        wordName: [
          { required: true, message: '请输入词组名称', trigger: 'blur' }
        ],
        wordType: [
          { required: true, message: '请选择所属词组类型', trigger: 'change' }
        ]
      },
      searchWords: [] // 编辑时的查看数据，数组
    }
  },
  props: {
    typeList: {
      type: Array,
      default: []
    }
  },
  components: {
    nearSynonymAdd,
    hotSynonymAdd,
    stopSynonymAdd,
    nearSynonymUpdate,
    hotSynonymUpdate,
    stopSynonymUpdate
  },
  computed: {
    userName: {
      get () { return this.$store.state.user.name }
    }
  },
  methods: {
    init (row) {
      this.id = ''
      this.dataForm = { // 初始化
        wordName: '',
        wordType: '近义词'
      }
      if (row && row.id) {
        this.id = row.id
        showWordsInfo(row.id).then(({data}) => { // 查看详情信息
          if (data.code !== 0) {
            return this.$message({
              type: 'error',
              message: data.msg
            })
          }
          this.dataForm = {
            wordName: data.data.wordsName,
            wordType: data.data.wordsType
          }
          this.searchWords = data.data.searchWords
          this.$nextTick(() => {
            this.visible = true
          })
        })
      } else {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.addSynonym.initData()
        })
      }
    },
    wordTypeChange () {
      if (!this.id) {
        this.$refs.addSynonym.initData()
      }
    },
    cancel () {
      this.visible = false
    },
    dataSubmit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let url = addWordsInfo
          let params = {}
          let searchWords = {}
          if (this.id) {
            url = updateWordsInfo
            searchWords = this.$refs.updateSynonym.searchWords
          } else {
            searchWords = this.$refs.addSynonym.searchWords
          }
          if (searchWords.checkedLen === 0) {
            return this.$message({
              type: 'error',
              message: searchWords.msg
            })
          }
          params = {
            ...this.dataForm,
            creator: this.userName,
            searchWords: searchWords.list
          }
          this.postAjax(url, params)
        }
      })
    },
    postAjax (url, params) {
      url(params).then(({data}) => {
        if (data.code !== 0) {
          return this.$message({
            type: 'error',
            message: data.msg
          })
        }
        this.$message({
          type: 'success',
          message: data.msg
        })
        this.visible = false
        this.$emit('refreshDataList')
      })
    }
  }
}
</script>
<style scoped>
.transfer-form .el-form-item {
  margin: 0;
}
</style>
