import { getProInfo, syncTaskInfo } from '@/api/jindouyun/recommendLoc'
export const models = {
  data () {
    return {
      dataListLoading: false,
      operates: [],
      columns: [
        {
          prop: 'index',
          label: '排序',
          align: 'center'
        },
        {
          prop: 'product_id',
          label: '产品编号',
          align: 'center'
        },
        {
          prop: 'product_channel_name',
          label: '产品名称',
          align: 'center'
        },
        {
          prop: 'product_type',
          label: '产品类型',
          align: 'center',
          render(h, params) {
            return h('span', params.row.product_type === '1' ? '同业' : '异业')
          }
        },
        {
          prop: 'prodct_access_mode',
          label: '接入模式',
          align: 'center',
          render(h, params) {
            return h('span', params.row.prodct_access_mode === '1' ? 'h5' : '联合登陆')
          }
        },
        {
          prop: 'product_settle_mode',
          label: '结算模式',
          align: 'center'
        }
      ],
      searchData: {},
      searchForm: [],
      searchHandle: [
        {label: '刷新', type: 'primary', handle: () => { this.init() }},
        {label: '同步任务', type: 'warning', handle: () => { this.syncTak() }}
      ],
      list: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getList()
    },
    syncTak () {
      syncTaskInfo().then(({data}) => {
        if (data && data.status === '1') {
          this.$message.success(data.message)
        } else {
          this.$message.error(data.message || '同步失败')
        }
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
    getList () {
      this.dataListLoading = true
      getProInfo().then(({data}) => {
        if (data && data.status === '1') {
          this.dataListLoading = false
          this.list = data.data.filter(item => item.product_status === 'on')
          this.list.forEach((item, index) => {
            item.index = index + 1
          })
        } else {
          this.list = []
          this.totalPage = 0
          this.$message.error(data.message)
        }
      })
    }
  }
}
