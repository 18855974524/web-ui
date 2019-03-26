<template>
  <div class="register">
      <div class="registerBox">
        <div class="error" v-if="errorSync"><i class="el-icon-info"></i>
          <span style="letter-spacing:-0.2px;margin-left:5px;">{{errorMess}}</span>
        </div>
        <div class="tab">
          <div class="toPhone" @click="toPhone"><span :class="{toPhoneSpan:toPhoneSpan}">{{ $t("register.phoneRegister") }} </span></div>
          <div class="toEmail" @click="toEmail"><span :class="{toPhoneSpan:!toPhoneSpan}">{{ $t("register.emailRegister") }} </span></div>
        </div>
        <div class="changeResigerBox">

        <div class="phoneTest" :class="{displayNone:displayNone}">

          <v-country @country="getCountryEmitFn"></v-country>

          <input v-model="phoneRegis.password" :placeholder="$t('register.password')" type="password" class="input marginTopInput">
          <input v-model="phoneRegis.repassword" :placeholder="$t('register.rePassword')" type="password" class="input marginTopInput">
          <div class="sc">
            <div id="sc">
            </div>
          </div>
          <div class="sendCaptcha1">
            <input v-model="phoneRegis.captcha" :placeholder="$t('register.enterPhoneWidraw')" type="text" :maxlength="6" class="input">
            <button v-if="phoneAgain" :disabled="disableds" :class="{colorYello:endTime.PhonecolorYello}" class="getMints1"
            @click="reGetPhoneCode">{{ $t("register.reGetTime") }}<span v-if="endTime.phoneTimeSync">({{endTime.phoneTime}}s)</span></button>
          </div>
          <!-- <input type="button" value="注册" :loading="phonLoading" class="registerSubmit" @click="phoneSubmit"/> -->
          <el-button type="primary"  :loading="phonLoading" class="registerSubmit" @click="phoneSubmit"> {{ $t("register.register") }} </el-button>
          <div class="resigBottom">
            <el-checkbox v-model="checked" style="float:left"></el-checkbox>
            <span style="float:left;margin-left:5px;margin-top:3px;letter-spacing:-0.2px;">{{ $t("register.registerAndAgree") }}
              <a style="margin-left:5px;" class="router-btn" :href="`https://support.azex.io/hc/${$store.state.user.language=='cn'?'zh-cn':'en-us'}/articles/360005418014-%E7%94%A8%E6%88%B7%E6%9D%A1%E6%AC%BE`" target="_blank">{{ $t("register.userTittle") }}</a>
            </span>
            <span style="float:right;margin-top:3px;letter-spacing:-0.2px;">{{ $t("register.hasUser") }}
              <a @click="routerId?$router.push('/loginInvite?id='+routerId):$router.push('/login')" class="router-btn">{{ $t("register.login") }}</a>
            </span>
          </div>
        </div>

        <div class="emailTest" :class="{displayNone:!displayNone}">
          <input  :placeholder="$t('register.email')" v-model="emailRegis.email"  class="input marginTopInput" style="margin-top:0;"  @blur="toEmail2">
          <input  :placeholder="$t('register.password')" v-model="emailRegis.password" type="password" class="input marginTopInput">
          <input  :placeholder="$t('register.rePassword')" v-model="emailRegis.repassword" type="password" class="input marginTopInput">
          <div class="sc2">
            <div id="sc2">
            </div>
          </div>
          <div class="sendCaptcha2">
            <input  :placeholder="$t('register.enterEmailVerifi')" v-model="emailRegis.captcha" type="text" :maxlength="6" class="input">
            <button v-if="phoneAgain2" :disabled="disableds2" :class="{colorYello:endTime.emailcolorYello}"
             class="getMints2" @click="reGetEmailCode">{{ $t("register.reGetTime") }}<span v-if="endTime.emailTimeSync">({{endTime.emailTime}}s)</span></button>
          </div>
          <!-- <input type="button" value="注册"  :loading="emailLoading" class="registerSubmit" @click="emailSubmit"/> -->
          <el-button type="primary"  :loading="emailLoading" class="registerSubmit" @click="emailSubmit"> {{ $t("register.register") }} </el-button>
          <div class="resigBottom">
            <el-checkbox v-model="checked" style="float:left"></el-checkbox>&nbsp;
            <span style="float:left;margin-left:5px;margin-top:3px;letter-spacing:-0.2px">
              {{ $t("register.registerAndAgree") }}
              <a style="margin-left:5px;" class="router-btn" :href="`https://support.azex.io/hc/${$store.state.user.language=='cn'?'zh-cn':'en-us'}/articles/360005418014-%E7%94%A8%E6%88%B7%E6%9D%A1%E6%AC%BE`" target="_blank">{{ $t("register.userTittle") }}</a>
            </span>
            <span style="float:right;margin-top:3px;letter-spacing:-0.2px;">
              {{ $t("register.hasUser") }}
              <a @click="routerId?$router.push('/loginInvite?id='+routerId):$router.push('/login')" class="router-btn">{{ $t("register.login") }}</a>
            </span>
          </div>
        </div>

      </div>

      </div>
  </div>
