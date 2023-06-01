import { taskBatchList, projectAll, taskBatchStatus } from '@/api/dispatch/taskManag'
export const models = {
  data () {
    let type = [{label: '全部', value: '-1'}, {label: 'Trino', value: 'Trino'}, {label: 'DBT', value: 'DBT'}]
    // let status = [{label: '全部', value: '-1'}, {label: '执行中', value: 'RUNNING'}, {label: '执行完成', value: 'COMPLETED'}, {label: '执行失败', value: 'FAILURE'}]
    let defaultProps = { label: 'label', value: 'value' }
    // let projectProps = { label: 'projectSystemName', value: 'id' }
    let statusProps = { label: 'desc', value: 'code' }
    return {
      props: {
        multiple: false,
        checkStrictly: true,
        label: 'sceneName',
        value: 'sceneType',
        children: ''
      },
      allSystemList: [],
      allStatusList: [],
      pageNum: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      viewLogVisible: false,
      viewYarnLogVisible: false,
      // 操作按钮
      operatesWidth: '220px',
      operates: [
        {
          id: 1,
          label: '查看日志',
          type: 'primary',
          method: (row) => {
            this.implementHandle(row)
          }
        }
        // {
        //   id: 2,
        //   label: '依赖快照',
        //   type: 'success',
        //   method: (id) => {
        //     this.addOrUpdateHandle(id)
        //   }
        // },
        // {
        //   id: 3,
        //   label: '执行测试',
        //   type: 'warning',
        //   method: (id) => {
        //     this.addOrUpdateHandle(id)
        //   }
        // },
        // {
        //   id: 4,
        //   label: '立即执行',
        //   type: 'warning',
        //   method: (id) => {
        //     this.addOrUpdateHandle(id)
        //   }
        // },
        // {
        //   id: 5,
        //   label: '杀死任务',
        //   type: 'info',
        //   method: (id) => {
        //     this.addOrUpdateHandle(id)
        //   }
        // },
        // {
        //   id: 6,
        //   label: '耗时统计',
        //   type: 'danger',
        //   method: (id) => {
        //     this.deleteHandle(id)
        //   }
        // }
      ],
      columns: [
        {
          prop: 'dolphinInstanceId',
          label: '任务批次',
          align: 'center'
        },
        {
          prop: 'taskId',
          label: '任务ID',
          width: '80px',
          align: 'center'
        },
        {
          prop: 'taskName',
          label: '任务名称',
          align: 'center'
        },
        {
          prop: 'taskType',
          label: '任务类型',
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {
                type: params.row.taskType === 'Trino' ? '' : 'warning'
              } // 组件的props
            }, params.row.taskType === 'Trino' ? 'Trino' : 'DBT')
          }
        },
        {
          prop: 'runningTime',
          label: '运行时长',
          align: 'center'
        },
        {
          prop: 'execStartTime',
          label: '执行开始时间',
          align: 'center'
        },
        {
          prop: 'execEndTime',
          label: '执行结束时间',
          align: 'center'
        },
        {
          prop: 'runStatus',
          label: '任务状态',
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {
                type: params.row.runStatus === '执行失败' ? 'danger' : ''
              } // 组件的props
            }, params.row.runStatus)
          }
        },
        // {
        //   prop: 'dispatchLeader',
        //   label: '调度负责人',
        //   align: 'center'
        // },
        {
          prop: 'workerIp',
          label: '执行机器',
          align: 'center'
        }
      ],
      list: [],
      searchData: {
        taskName: '',
        taskId: '',
        taskType: '-1',
        // dispatchLeader: '',
        // projectId: '-1',
        runStatus: '-1'
      },
      searchForm: [
        {type: 'Input', label: '任务ID', prop: 'taskId', width: '300px', placeholder: '任务ID'},
        {type: 'Input', label: '任务名称', prop: 'taskName', width: '300px', placeholder: '请输入名称'},
        {type: 'Select', label: '任务类型', prop: 'taskType', width: '300px', options: type, props: defaultProps, change: row => '', placeholder: '请选择任务类型'},
        // {type: 'Input', label: '调度负责人', prop: 'dispatchLeader', width: '300px', placeholder: '创建人'},
        // {type: 'Select', label: '所属项目/平台', prop: 'projectId', width: '300px', options: projectProps, props: projectProps, change: row => '', placeholder: '请选择起停状态'},
        {type: 'Select', label: '任务状态', prop: 'runStatus', width: '300px', options: statusProps, props: statusProps, change: row => '', placeholder: '请选择起停状态'}
      ],
      searchHandle: [
        {label: '查询', type: 'primary', handle: () => { this.handleSearch() }},
        // {label: 'Yarn日志查询', type: 'primary', handle: () => { this.handleLogSearch() }},
        {label: '重置', type: '', handle: () => { this.resetHandle() }}
      ]
    }
  },
  created() {
    // this.getAllSystem()
    this.getAllStatus()
  },
  mounted () {
    if (this.$route.query.name) {
      this.searchData.taskName = this.$route.query.name
    }
    this.init()
  },
  watch: {
    '$route.query.name' (val) {
      this.searchData.taskName = val
      this.init()
    }
  },
  methods: {
    init () {
      const dataBody = {
        'pageIndex': this.pageNum,
        'pageSize': this.pageSize,
        'taskId': this.searchData.taskId,
        'taskName': this.searchData.taskName,
        'taskType': this.searchData.taskType === '-1' ? '' : this.searchData.taskType,
        // 'dispatchLeader': this.searchData.dispatchLeader,
        // 'projectId': this.searchData.projectId === '-1' ? '' : this.searchData.projectId,
        'runStatus': this.searchData.runStatus === '-1' ? '' : this.searchData.runStatus
      }
      this.getList(dataBody)
    },
    getAllSystem () {
      projectAll().then(({data}) => {
        this.allSystemList = [ { projectSystemName: '全部', id: '-1' }, ...data.data ]
        let curIndex = this.searchForm.findIndex(item => item.prop === 'projectId')
        this.searchForm.splice(curIndex, 1, { ...this.searchForm[curIndex], options: this.allSystemList })
        // console.log(this.searchForm, this.allSystemList)
      })
    },
    getAllStatus () {
      taskBatchStatus().then(({data}) => {
        this.allStatusList = [ { desc: '全部', code: '-1' }, ...data.data ]
        let curIndex = this.searchForm.findIndex(item => item.prop === 'runStatus')
        this.searchForm.splice(curIndex, 1, { ...this.searchForm[curIndex], options: this.allStatusList })
      })
    },
    // 查询
    handleSearch () {
      this.pageNum = 1
      this.init()
    },
    // 重置
    resetHandle () {
      this.pageNum = 1
      this.searchData = {
        taskId: '',
        taskName: '',
        taskType: '-1',
        // dispatchLeader: '',
        // projectId: '-1',
        runStatus: '-1'
      }
      this.init()
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.init()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageNum = val
      this.init()
    },
    // 列表接口
    getList (dataBody) {
      this.dataListLoading = true
      taskBatchList(dataBody).then(({data}) => {
        if (data && data.code === 0) {
          this.dataListLoading = false
          this.list = data.data.records
          this.totalPage = data.data.total
        } else {
          this.list = []
          this.totalPage = 0
          this.$message.error(data.msg)
        }
      })
    },
    // 查看日志
    implementHandle (row) {
      this.viewLogVisible = true
      this.$nextTick(() => {
        this.$refs.viewLog.init(row.dolphinInstanceId)
      })
    },
    // Yarn日志查询
    handleLogSearch () {
      this.viewYarnLogVisible = true
      this.$nextTick(() => {
        this.$refs.viewYarnLog.init()
      })
    }
  }
}
