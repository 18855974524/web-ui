<template>
  <div class="personal-r">
    <div class="tab-bar">
      <ul class="main-view-panel-width">
        <li>
          <router-link :to="{name:'chargeMoneyMain'}">{{$t("financial.ChargeMoneyRecord")}}</router-link>
        </li>
        <li>
          <router-link :to="{name:'drawMoney'}">{{$t("financial.MentionMoneyRecord")}}</router-link>
        </li>
        <li>
          <router-link :to="{name:'otherRecord'}">{{$t("financial.OthersRecord")}}</router-link>
        </li>
      </ul>
    </div>
    <div class="p-content main-view-panel-width">
      <router-view :coinPrecision="coinPrecision"></router-view>
    </div>
  </div>
</template>

<script>
  import {mapGetters,mapActions} from 'vuex'
  export default {
    data() {
      return {}
    },
    created(){
      if(!Object.keys(this.coinPrecision).length){
        this.asyncSetCoinPrecision()
      }
    },
    mounted(){
      //console.log(this.coinPrecision)
    },
    computed:{
      ...mapGetters(['coinPrecision'])
    },
    methods:{
      ...mapActions(['asyncSetCoinPrecision'])
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
          font-family: PingFang-SC-Medium;
          a {
            display: inline-block;
            height: 47px;
            color: $font-color5;
            font-size:$medium-fs;
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
            top:24px;
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
