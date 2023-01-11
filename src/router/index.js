import Vue from 'vue'
import VueRouter from 'vue-router'
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
Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login, name: 'login' },
  {
    path: '/',
    component: Main,
    children: [
      { path: '/home', component: Home, name: 'home' },
      { path: '/user', component: User, name: 'user' }
    ]
  },
  { path: '/search', component: Search, name: 'search' },
  { path: '/search/:kw', component: SearchResult, name: 'search-result', props: true },
  { path: '/article/:id', component: ArticleDetail, name: 'art-detail', props: true }
]

const router = new VueRouter({
  routes
})

export default router
