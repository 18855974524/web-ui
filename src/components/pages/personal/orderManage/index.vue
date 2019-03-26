<template>
  <div class="personal-r">
    <div class="tab-bar">
      <ul class="main-view-panel-width">
        <li v-show="!detailsView">
          <router-link :to="{name:'currentRecord'}">{{$t('disposit.current')}}</router-link>
        </li>
        <li class="">
          <router-link :to="{name:'pastRecord'}">{{$t('disposit.history')}}</router-link>
        </li>
        <i class="el-icon-arrow-right" style="line-height: 50px" v-show="detailsView"></i>
        <li v-show="detailsView" class="detailsView">
          <router-link :to="{name:'detailsView'}">{{$t('disposit.checkInfo')}}</router-link>
        </li>
      </ul>
    </div>
    <div class="p-content main-view-panel-width">
      <!--<router-view  @routerDetail="detailViewfn" :marketPrecision="marketPrecision"></router-view>-->
      <router-view @routerDetail="detailViewfn" :marketPrecision="marketPrecision"></router-view>
    </div>
  </div>
</template>

<script>
  import {mapGetters,mapActions} from 'vuex'
  export default {
    data() {
      return {
      }
    },
    methods:{
      detailViewfn(val,id){
        if(val){
          //this.detailsView=val
          this.$router.push({name:'detailsView',query:id})
        }else {
          /*this.detailsView=false*/
        }
      },
      ...mapActions(['asyncSetMarketPrecision'])
    },
    computed:{
      routerName(){
        return this.$route.name
      },
      detailsView(){
        return this.$route.name=='detailsView'
      },
      ...mapGetters(['marketPrecision'])
    },
    created(){
      //console.log(this.$route.name,'detailsView')
      if(!Object.keys(this.marketPrecision).length){
        this.asyncSetMarketPrecision()
      }
      if(this.$route.name=='detailsView'){
       // this.detailsView=true
      }else {
        //this.detailsView=false
      }
    },
  }
</script>

<style scoped lang="scss" type="text/scss">
  .personal-r {
    .tab-bar {
      height: 50px;
      line-height: 50px;
      background: #FFFFFF;
      font-family: PingFang-SC-Medium;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.05);
      ul {
        display: flex;
        li {
          padding: 0 30px;
          position: relative;
          a {
            display: inline-block;
            height: 47px;
            color: $font-color5;
            font-size:$medium-fs;
            &.router-link-exact-active{
              color: $--color-primary;
              border-bottom:2px solid $--color-primary;
            }
            &.router-link-active{
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
          &:nth-child(2):after{
            display: none;
          }
          &.detailsView:after{
            display: none;
          }
        }
      }
    }
  }
</style>
