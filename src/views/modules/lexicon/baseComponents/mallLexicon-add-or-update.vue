<template>
  <el-dialog :title="id ? '查看/编辑': '新增'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="900px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="词组名称:" prop="wordsName">
        <el-input v-model="dataForm.wordsName" placeholder="" :disabled="!!id" />
      </el-form-item>
      <el-form-item label="所属词组类型:" prop="wordsType">
        <el-radio-group v-model="dataForm.wordsType">
          <el-radio label="近义词"></el-radio>
          <el-radio label="同义词"></el-radio>
          <el-radio label="热门词"></el-radio>
          <el-radio label="敏感词"></el-radio>
          <el-radio label="停用词"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!--近义词 or 同义词新增-->
    <div v-if="!id">
      <near-synonym-add v-if="dataForm.wordsType === '近义词' || dataForm.wordsType === '同义词'" ref="addSynonym"></near-synonym-add>
      <!--热门词新增-->
      <hot-synonym-add v-if="dataForm.wordsType ==='热门词'" ref="addSynonym"></hot-synonym-add>
      <!--敏感词和停用词新增-->
      <stop-synonym-add v-if="dataForm.wordsType ==='敏感词' || dataForm.wordsType ==='停用词'" ref="addSynonym"></stop-synonym-add>
    </div>
    <div v-else>
      <!--近义词 or 同义词修改-->
      <near-synonym-update v-if="dataForm.wordsType === '近义词' || dataForm.wordsType === '同义词'" ref="updateSynonym"></near-synonym-update>
      <!-- 热门词修改 -->
      <hot-synonym-update v-if="dataForm.wordsType ==='热门词'" ref="updateSynonym"></hot-synonym-update>
      <!--敏感词和停用词修改-->
      <stop-synonym-update v-if="dataForm.wordsType ==='敏感词' || dataForm.wordsType ==='停用词'" ref="updateSynonym"></stop-synonym-update>
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
import { showWordsInfo } from '@/api/lexicon/mallLexiconList'
export default {
  data () {
    return {
      isTreeRoot: true,
      id: '',
      visible: false,
      dataForm: {
        wordsName: '',
        wordsType: '近义词'
      },
      dataRule: {
        wordsName: [
          { required: true, message: '请输入词组名称', trigger: 'blur' }
        ],
        wordsType: [
          { required: true, message: '请选择所属词组类型', trigger: 'change' }
        ]
      },
      data: [] // 编辑时的查看数据，数组
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
      this.dataForm = { // 初始化
        wordsName: '',
        wordsType: '近义词'
      }
      if (row.id) {
        this.id = row.id
        showWordsInfo(row.id).then(({data}) => { // 查看详情信息
          if (data.code !== 0) {
            return this.$message({
              type: 'error',
              message: data.msg
            })
          }
          this.dataForm = {
            wordsName: data.data.wordsName,
            wordsType: data.data.wordsType
          }
          this.data = data.data.searchWords
          this.$nextTick(() => {
            this.visible = true
          })
        })
      } else {
        this.visible = true
      }
    },
    cancel () {
      this.visible = false
    },
    dataSubmit () {
      console.log(this.$refs.addSynonym)
    }
  }
}
</script>
<style scoped>
.transfer-form .el-form-item {
  margin: 0;
}
</style>