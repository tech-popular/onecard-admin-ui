import {
  list,
  taskExecute
} from '@/api/dispatch/taskManag'
import {
  updateDispatchTaskAuth,
  updateDispatchTaskAuths
} from '@/api/commom/assignPermission'
export const models = {
  data() {
    let type = [{
      label: '全部',
      value: -1
    }, {
      label: 'Trino任务',
      value: 'TRINO'
    }, {
      label: 'DBT任务',
      value: 'DBT'
    }]
    let typeProps = {
      label: 'label',
      value: 'value'
    }
    let status = [{
      label: '全部',
      value: -1
    }, {
      label: '启用',
      value: 0
    }, {
      label: '停用',
      value: 1
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
      dataListSelections: [],
      userid: sessionStorage.getItem('id'),
      isAdmin: sessionStorage.getItem('username') === 'admin',
      dataListLoading: false,
      addOrUpdateVisible: false,
      dispatchConfigAddOrUpdateVisible: false,
      computAddOrUpdateVisible: false,
      addDBTVisible: false,
      submitDataApi: updateDispatchTaskAuth,
      submitDataApis: updateDispatchTaskAuths,
      assignPermissionVisible: false,
      taskManagSnapShotVisible: false,
      operatesFixed: 'right',
      snapshot: 'http://dss.9fbank.com:8091/task/depency?etlJobId=01165352627912917264&etlJobName=me_dlv_db_clearingExt_t_deduct_discint_trade_info&etlJobStatus=Done&isUser=true',
      editSnapshot: 'http://dss.9fbank.com:8091/depend/list?etlJobId=01165352627912917264&etlJobName=me_dlv_db_clearingExt_t_deduct_discint_trade_info&etlSystemCode=12&serverGroupId=e85ee394c572477cab12ecdf8ee5629b',
      // 操作按钮
      operatesWidth: '350px',
      operates: [{
          id: 1,
          label: '编辑任务',
          type: 'primary',
          size: 'mini',
          isShow: (id) => {
            return this.isAdmin || id.authOtherList.includes(this.userid) || id.authOwner === this.userid
          },
          method: (id) => {
            if (id.taskType === 'CALCULATE') {
              this.computAddOrUpdateHandle(id)
            } else {
              this.addOrUpdateHandle(id)
            }
          }
        },
        {
          id: 2,
          label: '查看任务',
          type: 'primary',
          size: 'mini',
          isShow: (id) => {
            return !(this.isAdmin || id.authOtherList.includes(this.userid) || id.authOwner === this.userid)
          },
          method: (id) => {
            if (id.taskType === 'CALCULATE') {
              this.computAddOrUpdateHandle(id)
            } else {
              this.addOrUpdateHandle(id)
            }
          }
        },
        {
          id: 3,
          label: '调度配置',
          type: 'success',
          size: 'mini',
          isShow: (id) => {
            return this.isAdmin || id.authOtherList.includes(this.userid) || id.authOwner === this.userid
          },
          method: (id) => {
            let canUpdate = this.isAdmin || id.authOtherList.includes(this.userid) || id.authOwner === this.userid
            this.addOrUpdateDispatchConfig(id, canUpdate)
          }
        },
        {
          id: 9,
          label: '查看配置',
          type: 'success',
          size: 'mini',
          isShow: (id) => {
            return !(this.isAdmin || id.authOtherList.includes(this.userid) || id.authOwner === this.userid)
          },
          method: (id) => {
            let canUpdate = this.isAdmin || id.authOtherList.includes(this.userid) || id.authOwner === this.userid
            this.addOrUpdateDispatchConfig(id, canUpdate)
          }
        },
        {
          id: 4,
          label: '执行任务',
          type: 'default',
          size: 'mini',
          // isShow: (id) => {
          //   return this.isAdmin || id.authOtherList.includes(this.userid) || id.authOwner === this.userid
          // },
          disabled: (id) => {
            if (this.isAdmin || id.authOtherList.includes(this.userid) || id.authOwner === this.userid) {
              if (id.dispatchStatus === 1) {
                return true
              }
              return false
            } else {
              return true
            }
          },
          method: (id) => {
            this.taskExecuteHandle(id)
          }
        },
        {
          id: 4,
          label: '依赖快照',
          type: 'danger',
          method: (id) => {
            this.snapshotHandle(id)
          }
        },
        // {
        //   id: 5,
        //   label: '编辑依赖',
        //   type: 'warning',
        //   method: (editSnapshot) => {
        //     this.editSnapshotHandle(editSnapshot)
        //   }
        // }
        // {
        //   id: 7,
        //   label: '删除',
        //   type: 'success',
        //   method: (id) => {
        //     this.taskExecuteHandle(id)
        //   }
        // }
        {
          id: 8,
          label: '授权',
          type: 'warning',
          size: 'mini',
          isShow: (id) => {
            return this.isAdmin || id.authOwner === this.userid
          },
          method: (id) => {
            this.taskPermission(id)
          }
        }
      ],
      columns: [{
          prop: 'id',
          fixed: true,
          label: '任务ID',
          align: 'center',
          width: '100px'
        },
        {
          prop: 'taskName',
          fixed: true,
          width: '130px',
          label: '任务名称',
          align: 'center',
          render: (h, params) => {
            return h('a', {
              style: {
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.gotoTaskBatchHandle(params)
                }
              }
            }, params.row.taskName)
          }
        },
        {
          prop: 'taskType',
          label: '任务类型',
          width: '120px',
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {
                type: params.row.taskType === 'CALCULATE' ? '' : 'warning'
              } // 组件的props
            }, params.row.taskType === 'CALCULATE' ? '计算任务' : '同步任务')
          }
        },
        {
          prop: 'tag',
          label: 'Tag',
          width: '120px',
          align: 'center'
        },
        {
          prop: 'createTime',
          label: '任务创建时间',
          width: '120px',
          align: 'center'
        },
        {
          prop: 'createUser',
          label: '创建人',
          width: '120px',
          align: 'center'
        },
        {
          prop: 'taskDisable',
          label: '任务状态',
          width: '120px',
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {
                type: params.row.taskDisable === 0 ? '' : 'warning'
              } // 组件的props
            }, params.row.taskDisable === 0 ? '有效' : '无效')
          }
        },
        {
          prop: 'dispatchStatus',
          label: '调度起停状态',
          width: '120px',
          align: 'center',
          render: (h, params) => {
            return h('el-tag', {
              props: {
                type: params.row.dispatchStatus === 0 ? '' : 'warning'
              } // 组件的props
            }, params.row.dispatchStatus === 0 ? '启用' : '停用')
          }
        },
        {
          prop: 'dependence',
          label: '有无依赖',
          width: '120px',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.dependence === 0 ? '有' : '无')
          }
        }
      ],
      list: [],
      searchData: {
        name: '',
        id: '',
        type: -1,
        user: '',
        status: -1
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
          label: 'Tag',
          prop: 'tag',
          width: '300px',
          placeholder: 'Tag'
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
        {
          label: '新增DBT任务',
          type: 'warning',
          handle: () => {
            this.addDBTHandle()
          }
        },
        {
          label: '新增Trino任务',
          type: 'success',
          handle: () => {
            this.computAddOrUpdateHandle()
          }
        },
        {
          label: '批量授权',
          type: 'primary',
          isShow: () => {
            return this.isAdmin
          },
          handle: () => {
            this.multiTaskPermission()
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
        'tag': this.searchData.tag,
        'type': this.searchData.type === -1 ? '' : this.searchData.type,
        'user': this.searchData.user,
        'status': this.searchData.status === -1 ? '' : this.searchData.status,
        'tenantId': sessionStorage.getItem('tenantId')
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
      this.searchData = {
        id: '',
        name: '',
        type: -1,
        user: '',
        status: -1
      }
      this.init()
    },
    // 调度配置
    addOrUpdateDispatchConfig (id) {
      this.dispatchConfigAddOrUpdateVisible = true
      this.$nextTick(() => {
        let canUpdate = true
        if (!this.isAdmin) {
          canUpdate = id ? id.authOtherList.includes(this.userid) || id.authOwner === this.userid : true
        }
        this.$refs.dispatchConfigAddOrUpdate.init(id, canUpdate)
      })
    },
    // 执行任务
    taskExecuteHandle (id) {
      taskExecute(id.id).then(({data}) => {
        if (data && data.code === 0) {
          this.$message.success(data.msg || '执行成功')
        } else {
          this.$message.error(data.msg || '执行失败')
        }
      })
    },
    // 新增 / 修改同步任务
    addOrUpdateHandle(id) {
      console.log('id:1 ', id)
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        let canUpdate = true
        if (!this.isAdmin) {
          canUpdate = id ? id.authOtherList.includes(this.userid) || id.authOwner === this.userid : true
        }
        this.$refs.addOrUpdate.init(id, canUpdate)
      })
    },
    // 新增 / 修改计算任务
    computAddOrUpdateHandle(id) {
      this.computAddOrUpdateVisible = true
      this.$nextTick(() => {
        let canUpdate = true
        if (!this.isAdmin) {
          canUpdate = id ? id.authOtherList.includes(this.userid) || id.authOwner === this.userid : true
        }
        this.$refs.computAddOrUpdate.init(id, canUpdate)
      })
    },
    // 新增 / 修改计算任务
    addDBTHandle(id) {
      this.addDBTVisible = true
      this.$nextTick(() => {
        let canUpdate = true
        if (!this.isAdmin) {
          canUpdate = id ? id.authOtherList.includes(this.userid) || id.authOwner === this.userid : true
        }
        this.$refs.addDBTRef.init(id, canUpdate)
      })
    },
    // 点击名称跳转到批次
    gotoTaskBatchHandle (params) {
      console.log(params)
      this.$router.push({ name: 'dispatch-taskBatch', query: { name: params.row.taskName } })
    },
    // 依赖快照
    snapshotHandle(id) {
      this.taskManagSnapShotVisible = true
      this.$nextTick(() => {
        this.$refs.taskManagSnapShot.init(id)
      })
      // window.open(url, '_blank')
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
    // 多选
    handleSelectionChange(val) {
      this.dataListSelections = val
    },
    // 列表接口
    getList(dataBody) {
      this.dataListLoading = true
      list(dataBody).then(({
        data
      }) => {
        if (data && data.code === 0) {
          this.dataListLoading = false
          this.list = data.data.records
          this.totalPage = data.data.total
        } else {
          this.list = []
          this.totalPage = 0
          this.$message.error(data.msg)
        }
      })
    },
    // 数据授权
    taskPermission(row) {
      // 打开权限分配弹框
      // 根据登陆用户和数据创建人判断是否是同一用户决定权限按钮是否显示
      this.assignPermissionVisible = true
      this.$nextTick(() => {
        this.$refs.assignPermission.init(row)
      })
    },
     // 批量授权
    multiTaskPermission() {
      this.assignPermissionVisible = true
      let ids = this.dataListSelections.map(item => {
        return item.id
      })
      this.$nextTick(() => {
        this.$refs.assignPermission.init(ids, true)
      })
    }
    // // 删除接口
    // deleteHandle(id) {
    //   const dataBody = {
    //     'id': id.id
    //   }
    //   this.$confirm(`确定删除操作?`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     deleted(dataBody).then(({
    //       data
    //     }) => {
    //       if (data && data.code === 0) {
    //         this.$message({
    //           message: '操作成功',
    //           type: 'success',
    //           duration: 1500,
    //           onClose: () => {
    //             const dataBody = {
    //               'pageNum': this.pageNum,
    //               'pageSize': this.pageSize
    //             }
    //             this.getList(dataBody)
    //           }
    //         })
    //       } else {
    //         this.$message.error(data.msg)
    //       }
    //     })
    //   })
    // },
    // 执行接口
    // implementHandle(val) {
    //   this.$confirm(`确定执行操作?`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     if (val.flag === 1) {
    //       this.$prompt('请输入缓存key', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消'
    //       }).then(({
    //         value
    //       }) => {
    //         const dataBody = {
    //           'id': val.id,
    //           'suffixKey': value
    //         }
    //         implement(dataBody).then(({
    //           data
    //         }) => {
    //           if (data && data.code === 0) {
    //             this.$message({
    //               message: '操作成功',
    //               type: 'success',
    //               duration: 1500,
    //               onClose: () => {
    //                 const dataBody = {
    //                   'pageNum': this.pageNum,
    //                   'pageSize': this.pageSize
    //                 }
    //                 this.getList(dataBody)
    //               }
    //             })
    //           } else {
    //             this.$message.error(data.msg)
    //           }
    //         })
    //       })
    //     } else {
    //       const dataBody = {
    //         'id': val.id
    //       }
    //       implement(dataBody).then(({
    //         data
    //       }) => {
    //         if (data && data.code === 0) {
    //           this.$message({
    //             message: '操作成功',
    //             type: 'success',
    //             duration: 1500,
    //             onClose: () => {
    //               const dataBody = {
    //                 'pageNum': this.pageNum,
    //                 'pageSize': this.pageSize
    //               }
    //               this.getList(dataBody)
    //             }
    //           })
    //         } else {
    //           this.$message.error(data.msg)
    //         }
    //       })
    //     }
    //   })
    // }
  }
}
