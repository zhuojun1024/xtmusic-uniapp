<template>
	<view class="login-wrapper">
    <view class="login-title">
      <image src="../../static/logo.png" />
      <text>网易云音乐</text>
    </view>
		<uni-forms
      ref="form"
      :model-value="formData"
      :rules="rules"
    >
      <uni-forms-item
        label="手机号"
        name="phone"
      >
        <uni-easyinput
          v-model="formData.phone"
          placeholder="请输入手机号"
        />
      </uni-forms-item>
      <uni-forms-item
        v-if="loginType === 'captcha'"
        label="验证码"
        name="captcha"
      >
        <view class="captcha-form">
          <uni-easyinput
            class="captcha-input"
            v-model="formData.captcha"
            placeholder="请输入验证码"
          />
          <button
            class="captcha-button"
            size="mini"
            :disabled="countdown > 0"
            @click="sendCaptcha"
          >
            获取验证码
            {{ countdown > 0 ? `(${countdown})` : '' }}
          </button>
        </view>
      </uni-forms-item>
      <uni-forms-item
        v-if="loginType === 'password'"
        label="密码"
        name="password"
      >
        <uni-easyinput
          v-model="formData.password"
          type="password"
          placeholder="请输入密码"
        />
      </uni-forms-item>
    </uni-forms>
    <view class="login-type-button">
      <text @click="toggleLoginType">
        {{ loginType === 'password' ? '验证码登录' : '密码登录' }}
      </text>
    </view>
    <button
      class="button-default login-button"
      :loading="loading"
      @click="login"
    >
      登录
    </button>
	</view>
</template>

<script>
  import md5 from '@/utils/md5.js'
  import globalApi from '@/api/login.js'
  import api from './api'
  import { GET_USER_INFO } from '@/store/mutations-types.js'
	export default {
		data() {
			return {
        timer: undefined,
        countdown: 0,
        SEND_CAPTCHA: 'SEND_CAPTCHA',
        loginType: 'captcha',
        loading: false,
				formData: {
          phone: undefined,
          captcha: undefined,
          password: undefined
        },
        rules: {
          phone: {
            rules: [
              { required: true, errorMessage: '请输入手机号' },
              { pattern: '^[1][3,4,5,7,8,9][0-9]{9}$', errorMessage: '手机号不正确' }
            ]
          },
          captcha: {
            rules: [{ required: this.loginType === 'captcha', errorMessage: '请输入验证码' }]
          },
          password: {
            rules: [
              { required: this.loginType === 'password', errorMessage: '请输入密码' }
            ]
          },
          
        }
			}
		},
    onLoad () {
      // 计算发送验证码禁用时长
      this.getCountdown()
      this.timer = setInterval(this.getCountdown, 500)
    },
    onUnload () {
      clearInterval(this.timer)
    },
    methods: {
      toggleLoginType () {
        this.loginType = this.loginType === 'password' ? 'captcha' : 'password'
      },
      getCountdown () {
        const timestamp = uni.getStorageSync(this.SEND_CAPTCHA)
        if (timestamp) {
          const countdown = parseInt((timestamp - new Date().getTime()) / 1000)
          this.countdown = countdown < 0 ? 0 : countdown
        } else {
          this.countdown = 0
        }
      },
      setCountdown () {
        const timestamp = new Date().getTime() + 1000 * 60
        uni.setStorageSync(this.SEND_CAPTCHA, timestamp)
      },
      sendCaptcha () {
        this.$refs.form.validateField(['phone']).then(res => {
          const params = { phone: res.phone }
          api.sendCaptcha(params).then(res => {
            if (res.code === 200) {
              uni.showToast({ icon: 'none', title: '验证码已发送' })
            } else {
              throw res.message
            }
          }).catch(e => {
            uni.showToast({ icon: 'error', title: '发送失败：' + e })
          }).finally(() => {
            this.setCountdown()
            this.getCountdown()
          })
        })
      },
      login () {
        this.$refs.form.validate().then(({ phone, captcha, password }) => {
          this.loading = true
          const params = {
            phone,
            md5_password: this.loginType === 'password' ? md5.hex_md5(password) : undefined,
            captcha
          }
          globalApi.loginCellPhone(params).then(res => {
            uni.setStorageSync('cookie', res.cookie)
            this.getUserInfo()
          }).catch(e => {
            uni.showToast({
              icon: 'error',
              title: '登录失败：' + e
            })
            console.error('登录失败：', e)
          }).finally(() => {
            this.loading = false
          })
        })
      },
      getUserInfo () {
        this.loading = true
        this.$store.dispatch(GET_USER_INFO).then(res => {
          uni.switchTab({ url: '/pages/search/search' })
        }).finally(() => {
          uni.removeStorageSync(this.SEND_CAPTCHA)
          this.loading = false
        })
      }
    }
	}
</script>

<style lang="scss" scoped>
.login-wrapper {
  padding: 24px;
  .login-title {
    font-size: 28px;
    font-weight: 600;
    margin: 32px 0 48px 0;
    text-align: center;
    image {
      width: 48px;
      height: 48px;
      margin-right: 12px;
    }
    image, text {
      display: inline-block;
      vertical-align: middle;
    }
  }
  .captcha-form {
    .captcha-input, .captcha-button {
      display: inline-block;
      vertical-align: middle;
    }
    .captcha-input {
      width: calc(100% - 144px);
    }
    .captcha-button {
      width: 136px;
      height: 36px;
      line-height: 36px;
      margin-left: 8px;
    }
  }
  .login-type-button {
    text-align: right;
    color: #666666;
  }
  .login-button {
    margin-top: 12px;
  }
}
</style>
