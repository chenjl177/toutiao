<template>
  <div class="searchResult-container">
    <!-- 标题区域 -->
    <van-nav-bar
      title="搜索结果"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <!-- 上拉加载更多 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- 文章Item组件 -->
      <art-item
      v-for="(item, index) in searchList"
      :key="index"
      :article="item"
      :closable="false"></art-item>
    </van-list>
  </div>
</template>

<script>
// 获取搜索结果API
import { getSearchResultAPI } from '@/api/serachAPI'
// 导入文章的Item项组件
import ArtItem from '@/components/ArtItem/ArtItem.vue'
export default {
  name: 'SearchResult',
  components: {
    ArtItem
  },
  data() {
    return {
      // 页码值
      page: 1,
      // 搜索结果
      searchList: [],
      // 上拉加载
      loading: false,
      // 是否加载完毕
      finished: false
    }
  },
  methods: {
    async initSearchList() {
      try {
        // 正则获取搜索关键词
        const kw = window.location.href.match('[^/]+(?!.*/)')
        const { data: res } = await getSearchResultAPI(kw[0], this.page)
        // 将结果赋值给searchList
        this.searchList = [...this.searchList, ...res.data.results]
        this.loading = false
        if (res.data.results.length === 0) {
          this.finished = true
        }
        this.page += 1
      } catch {
        this.$toast('获取文章列表数据失败')
      }
    },
    // 上拉加载事件
    onLoad() {
      this.initSearchList()
    }
  },
  created() {
    this.initSearchList()
  }
}
</script>

<style lang="less">
.searchResult-container {
  padding-top: 46px;
  .van-nav-bar {
    .van-icon {
      color: white;
    }
  }
}
</style>
