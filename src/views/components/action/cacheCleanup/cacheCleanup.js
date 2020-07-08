import { list, deleted, implement } from '@/api/lexicon/cacheCleanup'
export const models = {
  data () {
    // let sexs = [{label: '男', value: 'M'}, {label: '女', value: 'F'}]
    // let sexProps = {label: 'label', value: 'value'}
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
          label: '执行',
          type: 'primary',
          method: (id) => {
            this.implementHandle(id)
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
          label: 'ID',
          align: 'center'
        },
        {
          prop: 'cacheName',
          label: '名称',
          align: 'center'
        },
        {
          prop: 'cacheType',
          label: '清除类型',
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {type: params.row.cacheType === 0 ? '' : 'warning'} // 组件的props
            }, params.row.cacheType === 0 ? 'EhCahe' : 'redis')
          }
        },
        {
          prop: 'flag',
          label: '是否缓存key',
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {type: params.row.flag === 1 ? '' : 'warning'} // 组件的props
            }, params.row.flag === 1 ? '需要' : '不需要')
          }
        },
        {
          prop: 'lastUpdateTime',
          label: '最近一次清除时间',
          align: 'center'
        },
        {
          prop: 'createUser',
          label: '清除人',
          align: 'center'
        }
      ],
      list: [],
      searchData: {
        name: null,
        age: null,
        sex: null
      },
      searchForm: [
        // {type: 'Input', label: '名称', prop: 'name', width: '180px', placeholder: '请输入名称'},
        // {type: 'Select', label: '性别', prop: 'sex', width: '180px', options: sexs, props: sexProps, change: row => '', placeholder: '请选择性别'}
      ],
      searchHandle: [
        // {label: '查询', type: 'primary', handle: () => { this.handleSearch() }},
        // {label: '重置', type: '', handle: () => { this.resetHandle() }},
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
        'pageSize': this.pageSize
      }
      this.getList(dataBody)
    },
    // 新增 / 修改
    addOrUpdateHandle () {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init()
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
    },
    // 执行接口
    implementHandle (val) {
      this.$confirm(`确定执行操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (val.flag === 1) {
          this.$prompt('请输入缓存key', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            const dataBody = {
              'id': val.id,
              'suffixKey': value
            }
            implement(dataBody).then(({data}) => {
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
          implement(dataBody).then(({data}) => {
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
