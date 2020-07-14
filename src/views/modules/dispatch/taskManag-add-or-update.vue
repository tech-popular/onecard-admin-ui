<template>
    <ele-form-dialog
      v-model="formData"
      :formDesc="formDesc"
      :request-fn="handleSubmit"
      :rules="rules"
      :visible.sync="visible"
      @request-success="handleSuccess"
      :title="id ? '查看' : '新增'"
      :isShowSubmitBtn="submitBtn"
    ></ele-form-dialog>
</template>

<script>
  import { addOrEdotModels } from '../../components/actions/dispatch/taskManag-add-or-update'
  export default {
    mixins: [addOrEdotModels]
  }
</script>