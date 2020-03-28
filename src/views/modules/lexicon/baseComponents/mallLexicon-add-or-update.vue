<template>
  <el-dialog title="查看" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="1000px">
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
    <!--近义词 or 同义词-->
    <near-synonym v-if="dataForm.type === '近义词' || dataForm.type === '同义词'"></near-synonym>
    <!--热门词-->
    <hot-synonym v-if="dataForm.type ==='热门词'"></hot-synonym>
    <div slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import nearSynonym from './mallLexicon-near-synonym'
import hotSynonym from './mallLexicon-hot-synonym'
export default {
  data () {
    return {
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
  components: { nearSynonym, hotSynonym },
  methods: {
    init (row) {
      this.visible = true
    },
    dataFormSubmit () {
      console.log(1)
    }
  }
}
</script>
<style scoped>
.transfer-form .el-form-item {
  margin: 0;
}
</style>