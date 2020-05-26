<template>
  <div class="index-wrap">
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="指标ID">
        <el-input v-model="dataForm.id" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="指标名称">
        <el-input v-model="dataForm.englishName" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="指标标题">
        <el-input v-model="dataForm.chineseName" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="指标类别">
        <Treeselect
              :options="categoryIdList"
              :disable-branch-nodes="true"
              :show-count="true"
              :multiple="false"
              :load-options="loadOptions"
              :searchable="true"
              :clearable="true"
              noChildrenText="暂无数据"
              v-model="dataForm.categoryId"
              placeholder="全部"
              style="line-height:38px"
            />
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
        <el-button type="success" @click="manualSync()">手动同步</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="指标ID"></el-table-column>
      <el-table-column prop="englishName" header-align="center" align="center" label="指标名">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.englishName)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.englishName}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="chineseName" header-align="center" align="center" label="指标标题">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.chineseName)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.chineseName}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="fieldType" header-align="center" align="center" :formatter="fieldTypeFormat" label="数据类型"></el-table-column>
      <el-table-column prop="categoryId" header-align="center" align="center" :formatter="categoryIdFormat" label="指标类别"></el-table-column>
      <el-table-column prop="channelCode" header-align="center" align="center" label="渠道"></el-table-column>
      <el-table-column prop="dataStandar" header-align="center" align="center" label="数据格式">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.dataStandar)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.dataStandar}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="sourceTable" header-align="center" align="center" label="来源表"></el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="指标描述">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.remark)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.remark}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" header-align="center" align="center" label="创建人"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="修改时间"></el-table-column>
      <el-table-column prop="enable" header-align="center" align="center" label="指标状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === true" size="small" >有效</el-tag>
          <el-tag v-else size="small" type="danger">无效</el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="100" label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="addOrUpdateHandle(scope.row)">编辑</el-button> -->
          <el-button type="text" @click="addOrUpdateHandle(scope.row, 'view')">查看</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
  import { indexManageList, indexManageTypeList, indexManageMinCataList } from '@/api/dataAnalysis/indexManage'
  import { nameToLabel, echoDisplay } from './dataAnalysisUtils/utils'
  import AddOrUpdate from './baseComponents/indexManage-add-or-update'
  import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  export default {
    data () {
      return {
        dataForm: {
          id: '',
          englishName: '',
          chineseName: '',
          categoryId: null,
          enable: ''
        },
        dataList: [],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalCount: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        fieldTypeList: [ // 数据类型
          // {
          //   typeNum: '1',
          //   typeValue: '类型一'
          // },
          // {
          //   typeNum: '2',
          //   typeValue: '类型2'
          // }
        ],
        categoryIdList: [ // 指标类别
          // {
          //   typeNum: '1',
          //   typeValue: '类别一'
          // },
          // {
          //   typeNum: '2',
          //   typeValue: '类别2'
          // }
        ]
      }
    },
    components: {
      AddOrUpdate,
      Treeselect
    },
    mounted () {
      this.getCategoryIdList()
      this.getFieldTypeList()
      this.getDataList()
    },
    methods: {
      async loadOptions ({ action, parentNode, callback }) {
        if (action === LOAD_CHILDREN_OPTIONS) {
          callback()
        }
      },

      // 数据类型
      fieldTypeFormat (row, column) {
        for (var i = 0; i < this.fieldTypeList.length; i++) {
          if (row.fieldType === this.fieldTypeList[i].childrenValue) {
            return this.fieldTypeList[i].childrenValue
          }
        }
      },
      // 指标类别
      categoryIdFormat (row) {
        return echoDisplay(this.categoryIdList, row.categoryId)
      },

      // 获取指标类别
      getCategoryIdList () {
        indexManageMinCataList().then(({data}) => {
          if (data && data.status === '1') {
            this.categoryIdList = nameToLabel(data.data)
          }
        })
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

      // 获取数据列表
      getDataList () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataListLoading = true
            let params = {
              ...this.dataForm,
              'pageNum': this.pageNum,
              'pageSize': this.pageSize
            }
            if (!params.categoryId) {
              params.categoryId = ''
            }
            indexManageList(params, false).then(({data}) => {
              if (!data || (data && (data.status !== '1' || !data.data))) {
                this.dataList = []
                this.totalCount = 0
              } else {
                this.dataList = data.data.list
                this.totalCount = data.data.total
              }
              this.dataListLoading = false
            })
          }
        })
      },

      // 新增 / 修改
      addOrUpdateHandle (row, tag) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row, tag)
          // this.$refs.addOrUpdate.getCategoryIdList(row)
        })
      },
      /** 查询 */
      searchHandle () {
        this.pageNum = 1
        this.getDataList()
      },
      /** 重置 */
      resetHandle () {
        this.pageNum = 1
        this.dataForm = {
          id: '',
          englishName: '',
          chineseName: '',
          categoryId: null,
          enable: ''
        }
        // this.getDataList()
      },
      // 手动同步
      manualSync () {

      },
      // 每页数
      sizeChangeHandle (page) {
        this.pageSize = page
        this.pageNum = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (page) {
        this.pageNum = page
        this.getDataList()
      }
    }
  }
</script>
<style lang="scss">
  .index-wrap{
    & .vue-treeselect {
      min-height: 40px;
      line-height: 40px;
      max-width: 195px;
    }
    & .vue-treeselect__single-value,
    & .vue-treeselect__placeholder{
      height: 40px;
      line-height: 40px;
    }
  }
</style>
