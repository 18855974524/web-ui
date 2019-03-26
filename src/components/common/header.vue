<template>
  <div class="header" :class="[(headers=='/home'&&scrollTop<=80)?'home':'']" :style="{'left':-scrollLeft + 'px'}">
    <div class="headerBox main-view-panel-width " >
      <img src="../../assets/img/az-pt-logo.svg" class="logo" @click.prevent.stop="backHome"/>
      <div class="cashBox title" @click="$router.push({name:'currencyExchange'})">
        <i class="iconfont icon-az-icon-transaction"></i> {{$t('homepage.coinTrader')}}
      </div>
      <div class="miningHead title">
        <el-dropdown :show-timeout="0" :hide-timeout="0" @visible-change="isaddClass(4,$event)">
              <span class="el-dropdown-link" >
                {{$t('homepage.mining')}}<i class="el-icon-arrow-down" :class="visiableSanjiao[4]?'hasActive':''" style="margin-left: 4px"></i>
              </span>
          <el-dropdown-menu  style="margin-right:-45px; padding: 0px;padding-top: 8px" slot="dropdown">
            <el-dropdown-item>
              <div class="helpwrap helepCenters">
                <ul v-show="visiableSanjiao[4]">
                  <!--进入挖矿界面路由-->
                  <li><router-link tag="a" :to="{name:'tradeMining'}">{{$t('homepage.miningIntro')}}</router-link></li>
                  <li><router-link tag="a" :to="{name:'myMining'}">{{$t('homepage.myMining')}}</router-link></li>
                </ul>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="topRight">
        <ul style="overflow: hidden">
          <!-- <li class="title">公告</li>-->
          <li  class="title2">
            <el-dropdown :show-timeout="0" :hide-timeout="0" @visible-change="isaddClass(0,$event)">
              <span class="el-dropdown-link" >
                {{$t('homepage.helpCenter')}}<i class="el-icon-arrow-down" :class="visiableSanjiao[0]?'hasActive':''" style="margin-left: 4px"></i>
              </span>
              <el-dropdown-menu  style="margin-right:-30px; padding: 0px;padding-top: 8px" slot="dropdown">
                <el-dropdown-item>
                  <div class="helpwrap helepCenters">
                    <ul v-show="visiableSanjiao[0]">
                      <li><a :href="`https://support.azex.io/hc/${ZenDisklan}/categories/360000459134`" target="_blank">{{$t('homepage.noticeCenter')}}</a></li>
                      <li><a :href="`https://support.azex.io/hc/${ZenDisklan}/categories/360000457853`" target="_blank">{{$t('homepage.Guidance')}}</a></li>
                      <li><a :href="`https://support.azex.io/hc/${ZenDisklan}/requests/new`" target="_blank">{{$t('homepage.submitOrder')}}</a></li>
                    </ul>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li class="title2" v-if="isLogin&&isSecVerification">
            <el-dropdown :show-timeout="0" :hide-timeout="0" @visible-change="isaddClass(1,$event)">
              <span class="el-dropdown-link">
                {{$t('homepage.assetsManage')}}<i class="el-icon-arrow-down" :class="visiableSanjiao[1]?'hasActive':''" style="margin-left: 4px"></i>
              </span>
              <el-dropdown-menu :style="$store.state.user.language=='cn'?{marginRight:-80+'px'}:{marginRight:-80+'px'}" style="padding:0px;padding-top:8px" slot="dropdown">
                <el-dropdown-item>
                  <div class="propertywrap" >
                    <div class="propertytop">
                      <ul v-show="visiableSanjiao[1]">
                        <li><span>{{$t('homepage.allassets')}}：</span><span>{{$t('homepage.today')}}</span></li>
                        <li><b><i>{{etoNumber(personalAsset.btc?personalAsset.btc:0,coinPrecision.btc?coinPrecision.btc.showPrecision:0)}}</i> BTC</b><span :class="personalAsset.growth24Hour>=0?'':'reduce'">{{personalAsset.growth24Hour>=0?'+':''}}{{etoNumber(personalAsset.growth24Hour?personalAsset.growth24Hour:0,2)}}%</span></li>
                        <li><span>{{personalAsset.btc|toLegalMoney('btc')|currency}}</span></li>
                        <li @click.prevent="headerOptions('assetsManage','myAssets',true,'myAssets')"><a>{{$t('homepage.assets')}} ></a></li>
                      </ul>
                    </div>
                    <div class="propertybottom">
                      <p @click.prevent="headerOptions('assetsManage','financialRec',true,'chargeMoneyMain')">{{$t('homepage.inancialRecord')}}</p>
                      <p @click.prevent="headerOptions('assetsManage','moneyAddress',true,'depositAddress')">{{$t('homepage.depositAddressManage')}}</p>
                    </div>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li  class="title" v-if="isLogin&&isSecVerification" @click.prevent.stop="headerOptions('orderManage',false,true,'currentRecord')">{{$t('homepage.orderManage')}}</li>
          <li class="title2">
            <el-dropdown  :show-timeout="0" :hide-timeout="0" @visible-change="isaddClass(2,$event)" >
              <span class="el-dropdown-link">
                {{$store.state.dict.coinSymbolList[$store.state.user.coin]}}&nbsp;{{$store.state.user.coin.toLocaleUpperCase()}}<!--{{coin}}--><i class="el-icon-arrow-down" :class="visiableSanjiao[2]?'hasActive':''" style="margin-left: 4px"></i>
              </span>
              <el-dropdown-menu style="padding: 0px;padding-top: 8px" :style="$store.state.user.language==='cn'?{marginRight:'-65px'}:{marginRight:'-50px'}" slot="dropdown" >
                <el-dropdown-item>
                  <div class="coinWrap" :class="$store.state.user.language==='cn'?'':'noCnLangwrap'">
                  <ul v-show="visiableSanjiao[2]">
                    <li :class="$store.state.user.language==='cn'?'':'noCnLang'" v-for="(item,index) in legalMoneyList" @click.prevent="headerOptions('coinStyle',item.code)">
                      <i style="font-style: normal">{{$store.state.dict.coinSymbolList[item.code]}}&nbsp;{{item.code.toLocaleUpperCase()}}</i>
                      <span v-show="$store.state.user.language==='cn'?true:false">{{$store.state.user.language=='en'?item.langs[0].text:item.langs[1].text}}</span>
                    </li>
                  </ul>
                </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li class="title2">
            <el-dropdown  :show-timeout="0" :hide-timeout="0" @visible-change="isaddClass(3,$event)" >
              <span class="el-dropdown-link">
                {{languageCodeObj[language]?languageCodeObj[language].text:''}}<i class="el-icon-arrow-down" :class="visiableSanjiao[3]?'hasActive':''" style="margin-left: 4px"></i>
              </span>
              <el-dropdown-menu style="margin-right:-30px; padding: 0px;padding-top: 8px" slot="dropdown">
                <el-dropdown-item>
                  <div class="helpwrap helpModel">
                    <ul v-show="visiableSanjiao[3]">
                      <li v-for="item in languageCodeObj" @click.prevent="headerOptions('languagePanel',item.code)"><a>{{item.text}}</a></li>
                    </ul>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li v-if="!isLogin" class="loginBtn">
            <router-link  tag="div" class="expecialBox register" style="border-color: transparent;"
                         :to="{name:'login',query:{redirect:$route.fullPath}}">{{$t('homepage.login')}}
            </router-link>
          </li>
          <li  v-if="!isLogin">
            <router-link tag="div" class="expecialBox register" :to="{name:'register',query:{redirect:$route.fullPath}}">{{$t('homepage.register')}}</router-link>
          </li>
          <li class="username title" v-if="isLogin&&isSecVerification">
            <el-dropdown >
              <span class="el-dropdown-link">
               <router-link  :to="{name:'accountSettingHome'}" class="usercontatiner" v-if="userInfo">
                <v-avatar v-if="userInfo.headImageId"  style="width:30px;height:30px;margin-top: 17px" :url="`${baseURL}/image/${userInfo.headImageId}`"></v-avatar>
                <div class="no-head-img" v-else>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-az-icon-changeface"></use>
                  </svg>
                </div>
                <span class="user-name wrap">{{userInfo.nickName||userInfo.userId}}</span>
              </router-link>
              </span>
              <el-dropdown-menu style="margin-right:0px; padding: 0px;padding-top: 8px" slot="dropdown">
                <el-dropdown-item>
                  <div class="centerwrap">
                  <ul>
                    <li @click.prevent="headerOptions('userCnter','accountset',false,'accountSettingHome')"><span>{{$t('homepage.AccountSet')}}</span></li>
                    <!-- <li @click.prevent="headerOptions('userCnter','inviteCashback',false,'InviteCashback')"><span>{{$t('homepage.InviteCashback')}}</span></li> -->
                    <li @click.prevent="headerOptions('userCnter','myGift',false,'myGift')"><span>{{$t('homepage.myGift')}}</span></li>
                    <li  @click.prevent="headerOptions('userCnter','loginOut',false,'homePage',true)" ><span>{{$t('homepage.loginOut')}}</span></li>
                  </ul>
                </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import vAvatar from './avatar'
  import util from '../../libs/util'
  import api from '../../libs/api'
  import {mapActions,mapGetters} from 'vuex'
  import VueCookies from 'vue-cookie'
  export default {
    data() {
      return {
        baseURL: util.ajax.defaults.baseURL,
        helpCenter:false,
        assetsManage:false,
        coinStyle:false,
        languagePanel:false,
        userCnter:false,
        scrollLeft:0,
        etoNumber:util.toFixed,
        scrollTop:0,
        headers:'',
        personalAsset:{},
        notInfo:true,
        BtcShowPrecision:{precision:0},
        visiableSanjiao:[false,false,false,false,false],
      }
    },
    components:{
      vAvatar
    },
    computed: {
      userInfo() {
        return this.$store.state.user.info;
      },
      isLogin() {
        if(this.$store.state.user.isLogin){
          this.getAssets();
        }
        return this.$store.state.user.isLogin;
      },
      isSecVerification(){
        return this.$store.state.user.isSecVerification;
      },
      language() {
        return this.$store.state.user.language
      },
      ZenDisklan(){
        return this.$store.state.user.language=='en'?'en-us':this.$store.state.user.language=='cn'?'zh-cn':'en-us'
      },
      coin() {
        return this.$t("coin."+this.$store.state.user.coin)
      },
      coinCodec(){
        return this.$store.state.dict.coinCode[this.$store.state.user.coin]
      },
      ...mapGetters(['coinPrecision','coinSymbolList', 'legalMoneyList','languageCodeObj']),
    },
    methods: {
      headerOptions(panelName,key,condition=false,url=false,loginout=false){
        this[panelName]=false
        if(condition&&!!url){
          if(!this.$store.state.user.isLogin){
            this.$message({
              type: 'warning',
              message: this.$t('message.loginTip')
            });
            console.log('logins',this.$route.path);
            setTimeout(function(){
              this.$router.push({
                name:'login',
                query:{
                  redirect:this.$route.path
                }
              })
            }.bind(this),500)
            return
          }
          if(!(url=='submit'||url=='guidance')){
            this.$router.push({
              name:url
            })
          }
        }else if(!!url) {
          if(loginout){
            this.panelOptions(panelName,key)
          } else {
            if(url=='myGift'){//||url=='InviteCashback'
              // this.$message({showClose: true, message: this.$t('homepage.notOpen'), type: 'success',duration:1000});
              window.open(window.location.origin+"/envelope/hall",'_blank');
            }else {
              this.$router.push({
                name: url
              })
            }
          }
        } else {
          this.panelOptions(panelName,key)
        }
      },
      panelOptions(panelName,key){
        if(panelName=='coinStyle'){
          this.changeCoin(key);
        }else if(panelName=='languagePanel'){
          //this.changeLanguageOpt(key)
          //console.log(key)
          if(key=='en'||key=='cn'){
            this.changeLanguage(key);
          }else {
            this.$message({showClose: true, message: this.$t('homepage.notOpen'), type: 'success',duration:1000});
          }
        }else {
          this.loginOut()
        }
      },
      changeLanguage(val) {
        //console.log(val);
        this.$store.dispatch('setLanguage', val);
        window.location.reload(true)
      },
      changeCoin(val) {
        this.$store.dispatch('setCoin', val);
        window.location.reload(true)
      },
      loginOut(){
        //退出登录操作
        this.$store.dispatch('clearToken');
        this.$store.dispatch('clearSecVer');
        this.$router.push({
          name:'homePage'
        })
      },
      backHome(){
        this.$router.push({
          name:'homePage'
        })

      },
      scroll(){
        this.scrollLeft = window.scrollX;
        this.scrollTop=window.scrollY;
        //console.log(this.scrollTop)
      },
      getBtcShowPrecision(){
        if(!this.coinPrecision.btc) {
          this.asyncSetCoinPrecision()
          console.log(this.coinPrecision)
        }
      },
      getAssets(){
        if(this.$store.state.user.setAsset){

        }
        api.post('/User/GetUserAssetSummary',null).then((res)=>{
            console.log(this.personalAsset);
            this.personalAsset = res.data.value
        })
      },
      initDict() {
        if (!this.$store.state.dict.languageList.length) {
          this.$store.dispatch('getLanguageList')
        }
        if (!this.legalMoneyList.length) {
          this.$store.dispatch('getLegalMoneyList')
        }
      },
      isaddClass(index,e){
        this.visiableSanjiao.splice(index,1,e)
      },
      ...mapActions(['asyncSetCoinPrecision'])
    },
    created(){
      this.initDict();
      this.getBtcShowPrecision()
      window.addEventListener('scroll',this.scroll);
    },
    mounted(){
      if(this.$route.path=='/home'||this.$route.path.indexOf('/login/')>-1){
        this.headers='/home'
      }else {
        this.headers=''
        return
      }
    },
    watch:{
      $route(newval,oldval){
          //console.log(newval)
          if(newval.path=='/home'||newval.path.indexOf('/login/')>-1){
            this.headers='/home'
            //this.notInfo=true
          }else {
            this.headers=''
            //this.notInfo=true
            return
          }
      },
    },
    destroyed(){
      window.removeEventListener('scroll',this.scroll);
    },
  }
