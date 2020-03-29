<template>
  <el-dialog :title="id ? '查看/编辑': '新增'" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="900px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="词组名称:" prop="name">
        <el-input v-model="dataForm.name" placeholder="" />
      </el-form-item>
      <el-form-item label="所属词组类型:" prop="type">
        <el-radio-group v-model="dataForm.type">
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
      <near-synonym-add v-if="dataForm.type === '近义词' || dataForm.type === '同义词'"></near-synonym-add>
      <!--热门词新增-->
      <hot-synonym-add v-if="dataForm.type ==='热门词'"></hot-synonym-add>
      <!--敏感词和停用词新增-->
      <stop-synonym-add v-if="dataForm.type ==='敏感词' || dataForm.type ==='停用词'"></stop-synonym-add>
    </div>
    <div v-else>
      <!--近义词 or 同义词修改-->
      <near-synonym-update v-if="dataForm.type === '近义词' || dataForm.type === '同义词'"></near-synonym-update>
      <!-- 热门词修改 -->
      <hot-synonym-update v-if="dataForm.type ==='热门词'"></hot-synonym-update>
      <!--敏感词和停用词修改-->
      <stop-synonym-update v-if="dataForm.type ==='敏感词' || dataForm.type ==='停用词'"></stop-synonym-update>
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
export default {
  data () {
    return {
      isTreeRoot: true,
      id: '',
      visible: false,
      dataForm: {
        name: '',
        type: '近义词'
      },
      dataRule: {
        name: [
          { required: true, message: '请输入词组名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择所属词组类型', trigger: 'change' }
        ]
      }
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
  methods: {
    init (row) {
      this.visible = true
      this.id = row ? row.id : ''
      this.dataForm = { // 初始化
        name: '',
        type: '近义词'
      }
    },
    cancel () {
      this.visible = false
    }
  }
}
</script>
<style scoped>
.transfer-form .el-form-item {
  margin: 0;
}
</style>