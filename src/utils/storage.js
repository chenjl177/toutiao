// 存储数据
export const setItem = (key, value) => {
  // 如果参数是对象格式，则将其转换成字符串
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  // 将参数保存到本地存储
  window.localStorage.setItem(key, value)
}
