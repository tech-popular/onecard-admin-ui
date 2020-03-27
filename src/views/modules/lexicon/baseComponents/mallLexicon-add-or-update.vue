<template>
  <el-dialog title="查看" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="200px">
      <el-form-item label="词组名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="" />
      </el-form-item>
      <el-form-item label="所属词组类型" prop="type">
        <el-radio-group v-model="dataForm.type" size="medium">
          <el-radio-button label="近义词" ></el-radio-button>
          <el-radio-button label="同义词"></el-radio-button>
          <el-radio-button label="热门词"></el-radio-button>
          <el-radio-button label="敏感词"></el-radio-button>
          <el-radio-button label="停用词"></el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <near-synonym></near-synonym>
    <div slot="footer" class="foot">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import nearSynonym from './mallLexicon-near-synonym'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        name: '',
        type: '',
        query: ''
      },
      dataRule: {
        name: [
          { required: true, message: '请输入词组名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择所属词组类型', trigger: 'change' }
        ],
        query: [
          { required: true, message: '选择及添加词组里的Query', trigger: 'change' }
        ]
      }
    }
  },
  components: { nearSynonym },
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