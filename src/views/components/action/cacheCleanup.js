import { list, deleted, implement } from '@/api/lexicon/cacheCleanup'

export const api = {
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
          // render: (h, params) => {
          //   return h('a', {
          //   }, params.row.cacheName)
          // }
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
          label: '缓存key',
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {type: params.row.flag === 0 ? '' : 'warning'} // 组件的props
            }, params.row.flag === 0 ? '需要' : '不需要')
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
      list: []
    }
  },
  methods: {
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
    // 执行数据
    implementHandle (val) {
      console.log(val, '222')
      this.$confirm(`确定执行操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (val.flag === 0) {
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
