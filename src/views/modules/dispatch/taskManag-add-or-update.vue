<template>
  <ele-form-dialog
    v-model="formData"
    :formDesc="formDesc"
    :request-fn="handleSubmit"
    :visible.sync="visible"
    @request-success="handleSuccess"
    :title="id ? '查看' : '新增/编辑同步任务'"
    :isShowSubmitBtn="submitBtn"
    :width="width"
  >
    <el-row :gutter="24" style="margin-bottom: 15px;">
      <el-col :span="6">
        <div class="grid-content bg-purple">作业信息</div>
      </el-col>
      <el-col :span="18">
        <el-row :gutter="20">
          <el-col :span="10">
            <div class="grid-content bg-purple">最近修改人：{{editUser}}</div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple">最近修改时间：{{editTime}}</div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </ele-form-dialog>
</template>

<script>
import { addOrEdotModels } from '../../components/actions/dispatch/taskManag-add-or-update'
export default {
  mixins: [addOrEdotModels]
}
</script>