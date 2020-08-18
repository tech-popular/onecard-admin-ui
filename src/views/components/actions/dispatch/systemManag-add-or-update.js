import { save, info, update } from '@/api/dispatch/systemManag'
export const addOrEdotModels = {
  data () {
    return {
      visible: false,
      // 表单数据
      formData: {},
      createUser: '',
      // 标题字段
      formDesc: {
        projectSystemName: {
          type: 'input',
          label: '系统名称',
          required: true
        },
        projectDisable: {
          type: 'radio',
          label: '系统状态',
          default: 1,
          options: [
            { text: '有效', value: 0 },
            { text: '无效', value: 1 }
          ],
          required: true
        },
        discribe: {
          type: 'textarea',
          label: '备注',
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
    init (id) {
      this.id = id ? id.id : ''
      this.visible = true
      this.$nextTick(() => {
        if (id) {
          // const dataBody = {id: this.id}
          info(this.id).then(({data}) => {
            this.formData = data.data
          })
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.formData = {}
      this.id = ''
    },
    handleSubmit (data) {
      this.dataBody = data
      return Promise.resolve()
    },
    // 提交
    handleSuccess () {
      let url = update
      if (!this.id) {
        url = save
        this.dataBody.createUser = this.userName
      }
      url(this.dataBody).then(({data}) => {
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
        }
      })
    }
  }
}
