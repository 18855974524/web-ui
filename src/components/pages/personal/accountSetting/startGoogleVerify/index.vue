<template>
  <div>
    <top-bar :title="$t('GoogleVerify.topBarTitle')"></top-bar>
    <div class="Goolebox">
      <div class="titletext">
        {{$t("GoogleVerify.startGoogleVerify")}}
      </div>
      <div class="firststep">
        <p><span class="yellow">{{$t("GoogleVerify.firststep")}}. </span><span>{{$t('GoogleVerify.tipsFirst')}}</span>
        </p>
      </div>
      <div class="GooleDownload">
        <div class="GooleDownloadPic">
          <img src="./googleImg/GOOGLE.png"/>
          <span class="Authentext pingFangSC-regular">Authenticator</span>
        </div>
        <div class="GooleDownloadLink">
          <div class="DownTop">
            <a class="iosversion" target="_blank" href="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8">
              <img src="./googleImg/az-icon-apple2.svg"/>
              <span>iOS {{$t('GoogleVerify.version')}}</span>
            </a>
            <a :href="`https://support.azex.io/hc/${$store.state.user.language == 'cn'?'zh-cn':'en-us'}/articles/360005418154-%E8%B0%B7%E6%AD%8C%E4%BA%8C%E6%AC%A1%E9%AA%8C%E8%AF%81%E6%95%99%E7%A8%8B`"
               target="_blank" class="iosusehelp router-btn pingFangSC-regular">{{$t('GoogleVerify.useHelp')}}</a>
          </div>
          <div class="DownBottom">
            <a class="androidversion" target="_blank"
               href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2">
              <img src="./googleImg/android.svg"/>
              <span>Android {{$t('GoogleVerify.version')}}</span>
            </a>
            <a :href="`https://support.azex.io/hc/${$store.state.user.language == 'cn'?'zh-cn':'en-us'}/articles/360005418154-%E8%B0%B7%E6%AD%8C%E4%BA%8C%E6%AC%A1%E9%AA%8C%E8%AF%81%E6%95%99%E7%A8%8B`"
               target="_blank" class="iosusehelp router-btn pingFangSC-regular">{{$t('GoogleVerify.useHelp')}}</a>
          </div>
        </div>
      </div>
      <div class="firststep">
        <p><span class="yellow">{{$t('GoogleVerify.secondstep')}}. </span><span>{{$t('GoogleVerify.tipsSecond')}}</span>
        </p>
      </div>
      <div class="codescan">
        <!-- <img src="./googleImg/googleappscan.svg"/> -->
        <div id="query">
          <canvas id="canvas"></canvas>
        </div>
      </div>
      <div class="firststep">
        <p><span class="yellow">{{$t('GoogleVerify.thirdstep')}}. </span><span>{{$t('GoogleVerify.tipsThird')}}（{{$t('GoogleVerify.important')}}）</span>
        </p>
        <p class="ifyouneed"><span>{{$t('GoogleVerify.tipsReset')}}</span> <span class="pink">{{$t('GoogleVerify.tipsResetTime')}}</span>
        </p>
      </div>
      <div class="secretcode">
        <div class="secretinput">
          <!--:placeholder="$t('GoogleVerify.wirteContent')"-->
          <el-input id="inputtext" v-model="secretinp" disabled></el-input>
        </div>
        <el-button class="secretcopy" type="primary" v-clipboard:copy="secretinp"
                   　　v-clipboard:success="copySuc" v-clipboard:error="copyErr">
          <i class="icon-azl-icon-copy" style="font-size:16px;color:#fff;"></i>
        </el-button>
      </div>
      <div class="firststep">
        <p><span class="yellow">{{$t('GoogleVerify.fourthstep')}}. </span><span>{{$t('GoogleVerify.tipsFourth')}}</span>
        </p>
      </div>
      <div class="gooleapp">
        <el-input class="verify-code-input" v-model="otpCode" placeholder="000000" :maxlength="6"></el-input>
      </div>
      <div class="finishbind">
        <el-button type="primary" @click="finishedbind">{{$t('GoogleVerify.completedBtnText')}}</el-button>
        <!-- <el-button @click="getParams">完成绑定</el-button> -->
      </div>
    </div>

  </div>
