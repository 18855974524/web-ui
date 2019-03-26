<template>
  <div>
    <div class="main-container">
      <div id="main">
        <div class="block">
          <div class="bannerWrap" >
            <div class="wrapInner">
              <!--轮播-->
              <banner-list></banner-list>
            </div>
          </div>
          <div class="miningWrap">
            <!--挖矿-->
            <mining></mining>
          </div>
          <div class="publicBroadcast">
            <div class="noticeWrap" v-show="noticesList.length">
              <div class="broadWrap">
                <i class="icon-gonggaoicon"></i>
                <strong style="font-family: PingFang-SC-Medium">{{$t('homepage.notice')}}</strong>
              </div>
              <ul class="content-header">
                <li v-for="item in noticesList">
                  <a :href="item.html_url" target="_blank">{{item.title}}（{{item.updated_at|utcToMd}}）</a>
                </li>
              </ul>
              <div class="more">
                <router-link tag="a" :to="{name:'ZendeskLogin',query:{url:`https://azexio.zendesk.com/hc/${ZenDisklang}/sections/${moreId}`}}" target="_blank">{{$t('homepage.more')}}>></router-link>
              </div>
            </div>
          </div>
          <div class="bannerTitle">
            <p class="h3">{{$t('bannerListNotice.title')}}</p>
          </div>
        </div>
      </div>
      <div class="content">
        <!--市场-->
        <tableList></tableList>
        <div class="fadeInPhoto">
          <div class="photoInfo" :style="$store.state.user.language=='cn'?{backgroundImage:`url(${require('../../../assets/img/phone@2x.png')})`}:{backgroundImage:`url(${require('../../../assets/img/enPhone@2x.png')})`}">
            <div class="tipsbtn">
              <i></i>
              <a>{{$t('bannerListNotice.moreDown')}}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <scroll-backtop></scroll-backtop>
    <v-footer class="main-width"></v-footer>
  </div>
</template>
<script>
  import Footer from '../../common/footer'
  import TableList from './tableList'
  import ScrollBacktop from './../../common/scrollbacktop'
  //import ws from '../../../libs/websoket/wsConfig';
  import Zendsk from '../../../libs/Zendsk';
  import api from '../../../libs/api'
  import BannerList from '../../common/bannerList'
  import storeHandler from './../../../components/pages/currencyExchange/storeHandler'
  import axios from 'axios'
  import Mining from './mining'
  export default {
    data() {
      return {
        msg: '这是首页',
        Zendsk:new Zendsk(),
        noticesList:[],
        moreId:0
      }

    },
    mounted() {
    },
    created(){
      //1.获取categories类
      //2.获取sections
      //3.获取artices
      this.$nextTick(()=>{
        this.Zendsk.updateLang(this.$store.state.user.language)
        this.Zendsk.getData().then(res=>{
          this.moreId=res.data.moreId
          this.noticesList=res.data.articles
          //console.log(this.noticesList)
        })
        //console.log(this.Zendsk.lang,this.$store.state.user.language)
      })
    },
    computed:{
      ZenDisklang(){
        return this.$store.state.user.language=='en'?'en-us':this.$store.state.user.language=='cn'?'zh-cn':'en-us'
      },
    },
    watch:{

    },
    methods:{},
    components:{
      'v-footer':Footer,
      'tableList':TableList,
      'scroll-backtop':ScrollBacktop,
       BannerList,
       Mining
    },
  }
</script>

