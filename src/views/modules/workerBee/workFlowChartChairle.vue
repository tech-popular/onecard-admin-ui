<template>
  <el-dialog title="查看" :modal-append-to-body='false' :append-to-body="true" @close="showClisk" :visible.sync="visible">
    这是什么
  </el-dialog>
</template>

<script>
  import { getTaskDefWithWorkFlowTask } from '@/api/workerBee/workFlow'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {}
      }
    },
    components: {

    },
    methods: {
      init (id) {
        this.dataForm.id = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (id) {
            const dataBody = id
            getTaskDefWithWorkFlowTask(dataBody).then(({data}) => {
              if (data && data.status === 0) {
                this.dataForm = data.data
              }
            })
          }
        })
      },
      showClisk () {
        this.visible = false
      }
    }
  }
</script>
