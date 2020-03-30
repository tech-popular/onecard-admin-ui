export const findParent = (parent) => {
  console.log(parent)
  while (parent && !parent.isTreeRoot) {
    parent = parent.$parent
  }
  return parent
}

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
