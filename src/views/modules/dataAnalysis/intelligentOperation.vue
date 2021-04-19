<template>
  <div class="index-wrap">
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="任务ID">
        <el-input v-model="dataForm.id" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="任务名称">
        <el-input v-model="dataForm.englishName" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="任务状态">
        <el-select v-model="dataForm.enable" placeholder="任务状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="有效" value="true"></el-option>
          <el-option label="无效" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" align="center" label="任务ID"></el-table-column>
      <el-table-column prop="englishName" header-align="center" align="center" label="任务名称">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.englishName)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.englishName}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="chineseName" header-align="center" align="center" label="最近下发时间"></el-table-column>
      <el-table-column prop="createUser" header-align="center" align="center" label="创建人"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="修改时间"></el-table-column>
      <el-table-column prop="enable" header-align="center" align="center" label="任务状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === true" size="small" >有效</el-tag>
          <el-tag v-else size="small" type="danger">无效</el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
					<el-button type="text" @click="immediatelyIssued(scope.row)">编辑</el-button>
          <el-button type="text" @click="restart(scope.row)">重启</el-button>
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
  // import { indexManageList, indexManageTypeList, indexManageMinCataList, syncDataIndex } from '@/api/dataAnalysis/indexManage'
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
    components: {},
    mounted () {
      this.getDataList()
    },
    methods: {
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
            // indexManageList(params, false).then(({data}) => {
            //   if (!data || (data && (data.status !== '1' || !data.data))) {
            //     this.dataList = []
            //     this.totalCount = 0
            //   } else {
            //     this.dataList = data.data.list
            //     this.totalCount = data.data.total
            //   }
            //   this.dataListLoading = false
            // })
          }
        })
      },

      // 新增 / 修改
      addOrUpdateHandle (row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row)
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
      immediatelyIssued (row) {
        console.log('row: ', row)
      },
      restart (row) {
        console.log('row: ', row)
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
