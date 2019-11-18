<template>
  <div>
    <el-dialog title="数据关系" :close-on-click-modal="false" :visible.sync="visible">
    <el-button type="primary" style="margin-bottom: 15px;" @click="addOrUpdateHandle()">新增</el-button>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
        <el-table-column prop="flowId" header-align="center" align="center" label="工作流ID"/>
        <el-table-column prop="id" header-align="center" align="center" label="任务名称"/>
        <el-table-column prop="name" header-align="center" align="center" label="参考数据"/>
        <el-table-column prop="owner" header-align="center" align="center" label="父级ID"/>
        <el-table-column prop="user" header-align="center" align="center" label="任务ID"/>
        <el-table-column prop="description" header-align="center" align="center" label="备注"/>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"/>
      <span slot="footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
  import { getUpdateWorkFlow } from '@/api/workerBee/workFlow'
  import AddOrUpdate from './taskFlow-add-or-update'

  export default {
    data () {
      return {
        visible: false,
        dataList: [
          {
            flowId: 1,
            id: '10001',
            name: '工作流1',
            owner: 'lvzhiming',
            user: '万卡',
            inputParameters: '工作流入参',
            description: '成功'
          },
          {
            flowId: 2,
            id: '10002',
            name: '工作流2',
            owner: 'Hrbp',
            user: '万卡',
            inputParameters: '工作流入参',
            description: '失败'
          }
        ],
        pageNum: 1, // 当前页
        pageSize: 10, // 默认每页10条
        totalPage: 0,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    methods: {
      init (id) {
        console.log(id, 'youel')
        this.visible = true
<<<<<<< HEAD
=======
        this.flowId = this.$store.state.workFlow.id
        const dataBody = {
          'pageNum': this.pageNum,
          'pageSize': this.pageSize,
          'flowId': this.flowId
        }
>>>>>>> 034cbc4f07ad6421347951b9eedf5662caa8dfe2
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            const dataBody = id
            getUpdateWorkFlow(dataBody).then(({data}) => {
              if (data && data.code === 0) {
  
              }
            })
          }
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNum = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNum = val
        this.getDataList()
      }
    }
  }
</script>
