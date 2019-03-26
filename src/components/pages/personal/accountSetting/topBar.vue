<template>
  <div class="top-bar">
    <ul class="main-view-panel-width">
      <li>
        <router-link :to="{name:'accountSettingHome'}">{{$t("personal.accountSetting")}}</router-link>
        <i class="iconfont icon-az-icon-arrow-right"></i>
      </li>
      <li>
        <span class="current">{{title}}</span>
      </li>
    </ul>
  </div>
</template>

<script>

  export default {
    data() {
      return {}
    },
    props:{
      title:{
        type: String,
        default: ''
      }
    },
    methods: {},
    created() {
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  .top-bar {
    height: 50px;
    line-height: 50px;
    background: #FFFFFF;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.05);
    margin-bottom:30px;
    ul {
      display: flex;
      li{
        color: $font-color5;
        padding: 0 30px;
        position: relative;
        font-size: 14px;
        .iconfont{
          font-size: 12px;
          position:absolute;
          right:-7px;
          top:0;
        }
      }
      .current {
        display: inline-block;
        height: 48px;
        color: $--color-primary;
        border-bottom:2px solid $--color-primary;
        font-size: 14px;
      }
    }
  }
</style>
