<template>
  <el-dialog :title="id ? '查看' : '新增'"
    :modal-append-to-body='false'
    :append-to-body="true"
    :visible.sync="visible"
    :close-on-click-modal="false">
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      id: '',
      visible: false
    }
  },
  methods: {
    init () {
      this.visible = true
    }
  }
}
</script>
