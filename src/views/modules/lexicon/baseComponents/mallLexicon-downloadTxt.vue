<template>
  <el-dialog title="发布" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible" width="400px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="词组类型:" prop="wordType">
        <el-select v-model="dataForm.wordType" filterable placeholder="请选择">
          <el-option
            v-for="item in newTypeList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="dataSubmit"><a :href="downloadUrl" style="color:#fff;text-decoration: none;">确定</a></el-button>
    </div>
  </el-dialog>
</template>
<script>
import { downLoadWordsTXT } from '@/api/lexicon/mallLexiconList'
export default {
  data () {
    return {
      visible: false,
      downloadUrl: '',
      dataForm: {
        wordType: '近义词'
      },
      dataRule: {
        wordType: [
          { required: true, message: '请选择所属词组类型', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    typeList: {
      type: Array,
      default: []
    }
  },
  computed: {
    newTypeList () {
      let arr = []
      arr = this.typeList.filter(item => item !== '敏感词')
      arr = arr.filter(item => item !== '热门词')
      return arr
    }
  },
  methods: {
    init (row) {
      this.visible = true
      this.dataForm = { // 初始化
        wordType: ''
      }
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    cancel () {
      this.visible = false
    },
    dataSubmit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          console.log(valid)
          this.downloadUrl = downLoadWordsTXT(this.dataForm.wordType)
        } else {
          this.downloadUrl = 'javascript:;'
        }
      })
    }
  }
}
</script>
