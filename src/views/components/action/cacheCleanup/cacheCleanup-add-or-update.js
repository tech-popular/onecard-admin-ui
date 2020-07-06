import { saveorupt } from '@/api/lexicon/cacheCleanup'
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
          label: '缓存名称'
        },
        key: {
          type: 'number',
          label: 'key'
        },
        cacheType: {
          type: 'select',
          label: '类型',
          options: [
            { text: 'redis', value: 1 },
            { text: 'EhCahe', value: 0 }
          ]
        },
        redisDb: {
          type: 'number',
          label: 'redisDb值',
          vif (data) {
            return data.cacheType === 1
          }
        },
        flag: {
          type: 'select',
          label: '缓存后缀',
          options: [
          { text: '需要', value: 1 },
          { text: '不需要', value: 0 }
          ]
        }
      },
      // 表单校验
      rules: {
        cacheName: [
          { required: true, message: '缓存名称不能为空', trigger: 'blur' }
        ],
        key: [
          { required: true, message: 'key不能为空', trigger: 'blur' }
        ],
        cacheType: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ],
        flag: [
          { required: true, message: '是否需要缓存后缀不能为空', trigger: 'blur' }
        ],
        redisDb: [
          { required: true, message: 'redisDb值不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
    },
    handleCancel () {
      this.visible = false
      this.formData = {}
    },
    handleSubmit (data) {
      this.formDesc = data
      return Promise.resolve()
    },
    // 提交
    handleSuccess (form) {
      console.log(form, '000')

      const dataBody = this.formDesc
      saveorupt(dataBody).then(({data}) => {
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
