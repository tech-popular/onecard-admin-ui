import { list, deleted } from '@/api/lexicon/cacheCleanup'
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
      operates: [
        {
          id: 1,
          label: '查看',
          type: 'success',
          isShow: (id) => {
            return id.flag === 0
          },
          method: (id) => {
            this.addOrUpdateHandle(id)
          }
        },
        {
          id: 2,
          label: '编辑',
          type: 'success',
          isShow: (id) => {
            return id.flag === 1
          },
          method: (id) => {
            this.addOrUpdateHandle(id)
          }
        },
        {
          id: 2,
          label: '启用',
          type: 'danger',
          isShow: (id) => {
            return id.flag === 0
          },
          method: (id) => {
            this.deleteHandle(id)
          }
        },
        {
          id: 2,
          label: '停用',
          type: 'danger',
          isShow: (id) => {
            return id.flag === 1
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
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {type: params.row.cacheType === 0 ? '' : 'warning'} // 组件的props
            }, params.row.cacheType === 0 ? 'EhCahe' : 'redis')
          }
        },
        {
          prop: 'startTime',
          label: '任务启用时间',
          align: 'center'
        },
        {
          prop: 'endTime',
          label: '任务停用时间',
          align: 'center'
        }
      ],
      list: [],
      searchData: {
        id: '',
        name: ''
      },
      searchForm: [
        {type: 'Input', label: '任务ID', prop: 'id', width: '180px', placeholder: '请输入任务ID'},
        {type: 'Input', label: '任务名称', prop: 'name', width: '180px', placeholder: '请输入任务名称'}
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
        'pageSize': this.pageSize
      }
      this.getList(dataBody)
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
    },
    // 删除接口
    deleteHandle (id) {
      const dataBody = {'id': id.id}
      this.$confirm(`确定删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleted(dataBody).then(({data}) => {
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
