<template></template>
<script>
export default {
  /**
   * 空格校验
   * @param rule
   * @param value
   * @param callback
   * @constructor
   */
  NullKongGeRule: (rule, value, callback) => {
    const nullValue = /^[^\s]+$/
    if (value !== '' && value !== null && value !== undefined) {
      if (!nullValue.test(value)) {
        callback(new Error('不能输入含空格'))
      }
    }
    callback()
  }
}
</script>
