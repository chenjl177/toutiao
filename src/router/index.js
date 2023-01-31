import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
// 导入登录模块路由
import Login from '@/views/Login/Login.vue'
// 主页
import Main from '@/views/Main/Main.vue'
// 首页
import Home from '@/views/Home/Home.vue'
// 个人中心
import User from '@/views/User/User.vue'
// 搜索页
import Search from '@/views/Search/Search.vue'
// 搜索结果文章展示
import SearchResult from '@/views/SearchResult/SearchResult.vue'
// 文章详情组件
import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
// 用户资料编辑
import UserEdit from '@/views/UserEdit/UserEdit.vue'
// 小思同学
import Chat from '@/views/Chat/Chat.vue'

Vue.use(VueRouter)

// 路由
const routes = [
  { path: '/login', component: Login, name: 'login' },
  {
    path: '/',
    component: Main,
    children: [
      { path: '/home', component: Home, name: 'home', meta: { isRecord: true, top: 0 } },
      { path: '/user', component: User, name: 'user' }
    ]
  },
  { path: '/search', component: Search, name: 'search' },
  { path: '/search/:kw', component: SearchResult, name: 'search-result', props: true },
  { path: '/article/:id', component: ArticleDetail, name: 'art-detail', props: true, meta: { isRecord: true, top: 0 } },
  { path: '/user/edit', component: UserEdit, name: 'user-edit' },
  { path: '/user/chat', component: Chat, name: 'chat' }
]

const router = new VueRouter({
  routes
})

// 设置权限页面数组
const pagePathArr = ['/user', '/user/edit']

// 为路由的实例对象挂载全局前置守卫
router.beforeEach((to, from, next) => {
  // 判断访问地址是否在数组中
  if (pagePathArr.indexOf(to.path) !== -1) {
    // 获取token值
    const tokenStr = store.state.tokenInfo.token
    // 有token值放行，没有则跳转到登录页面
    if (tokenStr) {
      next()
    } else {
      next('/login')
      next(`/login?pre=${to.fullPath}`)
    }
  } else {
    // 访问的是无需权限的页面则直接放行
    next()
  }
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  // 通过 .catch 捕获错误
  return originalPush.call(this, location).catch(err => err)
}

router.afterEach((to, from) => {
  if (to.meta.isRecord) {
    setTimeout(() => {
      window.scrollTo(from, to.meta.top)
    }, 0)
  }
})

export default router
