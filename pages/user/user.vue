<template>
  <view>
    <view class="user-wrapper">
      <image
        mode="aspectFill"
        :src="userInfo.backgroundUrl"
      />
      <view class="user-info">
        <image :src="userInfo.avatarUrl" />
        <view class="user-name">
          {{ userInfo.nickname }}
        </view>
      </view>
      <view
        class="logout-button"
        @click="logout"
      >
        退出登录
      </view>
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
        uni.showModal({
          title: '提示',
          content: '确定要退出登录吗？',
          confirmColor: '#EA2000',
          success: res => {
            if (res.confirm) {
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
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.user-wrapper {
  position: relative;
  > image {
    width: 100%;
    height: 200px;
  }
  .user-info {
    width: calc(100% - 48px);
    height: 72px;
    padding-top: 48px;
    position: relative;
    top: -40px;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: white;
    box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    > image {
      width: 80px;
      height: 80px;
      position: absolute;
      top: -40px;
      left: 0;
      right: 0;
      margin: 0 auto;
      border-radius: 40px;
      box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.1);
    }
    .user-name {
      margin-top: 4px;
      text-align: center;
      font-size: 16px;
      color: black;
    }
  }
  .logout-button {
    width: calc(100% - 48px);
    height: 40px;
    color: #EA2000;
    line-height: 40px;
    text-align: center;
    margin: 0 auto;
    background-color: white;
    box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
  }
}
</style>
