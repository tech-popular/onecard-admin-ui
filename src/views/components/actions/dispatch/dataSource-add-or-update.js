import {
  saveorupt,
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
        accountStatus: {
          type: 'radio',
          label: '账户类型',
          default: 1,
          options: [{
              text: '公共账户',
              value: 1
            },
            {
              text: '个人帐户',
              value: 0
            }
          ],
          required: true
        },
        createUser: {
          type: 'input',
          label: '用户名 / Access Key ID',
          required: true
        },
        password: {
          type: 'password',
          label: '密码 / Access Key Secret',
          required: true
        },
        flag: {
          type: 'radio',
          label: '状态',
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
  methods: {
    init(id) {
      this.id = id ? id.id : ''
      this.visible = true
      this.$nextTick(() => {
        if (id) {
          console.log(this.submitBtn)
          this.submitBtn = false
          const dataBody = {
            id: this.id
          }
          info(dataBody).then(({
            data
          }) => {
            this.formData = data.data
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
      saveorupt(this.dataBody).then(({
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
