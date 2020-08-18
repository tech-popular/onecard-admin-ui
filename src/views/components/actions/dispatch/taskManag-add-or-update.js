import {
  info,
  save,
  update,
  dataSourceAll
} from '@/api/dispatch/taskManag'
import DefaultValue from './components/defaultValue'
import RoutGoPath from './components/routGoPath'

export const addOrEdotModels = {
  data() {
    return {
      width: '70%',
      visible: false,
      // 表单数据
      formData: {},
      // 标题字段
      formDesc: {
        taskName: {
          type: DefaultValue,
          label: '任务名称',
          required: true,
          layout: 12
        },
        id: {
          type: 'input',
          label: '任务ID',
          disabled: true,
          layout: 12
        },
        projectId: {
          type: 'select',
          label: '所属系统',
          options: [{
              text: 'redis',
              value: 1
            },
            {
              text: 'EhCahe',
              value: 0
            }
          ],
          required: true
        },
        taskDiscribe: {
          type: 'textarea',
          label: '任务描述',
          required: true
        },
        inDatasourceId: {
          type: 'select',
          label: '数据来源',
          options: [{
              text: 'redis',
              value: 1
            },
            {
              text: 'EhCahe',
              value: 0
            }
          ],
          required: true
        },
        dataSourceName: {
          type: 'select',
          label: '数据源名称',
          options: [{
              text: 'redis',
              value: 1
            },
            {
              text: 'EhCahe',
              value: 0
            }
          ],
          required: true
        },
        selectAcount: {
          type: RoutGoPath,
          label: '账户',
          required: true
        },
        beforeStart: {
          type: 'codemirror',
          label: '作业开始前SQL',
          attrs: {
            tabSize: 4,
            lineNumbers: true,
            line: true
          },
          required: true
        },
        outputField: {
          type: 'tag',
          label: '输出字段',
          options: [{
              text: 'redis',
              value: 1
            },
            {
              text: 'EhCahe',
              value: 0
            }
          ],
          required: true
        },
        dataDestination: {
          type: 'select',
          label: '数据去向',
          options: [{
              text: 'redis',
              value: 1
            },
            {
              text: 'EhCahe',
              value: 0
            }
          ],
          required: true
        },
        dataName2: {
          type: 'select',
          label: '数据源名称',
          options: [{
              text: 'redis',
              value: 1
            },
            {
              text: 'EhCahe',
              value: 0
            }
          ],
          required: true
        },
        public: {
          type: 'select',
          label: '公共账户',
          options: [{
              text: 'redis',
              value: 1
            },
            {
              text: 'EhCahe',
              value: 0
            }
          ],
          required: true
        },
        tableArrTopic: {
          type: 'input',
          label: '输入数据表/topic名称',
          required: true
        },
        beforeTarget: {
          type: 'codemirror',
          label: '作业开始前SQL',
          attrs: {
            tabSize: 4,
            lineNumbers: true,
            line: true
          }
        },
        afterTarget: {
          type: 'codemirror',
          label: '作业开始前SQL',
          attrs: {
            tabSize: 4,
            lineNumbers: true,
            line: true
          }
        },
        issueSrart: {
          type: 'tag',
          label: '下发类型',
          options: [{
              text: 'redis',
              value: 1
            },
            {
              text: 'EhCahe',
              value: 0
            }
          ],
          required: true
        },
        incrementRule: {
          type: 'input',
          label: '增量规则'
        },
        missionRequirementsMan: {
          type: 'input',
          label: '任务需求人',
          required: true
        },
        stautus: {
          type: 'tag',
          label: '状态',
          options: [{
              text: 'redis',
              value: 1
            },
            {
              text: 'EhCahe',
              value: 0
            }
          ],
          required: true
        }
      },
      id: '',
      dataBody: {},
      submitBtn: true,
      editUser: 'lvzhiming',
      editTime: '2020-07-23',
      options: [{
        label: 'wode',
        value: 1
      }]
    }
  },
  methods: {
    init(id) {
      this.id = id ? id.id : ''
      this.getDataSourceAll()
      this.visible = true
      this.$nextTick(() => {
        if (id) {
          console.log(this.submitBtn)
          this.submitBtn = false
          info(this.id).then(({
            data
          }) => {
            this.formData = data.data
          })
        }
      })
    },
    getDataSourceAll () {
      dataSourceAll().then(({data}) => {
        console.log(data)
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
      let url = update
      if (!this.id) {
        url = save
      }
      url(this.dataBody).then(({
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
