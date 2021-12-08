<template>
  <view>
    <view class="slider-box">
      <movable-area class="sliderBar">
        <view
          class="gone"
          :style="{ width: x +'px' }"
        />
        <movable-view
          class="slider"
          direction="horizontal"
          :animation="false"
          :x="x"
          :y="0"
          @change="onChange"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <!-- <text>{{ score }}</text> -->
        </movable-view>
      </movable-area>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      precent: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        slideBarWidth: 0,
        x: 0,
        dragging: false
      }
    },
    watch: {
      precent: {
        handler (newVal) {
          if (!this.dragging) {
            this.x = this.slideBarWidth * newVal / 100
          }
        },
        immediate: true
      }
    },
    created () {
      this.$nextTick(() => {
        uni.createSelectorQuery().in(this).select(".slider-box").boundingClientRect(res => {
          this.slideBarWidth = res.width
        }).exec()
      })
    },
    methods: {
      handleTouchStart () {
        this.dragging = true
      },
      handleTouchEnd () {
        const precent = this.x / this.slideBarWidth * 100
        this.$emit('change', precent)
        this.dragging = false
      },
      onChange (e) {
        this.x = e.detail.x
      }
    }
  }
</script>

<style lang="scss">
  $uni-color-primary: #EA2000;

  .slider-box {
    display: flex;
    width: 100%;
    height: 32rpx;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      height: 8rpx;
      border-radius: 8rpx;
      background-color: #EEEEEE;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 100%;
    }

    .sliderBar {
      height: 100%;
      border-radius: 8rpx;
      width: 100%;

      .gone {
        background-color: $uni-color-primary;
        height: 100%;
        position: absolute;
        left: 0;
        height: 8rpx;
        top: 12rpx;
        max-width: 100%;
        z-index: 1;
        border-radius: 0 8rpx 8rpx 0;
      }

      .slider {
        width: 0;
        height: 100%;
        position: relative;
        z-index: 2;

        &::after {
          content: '';
          position: absolute;
          border-radius: 16rpx;
          background-color: $uni-color-primary;
          width: 32rpx;
          height: 100%;
          transform: translatex(-50%);
        }

        text {
          position: absolute;
          width: 60rpx;
          color: white;
          border-radius: 14rpx;
          top: -140%;
          left: 50%;
          text-align: center;
          transform: translateX(-50%);
          background-color: $uni-color-primary;

          &::after {
            content: '';
            position: absolute;
            border: 6rpx solid transparent;
            border-top-color: $uni-color-primary;
            top: 99%;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
    }
  }
</style>
