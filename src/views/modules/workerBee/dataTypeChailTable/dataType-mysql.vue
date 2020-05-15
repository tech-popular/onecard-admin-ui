<template>
    <div class="aviator">
      <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="datasourceName" header-align="center" align="center" label="数据源名称"/>
      <el-table-column prop="datasourceType" header-align="center" align="center" label="数据源类型"/>
      <el-table-column prop="url" header-align="center" align="center" label="数据库URL"/>
      <el-table-column prop="version" header-align="center" align="center" label="版本"/>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"/>
      <el-table-column
        prop="enable"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === true" size="small" >启用</el-tag>
          <el-tag v-else size="small" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="remark" header-align="center" align="center" label="备注"/>
      <el-table-column header-align="center" align="center" width="200" label="操作" class="but">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="addOrUpdateHandle(scope.row.id)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteddialog(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: [
      'dataList'
    ],
    data () {
      return {
        dataListLoading: false
      }
    },
    methods: {
    }
  }
</script>
<style>

</style>