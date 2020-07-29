import { list, deleted } from '@/api/lexicon/cacheCleanup'
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
          label: '编辑',
          type: 'primary',
          method: (id) => {
            this.addOrUpdateHandle(id)
          }
        },
        {
          id: 2,
          label: '删除',
          type: 'danger',
          method: (id) => {
            this.deleteHandle(id)
          }
        }
      ],
      columns: [
        {
          prop: 'id',
          label: '数据源ID',
          align: 'center'
        },
        {
          prop: 'cacheName',
          label: '数据源名称',
          align: 'center'
        },
        {
          prop: 'cacheName',
          label: '服务器地址',
          align: 'center'
        },
        {
          prop: 'cacheName',
          label: '数据库名称',
          align: 'center'
        },
        {
          prop: 'cacheName',
          label: '数据源类型',
          align: 'center'
        },
        {
          prop: 'createUser',
          label: '创建人',
          align: 'center'
        },
        {
          prop: 'lastUpdateTime',
          label: '任务创建时间',
          align: 'center'
        },
        {
          prop: 'flag',
          label: '状态',
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {type: params.row.flag === 1 ? '' : 'warning'} // 组件的props
            }, params.row.flag === 1 ? '需要' : '不需要')
          }
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
        {type: 'Input', label: '数据源名称', prop: 'name', width: '300px', placeholder: '请输入名称'},
        {type: 'Input', label: '服务器地址', prop: 'name', width: '300px', placeholder: '请输入名称'},
        {type: 'Input', label: '数据库名称', prop: 'name', width: '300px', placeholder: '请输入名称'},
        {type: 'Select', label: '数据源类型', prop: 'type', width: '300px', options: type, props: typeProps, change: row => '', placeholder: '请选择数据源类型'},
        {type: 'Select', label: '状态', prop: 'status', width: '300px', options: status, props: statusProps, change: row => '', placeholder: '请选择状态'}
      ],
      searchHandle: [
        {label: '查询', type: 'primary', handle: () => { this.handleSearch() }},
        {label: '重置', type: '', handle: () => { this.resetHandle() }},
        {label: '新增', type: 'primary', handle: () => { this.addOrUpdateHandle() }}
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
