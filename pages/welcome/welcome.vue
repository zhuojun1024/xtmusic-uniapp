<template>
  <view class="welcome-wrapper">
    <image
      class="logo"
      src="/static/logo.png"
    />
    <view class="slogan">
      <text>网易云音乐</text>
      <text>·</text>
      <text>音乐的力量</text>
    </view>
  </view>
</template>

<script>
  export default {
  }
</script>

<style lang="scss" scoped>
.welcome-wrapper {
  width: 100vw;
  height: 100vh;
  background-color: #C94030;
  position: relative;
  .logo {
    width: 104px;
    height: 104px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 30vh;
    left: 0;
    margin: auto;
    border-radius: 128px;
  }
  .slogan {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 50px;
    color: white;
    text-align: center;
    font-size: 18px;
    > text:nth-child(2) {
      margin: 0 6px;
      font-weight: bold;
    }
    > text:nth-child(3) {
      font-style: italic;
    }
  }
}
</style>
