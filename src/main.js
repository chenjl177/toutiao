import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入vant组件
import Vant, { Lazyload } from 'vant'
// 导入vant样式文件
import 'vant/lib/index.less'
// 导入amfe-flexible
import 'amfe-flexible'
// 导入全局样式表
import './index.less'
// 导入dayjs组件
import dayjs from 'dayjs'
// 导入计算相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入中文语言包
import zh from 'dayjs/locale/zh-cn'

// 配置计算相对时间插件
dayjs.extend(relativeTime)
// 配置中文语言包
dayjs.locale(zh)

Vue.config.productionTip = false

// 注册Vant
Vue.use(Vant)
// 注册Lazyload懒加载
Vue.use(Lazyload)

// 定义格式化时间的全局过滤器
Vue.filter('dateFormat', dt => {
  // dayjs()得到当前时间
  // to()方法返回计算出来的相对时间
  return dayjs().to(dt)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
