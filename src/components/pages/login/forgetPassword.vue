<template>
  <div class="forgetpwd-box">
    <div class="getpad" v-show="OnePhone">
      <div class="headerf">{{$t('forgetPwd.RetrievePassword')}}</div>
      <el-input class="emailInput" v-model="NumInput" :placeholder="$t('forgetPwd.PhoneOrEmail')" @blur="ReSmart"></el-input>
      <div class="ScFather" @click="SmartCLick">
        <smart-capture ref="smartCapture" @success="reV" style="margin-top:18px;"></smart-capture>
      </div>
      <el-button type="primary" :disabled="isRevOk" style="width: 320px;margin-top: 18px;border-radius: 4px" @click="NextStep" :loading="loading">{{$t('message.NextStep')}}</el-button>
      <p style="font-size: 12px;color: #888888;margin-top: 20px">{{$t('forgetPwd.HaveAccountNumber')}}
        <router-link :to="{name:'login',query:$route.query}" style="font-size: 12px;color: #C9933E;cursor: pointer">{{$t('message.Login')}}</router-link>
      </p>
    </div>
    <div class="showTwoPhone" v-show="TwoPhone">
      <div class="header">
        <img src="../../../assets/img/az-icon-arrow-left.svg" alt="" class="back" @click="Toback">
        <p>{{$t('login.ChoicePhone')}}</p>
      </div>
      <div class="toomore">
        <p>{{$t('login.TooMorePhone')}}</p>
      </div>
      <div class="countryBox">
        <div v-for="(item, index) in countryInfos" :key="index" @click="TruePhone(item.phoneCode, index)"
             :class="{Active : item.isgou}">
          <div class="conuntry">
            <img :src="'../../../static/img/country/dist/az-country-'+ countryInfos[index].shortName + '.png'" alt=""
                 class="NationalFlag">
            <span
              style="display: inline-block;vertical-align: top;line-height: 32px;width: 120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-family:PingFang-SC-Regular;color:rgba(85,85,85,1);">{{item.countryName}}</span>
            <span style="display: inline-block;vertical-align: top;line-height: 32px;"><i
              class="iconfont icon-az-icon-check iconColor" v-if="item.isgou"></i></span>
          </div>
          <div class="phoneNum">+{{item.phoneCode}}&nbsp;{{NumInput}}</div>
        </div>
      </div>
      <div class="submitBox">
        <el-button class="sureBtn" type="primary" @click="sureSubmit" :loading="loading">{{$t('message.Ensure')}}</el-button>
      </div>
    </div>
    <el-dialog
      :title="$t('phonecaptcha.PhoneEmailverifyVerify')"
      width="400px"
      :visible.sync="dialogVisible"
      @close="closeDialog"
      :closeOnClickModal="false"
      class="dialog-forget"
      :modal="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
      top="0"
      style="border-radius: 6px;"
    >
      <div class="goback">
        <i class="iconfont icon-az-icon-arrow-left iconleft" @click="closeDialog"></i>
      </div>
      <div class="cont-box">
        <div class="icon-div"><i class="iconfont icon-az-icon-phone"></i></div>
        <div class="text">{{$t('phonecaptcha.VerifyThatTheMessageHasBeenSent')}} {{plusXing(NumInput)}} {{$t('phonecaptcha.PleaseFillInTheVerificationCode')}}</div>
        <el-form :model="pForm" :rules="rules" ref="ruleForm" class="rule-form">
          <el-form-item prop="captcha" class="input-div error-text-center" :class="{'has-error-text':!!codeErrorMsg}">
            <el-input v-model="pForm.captcha" class="verify-code-input" ref="phoneInput" :maxlength="6" placeholder="000000" @input="validateInputP"></el-input>
            <p class="error-text">{{codeErrorMsg}}</p>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="nextStemP" style="width:100%;" v-if="pForm.validated">
              <i class="iconfont icon-az-icon-check"></i>
              {{$t('forgetPwd.FinishVerification')}}
            </el-button>
            <el-button type="primary" @click="nextStemP" :loading="loading" style="width:100%;" v-else>{{loading ? $t('forgetPwd.InVerification'): $t('forgetPwd.FinishVerification')}}</el-button>
          </el-form-item>
        </el-form>
        <div class="text-tip">
          <el-button :disabled="disableds" type="text" class="getMints1 router-btn"
                     @click="reGetPhoneCode">{{$t("message.Regain")}}<span v-if="endTime.phoneTimeSync">({{endTime.phoneTime}}s)</span>
          </el-button>
        </div>
      </div>
    </el-dialog>


    <el-dialog
      :title="$t('emailcaptcha.EmailVer')"
      width="400px"
      :visible.sync="dialogVisibleE"
      @close="closeDialog"
      class="dialog-forget"
      :modal="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
      top="0"
      style="border-radius: 6px;"
    >
      <div class="goback">
        <i class="iconfont icon-az-icon-arrow-left iconleft" @click="closeDialog"></i>
      </div>
      <div class="cont-box">
        <div class="icon-div"><i class="iconfont icon-az-icon-phone"></i></div>
        <div class="text">{{$t("emailcaptcha.VerifyThatTheMessageHasBeenSent")}} {{emailXing(NumInput)}} {{$t("emailcaptcha.EmailPleaseGoToYourMailboxForVerification")}}</div>
        <el-form :model="pForm" :rules="rules" ref="ruleForm" class="rule-form">
          <el-form-item prop="captcha" class="input-div error-text-center" :class="{'has-error-text':!!codeErrorMsg}">
            <el-input v-model="pForm.captcha" class="verify-code-input" ref="emailInput" :maxlength="6" placeholder="000000" @input="validateInputE"></el-input>
            <p class="error-text">{{codeErrorMsg}}</p>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="nextStemE" style="width:100%;" v-if="pForm.validated">
              <i class="iconfont icon-az-icon-check"></i>
              {{$t('forgetPwd.FinishVerification')}}
            </el-button>
            <el-button type="primary" @click="nextStemE" :loading="loading" style="width:100%;" v-else>{{loading ? $t('forgetPwd.InVerification'): $t('forgetPwd.FinishVerification')}}</el-button>
          </el-form-item>
        </el-form>
        <div class="text-tip">
          <el-button :disabled="disableds" type="text" class="getMints1 router-btn"
                     @click="reGetEamilCode">{{$t("message.Regain")}}<span v-if="endTime.phoneTimeSync">({{endTime.phoneTime}}s)</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>




