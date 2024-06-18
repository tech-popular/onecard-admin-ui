 <template>
  <div class="index-wrap">
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="名称">
        <el-input v-model="dataForm.shortLinkName" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="enable">
        <el-select  v-model="dataForm.enable">
          <el-option
              v-for="(item, index) in statusList"
              :label="item.lable"
              :value="item.value"
              :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle()">查询</el-button>
        <el-button @click="resetHandle()">重置</el-button>
				<el-button type="success" @click="addOrUpdateHandle()">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" header-align="center" width="150" align="center" label="id"></el-table-column>
      <el-table-column prop="shortLinkName" header-align="center" width="150" align="center" label="短链名称"></el-table-column>
      <el-table-column prop="shortLinkUrl" header-align="center" align="center"  width="150" label="短链URL"></el-table-column>
      <el-table-column prop="enable" header-align="center" align="center" width="150" label="是否可用"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" header-align="center" align="center" label="更新时间"></el-table-column>
       <el-table-column prop="createUser" header-align="center" align="center" label="创建人"></el-table-column>
       <el-table-column prop="updateUser" header-align="center" align="center" label="修改人"></el-table-column>
      <el-table-column header-align="center" align="center" width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
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
  import AddOrUpdate from './baseComponents/bindingShortLink-add-or-update'
  import { getDataList } from '@/api/dataAnalysis/bindingShortLink'
  export default {
    data () {
      return {
        dataForm: {
          shortLinkName: '',
          enable: ''
        },
        dataList: [],
        channelList: [],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalCount: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        statusList: [
          {lable: '有效', value: 1},
          {lable: '无效', value: 0}
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
      addOrUpdateHandle (row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row)
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
          channelCode: '',
          type: '',
          resourceName: '',
          resourceCode: ''
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
    & .el-table .cell{
      white-space: pre-line;
    }
  }
</style>
