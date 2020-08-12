import {
  list,
  deleted
} from '@/api/dispatch/dataSource'
export const models = {
  data() {
    let type = [{
      label: '全部',
      value: '-1'
    }, {
      label: '计算任务',
      value: 'CALCULATE'
    }, {
      label: '同步任务',
      value: 'ACQUISITION'
    }]
    let typeProps = {
      label: 'label',
      value: 'value'
    }
    let status = [{
      label: '全部',
      value: '-1'
    }, {
      label: '有效',
      value: 0
    }, {
      label: '无效',
      value: 1
    }]
    let statusProps = {
      label: 'label',
      value: 'value'
    }
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
      operates: [{
        id: 1,
        label: '编辑',
        type: 'primary',
        method: (id) => {
          this.addOrUpdateHandle(id)
        }
      }],
      columns: [{
          prop: 'id',
          label: '数据源ID',
          align: 'center'
        },
        {
          prop: 'dataSourceName',
          label: '数据源名称',
          align: 'center'
        },
        {
          prop: 'dataSourceIp',
          label: '服务器地址',
          align: 'center'
        },
        {
          prop: 'dataSourceName',
          label: '数据库名称',
          align: 'center'
        },
        {
          prop: 'dataSourceType',
          label: '数据源类型',
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {
                type: params.row.dataSourceType === 'CALCULATE' ? '' : 'warning'
              } // 组件的props
            }, params.row.dataSourceType === 'CALCULATE' ? '计算任务' : '同步任务')
          }
        },
        {
          prop: 'createUser',
          label: '创建人',
          align: 'center'
        },
        {
          prop: 'createTime',
          label: '任务创建时间',
          align: 'center'
        },
        {
          prop: 'dataSourceDisable',
          label: '状态',
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {
                type: params.row.dataSourceDisable === '0' ? '' : 'warning'
              } // 组件的props
            }, params.row.dataSourceDisable === '0' ? '有效' : '无效')
          }
        }
      ],
      list: [],
      searchData: {
        name: '',
        ip: '',
        database: '',
        type: '-1',
        disable: '-1'
      },
      searchForm: [{
          type: 'Input',
          label: '数据源名称',
          prop: 'name',
          width: '300px',
          placeholder: '请输入名称'
        },
        {
          type: 'Input',
          label: '服务器地址',
          prop: 'ip',
          width: '300px',
          placeholder: '请输入服务器地址'
        },
        {
          type: 'Input',
          label: '数据库名称',
          prop: 'database',
          width: '300px',
          placeholder: '请输入数据库名称'
        },
        {
          type: 'Select',
          label: '数据源类型',
          prop: 'type',
          width: '300px',
          default: '-1',
          options: type,
          props: typeProps,
          change: row => '',
          placeholder: '请选择数据源类型'
        },
        {
          type: 'Select',
          label: '状态',
          prop: 'disable',
          width: '300px',
          options: status,
          default: '-1',
          props: statusProps,
          change: row => '',
          placeholder: '请选择状态'
        }
      ],
      searchHandle: [{
          label: '查询',
          type: 'primary',
          handle: () => {
            this.handleSearch()
          }
        },
        {
          label: '重置',
          type: '',
          handle: () => {
            this.resetHandle()
          }
        }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const dataBody = {
        'pageNum': this.pageNum,
        'pageSize': this.pageSize,
        'id': this.searchData.id,
        'name': this.searchData.name,
        'ip': this.searchData.ip,
        'database': this.searchData.database,
        'type': this.searchData.type === '-1' ? '' : this.searchData.type,
        'disable': this.searchData.disable === '-1' ? '' : this.searchData.disable
      }
      this.getList(dataBody)
    },
    // 查询
    handleSearch() {
      this.pageNum = 1
      this.init()
    },
    // 重置
    resetHandle() {
      this.pageNum = 1
      this.searchData = {}
      this.init()
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id.id)
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.init()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageNum = val
      this.init()
    },
    // 列表接口
    getList(dataBody) {
      this.dataListLoading = true
      list(dataBody).then(({
        data
      }) => {
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
    },
    // 删除接口
    deleteHandle(id) {
      const dataBody = {
        'id': id.id
      }
      this.$confirm(`确定删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleted(dataBody).then(({
          data
        }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                const dataBody = {
                  'pageNum': this.pageNum,
                  'pageSize': this.pageSize
                }
                this.getList(dataBody)
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    }
  }
}
