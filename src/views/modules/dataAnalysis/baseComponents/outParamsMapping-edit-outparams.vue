<template>
  <div class="index-wrap">
    <div class="last-modifier">最后修改人：{{updator}}</div>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="指标ID">
        <el-input v-model="dataForm.id" placeholder="请输入指标ID" clearable />
      </el-form-item>
      <el-form-item label="指标名称">
        <el-input v-model="dataForm.englishName" placeholder="请输入指标名称" clearable />
      </el-form-item>
      <el-form-item label="指标标题">
        <el-input v-model="dataForm.chineseName" placeholder="请输入指标标题" clearable />
      </el-form-item>
      <el-form-item label="用户所属渠道">
        <el-select v-model="dataForm.channelCode" filterable clearable placeholder="请选择">
            <el-option v-for="(item, index) in channelIdList" :key="index" :label="item.text" :value="item.value"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="指标状态">
        <el-select v-model="dataForm.enable" placeholder="指标状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="有效" value="true"></el-option>
          <el-option label="无效" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border style="width: 100%;" class="table-content" ref="dataTable">
      <el-table-column prop="id" header-align="center" align="center" width="80" label="指标ID"></el-table-column>
      <el-table-column prop="englishName" header-align="center" align="center" label="指标名称"></el-table-column>
      <el-table-column prop="chineseName" header-align="center" align="center" label="指标标题"></el-table-column>
      <el-table-column header-align="center" align="center" width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row, 'view')">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="150">
        <template>
          <el-button type="text" style="color: #888">-></el-button>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="修改后指标名称">
        <template slot-scope="scope">
            <el-input v-model.trim="scope.row.indexAlias" @blur="blurIndexAliasEvent(scope.row)" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"/>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getdDataIndexAliasList"/>
    <div class="btn-group">
      <el-button type="primary" @click="submitData">提交</el-button>
      <el-button type="default" @click="submitCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  import { indexManageTypeList } from '@/api/dataAnalysis/indexManage'
  import { channelsList } from '@/api/dataAnalysis/dataInsightManage'
  import { dataIndexAliasList, dataIndexAliasUpdate, dataAnalysisGetUpdator } from '@/api/dataAnalysis/outParamsMapping'
  import AddOrUpdate from './indexManage-add-or-update'
  import { deepClone } from '../dataAnalysisUtils/utils'
  export default {
    data () {
      return {
        dataForm: {
          id: '',
          englishName: '',
          chineseName: '',
          channelCode: null,
          enable: ''
        },
        dataList: [],
        modifyDataList: [],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalCount: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        fieldTypeList: [], // 数据类型
        channelIdList: [],
        isSearch: false,
        updator: '无',
        originTableData: {} // 保留一份原始数据
      }
    },
    components: {
      AddOrUpdate
    },
    mounted () {
      this.getFieldTypeList()
      this.getChannelIdList()
      this.getdDataIndexAliasList()
      this.getUpdator()
    },
    props: {
      transferId: Number
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.name }
      }
    },
    methods: {

      // 数据类型
      fieldTypeFormat (row, column) {
        for (var i = 0; i < this.fieldTypeList.length; i++) {
          if (row.fieldType === this.fieldTypeList[i].childrenValue) {
            return this.fieldTypeList[i].childrenValue
          }
        }
      },

      // 获取数据类型
      getFieldTypeList () {
        let params = 6
        indexManageTypeList(params).then(({data}) => {
          if (data && data.status === '1') {
            this.fieldTypeList = data.data
          }
        })
      },

      getChannelIdList () {
        channelsList().then(res => {
          console.log(res)
          if (res.data.status * 1 !== 1) {
            this.channelIdList = []
            return
          }
          this.channelIdList = res.data.data
        })
      },
      getUpdator () {
        dataAnalysisGetUpdator(this.transferId).then(({data}) => {
          if (data.status !== '1') {
            this.updator = '无'
          } else {
            this.updator = data.data || '无'
          }
        })
      },
      getdDataIndexAliasList () { // 点击出参编辑时
        this.dataListLoading = true
        let params = {
          ...this.dataForm,
          channelCode: this.dataForm.channelCode === '' ? null : this.dataForm.channelCode,
          'pageNum': this.pageNum,
          'pageSize': this.pageSize
        }
        dataIndexAliasList(this.transferId, params).then(({data}) => {
          if (data && (data.status !== '1' || !data.data)) {
            this.dataList = []
            this.totalCount = 0
            this.dataListLoading = false
            return
          }
          this.dataList = data.data.list.map(item => {
            return { ...item, indexAlias: item.indexAlias || item.englishName }
          })
          this.originTableData = deepClone(this.dataList)
          this.totalCount = data.data.total
          if (this.modifyDataList.length) {
            this.dataList.forEach((item, index) => {
              this.modifyDataList.forEach((mitem, mindex) => {
                if (item.id === mitem.id) {
                  this.dataList.splice(index, 1, this.modifyDataList[mindex])
                }
              })
            })
          }
          this.dataListLoading = false
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (row, tag) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row, tag)
        })
      },
      /** 查询 */
      searchHandle () {
        this.pageNum = 1
        // this.isSearch = true
        this.getdDataIndexAliasList()
      },
      /** 重置 */
      resetHandle () {
        this.pageNum = 1
        this.dataForm = {
          englishName: '',
          chineseName: '',
          enable: ''
        }
      },
      blurIndexAliasEvent (row) { // 输入框失去焦点时，保存数据
        let isModify = true
        // 用当前数据和原始数据作比较
        let originRow = this.originTableData.filter(item => item.id === row.id)[0]
        if (row.indexAlias === originRow.indexAlias) { // 等于说明没有修改
          isModify = false
          if (this.judgeIsInArray(this.modifyDataList, row.id) !== -1) { // 若之前修改过又修改回来了，则在modifyData去掉这个数据
            let index = this.judgeIsInArray(this.modifyDataList, row.id)
            this.modifyDataList.splice(index, 1)
          }
        }
        if (isModify && this.judgeIsInArray(this.modifyDataList, row.id) === -1) {
          this.modifyDataList.push(row)
        }
      },
      judgeIsInArray (arr, id) { // 判断某个参数是否在数据中
        let flag = -1
        arr.forEach((item, index) => {
          if (item.id === id) {
            flag = index
          }
        })
        return flag
      },
      // 每页数
      sizeChangeHandle (page) {
        this.pageSize = page
        this.pageNum = 1
        this.getdDataIndexAliasList()
      },
      // 当前页
      currentChangeHandle (page) {
        this.pageNum = page
        this.getdDataIndexAliasList()
      },
      submitData () {
        let emptyLen = this.modifyDataList.filter(item => item.indexAlias === '').length
        if (emptyLen > 0) {
          return this.$message({
            type: 'error',
            message: '修改后的指标名称不可为空，请重新编辑再提交！'
          })
        }
        if (this.modifyDataList.length === 0) {
          this.$confirm('当前出参名称无修改，确定提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('cancel')
          }).catch((e) => {
            console.log(e)
          })
          return
        }
        dataIndexAliasUpdate(this.transferId, this.userName, this.modifyDataList).then(({data}) => {
          if (data && data.status !== '1') {
            return this.$message({
              message: data.message || '提交出错',
              type: 'error'
            })
          }
          this.$message({
            message: data.message || '提交成功',
            type: 'success'
          })
          this.modifyDataList = []
          this.$emit('cancel')
        })
      },
      submitCancel () {
        this.modifyDataList = []
        this.$emit('cancel')
      }
    }
  }
</script>
<style lang="scss">
  .index-wrap{
    & .last-modifier {
      padding: 0 30px 15px 0;
      text-align: right;
      font-weight: bold;
    }
    & .line-arrow {
      padding-top: 44px;
    }
    & .line-arrow::before {
      height: 0;
    }
    // & .line-arrow td, & .line-arrow th.is-leaf {
    //   border: 0;
    //   padding-bottom: 11px;
    // }
    // & .line-arrow .el-table__body tr:hover>td{
    //   background-color: #fff!important;
    //   cursor: none;
    // }
    & .btn-group {
      text-align: center;
      padding-top: 20px;
    }
    & .table-content {
      border-top: 0;
    }
    & .table-content::before {
      height: 0;
    }
    & .table-content th {
      border-top: 1px solid #ebeef5;
    }

    & .table-content th:nth-child(5){
      border-top: 0;
    }
    & .table-content tr:last-child td:nth-child(5) {
      border-bottom: 0;;
    }
    & .table-content tr td:nth-child(5), & .table-content tr th:nth-child(5){
      border-bottom: 0;
    }
    & .el-table__empty-block {
      border-bottom: 1px solid #ebeef5;
    }
  }
</style>
