import { jdyList, jdyDelete, jdyTaskOn, jdyTaskOff } from '@/api/jindouyun/recommendLocConfig'
export const models = {
  data () {
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
      operatesWidth: '300px',
      operates: [
        // {
        //   id: 1,
        //   label: '查看',
        //   type: 'default',
        //   isShow: (id) => {
        //     return id.status === true
        //   },
        //   method: (id) => {
        //     this.addOrUpdateHandle(id, 'view')
        //   }
        // },
        {
          id: 2,
          label: '编辑',
          type: 'primary',
          isShow: (id) => {
            return true
          },
          method: (id) => {
            this.addOrUpdateHandle(id, 'edit')
          }
        },
        {
          id: 2,
          label: '启用',
          type: 'success',
          isShow: (id) => {
            return id.status === false
          },
          method: (id) => {
            this.taskOnHandle(id)
          }
        },
        {
          id: 2,
          label: '停用',
          type: 'warning',
          isShow: (id) => {
            return id.status === true
          },
          method: (id) => {
            this.taskOffHandle(id)
          }
        },
        {
          id: 3,
          label: '删除',
          type: 'danger',
          isShow: (id) => {
            return id.status === false
          },
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
          prop: 'name',
          label: '任务名称',
          align: 'center'
        },
        {
          prop: 'creator',
          label: '任务创建人',
          align: 'center'
        },
        {
          prop: 'create_time',
          label: '任务创建时间',
          align: 'center'
        },
        {
          prop: 'start_time',
          label: '任务启用时间',
          align: 'center'
        },
        {
          prop: 'end_time',
          label: '任务停用时间',
          align: 'center'
        }
      ],
      list: [],
      searchData: {
        recommendTaskId: '',
        recommendTaskName: ''
      },
      searchForm: [
        {type: 'Input', label: '任务ID', prop: 'recommendTaskId', width: '180px', placeholder: '请输入任务ID'},
        {type: 'Input', label: '任务名称', prop: 'recommendTaskName', width: '180px', placeholder: '请输入任务名称'}
      ],
      searchHandle: [
        {label: '查询', type: 'primary', handle: () => { this.handleSearch() }},
        {label: '重置', type: '', handle: () => { this.resetHandle() }},
        {label: '新增', type: 'success', handle: () => { this.addOrUpdateHandle() }}
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
        ...this.searchData
      }
      this.getList(dataBody)
    },
    // 新增 / 修改
    addOrUpdateHandle (id, tag) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, tag)
      })
    },
    handleSearch () {
      this.init()
    },
    resetHandle () {
      this.searchData = {
        recommendTaskId: '',
        recommendTaskName: ''
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
      jdyList(dataBody).then(({data}) => {
        if (data && data.status * 1 === 1) {
          this.dataListLoading = false
          this.list = data.data.rows
          this.totalPage = data.data.totalCount
        } else {
          this.list = []
          this.totalPage = 0
          this.$message.error(data.message)
        }
      })
    },
    // 删除接口
    deleteHandle (id) {
      this.$confirm(`确定删除任务【${id.name}】?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        jdyDelete([id.id]).then(({data}) => {
          if (data && data.status === '1') {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.init()
              }
            })
          } else {
            this.$message.error(data.message)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    taskOffHandle (id) {
      this.$confirm(`确定停用任务【${id.name}】?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        jdyTaskOff(id.id).then(({data}) => {
          if (data && data.status === '1') {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.init()
              }
            })
          } else {
            this.$message.error(data.message)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    taskOnHandle (id) {
      this.$confirm(`确定启用任务【${id.name}】?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        jdyTaskOn(id.id).then(({data}) => {
          if (data && data.status === '1') {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.init()
              }
            })
          } else {
            this.$message.error(data.message)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    }
  }
}
