<template>
    <ele-form-dialog
      v-model="formData"
      :formDesc="formDesc"
      :request-fn="handleSubmit"
      :rules="rules"
      :visible.sync="visible"
      @request-success="handleSuccess"
      :title="id ? '编辑' : '新增'"
    ></ele-form-dialog>
</template>

<script>
  import { addOrEdotModels } from '../../components/actions/dispatch/dataSource-add-or-update'
  export default {
    mixins: [addOrEdotModels]
  }
</script>