<template>
  <div class="hello" :class="{loginBg:this.$route.query.id}">
    <div>
    <div class="showToast" v-show="OnePhone">
      <div>
        <img style="width:180px;height:40px;display:block;margin:0 auto;padding-top:40px;"
             src="../../../assets/img/az-pt-logo-2.svg"/>
      </div>
      <div class="error" v-if="errorSync"><i class="el-icon-info"></i>&nbsp;<span>{{errorMess}}</span></div>
      <el-input class="emailInput" v-model="NumInput" :placeholder="$t('forgetPwd.PhoneOrEmail')" @blur="ReSmart"></el-input>
      <div class="passwordBox">
        <el-input class="passwordInput" id="demo_input" v-model="passwordInput" type="password" :placeholder="$t('login.InputPwd')">
        </el-input>
        <img id="demo_img" @click="hideShowPsw()"
             src="../../../../static/img/az-icon-hide.svg">
        <!--<img class="demo_img" v-if="!passwordDisplay" @click="hideShowPsw()" src="../../../assets/img/az-icon-hide.svg">-->
        </div>
      <div class="ScFather" @click="SmartCLick">
        <smart-capture ref="smartCapture" @success="reV" style="margin-top:18px;"></smart-capture>
      </div>

      <div class="submitBox">
        <el-button :disabled="isRevOk" class="submitBtn" type="primary" @click="LoginTo" :loading="loading">{{$t('message.Login')}}</el-button>
      </div>
      <p class="forgetPassword">
        <router-link class="router-btn" :to="{name:'fogetPassword',query:$route.query}">{{$t('login.ForgetPwd')}}</router-link>
        <span class="registerNow">
         <span style="margin-right: 5px">{{$t('login.NotAzex')}}</span>
         <router-link class="router-btn" :to="{name:'register',query:$route.query}"> {{$t('login.Toregister')}}</router-link>
       </span>
      </p>
      </div>

    </div>
    <div class="showTwoPhone" v-show="TwoPhone">
      <div class="header">
        <img src="../../../assets/img/az-icon-arrow-left.svg" alt="" class="back" @click="Toback">
        <p>{{ $t("login.ChoicePhone") }}</p>
      </div>
      <div class="toomore">
        <p>{{ $t("login.TooMorePhone") }}</p>
      </div>
      <div class="countryBox">
        <div v-for="(item, index) in countryInfos" :key="index" @click="TruePhone(item.phoneCode, index)"
             :class="{Active : item.isgou}">
          <div class="conuntry">
            <!--<img :src="'../../../static/img/country/dist/az-country-'+ countryInfos[index].shortName + '.png'" alt=""-->
                 <!--class="NationalFlag">-->
            <span :class="`flagImg ${countryInfos[index].shortName}`">
            </span>
            <span
              style="display: inline-block;vertical-align: middle;width: 135px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-family:PingFang-SC-Regular;color:rgba(85,85,85,1);">{{item.countryName}}</span>
            <span style="display: inline-block;vertical-align: top;line-height: 32px;"><i
              class="iconfont icon-az-icon-check iconColor" v-if="item.isgou"></i></span>
          </div>
          <div class="phoneNum">+{{item.phoneCode}}&nbsp;{{NumInput}}</div>
        </div>
      </div>
      <div class="submitBox">
        <el-button type="primary" class="sureBtn" @click="sureSubmit" :loading="loading">{{$t("message.Ensure")}}</el-button>
      </div>
    </div>
    <!--手机验证-->
    <phone-verification ref="phoneVerify" @listenToChild="getChildMsg"></phone-verification>
    <!--谷歌-->
    <google-verify ref="googleVerify"></google-verify>
  </div>
</template>

