<script>
  import api from '@/api/music.js'
  import {
    GET_USER_INFO,
    SET_BAM,
    SET_CURRENT_TIME,
    SET_DURATION,
    SET_PAUSED
  } from '@/store/mutations-types.js'
	export default {
    data () {
      return {
      }
    },
    computed: {
      userInfo () {
        return this.$store.getters.userInfo
      },
      bam () {
        return this.$store.getters.bam
      },
      currentMusic () {
        return this.$store.getters.currentMusic
      }
    },
    watch: {
      currentMusic (newVal) {
        this.getMusicUrl(newVal.id)
      }
    },
		onLaunch: function() {
      // 判断登录状态
      const cookie = uni.getStorageSync('cookie')
      if (!cookie) {
        uni.reLaunch({
          url: 'pages/login/login'
        })
      } else if (!this.userInfo.userId) {
        this.getUserInfo()
      }
      // 添加背景音乐事件监听
      // #ifdef H5
      const bam = uni.createInnerAudioContext()
      // #endif
      // #ifndef H5
      const bam = uni.getBackgroundAudioManager()
      // #endif
      this.$store.commit(SET_BAM, bam)
      this.addBAMEventListener()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
    methods: {
      addBAMEventListener () {
        const events = [
          'onPlay',
          'onPause',
          'onStop',
          'onEnded',
          'onTimeUpdate',
          'onPrev',
          'onNext',
          'onWaiting',
          'onCanplay'
        ]
        for (const event of events) {
          if (typeof this.bam[event] === 'function') {
            this.bam[event](this[event])
          }
        }
      },
      onPlay (e) {
        this.$store.commit(SET_PAUSED, this.bam.paused)
      },
      onPause (e) {
        this.$store.commit(SET_PAUSED, this.bam.paused)
      },
      onStop (e) {
        this.$store.commit(SET_PAUSED, this.bam.paused)
      },
      onEnded (e) {
        this.$store.commit(SET_PAUSED, this.bam.paused)
      },
      onTimeUpdate (e) {
        this.$store.commit(SET_CURRENT_TIME, this.bam.currentTime)
      },
      onPrev (e) {
        console.log('onPrev：', e)
      },
      onNext (e) {
        console.log('onNext：', e)
      },
      onWaiting (e) {
        console.log('onWaiting：', e)
      },
      onCanplay (e) {
        console.log('onCanplay：', e)
        this.$store.commit(SET_DURATION, this.bam.duration)
      },
      getMusicUrl (id) {
        const timestamp = new Date().getTime()
        const params = { id, timestamp }
        uni.showLoading({
          title: '加载中'
        })
        api.getMusicUrl(params).then(res => {
          if (res.data && res.data.length) {
            const url = res.data[0].url
            // #ifndef H5
            const { name, ar, al } = this.currentMusic
            this.bam.title = name
            this.bam.singer = ar
            this.bam.coverImgUrl = al.picUrl
            // #endif
            this.bam.src = url
            // #ifdef H5
            this.bam.play()
            // #endif
          }
        }).catch(e => {
          uni.showToast({
            icon: 'error',
            title: '播放失败：' + e
          })
          console.log('播放失败：', e)
        }).finally(() => {
          uni.hideLoading()
        })
      },
      getUserInfo () {
        this.$store.dispatch(GET_USER_INFO).then(res => {
          uni.switchTab({ url: '/pages/search/search' })
        })
      }
    }
	}
</script>

<style lang="scss">
  $theme_color: #EA2000;
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss';
	/* #ifndef APP-NVUE */
	@import '@/static/iconfont.css';
	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}
  .button-default {
    color: white;
    background-color: $theme_color;
  }

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
