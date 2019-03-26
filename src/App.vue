<template>
  <div id="app" class="app" v-cloak>
    <router-view/>
    <open-google-verify ref="bindGooVrBox" @submit="confirmOpenGoogleVerify"></open-google-verify>
  </div>
</template>

<script>
  import openGoogleVerify from './components/common/googleVerify/openGooleVerify'
  import api from './libs/api'

  export default {
    name: 'App',
    data() {
      return {
        msg: "这是app的demo页。展示所有效果",
      };
    },
    components: {
      openGoogleVerify
    },
    watch: {
      $route(to, from) {
        if (from.path.includes('/login/') && !to.path.includes('/login/') && this.$store.state.user.isLogin) {
          if(this.$store.state.user.info){
            if (this.$store.state.user.info.userOtpStatus === 0) {
              this.bindGoogleVerifyTip();
            }
          }else{
            api.post('/User/GetUserInfo')
              .then((res) => {
                this.$store.dispatch('setUser',res.data.value);
                // 执行ajax请求，但只希望在进入时请求，离开时不希望进行请求。
                if (res.data && res.data.value.userOtpStatus === 0) {
                  this.bindGoogleVerifyTip();
                }
              });
          }
        }
      }
    },
    methods: {
      bindGoogleVerifyTip() {
        this.$refs.bindGooVrBox.open(this.$t('openGoogleVerify.bindTitle'),
          this.$t('openGoogleVerify.goBind'), null, this.$t('openGoogleVerify.bindTip'), false);
      },
      confirmOpenGoogleVerify() {
        this.$router.push({name: 'accountSettingHome'});
      }
    },
    created(){ //初始化加载
      this.$store.dispatch('initUser');
    },
  }
</script>

<style>
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
    position: relative;
    
  }

  /* ////////////////////////// */
  .TitleMessageBox {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .errBox {
    position: relative;
    background: black;
    border: 1px solid #ccc;
    color: white;
    width: 180px;
    padding: 10px 20px;
    z-index: 100000;
  }

  .errBox p {
    font-size: 14px;
  }

  .errTitle {
    padding-top: 5px;
    font-size: 12px;
  }

  .closeError {
    position: absolute;
    right: 3px;
    top: 3px;
    line-height: 15px;
    width: 15px;
    height: 15px;
    text-align: center;
    cursor: pointer;
  }

</style>
