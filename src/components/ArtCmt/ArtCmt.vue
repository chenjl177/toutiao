<template>
  <div class="ArtCmt-container">
    <van-list
      class="cmt-list"
      v-model="loading"
      :finished="finished"
      offset="100"
      :immediate-check="false"
      finished-text="没有更多了"
      @load="onLoad"
    >
    <!-- 评论item项 -->
      <van-cell class="cmt-item" inset v-for="(item, index) in cmtlist" :key="index">
        <!-- 头部用户信息区域 -->
        <van-cell class="cmt-header">
          <template #title>
            <!-- 用户头像 -->
            <img :src="item.aut_photo" alt="" class="avatar">
            <!-- 用户名 -->
            <span class="uname">{{ item.aut_name }}</span>
          </template>
        </van-cell>
        <!-- 内容区 -->
        <van-cell class="cmt-content">
          <!-- 评论内容 -->
          <template #title>
            <span>{{ item.content }}</span>
          </template>
          <template #label>
            <!-- 评论时间 -->
            <span class="cmt-date">{{ item.pubdate | dateFormat }}</span>
            <!-- 回复按钮 -->
            <div class="cmt-more">
              <van-icon @click="onPostShow(item.aut_name, item.aut_id)" name="chat-o" size="20" />
            </div>
            <!-- 点赞 -->
            <div class="cmt-like">
              <van-icon v-if="item.is_liking" @click="delLike(item)" name="like" size="20" color="red"/>
              <van-icon v-else @click="addLike(item)" name="like-o" size="20" color="gray"/>
            </div>
            <!-- 点赞数量 -->
            <span class="like-count">{{ item.like_count === 0?null:item.like_count }}</span>
          </template>
        </van-cell>
      </van-cell>
    </van-list>
    <!-- 评论框 -->
    <comment-post ref="cmtPost" :commentCount="cmtCount" :artId="artId" @commentChange="getComment" ></comment-post>
  </div>
</template>

<script>
// 获取文章评论,评论点赞,取消评论点赞
import { getCmtListAPI, addLikeCmtAPI, delLikeCmtAPI } from '@/api/articleAPI'
// 发布评论弹出层
import CommentPost from '@/components/Comment/CommentPost.vue'
export default {
  name: 'CommentItem',
  components: {
    // 发布评论弹出层
    CommentPost
  },
  props: {
    // 文章Id
    artId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      // 文章的评论列表数组
      cmtlist: [],
      cmtCount: 0,
      // 偏移量
      offset: null,
      // 上拉加载
      loading: false,
      // 数据是否加载完成
      finished: false
    }
  },
  methods: {
    // 获取评论
    async initCmtList() {
      try {
        const { data: res } = await getCmtListAPI(this.artId, this.offset)
        console.log(res)
        // 为偏移量赋值
        this.offset = res.data.last_id
        // 将获取到的评论数据存放在cmtlist数组中
        this.cmtlist = [...this.cmtlist, ...res.data.results]
        // 下拉加载重置为false
        this.loading = false
        // 当数据加载完成时，将finished改为true
        if (res.data.results.length === 0 || res.data.end_id === res.data.last_id) {
          this.finished = true
          this.cmtCount = res.data.results.length
        }
      } catch {
        this.$toast('获取评论失败')
      }
    },
    // 评论数量
    getComment(comment) {
      this.cmtlist.unshift(comment)
      this.cmtCount += 1
    },
    // 上拉加载
    onLoad() {
      if (this.offset !== null) {
        this.initCmtList()
      }
    },
    // 评论点赞
    async addLike(item) {
      try {
        await addLikeCmtAPI(item.com_id.toString())
        item.is_liking = true
        item.like_count += 1
      } catch {
        this.$toast('点赞失败')
      }
    },
    // 取消评论点赞
    async delLike(item) {
      try {
        await delLikeCmtAPI(item.com_id.toString())
        item.is_liking = false
        item.like_count -= 1
      } catch {
        this.$toast('取消点赞失败')
      }
    },
    // 打开子组件弹出层
    onPostShow(name, id) {
      this.$refs.cmtPost.open(name, id)
    }
  },
  created() {
    // 获取评论
    this.initCmtList()
  }
}
</script>

<style lang="less">
.ArtCmt-container {
  .cmt-list {
    .cmt-item {
      .van-cell {
        padding: 0;
      }
      .cmt-header {
        &::after {
          border: none;
        }
        .van-cell__title {
          display: flex;
          align-items: center;
          .avatar {
            margin-right: 10px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #f8f8f8;
          }
          .uname {
            display: inline-block;
            margin-bottom: 18px;
            height: 12px;
            font-weight: bolder;
          }
        }
      }
      .cmt-content {
        padding-left: 40px;
        .van-cell__label {
          display: flex;
          align-items: center;
          .cmt-date {
            flex: 1;
          }
          .cmt-like {
            margin-left: 10px;
            margin-right: 5px;
          }
          .like-count {
            width: 20px;
          }
        }
      }
    }
  }
}
</style>
