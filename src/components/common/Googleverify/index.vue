<template>
  <div>
    <el-dialog
    :title="$t('GoogleVerify.inputGoogleTitle')"
    width="400px"
    :visible.sync="googleDialogVisible"
    @close="closeDialog"
    :closeOnClickModal="false"
    top="0"
    style="border-radius: 6px;"
    center>
    <div class="cont-box">
      <div class="icon-div">
        <!--<i class="iconfont icon-gugeyanzhengqiweibangding" style="color: initial"></i>-->
        <svg class="icon" aria-hidden="true" style="width: 80px;height: 80px">
          <use xlink:href="#icon-gugeyanzhengqiweibangding"></use>
        </svg>
      </div>
      <p class="text">
        {{$t('GoogleVerify.inputGoogleTip')}}
      </p>
      <el-form :model="gForm" :rules="rules" ref="ruleForm" class="rule-form" @submit.native.prevent>
        <el-form-item prop="googleCode" class="input-div error-text-center" :class="{'has-error-text':!!codeErrorMsg}">
          <el-input class="verify-code-input" ref="input" :maxlength="6" v-model="gForm.googleCode"
                    placeholder="000000" maxlength="6" @keyup.native="validateKey" @input="validateInput"></el-input>
          <p class="error-text">{{codeErrorMsg}}</p>
        </el-form-item>
        <el-form-item>
          <el-button type="success" style="width:100%;" v-if="gForm.validated">
            <i class="iconfont icon-az-icon-check"></i>
            {{$t('GoogleVerify.verified')}}
          </el-button>
          <el-button type="primary" @click="submit" :loading="loading" style="width:100%;" v-else>{{loading?$t('GoogleVerify.verifing'):$t('GoogleVerify.completed')}}</el-button>
        </el-form-item>
      </el-form>
      <div class="text-tip">
        <p><span>{{$t('GoogleVerify.forgetTip')}}</span><a :href="`https://azexio.zendesk.com/hc/${$store.state.user.language == 'cn'?'zh-cn':'en-us'}/requests/new`" target="_blank" class="contactService">{{$t('GoogleVerify.contactService')}}</a></p>
      </div>
    </div>
    </el-dialog>
  </div>
</template>

<script>
  // 谷歌二次认证，输入验证码弹框组件
  // 通过调用 open 来打开弹框，传入 验证验证码是否正确的api接口以及回调函数
  // 当验证完毕时会传给回调函数 api 接口返回的 response ,便于回调函数处理
  // 使用示例 template <google-verify ref="googleVerify"></google-verify>
  // 调用函数 this.$ref.googleVerify.open(api,callbackFunc);
  import api from '../../../libs/api'

  export default {
    data() {
      return {
        googleDialogVisible:false,
        loading:false,
        gForm:{
          googleCode: "",
          validated:false,
        },
        codeErrorMsg:'',
        rules:{
          googleCode:[
            { required: true, message: this.$t('GoogleVerify.codeRequired'), trigger: 'blur' },
            // { type:'number', message: this.$t('GoogleVerify.codeLengthError'), trigger: 'blur' }
          ],
        },
        callBackUrl:'',
        cb:()=>{},
        params:{}
      }
    },
    methods: {
      open(callBackUrl,cb,params={}){
        this.cb = cb;
        this.callBackUrl = callBackUrl;
        this.gForm.googleCode = '';
        this.gForm.validated = false;
        this.codeErrorMsg = '';
        this.params=params?params:{};
        this.googleDialogVisible = true;
        this.$nextTick(()=>{
          this.$refs.ruleForm.resetFields();
          this.$refs.input.focus();
        })
      },
      validateInput(){
        this.codeErrorMsg = '';
        if(this.gForm.googleCode.length>5){
          this.submit();
        }
      },
      validateKey(k){
        if(!/^[0-9]$/.test(k.key)){
          this.gForm.googleCode = this.gForm.googleCode.replace(k.key,'');
        }
      },
      submit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            api.post(this.callBackUrl,Object.assign(this.params,{captcha:this.gForm.googleCode}))
              .then((res)=>{
                this.gForm.validated = true;
                this.loading = false;
                setTimeout(()=>{
                  this.googleDialogVisible = false;
                  this.cb(res);
                },600)
              })
              .catch((error) => {
                this.loading = false;
                if(error.data&&error.data.err.message){
                  this.codeErrorMsg = error.data.err.message;
                }
              });
          }
        });
      },
      closeDialog(){
        this.cb({close:true});
      }
    }
  }
</script>