</template>

<style lang="scss" type="text/scss">
  #app {
    .Goolebox {
      height: 937px;
      width: 1200px;
      margin: 0 auto;
      background: #fff;
      margin-bottom: 62px;
      border-radius: 4px;
      .titletext {
        font-family: PingFang-SC-Medium;
        font-size: 16px;
        line-height: 60px;
        color: #888888;
        padding-left: 20px;
        padding-left: 20px;
        background: #FFFFFF;
        box-shadow: inset 0 -1px 0 0 #E5E5E5;
      }
      .firststep {
        padding-top: 40px;
        padding-left: 40px;
        font-family: PingFang-SC-Medium;
        font-size: 14px;
        line-height: 20px;
        color: #555555;
      }
      .yellow {
        color: #C9933E;

      }
      .GooleDownload {
        zoom: 1;
        margin-top: 30px;
      }
      .GooleDownload::after {
        content: '\0020';
        height: 0;
        display: block;
        clear: both;
      }
      .GooleDownloadPic {
        width: 120px;
        float: left;
        padding-left: 91px;
        text-align: center;
        font-family: PingFang-SC-Medium;
        font-size: 14px;
        line-height: 20px;
        color: #888888;
      }
      .GooleDownloadLink {
        float: left;
        margin-left: 30px;
        padding-top: 10px;
      }
      .iosversion {
        background: #FFFFFF;
        border: 1px solid #D5D5D5;
        border-radius: 4px;
        width: 160px;
        height: 40px;
        font-family: PingFang-SC-Regular;
        line-height: 40px;
        color: #555555;
        display: inline-block;
        text-align: center;
        span {
          font-size: 14px;
        }
      }
      .iosversion img {
        width: 16px;
        vertical-align: middle;
        margin-right: 6px;
        margin-top: -3px;
      }
      .iosusehelp {
        font-family: PingFang-SC-Regular;
        color: #C9933E;
        margin-left: 17px;
        font-size: 14px;
      }
      .androidversion {
        background: #FFFFFF;
        border: 1px solid #D5D5D5;
        border-radius: 4px;
        width: 160px;
        height: 40px;
        font-family: PingFang-SC-Regular;
        line-height: 40px;
        color: #555555;
        display: inline-block;
        text-align: center;
        span {
          font-size: 14px;
        }
      }
      .androidversion img {
        width: 20px;
        vertical-align: middle;
      }
      .DownBottom {
        margin-top: 20px;
      }
      .codescan {
        width: 120px;
        height: 120px;
        margin-top: 30px;
        margin-left: 91px;
      }
      #canvas {
        width: 100% !important;
        height: auto !important;
      }

      .ifyouneed {
        margin-top: 10px;
        text-indent: 44px;;
      }
      .pink {
        color: $--color-danger;
      }
      .secretcode {
        zoom: 1;
        margin: 30px 0 0 91px;
      }
      .secretcode::after {
        content: "\0020";
        height: 0;
        display: block;
        clear: both;
      }
      .secretinput {
        float: left;
      }
      .secretcopy {
        float: left;
        width: 55px;
        height: 44px;
        background: #C9933E;
        border-radius: 4px;
        margin-left: 20px;
      }
      .secretcopy img {
        vertical-align: middle;
      }
      .finishbind {
        margin-top: 30px;
        margin-left: 91px;
      }
    }
    .Goolebox {
      .secretinput .el-input__inner {
        width: 258px;
        height: 44px;
        background: #F5F5F5;
        border: 1px solid #EAEAEA;
        border-radius: 4px;
        font-family: OpenSans-Bold;
        font-size: 18px;
        color: #C9933E;
        font-weight: bold;
      }
      .finishbind .el-button {
        width: 180px;
        height: 44px;
        background: #C9933E;
        border-radius: 4px;
        font-family: PingFang-SC-Medium;
        font-size: 14px;
        color: #FFFFFF;
      }
      .gooleapp {
        margin: 30px 0 0 91px;
        // .el-input__inner{
        //     width:180px;
        //     height:44px;
        //     background: #F5F5F5;
        //     border: 1px solid #EAEAEA;
        //     border-radius: 4px;
        //     padding-left:42px;
        //     font-family: OpenSans-Bold;
        //     font-size: 28px;
        //     color: #D5D5D5;
        // }
        .verify-code-input {
          width: 180px;
          height: 44px;
          ::-webkit-input-placeholder { /*WebKit browsers*/
            color: #E5E5E5;
            font-size: 24px;
            letter-spacing: 5px;
            line-height: 44px;
          }
          ::-moz-placeholder { /*Mozilla Firefox*/
            color: #E5E5E5;
            font-size: 24px;
            letter-spacing: 5px;
            line-height: 44px;
          }
          :-moz-placeholder { /*Mozilla Firefox*/
            color: #E5E5E5;
            font-size: 24px;
            letter-spacing: 5px;
            line-height: 44px;
          }
          :-ms-input-placeholder { /*Internet Explorer*/
            color: #E5E5E5;
            font-size: 24px;
            letter-spacing: 5px;
            line-height: 44px;
          }
        }
        .verify-code-input .el-input__inner {
          text-align: center;
          font-size: 24px;
          letter-spacing: 5px;
        }
      }
    }
  }