</template>

<script>
import api from '../../../libs/api'
import County from '../../common/country'
export default {
  data () {
    return {
      routerId:this.$route.query.id?this.$route.query.id:"",
      checked:true,
      mainImg:"",
      Timeset:null,
      phonLoading:false,
      emailLoading:false,
      msg: '',
      displayNone:true,
      toPhoneSpan:true,
      // phoneBoxAsync:true,
      endTime:{
        phoneTimeSync:true,
        phoneTime:60,
        PhonecolorYello:false,
        emailTimeSync:true,
        emailTime:60,
        emailcolorYello:false,
      },
      errorMess:"",
      errorSync:false,
      phoneAgain:false,
      phoneAgain2:false,
      ic:null,
      ic2:null,
      disableds:false,
      disableds2:false,
      countyList:[],
      countyAllList:[],
      AllCounty:false,
      searchMess:"",
      phoneRegis:{
        "phoneNumber": "",
        "phoneCode": "",//国家代码
        "password": "",
        "captcha": "",//验证码
        "captchaId": "",//发送验证码后返回的值
        "rid": "",
        "repassword":"",
        "phonNumber":""//短信验证码
      },
      emailRegis:{
        email:"",
        password:"",
        repassword:"",
        emailNumber:"",
        captcha:"",
        captchaId:"",

      },
      r:{
        "sessionId": "",
        "sig": "",
        "token": "",
        "scene": ""
      },
      rid:"",
      sendMessToMachion:0,
    }
  },
  components:{
      'v-country':County,
  },
  mounted:function(){
    // alert(this.$route.query.user?1:2);
    // alert(this.routerId)
    setTimeout(() => {
      let that = this;
      that.toPhone();
      document.getElementsByClassName("sm-btn")[0].style.border="0";
    }, 500);

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
    EmailtimeEndFn(that){
      clearInterval(this.Timeset);
      that.endTime.emailTimeSync = true;
      that.disableds = true;
      that.endTime.emailcolorYello = false;

      that.endTime.emailTime = 60;
        this.Timeset = setInterval(function(){
          if(that.endTime.emailTime>0){
            that.endTime.emailTime =parseInt(that.endTime.emailTime)-1;
          }else{
            that.endTime.emailTimeSync = false;
            that.disableds2 = false;
            clearInterval(this.Timeset);
            that.endTime.emailcolorYello = true;
          }
        },1000)

    },
    toPhone(){
      this.sendMessToMachion=0;
      let that = this;
      that.phoneRegis={
        "phoneNumber": "",
        "phoneCode": this.countyAllList[0]?this.countyAllList[0].phoneCode:"",//国家代码
        "password": "",
        "captcha": "",//验证码
        "captchaId": "",//发送验证码后返回的值
        "rid": "",
        "repassword":"",
        "phonNumber":""//短信验证码
      }

      that.phoneAgain = false;
      this.errorSync=false;
      this.r={
        "sessionId": "",
        "sig": "",
        "token": "",
        "scene": ""
      }
      that.phoneRegis.captchaId = "";
      that.rid = "";

      that.toPhoneSpan = true;
      that.displayNone = true;

      document.getElementById("sc2")?document.getElementById("sc2").remove():null;
      this.ic = null;

      let nulls = document.getElementById("sc")?document.getElementById("sc").remove():"";

      let scClassName = document.getElementsByClassName("sc")[0];
      let para=document.createElement("div");
      para.setAttribute("id","sc");
      para.style.margin = "0";
      scClassName.appendChild(para);

      this.ic = new smartCaptcha({
        renderTo: '#sc',
        width: 322,
        height: 42,
        default_txt: that.$t('smartCaptcha.clickButtonToValidate') ,
        success_txt: that.$t('smartCaptcha.ValidateSuccess') ,
        fail_txt: that.$t('smartCaptcha.ValidateErrorToRefresh') ,
        scaning_txt: that.$t('smartCaptcha.noopsyche') ,
        success: function(data) {
          console.log(data);
          console.log(1111111);
          if(/^[0-9]{3,99}$/.test(that.phoneRegis.phoneNumber)==false){
            that.errorSync=true;
            that.errorMess=that.$t('register.enterEffectPhone');
            that.toPhone2();
          }else{
            // if(that.phoneRegis.password!=that.phoneRegis.repassword){
            //   that.errorSync=true;
            //   that.errorMess=that.$t('register.passwordDifferent');
            // }else if(!that.phoneRegis.password||!that.phoneRegis.repassword){
            //   that.errorSync=true;
            //   that.errorMess=that.$t('register.enterSurePassword');
            // }else{
            //   that.errorSync=false;
            // }
            that.errorSync=false;

            that.r = {
                "sessionId": data.sessionId,
                "sig": data.sig,
                "token": NVC_Opt.token,
                "scene": window.NVC_Opt.scene
            }
            api.post('/RobotValidator/Validate', that.r).then((res)=>{//发送人机验证
                that.rid = res.data.value.rid;
                let parme = {
                  "phoneNumber": that.phoneRegis.phoneNumber,
                  "phoneCode": that.phoneRegis.phoneCode,
                  "rid": that.rid,
                }
                api.post('/Captcha/Send', parme).then((res)=>{
                  console.log("发送验证码成功");
                  that.phoneRegis.captchaId = res.data.value.captchaId;
                  that.phoneAgain=true;
                  that.disableds = true;
                  that.PhonetimeEndFn(that);

                }).catch((err)=> {
                  that.toPhone2();
                  console.log("error")
                })
            }).catch((err)=> {
              that.toPhone2();
              console.log("error2")
            })
          }
        },
      });
      this.ic.init();
      var scId = document.getElementById("sc");
      // scId.style.borderRadius = "5px";
      scId.style.background = "#f5f5f5";
      // scId.style.overflow = "hidden";
      scId.style.border = "1px solid #eaeaea";
      document.getElementsByClassName("sm-btn")[0].style.border="0";

    },
    toPhone2(){
      this.sendMessToMachion=0;
      let that = this;
      // that.phoneRegis.captcha="";
      that.phoneRegis.captchaId="";
      that.phoneRegis.rid="";
      // that.phoneRegis.captcha="";

      that.phoneAgain = false;
      // this.errorSync=false;
      this.r={
        "sessionId": "",
        "sig": "",
        "token": "",
        "scene": ""
      }
      that.phoneRegis.captchaId = "";
      that.rid = "";

      that.toPhoneSpan = true;
      that.displayNone = true;

      document.getElementById("sc2")?document.getElementById("sc2").remove():null;
      this.ic = null;

      let nulls = document.getElementById("sc")?document.getElementById("sc").remove():"";

      let scClassName = document.getElementsByClassName("sc")[0];
      let para=document.createElement("div");
      para.setAttribute("id","sc");
      para.style.margin = "0";
      scClassName.appendChild(para);

      this.ic = new smartCaptcha({
        renderTo: '#sc',
        width: 320,
        height: 42,
        default_txt: that.$t('smartCaptcha.clickButtonToValidate'),
        success_txt:that.$t('smartCaptcha.ValidateSuccess'),
        fail_txt: that.$t('smartCaptcha.ValidateErrorToRefresh'),
        scaning_txt: that.$t('smartCaptcha.noopsyche'),
        success: function(data) {
          console.log(data);
          console.log(1111111);
          if(/^[0-9]{3,99}$/.test(that.phoneRegis.phoneNumber)==false){
            // that.$message({showClose: true, message: '手机号必须为6-50位有效数字！',type: 'warning'});
            that.errorSync=true;
            that.errorMess= that.$t('register.enterEffectPhone');
            that.toPhone2();
          }else {
            // if(that.phoneRegis.password!=that.phoneRegis.repassword){
            //   that.errorSync=true;
            //   that.errorMess=that.$t('smartCaptcha.passwordDifferent');
            // }else if(!that.phoneRegis.password||!that.phoneRegis.repassword){
            //   that.errorSync=true;
            //   that.errorMess=that.$t('smartCaptcha.enterSurePassword');
            // }else{
            //   that.errorSync=false;
            // }
            that.errorSync=false;

            that.r = {
                "sessionId": data.sessionId,
                "sig": data.sig,
                "token": NVC_Opt.token,
                "scene": window.NVC_Opt.scene
            }
            api.post('/RobotValidator/Validate', that.r).then((res)=>{//发送人机验证
                that.rid = res.data.value.rid;
                let parme = {
                  "phoneNumber": that.phoneRegis.phoneNumber,
                  "phoneCode": that.phoneRegis.phoneCode,
                  "rid": that.rid,
                }
                api.post('/Captcha/Send', parme).then((res)=>{
                  console.log("发送验证码成功");
                  that.phoneRegis.captchaId = res.data.value.captchaId;
                  that.phoneAgain=true;
                  that.disableds = true;
                  that.PhonetimeEndFn(that);

                }).catch((err)=> {
                  that.toPhone2();
                  console.log("error")
                })
            }).catch((err)=> {
              that.toPhone2();
              console.log("error2")
            })
          }
        },
      });
      this.ic.init();
      var scId = document.getElementById("sc");
      // scId.style.borderRadius = "5px";
      scId.style.background = "#f5f5f5";
      // scId.style.overflow = "hidden";
      scId.style.border = "1px solid #eaeaea";
      document.getElementsByClassName("sm-btn")[0].style.border="0";

    },
    toEmail(){
      this.sendMessToMachion=0;
      let that = this;
      that.emailRegis={
        email:"",
        password:"",
        repassword:"",
        emailNumber:"",
        captcha:"",
        captchaId:"",
      }
      this.errorSync=false;
      this.r={
        "sessionId": "",
        "sig": "",
        "token": "",
        "scene": ""
      }
      that.rid = "";
      that.emailRegis.captchaId ="",
      that.phoneAgain2 = false;

      that.toPhoneSpan = false;
      that.displayNone = false;

      document.getElementById("sc")?document.getElementById("sc").remove():null;
      let nulls = document.getElementById("sc2")?document.getElementById("sc2").remove():"";

      let scClassName = document.getElementsByClassName("sc2")[0];
      let para=document.createElement("div");
      para.setAttribute("id","sc2");
      scClassName.appendChild(para);

      this.ic2=null;
      this.ic2 = new smartCaptcha({
        renderTo: '#sc2',
        width: 320,
        height: 42,
        default_txt: that.$t('smartCaptcha.clickButtonToValidate'),
        success_txt: that.$t('smartCaptcha.ValidateSuccess'),
        fail_txt: that.$t('smartCaptcha.ValidateErrorToRefresh'),
        scaning_txt: that.$t('smartCaptcha.noopsyche'),
        success: function(data) {
          console.log(data);
          console.log(1111111);
          if(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(that.emailRegis.email)==false){
            that.errorSync=true;
            that.errorMess=that.$t('register.emailIsNotTrue');
            that.toEmail2();
          }else {
            // if(!that.emailRegis.password||!that.emailRegis.repassword){
            //   that.errorSync=true;
            //   that.errorMess="请输入密码！";
            // }else if(that.emailRegis.password!=that.emailRegis.repassword){
            //   that.errorSync=true;
            //   that.errorMess="两次密码输入不相同，请重新输入！";
            // }else{
            //   that.errorSync=false;
            // }
            that.errorSync=false;
            that.r = {
                "sessionId": data.sessionId,
                "sig": data.sig,
                "token": NVC_Opt.token,
                "scene": window.NVC_Opt.scene
            }
            api.post('/RobotValidator/Validate', that.r).then((res)=>{
                that.rid = res.data.value.rid;
                let parme = {
                  "email": that.emailRegis.email,
                  "rid": that.rid,
                }
                console.log(that.emailRegis.email);
                api.post('/Captcha/Send', parme).then((res)=>{
                  console.log("发送验证码成功");
                  that.emailRegis.captchaId = res.data.value.captchaId;
                  that.disableds2 = true;
                  that.phoneAgain2 = true;
                  that.EmailtimeEndFn(that);//时间

                  console.log(res);
                }).catch((err)=> {
                  that.toEmail2();
                  console.log("error")
                })
            }).catch((err)=> {
              that.toEmail2();
              console.log("error2")
            })
          }
        },
      });
      this.ic2.init();
      var scId2 = document.getElementById("sc2");
      // scId2.style.borderRadius = "5px";
      scId2.style.background = "#f5f5f5";
      // scId2.style.overflow = "hidden";
      scId2.style.border = "1px solid #eaeaea";
      document.getElementsByClassName("sm-btn")[0].style.border="0";


    },
    toEmail2(){
      this.sendMessToMachion=0;
      let that = this;
      that.emailRegis.emailNumber="";
      // that.emailRegis.captcha="";
      that.emailRegis.captchaId="";

      this.r={
        "sessionId": "",
        "sig": "",
        "token": "",
        "scene": ""
      }
      that.rid = "";
      that.emailRegis.captchaId ="",
      that.phoneAgain2 = false;

      that.toPhoneSpan = false;
      that.displayNone = false;

      document.getElementById("sc")?document.getElementById("sc").remove():null;
      let nulls = document.getElementById("sc2")?document.getElementById("sc2").remove():"";

      let scClassName = document.getElementsByClassName("sc2")[0];
      let para=document.createElement("div");
      para.setAttribute("id","sc2");
      scClassName.appendChild(para);

      this.ic2=null;
      this.ic2 = new smartCaptcha({
        renderTo: '#sc2',
        width: 320,
        height: 42,
        default_txt: that.$t('smartCaptcha.clickButtonToValidate'),
        success_txt: that.$t('smartCaptcha.ValidateSuccess'),
        fail_txt: that.$t('smartCaptcha.ValidateErrorToRefresh'),
        scaning_txt: that.$t('smartCaptcha.noopsyche'),
        success: function(data) {
          console.log(data);
          console.log(1111111);
          if(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(that.emailRegis.email)==false){
            that.errorSync=true;
            that.errorMess=that.$t('register.emailIsNotTrue');
            that.toEmail2();
          }else {
            // if(!that.emailRegis.password||!that.emailRegis.repassword){
            //   that.errorSync=true;
            //   that.errorMess="请输入密码！";
            // }else
            // if(that.emailRegis.password!=that.emailRegis.repassword){
            //   that.errorSync=true;
            //   that.errorMess="两次密码输入不相同，请重新输入！";
            // }else{
            //   that.errorSync=false;
            // }
            that.errorSync=false;
            that.r = {
                "sessionId": data.sessionId,
                "sig": data.sig,
                "token": NVC_Opt.token,
                "scene": window.NVC_Opt.scene
            }

            api.post('/RobotValidator/Validate', that.r).then((res)=>{
                that.rid = res.data.value.rid;
                let parme = {
                  "email": that.emailRegis.email,
                  "rid": that.rid,
                }
                api.post('/Captcha/Send', parme).then((res)=>{
                  console.log("发送验证码成功");
                  that.emailRegis.captchaId = res.data.value.captchaId;
                  that.disableds2 = true;
                  that.phoneAgain2 = true;
                  that.EmailtimeEndFn(that);//时间

                  console.log(res);
                }).catch((err)=> {
                  that.toEmail2();
                  console.log("error")
                })
            }).catch((err)=> {
              that.toEmail2();
              console.log("error2")
            })
          }
        },
      });
      this.ic2.init();
      var scId2 = document.getElementById("sc2");
      // scId2.style.borderRadius = "5px";
      scId2.style.background = "#f5f5f5";
      // scId2.style.overflow = "hidden";
      scId2.style.border = "1px solid #eaeaea";
      document.getElementsByClassName("sm-btn")[0].style.border="0";


    },

    phoneSubmit(){
      let that = this;
      if(/^[0-9]{3,99}$/.test(this.phoneRegis.phoneNumber)==false){
        this.errorSync=true;
        this.errorMess=this.$t("register.enterEffectPhone");
      }else if(/^[0-9]{8,20}$/.test(this.phoneRegis.password)){
        this.errorMess = this.$t('setNewPwd.InputTruePwd');
        // this.$message({showClose: true, message: this.$t('setNewPwd.InputTruePwd'), type: 'error'});
        this.errorSync = true;
        this.loading = false;
      }else if(/^[~!@#$%^&*\x220-9a-zA-Z]{8,20}$/.test(this.phoneRegis.password)==false){
        this.errorSync=true;
        this.errorMess=this.$t('updatePwd.passwordWrong');
      }else if(!this.phoneRegis.repassword.replace(/(^\s*)|(\s*$)/g, "")){
        this.errorSync=true;
        this.errorMess=this.$t("register.enterPasswordAgain");
      }else if(this.phoneRegis.password!=this.phoneRegis.repassword){
        this.errorSync=true;
        this.errorMess=this.$t("register.passwordDifferent");
      }
      // else if(!this.phoneRegis.captcha.replace(/(^\s*)|(\s*$)/g, "")){
      //   this.errorSync=true;
      //   this.errorMess="请输入正确的短信验证码！";
      // }
      else if(!this.rid){
        this.errorSync=true;
        this.errorMess=this.$t("register.toValitIntelligent");
      }else if(/^[0-9]{6}$/.test(that.phoneRegis.captcha)==false){
        this.errorSync=true;
        this.errorMess=this.$t("register.verificationCodeError");
      }else{
        if(this.checked==false){
          this.$message({showClose: true, message:this.$t("register.pleaseTrCkecbox"), type: 'error'});
          return;
        }
        this.errorSync=false;
        this.phonLoading = true;
        console.log("验证");
        let par = {
            "phoneNumber": that.phoneRegis.phoneNumber ,
            "phoneCode":that.phoneRegis.phoneCode,
            "password": that.phoneRegis.password,
            "captcha": that.phoneRegis.captcha,
            "captchaId": that.phoneRegis.captchaId,
            "promoter":this.$route.query.id?this.$route.query.id:""
            // "rid": that.rid
          }

        api.post('/User/RegisterWithPhone', par).then((res)=>{
          this.phonLoading = false;
          that.$store.dispatch("getUser",res.data.value.token);
          that.$store.dispatch("setToken",res.data.value.token);
          that.$store.dispatch("setSecVerification",true);

          that.$message({showClose: true, message: this.$t("register.registerSuccessTo"), type: 'success',});
          that.$router.push("/");
          console.log(res.data.value.token);
        },(err)=>{
          console.log(err.data.err.code);
          if(err.data.err.code==3){//验证码已失效，不需要重置人机验证
          }else{
            that.toPhone2();
          }
          this.phonLoading = false;
          that.errorSync=true;
          that.errorMess=err.data.err.message;
        }).catch((err)=> {
          that.toPhone2();
          this.phonLoading = false;
          console.log(err);
        })
      }
    },
    emailSubmit(){
      let that =this;
      if(this.rid == ""){
        this.errorSync=true;
        this.errorMess=this.$t("register.noValitIntelligent");
      }else if(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(this.emailRegis.email)==false){
        this.errorSync=true;
        this.errorMess=this.$t("register.emailIsNotTrue");
      }else if(/^[0-9]{8,20}$/.test(this.emailRegis.password)){
        this.errorMess = this.$t('setNewPwd.InputTruePwd');
        // this.$message({showClose: true, message: this.$t('setNewPwd.InputTruePwd'), type: 'error'});
        this.errorSync = true;
        this.loading = false;
      } else if(/^[~!@#$%^&*\x220-9a-zA-Z]{8,20}$/.test(this.emailRegis.password) == false){
        this.errorSync=true;
        this.errorMess=this.$t('updatePwd.passwordWrong');
      }else if(this.emailRegis.password!=this.emailRegis.repassword){
        this.errorSync=true;
        this.errorMess=this.$t("register.passwordDifferent");
      }
      // else if(!this.emailRegis.captcha){
      //   this.errorSync=true;
      //   this.errorMess=this.$t("register.passwordDifferent");"请输入正确的短信验证码！";
      // }
      else if(!this.rid){
        this.errorSync=true;
        this.errorMess=this.$t("register.toValitIntelligent");
      }else if(/^[0-9]{6}$/.test(that.emailRegis.captcha)==false){
        this.errorSync=true;
        this.errorMess=this.$t("register.enterSixEmailVeriCode");
      }else{
        if(this.checked==false){
          this.$message({showClose: true, message:this.$t("register.pleaseTrCkecbox"), type: 'error'});
          return;
        }
        this.emailLoading = true;
        this.errorSync=false;
        let par = {
          "email": that.emailRegis.email,
          "password": that.emailRegis.password,
          "captcha": that.emailRegis.captcha,
          "captchaId": that.emailRegis.captchaId,
          "promoter":this.$route.query.id?this.$route.query.id:""
          // "rid": that.rid,
        }

        api.post('/User/RegisterWithEmail', par).then((res)=>{
          this.emailLoading = false;
          that.$store.dispatch("getUser",res.data.value.token);
          that.$store.dispatch("setToken",res.data.value.token);
          that.$store.dispatch("setSecVerification",true);
          that.$message({showClose: true, message: this.$t("register.registerSuccessTo"), type: 'success',});
          // that.$message(this.$t("register.registerSuccessTo"));
          that.$router.push("/");
          console.log(res.data.value.token);
        },(err)=>{
          if(err.data.err.code==3){//验证码已失效，不需要重置人机验证
          }else{
            that.toEmail2();
          }
          that.emailLoading = false;
          that.errorSync=true;
          that.errorMess=err.data.err.message;
        }).catch((err)=> {
          that.emailLoading = false;
          that.toEmail2();
          // that.$store.dispatch('getUser');
          console.log("error")
        })
      }
    },
    reGetPhoneCode(){//重新获取手机验证码
      this.sendMessToMachion += 1;
      if(this.sendMessToMachion>2){
        this.errorSync=true;
        this.errorMess=this.$t("register.reSendTooMore");
        this.toPhone2();
      }else{
        let that = this;
        let par = {
                "captchaId": that.phoneRegis.captchaId,
                "rid": that.rid
          }

          api.post('/Captcha/Resend', par).then((res)=>{
          // that.postAjax("",par,function(res){//发送验证码
            that.PhonetimeEndFn(that);//时间
            console.log(res);
          }).catch((err)=> {
            that.toPhone2();
            console.log("error")
          })
      }

    },
    reGetEmailCode(){//重新获取邮箱验证码
     this.sendMessToMachion += 1;
      if(this.sendMessToMachion>2){
        this.errorSync=true;
        this.errorMess=this.$t("register.reSendTooMore");
        this.toEmail2();
      }else{
        let that = this;
        let par = {
                "captchaId": that.emailRegis.captchaId,
                "rid": that.rid
              }
        api.post('/Captcha/Resend', par).then((res)=>{
        // that.postAjax("/Captcha/Resend",par,function(res){//发送验证码
          that.EmailtimeEndFn(that);//时间
          console.log(res);
        }).catch((err)=> {
          that.toEmail2();
          console.log("error")
        })
      }
    },
    getCountryEmitFn(json){
      console.log(json);
      this.phoneRegis.phoneNumber = json.phoneNumber;
      this.phoneRegis.phoneCode = json.phoneCode;
      this.toPhone2();
    }

  }
}
</script>

<style scoped>
/* .nc_wrapper{
  width:320px!important;
}
#SM_BTN_1{
  width:318px;
} */
.displayNone{
  display:block!important;
}
.toPhoneSpan{
  /* border-bottom:2px solid #C9933E; */
  color:#C9933E;
}
.colorYello{
  color:#c9933e!important;
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
.AllCounty{
  position: absolute;
  left:0;
  top:44px;
  width:318px;
  background:white;
  z-index:10001;
  border:1px solid #ccc;
  border-radius:5px;
  -webkit-border-radius:5px;
  -moz-border-radius:5px;
  box-shadow:0 5px 15px rgba(0,0,0,.5);
  -moz-box-shadow:0 5px 15px rgba(0,0,0,.5);
  -webkit-box-shadow:0 5px 15px rgba(0,0,0,.5);
}

.searchEndBox{
  max-height:370px;
  width:100%;
  overflow:auto;
}
.searchBox{
  width:100%;
  height:25px;
}
.el-icon-search{
  background:white;
}
.search{
  float:right;
  display:block;
  width:188px;
  height:25px;
  text-indent: 8px;
  border:none;
  font-size:12px;
  /* background:#eaeaea; */
}
.search:focus{
  outline: none;
}
.sendCaptcha1,.sendCaptcha2{
  width:100%;
  height:44px;
  margin-top:18px;
  position:relative;
  color:gray!important;
}
.eachCounty{
  width:100%;
  height:30px;
}
.eachCounty img{
  width:30px;
  height:20px;
  margin-top:5px;
  margin-left:5px;
  float:left;
}
.eachCounty span{
  float:left;
  line-height:30px;
  margin-left:10px;
}
.eachCounty:hover{
  background:#eee;
  cursor: pointer;
}
.getMints1,.getMints2{
  position: absolute;
  right:10px;
  top:14px;
  z-index:10;
  border:none!important;
  background: #f5f5f5;
  cursor: pointer;
  color:rgba(178,178,178,1);
}
.getMints1:focus,.getMints2:focus{
  outline: none;
}
.NationalFlagBox{
  float:left;
  width:58px;
  height:44px;
  background:#f5f5f5;
  border-radius:5px;
  -webkit-border-radius:5px;
  -moz-border-radius:5px;
  border:1px solid #eaeaea;
  cursor:pointer;
}
.NationalFlag{
  width:30px;
  height:20px;
  margin:12px 0 0 8px;
}
.iconcaret{
  float:right;
  margin-top:20px;
  margin-right:5px;
}
.phoneCounty{
  float:left;
  width:250px;
  border-radius:5px;
  -webkit-border-radius:5px;
  -moz-border-radius:5px;
  border:1px solid #eaeaea;
  margin-left:8px;
  height:44px;
  background:#f5f5f5;
}
.add{
  float:left;
  padding-top:12px;
  margin-left:5px;
}
.phoneCounty input{
  border:none;
  height:20px;
  float:left;
  background:#f5f5f5;
}
.phoneCounty input:focus{
  outline:0 !important;
}
.countyCode{
  width:38px;
  border-right:1px solid #ccc!important;
  margin-top:13px;
}
.phonNumber{
  display:block;
  height:44px!important;
  line-height:44px!important;
  text-indent: 8px;
  width:194px;
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
}
.input:focus{
  outline: none;
}
input{
  font-size:14px;
}
.marginTopInput{
  margin-top:18px;
}
::-webkit-input-placeholder {
color: #bcbcbc;
}
:-moz-placeholder {
color: #bcbcbc;
}
::-moz-placeholder {
color: #bcbcbc;
}
:-ms-input-placeholder {
color: #bcbcbc;
}
.sc,.sc2{
  /* width:100%; */
  width:322px;
  padding:0;
  height:44px;
  margin-top:18px;
}
#sc,#sc2{
  /* width:100%; */
  padding:0;
  height:44px;
  margin-top:0;
  margin-left:0;

  /* border-radius:5px;
  -webkit-border-radius:5px;
  -moz-border-radius:5px; */
  background:#f5f5f5;
  /* overflow:hidden;
  border:1px solid #eaeaea; */
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
.register{
  width:100%;
  height:100%;
}
/* .bg{
  width:100%;
  height:100%;
  background:red;
} */
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
.tab{
  /* width:320px; */
  /* margin-left:40px; */
  width:100%;
  margin-top:30px;
  box-sizing: border-box;
  color:#B2B2B2;
  display: table;
}
.phoneTest{
  width:100%;
  margin-top:35px;
  display:none;
}
.emailTest{
  display:none;
  width:100%;
  margin-top:35px;
}
.changeResigerBox{
  width:320px;
  margin-left:40px;
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
.toPhone span,.toEmail span{
  height:30px;
  /* width:65px; */
  margin:0 auto;
  display:block;
  line-height:22px;
}
.PhoneNumberBox{
  width:100%;
  position: relative;
}
.noMessForSearch{
  text-align:center;
  line-height: 30px;
  color:gray;
  font-size:12px;
}
</style>
