<template>
  <div class="el-transfer">
    <transfer-panel
      :style="{ width: widths[0] }"
      v-bind="$props"
      ref="leftPanel"
      :data="sourceData"
      :title="titles[0] || t('el.transfer.titles.0')"
      :default-checked="leftDefaultChecked"
      :title-flag="leftTitleFlag"
      :filterable="leftFilter"
      :isLeft="true"
      :hasTableSort="hasTableSort"
      :isCheckList="isLeftCheckList"
      :hasTotal="hasLeftTotal"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      @checked-change="onSourceCheckedChange">
      <div slot="left-header"> <slot name="left-header"></slot></div>
      <slot name="left-footer"></slot>
    </transfer-panel>
    <div class="el-transfer__buttons">
      <!-- <el-button
        type="primary"
        :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        @click.native="addToLeft"
        :disabled="rightChecked.length === 0">
        <i class="el-icon-arrow-left"></i>
        <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
      </el-button> -->
      <el-button
        type="primary"
        :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        @click.native="addToRight"
        :disabled="leftChecked.length === 0">
        <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
        <i class="el-icon-arrow-right"></i>
      </el-button>
    </div>
    <transfer-panel
      :style="{ width: widths[1] }"
      v-bind="$props"
      ref="rightPanel"
      :data="targetData"
      :isRight="true"
      :title="titles[1] || t('el.transfer.titles.1')"
      :default-checked="rightDefaultChecked"
      :title-flag="rightTitleFlag"
      :filterable="rightFilter"
      :isCheckList="isRightCheckList"
      :hasTotal="hasRightTotal"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      @checked-change="onTargetCheckedChange">
      <div slot="right-header"><slot name="right-header"></slot></div>
      <slot name="right-footer"></slot>
    </transfer-panel>
  </div>
</template>

<script>
  import Emitter from 'element-ui/src/mixins/emitter'
  import Locale from 'element-ui/src/mixins/locale'
  import TransferPanel from './transfer-panel.vue'
  import Migrating from 'element-ui/src/mixins/migrating'

  export default {
    name: 'NewTransfer',

    mixins: [Emitter, Locale, Migrating],

    components: {
      TransferPanel
    },

    props: {
      isRightCheckList: {
        type: Boolean,
        default: true
      },
      isLeftCheckList: {
        type: Boolean,
        default: true
      },
      hasLeftTotal: {
        type: Boolean,
        default: false
      },
      hasRightTotal: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default () {
          return []
        }
      },
      titles: {
        type: Array,
        default () {
          return []
        }
      },
      widths: {
        type: Array,
        default () {
          return []
        }
      },
      buttonTexts: {
        type: Array,
        default () {
          return []
        }
      },
      filterPlaceholder: {
        type: String,
        default: ''
      },
      filterMethod: Function,
      leftDefaultChecked: {
        type: Array,
        default () {
          return []
        }
      },
      rightDefaultChecked: {
        type: Array,
        default () {
          return []
        }
      },
      renderContent: Function,
      value: {
        type: Array,
        default () {
          return []
        }
      },
      format: {
        type: Object,
        default () {
          return {}
        }
      },
      filterable: Boolean,
      props: {
        type: Object,
        default () {
          return {
            label: 'label',
            key: 'key',
            disabled: 'disabled'
          }
        }
      },
      targetOrder: {
        type: String,
        default: 'original'
      },
      leftTitleFlag: {
        type: Boolean,
        default: true
      },
      rightTitleFlag: {
        type: Boolean,
        default: true
      },
      leftFilter: {
        type: Boolean,
        default: false
      },
      rightFilter: {
        type: Boolean,
        default: false
      },
      manualInput: {
        type: String,
        default: ''
      },
      hasTableSort: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        leftChecked: [],
        rightChecked: []
      }
    },

    computed: {
      dataObj () {
        const key = this.props.key
        return this.data.reduce((o, cur) => (o[cur[key]] = cur) && o, {})
      },
  
      sourceData () {
        console.log(this.data)
        return this.data
        // return this.data.filter(item => this.value.indexOf(item[this.props.key]) === -1)
      },

      targetData () {
        if (this.targetOrder === 'original') {
          let arr = this.data.filter(item => this.value.indexOf(item[this.props.key]) > -1)
          return arr
        } else {
          return this.value.reduce((arr, cur) => {
            const val = this.dataObj[cur]
            if (val) {
              arr.push(val)
            }
            return arr
          }, [])
        }
      },

      hasButtonTexts () {
        return this.buttonTexts.length === 2
      }
    },

    watch: {
      value (val) {
        this.dispatch('ElFormItem', 'el.form.change', val)
      },
      manualInput (val) {
        if (!this.leftChecked.includes('manual_' + val)) {
          this.leftChecked.push('manual_' + val)
        }
      }
    },

    methods: {
      getMigratingConfig () {
        return {
          props: {
            'footer-format': 'footer-format is renamed to format.'
          }
        }
      },

      onSourceCheckedChange (val, movedKeys) {
        this.leftChecked = val
        if (movedKeys === undefined) return
        console.log(val)
        this.$emit('left-check-change', val, movedKeys)
      },

      onTargetCheckedChange (val, movedKeys) {
        this.rightChecked = val
        if (movedKeys === undefined) return
        this.$emit('right-check-change', val, movedKeys)
      },

      // addToLeft () {
      //   let currentValue = this.value.slice()
      //   console.log('------', this.rightChecked, currentValue)
      //   this.rightChecked.forEach(item => {
      //     const index = currentValue.indexOf(item)
      //     console.log(index)
      //     if (index > -1) {
      //       currentValue.splice(index, 1)
      //       console.log('555666', currentValue)
      //     }
      //   })
      //   console.log(this.rightChecked)
      //   this.$emit('input', currentValue)
      //   this.$emit('change', currentValue, 'left', this.rightChecked)
      // },

      addToRight () {
        let currentValue = this.value.slice()
        const itemsToBeMoved = []
        const key = this.props.key
        if (this.manualInput) {
          let arr = this.data.filter(item => item.key === 'manual_' + this.manualInput)
          if (!arr.length) {
            this.data.push({
              key: 'manual_' + this.manualInput,
              label: this.manualInput,
              pinyin: 'manual'
            })
          }
        }
        this.data.forEach(item => {
          const itemKey = item[key]
          if (
            this.leftChecked.indexOf(itemKey) > -1 &&
            this.value.indexOf(itemKey) === -1
          ) {
            itemsToBeMoved.push(itemKey)
          }
        })
        currentValue = this.targetOrder === 'unshift'
          ? itemsToBeMoved.concat(currentValue)
          : currentValue.concat(itemsToBeMoved)
        if (this.manualInput) { this.$emit('clearManual') }
        this.$emit('input', currentValue)
        this.$emit('change', currentValue, 'right', this.leftChecked)
      },

      clearQuery (which) {
        if (which === 'left') {
          this.$refs.leftPanel.query = ''
        } else if (which === 'right') {
          this.$refs.rightPanel.query = ''
        }
      }
    }
  }
</script>
<style scoped>
.el-transfer {
  text-align: center
}
</style>
