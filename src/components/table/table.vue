<template>
  <div class=''>
    <el-table :data="list" style="width: 100%" border>
      <template v-for="(item,index) in columns">
        <el-table-column :prop="item.prop" :fixed="item.fixed" :key='item.label' :label="item.label" :align="item.align" :width="item.width">
          <template slot-scope="scope">
            <template v-if="!item.render">
              <template v-if="item.formatter">
                <span v-html="item.formatter(scope.row, item)"></span>
              </template>
              <template v-else>
                <span>{{scope.row[item.prop]}}</span>
              </template>
            </template>
            <template v-else>
              <expand-dom :column="item" :row="scope.row" :render="item.render" :index="index"></expand-dom>
            </template>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作" align="center" :fixed="fixed" :width="operatesWidth" v-if="operates.length">
        <template slot-scope="scope">
          <el-button size="mini" v-for="(btn,index) in operates" v-show="!btn.isShow || btn.isShow && btn.isShow(scope.row)" :type="btn.type" :disabled="btn.disabled && btn.disabled(scope.row)" :key="index" @click.native.prevent="btn.method(scope.row)">{{btn.label}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: []
    },
    columns: {
      type: Array,
      default: []
    },
    operates: {},
    operatesWidth: {
      type: String,
      default: ''
    },
    fixed: {}
  },
  // 组件
  components: {
    expandDom: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        item: {
          type: Object,
          default: null
        }
      },
      render: (h, ctx) => {
        const params = {
          row: ctx.props.row,
          index: ctx.props.index
        }
        if (ctx.props.item) params.item = ctx.props.item
        return ctx.props.render(h, params)
      }
    }
  }
}
</script>
<style scoped>
  .el-button+.el-button{
    margin: 5px !important;
  }
</style>
