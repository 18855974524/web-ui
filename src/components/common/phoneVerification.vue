<template>
  <el-dialog
    :title="$t('phonecaptcha.PhoneEmailverifyVerify')"
    width="400px"
    :visible.sync="dialogVisible"
    @close="closeDialog"
    :closeOnClickModal="false"
    center
    top="0"
    style="border-radius: 6px;"
  >
    <div class="cont-box">
      <div class="icon-div"><i class="iconfont icon-az-icon-phone"></i></div>
      <div class="text">{{$t('phonecaptcha.VerifyThatTheMessageHasBeenSent')}} {{phoneNumber}} {{$t('phonecaptcha.PleaseFillInTheVerificationCode')}}</div>
      <el-form :model="pForm" :rules="rules" ref="ruleForm" class="rule-form" @submit.native.prevent>
        <el-form-item prop="captcha" class="input-div error-text-center" :class="{'has-error-text':!!codeErrorMsg}">
          <el-input v-model="pForm.captcha" ref="input" class="verify-code-input" :maxlength="6" placeholder="000000" @keyup.native="validateKey" @input="validateInput"></el-input>
          <p class="error-text">{{codeErrorMsg}}</p>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="cb(data)" style="width:100%;" v-if="pForm.validated">
            <i class="iconfont icon-az-icon-check"></i>
            {{$t('phonecaptcha.verified')}}
          </el-button>
          <el-button type="primary" @click="submit" :loading="loading" style="width:100%;" v-else>{{loading?$t('phonecaptcha.verifing'):$t('phonecaptcha.completed')}}</el-button>
        </el-form-item>
      </el-form>
      <div class="text-tip">
        <el-button :disabled="disableds" type="text" class="getMints1 router-btn"
                @click="reGetPhoneCode" style="height: 21px">{{$t('phonecaptcha.reget')}}<span v-if="endTime.phoneTimeSync">({{endTime.phoneTime}}s)</span>
        </el-button>
      </div>
    </div>
  </el-dialog>

</template>
<script>
  // 手机发送验证码弹框组件
  // 通过调用 open 来打开弹框，传入 手机号码，发送验证码的api,验证验证码是否正确的api,以及回调函数
  // 当验证完毕时会传给回调函数 api 接口返回的 response ,便于回调函数处理
  // 使用示例 template <phone-verify ref="phoneVerify"></phone-verify>
  // 调用函数 this.$ref.phoneVerify.open(phone,sendCodeApi,validateCodeApi,callbackFunc);
  import api from '../../libs/api'
    export default {
      data() {
          return{
            dialogVisible:false,
            captcha:'',
            disableds: false,
            phoneNumber:'',
            endTime:{
              phoneTimeSync: false,
              phoneTime: 60,
              timeset:undefined
            },
            loading:false,
            pForm:{
              captcha: "",
              validated:false,
            },
            codeErrorMsg:'',
            rules:{
              captcha:[
                { required: true, message: this.$t('phonecaptcha.codeRequired'), trigger: 'blur' },
                // { type:'number', message: this.$t('phonecaptcha.codeLengthError'), trigger: 'blur' }
              ],
            },
            callBackUrl:'', // 验证验证码正确
            sendCodeUrl:'', // 重新发送验证码 url
            cb:()=>{}, // 验证之后的回调函数
            params:{},
            num:'',
          }
      },
      methods:{
        open(phoneNumber,sendCodeUrl,callBackUrl,cb,params={},num){
          // 初始化页面信息
          this.pForm.captcha = '';
          this.pForm.validated = false;
          this.phoneNumber = phoneNumber;
          this.sendCodeUrl = sendCodeUrl;
          this.callBackUrl = callBackUrl;
          this.cb = cb;
          this.codeErrorMsg = '';
          this.params = params?params:{};
          this.num = num;
          this.countDown();
          this.dialogVisible = true;
          this.$nextTick(()=>{
            this.$refs.ruleForm.resetFields();
            this.$refs.input.focus();
          })
        },
        reGetPhoneCode(){
          api.post(this.sendCodeUrl,{})
            .then(()=>{
              this.num+=1;
              if(this.num > 3){
                this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
                this.dialogVisible = false;
                this.closeDialog();
                return;
              }
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
        validateInput(){
          this.codeErrorMsg = '';
          if(this.pForm.captcha.length>5){
            this.submit();
          }
        },
        validateKey(k){
          if(!/^[0-9]$/.test(k.key)){
            this.pForm.captcha = this.pForm.captcha.replace(k.key,'');
          }
        },
        submit(){
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              this.loading = true;
              api.post(this.callBackUrl,Object.assign(this.params,{captcha:this.pForm.captcha}))
                .then((res)=>{
                  this.loading = false;
                  this.pForm.validated = true;
                  setTimeout(()=>{
                    //为了出现完成绑定的效果给用户展现
                    this.dialogVisible = false;
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
        closeDialog(){
          clearInterval(this.endTime.timeset);
          this.$emit('listenToChild', this.num);
        },
      },
      created(){
      }
    }
</script>
<style>
  button.getMints1.el-button{
    height: 21px !important;
  }
  button.getMints1.el-button.router-btn.is-disabled:hover{
    background: #fff !important;
    opacity: 1;
    border-color: #fff !important;
  }
</style>

