<template>
  <div class="ArtList-container">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :disabled="finished">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <!-- @remove-article自定义事件，接收ArtItem组件传来的文章ID -->
        <ArtItem v-for="(item, index) in artlist" :key="index" :article="item" @remove-article="removeArticle"></ArtItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 获取文章列表API
import { getArtListAPI } from '@/api/homeAPI'
// 文章子组件
import ArtItem from '@/components/ArtItem/ArtItem.vue'
export default {
  name: 'ArtList',
  components: {
    ArtItem
  },
  props: {
    // 存放频道id
    channelId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // 存放文章列表数组
      artlist: [],
      // 获取文章列表的时间戳
      timestamp: Date.now(),
      // 上拉加载
      loading: false,
      // 表示是否加载完毕
      // true表示加载完毕
      finished: false,
      // 下拉刷新
      isLoading: false
    }
  },
  methods: {
    // 获取数据事件
    async initArtList(isRefresh) {
      try {
        const { data: res } = await getArtListAPI(this.channelId, this.timestamp)
        // 为时间戳重新赋值
        this.timestamp = res.data.pre_timestamp
        // 判断是否为下拉刷新
        if (isRefresh) {
          // 下拉刷新，新数据在前
          this.artlist = [...res.data.results, ...this.artlist]
          // 重置isLoading
          this.isLoading = false
        } else {
          // 上拉加载，新数据在后
          this.artlist = [...this.artlist, ...res.data.results]
          // 加载完毕，loading重置为false
          this.loading = false
        }

        // 判断数据是否加载完毕
        if (res.data.pre_timestamp === null) {
          this.finished = true
        }
      } catch {
        this.$toast('获取文章列表失败')
      }
    },
    // 上拉加载事件
    onLoad() {
      this.initArtList()
    },
    // 下拉刷新事件
    onRefresh() {
      this.initArtList(true)
    },
    // 移除不感兴趣文章事件
    removeArticle(id) {
      // 利用filter数组方法移除指定id文章
      this.artlist = this.artlist.filter(item => item.art_id.toString() !== id)
      // 判断剩余文章数量是否小于10
      if (this.artlist.length < 10) {
        // 上拉加载，获取数据
        this.initArtList()
      }
    }
  },
  created() {
    // 组件创建时，调用请求API
    this.initArtList()
  }
}
</script>

<style lang="less">
</style>
