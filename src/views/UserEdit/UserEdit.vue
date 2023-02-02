<template>
  <div class="user-edit-container">
    <!-- 标题区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" center>
        <template #default>
          <van-image class="avatar" :src="userProfile.photo" round @click="$refs.fileRef.click()" />
          <input type="file" accept="image/*" @change="onFileChange" v-show="false" ref="fileRef" />
        </template>
      </van-cell>
      <van-cell title="名称" @click="onNameChange" :value="userProfile.name"/>
      <van-cell title="生日" @click="onBirthdayChange" :value="userProfile.birthday"/>
    </van-cell-group>
    <!-- 修改用户名称 -->
    <van-dialog
    v-model="showNameDialog"
    title="修改名称"
    show-cancel-button
    :before-close="beforeClose">
      <van-field
      ref="nameRef"
      v-model="name"
      label="用户名"
      placeholder="请输入用户名" />
    </van-dialog>
    <!-- 修改生日 -->
    <van-action-sheet v-model="showBirthday">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthday = false"
        @confirm="updateBirthday"
      />
    </van-action-sheet>
  </div>
</template>

<script>
// 引入时间插件
import dayjs from 'dayjs'
// 导入vuex的函数
import { mapActions, mapState } from 'vuex'
// 更新用户简介信息API， 更新用户头像图片API
import { updateUserProfileAPI, updateUserAvatarAPI } from '@/api/userAPI'
export default {
  name: 'UserEdit',
  data() {
    return {
      // 名称弹出框
      showNameDialog: false,
      // 生日弹出框
      showBirthday: false,
      // 用户名称
      name: ' ',
      currentDate: new Date(),
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2050, 11, 31)
    }
  },
  computed: {
    // 用户简介信息
    ...mapState(['userProfile'])
  },
  methods: {
    // 获取用户简介信息API
    ...mapActions(['initUserProfile']),
    // 更改用户名
    onNameChange() {
      // 弹出更改框
      this.showNameDialog = true
      this.name = this.userProfile.name
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs.nameRef.focus()
      })
    },
    // 更改生日
    onBirthdayChange() {
      // 获取当前生日，无则获取当前日期
      this.currentDate = this.userProfile.birthday ? new Date(this.userProfile.birthday) : new Date()
      // 弹出时间选择框
      this.showBirthday = true
    },
    // 更改用户API
    async updateName(done) {
      try {
        await updateUserProfileAPI({ name: this.name })
        done()
        this.initUserProfile()
        this.$notify({ type: 'success', message: '名称更新成功！' })
      } catch {
        this.$toast('名称更新失败')
      }
    },
    // 更改生日API
    async updateBirthday(value) {
      try {
        const dateStr = dayjs(value).format('YYYY-MM-DD')
        await updateUserProfileAPI({ birthday: dateStr })
        this.showBirthday = false
        this.initUserProfile()
        this.$notify({ type: 'success', message: '生日修改成功！' })
      } catch {
        this.$toast('生日修改失败')
      }
    },
    // Digiog弹出框，关闭前的回调函数
    beforeClose(action, done) {
      // 点击了取消按钮，则关闭弹出框
      if (action === 'cancel') return done()
      // 判断名字是否合法
      if (this.name === '' || this.name.length > 7) {
        this.$notify({ type: 'warning', message: '名称的长度为1-7个字符' })
        this.$refs.nameRef.focus()
        // 阻止弹出层关闭
        return done(false)
      }
      // 名字合法，则调用更改名字API
      this.updateName(done)
    },
    // 更改头像
    async onFileChange(e) {
      try {
        // 获取用户选择的文件列表
        const files = e.currentTarget.files
        // 判断是否有文件
        if (files.length === 0) return
        // 创建FormData对象
        const fd = new FormData()
        // 向fd中追加数据
        fd.append('photo', files[0])
        // 更新用户头像
        await updateUserAvatarAPI(fd)
        // 更新用户简介信息
        this.initUserProfile()
        this.$notify({ type: 'success', message: '头像修改成功！' })
      } catch {
        this.$toast('头像修改失败')
      }
    }
  },
  created() {
    // 判断是否有用户简介信息
    if (this.userProfile) {
      // 获取用户简介的API
      this.initUserProfile()
    }
  }
}
</script>

<style lang="less">
.user-edit-container {
  padding-top: 46px;
  .van-nav-bar {
    .van-icon {
      color: #fff;
    }
  }
  .action-card {
    .avatar {
      height: 50px;
      width: 50px;
    }
  }
}
</style>
