<template>
  <div class="comment-post">
    <!-- 评论导航栏 -->
    <van-tabbar fixed>
      <!-- 评论提示按钮 -->
      <van-button class="write-btn" type="default" round @click="onPostShow">
        <van-icon name="edit" />
        <span>写评论</span>
      </van-button>
      <!-- 评论数量 -->
      <van-badge :content="commentCount" max="99">
        <van-icon name="comment-o" @click="scrollToCmtList" />
      </van-badge>
      <!-- 点赞按钮 -->
      <van-icon name="good-job-o" />
      <!-- 收藏按钮 -->
      <van-icon name="star-o" />
      <!-- 分享按钮 -->
      <van-icon name="share-o" @click="isShareShow = true" />
    </van-tabbar>
    <!-- 评论弹出层 -->
    <van-popup v-model="isPostShow" position="bottom" round>
      <van-field
      ref="iptCmt"
      class="post-field"
      v-model="message"
      type="textarea"
      rows="2"
      maxlength="50"
      autosize
      :placeholder="isTips"
      show-word-limit/>
      <div class="post-btn">
        <van-button :disabled="isRelese" @click="pubCmt">发布</van-button>
      </div>
    </van-popup>
    <!-- 分享弹出层 -->
    <van-share-sheet
      v-model="isShareShow"
      title="立即分享给好友"
      :options="options"
      @select="onSelect"
    />
  </div>
</template>

<script>
// 发布评论API
import { pubCommentAPI } from '@/api/commentsAPI'
import { animate } from 'popmotion'
export default {
  name: 'CommentPost',
  props: {
    // 文章id
    artId: {
      type: String,
      required: true
    },
    // 评论数量
    commentCount: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // 留言
      message: '',
      // 发布评论弹出层
      isPostShow: false,
      // 回复
      isTips: '请输入留言',
      // 用户id
      userId: '',
      // 控制分享弹出层
      isShareShow: false,
      // 分享弹出层显示内容
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' }
      ]
    }
  },
  computed: {
    // 当输入框为空时，发布按钮禁用
    isRelese() {
      return this.message === ''
    }
  },
  methods: {
    // 弹出输入框
    onPostShow() {
      this.isPostShow = true
      // DOM元素加载完成后，输入框获取焦点
      this.$nextTick(() => {
        this.$refs.iptCmt.focus()
      })
    },
    // 发表评论
    async pubCmt() {
      try {
        if (this.userId === '') {
          const { data: res } = await pubCommentAPI(this.artId, this.message)
          // 在父组件追加评论
          this.$emit('commentChange', res.data.new_obj)
        } else {
          const { data: res } = await pubCommentAPI(this.userId, this.message, this.artId)
          // 在父组件追加评论
          this.$emit('commentChange', res.data.new_obj)
          this.userId = ''
        }
        // 收回弹出层
        this.isPostShow = false
        // 清空输入框
        this.message = ''
      } catch {
        this.$toast('发布评论失败')
      }
    },
    // 父组件控制弹出层
    open(name, id) {
      this.onPostShow()
      this.isTips = `回复 ${name}：`
      this.userId = id
    },
    // 点击评论按钮，平滑跳转到评论区
    scrollToCmtList() {
      // 当前位置
      const now = window.scrollY
      // 文章高度
      const dist = document.querySelector('.article-container').offsetHeight
      animate({
        from: now,
        to: dist,
        onUpdate: latest => window.scrollTo(0, latest)
      })
    },
    // 分享面板
    onSelect(options) {
      this.$toast(options.name)
      this.isShareShow = false
    }
  }
}
</script>

<style lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .van-tabbar--fixed {
    align-items: center;
    justify-content: space-around;
    .van-button--default {
      height: 30px;
      width: 200px;
    }
    .van-badge__wrapper {
      height: 24px;
    }
  }
  .post-field {
    background-color: #f5f7f9
  }
  .post-btn {
    position: relative;
    height: 44px;
    .van-button {
      position: absolute;
      right: 0;
      width: 150px;
      border: none;
      padding: 0;
      color: #318cd6;
    }
    &::before {
      display: none;
    }
  }
}
</style>
