<script>
  import api from '@/api/music.js'
  import {
    GET_USER_INFO,
    SET_BAM,
    TIME_UPDATE,
    SET_DURATION,
    SET_PAUSED,
    PLAY_PREV,
    PLAY_NEXT
  } from '@/store/mutations-types.js'
	export default {
    computed: {
      userInfo () {
        return this.$store.getters.userInfo
      },
      bam () {
        return this.$store.getters.bam
      }
    },
		onLaunch: function() {
      // this.hasPermission()
      // 添加背景音乐事件监听
      this.addBAMEventListener()
		},
		onShow: function() {
      this.hasPermission()
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
    methods: {
      hasPermission () {
        // 判断登录状态
        const cookie = uni.getStorageSync('cookie')
        if (!cookie) {
          uni.reLaunch({ url: '/pages/login/login' })
        } else if (!this.userInfo.userId) {
          this.getUserInfo()
        } else {
          // 如果已经有登录信息和用户信息，但是在登录页，则跳到首页
          const currentPages = getCurrentPages()
          const currentPage = currentPages[currentPages.length - 1] || {}
          const currentRoute = currentPage.route
          if (!currentRoute || currentRoute === 'pages/login/login') {
            uni.switchTab({ url: '/pages/search/search' })
          }
        }
      },
      addBAMEventListener () {
        const events = [
          'onPlay',
          'onPause',
          'onStop',
          'onEnded',
          'onTimeUpdate',
          'onPrev',
          'onNext'
          // 'onWaiting',
          // 'onCanplay'
        ]
        for (const event of events) {
          if (typeof this.bam[event] === 'function') {
            this.bam[event](this[event])
          }
        }
      },
      onPlay () {
        this.$store.commit(SET_PAUSED, this.bam.paused)
      },
      onPause () {
        this.$store.commit(SET_PAUSED, this.bam.paused)
      },
      onStop () {
        this.$store.commit(SET_PAUSED, this.bam.paused)
      },
      onEnded () {
        this.$store.commit(SET_PAUSED, this.bam.paused)
        this.$store.dispatch(PLAY_NEXT)
      },
      onTimeUpdate () {
        this.$store.commit(TIME_UPDATE, this.bam.currentTime)
        this.$store.commit(SET_DURATION, this.bam.duration)
      },
      onPrev () {
        this.$store.dispatch(PLAY_PREV)
      },
      onNext () {
        this.$store.dispatch(PLAY_NEXT)
      },
      getUserInfo () {
        this.$store.dispatch(GET_USER_INFO).then(res => {
          uni.switchTab({ url: '/pages/search/search' })
        }).catch(() => {
          uni.reLaunch({ url: '/pages/login/login' })
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
  // 自定义图标
	@import '@/static/iconfont.css';
	// 设置整个项目的背景色
	page {
    width: 100vw;
		background-color: #f5f5f5;
	}
  .button-default {
    color: white;
    background-color: $theme_color;
    border: none;
  }

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
