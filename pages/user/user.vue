<template>
  <view>
    <view class="user-wrapper">
      <image :src="userInfo.avatarUrl" />
      <view class="nickname">{{ userInfo.nickname }}</view>
      <button @click="logout">注销登录</button>
    </view>
    <play-control />
  </view>
</template>

<script>
  import api from '@/api/login.js'
  import { LOGIN_OUT, RESET_STATE } from '@/store/mutations-types.js'
  export default {
    computed: {
      userInfo () {
        return this.$store.getters.userInfo
      }
    },
    methods: {
      logout () {
        api.logout().finally(() => {
          // 移除用户信息
          this.$store.commit(LOGIN_OUT)
          // 移除cookie
          uni.removeStorageSync('cookie')
          // 重置播放状态
          this.$store.commit(RESET_STATE)
          // 前往登录页
          uni.reLaunch({
            url: '/pages/login/login',
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.user-wrapper {
  text-align: center;
  image {
    width: 80px;
    height: 80px;
    margin-top: 32px;
  }
  .nickname {
    font-size: 16px;
    margin-top: 8px;
  }
  button {
    width: 128px;
    margin-top: 32px;
  }
}
</style>
