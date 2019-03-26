<template>
  <div class="register" :class="{regisBg:this.$route.query.id}">
      <div class="registerBox">
        <div class="error" v-if="errorSync"><i class="el-icon-info"></i>
          <span style="letter-spacing:-0.2px;margin-left:5px;">{{errorMess}}</span>
        </div>
        <div class="tab">
          <div class="toPhone" @click="toPhone"><span :class="{toPhoneSpan:toPhoneSpan}">{{ $t("register.phoneRegister") }} </span></div>
          <div class="toEmail" @click="toEmail"><span :class="{toPhoneSpan:!toPhoneSpan}">{{ $t("register.emailRegister") }} </span></div>
        </div>

        <div class="phoneTest" >

          <v-country ref="country" @country="getCountryEmitFn" v-show="isPhone"></v-country>

          <input  :placeholder="$t('register.email')" v-model="submit.email"  v-if="!isPhone"  class="input marginTopInput" style="margin-top:0;" @blur="changeEmail" >

          <input v-model="submit.password" :placeholder="$t('register.password')" type="password" class="input marginTopInput">
          <input v-model="submit.repassword" :placeholder="$t('register.rePassword')" type="password" class="input marginTopInput">

          <smart-capture ref="smartCapture" @success="smartCapture" style="margin-top:18px;"></smart-capture>

          <div class="sendCaptcha"><!-- 发送验证码 重新发送 -->
            <input v-model="submit.captcha" :placeholder="captchaMess" type="text" :maxlength="6" class="input">
            <button v-if="phoneAgain" :disabled="disableds" :class="{colorYello:endTime.PhonecolorYello}" class="getMints1"
            @click="reGetPhoneCode">{{ $t("register.reGetTime") }}
                <span v-if="endTime.phoneTimeSync">({{endTime.phoneTime}}s)</span>
            </button>
          </div>
          <el-button type="primary"  :loading="phonLoading" class="registerSubmit" @click="buttonSubmit"> {{ $t("register.register") }} </el-button>
          <div class="resigBottom">
            <el-checkbox v-model="checked" style="float:left"></el-checkbox>
            <span style="float:left;margin-left:5px;margin-top:3px;letter-spacing:-0.2px;">{{ $t("register.registerAndAgree") }}
              <a style="margin-left:5px;" class="router-btn" :href="`https://support.azex.io/hc/${$store.state.user.language=='cn'?'zh-cn':'en-us'}/articles/360005418014-%E7%94%A8%E6%88%B7%E6%9D%A1%E6%AC%BE`" target="_blank">{{ $t("register.userTittle") }}</a>
            </span>
            <span style="float:right;margin-top:3px;letter-spacing:-0.2px;">{{ $t("register.hasUser") }}
              <a @click="$router.push({name:'login',query:$route.query})" class="router-btn">{{ $t("register.login") }}</a>
            </span>
          </div>
        </div>



      </div>
  </div>
</template>

