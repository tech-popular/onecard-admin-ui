import { list } from '@/api/lexicon/cacheCleanup'
export const models = {
  data () {
    let type = [{label: '全部', value: 1}, {label: '采集任务', value: 2}, {label: '计算任务', value: 3}, {label: '同步任务', value: 4}]
    let typeProps = {label: 'label', value: 'value'}
    let status = [{label: '全部', value: 1}, {label: '启用', value: 2}, {label: '停用', value: 3}]
    let statusProps = {label: 'label', value: 'value'}
    return {
      props: {
        multiple: false,
        checkStrictly: true,
        label: 'sceneName',
        value: 'sceneType',
        children: ''
      },
      pageNum: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      // 操作按钮
      operates: [
        {
          id: 1,
          label: '查看日志',
          type: 'primary',
          method: (id) => {
            this.implementHandle(id)
          }
        },
        {
          id: 2,
          label: '依赖快照',
          type: 'success',
          method: (id) => {
            this.addOrUpdateHandle(id)
          }
        },
        {
          id: 3,
          label: '执行测试',
          type: 'warning',
          method: (id) => {
            this.addOrUpdateHandle(id)
          }
        },
        {
          id: 4,
          label: '立即执行',
          type: 'warning',
          method: (id) => {
            this.addOrUpdateHandle(id)
          }
        },
        {
          id: 5,
          label: '杀死任务',
          type: 'warning',
          method: (id) => {
            this.addOrUpdateHandle(id)
          }
        },
        {
          id: 6,
          label: '耗时统计',
          type: 'danger',
          method: (id) => {
            this.deleteHandle(id)
          }
        }
      ],
      columns: [
        {
          prop: 'id',
          label: '任务ID',
          align: 'center'
        },
        {
          prop: 'cacheName',
          label: '任务名称',
          align: 'center'
        },
        {
          prop: 'cacheType',
          label: '任务类型',
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {type: params.row.cacheType === 0 ? '' : 'warning'} // 组件的props
            }, params.row.cacheType === 0 ? 'EhCahe' : 'redis')
          }
        },
        {
          prop: 'cacheName',
          label: '任务批次',
          align: 'center'
        },
        {
          prop: 'lastUpdateTime',
          label: '执行开始时间',
          align: 'center'
        },
        {
          prop: 'lastUpdateTime',
          label: '执行结束时间',
          align: 'center'
        },
        {
          prop: 'lastUpdateTime',
          label: '任务创建时间',
          align: 'center'
        },
        {
          prop: 'flag',
          label: '任务状态',
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {type: params.row.flag === 1 ? '' : 'warning'} // 组件的props
            }, params.row.flag === 1 ? '需要' : '不需要')
          }
        },
        {
          prop: 'lastUpdateTime',
          label: '预计下次执行时间',
          align: 'center'
        },
        {
          prop: 'createUser',
          label: '调度负责人人',
          align: 'center'
        },
        {
          prop: 'lastUpdateTime',
          label: '触发机器',
          align: 'center'
        },
        {
          prop: 'lastUpdateTime',
          label: '触发机器',
          align: 'center'
        },
        {
          prop: 'lastUpdateTime',
          label: '日志ID',
          align: 'center'
        }
      ],
      list: [],
      searchData: {
        name: null,
        id: null,
        type: null,
        user: null,
        status: null
      },
      searchForm: [
        {type: 'Input', label: '任务ID', prop: 'id', width: '300px', placeholder: '任务ID'},
        {type: 'Input', label: '任务名称', prop: 'name', width: '300px', placeholder: '请输入名称'},
        {type: 'Select', label: '任务类型', prop: 'type', width: '300px', options: type, props: typeProps, change: row => '', placeholder: '请选择任务类型'},
        {type: 'Input', label: '调度负责人', prop: 'user', width: '300px', placeholder: '创建人'},
        {type: 'Select', label: '所属项目/平台', prop: 'status', width: '300px', options: status, props: statusProps, change: row => '', placeholder: '请选择起停状态'},
        {type: 'Select', label: '任务状态', prop: 'status', width: '300px', options: status, props: statusProps, change: row => '', placeholder: '请选择起停状态'}
      ],
      searchHandle: [
        {label: '查询', type: 'primary', handle: () => { this.handleSearch() }},
        {label: '重置', type: '', handle: () => { this.resetHandle() }}
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const dataBody = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize,
        'id': this.searchData.id,
        'name': this.searchData.name,
        'type': this.searchData.type,
        'user': this.searchData.user,
        'status': this.searchData.status
      }
      this.getList(dataBody)
    },
    // 查询
    handleSearch () {
      this.pageNum = 1
      this.init()
    },
    // 重置
    resetHandle () {
      this.pageNum = 1
      this.searchData = {}
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
      list(dataBody).then(({data}) => {
        if (data && data.code === 0) {
          this.dataListLoading = false
          this.list = data.data.list
          this.totalPage = data.data.totalCount
        } else {
          this.list = []
          this.totalPage = 0
          this.$message.error(data.msg)
        }
      })
    }
  }
}
