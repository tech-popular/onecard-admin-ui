import {
  list,
  deleted,
  implement
} from '@/api/lexicon/cacheCleanup'
export const models = {
  data() {
    let type = [{
      label: '全部',
      value: 1
    }, {
      label: '采集任务',
      value: 2
    }, {
      label: '计算任务',
      value: 3
    }, {
      label: '同步任务',
      value: 4
    }]
    let typeProps = {
      label: 'label',
      value: 'value'
    }
    let status = [{
      label: '全部',
      value: 1
    }, {
      label: '启用',
      value: 2
    }, {
      label: '停用',
      value: 3
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
      computAddOrUpdateVisible: false,
      snapshot: 'http://dss.9fbank.com:8091/task/depency?etlJobId=01165352627912917264&etlJobName=me_dlv_db_clearingExt_t_deduct_discint_trade_info&etlJobStatus=Done&isUser=true',
      editSnapshot: 'http://dss.9fbank.com:8091/depend/list?etlJobId=01165352627912917264&etlJobName=me_dlv_db_clearingExt_t_deduct_discint_trade_info&etlSystemCode=12&serverGroupId=e85ee394c572477cab12ecdf8ee5629b',
      // 操作按钮
      operates: [{
          id: 1,
          label: '编辑任务',
          type: 'primary',
          method: (id) => {
            this.addOrUpdateHandle(id)
          }
        },
        // {
        //   id: 2,
        //   label: '调度配置',
        //   type: 'success',
        //   method: (id) => {
        //     this.addOrUpdateHandle(id)
        //   }
        // },
        {
          id: 3,
          label: '依赖快照',
          type: 'info',
          method: (snapshot) => {
            this.snapshotHandle(snapshot)
          }
        },
        {
          id: 4,
          label: '编辑依赖',
          type: 'warning',
          method: (editSnapshot) => {
            this.editSnapshotHandle(editSnapshot)
          }
        },
        {
          id: 5,
          label: '删除',
          type: 'danger',
          method: (id) => {
            this.deleteHandle(id)
          }
        }
      ],
      columns: [{
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
              props: {
                type: params.row.cacheType === 0 ? '' : 'warning'
              } // 组件的props
            }, params.row.cacheType === 0 ? 'EhCahe' : 'redis')
          }
        },
        {
          prop: 'lastUpdateTime',
          label: '任务创建时间',
          align: 'center'
        },
        {
          prop: 'createUser',
          label: '创建人',
          align: 'center'
        },
        {
          prop: 'flag',
          label: '调度起停状态',
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {
                type: params.row.flag === 1 ? '' : 'warning'
              } // 组件的props
            }, params.row.flag === 1 ? '需要' : '不需要')
          }
        },
        {
          prop: 'lastUpdateTime',
          label: '有无依赖',
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
      searchForm: [{
          type: 'Input',
          label: '任务ID',
          prop: 'id',
          width: '300px',
          placeholder: '任务ID'
        },
        {
          type: 'Input',
          label: '任务名称',
          prop: 'name',
          width: '300px',
          placeholder: '请输入名称'
        },
        {
          type: 'Select',
          label: '任务类型',
          prop: 'type',
          width: '300px',
          options: type,
          props: typeProps,
          change: row => '',
          placeholder: '请选择任务类型'
        },
        {
          type: 'Input',
          label: '创建人',
          prop: 'user',
          width: '300px',
          placeholder: '创建人'
        },
        {
          type: 'Select',
          label: '起停状态',
          prop: 'status',
          width: '300px',
          options: status,
          props: statusProps,
          change: row => '',
          placeholder: '请选择起停状态'
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
        },
        // {label: '新增采集任务', type: 'primary', handle: () => { this.addOrUpdateHandle() }},
        {
          label: '新增同步任务',
          type: 'warning',
          handle: () => {
            this.addOrUpdateHandle()
          }
        },
        {
          label: '新增计算任务',
          type: 'info',
          handle: () => {
            this.computAddOrUpdateHandle()
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
        'type': this.searchData.type,
        'user': this.searchData.user,
        'status': this.searchData.status
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
    // 新增 / 修改同步任务
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 新增 / 修改计算任务
    computAddOrUpdateHandle(id) {
      this.computAddOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.computAddOrUpdate.init(id)
      })
    },
    // 依赖快照
    snapshotHandle(url) {
      window.open(url, '_blank')
    },
    // 编辑依赖
    editSnapshotHandle(url) {
      window.open(url, '_blank')
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
    },
    // 执行接口
    implementHandle(val) {
      this.$confirm(`确定执行操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (val.flag === 1) {
          this.$prompt('请输入缓存key', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({
            value
          }) => {
            const dataBody = {
              'id': val.id,
              'suffixKey': value
            }
            implement(dataBody).then(({
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
        } else {
          const dataBody = {
            'id': val.id
          }
          implement(dataBody).then(({
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
        }
      })
    }
  }
}
