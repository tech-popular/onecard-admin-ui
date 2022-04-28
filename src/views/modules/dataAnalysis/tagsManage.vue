 <template>
  <div class="index-wrap">
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="分类名称">
        <el-input v-model="dataForm.name" placeholder />
      </el-form-item>
      <!-- <el-form-item label="分类等级" prop="level">
        <el-select v-model="dataForm.level">
          <el-option v-for="(item, index) in typeList" :label="item.lable" :value="item.value" :key="index"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
        <el-button type="success" @click="addOrUpdateHandle()">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" width="50" align="center" label="ID"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="分类名称">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="toBreak(scope.row.name)" slot="content"></div>
            <div class="text-to-long-cut">{{scope.row.name}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="level" header-align="center" align="center" label="分类等级"></el-table-column>
      <el-table-column prop="parentId" header-align="center" align="center" label="分类父级ID"></el-table-column>
      <el-table-column header-align="center" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row, 'edit')">编辑</el-button>
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
      layout="total, sizes, prev, pager, next, jumper"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import AddOrUpdate from './baseComponents/tagsManage-add-or-update'
import { dataCatalogList, deleteDataInfo } from '@/api/dataAnalysis/tagsManage'
export default {
  data () {
    return {
      dataForm: {
        // level: '',
        name: ''
      },
      dataList: [],
      pageNum: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalCount: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      isAdmin: sessionStorage.getItem('username') === 'admin',
      typeList: [
        { lable: '一级', value: 'kafka' },
        { lable: '二级', value: 'sms' }
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
      this.dataListLoading = true
      let params = {
        ...this.dataForm,
        'pageNum': this.pageNum,
        'pageSize': this.pageSize
      }
      dataCatalogList(params).then(({ data }) => {
        if (!data || (data && (data.status !== '1' || !data.data))) {
          this.dataList = []
          this.dataListLoading = false
          this.totalCount = 0
          return this.$message({
            type: 'error',
            message: data.message
          })
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
      this.$confirm(`确认删除名称为【${row.name}】的数据?`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDataInfo(row.id).then(({ data }) => {
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
        type: ''
        // level: ''
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
.index-wrap {
  & .vue-treeselect {
    min-height: 40px;
    line-height: 40px;
    max-width: 195px;
  }
  & .vue-treeselect__single-value,
  & .vue-treeselect__placeholder {
    height: 40px;
    line-height: 40px;
  }
  & .el-table .cell {
    white-space: pre-line;
  }
}
</style>
