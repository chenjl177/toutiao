<template>
  <div class="ArtItem-container">
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <span>{{ article.title }}</span>
          <img class="thumb" v-if="article.cover.type === 1" v-lazy="article.cover.images[0]" alt="">
        </div>
        <div class="thumb-box" v-if="article.cover.type === 3" >
          <img class="thumb" v-for="(item, index) in article.cover.images" :key="index" v-lazy="item" alt="">
        </div>
      </template>
      <template #label>
        <div class="label-box">
          <!-- 文章信息 -->
          <span>{{ article.aut_name}} &nbsp;&nbsp; {{ article.comm_count }} &nbsp;&nbsp; {{ article.pubdate | dateFormat  }}</span>
          <!-- 关闭按钮 -->
          <van-icon name="cross" @click.stop="show = true" />
        </div>
      </template>
    </van-cell>
    <!-- 反馈的动作面板 -->
    <!-- @closed事件表示关闭面板后执行的操作 -->
    <van-action-sheet v-model="show" cancel-text="取消" :closeable="false" @closed="isFirst = true" get-container="body">
      <!-- 展示一级反馈面板 -->
      <div v-if="isFirst">
        <van-cell v-for="item in actions" :key="item.name" :title="item.name" clickable class="center-title" @click="onCellClick(item.name)"/>
      </div>
      <!-- 二级反馈面板 -->
      <div v-else>
        <van-cell v-for="item in reports" :key="item.type" :title="item.label" clickable title-class="center-title" @click="reportArticle(item.type)" />
        <van-cell title="返回" clickable title-class="center-title" @click="isFirst = true" />
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
// 导入二级反馈面板选项数据
import reports from '@/api/reports'
// 导入设置文章不感兴趣API,导入举报文章的API
import { dislikeArticleAPI, reportArticleAPI } from '@/api/homeAPI'
export default {
  name: 'ArtItem',
  props: {
    // 文章数据信息
    article: {
      type: Object,
      reuqired: true
    }
  },
  data() {
    return {
      // 是否展示反馈面板
      show: false,
      // 反馈面板内容
      actions: [
        { name: '不感兴趣' },
        { name: '反馈垃圾内容' },
        { name: '拉黑作者' }
      ],
      // 控制展示二级反馈面板
      isFirst: true,
      // 二级反馈面板内容
      reports
    }
  },
  computed: {
    // 计算属性，将文章ID转换成字符串格式
    artId() {
      return this.article.art_id.toString()
    }
  },
  methods: {
    // 一级反馈面板内容
    async onCellClick(name) {
      if (name === '不感兴趣') {
        // 通过API接口将文章设为不感兴趣
        const { data: res } = await dislikeArticleAPI(this.artId)
        // 成功后把文章ID传给父组件，将文章从列表中删除
        if (res.message === 'OK') {
          this.$emit('remove-article', this.artId)
        }
        // 关闭一级反馈面板
        this.show = false
      } else if (name === '拉黑作者') {
        this.show = false
      } else if (name === '反馈垃圾内容') {
        // 展示二级反馈面板
        this.isFirst = false
      }
    },
    // 举报文章事件
    async reportArticle(type) {
      try {
        await reportArticleAPI(this.artId, type)
        // 把文章ID传给父组件，将文章从列表中删除
        this.$emit('remove-article', this.artId)
        this.$toast('举报成功')
      } catch {
        this.$toast('举报失败')
      }
      // 关闭反馈动作面板
      this.show = false
    }
  }
}
</script>

<style lang="less">
.ArtItem-container {
  .label-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .thumb {
    width: 113px;
    height: 70px;
    background-color: #f8f8f8;
    object-fit: cover;
  }
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .thumb-box {
    display: flex;
    justify-content: space-between;
  }
}
.center-title {
    text-align: center;
}
</style>
