<template>
  <el-dialog title="批量文件上传" :modal-append-to-body='false' :append-to-body="true" :close-on-click-modal="false" :visible.sync="visible">
    <div class="tips"><i class="el-icon-warning-outline"></i>上传文件前，请下载上传模板，按照模板格式填写sku，文件只支持csv格式，sku数目不可超过50条</div>
    <el-button type="success" size="small"><a :href="templateUrl" style="color:#fff;text-decoration: none;">下载模板</a></el-button>
    <el-upload
      class="upload-file"
      ref="upload"
      :action="uploadFile"
      accept=".csv"
      :show-file-list="false"
      :on-success="uploadSuccess"
    >
      <el-button type="primary" size="small">选择文件</el-button>
      <div class="upload-name"><span v-if="excelFile">上传文件名：{{excelFile}}</span></div>

    </el-upload>
    <div slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="dataSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { uploadFile } from '@/api/lexicon/urgentUpdateGoods'
export default {
  data () {
    return {
      visible: false,
      excelFile: '',
      uploadFile: uploadFile
    }
  },
  methods: {
    init () {
      this.visible = true
    },
    uploadSuccess (response, file) { // 上传成功时
      if (response.code !== 0) {
        return this.$message({
          type: 'error',
          message: response.msg
        })
      }
      this.excelFile = file.name
      console.log(response.data) // 取到的数据
    },
    cancel () {
      this.visible = false
    },
    dataSubmit () {
      console.log('dq')
    }
  }
}
</script>
<style scoped>
  .tips {
    color: red;
    margin-bottom: 20px;
  }
  .upload-file {
    display: inline-block;
    margin-left: 20px;
  }
  .upload-name {
    display: inline-block;
    margin-left: 20px;
  }
</style>
