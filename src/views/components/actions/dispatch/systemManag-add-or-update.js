import { saveorupt, info } from '@/api/lexicon/cacheCleanup'
export const addOrEdotModels = {
  data () {
    return {
      visible: false,
      // 表单数据
      formData: {},
      // 标题字段
      formDesc: {
        cacheName: {
          type: 'input',
          label: '系统名称',
          required: true
        },
        cacheType: {
          type: 'select',
          label: '系统状态',
          options: [
            { text: 'redis', value: 1 },
            { text: 'EhCahe', value: 0 }
          ],
          required: true
        },
        infos: {
          type: 'textarea',
          label: '备注',
          required: true
        }
      },
      id: '',
      dataBody: {}
    }
  },
  methods: {
    init (id) {
      this.id = id ? id.id : ''
      this.visible = true
      this.$nextTick(() => {
        if (id) {
          const dataBody = {id: this.id}
          info(dataBody).then(({data}) => {
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
      saveorupt(this.dataBody).then(({data}) => {
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