</style>

<script>
  import topBar from "../topBar"
  import QRCode from 'qrcode'
  import "../../../../../main"
  import api from '../../../../../libs/api'

  export default {
    name: "StartGoogleverify",
    data() {
      return {
        secretinp: "",
        otpCode: "",
      }
    },
    components: {
      topBar
    },
    computed: {
      userInfo() {
        return this.$store.state.user.info;
      },
    },
    watch: {
      '$route': 'getParams',
      userInfo(val) {
        if (val) {
          this.useqrcode(); // 考虑获取用户信息的异步情况
        }
      }
    },
    methods: {
      copySuc() {
        this.$message({message:this.$t('GoogleVerify.copySuc'),type:'success',showClose:true});
      },
      copyErr(){
        this.$message({message:this.$t('GoogleVerify.copyErr'),type:'error',showClose:true});
      },
      finishedbind() {
        if(!this.otpCode){
          this.$message({message:this.$t('GoogleVerify.gCodePlc'),type:'error',showClose:true});
          return
        }else if(!/^[0-9]{6}$/.test(this.otpCode)){
          this.$message({message:this.$t('GoogleVerify.gCodeValErr'),type:'error',showClose:true});
          return
        }
        let Gooyanzhengma = {
          captcha: this.otpCode
        }
        api.post("/User/BindOtp", Gooyanzhengma)
          .then((res) => {
            this.$router.push({
              name: 'accountSettingHome',
              query: {
                needConfirmGooVerifyBox: true
              }
            });
            this.$store.dispatch('getUser');
          })
          .catch((err) => {
            console.log(err);
            console.log("222")
          })
      },
      useqrcode() {//
        // that.QueryDetail='www.baidu.com';
        let account;
        account = this.userInfo.phoneNumber || this.userInfo.email;
        this.QueryDetail = 'otpauth://totp/' + account + "%20AZEX.io?secret=" + this.secretinp;
        let canvas = document.getElementById('canvas');
        QRCode.toCanvas(canvas, this.QueryDetail, {
          color: {
            dark: '#C9933E',
            light: '#fff'
          },
          margin: 0,
        }, function (error) {
          if (error) console.error(error)
        })
      },
      getParams() {
        // 取到路由带过来的参数
        let routerParams = this.$route.query.dataObj
        // `"${routerParams}"`
        // 将数据放在当前组件的数据内
        this.secretinp = routerParams
      }
    },
    mounted() {
      this.getParams();
      if (this.userInfo) {
        this.useqrcode();
      }
    },
    created() {

    },

  }
</script>
