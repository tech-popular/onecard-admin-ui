<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="上传人: ">
        <el-input v-model="dataForm.creator" placeholder="角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="上传时间: ">
        <el-date-picker
            v-model="dataForm.createTime"
            type="datetimerange"
            range-separator="至"
            format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
        <el-button @click="resetHandle">重置</el-button>
        <el-upload
          class="upload-excel"
          ref="upload"
          action="aaa"
          accept=".xlsx, .xls"
          :on-change="handleChange"
          :show-file-list="false"
          :auto-upload="false"
        >
          <el-button type="primary">点击上传</el-button>
        </el-upload>
        <el-button type="primary" class="btn-download" icon="el-icon-download"><a :href="templateUrl">下载模板</a></el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;"
    >
      <el-table-column prop="id" header-align="center" align="center" label="序号"></el-table-column>
      <el-table-column prop="project" header-align="center" align="center" label="项目"></el-table-column>
      <el-table-column prop="tableName" header-align="center" align="center" show-overflow-tooltip label="表名"></el-table-column>
      <el-table-column prop="dataCount" header-align="center" align="center" label="导入数据条数"></el-table-column>
      <el-table-column prop="creator" header-align="center" align="center" label="创建人"></el-table-column>
			<el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>
<style>
.input-with-select {
  width: 180px;
}
.upload-excel {
  display: inline-block;
  margin-left: 10px;
  margin-right: 10px;
}
.btn-download a {
  color: #fff;
}
</style>
<script>
import { biExcelList, biExcelUpload, biExcelDownload } from '@/api/biExport/dataImport'
export default {
  data () {
    return {
      dataForm: {
        creator: '',
        createTime: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      templateUrl: biExcelDownload
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      let params = {
        'creator': this.dataForm.creator,
        'startTime': new Date(this.dataForm.createTime[0]).getTime(),
        'endTime': new Date(this.dataForm.createTime[1]).getTime(),
        'pageSize': this.pageSize,
        'page': this.pageIndex
      }
      biExcelList(params).then(({ data }) => {
        if (data.code === 0 && data.data) {
          this.dataList = data.data.list
          this.totalPage = data.data.totalCount
          this.dataListLoading = false
        } else {
          this.dataList = []
          this.totalPage = 0
          this.dataListLoading = false
        }
      })
    },
    handleChange (file) {
      // 上传文件之前的事件
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      let size = file.size / 1024 / 1024
      if (extension !== 'xlsx') {
        this.$message.warning({
          title: '警告',
          message: `只能上传Excel2017（即后缀是.xlsx）的文件`
        })
      }
      if (size > 10) {
        this.$message.warning({
          title: '警告',
          message: `文件大小不得超过10M`
        })
      }
      const form = new FormData()
      form.append('file', file.raw, file.name)
      biExcelUpload(form).then(({ data }) => {
        if (data.code === 0) {
          this.$message({
            message: '上传成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 重置
    resetHandle () {
      this.dataForm.creator = ''
      this.dataForm.createTime = ''
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    }
  }
}
</script>