</script>

<style scoped lang="scss" type="text/scss">
  .header {
    width: 100%;
    height: 60px;
    min-width:1220px;
    background: #1D2026;
    position: fixed;
    z-index: 11;
    top:0;
    font-family: PingFang-SC-Medium;
    //transition: background 0.1s linear;
  }
  .home.header{
    background:transparent;
  }
  .home.header:hover {
    background: #1D1D1D;
  }

  .title2:hover .el-dropdown > span {
    color: #C9933E;
    user-select: none;
  }

  .el-dropdown-menu {
    //background: #232323;
    border: none;
  }

  .el-dropdown-menu__item {
    //color: white;
  }

  .el-dropdown-menu__item:hover {
    background: #232323;
    color: #C9933E;
  }

  .title:hover {
    color: #C9933E;
    .iconfont {
      color: #C9933E;
    }
  }

  .expecialBox {
    //width: 46px;
    padding: 0px 19px;
    height: 30px;
    margin-top: 16px;
    border-radius: 5px;
    border: 1px solid #C9933E;
    line-height: 30px;
    text-align: center;
  }

  .expecialBox:hover {
    background: #C9933E;
    color: white;
    border-color: #C9933E;
  }
  .usercontatiner{
    display: flex;
    margin-left: 31px;
  }
  .usercontatiner>span{
    margin-left: 5px;
    width: 98px;
  }
  .username img {
    vertical-align: text-top;
    margin-top: -5px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .username{
    height: 64px;
  }
  .el-dropdown-menu__item {
    /*padding: 0 20px;
    width: 100px;*/
  }

  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: transparent;
    color: $--color-primary;
  }

  .logo {
    margin-top: 16px;
    float: left;
    cursor: pointer;
    width: 117px;
    height: 28px;
  }
  .miningHead{
    float: left;
    padding: 0 20px;
    line-height: 63px;
    color: rgba(230,232,237,.8);
    font-size: 14px;
    margin-left: 39px;
    cursor: pointer;
    font-family: PingFang-SC-Medium;
  }
  .cashBox {
    float: left;
    padding: 0px 20px;
    line-height: 63px;
    color: rgba(230,232,237,0.8);
    font-size: 14px;
    margin-left: 58px;
    cursor: pointer;
    font-family: PingFang-SC-Medium;
    .iconfont {
      color: rgba(255, 255, 255, 0.5);
    }
    &:hover{
      //background-color: $bg-color4;
    }
  }

  .topRight {
    height: 64px;
    float: right;
  }

  .el-dropdown-link {
    color:rgba(230,232,237,0.8);
    outline: none;
    .el-icon-arrow-down{
      transition: all 0.3s ease-in-out;
      &.hasActive{
        transform: rotate(180deg);
      }
    }
    .iconfont {
      font-size: 12px;
    }
  }
  .el-dropdown-menu {
    top: 40px !important;
  }
  .topRight ul li {
    font-family: PingFang-SC-Medium;
    font-size: 14px;
    color:rgba(230,232,237,0.8);
    list-style: none;
    float: left;
    line-height: 64px;
    padding: 0 15px;
    cursor: pointer;
    margin-left: 16px;
    &:last-child{
      margin-left: 6px;
      padding: 0px;
    }
    &.loginBtn{
      padding: 0px;
      margin-left: 11px;
    }
  }
  .no-head-img{
    width:30px;
    line-height:64px;
    .icon{
      width:30px;
      height:30px;
      vertical-align: middle;
    }
  }
  .propertywrap {
    width: 220px;
    overflow: hidden;
    border-radius: 4px;
    //transform: translateX(80px);
    box-shadow:0px 2px 4px 0px rgba(0,0,0,0.3);
    .propertytop{
      height: 120px;
      background:#22262E;
      padding: 20px 20px 9px 20px;
      box-sizing: border-box;
      ul{
        li{
          user-select: none;
          font-size: $extra-small-fs;
          color:#F0F2F6;
          display: flex;
          &:nth-child(1){
            justify-content: space-between;
            font-family:PingFang-SC-Medium;
            color:#686E7A;
            opacity:0.5;
            margin-bottom: 5px;
            span{
              height: 17px;
              line-height: 17px;
              display: inline-block;
              &:last-child{
                font-family: PingFang-SC-Medium;
              }
            }
          }
          &:nth-child(2){
            justify-content: space-between;
            font-family:OpenSans;
            align-items: center;
            margin-bottom: 5px;
            b{
              color: $--color-primary;
              opacity: 1;
              font-size: $large-fs;
              font-weight: normal;
              height: 22px;
              display: flex;
              justify-content: space-between;
              i{
                font-style: normal;
                width: 80px;
                text-align: right;
                cursor: pointer;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
            span{
              height: 17px;
              line-height: 17px;
              display: inline-block;
              color:$--color-success;
              &.reduce{
                color:$--color-danger;
              }
            }
          }
          &:nth-child(3){
            justify-content: flex-start;
            font-family: OpenSans;
            color: #686E7A;
            margin-bottom: 5px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            span{
              cursor: pointer;
              height: 17px;
              line-height: 17px;
              display: inline-block;
            }
          }
          &:nth-child(4){
            justify-content: flex-end;
            font-family: PingFang-SC-Medium;
            a{
              &:hover{
                cursor:pointer;
                font-family: PingFang-SC-Medium;
                color: $--color-primary;
              }
              height: 20px;
            }
          }
        }
      }
    }
    .propertybottom{
      height: 90px;
      background:#333740;
      text-align: center;
      padding: 0px 0px 10px 0px;
      box-sizing: border-box;
      font-family: PingFang-SC-Medium;
      p{
        user-select: none;
        color: #FFFFFF;
        font-size: $medium-fs;
        padding: 10px 20px 10px 20px;
        /*height: 20px;
        line-height: 20px;*/
        &:first-child{
         // margin-bottom: 20px;
        }
        &:hover{
          cursor: pointer;
          color: $--color-primary;
          font-family: PingFang-SC-Medium;
          background-color: #40444D;
        }
      }
    }
  }
  .helpwrap{
   // padding: 20px;
    padding: 10px 0px;
    box-sizing: border-box;
    background:rgba(51,55,64,1);
    box-shadow:0px 2px 4px 0px rgba(0,0,0,0.3);
    border-radius: 4px;
    text-align: center;
    font-family: PingFang-SC-Medium;
    &.helpModel{
     /* transform: translateX(50px);*/
      min-width: 140px;
    }
    &.helepCenters{
      //transform: translateX(30px);
      min-width: 140px;
    }
    ul{
      li{
        user-select: none;
        //margin-bottom: 20px;
        a{
          font-size: $medium-fs;
          width: 100%;
          display: inline-block;
          box-sizing: border-box;
          color:#F0F2F6;
          line-height: 20px;
          padding: 10px 20px 10px 20px;
          //height: 20px;
        }
        &:last-child{
          margin-bottom: 0px;
        }
        &:hover{
          cursor: pointer;
          background-color: #40444D;
          span{
            color:$--color-primary ;
          }
          a{
            color:$--color-primary ;
          }
        }
      }
    }
  }
  .coinWrap{
   /* height: 100px;*/
    background: $bg-color2;
    //padding: 20px;
    min-width: 180px;
    padding: 10px 0px;
    //transform: translateX(65px);
    box-sizing: border-box;
    background:rgba(51,55,64,1);
    box-shadow:0px 2px 4px 0px rgba(0,0,0,0.3);
    border-radius: 4px;
    text-align: center;
    &.noCnLangwrap{
      //transform: translateX(50px);
      min-width: 140px;
    }
    ul{
      li{
        font-family:PingFang-SC-Medium;
        user-select: none;
        font-size: $medium-fs;
        color: #F0F2F6;
        padding: 10px 20px 10px 20px;
        display: flex;
        justify-content: space-between;
        &.noCnLang{
          justify-content: center;
        }
        i{
          line-height: 20px;
          display: inline-block;
          height: 20px;
        }
        span{
          line-height: 20px;
          display: inline-block;
          height: 20px;
          margin-left: 5px;
        }
        &:hover{
          cursor: pointer;
          color: $--color-primary;
          background-color: #40444D;
        }
        &:last-child{
          margin-bottom: 0px;
        }

      }
    }
  }
  .centerwrap {
    background:rgba(51,55,64,1);
    box-shadow:0px 2px 4px 0px rgba(0,0,0,0.3);
    border-radius:4px;
    box-sizing: border-box;
    font-size: $medium-fs;
    min-width: 140px;
    padding-top: 10px;
    /*transform: translateX(50px);*/
    padding-bottom: 10px;
    text-align: center;
    li{
      user-select: none;
      padding: 10px 20px 10px 20px;
      color: $font-color7;
      font-family: PingFang-SC-Medium;
      span{
        line-height: 20px;
        display: inline-block;
        height: 20px;
      }
      &:hover{
        color: $--color-primary;
        cursor: pointer;
        background-color: #40444D;
      }
      &.info{
        background:$bg-color1;
        font-size: $extra-small-fs;
        ul{
          li{
            padding-left: 10px;
            padding-right: 10px;
            padding-top: 0px;
            padding-bottom: 0px;
            span{
              opacity: 0.7;
              line-height: 17px;
            }
            i{
              opacity: 0.3;
              margin-left: 5px;
              &.success{
                opacity: 1;
                color: $--color-success;
              }
            }
            &:nth-child(even){
              padding-top: 10px;
            }
          }
        }
      }
    }
  }
  ul[id^="dropdown-menu"].el-dropdown-menu.el-popper{
    background: transparent;
    box-shadow:none;
    padding: 8px;
  }
  .el-dropdown-menu__item{
    line-height: 20px;
    width: auto;
    padding: 0px!important;
  }
  .el-dropdown-menu__item span{
    display: inline-block;
    line-height: 20px;
    height: 20px;
  }
  .el-dropdown-link{
    padding: 22px 0px;
  }

</style>
<style>
  ul[id^="dropdown-menu"] .popper__arrow{
    display: none;
  }
  /*div[id^="el-popover"].el-popover.el-popper>.popper__arrow{
    display: none;
  }
  div[id^="el-popover"].el-popover.el-popper{
    padding: 0px;
    min-width: 140px;
    border:none;
    margin-top: -5px;
    background: transparent;
    box-shadow:none;
  }*/

</style>

