<template>
  <div class="search-container">
    <!-- 头部区域 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="18" class="goback" @click="$router.back()"/>
      <!-- 搜索框 -->
      <van-search v-model.trim="kw" placeholder="请输入搜索关键词" background="#007BFF" shape="round" @input="onInput" />
    </div>
    <!-- 搜索建议 -->
    <div class="sugg-list" v-if="kw.length != 0" >
      <div class="sugg-item" v-for="(item, index) in suggestList" :key="index" v-html="item" @click="gotoSerachResult" ></div>
    </div>
    <!-- 搜索历史  -->
    <div class="search-history" v-else>
      <van-cell title="搜索历史">
        <template #right-icon>
          <van-icon name="cross" class="history-icon" @click="history = []" />
        </template>
      </van-cell>
      <div class="history-list">
        <span class="history-item" v-for="(item, index) in history" :key="index" @click="gotoSerachResult">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// 请求搜索建议的API
import { getSuggestListAPI } from '@/api/serachAPI'
export default {
  name: 'Search',
  data() {
    return {
      // 搜索词
      kw: '',
      // 定时器
      timer: null,
      // 存放搜索建议数据
      suggestList: [],
      // 搜索历史,读取本地存储的历史记录，没有则为空数组
      history: JSON.parse(localStorage.getItem('history') || '[]')
    }
  },
  mounted() {
    // 获取搜索框元素
    const ipt = document.querySelector('input')
    // 获取搜索框焦点
    ipt && ipt.focus()
  },
  methods: {
    // 防抖策略
    onInput() {
      // 清除定时器
      clearTimeout(this.timer)
      // 搜索词为空，不执行定时器，清除suggestList数据
      if (this.kw.length === 0) {
        this.suggestList = []
        return
      }
      // 定时器，500ms后调用initSuggestList事件
      this.timer = setTimeout(() => {
        this.initSuggestList()
      }, 500)
    },
    // 根据搜索词访问服务器获取搜索建议
    async initSuggestList() {
      try {
        const { data: res } = await getSuggestListAPI(this.kw)
        // 将搜索关键词高亮显示
        this.hlightKeywords(res.data.options)
        // 将搜索建议存放到suggestList中
        this.suggestList = res.data.options
        const newHistory = this.history.filter(item => item !== this.kw)
        newHistory.unshift(this.kw)
        this.history = newHistory
      } catch {
        this.$toast('获取搜索建议失败')
      }
    },
    // 高亮关键词的方法
    hlightKeywords(arr) {
      // 正则表达式 i 忽略大小写 g 全局匹配
      const reg = new RegExp(this.kw, 'ig')
      // 循环数组
      arr.forEach((item, index) => {
        arr[index] = item.replace(reg, val => {
          return `<span style="color: red; font-weight: bold">${val}</span>`
        })
      })
    },
    // 跳转到搜索结果页
    gotoSerachResult(e) {
      const kw = e.currentTarget.innerText
      this.$router.push('/search/' + kw)
    }
  },
  watch: {
    // 监听history的变化
    history(newVal) {
      // 保存到本地存储
      localStorage.setItem('history', JSON.stringify(newVal))
    }
  }
}
</script>

<style lang="less">
.search-container {
  .search-header {
    display: flex;
    align-items: center;
    height: 46px;
    overflow: hidden;
    background-color: #007BFF;
    .van-icon-arrow-left {
      padding-left: 14px;
    }
    .van-search {
      flex: 1;
    }
  }
  .sugg-list {
    .sugg-item {
      padding: 0 14px;
      border: 1px solid #f8f8f8;
      font-size: 14px;
      line-height: 40px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .search-history {
    .history-icon {
      font-size: 16px;
      line-height: inherit;
    }
    .history-list {
      padding: 0 10px;
      .history-item {
        display: inline-block;
        padding: 8px 14px;
        margin: 10px 8px 0 8px ;
        border-radius: 10px;
        font-size: 12px;
        background-color: #efefef;
      }
    }
  }
}
</style>
