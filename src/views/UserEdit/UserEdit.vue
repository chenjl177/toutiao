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
import dayjs from 'dayjs'
import { mapActions, mapState } from 'vuex'
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
    ...mapState(['userProfile'])
  },
  methods: {
    ...mapActions(['initUserProfile']),
    onNameChange() {
      this.showNameDialog = true
      this.name = this.userProfile.name
      this.$nextTick(() => {
        this.$refs.nameRef.focus()
      })
    },
    onBirthdayChange() {
      this.currentDate = this.userProfile.birthday ? new Date(this.userProfile.birthday) : new Date()
      this.showBirthday = true
    },
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
    beforeClose(action, done) {
      if (action === 'cancel') return done()
      if (this.name === '' || this.name.length > 7) {
        this.$notify({ type: 'warning', message: '名称的长度为1-7个字符' })
        this.$refs.nameRef.focus()
        return done(false)
      }
      this.updateName(done)
    },
    async onFileChange(e) {
      try {
        const files = e.currentTarget.files
        if (files.length === 0) return
        const fd = new FormData()
        fd.append('photo', files[0])
        await updateUserAvatarAPI(fd)
        this.initUserProfile()
        this.$notify({ type: 'success', message: '头像修改成功！' })
      } catch {
        this.$toast('头像修改失败')
      }
    }
  },
  created() {
    if (this.userProfile) {
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
