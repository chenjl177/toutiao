<template>
  <div class="articleDetail-container">
    <!-- 头部区域 -->
    <van-nav-bar
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <!-- 文章信息区 -->
    <div class="article-container" v-if="article">
      <h1 class="art-title">{{ article.title }}</h1>
      <van-cell center :title="article.aut_name" :label="article.pubdate | dateFormat">
        <template #icon>
          <img :src="article.aut_photo" alt="" class="avatar">
        </template>
        <template #default>
          <div>
            <van-button type="info" size="mini" v-if="article.is_followed" @click="setUnfollowed">已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain v-else @click="setFollowed">关注</van-button>
          </div>
        </template>
      </van-cell>
      <!-- 分割线 -->
      <van-divider/>
      <!-- 文章内容 -->
      <div class="art-content" v-html="article.content"></div>
      <!-- 分割线 -->
      <van-divider>End</van-divider>
      <div class="like-box">
        <van-button icon="good-job" type="danger" size="small" v-if="article.is_collected" @click="setDisLike">已点赞</van-button>
        <van-button icon="good-job-o" type="danger" size="small" plain v-else @click="setLike">点赞</van-button>
      </div>
    </div>
    <!-- 文章评论组件 -->
    <art-cmt :artId="id"></art-cmt>
  </div>
</template>

<script>
// 获取文章详情的API,关注用户,取消关注,点赞,取消点赞
import { getArticleDetailAPI, followUserAPI, unfollowUserAPI, addLikeAPI, delLikeAPI } from '@/api/articleAPI'
// 文章评论组件
import ArtCmt from '@/components/ArtCmt/ArtCmt.vue'
export default {
  name: 'ArticleDetail',
  components: {
    // 文章评论组件
    ArtCmt
  },
  // 路由传参 id
  props: ['id'],
  data() {
    return {
      // 文章信息对象
      article: null
    }
  },
  methods: {
    // 获取文章详情
    async initArticle() {
      try {
        const { data: res } = await getArticleDetailAPI(this.id)
        this.article = res.data
      } catch {
        this.$toast('获取文章详情失败')
      }
    },
    // 关注用户
    async setFollowed() {
      try {
        await followUserAPI(this.article.aut_id.toString())
        this.article.is_followed = true
        this.$toast('关注成功')
      } catch {
        this.$toast('关注失败')
      }
    },
    // 取消关注
    async setUnfollowed() {
      try {
        await unfollowUserAPI(this.article.aut_id.toString())
        this.article.is_followed = false
        this.$toast('取消关注成功')
      } catch {
        this.$toast('取消关注失败')
      }
    },
    // 对文章点赞
    async setLike() {
      try {
        await addLikeAPI(this.article.art_id.toString())
        this.article.is_collected = true
        this.$toast('点赞成功')
      } catch {
        this.$toast('点赞失败')
      }
    },
    // 取消文章点赞
    async setDisLike() {
      try {
        await delLikeAPI(this.article.art_id.toString())
        this.article.is_collected = false
        this.$toast('取消点赞成功')
      } catch {
        this.$toast('取消点赞失败')
      }
    }
  },
  created() {
    // 获取文章详情
    this.initArticle()
  }
}
</script>

<style lang="less">
.articleDetail-container {
  .van-nav-bar {
    .van-icon {
      color: white;
    }
  }
  .article-container {
    margin-top: 46px;
    padding: 10px;
    .art-title {
      margin: 10px 0 ;
      font-size: 16px;
      font-weight: bold;
    }
    .art-content {
      width: 100%;
      font-size: 12px;
      line-height: 24px;
      overflow: scroll;
      word-break: break-all;
    }
    .van-cell {
      padding: 5px 0;
      &::after {
        display: none;
      }
      .van-button {
        width: 50px;
      }
    }
    .avatar {
      margin-right: 5px;
      height: 60px;
      width: 60px;
      border-radius: 50%;
      border: none;
      background-color: #f8f8f8;
    }
    .like-box {
      display: flex;
      justify-content: center;
      .van-button {
        width: 80px;
      }
    }
  }
}
</style>