<script>
import api from '../../../libs/api'
import County from '../../common/country'
import smartCapture from '../../common/smartCapture'
export default {
  data () {
    return {
      routerId:this.$route.query.id?this.$route.query.id:"",
      captchaMess:this.$t('register.enterPhoneWidraw'),
      sendMessToMachion:"",//发送次数
      isPhone:true,
      checked:true,
      mainImg:"",
      Timeset:null,
      phonLoading:false,
      toPhoneSpan:true,
      endTime:{
        phoneTimeSync:true,
        phoneTime:60,
        PhonecolorYello:false,
      },
      disableds:false,
      errorMess:"",
      errorSync:false,
      phoneAgain:false,
      submit:{
        "phoneNumber": "",
        "phoneCode": "",//国家代码
        "password": "",
        "captcha": "",//验证码
        "captchaId": "",//发送验证码后返回的值
        "rid": "",
        "repassword":"",
        "phonNumber":"",//短信验证码
        "email":""
      },
      r:{
        "sessionId": "",
        "sig": "",
        "token": "",
        "scene": ""
      },
      rid:"",
    }
  },
  components:{
      'v-country':County,
      'smart-capture':smartCapture
  },
  mounted:function(){
    // alert(this.$route.query.user?1:2);
    // alert(this.routerId)
    // setTimeout(() => {
    //   let that = this;
    //   that.toPhone();
    //   document.getElementsByClassName("sm-btn")[0].style.border="0";
    // }, 500);

  },
  methods:{
    PhonetimeEndFn(that){
        clearInterval(this.Timeset);
        that.endTime.phoneTimeSync = true;
        that.disableds = true;
        that.endTime.PhonecolorYello = false;

        that.endTime.phoneTime = 60;
        this.Timeset = setInterval(function(){
          if(that.endTime.phoneTime>0){
            that.endTime.phoneTime = parseInt(that.endTime.phoneTime)-1;
          }else{
            that.endTime.phoneTimeSync = false;
            that.disableds = false;
            clearInterval(this.Timeset);
            that.endTime.PhonecolorYello = true;
          }
        },1000)
    },
    smartCapture(data){//验证码验证成功
        console.log(data)
        if(this.isPhone){
            if(/^[0-9]{3,99}$/.test(this.submit.phoneNumber)==false){
                this.errorSync=true;
                this.errorMess= this.$t('register.enterEffectPhone');
                this.empty();
            }else {
                this.errorSync=false;
                this.r = {
                    "sessionId": data.sessionId,
                    "sig": data.sig,
                    "token": NVC_Opt.token,
                    "scene": window.NVC_Opt.scene
                }
                api.post('/RobotValidator/Validate', this.r).then((res)=>{//智能验证
                    this.rid = res.data.value.rid;
                    let parme = {
                        "phoneNumber": this.submit.phoneNumber,
                        "phoneCode": this.submit.phoneCode,
                        "rid": this.rid,
                    }

                    api.post('/Captcha/Send', parme).then((res)=>{//短信验证
                        console.log("发送验证码成功");
                        this.submit.captchaId = res.data.value.captchaId;
                        this.disableds = true;
                        this.phoneAgain = true;
                        this.PhonetimeEndFn(this);//时间

                        console.log(res);
                    }).catch((err)=> {
                        this.empty();
                        console.log("error")
                    })
                }).catch((err)=> {
                    this.empty();
                    console.log("error2")
                })

            }
        }else{
            if(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(this.submit.email)==false){
                this.errorSync=true;
                this.errorMess=this.$t('register.emailIsNotTrue');
                this.empty();
            }else {
                this.errorSync=false;
                this.r = {
                    "sessionId": data.sessionId,
                    "sig": data.sig,
                    "token": NVC_Opt.token,
                    "scene": window.NVC_Opt.scene
                }
                api.post('/RobotValidator/Validate', this.r).then((res)=>{
                    this.rid = res.data.value.rid;
                    let parme = {
                        "email": this.submit.email,
                        "rid": this.rid,
                    }
                    console.log(this.submit.email);
                    api.post('/Captcha/Send', parme).then((res)=>{
                        console.log("发送验证码成功");
                        this.submit.captchaId = res.data.value.captchaId;
                        this.disableds = true;
                        this.phoneAgain = true;
                        this.PhonetimeEndFn(this);//时间

                        console.log(res);
                    }).catch((err)=> {
                        this.empty();
                        console.log("error")
                    })
                }).catch((err)=> {
                    this.empty();
                    console.log("error2")
                })

            }
        }
    },
    toPhone(){
        console.log(111)
        this.toPhoneSpan = true;
        this.isPhone = true;
        this.captchaMess=this.$t('register.enterPhoneWidraw');
        this.$refs.country.initPhone();
        this.clearInput();
    },
    toEmail(){
        console.log(222)
        this.toPhoneSpan = false;
        this.isPhone = false;
        this.captchaMess=this.$t('register.enterEmailVerifi');
        this.clearInput();
    },
    buttonSubmit(){
      if (!this.submit.password){
        this.errorMess = this.$t('setNewPwd.PwdNoNull');
        this.errorSync=true;
      }else if(/^[0-9]{8,20}$/.test(this.submit.password)){
            this.errorMess = this.$t('setNewPwd.InputTruePwd');
            this.errorSync = true;
        }else if(!this.submit.repassword.replace(/(^\s*)|(\s*$)/g, "")){
            this.errorSync=true;
            this.errorMess=this.$t("register.enterPasswordAgain");
        }else  if(/^[~!@#$%^&*\x220-9a-zA-Z]{8,20}$/.test(this.submit.password)==false){
            this.errorSync=true;
            this.errorMess=this.$t('updatePwd.passwordWrong');
        }else  if(this.submit.password!=this.submit.repassword){
            this.errorSync=true;
            this.errorMess=this.$t("register.passwordDifferent");
        }else{
            if(this.toPhoneSpan){//进入手机
                if(/^[0-9]{3,99}$/.test(this.submit.phoneNumber)==false){
                    this.errorSync=true;
                    this.errorMess=this.$t("register.enterEffectPhone");
                    return;

                }
            }else{//进入邮箱
                if(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(this.submit.email)==false){
                    this.errorSync=true;
                    this.errorMess=this.$t("register.emailIsNotTrue");
                    return;
                }
            }

            if(!this.rid){
                this.errorSync=true;
                this.errorMess=this.$t("register.toValitIntelligent");
            }else if(/^[0-9]{6}$/.test(this.submit.captcha)==false){
                this.errorSync=true;
                this.errorMess=this.$t("register.verificationCodeError");
            }else{
                if(this.checked==false){
                    this.$message({showClose: true, message:this.$t("register.pleaseTrCkecbox"), type: 'error'});
                    return;
                }
                this.errorSync=false;
                this.phonLoading = true;
                this.submitForm();
            }
        }
    },
    submitForm(){
        if(this.toPhoneSpan){//进入手机
            let par = {
                "phoneNumber": this.submit.phoneNumber ,
                "phoneCode":this.submit.phoneCode,
                "password": this.submit.password,
                "captcha": this.submit.captcha,
                "captchaId": this.submit.captchaId,
                "promoter":this.$route.query.id?this.$route.query.id:0
            }
            api.post('/User/RegisterWithPhone', par).then((res)=>{
                this.phonLoading = false;
                this.$store.dispatch("getUser",res.data.value.token);
                this.$store.dispatch("setToken",res.data.value.token);
                this.$store.dispatch("setSecVerification",true);

                this.$message({showClose: true, message: this.$t("register.registerSuccessTo"), type: 'success',});
                this.$router.replace(this.$route.query.redirect || '/');
                console.log(res.data.value.token);
            },(err)=>{
                console.log(err.data.err.code);
                if(err.data.err.code==3){//验证码错误，不需要重置人机验证
                }else{
                    this.empty();
                }
                this.phonLoading = false;
                this.errorSync=true;
                this.errorMess=err.data.err.message;
            }).catch((err)=> {
                this.empty();
                this.phonLoading = false;
                console.log(err);
            })
        }else{//进入邮箱
            let par = {
                "email": this.submit.email,
                "password": this.submit.password,
                "captcha": this.submit.captcha,
                "captchaId": this.submit.captchaId,
                "promoter":this.$route.query.id?this.$route.query.id:0
            }

            api.post('/User/RegisterWithEmail', par).then((res)=>{
                this.phonLoading = false;
                this.$store.dispatch("getUser",res.data.value.token);
                this.$store.dispatch("setToken",res.data.value.token);
                this.$store.dispatch("setSecVerification",true);
                this.$message({showClose: true, message: this.$t("register.registerSuccessTo"), type: 'success',});
                this.$router.replace(this.$route.query.redirect || '/');
                console.log(res.data.value.token);
            },(err)=>{
                if(err.data.err.code==3){//验证码错误，不需要重置人机验证
                }else{
                    this.empty();
                }
                this.phonLoading = false;
                this.errorSync=true;
                this.errorMess = err.data.err.message;
            }).catch((err)=> {
                this.phonLoading = false;
                this.empty();
                console.log("error")
            })
        }




    },
    getCountryEmitFn(json){
      console.log(json);
      this.submit.phoneNumber = json.phoneNumber;
      this.submit.phoneCode = json.phoneCode;
      this.errorSync=false;
      this.empty();
    },
    changeEmail(){//邮箱改变
        this.errorSync=false;
        this.empty();
    },
    clearInput(){
        this.errorSync=false;
        this.sendMessToMachion = 0;//验证次数
        //this.submit.captchaId = "";//验证码输入
        this.rid = "";
        this.phoneAgain = false;
        this.$refs.smartCapture.init();
        this.submit={
            "phoneNumber": "",
            "phoneCode": "",//国家代码
            "password": "",
            "captcha": "",//验证码
            "captchaId": "",//发送验证码后返回的值
            "rid": "",
            "repassword":"",
            "phonNumber":"",//短信验证码
            "email":""
        }
    },
    empty(){//清空
        this.phoneAgain = false;
        this.submit.captcha="";
        this.rid = "";//人机验证内发送验证码返回的值
        this.sendMessToMachion = 0;//验证次数
        this.$refs.smartCapture.init();
        this.r = {
            "sessionId": "",
            "sig": "",
            "token": "",
            "scene": ""
        }
    },
    reGetPhoneCode(){//重新获取手机验证码
      this.sendMessToMachion += 1;
      if(this.sendMessToMachion>2){
        this.errorSync=true;
        this.errorMess=this.$t("register.reSendTooMore");
        this.phoneAgain = false;
        this.empty();
      }else{
        let that = this;
        let par = {
                "captchaId": that.submit.captchaId,
                "rid": that.rid
          }
          api.post('/Captcha/Resend', par).then((res)=>{//发送验证码
            that.PhonetimeEndFn(that);//时间
            console.log(res);
          }).catch((err)=> {
            that.empty();
            console.log("error")
          })
      }
    },
  }
}
</script>

<style scoped>
.regisBg{
    background:linear-gradient(90deg,rgba(64,85,128,1),rgba(46,65,102,1));
}
.register{
  width:100%;
  height:100%;
}
.registerBox{
  /* width:440px; */
  width:400px;
  height:530px;
  position: absolute;
  left:50%;
  top:50%;
  margin-left:-200px;
  margin-top:-250px;
  background:white;
  overflow:hidden;
  border-radius:5px;
  -webkit-border-radius:5px;
  -moz-border-radius:5px;
}
.error{
  color:red;
  position: absolute;
  left:40px;
  top:64px;
}
.error span{
  font-size:13px;
}
.tab{
  width:100%;
  margin-top:30px;
  box-sizing: border-box;
  color:#B2B2B2;
  display: table;
}
.toPhone{
  width:199px;
  border-right:1px solid #ccc;
  text-align:center;
  height:20px;
  float:left;
  cursor: pointer;
  font-size:16px;
}
.toEmail{
  float:left;
  font-size:16px;
  width:200px;
  height:20px;
  text-align:center;
  margin-bottom:5px;
  cursor: pointer;
}
.phoneTest{
  width:320px;
  margin-left:40px;
  margin-top:35px;
}
.input{
  border-radius:5px;
  -webkit-border-radius:5px;
  -moz-border-radius:5px;
  height:44px;
  background:#f5f5f5;
  border:1px solid #eaeaea;
  text-indent: 8px;
  width:100%;
  font-size:14px;
}
.input:focus{
  outline: none;
}
.marginTopInput{
  margin-top:18px;
}
.sendCaptcha{
  width:100%;
  height:44px;
  margin-top:18px;
  position:relative;
  color:gray!important;
}
.toPhoneSpan{
  color:#C9933E;
}
.smart-capture{
    margin-top:18px;
}
.registerSubmit{
  width:100%;
  height:44px;
  margin-top:30px;
  color:white;
  background:#c9933e;
  border-radius:5px;
  -webkit-border-radius:5px;
  -moz-border-radius:5px;
  border:1px solid #c9933e;
  cursor: pointer;
  font-size:16px;
}
.registerSubmit:focus{
  outline: none;
}
.resigBottom{
  margin-top:15px;
  font-size:12px;
  color:#9c9c9c;
}
.resigBottom a{
  color:#c9933e;
  cursor:pointer;
}
.colorYello{
  color:#c9933e!important;
}
.getMints1{
  position: absolute;
  right:10px;
  top:14px;
  z-index:10;
  border:none!important;
  background: #f5f5f5;
  cursor: pointer;
  color:rgba(178,178,178,1);
}
.getMints1:focus{
  outline: none;
}
</style>
