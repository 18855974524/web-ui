<template>
  <div class="img-box">
    <div class="img" :style="{'background-image':'url('+url+')'}">
    </div>
  </div>
</template>

<script>
  // 头像组件
  // 需要传入图片完整的 url 地址
  export default {
    data() {
      return {}
    },
    props:{
      url:{
        type:String
      }
    },
    created() {
    },
    methods: {}
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .img-box {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    .img {
      width: 100%;
      height: 100%;
      background: no-repeat 50%/cover;
      background-origin: content-box;
    }
  }
</style>
