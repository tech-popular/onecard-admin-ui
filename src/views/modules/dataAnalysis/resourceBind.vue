 <template>
  <div class="index-wrap">
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="类型" prop="type">
        <el-select  v-model="dataForm.type">
          <el-option 
            v-for="(item, index) in typeList" 
            :label="item.lable" 
            :value="item.value" 
            :key="index">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="dataForm.resourceName" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="Code">
        <el-input v-model="dataForm.resourceCode" placeholder="" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
				<el-button type="success" @click="addOrUpdateHandle()">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="resourceId" header-align="center" width="80" align="center" label="ID"></el-table-column>
      <el-table-column prop="resourceName" header-align="center" align="center" label="名称">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.resourceName)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.resourceName}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="bindingIndex" header-align="center" align="center" label="出参">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.bindingIndex)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.bindingIndex}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" header-align="center" align="center" label="创建人"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="updateUser" header-align="center" align="center" label="修改人"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="修改时间"></el-table-column>
      <el-table-column header-align="center" align="center" width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row, 'edit')">编辑</el-button>
          <el-button type="text" @click="addOrUpdateHandle(scope.row, 'view')">查看</el-button>
          <el-button type="text" @click="deletedateHandle(scope.row)">删除</el-button>
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
  import AddOrUpdate from './baseComponents/resourceBind-add-or-update'
  import { getDataList, deleteDataInfo } from '@/api/dataAnalysis/sourceBinding'
  export default {
    data () {
      return {
        dataForm: {
          resourceCode: '',
          type: '',
          resourceName: ''
        },
        dataList: [],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalCount: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        typeList: [
          {lable: 'kafka', value: 'kafka'},
          {lable: 'mysql', value: 'mysql'},
          {lable: 'sms', value: 'sms'}
        ]
      }
    },
    components: {
      AddOrUpdate
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
            // this.dataListLoading = true
        let params = {
          ...this.dataForm,
          'pageNum': this.pageNum,
          'pageSize': this.pageSize
        }
        getDataList(params).then(({data}) => {
          if (!data || (data && (data.status !== '1' || !data.data))) {
            this.dataList = []
            this.totalCount = 0
          } else {
            this.dataList = data.data.list
            this.totalCount = data.data.total
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
      // 删除数据
      deletedateHandle (row) {
        this.$confirm(`确认删除短信名称为【${row.resourceName}】的数据?`, '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDataInfo(row.id).then(({data}) => {
            if (data.status !== '1') {
              return this.$message({
                type: 'error',
                message: data.message
              })
            }
            this.$message({
              type: 'success',
              message: data.message
            })
            this.getDataList()
          })
        }).catch(() => {
          // console.log('quxiao')
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
          resourceCode: '',
          type: '',
          resourceName: ''
        }
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
