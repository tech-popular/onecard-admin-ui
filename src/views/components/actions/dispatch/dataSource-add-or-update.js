import {
  saveAccount,
  info
} from '@/api/dispatch/dataSource'
export const addOrEdotModels = {
  data() {
    return {
      visible: false,
      // 表单数据
      formData: {},
      // 标题字段
      formDesc: {
        dataSourceName: {
          type: 'input',
          label: '数据源名称',
          disabled: true
        },
        dataSourceType: {
          type: 'select',
          label: '数据源类型',
          options: [{
              text: 'redis',
              value: 1
            },
            {
              text: 'EhCahe',
              value: 0
            }
          ],
          disabled: true
        },
        dataSourceDescribe: {
          type: 'textarea',
          label: '数据源描述',
          disabled: true
        },
        dataSourceIp: {
          type: 'input',
          label: '服务器地址',
          disabled: true
        },
        dataSourceDatabase: {
          type: 'input',
          label: '数据库名称',
          disabled: true
        },
        datasourceAccountType: {
          type: 'radio',
          label: '账户类型',
          default: 0,
          options: [{
              text: '公共账户',
              value: 0
            },
            {
              text: '个人帐户',
              value: 1
            }
          ],
          required: true,
          on: {
            change: (data) => {
              if (this.formData.accountList) {
                let filterArr = this.formData.accountList.filter(item => item.datasourceAccountType === this.formData.datasourceAccountType)
                if (filterArr.length) {
                  this.formData.datasourceUser = filterArr[0].datasourceUser
                  this.formData.datasourcePasswd = filterArr[0].datasourcePasswd
                  this.formData.accountDisable = filterArr[0].accountDisable
                } else {
                  this.formData.datasourceUser = ''
                  this.formData.datasourcePasswd = ''
                  this.formData.accountDisable = ''
                }
              }
            }
          }
        },
        datasourceUser: {
          type: 'input',
          label: '用户名 / Access Key ID',
          isReloadOptions: true,
          required: true,
          default: '',
          autocomplete: 'off'
        },
        datasourcePasswd: {
          type: 'password',
          label: '密码 / Access Key Secret',
          isReloadOptions: true,
          required: true,
          autocomplete: 'off'
        },
        accountDisable: {
          type: 'radio',
          label: '状态',
          isReloadOptions: true,
          default: 1,
          options: [{
              text: '有效',
              value: 1
            },
            {
              text: '无效',
              value: 0
            }
          ],
          required: true
        }
      },
      id: '',
      dataBody: {}
    }
  },
  computed: {
    userName: {
      get () { return this.$store.state.user.name }
    }
  },
  methods: {
    init(id) {
      if (id) {
        this.id = id
      }
      this.visible = true
      this.$nextTick(() => {
        if (id) {
          this.submitBtn = false
          info(id).then(({
            data
          }) => {
            this.formData = data.data
            // 初始化一下账户信息，默认取数组第一条
            if (data.data.accountList.length) {
              this.formData.datasourceAccountType = data.data.accountList[0].datasourceAccountType
              this.formData.datasourceUser = data.data.accountList[0].datasourceUser
              this.formData.datasourcePasswd = data.data.accountList[0].datasourcePasswd
              this.formData.accountDisable = data.data.accountList[0].accountDisable
            } else {
              this.formData.datasourceAccountType = ''
              this.formData.datasourceUser = ''
              this.formData.datasourcePasswd = ''
              this.formData.accountDisable = ''
            }
          })
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.formData = {}
      this.id = ''
    },
    handleSubmit(data) {
      this.dataBody = data
      return Promise.resolve()
    },
    // 提交
    handleSuccess() {
      let params = {
          'dataSourceId': this.id,
          'datasourceAccountType': this.dataBody.datasourceAccountType,
          'datasourceUser': this.dataBody.datasourceUser,
          'datasourcePasswd': this.dataBody.datasourcePasswd,
          'accountDisable': this.dataBody.accountDisable,
          'createUser': this.userName
      }
      saveAccount(params).then(({
        data
      }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
              this.formData = {}
            }
          })
        } else {
          this.$message.error(data.msg)
          this.visible = false
        }
      })
    }
  }
}
