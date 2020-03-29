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
            <el-button @click="importFileClick" size="small">文件导入</el-button>
            <el-button type="success" @click="downloadFileClick" size="small">下载模板</el-button>
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
        <div class="query-tag-total">
          <el-button type="primary" size="mini" style="float: left" @click="multiAddClick">批量新增至以下词组中</el-button>
          <b>目前已添加 <span>{{dynamicQuery.length}}</span> 条</b>
        </div>
      </el-card>
      <div class="table-content">
        <div class="btn-group">
          <span style="float: left">目前词组中的Query</span>
          <el-button type="danger" size="small" @click="multiRemoveClick">批量删除选中Query</el-button>
        </div>
        <el-table :data="tableData" border @selection-change="handleSelectionChange" @select-all="handleAllCheckedChange">
          <el-table-column type="selection" header-align="center" align="center" width="100"></el-table-column>
          <el-table-column label="序号" header-align="center" align="center" width="100">
            <template slot-scope="scope">
            {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column prop="label" label="Query" header-align="center" align="center"></el-table-column>
        </el-table>
        <div class="query-tag-total">目前已选中 <span>{{tableDataChecked.length}}</span> 条 / 共 {{tableData.length}} 条</div>
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
      queryList: [
        {
          id: 'op',
          lable: '中文'
        },
        {
          id: 'op1',
          lable: '中文1'
        }
      ],
      dynamicQuery: [],
      tableData: [{
        label: '123'
      },
      {
        label: '444'
      }],
      tableDataChecked: []
    }
  },
  methods: {
    handleClose (tag) { // 删除标签
      this.dynamicQuery.splice(this.dynamicQuery.indexOf(tag), 1)
    },
    addQuery () { // 手动添加query
      let query = this.dataForm.query
      if (query !== '' && !this.dynamicQuery.includes(query)) {
        this.dynamicQuery.push(query)
        this.dataForm.query = ''
      }
    },
    importFileClick () { // 导入文件
      console.log('导入')
    },
    downloadFileClick () { // 下载文件
      console.log('下载')
    },
    multiAddClick () { // 批量新增至以下词组中
      console.log('批量新增')
    },
    multiRemoveClick () { // 批量删除
      console.log('批量删除')
    },
    handleSelectionChange (val) { // 表格选中内容
      console.log(val)
      this.tableDataChecked = val
    },
    handleAllCheckedChange (val) { // 表格全选时内容
      console.log(val)
      this.tableDataChecked = val
    },
    dataSubmit () {
      console.log(1)
    }
  }
}
</script>
<style scoped>
  @import "../assets/style/update-base.css";
</style>