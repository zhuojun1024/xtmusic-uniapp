<template>
  <view class="login-wrapper">
    <view class="login-title">
      扫码登录
    </view>
    <view class="qr-wrapper">
      <image class="qr-img" :src="qrImg"></image>
      <view class="qr-tips" v-if="[800, 802].includes(qrStatus)">
       <view v-if="qrStatus === 800">
          <view>二维码已失效</view>
          <view style="color: #1890ff;" @click="getQrCode">点击刷新</view>
        </view>
        <view v-else-if="qrStatus === 802">
          <view>扫描成功</view>
          <view>请在手机上确认登录</view>
        </view>
      </view>
    </view>
    <view class="login-tips">
      使用<text>网易云音乐APP</text>扫码登录
    </view>
  </view>
</template>

<script>
  import api from './api'
  import { GET_USER_INFO } from '@/store/mutations-types.js'
  export default {
    data() {
      return {
        key: '',
        qrImg: '',
        qrStatus: '',
        timer: undefined
      }
    },
    onLoad () {
      this.getQrCode()
      this.timer = setInterval(this.ckeckStatus, 1000)
    },
    onShow () {
      this.ckeckStatus()
      this.timer = setInterval(this.ckeckStatus, 1000)
    },
    onHide() {
      clearInterval(this.timer)
    },
    onUnload () {
      clearInterval(this.timer)
    },
    methods: {
      async getQrCode () {
        // 重置二维码状态
        this.qrStatus = ''
        // 获取二维码key
        const timestamp = new Date().getTime() // 清除缓存
        this.key = await api.getQrKey({ timestamp })
          .then(res => res.data.unikey)
          .catch(e => {
            uni.showToast({ icon: 'error', title: '获取二维码失败：' + e })
          })
        // 获取二维码
        if (this.key) {
          const params = {
            key: this.key,
            qrimg: 'base64',
            timestamp
          }
          this.qrImg = await api.getQrImg(params)
            .then(res => res.data.qrimg)
            .catch(e => {
              uni.showToast({ icon: 'error', title: '获取二维码失败：' + e })
            })
        }
      },
      ckeckStatus () {
        if (this.key) {
          const timestamp = new Date().getTime() // 清除缓存
          api.getQrStatus({ key: this.key, timestamp }).then(res => {
            this.qrStatus = res.code
            if (this.qrStatus === 803 && res.cookie) {
              clearInterval(this.timer)
              uni.setStorageSync('cookie', res.cookie)
              this.getUserInfo()
            }
          })
        }
      },
      getUserInfo () {
        this.$store.dispatch(GET_USER_INFO).then(res => {
          uni.switchTab({ url: '/pages/search/search' })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-wrapper {
    padding: 24px 0;
    text-align: center;
    .login-title {
       font-size: 18px;
       font-weight: 600;
    }
    .qr-wrapper {
      position: relative;
      margin-top: 12px;
      .qr-img, .qr-tips  {
        width: 240px;
        height: 240px;
      }
      .qr-img {
        background-color: rgba(0, 0, 0, 0.05);
      }
      .qr-tips {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .login-tips {
      margin-top: 12px;
      text {
        padding: 0 4px;
        color: #1890ff;
      }
    }
  }
</style>
