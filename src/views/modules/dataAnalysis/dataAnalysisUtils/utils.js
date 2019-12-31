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

export const generateBig = (q) => {
  return q
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
