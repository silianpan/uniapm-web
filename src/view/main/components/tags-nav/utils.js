/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newPageModule) => {
  const pageModule = { ...newPageModule }
  const { id } = pageModule
  let newList = [...list]
  if (newList.findIndex(item => item.id === id) >= 0) return newList
  else newList.push(pageModule)
  return newList
}

/**
 * @param {Array} taglist 标签列表
 * @param {String} currentTagName 当前关闭的标签的唯一标识
 */
export const getLatestTag = (tagList, currentTagName) => {
  let list = [...tagList]
  if (!currentTagName || !list || list.length < 2) {
    return null
  }
  const crIndex = list.findIndex(item => item.id === currentTagName)
  if (crIndex === list.length - 1) {
    // 关闭的最右边的tag
    return list[crIndex - 1]
  }
  return list[crIndex + 1]
}
