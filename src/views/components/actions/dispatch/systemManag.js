import { list } from '@/api/dispatch/systemManag'
export const models = {
  data () {
    let status = [{label: '全部', value: -1}, {label: '有效', value: 1}, {label: '无效', value: 0}]
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
        }
      ],
      columns: [
        {
          prop: 'id',
          label: '系统ID',
          align: 'center'
        },
        {
          prop: 'projectSystemName',
          label: '系统名称',
          align: 'center'
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
          prop: 'projectDisable',
          label: '状态',
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {type: params.row.projectDisable === 1 ? '' : 'warning'} // 组件的props
            }, params.row.projectDisable === 1 ? '有效' : '无效')
          }
        }
      ],
      list: [],
      searchData: {
        name: '',
        id: null,
        type: null,
        user: null,
        status: -1
      },
      searchForm: [
        {type: 'Input', label: '系统名称', prop: 'name', width: '300px', placeholder: '请输入名称'},
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
        'name': this.searchData.name,
        'disable': this.searchData.status === -1 ? '' : this.searchData.status
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
    }
  }
}
