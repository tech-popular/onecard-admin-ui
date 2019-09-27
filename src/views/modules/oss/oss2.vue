<template>
  <codemirror v-model="code" :options="cmOptions" class="code"></codemirror>
</template>
<script>
  // 导入组件
  import { codemirror } from 'vue-codemirror'
  // 导入使用的语言语法定义文件
  require('codemirror/mode/python/python.js')
  require('codemirror/mode/javascript/javascript.js')
  require('codemirror/mode/clike/clike.js')
  require('codemirror/mode/shell/shell.js')
  // 导入选中的theme文件
  require('codemirror/theme/blackboard.css')

  // 导入自动提示核心文件及样式
  require('codemirror/addon/hint/show-hint.css')
  require('codemirror/addon/hint/show-hint.js')
  // 导入指定语言的提示文件
  require('codemirror/addon/hint/javascript-hint.js')
  export default {
    // 注册组件
    components: {
      codemirror
    },
    data () {
      return {
        // 编辑器的默认输入值
        code: 'var a=1\nlet b=2',
        cmOptions: {
          tabSize: 4,
          // mode: 'text/javascript', //  识别的语言javascript
          mode: 'text/x-java',  //  识别的语言java
          //   mode:'text/x-sh',   //  识别的语言shell脚本
          theme: 'blackboard',  //  编辑器的主题
          lineNumbers: true,   //  显示行号
          line: true
        }
      }
    }
  }
</script>
