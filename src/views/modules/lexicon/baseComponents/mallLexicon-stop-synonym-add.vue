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
          </el-form-item>
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
      <div class="btn-group">
        <el-button size="small">文件导入</el-button>
        <el-button type="primary" size="small">下载模板</el-button>
      </div>
    </div>
    <div class="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataSubmit()">确定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dataForm: {
        query: ''
      },
      dynamicQuery: []
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
    dataSubmit () {
      console.log(1)
    }
  }
}
</script>
<style scoped>
  .query-card-content {
    background: #eff0f3;
  }
  .query-tag-content {
    padding: 10px;
    background: #fff;
    min-height: 150px;
    max-height: 300px;
    overflow: auto;
  }
  .query-tag-content .tag-item {
    margin: 10px 10px 0 0;
  }
  .query-tag-content p {
    margin: 0;
    color: #dcdfe6;
  }
  .query-tag-total {
    text-align: right;
    padding-top: 10px;
  }
  .query-tag-total span {
    color: red;
  }
  .btn-group {
    padding-top: 10px;
  }
  .footer {
    text-align: right;
    margin-top: 20px;
  }
</style>