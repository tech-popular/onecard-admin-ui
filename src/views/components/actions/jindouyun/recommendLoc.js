import { getProInfo } from '@/api/jindouyun/recommendLoc'
export const models = {
  data () {
    return {
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
      this.getList()
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
        console.log(data)
        if (data && data.status === '1') {
          this.dataListLoading = false
          this.list = data.data
          this.list.map(item => item.product_status === 'on')
        } else {
          this.list = []
          this.totalPage = 0
          this.$message.error(data.msg)
        }
      })
    }
  }
}