</template>

<script>
  import api from '../../../libs/api'
  import smartCapture from '../../common/smartCapture'

  export default {
    data(){
      return {
        forgetPwdDialog:true,
        NumInput:"",
        canLogin:false,
        dialogVisibleE:false,
        rid:"",
        ridNum:"",
        countryInfos:[],
        OnePhone:true,
        TwoPhone:false,
        forgetPwdPhone:{
          phoneCode:"",
          phoneNumber:"",
          rid:""
        },
        dialogVisible:false,
        disableds: false,
        PhoneCode:"",
        endTime:{
          phoneTimeSync: false,
          phoneTime: 60,
        },
        loading:false,
        pForm:{
          captcha: "",
          validated:false,
        },
        codeErrorMsg:'',
        rules:{
          captcha:[
            { required: true, message: this.$t('forgetPwd.NotKong'), trigger: 'blur' },
          ],
        },
        isRevOk:false,
      }
    },
    components: {
      'smart-capture':smartCapture
    },
    mounted() {
    },
    methods:{
      SmartCLick(){
        if(!this.canLogin){
          this.isRevOk = true;
        }
      },
      ReSmart(){
        this.$refs.smartCapture.init();
        this.canLogin = false;
      },
      reV(data){
        if (/^[0-9]{3,50}$/.test(this.NumInput) == false && !this.isEmail(this.NumInput)) {
              this.$message({showClose: true, message: this.$t('forgetPwd.InputTrueNum'), type: 'error'});
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
              this.rid = res.data.value.rid;
              this.isRevOk = false;
            }).catch((err) => {
            this.message({showClose: true, message: this.$t('smartCaptcha.ValidateFaild'), type: 'error'});
            this.ReSmart();
            this.isRevOk = false;
          })
        }
      },
      Toback(){
        this.OnePhone = true;
        this.TwoPhone = false;
      },
      NextStep(){

        this.loading = true;
        // console.log(this);
        if(!(this.isEmail(this.NumInput) || this.isPhone(this.NumInput))){
          this.$message.error(this.$t("forgetPwd.InputTrueNum"));
          this.loading = false;
        } else if(!this.canLogin){
          this.$message.error(this.$t("forgetPwd.PleaseClickNextAfterTheSmartVerification"));
          this.loading = false;
        }else {
          if(this.isPhone(this.NumInput)) {
            let checkPhone = {
              phoneNumber:this.NumInput,
              rid: this.rid
            }
            api.post("/User/CheckPhone", checkPhone)
              .then((res) => {
                // console.log(res);
                this.loading = false;
                if(res.data.value.countryInfos.length > 1){
                  for(let i = 0;i < res.data.value.countryInfos.length;i++){
                    res.data.value.countryInfos[i].isgou = false;
                  }
                  this.countryInfos = res.data.value.countryInfos;
                  this.countryInfos[0].isgou = true;
                  this.forgetPwdPhone.phoneCode = this.countryInfos[0].phoneCode;
                  this.OnePhone = false;
                  this.TwoPhone = true;
                }else if(res.data.value.countryInfos.length == 1){
                  let forgetPwd = {
                    phoneCode:  res.data.value.countryInfos[0].phoneCode,
                    phoneNumber: this.NumInput,
                    rid: this.rid
                  };
                  this.forgetPwdPhone.phoneCode = res.data.value.countryInfos[0].phoneCode;
                  api.post('/User/SendFogotPasswordCaptcha',forgetPwd)
                    .then((res)=>{
                      if(this.ridNum == ""){
                        this.ridNum = 1;
                      }else {
                        this.ridNum+=1;
                      }
                      if(this.ridNum > 3){
                        this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
                        this.ReSmart();
                        return
                      }
                      this.OnePhone = false;
                      this.dialogVisible = true;
                      this.countDown();
                      this.$nextTick(()=>{
                        this.$refs.ruleForm.resetFields();
                        this.$refs.phoneInput.focus();
                      })
                    })
                    .catch((err)=>{
                      if(err.data.err.code == "-30"){
                        this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
                        this.ReSmart();
                      }
                      console.log(err);
                    })
                }else {
                  this.loading = false;
                  this.$message.error(this.$t("forgetPwd.AccountDoesNotExistPleaseRe"));
                }
              }).catch((err)=> {
              this.loading = false;
              if(err.data.err.code == "-30"){
                this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
                this.ReSmart();
              }
            })
          }else if(this.isEmail(this.NumInput)){
            let forgetPwd = {
              email: this.NumInput + "",
              rid: this.rid
            }
            api.post('/User/SendFogotPasswordCaptcha', forgetPwd)
              .then((res)=>{
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
                this.OnePhone = false;
                this.dialogVisibleE = true;

                this.countDown();
                this.$nextTick(()=>{
                  this.$refs.ruleForm.resetFields();
                  this.$refs.emailInput.focus();
                })
              })
              .catch((err)=>{
                this.loading = false;
                console.log(err);
                if(err.data.err.code == "-30"){
                  this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
                  this.ReSmart();
                }
              })


          }
        }
      },
      isPhone(phone){
        let myreg = /^\d{3,99}$/;
        if (!myreg.test(phone)) {
          return false;
        } else {
          return true;
        }
      },
      isEmail(email){
        let myreg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,99}/; //正则表达式
        if (!myreg.test(email)) {
          return false;
        } else {
          return true;
        }
      },
      TruePhone(Num, index){
        for(let i = 0;i < this.countryInfos.length;i++){
          this.$set(this.countryInfos[i], 'isgou', false)
        }
        this.$set(this.countryInfos[index], 'isgou', true);
        this.forgetPwdPhone.phoneCode = Num + "";
      },
      sureSubmit(){
        this.loading = true;
        this.forgetPwdPhone.phoneNumber = this.NumInput + "";
        this.forgetPwdPhone.rid = this.rid;
        api.post('/User/SendFogotPasswordCaptcha', this.forgetPwdPhone)
          .then((res)=> {
            this.loading = false;
            if(this.ridNum == ""){
              this.ridNum = 1;
            }else {
              this.ridNum+=1;
            }
            if(this.ridNum > 3){
              this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
              this.ReSmart();
              return
            }
            this.TwoPhone = false;
            this.dialogVisible = true;
            this.countDown();
            this.$nextTick(()=>{
              this.$refs.ruleForm.resetFields();
              this.$refs.phoneInput.focus();
            })
          }).catch((err)=> {
          console.log(err);
          this.loading = false;
          if(err.data.err.code == "-30"){
            this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
            this.ReSmart();
          }
        })
      },

      // 手机验证
      reGetPhoneCode(){
        api.post("/User/SendFogotPasswordCaptcha",{
          phoneCode:  this.forgetPwdPhone.phoneCode,
          phoneNumber: this.NumInput,
          rid: this.rid
        })
          .then(()=>{
            this.ridNum+=1;
            if(this.ridNum > 3){
              this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
              this.ReSmart();
              this.dialogVisible = false;
              return
            }
            this.countDown();
          });
      },
      // 邮箱
      reGetEamilCode(){
        api.post("/User/SendFogotPasswordCaptcha",{
          email: this.NumInput,
          rid: this.rid
        })
          .then(()=>{
            this.ridNum+=1;
            if(this.ridNum > 3){
              this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
              this.ReSmart();
              this.dialogVisibleE = false;
              return
            }
            this.countDown();
          });
      },
      countDown(){
        this.endTime.phoneTimeSync = true;
        this.disableds = true;
        this.endTime.PhonecolorYello = false;
        this.endTime.phoneTime = 60;
        let Timeset = setInterval(() => {
          if(this.endTime.phoneTime>0){
            this.endTime.phoneTime = parseInt(this.endTime.phoneTime)-1;
          }else{
            this.endTime.phoneTimeSync = false;
            this.disableds = false;
            clearInterval(Timeset);
            this.endTime.PhonecolorYello = true;
          }
        },1000)
      },
      validateInputP(){
        this.codeErrorMsg = '';
        if(this.pForm.captcha.length>5){
          this.nextStemP();
        }
      },
      validateInputE(){
        this.codeErrorMsg = '';
        if(this.pForm.captcha.length>5){
          this.nextStemE();
        }
      },
      nextStemP(){
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            api.post('/User/CheckSendFogotPasswordCaptcha', {phoneCode:this.forgetPwdPhone.phoneCode,phoneNumber:this.NumInput,captcha: this.pForm.captcha})
              .then((res)=>{
                this.loading = false;
                this.pForm.validated = true;
                setTimeout(()=>{
                  this.dialogVisible = false;
                  this.$router.push({name:"setNewPwd", query:{phoneCode:this.forgetPwdPhone.phoneCode, phoneNumber:this.NumInput,checkResultId: res.data.value.checkResultId}});
                },600)
              })
              .catch((error)=>{
                this.loading = false;
                if(error.data&&error.data.err.message){
                  this.codeErrorMsg(error.data.err.message);
                }
                // if(err.data.err.code == "-30"){
                //   this.dialogVisible = false;
                //   this.OnePhone = true;
                //   this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
                //   this.reV();
                // }
              });
          }
        });
      },
      nextStemE(){
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            api.post('/User/CheckSendFogotPasswordCaptcha', {email: this.NumInput, captcha: this.pForm.captcha})
              .then((res)=>{
                this.loading = false;
                this.pForm.validated = true;
                setTimeout(()=>{
                  this.dialogVisibleE = false;
                  this.$router.push({name:"setNewPwd", query:{email:this.NumInput, checkResultId: res.data.value.checkResultId}});
                },600)
              })
              .catch((error)=>{
                this.loading = false;
                if(error.data&&error.data.err.message){
                  this.codeErrorMsg(error.data.err.message);
                }
                // if(err.data.err.code == "-30"){
                //   this.dialogVisibleE = false;
                //   this.OnePhone = true;
                //   this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
                //   this.reV();
                // }
              });
          }
        });
      },
      closeDialog(){
        this.dialogVisible = false;
        this.dialogVisibleE = false;
        // this.reV();
        this.OnePhone = true;
        this.$refs.ruleForm.resetFields();

      },
      plusXing (str){
        var length = str.length;
        var frontLen = '';
        var endLen ='';
        if(length >= 11){
          frontLen = 3;
          endLen = 4;
        }else if (length > 8 && length < 11){
          frontLen = 3;
          endLen = 3;
        }else if(length > 5 && length < 9){
          frontLen = 2;
          endLen = 2;
        }else {
          frontLen = 1;
          endLen = 2;
        }
        let xing =  '****';
        return str.substr(0,frontLen)+xing+str.substr(str.length-endLen);
      },
      emailXing(str){
        let str1 = str.substring(0, str.indexOf("@"));
        let str2 = str.substring(str.indexOf("@"));
        var head;
        if(str1.length>= 5){
          head = str1.substring(0, 2) + "****" + str2;
        }else {
          head = '****' + str2;
        }
        return head;
      },
    },
  }
