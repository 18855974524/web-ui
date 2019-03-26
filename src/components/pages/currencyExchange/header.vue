<template>
  <div class="c-header">
    <div class="headerBox">
      <router-link :to="{path:'/home'}">
        <img src="../../../assets/img/az-pt-logo.svg" class="logo"/>
      </router-link>
      <div class="top-right">
        <div class="market-info">
          <div class="top-info">
            <div class="currency" v-if="market.id">
              <span class="primary-text openSans-semiBold">{{market.id.toUpperCase().replace('_','/')}}</span>
            </div>
            <div>
              <p class="title">{{$t('kline.recentPrice')}}</p>
              <p class="value">
                <span>{{market.closedPrice|scientific|noDataShow('--')}}</span>
                <span style="color:#888"> ≈ {{market.closedPrice|toLegalMoney(market.id.split('_')[1])|currency|noDataShow('--')}}</span>
              </p>
            </div>
            <div>
              <p class="title">{{$t('kline.upDownPercent24')}}</p>
              <p class="value"
                 :class="{'success-text':market.increase24h>0,'danger-text':market.increase24h<0}">
                {{market.increase24h>0?'+':''}}{{market.increase24h|noDataShow('--')}}<span
                v-if="market.increase24h!==undefined">%</span>
              </p>
            </div>
            <div>
              <p class="title">{{$t('kline.highestPrice24')}}</p>
              <p class="value">
                {{market.highPrice|scientific|noDataShow('--')}}
              </p>
            </div>
            <div>
              <p class="title">{{$t('kline.lowestPrice24')}}</p>
              <p class="value">
                {{market.lowPrice|scientific|noDataShow('--')}}
              </p>
            </div>
            <div>
              <p class="title">{{$t('kline.volume24')}}</p>
              <p class="value">
                {{market.volume|scientific|toNumFixed(2)|noDataShow('--')}} {{market.id.split('_')[0].toUpperCase()}}
              </p>
            </div>
          </div>
        </div>
        <el-menu default-active="0" class="c-nav-menu" mode="horizontal" background-color="#1d1e26" text-color="rgba(230, 232, 237, 1)"
                 active-text-color="rgba(230, 232, 237, 1)">
          <el-submenu index="1" :popper-class="`c-nav-submenu coin ${$store.state.user.language}`">
            <template slot="title">{{coinText}}</template>
            <el-menu-item v-for="(item,index) in legalMoneyList" :key="index" :index="`1-${index+1}`"
                          @click="headerOptions('coinStyle',item.code)">
              <span><i style="font-style: normal">{{coinSymbolList[item.code]}}</i> {{item.code.toUpperCase()}}</span>
              <span v-if="language==='cn'">{{item.langs[1].text}}</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2" popper-class="c-nav-submenu lang">
            <template slot="title">{{languageCodeObj[language]?languageCodeObj[language].text:''}}</template>
            <el-menu-item v-for="(lang,index) in languageCodeObj" :key="index" :index="`2-${index+1}`"
                          @click="headerOptions('languagePanel',lang.code)">
              <span>{{lang.text}}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="3" v-if="!isLogin">
            <router-link tag="div" class="expecial-box register" style="border-color: transparent;margin-left: -24px;"
                         :to="{name:'login',query:{redirect:$route.fullPath}}">{{$t('homepage.login')}}
            </router-link>
            <router-link tag="div" class="expecial-box register" :to="{name:'register',query:{redirect:$route.fullPath}}">{{$t('homepage.register')}}
            </router-link>
          </el-menu-item>
          <el-submenu index="4" popper-class="c-nav-submenu user" v-else class="user-submenu">
            <template slot="title">
              <router-link :to="{name:'accountSettingHome'}" class="usercontatiner" v-if="userInfo">
                <v-avatar v-if="userInfo.headImageId"
                          :url="`${baseURL}/image/${userInfo.headImageId}`"></v-avatar>
                <div class="no-head-img" v-else>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-az-icon-changeface"></use>
                  </svg>
                </div>
                <span class="user-name wrap">{{userInfo.nickName||userInfo.userId}}</span>
              </router-link>
            </template>
            <el-menu-item @click="headerOptions('userCenter','accountset',false,'accountSettingHome')" index="4-1">
              <span>{{$t('homepage.AccountSet')}}</span>
            </el-menu-item>
            <!--<el-menu-item @click="headerOptions('userCenter','inviteCashback',false,'accountSettingHome')" index="4-2">-->
              <!--<span>{{$t('homepage.InviteCashback')}}</span></el-menu-item>-->
            <el-menu-item @click="headerOptions('userCenter','myGift',false,'myGift')" index="4-3"><span>{{$t('homepage.myGift')}}</span>
            </el-menu-item>
            <el-menu-item @click="headerOptions('userCenter','loginOut',false,'homePage',true)" index="4-4"><span>{{$t('homepage.loginOut')}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import vAvatar from '../../common/avatar'
  import util from '../../../libs/util'
  import api from '../../../libs/api'

  export default {
    data() {
      return {
        baseURL: util.ajax.defaults.baseURL,
        coinStyle: false,
        languagePanel: false,
        userCenter: false,
      }
    },
    props: {
      market: {
        required: true
      }
    },
    components: {
      vAvatar
    },
    computed: {
      ...mapGetters(['coinSymbolList', 'legalMoneyList', 'languageCodeObj']),
      userInfo() {
        return this.$store.state.user.info
      },
      isLogin() {
        return this.$store.state.user.isLogin
      },
      coinText() {
        return this.coinSymbolList[this.$store.state.user.coin] + this.$store.state.user.coin.toUpperCase()
      },
      language(){
        return this.$store.state.user.language
      }
    },
    methods: {
      changeLanguage(val) {
        /* console.log(val);*/
        this.$store.dispatch('setLanguage', val)
      },
      changeCoin(val) {
        this.$store.dispatch('setCoin', val)
        //console.log(val,this.coin)
      },
      loginOut() {
        //退出登录操作
        this.$store.dispatch('clearToken')
        this.$store.dispatch('clearSecVer')
        this.$router.push({
          path: '/home'
        })
      },
      headerOptions(panelName, key, needLogin = false, urlName = '') {
        this[panelName] = false
        if (needLogin && !this.isLogin) {
          this.$message({
            type: 'warning',
            message: this.$t('message.loginTip'),
            showClose: true
          })
          setTimeout(function () {
            this.$router.push({
              name: 'login',
              query: {
                redirect: this.$route.path
              }
            })
          }.bind(this), 500)
        } else if (key === 'loginOut') {
          this.loginOut()
        } else if (urlName) {
          if(urlName === 'myGift'){
            window.open(window.location.origin+"/envelope/hall",'_blank');
            return;
          }
          this.$router.push({
            name: urlName
          })
        } else {
          this.panelOptions(panelName, key);
        }
      },
      panelOptions(panelName, key) {
        if (panelName === 'coinStyle') {
          this.changeCoin(key)
          window.location.reload(true)
        } else if (panelName === 'languagePanel') {
          if(['cn','en'].includes(key)){
            this.changeLanguage(key)
            window.location.reload(true)
          }else{
            this.$message({
              type:'success',
              message:this.$t('accountSetting.notOpenTip'),
              showClose:true
            })
          }
        }
      },
      initDict() {
        if (!this.$store.state.dict.languageList.length) {
          this.$store.dispatch('getLanguageList')
        }
        if (!this.legalMoneyList.length) {
          this.$store.dispatch('getLegalMoneyList')
        }
      }
    },
    created() {
      this.initDict();
    },
  }
</script>

<style lang="scss" type="text/scss">
  .c-header {
    width: 100%;
    height: 48px;
    min-width: 1210px;
    background: rgba(29, 30, 38, 1);
    position: relative;
    .headerBox {
      display: flex;
      margin: 0 auto;
    }
    .logo {
      margin-top: 12px;
      margin-left: 20px;
      width: 117px;
      height: 23px;
    }
    .top-right {
      height: 48px;
      position: absolute;
      right: 20px;
      display: flex;
      font-family:'PingFang-SC-Medium';
      .market-info {
        .top-info {
          display: flex;
          height: 32px;
          align-items: center;
          padding: 8px 10px;
          position: relative;
          .currency {
            font-size: 16px;
            color: $--color-primary;
          }
          > div {
            font-size: 12px;
            margin-right: 40px;
            .title {
              color: #686E7A;
              margin-bottom: 2px;
            }
            .value {
              color: rgba(230, 232, 237, 1);
            }
            &:last-child {
              margin-right: 24px;
            }
          }
        }
      }
      ul {
        height: 48px;
        display: flex;
        background-color: transparent;
        border: 0;
        li {
          line-height: 48px;
          margin: 0 23px;
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
          .el-dropdown-link {
            color: rgba(230, 232, 237, 1);
            i {
              font-size: 12px;
              &.icon-az-icon-caret-top-small {
                display: none;
              }
              &.icon-az-icon-caret-bottom {
                display: inline;
              }
            }
          }
        }
      }
      .menu-item:hover .el-dropdown > span {
        color: $--color-primary;
        user-select: none;
        .icon-az-icon-caret-top-small {
          display: inline;
        }
        .icon-az-icon-caret-bottom {
          display: none;
        }
      }

      .el-dropdown-menu {
        background: #232323;
        border: none;
      }

      .el-dropdown-menu__item {
        color: white;
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

      .expecial-box {
        width: 68px;
        color: rgba(230, 232, 237, 1);
        padding: 0px;
        height: 30px;
        border-radius: 4px;
        border: 1px solid $--color-primary;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        display: inline-block;
      }
      .expecial-box:hover {
        background: $--color-primary;
        color: white;
        border-color: $--color-primary;
      }
      .usercontatiner {
        display: flex;
        align-items: center;
        .img-box{
          width:30px;
          height:30px;
        }
        & > span {
          margin-left: 5px;
          max-width: 50px;
        }
      }
      .no-head-img {
        line-height: 48px;
        svg {
          width: 30px;
          height: 30px;
          vertical-align: middle;
        }
      }
      .username img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
      .el-dropdown-menu__item {
        padding: 0 20px;
        width: 100px;
      }

      .el-dropdown-menu__item:focus,
      .el-dropdown-menu__item:not(.is-disabled):hover {
        background-color: transparent;
        color: $--color-primary;
      }

      .el-dropdown-menu__item span {
        display: block;
        line-height: 36px;
        height: 36px;
      }
    }
  }
  .header-menu-popover {
    .popover-wrap {
      background: rgba(51, 55, 64, 1);
      box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.3);
      width: 140px;
      text-align: center;
      color: #F0F2F6;
      font-size: 14px;
      padding: 10px 0;
      border-radius: 4px;
      box-sizing: border-box;
      margin-top: 10px !important;
      margin-left: -40px;
      li {
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        cursor: pointer;
        &:hover {
          background: rgba(64, 68, 77, 1);
          color: $--color-primary;
        }
      }
      &.coin-wrap {
        width: 140px;
        margin-left: -4px;
        li {
          text-align: center;
        }
        &.cn {
          width: 180px;
          text-align: left;
          margin-left: -10px;
          li {
            display: flex;
            justify-content: space-between;
          }
        }
      }
      &.center-wrap {
        margin-left: 20px;
        li {
          padding-left: 0;
          padding-right: 0;
          user-select: none;
          /*span{*/
          /*line-height: 20px;*/
          /*}*/
          .info {
            display: none;
            background: #22262E;
            font-size: $extra-small-fs;
            padding: 10px 0;
            li {
              color: #9497A8;
              height: 18px;
              line-height: 18px;
              padding: 0;
              span {
                opacity: 0.7;
                line-height: 17px;
              }
              i {
                opacity: 0.3;
                float: right;
                margin-right: 5px;
                &.success {
                  opacity: 1;
                  color: $--color-success;
                }
              }
              &:hover {
                background-color: transparent;
              }
              &:nth-child(even) {
                margin-top: 10px
              }
            }
          }
          &:hover {
            height: auto;
            color: $--color-primary;
            cursor: pointer;
            .info {
              display: block;
            }
          }

        }
      }
    }
  }
  ul[id^="dropdown-menu"] .popper__arrow {
    display: none;
  }

  div[id^="el-popover"].el-popover.el-popper > .popper__arrow {
    display: none;
  }

  div[id^="el-popover"].el-popover.el-popper {
    padding: 0px;
    min-width: 140px;
    border: none;
    margin-top: 0px;
    padding-top: 12px;
    background: transparent;
    box-shadow: none;
  }

  .el-dropdown .el-dropdown-link:active,
  .el-dropdown .el-dropdown-link:focus {
    outline: none;
  }

  .c-nav-menu.el-menu--horizontal {
    > .el-menu-item{
      transition:none;
    }
    > .el-menu-item,
    > .el-submenu .el-submenu__title {
      height: 48px;
      line-height: 48px;
      padding: 0;
      background-color: #1d1e26 !important;
      border: none !important;
      i {
        color: #BDC0C5;
        font-weight: bold;
      }
    }
    .user-submenu {
      .el-submenu__title {
        i {
          display: none;
        }
      }
    }
  }

  .c-nav-submenu.el-menu--horizontal {
    border: none;
    font-family: PingFang-SC-Medium;
    .el-menu.el-menu--popup {
      margin-top: 0;
      min-width: 140px;
      background-color: #333740 !important;
      box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.3);
      width: 140px;
      text-align: center;
      color: rgba(230, 232, 237, 1);
      font-size: 14px;
      padding: 10px 0;
      border-radius: 4px;
      box-sizing: border-box;
      margin-left: -48px;
      li {
        padding: 0px 20px;
        height: 40px;
        line-height: 40px;
        i {
          color: rgba(230, 232, 237, 1);
        }
        background-color: #333740 !important;
        color: rgba(230, 232, 237, 1) !important;
        span{
          font-family: PingFang-SC-Regular;
        }
        &:hover {
          background: rgba(64, 68, 77, 1) !important;
          color: $--color-primary !important;
          i {
            color: $--color-primary;
          }
        }
      }
    }
    &.cn {
      .el-menu.el-menu--popup {
        margin-left: -60px;
        width: 180px;
        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  }
</style>