<style lang="scss" type="text/scss" scoped>
  #main{
    width:100%;
    background: $font-color6;
  }
  #app .index .main-container{
    min-height: auto;
    padding-top: 0px;
  }
  .content{
    width: 100%;
    background: rgba(247,247,247,1);
    padding-bottom: 40px;
  }
  .content-wrap{
    width: 1200px;
    margin: 0 auto;
    font-family:PingFang-SC-Regular;
  }
  .publicBroadcast{
    position: absolute;
    bottom: 0px;

    width: 100%;
    background:rgba(18,18,18,0.3)
  }
  .noticeWrap{
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .broadWrap{
      i{
        color:$--color-primary ;
        font-size: $large-fs;
      }
      strong{
        color: $--color-primary;
        font-weight: normal;
        font-size: $medium-fs;
        margin-left: 6px;
      }
    }
    .more{
      a{
        color: rgba(255,255,255,0.5);
        font-weight: normal;
        font-size: $medium-fs;
        cursor: pointer;
        margin-left: 40px;
        &:hover{
          color: $--color-primary;
        }
      }
    }
  }
  .bannerTitle{
    padding-top: 110px;
    width: 1200px;
    margin: 0 auto;
    .h3{
      font-size:28px;
      font-weight:100;
      font-family: PingFang-SC-Regular;
      color:rgba(240,241,247,1);
      line-height:28px;

    }
  }
  .miningWrap{
    position: absolute;
    width: 100%;
    height: 100px;
    top: 378px;
    //background-color: #0ABF74;
  }
  .bannerWrap{
    position: absolute;
    width: 100%;
    top: 188px;
  }
  .wrapInner{
    width: 1200px;
    margin: 0 auto;
  }
  .content-header{
    display: flex;
    padding: 12px 0px;
    justify-content: space-evenly;
    width: 960px;
    /*width: 1200px;
    margin: 0 auto;*/
    font-family: PingFang-SC-Regular;
  }

  .content-header li {
    width: 290px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
  .content-header li a{
    color: rgba(240,241,247,1);
    width: 290px;
    font-size: $medium-fs;
    font-family:PingFang-SC-Regular;
    transition: transform 0.4s linear;
    display: inline-block;
    cursor: pointer;
    &:hover{
      color: $--color-primary;
      //transform: scale(1.1,1.1);
    }
  }
  .fadeInPhoto{
    background-color: transparent;
    width: 1200px;
    margin: 0 auto;
  }
  .photoInfo{
    height: 230px;
    background-repeat: no-repeat;
    background-size: cover;
    //margin-bottom: 40px;
    position: relative;
  }
  .photoInfo .tipsbtn{
    width:207px;
    height:44px;
    border-radius:4px;
    border:1px solid rgba(255,255,255,1);
    position: absolute;
    right: 40px;
    bottom: 53px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: PingFang-SC-Regular;
  }
  .photoInfo .tipsbtn a{
    font-size:14px;
    font-family:PingFang-SC-Regular;
    color:rgba(255,255,255,1);
    line-height:20px;
  }
  .photoInfo .tipsbtn i{
    width: 12px;
    height: 18px;
    background: url("../../../assets/img/az-icon-phone2@2x.png") no-repeat;
    background-size: cover;
    margin-right: 10px;
  }
  .content-intro{
    display: flex;
    padding-top: 20px;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
  }
  .content-intro li{
    padding: 15px;
    background: white;
    border-radius: 4px;
    transition: all 0.4s ease-in-out;
    width: 224px;
    box-sizing: border-box;
    overflow: hidden;
    &:hover{
      cursor: pointer;
      box-shadow: 0px 6px 12px 0px rgba(0,0,0,0.15);
      transform: translateY(-5px);
    }
  }
  .content-intro li>p b{
    font-size:$medium-fs;
    font-family:openSans-Semibold;
  }
  .pb-color-green {
    color:$--color-success;
  }
  .pb-color-pre {
    color:$--color-danger;
  }
  .content-intro li>p a{
    font-size:$extra-small-fs;
    font-family:openSans;
    color:$font-color3;
  }
  .content-intro li>.last-p span strong{
    font-size:$extra-small-fs;
    font-family:PingFang-SC-Medium;
    color:$font-color3;
  }
  .content-intro li>.last-p span b{
    font-size:$extra-small-fs;
    font-family:openSans;
    color:$font-color3;
  }
  .content-intro li>.last-p i.icon-az-icon-gifcard{
    font-size: 20px;
    background: linear-gradient(90deg,rgba(240,205,115,1),rgba(238,179,80,1));
    -webkit-background-clip: text;
    color: transparent;

  }
  .content-intro li>p{
    display: flex;
    align-items: center;
   // margin-bottom:5px;
  }
  .content-intro li>p.last-p{
    justify-content: space-between;
    height: 20px;
  }
  .content-intro li h3{
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 20px;
    height: 20px;
    width: 194px;
    margin-bottom:10px;
  }
  .content-intro li h3 i.icon-az-icon-transaction-{
    font-size: 20px;
    color: $--color-primary;
  }
  .content-intro li h3 img.coinIco{
    width: 20px;
    height: 20px;
    overflow: hidden;
    border-radius: 50%;
  }
  .content-intro li h3 a{
    font-size:$medium-fs;
    font-family:openSans-Semibold;
    color:$font-color2;
  }
  .content-intro li h3 b{
    font-size:$medium-fs;
    font-family:openSans-Semibold;
    color:rgba(85,85,85,0.7)
  }
  .content-intro li h3 span{
    font-family:openSans;
    font-size:11px;
  }
  .t-green{
    color:$--color-success;
  }
  .t-pink{
    color: $--color-danger;
  }
  .color-yellow{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: $--color-warning;
  }
  .color-purple{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #C391F0;
  }
  .color-blue{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #50AEF5;
  }
  .color-grren{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #44CC88;
  }
  .color-yellow-linear{
    background:linear-gradient(90deg,rgba(240,205,115,1),rgba(238,179,80,1));
  }
  .block{
    width: 100%;
    padding-bottom: 10px;
    height: 566px;
    background-color: black;
    background-image: url("../../../assets/img/banner@2x.png");
    background-position: left top;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    z-index: 10;
  }


  .el-carousel__arrow--left{
    left:380px!important;
  }
  .el-carousel__arrow--right{
    right:380px!important;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    margin: 0;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
 /*#main .block .el-carousel .el-carousel__container button.el-carousel__arrow--left{
    left: 380px!important;
  }*/

  @media only screen and (max-width: 1200px) {
    .block {
      margin: 0;
    }
    .el-carousel__arrow--left{
      left: 16px;
    }
    .el-carousel__arrow--right{
      right:16px;
    }

  }
</style>
