import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'
import router from '@/router/index.js'

// 调用axios.create()方法，创建axios的实例对象
const instance = axios.create({
  baseURL: 'http://toutiao.itheima.net'
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    Toast.loading({
      message: '加载中...', // 显示加载文本
      duration: 10 // 展示时长，值为0则提示不会消失
    })
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 隐藏 loading 效果
    Toast.clear()
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      console.log('token过期了')
      store.commit('cleanState')
      router.replace('/login?pre=' + router.currentRoute.fullPath)
    }
    return Promise.reject(error)
  }
)
// 添加token认证
instance.interceptors.request.use(
  config => {
    // 获取本地存储的token值
    const tokenStr = store.state.tokenInfo.token
    // 判断值是否为空
    if (tokenStr) {
      // 在响应头上添加token值
      config.headers.Authorization = `Bearer ${tokenStr}`
    }
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

export default instance
