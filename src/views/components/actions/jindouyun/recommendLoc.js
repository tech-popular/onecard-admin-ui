import { list } from '@/api/lexicon/cacheCleanup'
export const models = {
  data () {
    return {
      pageNum: 1, // 当前页
      pageSize: 10, // 默认每页10条
      totalPage: 0,
      dataListLoading: false,
      operates: [],
      columns: [
        {
          prop: 'id',
          label: '排序',
          align: 'center'
        },
        {
          prop: 'productId',
          label: '产品编号',
          align: 'center'
        },
        {
          prop: 'productName',
          label: '产品名称',
          align: 'center'
        },
        {
          prop: 'productType',
          label: '产品类型',
          align: 'center'
        },
        {
          prop: 'lastUpdateTime',
          label: '接入模式',
          align: 'center'
        },
        {
          prop: 'createUser',
          label: '结算模式',
          align: 'center'
        }
      ],
      list: []
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
