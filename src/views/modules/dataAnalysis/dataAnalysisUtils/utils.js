// 实现深度拷贝
export const deepClone = (obj) => {
  var newObj
  // 数组类型的拷贝
  if (obj instanceof Array) {
    newObj = []
    var i = obj.length
    while (i--) {
      newObj[i] = deepClone(obj[i])
    }
    return newObj
  } else if (obj instanceof Object) {
    newObj = {}
    for (var k in obj) {
      newObj[k] = deepClone(obj[k])
    }
    return newObj
  } else {
    return obj
  }
}

export const findRuleIndex = (arr, val, position) => { // 查找index索引
  var res = ''
  function _find (arr, val, position) {
    var temp = ''
    arr.forEach((item, index) => {
      temp = position != undefined ? position + ',' + index : index
      if (item.ruleCode === val.ruleCode) {
        res = temp
        // return
      } else if (item.rules instanceof Array) {
        temp = _find(item.rules, val, temp)
      }
    })
  }
  _find(arr, val, position)
  return res
}

export const findVueSelectItemIndex = (arr, val, position) => { // 查找index索引
  var res = ''
  function _find (arr, val, position) {
    var temp = ''
    arr.forEach((item, index) => {
      temp = position != undefined ? position + ',' + index : index
      if (item.id === val) {
        res = temp
        // return
      } else if (item.children instanceof Array) {
        temp = _find(item.children, val, temp)
      }
    })
  }
  _find(arr, val, position)
  return res
}

export const getAbc = (index) => {
  var aCode = 65
  var zCode = 90
  var len = zCode - aCode + 1
  var result = ''
  while (index >= 0) {
    result = String.fromCharCode(index % len + aCode) + result
    index = Math.floor(index / len) - 1
  }
  return result
}

export const nullandnumber = (rule, value, callback) => {
  const nullValue = /^[^\s]+$/
  if (!value) {
    callback(new Error('请输入'))
  }
  if (!nullValue.test(value)) {
    callback(new Error('不能输入含空格'))
  }
  if (!Number(value)) {
    callback(new Error('请输入数字类型'))
  }
  callback()
}

// 树 name转label
export const nameToLabel = (arr) => {
  arr = arr.slice()
  let results
  function toParse (arr) {
    arr.forEach(function (item, index) {
      item['id'] = item.id
      item['label'] = item.name
      if (item.children && Array.isArray(item.children) && item.children.length > 0) {
        item['children'] = item.children
        toParse(item['children'])
      } else {
        if (Array.isArray(item.children) && item.children.length == 0) {
          arr.splice(index, 1)// 如果一级的元素为children为[]删除该元素
        } else {
          delete item['children']
        }
      }
    })
    return arr
  }
  results = toParse(arr)
  return results
}

// 指标回显
export const echoDisplay = (arr, rowId) => {
  let result
  function toEchoDisplay (items) {
    for (var i in items) {
      let item = items[i]
      if (rowId == item.id) {
        result = item.name
        break
      } else if (item.children) {
        result = toEchoDisplay(item.children)
      }
    }
    return result
  }
  toEchoDisplay(arr)
  return result
}

// 指标回显选中
export const findOption = (arr, indArr) => {
  let indArrInd = 0
  let results
  function toFindOption (arr) {
    arr.forEach(function (item, index) {
      if (indArr[indArrInd] == index && indArrInd < indArr.length - 1) {
        item.isDefaultExpanded = true
        indArrInd++
        if (item.children && Array.isArray(item.children) && item.children.length > 0) {
          item['children'] = item.children
          toFindOption(item['children'])
        }
      }
    })
    return arr
  }
  results = toFindOption(arr)
  return results
}
