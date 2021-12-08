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
          placeholder="情输入手机号"
        />
      </uni-forms-item>
      <uni-forms-item
        label="密码"
        name="password"
      >
        <uni-easyinput
          v-model="formData.password"
          type="password"
          placeholder="情输入密码"
        />
      </uni-forms-item>
    </uni-forms>
    <button
      class="button-default"
      :loading="loading"
      @click="login"
    >
      登录
    </button>
	</view>
</template>

<script>
  import api from '@/api/login.js'
  import { GET_USER_INFO } from '@/store/mutations-types.js'
	export default {
		data() {
			return {
        loading: false,
				formData: {
          phone: undefined,
          password: undefined
        },
        rules: {
          phone: {
            rules: [
              { required: true, errorMessage: '请输入手机号' },
              { pattern: '^[1][3,4,5,7,8,9][0-9]{9}$', errorMessage: '手机号不正确' }
            ]
          },
          password: {
            rules: [
              { required: true, errorMessage: '请输入密码' }
            ]
          }
        }
			}
		},
    methods: {
      login () {
        this.$refs.form.validate().then(formData => {
          this.loading = true
          api.loginCellPhone(formData).then(res => {
            uni.setStorageSync('cookie', res.cookie)
            this.getUserInfo()
          }).catch(e => {
            uni.showToast({
              icon: 'error',
              title: '登录失败：' + e
            })
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
    margin-bottom: 48px;
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
  .button-default {
    margin-top: 12px;
  }
}
</style>
