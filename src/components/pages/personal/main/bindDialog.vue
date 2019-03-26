<template>
<div>
  <el-dialog
    :title="$t(`bindDialog.${type}BindTitle`)"
    :visible.sync="dialogVisible"
    :closeOnClickModal="false"
    @close="handleClose"
    width="400px"
    center
    top="-218px"
    custom-class="no-translate"
  >
    <div class="cont-box panel-form-norequired">
      <el-form :model="bindData" :rules="rules" ref="ruleForm" class="rule-form" label-position="top" @submit.native.prevent>
        <el-form-item :label="$t(`bindDialog.${type}Num`)" prop="number" class="b-item has-error-text" :error="numberErrorMsg">
          <el-input v-model="bindData.number" type="text" :placeholder="$t('bindDialog.emailPlaceholder')"  @change="checkInitSC"
                    v-if="type=='email'"></el-input>
          <country-input @country="countryChange" v-if="type=='phone' && dialogVisible"></country-input>
          <!--<p class="error-text">{{phoneErrorMsg}}</p>-->
        </el-form-item>
        <el-form-item label="" prop="" class="b-item smart-capture">
           <smart-capture ref="smartCapture" @success="captureSuc"></smart-capture>
        </el-form-item>
        <el-form-item :label="$t(`bindDialog.${type}CodeLabel`)" prop="code" class="b-item">
          <el-input v-model="bindData.code" :maxlength="6" :placeholder="$t(`bindDialog.${type}CodePlaceholder`)"></el-input>
          <el-button type="text" v-if="validateNumberSuc" :disabled="endTime.phoneTimeSync" class="getMints1 router-btn"
                     @click="sendCode">{{$t("bindDialog.reget")}}<span v-if="endTime.phoneTimeSync">({{endTime.phoneTime}}s)</span>
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" :loading="loading" style="width:100%;">{{$t("bindDialog.ensure")}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
  <!--<div class="smart-capture" v-if="dialogVisible"> <smart-capture ref="smartCapture" @success="captureSuc"></smart-capture></div>-->
</div>
</template>


