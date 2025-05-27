<template>
  <div>
    <!-- 删除弹窗 -->
    <!-- <el-dialog
      title="删除"
      :visible.sync="deleteVisible"
      :append-to-body='false'
      :modal-append-to-body='true'
      width="30%">
      <span>确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleted()">确 定</el-button>
      </span>
    </el-dialog> -->
    <el-dialog title="流程配置" :close-on-click-modal="false" :visible.sync="visible" width="70%">
		<el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="类型" prop="type">
        <el-select  v-model="dataForm.type" clearable>
          <el-option 
            v-for="(item, index) in typeList" 
            :label="item.lable" 
            :value="item.value" 
            :key="index">
            </el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="所属业务线">
        <el-select
					v-model="dataForm.channelCode"
					filterable
          clearable
				>
					<template v-for="(item, index) in channelList">
						<el-option
							:key="index"
							:label="item.text"
							:value="item.value"
							:disabled="item.disabled"
						></el-option>
					</template>
				</el-select>
      </el-form-item>-->
      <el-form-item>
				<el-button  @click="resetHandle()">重置</el-button>
				<el-button type="primary" @click="searchHandle()">查询</el-button>
				<el-button type="success" @click="addOrUpdateHandle()">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="id" width="80" header-align="center" align="center" label="id"/>
      <el-table-column prop="channelCode" header-align="center" align="center" width="200" label="所属业务线"/>
      <el-table-column prop="type" header-align="center" align="center" width="150" label="类型"/>
      <el-table-column prop="params" header-align="center" align="left" label="出参"/>
      <el-table-column prop="datasourceType" header-align="center" align="center" width="150" label="通道"/>
      <el-table-column prop="target" header-align="center" align="center" width="150" label="目标"/>
      <el-table-column prop="customParams" header-align="center" align="center" width="150" label="自定义参数"/>
      <el-table-column header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="addOrUpdateHandle(scope.row, 'edit')"></el-button>
          </el-tooltip>
					     <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button type="success" size="mini" icon="el-icon-view" circle @click="addOrUpdateHandle(scope.row, 'view')"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
           <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteddialog(scope.row.id)"></el-button>
          </el-tooltip>
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
    </el-dialog>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="init" />
     <!-- 弹窗, 查看 -->
    <!-- <look v-if="lookVisible" ref="look" @refreshDataList="init" /> -->
    
  </div>
</template>

<script>
  import { getProgressConfigList, getChannel, deleteSmartFlow } from '@/api/dataAnalysis/sourceBinding'
  import { dataTransferManageKafka } from '@/api/dataAnalysis/dataTransferManage'
  import AddOrUpdate from './processConfig-add-or-update'
  // import Look from './taskFlow-look'

  export default {
    data () {
      return {
        visible: false,
        dataList: [],
        channelList: [],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalCount: 0,
        dataForm: {
          channelCode: '',
          type: ''
        },
        addOrUpdateVisible: false,
        dataListLoading: false,
        deletedId: '',
        deleteVisible: false,
        lookVisible: false,
        canUpdate: [],
        typeList: [
          {lable: '短信', value: 'sms'},
          {lable: '电销', value: 'tel'},
          {lable: 'AI', value: 'ai'},
          {lable: 'Push', value: 'push'}
        ]
      }
    },
    components: {
      AddOrUpdate
      // Look
    },
    mounted () {
      this.getChannelsList()
      this.getDatasourceList()
    },
    methods: {
      init () {
        this.visible = true
        const dataBody = {
          'pageNum': this.pageNum,
          'pageSize': this.pageSize,
          'channelCode': this.dataForm.channelCode,
          'type': this.dataForm.type
        }
        this.$nextTick(() => {
          getProgressConfigList(dataBody).then(({data}) => {
            this.dataListLoading = true
            if (!data || (data && (data.status !== '1' || !data.data))) {
            this.dataList = []
            this.totalCount = 0
          } else {
            data.data.list.map(item => {
              this.channelList.forEach(citem => {
                if (item.channelCode === citem.value) {
                  item.channelCode = citem.text
                }
              })
              item.params = item.params.split(',').join('\n')
              if (this.datasourceList.length) {
                item.target = this.datasourceList.filter(citem => citem.id === item.datasourceId)[0].name
                console.log('this.datasourceList: ', this.datasourceList)
              }
            })
            this.dataList = data.data.list
            this.totalCount = data.data.totalCount
          }
            this.dataListLoading = false
          })
        })
      },
      getDatasourceList () {
        let params = {
          type: 'kafka'
        }
        dataTransferManageKafka(params).then(({data}) => {
          if (data && data.status === '1') {
            this.datasourceList = data.data
          }
      })
    },
      getChannelsList () {
        getChannel().then(res => {
          if (res.data.status * 1 !== 1) {
            this.channelList = []
            return
          }
          this.channelList = res.data.data.map(item => {
            if (item.value === '0000') {
              item.disabled = true
            } else {
              item.disabled = false
            }
            return item
          })
          this.init()
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (row, tag) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row, tag)
        })
      },
      // 删除弹窗获取值
      deleteddialog (value) {
        this.$confirm(`确认删除ID为【${value}】的数据?`, '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSmartFlow(value).then(({data}) => {
            if (data && data.status === '1') {
              this.init()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      searchHandle () {
        this.pageNum = 1
        this.init()
      },
      resetHandle () {
        this.pageNum = 1
        this.dataForm = {
          channelCode: '',
          type: ''
        }
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNum = 1
        this.init()
      },
      // 下一页
      currentChangeHandle (val) {
        this.pageNum = val
        this.init()
      }
    }
  }
</script>
<style scoped>
  .el-button+.el-button{
    margin: 0 !important;
  }
  .el-table .cell{
    white-space: pre-line;
  }
</style>
