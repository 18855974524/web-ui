<template>
  <div>
    <el-dialog
      :title="$t('emailcaptcha.EmailVer')"
      width="400px"
      :closeOnClickModal="false"
      :visible.sync="emailDialogVisible"
      @close="handleClose"
      top="0"
      center>
      <div class="Emailtoast cont-box">
        <div class="icon-div">
          <i class="iconfont icon-az-icon-mail-" style="font-size: 125px;"></i>
        </div>
        <p class="text">
          {{$t('emailcaptcha.VerifyThatTheMessageHasBeenSent')}} {{email}} {{$t('emailcaptcha.EmailPleaseGoToYourMailboxForVerification')}}
        </p>
        <el-form :model="eForm" :rules="rules" ref="ruleForm" class="rule-form" @submit.native.prevent>
          <el-form-item prop="captcha" class="input-div error-text-center" :class="{'has-error-text':!!codeErrorMsg}">
            <el-input class="verify-code-input" ref="input" v-model="eForm.captcha" :maxlength="6" placeholder="000000" @keyup.native="validateKey" @input="validateInput"></el-input>
            <p class="error-text">{{codeErrorMsg}}</p>
          </el-form-item>
          <el-form-item>
            <el-button type="success" style="width:100%;" v-if="eForm.validated">
              <i class="iconfont icon-az-icon-check"></i>
              {{$t('emailcaptcha.verified')}}
            </el-button>
            <el-button type="primary" @click="submit" :loading="loading" style="width:100%;" v-else>{{loading?$t('emailcaptcha.verifing'):$t('emailcaptcha.completed')}}</el-button>
          </el-form-item>
        </el-form>
        <div class="text-tip">
          <el-button type="text" :disabled="disableds" class="getMints1 router-btn"
                  @click="reGetPhoneCode">{{$t('emailcaptcha.reget')}}<span v-if="endTime.phoneTimeSync">({{endTime.phoneTime}}s)</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // 邮箱发送验证码弹框组件
  // 通过调用 open 来打开弹框，传入 邮箱号码，发送验证码的api,验证验证码是否正确的api,以及回调函数
  // 当验证完毕时会传给回调函数 api 接口返回的 response ,便于回调函数处理
  // 使用示例 template <email-verify ref="emailVerify"></email-verify>
  // 调用函数 this.$ref.emailVerify.open(email,sendCodeApi,validateCodeApi,callbackFunc);
  import api from '../../../libs/api'
  export default {
    data() {
      return {
        emailDialogVisible: false,
        disableds:false,
        endTime:{
          phoneTimeSync: true,
          phoneTime: 60,
          timeset:undefined
        },
        email:'',
        loading:false,
        eForm:{
          captcha: "",
          validated:false,
        },
        codeErrorMsg:'',
        rules:{
          captcha:[
            { required: true, message: this.$t('emailcaptcha.codeRequired'), trigger: 'blur' },
            // { type:'number', message: this.$t('emailcaptcha.codeLengthError'), trigger: 'blur' }
          ],
        },
        callBackUrl:'', // 验证验证码正确
        sendCodeUrl:'', // 重新发送验证码 url
        cb:()=>{}, // 验证之后的回调函数
        params:{}
      }
    },
    methods: {
      open(email,sendCodeUrl,callBackUrl,cb,params={}){
        this.eForm.captcha = '';
        this.eForm.validated = false;
        this.codeErrorMsg = '';
        this.email = email;
        this.sendCodeUrl = sendCodeUrl;
        this.callBackUrl = callBackUrl;
        this.cb = cb;
        this.params = params?params:{};
        this.countDown();
        this.emailDialogVisible = true;
        this.$nextTick(()=>{
          this.$refs.input.focus();
          this.$refs.ruleForm.resetFields();
        })
      },
      reGetPhoneCode(){
        api.post(this.sendCodeUrl,{})
          .then(()=>{
            this.countDown();
          });
      },
      countDown(){
        this.endTime.phoneTimeSync = true;
        this.disableds = true;
        this.endTime.phoneTime = 60;
        this.endTime.timeset = setInterval(() => {
          if(this.endTime.phoneTime>0){
            this.endTime.phoneTime = parseInt(this.endTime.phoneTime)-1;
          }else{
            this.endTime.phoneTimeSync = false;
            this.disableds = false;
            clearInterval(this.endTime.timeset);
          }
        },1000)
      },
      handleClose() {
        clearInterval(this.endTime.timeset); //关闭时清空倒计时
      },
      validateInput(){
        this.codeErrorMsg = '';
        if(this.eForm.captcha.length>5){
          this.submit();
        }
      },
      validateKey(k){
        if(!/^[0-9]$/.test(k.key)){
          this.eForm.captcha = this.eForm.captcha.replace(k.key,'');
        }
      },
      submit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            api.post(this.callBackUrl,Object.assign(this.params,{captcha:this.eForm.captcha}))
              .then((res)=>{
                this.loading = false;
                this.eForm.validated = true;
                setTimeout(()=>{
                  this.emailDialogVisible = false;
                  this.cb(res);
                },600)
              })
              .catch((error)=>{
                this.loading = false;
                if(error.data&&error.data.err.message){
                  this.codeErrorMsg = error.data.err.message;
                }
              });
          }
        });
      },
    }
  }
</script>
<style>
  button.getMints1.el-button{
    height: 21px !important;
  }
</style>
