<template>
  <div class="personal-r">
    <div class="tab-bar">
      <ul class="main-view-panel-width">
        <li>
          <router-link :to="{name:'accountSettingHome'}">{{$t("personal.accountSetting")}}</router-link>
        </li>
        <!-- <li>
          <span @click="openTip">{{$t("personal.inviteBack")}}</span>
          <router-link :to="{name:'inviteBackCashHome'}">{{$t("personal.inviteBack")}}</router-link>
        </li> -->
        <li>
          <span @click="openTip">{{$t("personal.myRedPaper")}}</span>
          <!--<router-link :to="{name:'myRedPaperHome'}">{{$t("personal.myRedPaper")}}</router-link>-->
        </li>
      </ul>
    </div>
    <div class="p-content">
      <router-view class="main-view-panel-width"></router-view>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {

      }
    },
    methods:{
      openTip(){
        this.$message({
          message:this.$t('accountSetting.notOpenTip'),
          showClose:true,
          type:'success'
        })
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  .personal-r {
    .tab-bar {
      height: 50px;
      line-height: 50px;
      background: #FFFFFF;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.05);
      ul {
        display: flex;
        li {
          padding: 0 30px;
          position: relative;
          span{
            cursor: pointer;
            color: $font-color5;
            font-size: 14px;
          }
          a {
            display: inline-block;
            height: 48px;
            color: $font-color5;
            font-size: 14px;
            &.router-link-exact-active{
              color: $--color-primary;
              border-bottom:2px solid $--color-primary;
            }
          }
          &:after {
            content: '';
            width: 0;
            height: 16px;
            position:absolute;
            top:18px;
            right:0px;
            border-right:1px solid $border-color-2;
          }
          &:first-child{
            padding-left:0;
          }
          &:last-child:after{
            display: none;
          }
        }
      }
    }
  }
</style>