<script>
  import PhoneVerification from '../../common/phoneVerification'
  import googleVerify from '../../common/googleVerify/index'
  import api from '../../../libs/api'
  // import './login.css'
  import smartCapture from '../../common/smartCapture'
  export default {
    name: 'HelloWorld',
    data() {
      return {
        routerId:this.$route.query.id?this.$route.query.id:"",
        LoginToZendesk:false,
        NumInput: '',
        passwordInput: '',
        // passwordDisplay: false,
        errorMess: "",
        errorSync: false,
        OnePhone: true,
        TwoPhone: false,
        canLogin: false,
        GooshowDialog: false,
        Goocode: "",
        countryCode: "",
        countryInfos: [],
        rid: "",
        loading: false,
        r: {
          sessionId: "",
          sig: "",
          token: "",
          scene: ""
        },
        UserLoginPhone: {
          phoneCode: "",
          phoneNumber: "",
          password: "",
          rid: ""
        },
        captcha: "",
        disableds: false,
        endTime: {
          phoneTimeSync: true,
          phoneTime: 60,
          PhonecolorYello: true,
        },
        VerifyCaptcha: "",
        ridNum:'',
        isRevOk:false
      }
    },
    components: {
      PhoneVerification,
      googleVerify,
      'smart-capture':smartCapture
    },
    computed: {
      userInfo() {
        console.log(this.$store.state.user.info);
        return this.$store.state.user.info;
      },
    },
    created(){
      if(this.$route.query.LoginToZendesk){
        this.LoginToZendesk = this.$route.query.LoginToZendesk;
      }
    },
    mounted() {
      // this.reV();
      if(!this.$store.state.user.isSecVerification && this.$store.state.user.token){
        this.$store.dispatch('clearToken');
      }
    },
  methods:{
    getChildMsg(val){
      this.ridNum = val;
      if(this.ridNum > 3){
        this.ReSmart();
        return;
      }
    },
    SmartCLick(){
      if(!this.canLogin){
        this.isRevOk = true;
      }
    },
    ReSmart(){
      this.$refs.smartCapture.init();
      this.canLogin = false;
    },
    // 人机验证
    reV(data) {
      if (/^[0-9]{3,50}$/.test(this.NumInput) == false && !this.isEmail(this.NumInput)) {
        this.$message({showClose: true, message: this.$t('login.InputTrueNum'), type: 'error'});
        this.errorMess = this.$t('forgetPwd.InputTrueNum');
        this.errorSync = true;
        this.ReSmart();
        this.isRevOk = false;
      } else {
        this.r = {
          sessionId: data.sessionId,
          sig: data.sig,
          token: NVC_Opt.token,
          scene: window.NVC_Opt.scene
        };
        api.post('/RobotValidator/Validate', this.r)
          .then((res) => {
            this.canLogin = true;
            this.errorSync = false;
            this.rid = res.data.value.rid;
            this.isRevOk = false;
          }).catch((err) => {
            this.message({showClose: true, message: this.$t('smartCaptcha.ValidateFaild'), type: 'error'});
            this.isRevOk = false;
            this.ReSmart();
        });
      }
    },
    LoginTo() {
        this.loading = true;
      if (!this.passwordInput){
        this.errorMess = this.$t('setNewPwd.PwdNoNull');
        this.errorSync = true;
        this.loading = false;
      }else if (!(this.isEmail(this.NumInput) || this.isPhone(this.NumInput))) {
        this.errorMess = this.$t('forgetPwd.InputTrueNum');
        this.errorSync = true;
        this.loading = false;
        this.ReSmart();
      }else if(/^[0-9]{8,20}$/.test(this.passwordInput)){
          this.errorMess = this.$t('setNewPwd.InputTruePwd');
          this.errorSync = true;
          this.loading = false;
        } else if (this.canLogin == false) {
          this.errorMess = this.$t('login.SmartVer');
          this.errorSync = true;
          this.loading = false;
        } else if (/^[~!@#$%^&*\x220-9a-zA-Z]{8,20}$/.test(this.passwordInput) == false) {
          this.errorMess = this.$t('updatePwd.passwordWrong');
          this.errorSync = true;
          this.loading = false;
        } else {
          this.errorSync = false;
          if (this.isPhone(this.NumInput)) {
            let checkPhone = {
              phoneNumber: this.NumInput,
              rid: this.rid
            }
            api.post("/User/CheckPhone", checkPhone)
              .then((res) => {
                // console.log(res);
                if (res.data.value.countryInfos.length > 1) {
                  for (let i = 0; i < res.data.value.countryInfos.length; i++) {
                    res.data.value.countryInfos[i].isgou = false;
                  }
                  this.countryInfos = res.data.value.countryInfos;
                  this.countryInfos[0].isgou = true;
                  this.UserLoginPhone.phoneCode = this.countryInfos[0].phoneCode;
                  this.loading = false;
                  this.OnePhone = false;
                  this.TwoPhone = true;
                } else if (res.data.value.countryInfos.length == 1) {
                  this.UserLoginPhone = {
                    phoneCode: res.data.value.countryInfos[0].phoneCode,
                    phoneNumber: this.NumInput,
                    password: this.passwordInput,
                    rid: this.rid
                  }
                  api.post("/User/Login", this.UserLoginPhone).then((res) => {
                    // console.log(res);
                    this.$store.dispatch("setToken", res.data.value.token);
                    this.getSecVerType();
                  }).catch((err) => {
                    this.loading = false;
                    if(err.data.err.code == "-30"){
                      this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
                      this.ReSmart();
                    }
                    if(err.data.err.value == 2){
                      this.$message({showClose: true, message: this.$t('login.WrongPwdThi'), type: 'error'});
                    }
                    if(err.data.err.value == 3){
                      this.$message({showClose: true, message: this.$t('login.WrongPwdTwo'), type: 'error'});
                    }
                    if(err.data.err.value == 4){
                      this.$message({showClose: true, message: this.$t('login.WrongPwdOne'), type: 'error'});
                    }
                  })
                } else if (res.data.value.countryInfos.length == 0) {
                  this.loading = false;
                  this.$message({showClose:true, message:this.$t('forgetPwd.AccountDoesNotExistPleaseRe') , type:'error'});
                }
            }).catch((err)=> {
              console.log(err);
                if(err.data.err.code == "-30"){
                  this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
                  this.ReSmart();
                }
            this.loading = false;
          })
        }else if(this.isEmail(this.NumInput)){
          let userLogin = {
            email: this.NumInput,
            password: this.passwordInput,
            rid: this.rid
          }
          api.post("/User/Login", userLogin).then((res)=> {
            this.$store.dispatch("setToken", res.data.value.token);
            this.getSecVerType();
          }).catch((err)=> {
            this.loading = false;
            if(err.data.err.value == 2){
              this.$message({showClose: true, message: this.$t('login.WrongPwdThi'), type: 'error'});
            }
            if(err.data.err.value == 3){
              this.$message({showClose: true, message: this.$t('login.WrongPwdTwo'), type: 'error'});
            }
            if(err.data.err.value == 4){
              this.$message({showClose: true, message: this.$t('login.WrongPwdOne'), type: 'error'});
            }
            if(err.data.err.code == "-30"){
              this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
              this.ReSmart();
            }
          })
        }
      }
    },
    getSecVerType(){
          api.post("/User/GetUserInfo", null)
            .then((res)=>{
              this.$store.dispatch('setUser',res.data.value);
              if (res.data.value.userOtpStatus === 1) {
                api.post('/User/SendSecondVerifyCaptcha',null)
                  .then((resp)=>{
                    this.loading = false;
                    this.$refs.googleVerify.open('/User/SecondVerify', this.enableGoogle);
                  })
                  .catch((err)=>{
                    this.loading = false;
                    console.log(err);
                  })
              }else if(res.data.value.phoneNumber){
                api.post('/User/SendSecondVerifyCaptcha',null)
                  .then((resp)=>{
                    this.loading = false;
                    if(this.ridNum == ""){
                      this.ridNum = 1;
                    }else {
                      this.ridNum+=1;
                    }
                    if(this.ridNum > 3){
                      this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
                      this.ReSmart();
                      return;
                    }
                    this.$refs.phoneVerify.open(res.data.value.phoneNumber, "/User/SendSecondVerifyCaptcha", "/User/SecondVerify", this.callbB, null, this.ridNum);
                  })
                  .catch((err)=>{
                    this.loading = false;
                    console.log(err);
                  })
              }else {
                this.loading = false;
                this.$store.dispatch("setSecVerification", true);
                if(this.LoginToZendesk){
                  this.$router.push({name:'Zendesk',query:{url:`https://support.azex.io/hc/${this.$store.state.user.language === 'cn'?'zh-cn':'en-us'}/`}})
                  return;
                }
                this.$router.replace(this.$route.query.redirect || '/');
              }
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          })

      },
      isPhone(phone) {
        let myreg = /^\d{3,99}$/;
        if (!myreg.test(phone)) {
          return false;
        } else {
          return true;
        }
      },
      isEmail(email) {
        let myreg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,99}/; //正则表达式
        if (!myreg.test(email)) {
          return false;
        } else {
          return true;
        }
      },
      Toback() {
        this.OnePhone = true;
        this.TwoPhone = false;
        this.ReSmart();
      },
      hideShowPsw: function () {
        // this.passwordDisplay = !this.passwordDisplay;
        let demoInput = document.getElementById("demo_input");
        let ImgSrc = document.getElementById('demo_img');
        if (demoInput.type == "password") {
          ImgSrc.src = '../../../../static/img/az-icon-display.svg';
          demoInput.type = "text";
        } else {
          ImgSrc.src = '../../../../static/img/az-icon-hide.svg';
          demoInput.type = "password";
        }
      },
      TruePhone(Num, index) {
        for (let i = 0; i < this.countryInfos.length; i++) {
          this.$set(this.countryInfos[i], 'isgou', false)
        }
        this.$set(this.countryInfos[index], 'isgou', true);
        this.UserLoginPhone.phoneCode = Num;
      },
      sureSubmit() {
        this.loading = true;
        this.UserLoginPhone.phoneNumber = this.NumInput;
        this.UserLoginPhone.password = this.passwordInput;
        this.UserLoginPhone.rid = this.rid;

        api.post("/User/Login", this.UserLoginPhone).then((res) => {
          this.$store.dispatch("setToken", res.data.value.token);
          this.getSecVerType();
        }).catch((err) => {
          if(err.data.err.code == "-30"){
            this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
            this.ReSmart();
          }
          if(err.data.err.value == 2){
            this.$message({showClose: true, message: this.$t('login.WrongPwdThi'), type: 'error'});
          }
          if(err.data.err.value == 3){
            this.$message({showClose: true, message: this.$t('login.WrongPwdTwo'), type: 'error'});
          }
          if(err.data.err.value == 4){
            this.$message({showClose: true, message: this.$t('login.WrongPwdOne'), type: 'error'});
          }
          this.loading = false;
        })
      },
      callbB(obj) {
        this.$store.dispatch("setSecVerification", true);
        this.$store.dispatch("setToken", obj.data.value.token);
        if(this.LoginToZendesk){
          this.$router.push({name:'Zendesk',query:{url:`https://support.azex.io/hc/${this.$store.state.user.language === 'cn'?'zh-cn':'en-us'}/`}})
          return
        }
        this.$router.replace(this.$route.query.redirect || '/');
      },
      enableGoogle(obj) {
        if(!obj.close){
          this.$store.dispatch("setSecVerification", true);
          this.$store.dispatch("setToken", obj.data.value.token);
          if(this.LoginToZendesk){
            this.$router.push({name:'Zendesk',query:{url:`https://support.azex.io/hc/${this.$store.state.user.language === 'cn'?'zh-cn':'en-us'}/`}})
            return;
          }
          this.$router.replace(this.$route.query.redirect || '/');
        }
      },
    },
  }