</script>
<style>
  /*.dialog-forget .el-button:hover,.dialog-forget .el-button:focus, .dialog-forget .el-button:hover, .dialog-forget .el-button:focus{*/
    /*border: 0 !important;*/
  /*}*/
  /*.dialog-forget .el-button{*/
    /*border: 0 !important;*/
  /*}*/
  /*.dialog-forget .el-button span:hover, .dialog-forget .el-button span:focus, .dialog-forget .el-button span:hover, .dialog-forget .el-button span:focus{*/
    /*border-bottom: 1px solid #E1AA55;*/
  /*}*/
</style>
<style scoped  lang="scss" type="text/scss">
  button.getMints1.el-button{
    height: 21px !important;
  }
  .ScFather{
    width:320px;
    margin: auto;
    text-align: left;
  }
  .ShowPhoneDialog{
    position: absolute;
    left: 50%;top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .forgetpwd-box{
    width: 400px;
    background: #FFFFFF;
    border-radius: 6px;
    margin: 0 auto;
    .getpad{
      width: 400px;
      height: 350px;
      margin: 140px 0 0 0;
      text-align: center;
      .headerf{
        height: 56px;
        line-height: 56px;
        font-size: 16px;
        color: #333333;
      }
      .emailInput{
        width: 320px;
        height: 44px;
        margin-top: 33px;
      }
    }
  }
  .showTwoPhone{
    background: #ffffff;
    height: 455px;
    width: 400px;
    position:absolute;
    left:50%;
    top:50%;
    margin-left:-220px;
    margin-top:-238px;

    border-radius: 6px;
  }
  .header{
    width: 100%;
    height: 56px;
    text-align: center;
    position: relative;
  }
  .header .back{
    width: 8px;
    height: 16px;
    position: absolute;
    top: 50%;
    left: 20px;
    margin-top: -8px;
  }
  .header p{
    line-height: 56px;
    font-size: 16px;
    color: #333333;
    font-family: PingFang-SC-Medium;
  }
  .toomore{
    margin: 20px 0;
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #555555;
  }
  .countryBox{
    width: 320px;
    height: 200px;
    margin: 0 auto;
    border: 1px solid #EAEAEA;
  }
  .countryBox>div{
    width: 100%;
    height: 32px;
    border-bottom: 1px solid #EAEAEA;
  }
  .countryBox .conuntry{
    display: inline-block;
  }
  .countryBox .phoneNum{
    display: inline-block;
    float: right;
    line-height: 32px;
    margin-right: 10px;
  }
  .sureBtn{
    width: 320px;
    height: 44px;
    display: block;
    margin: 0 auto;
    border-radius: 4px;
    color: #ffffff;
    background: #c9933e;
  }

  .Active{
    background: #F8F8F8;
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
  .goback{
    position: absolute;
    top: 13px;
    left: 13px;
  }
</style>