<script>
  // 绑定邮箱和手机的组件


  import api from '../../../../libs/api'
  import smartCapture from '../../../common/smartCapture'
  import countryInput from '../../../common/country'

  export default {
    data() {
      let checkNumber = (rule, value, callback) => {
        if (this[`${this.type}Reg`].test(value)) {
          callback();
        } else {
          callback(new Error(this.$t(`bindDialog.${this.type}ValidateErr`)));
        }
      };
      return {
        type: 'phone',
        phoneReg: /^\d{3,99}$/,
        emailReg: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
        dialogVisible: false,
        loading: false,
        smartCaptureSuc: false,
        bindData: {
          number: '',
          phoneCode: 86,
          code: '',
          rid: ''
        },
        winHeight:window.innerHeight,
        validateNumberSuc: false,
        regetCodeNum: 0,
        endTime: {
          phoneTime: 60,
          phoneTimeSync: false,
          timeInterval:undefined
        },
        rules: {
          number: [
            // {required: true, message: this.$t(`bindDialog.${this.type}Placeholder`), trigger: 'blur'},
            {validator: checkNumber, trigger: 'blur'}
          ],
          code: [
            {required: true, message: this.$t('bindDialog.codeRequired'), trigger: 'blur'}
          ],
        },
        numberErrorMsg:'',
      }
    },
    components: {
      smartCapture,
      countryInput
    },
    methods: {
      open(type) {
        this.type = type;
        this.bindData = {
          number: '',
          phoneCode: 86,
          code: '',
          rid: ''
        };
        this.regetCodeNum = 3;
        this.validateNumberSuc = false;
        this.dialogVisible = true;
      },
      captureSuc(data) {
        this.smartCaptureSuc = true;
        this.regetCodeNum = 3;
        if(this.validate()) {
          let r = {
            "sessionId": data.sessionId,
            "sig": data.sig,
            "token": window.NVC_Opt.token,
            "scene": window.NVC_Opt.scene
          }
          api.post('/RobotValidator/Validate', r).then((res) => {//发送人机验证
            this.bindData.rid = res.data.value.rid;
            this.sendCode();
          },()=>{
            this.checkInitSC();
          });
        } else {
          this.checkInitSC();
        }
      },
      validate() {
        // 验证失败需要显示响应的错误信息
        if(!this.bindData.number){
          this.numberErrorMsg = this.$t(`bindDialog.${this.type}Placeholder`);
          return false;
        }
        if (!this[`${this.type}Reg`].test(this.bindData.number)) {
          this.numberErrorMsg = this.$t(`bindDialog.${this.type}ValidateErr`);
          return false;
        }
        return true;
      },
      countDown() {
        this.endTime.phoneTimeSync = true;
        this.endTime.phoneTime = 60;
        this.endTime.timeInterval = setInterval(() => {
          if (this.endTime.phoneTime > 0) {
            this.endTime.phoneTime = parseInt(this.endTime.phoneTime) - 1;
          } else {
            this.endTime.phoneTimeSync = false;
            clearInterval(this.endTime.timeInterval);
          }
        }, 1000)
      },
      sendCode() {
        if(this.regetCodeNum === 0){
          this.initSmartCaptcha();
          this.$message({message:this.$t('bindDialog.scNotValid'),type:'error',showClose:true});
          return;
        }
        if (this.type === 'phone') {
          api.post('/User/BindingPhone', {
            phoneNumber: this.bindData.number,
            phoneCode: this.bindData.phoneCode,
            rid: this.bindData.rid
          })
            .then((res) => {
              this.validateNumberSuc = true;
              this.countDown();
              this.regetCodeNum--;
            })
            .catch((err) => {
              if(err.data&&err.data.err.code === 2){
                this.validateNumberSuc = true;
              }else{
                this.validateNumberSuc = false;
              }
              if(err.data&&err.data.err.code === -30){
                this.initSmartCaptcha();
              }
            });
        } else if (this.type === 'email') {
          api.post('/User/BindingEmail', {
            email: this.bindData.number,
            rid: this.bindData.rid
          })
            .then((res) => {
              this.validateNumberSuc = true;
              this.countDown();
              this.regetCodeNum--;
            })
            .catch((err) => {
              if(err.data&&err.data.err.code === 2){
                this.validateNumberSuc = true;
              }else{
                this.validateNumberSuc = false;
              }
              if(err.data&&err.data.err.code === -30){
                this.initSmartCaptcha();
              }
            });
        }
      },
      submit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (!this.bindData.rid) {
              this.$message({ message:this.$t('bindDialog.notScTip'),showClose:true, type:'warning'});
              return;
            }
            this.loading = true;
            if (this.type === 'phone') {
              api.post('/User/BindPhone', {
                phoneNumber: this.bindData.number,
                phoneCode: this.bindData.phoneCode,
                captcha: this.bindData.code
              }).then((res) => {
                this.$message({ message:this.$t(`bindDialog.${this.type}BindSuc`),showClose:true, type:'success'});
                this.$store.dispatch('getUser');
                this.dialogVisible = false;
                this.loading = false;
              })
                .catch(() => {
                  this.loading = false;
                });
            } else if (this.type === 'email') {
              api.post('/User/BindEmail', {
                email: this.bindData.number,
                captcha: this.bindData.code
              }).then((res) => {
                this.$message({ message:this.$t(`bindDialog.${this.type}BindSuc`),showClose:true, type:'success'});
                this.$store.dispatch('getUser');
                this.dialogVisible = false;
                this.loading = false;
              })
                .catch(() => {
                  this.loading = false;
                });
            }
          }
        });
      },
      countryChange(data) {
        if(data.phoneNumbe !== this.bindData.number){
          this.initSmartCaptcha();
        }
        this.bindData.number = data.phoneNumber;
        this.bindData.phoneCode = data.phoneCode;
        this.checkInitSC();
      },
      checkInitSC() {
        this.endTime = {
          phoneTime: 60,
          phoneTimeSync: false
        };
        this.validateNumberSuc = false;
        if (this.smartCaptureSuc) {
          this.initSmartCaptcha();
        }
      },
      initSmartCaptcha(){
        if(this.bindData.rid){
          this.bindData.rid = '';
        }
        this.$refs.smartCapture&&this.$refs.smartCapture.init();
      },
      handleClose(){
        this.$refs.ruleForm.resetFields();
        clearInterval(this.endTime.timeInterval);
        this.initSmartCaptcha();
      }
    },
    watch:{
      type(val) {
        this.rules.number[0].message = this.$t(`bindDialog.${val}Placeholder`);
      }
    },
    created() {
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .app{
    .cont-box {
      width: 320px;
      height: 324px;
      margin: 0px auto;
      .submit-btn {
        width: 100%;
        margin: 10px 0;
      }
      ::-webkit-input-placeholder { /*WebKit browsers*/
        color: $font-color5;
        font-size: 14px;
      }
      ::-moz-placeholder { /*Mozilla Firefox*/
        color: $font-color5;
        font-size: 14px;
      }
      :-moz-placeholder { /*Mozilla Firefox*/
        color: $font-color5;
        font-size: 14px;
      }
      :-ms-input-placeholder { /*Internet Explorer*/
        color: $font-color5;
        font-size: 14px;
      }
      .b-item {
        .getMints1 {
          position: absolute;
          right: 10px;
          top: 12px;
          z-index: 10;
          font-size: 12px;
          padding:0;
          height:21px;
          button.disabled {
            color: #B2B2B2;
          }
        }
        &.is-error .countryBox{
          border:1px solid $--color-danger;
        }
        > p {
          font-size: $extra-small-fs;
          color: $font-color4;
        }
      }
    }
  }

</style>
<style>
  .cont-box .el-form--label-top .el-form-item__label {
    padding: 0;
    line-height: 20px;
    color: #999;
  }
</style>