</script>
<style>
.loginBg{
  background:linear-gradient(90deg,rgba(64,85,128,1),rgba(46,65,102,1));
}
  .hello .el-dialog {
    margin-top: 0px !important;
    border: 0px;
    border-radius: 0px;
    box-shadow: none;
  }

  .hello .el-dialog__wrapper {
    position: static;
  }
</style>

<style scoped lang="scss" type="text/scss">
  .ScFather{
    width:320px;
    margin: auto;
  }
  .hello {
    width:100%;
    height:100%;
    padding-top: 179px;
  }
  .showToast {
    background: #ffffff;
    height: 455px;
    width: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 6px;
  }

  .emailInput {
    width: 320px;
    height: 44px;
    display: block;
    margin: 0 auto;
    margin-top: 40px;
    border-radius: 6px;
  }

  .passwordBox {
    position: relative;
  }

  #demo_img {
    position: absolute;
    right: 51px;
    top: 12px;
    z-index: 99;
  }

  .passwordInput {
    width: 320px;
    height: 44px;
    display: block;
    margin: 0 auto;
    margin-top: 20px;
    border-radius: 6px;
  }

  .submitBox {
    padding-top: 30px;
  }

  .iconColor {
    color: $--color-success;
  }

  .submitBtn {
    width: 320px;
    height: 44px;
    display: block;
    margin: 0 auto;
    border-radius: 4px;
  }

  .forgetPassword {
    text-align: left;
    color: #9a9a9a;
    padding-top: 20px;
    width: 320px;
    margin: 0 auto;
    display: flex;
    font-size: 12px;
  }

  #app .index .forgetPassword a.router-btn {
    font-size: 12px;
  }

  .registerNow {
    flex: 1;
    text-align: right;
    color: #9a9a9a;
  }

  .orange {
    color: #d5aa66;
  }

  .showTwoPhone {
    background: #ffffff;
    height: 455px;
    width: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);

    border-radius: 6px;
  }

  .header {
    width: 100%;
    height: 56px;
    text-align: center;
    position: relative;
  }

  .header .back {
    width: 8px;
    height: 16px;
    position: absolute;
    top: 50%;
    left: 20px;
    margin-top: -8px;
  }

  .header p {
    line-height: 56px;
    font-size: 16px;
    color: rgba(51, 51, 51, 1);
    font-family: PingFang-SC-Medium;
  }

  .toomore {
    margin: 20px 0;
    width: 100%;
    text-align: center;
    font-size: 14px;
    font-family: PingFang-SC-Medium;
    color: rgba(85, 85, 85, 1);
  }

  .countryBox {
    width: 320px;
    height: 200px;
    margin: 0 auto;
    border: 1px solid #EAEAEA;
  }

  .countryBox > div {
    width: 100%;
    height: 32px;
    line-height: 32px;
    /*border-bottom: 1px solid #EAEAEA;*/
    margin-bottom: 1px;
  }

  .countryBox .conuntry {
    display: inline-block;
  }

  .countryBox .conuntry .flagImg{
    width: 30px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
    margin:0px 10px;
    background-image:url('../../../assets/img/flags@2x.png');
    background-size: auto 20px;
  }

  .countryBox .phoneNum {
    display: inline-block;
    float: right;
    line-height: 32px;
    margin-right: 10px;
    font-size: 12px;
    font-family: PingFang-SC-Regular;
    color: rgba(85, 85, 85, 1);
  }

  .sureBtn {
    width: 320px;
    height: 44px;
    display: block;
    margin: 0 auto;
    border-radius: 4px;
    color: #ffffff;
    background: #c9933e;
  }

  .Active {
    background: rgb(245, 245, 245);
  }

  .colorYello {
    color: #C9933E;
  }

  .getMints1 {
    position: absolute;
    right: 45px;
    top: 19px;
    border: none !important;
    background: #F5F5F5;
  }

  .error {
    position: absolute;
    top: 99px;
    left: 43px;
    font-size: 12px;
    color: $--color-danger;
  }

  .NationalFlag {
    width: 24px;
    height: 16px;
    margin: 8px 10px;

  }

  .NationalFlag:focus {
    outline: none;
  }

  .iconColor {
    color: $--color-success;
  }
</style>


