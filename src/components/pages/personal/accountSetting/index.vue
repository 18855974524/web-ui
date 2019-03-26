<template>
  <div class="account-setting">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    }
  }
</script>

<style lang="scss" type="text/scss">
  .account-setting{
    .panel{
      background: #fff;
      border-radius: 6px;
      margin-bottom:60px;
      height:480px;
      .p-title{
        line-height:60px;
        font-size: $large-fs;
        color: $font-color3;
        padding-left:20px;
        box-shadow: inset 0 -1px 0 0 #E5E5E5;
      }
      .p-content{
        padding:40px 0 126px 0;
        text-align:center;
      }
      .rule-form {
        width: 456px;
        margin:0 auto;
        button{
          width:320px;
        }
      }
    }
  }
  .panel-form-norequired .el-form-item.is-required .el-form-item__label:before {
    display:none;
  }
</style>
