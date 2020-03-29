export const findParent = (parent) => {
  console.log(parent)
  while (parent && !parent.isTreeRoot) {
    parent = parent.$parent
  }
  return parent
}
