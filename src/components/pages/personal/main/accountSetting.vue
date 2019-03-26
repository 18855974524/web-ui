<template>
  <div>
    <div class="account-setting" v-if="userInfo">
      <div class="setting-item account-item">
        <div>
          <p class="item-title"><i class="iconfont icon-az-icon-password active-color"></i>{{$t("accountSetting.accountInfo")}}</p>
          <div class="item-info">
            <div class="avatar-username">
              <div class="avatar">
                <my-upload
                  host="/User/UploadHeadImage"
                  format="image"
                  name="image"
                  :maxSize="2*1024*1024"
                  @success="handleHeadFileSuccess"
                >
                  <div slot="style" style="width:100%;height:100%;">
                    <v-avatar v-if="userInfo.headImageId"
                              :url="`${baseURL}/image/${this.userInfo.headImageId}`"></v-avatar>
                    <div class="no-head-img" v-else>
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-az-icon-changeface"></use>
                      </svg>
                      <span class="icon-circle">
                      <i class="iconfont icon-az-icon-camera"></i>
                    </span>
                    </div>
                  </div>
                </my-upload>
              </div>
              <!--<div v-if="nickNameEditing">-->
                <!--<el-input type="text" ref="updateNickNameInput" v-model="userNickName" @keyup.enter.native="updateNickName(userNickName)"-->
                          <!--@blur="updateNickNameBlur"></el-input>-->
                <!--&lt;!&ndash;@click="updateNickName(userNickName)"&ndash;&gt;-->
                <!--<el-button type="primary" class="ok-update-nick-btn"-->
                           <!--:loading="updatingNickName" >{{$t("accountSetting.ensure")}}-->
                <!--</el-button>-->
              <!--</div>-->
              <div>
                {{userInfo.nickName||userInfo.userId}}
                <el-button type="text" @click="nickNameEdit"><i class="iconfont icon-az-icon-edit-"></i></el-button>
              </div>
            </div>
            <div class="email">
              <p class="pingFangSC-regular">{{$t("accountSetting.email")}}</p>
              <p v-if="userInfo.email">{{userInfo.email}}</p>
              <p v-else>
                <a class="router-btn" @click="bindAccount('email')">{{$t("accountSetting.bindImmediately")}}</a>
              </p>
            </div>
            <div class="split-line">
            </div>
            <div class="phone">
              <p class="pingFangSC-regular">{{$t("accountSetting.phone")}}</p>
              <p v-if="userInfo.phoneNumber">{{userInfo.phoneNumber}}</p>
              <p v-else>
                <a class="router-btn" @click="bindAccount('phone')">{{$t("accountSetting.bindImmediately")}}</a>
              </p>
            </div>
            <div class="split-line">
            </div>
            <div class="pwd">
              <p class="pingFangSC-regular">{{$t("accountSetting.pwd")}}</p>
              <p>
                <router-link class="router-btn" :to="{name:'resetPwd'}">{{$t("accountSetting.updatePwd")}}</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <!--手续费设置-->
      <div class="setting-item">
        <div>
          <p class="item-title"><i class="iconfont icon-az-icon-Fees-"
                                   :class="{'active-color':userInfo.isAzcFeeOpened}"></i>{{$t("accountSetting.poundageSetting")}}</p>
          <div class="item-info">
            <p>{{$t("accountSetting.poundageTip")}}</p>
          </div>
        </div>
        <div class="right-btn">
          <span>{{$t("accountSetting.comingSoon")}}</span>
          <!--<span>{{userInfo.isAzcFeeOpened?$t("accountSetting.switchOpen"):$t("accountSetting.switchNotOpen")}}</span>-->
          <!--<el-switch v-model="userInfo.isAzcFeeOpened" @change="changeAzcFeeOpened">-->
          <!--</el-switch>-->
        </div>
      </div>
      <!--谷歌验证-->
      <div class="setting-item" v-if="userInfo.userOtpStatus>0">
        <div>
          <p class="item-title"><i class="iconfont icon-az-icon-safe"
                                   :class="{'active-color':userEnableOnSecondVerifyOtp}"></i>{{$t("accountSetting.googleVerify")}}</p>
          <div class="item-info">
            <p>
              {{$t("accountSetting.googleVerifyBinded")}}
              <a :href="`https://support.azex.io/hc/${$store.state.user.language == 'cn'?'zh-cn':'en-us'}/articles/360005418194-%E8%B0%B7%E6%AD%8C%E9%AA%8C%E8%AF%81%E5%99%A8%E4%B8%A2%E5%A4%B1%E6%80%8E%E4%B9%88%E5%8A%9E-`"
                 target="_blank" class="forget-link">{{$t("accountSetting.googleVerifyForgotPwd")}} <i class="iconfont icon-az-icon-question"></i></a>
              <span type="text" class="router-btn" @click="removeOptBind()">{{$t("accountSetting.googleVerifyRemoveBinded")}}</span>
            </p>
          </div>
        </div>
        <div class="right-btn">
          <span>{{userEnableOnSecondVerifyOtp?$t("accountSetting.switchOpen"):$t("accountSetting.switchNotOpen")}}</span>
          <el-switch v-model="userEnableOnSecondVerifyOtp" @change="changeGoogleVerify" inactive-color="#E5E5E5">
          </el-switch>
        </div>
      </div>
      <div class="setting-item" v-else>
        <div>
          <p class="item-title"><i class="iconfont icon-az-icon-safe"></i>{{$t("accountSetting.googleVerify")}}</p>
          <div class="item-info">
            <p>{{$t("accountSetting.googleVerifyNotBindTip")}}</p>
          </div>
        </div>
        <div class="right-btn">
          <el-button type="primary" size="medium" @click="startGoogleVerify" plain>{{$t("accountSetting.bindImmediately")}}</el-button>
        </div>
      </div>
      <!--实名认证-->
      <div class="setting-item">
        <div>
          <p class="item-title"><i class="iconfont icon-az-icon-Certified-"
                                   :class="{'active-color':userInfo.certStatus==2}"></i>{{$t("accountSetting.certificateRealName")}}</p>
          <div class="item-info">
            <p v-if="userInfo.certStatus==0">{{$t("accountSetting.certificateStatus0")}}</p>
            <p v-if="userInfo.certStatus==1">{{$t("accountSetting.certificateStatus1")}}</p>
            <p v-if="userInfo.certStatus==2">{{$t("accountSetting.certificateStatus2")}}</p>
            <p v-if="userInfo.certStatus==3">
              <span class="error-tip">{{$t("accountSetting.certificateStatus3")}}</span>
              <a class="router-btn" @click="openCertificateErrorReason">{{$t("accountSetting.lookReason")}}</a>
            </p>
          </div>
        </div>
        <div class="right-btn">
          <el-button type="primary" size="medium" plain v-if="userInfo.certStatus==0||userInfo.certStatus==3"
                     @click="$router.push({name:'authentication'})">{{$t("accountSetting.certificateImmediately")}}
          </el-button>
          <el-button type="primary" size="medium" plain disabled v-if="userInfo.certStatus==1">{{$t("accountSetting.certificateLooking")}}...</el-button>
          <span v-if="userInfo.certStatus==2">{{userInfo.idNo}}</span>
        </div>
      </div>
      <!--资金密码-->
      <div class="setting-item">
        <div>
          <p class="item-title"><i class="iconfont icon-az-icon-password"
                                   :class="{'active-color':userInfo.isTradePasswordSetted}"></i>{{$t("accountSetting.tradePwd")}}</p>
          <div class="item-info">
            <p v-if="userInfo.isTradePasswordSetted">{{$t("accountSetting.tradePwdSettedTip")}} <span type="text" class="router-btn" :disabled="forgetPwdBusy"
                                                                   @click="forgetTradePwd">{{$t("accountSetting.tradePwdForgotTip")}}</span></p>
            <p v-else>{{$t("accountSetting.tradePwdNotSetTip")}}</p>
          </div>
        </div>
        <div class="right-btn">
          <el-button type="primary" size="medium" plain v-if="userInfo.isTradePasswordSetted"
                     @click="$router.push({name:'updateTradePwd'})">{{$t("accountSetting.updateTradePwd")}}
          </el-button>
          <el-button type="primary" size="medium" plain v-else @click="$router.push({name:'setTradePwd'})">{{$t("accountSetting.setImmediately")}}</el-button>
        </div>
      </div>
      <!--API管理-->
      <router-link tag="div" :to="{name:'apiManagement'}" class="setting-item">
        <div>
          <p class="item-title"><i class="iconfont icon-az-icon-API active-color"></i>{{$t("accountSetting.APIManage")}}</p>
          <div class="item-info">
            <p>{{$t("accountSetting.APINotSetTip")}}</p>
          </div>
        </div>
        <div class="right-btn">
          <i class="iconfont icon-az-icon-arrow-right active-color"></i>
        </div>
      </router-link>
      <!--邮件通知设置-->
      <router-link tag="div" :to="{name:'emailNotification'}" class="setting-item">
        <div>
          <p class="item-title"><i class="iconfont icon-az-icon-message- active-color"></i>{{$t("accountSetting.emailNoticeSet")}}</p>
          <div class="item-info">
            <p>{{$t("accountSetting.emailNoticeSetTip")}}</p>
          </div>
        </div>
        <div class="right-btn">
          <i class="iconfont icon-az-icon-arrow-right active-color"></i>
        </div>
      </router-link>
      <!--登录记录-->
      <router-link tag="div" :to="{name:'loginLog'}" class="setting-item">
        <div>
          <p class="item-title"><i class="iconfont icon-az-icon-record active-color"></i>{{$t("accountSetting.loginLog")}}</p>
          <div class="item-info">
            <p>{{$t("accountSetting.loginLogTip")}}</p>
          </div>
        </div>
        <div class="right-btn">
          <span>{{$t("accountSetting.lastLoginLog")}} {{userInfo.lastLoginTime|dateTime}}</span>
          <i class="iconfont icon-az-icon-arrow-right active-color"></i>
        </div>
      </router-link>
    </div>
    <bind-dialog @success="bindSuc" ref="bindDialog"></bind-dialog>
    <open-goole-verify ref="openGooleVerify" @submit="enableGoogleVerify"></open-goole-verify>
    <phone-verify ref="phoneVerify"></phone-verify>
    <email-verify ref="emailVerify"></email-verify>
    <google-verify ref="googleVerify"></google-verify>
    <cert-err-dialog ref="certErrDialog"></cert-err-dialog>
    <edit-user-name ref="editNickName"></edit-user-name>
  </div>
</template>

<script>
  import openGooleVerify from '../../../common/googleVerify/openGooleVerify'
  import emailVerify from '../../../common/emailVerify/index'
  import myUpload from '../../../common/myUpload'
  import api from '../../../../libs/api'
  import util from '../../../../libs/util'
  import bindDialog from './bindDialog'
  import vAvatar from '../../../common/avatar'
  import phoneVerify from '../../../common/phoneVerification'
  import googleVerify from '../../../common/googleVerify/index'
  import certErrDialog from './certificateErrorDialog'
  import editUserName from './editUserName'

  export default {
    data() {
      return {
        // nickNameEditing: false,
        // userNickName: '',
        baseURL: util.ajax.defaults.baseURL,
        GooshowDialog: false,
        StartgooshowDialog: false,
        Goocode: '',
        // updatingNickName: false,
        userEnableOnSecondVerifyOtp: false,
        forgetPwdBusy:false
      }
    },
    components: {
      myUpload,
      bindDialog,
      vAvatar,
      emailVerify,
      phoneVerify,
      googleVerify,
      openGooleVerify,
      certErrDialog,
      editUserName
    },
    computed: {
      userInfo() {
        this.userEnableOnSecondVerifyOtp = (this.$store.state.user.info&&(this.$store.state.user.info.userOtpStatus === 1))||false;
        return this.$store.state.user.info;
      },
    },
    async mounted() {
      if(!this.userInfo){
        await this.$store.dispatch('getUser');
      }
      if(this.$route.query.needConfirmGooVerifyBox&&this.userInfo.userOtpStatus === 2){
        this.confirmEnableGoogleVerify();
      }
    },
    methods: {
      nickNameEdit() {
        let userNickName = this.userInfo.nickName || this.userInfo.userId+'';
        this.$refs.editNickName.open(userNickName)
      },
      confirmEnableGoogleVerify() {
        this.$refs.openGooleVerify.open();
      },
      removeOptBind() {
        this.$refs.googleVerify.open('/User/UnBindOtp', this.removedBind);
      },
      removedBind(res) {
        this.updateUserInfo();
      },
      changeGoogleVerify() {
        if (this.userEnableOnSecondVerifyOtp) {
          this.enableGoogleVerify();
        } else {
          this.$refs.googleVerify.open('/User/DisableOtp', this.updateUserInfo);
        }
      },
      updateUserInfo() {
        this.$store.dispatch('getUser');
      },
      bindAccount(type) {
        console.log(type);
        this.$refs.bindDialog.open(type);
      },
      handleHeadFileSuccess() {
        this.updateUserInfo();
      },
      bindSuc() {
        this.updateUserInfo();
      },
      changeAzcFeeOpened() {
        api.post('/User/UpdateAzcFeeSwitch', {
          isEnabled: this.userInfo.isAzcFeeOpened
        }).then(() => {
          this.$message({ message:this.userInfo.isAzcFeeOpened?this.$t("accountSetting.poundageOpenSuc"):this.$t("accountSetting.poundageCloseSuc"),showClose:true, type:'success'});
        })
          .catch(() => {
            this.updateUserInfo();
          });
      },
      forgetTradePwd() {
        if(this.forgetPwdBusy){
          return;
        }
        if (this.userInfo.userOtpStatus === 1) {
          //绑定并且谷歌验证，进行谷歌验证
          this.$refs.googleVerify.open('/User/CheckSendFogotTradePasswordCaptcha', this.validateSucForgetTradePwd);
          return;
        }
        this.forgetPwdBusy = true;
        //发送验证码，根据 captchaType 确定弹框
        api.post('/User/SendFogotTradePasswordCaptcha')
          .then(() => {
            this.forgetPwdBusy = false;
            if (this.userInfo.phoneNumber) {
              //绑定手机，进行手机验证
              this.$refs.phoneVerify.open(this.userInfo.phoneNumber, '/User/SendFogotTradePasswordCaptcha',
                '/User/CheckSendFogotTradePasswordCaptcha', this.validateSucForgetTradePwd);
              return;
            }
            if (this.userInfo.email) {
              //绑定邮箱，进行邮箱验证
              this.$refs.emailVerify.open(this.userInfo.email, '/User/SendFogotTradePasswordCaptcha',
                '/User/CheckSendFogotTradePasswordCaptcha', this.validateSucForgetTradePwd);
              return;
            }
          })
          .catch(()=>{
            this.forgetPwdBusy = false;
          });
      },
      validateSucForgetTradePwd(res) {
        if(res.data){
          //验证通过之后，进入重新设置密码页面
          this.$router.push({name: 'resetTradePwd', params: {cr: res.data.value.checkResultId}});
        }
      },
      startGoogleVerify() {
        api.post('/User/GettingOtpSecretKey')
        .then(() => {
        if (this.userInfo.phoneNumber) {
          //绑定手机，进行手机验证
          this.$refs.phoneVerify.open(this.userInfo.phoneNumber, '/User/GettingOtpSecretKey',
            '/User/GetOtpSecretKey', this.enterGoogleVerify);
          return;
        }
        if (this.userInfo.email) {
          //绑定邮箱，进行邮箱验证
          this.$refs.emailVerify.open(this.userInfo.email, '/User/GettingOtpSecretKey',
            '/User/GetOtpSecretKey', this.enterGoogleVerify);
          return;
        }
        })

      },
      enterGoogleVerify(res) {
        console.log(res);
        this.$router.push({
          name: 'startGoogleVerify',
          query: {
            dataObj: res.data.value
          }
        });
      },
      enableGoogleVerify() {
        api.post('/User/EnableOtp')
          .then(() => {
            this.updateUserInfo();
          });
      },
      openCertificateErrorReason(){
        this.$refs.certErrDialog.open(this.userInfo.certAuditRemark);
      }
    },
    created() {

    },
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .account-setting {
    padding: 10px 0 50px;
    .setting-item {
      background: #FFFFFF;
      border-radius: 6px;
      margin: 20px 0;
      padding: 20px;
      display: flex;
      .iconfont.active-color {
        color: $--color-primary;
      }
      .item-title {
        color: $font-color2;
        font-size: $large-fs;
        margin-bottom: 30px;
        .iconfont {
          font-size: 20px;
          margin-right: 10px;
          color: #d5d5d5;
          &.active-color {
            color: #D9B377;
          }
        }
      }
      .item-info {
        display: flex;
        align-items: center;
        p {
          font-size: $medium-fs;
          color: $font-color3;
          font-family: 'PingFang-SC-Regular';
          .error-tip {
            color: $--color-danger;
            font-size: 14px;
            line-height: 20px;
            margin-right: 16px;
          }
          .forget-link{
            display: inline-block;
            margin:0 16px;
            i{
              color:#b2b2b2;
              font-size:14px;
            }
          }
        }
      }
      .right-btn {
        text-align: right;
        flex: 1;
        line-height: 82px;
        span {
          display: inline-block;
          color: $font-color5;
          font-size: $medium-fs;
          font-family: PingFang-SC-Regular;
          margin-right: 6px;
        }
        button {
          width: 140px;
        }
        i.iconfont {
          font-size: 14px;
        }
      }
      &.account-item {
        .item-info {
          height: 80px;
          .my-upload {
            border-radius: 50%;
            overflow: visible;
            margin: 0 16px;
          }
          .avatar-username {
            display: flex;
            align-items: center;
            margin-right: 26px;
            .avatar {
              .no-head-img {
                position: relative;
                height: 80px;
                svg {
                  width: 80px;
                  height: 80px;
                }
                .icon-circle {
                  position: absolute;
                  bottom: 2px;
                  right: 0;
                  width: 24px;
                  height: 24px;
                  line-height: 20px;
                  background-color: #333;
                  border-radius: 50%;
                  i {
                    font-size: 12px;
                    color: #fff;
                  }
                }
              }
            }
            .el-input {
              width: 180px;
            }
            .ok-update-nick-btn {
              border-radius: 4px;
              width: 64px;
              height: 32px;
              line-height: 32px;
              padding: 0;
              font-size: 12px;
              margin-left: 6px;
            }
          }
          .email,
          .phone,
          .pwd {
            width: 250px;
            text-align: center;
            p:last-child {
              margin-top: 20px;
            }
          }
        }
        .split-line {
          height: 30px;
          border-right: 1px solid $border-color-2;
        }
      }
    }

  }

  // .Startgoopic{
  //     width: 40px;
  //     height: 40px;
  //     margin: 0 auto;
  //     margin-top: 5px;
  //     }
  //     .Startverifyprompt{
  //     width:320px;
  //     margin:0 auto;
  //     font-family: PingFang-SC-Medium;
  //     font-size: 14px;
  //     line-height: 20px;
  //     color: #555555;
  //     text-align: center;
  //     margin-top: 30px;
  //     margin-bottom:30px;
  //     }
  //     .dialog-footer{
  //       display: block;
  //       width: 300px;
  //       margin:0 auto;
  //     }
  //     .dialog-footer button{
  //       width: 140px;
  //       height:40px;
  //     }
  //     .neverPrompt{
  //       width: 100px;
  //       margin:0 auto;
  //     }
  .GooPic {
    width: 75px;
    height: 80px;
    margin: 0 auto;
    margin-top: 30px;
  }

  .verifyprompt {
    font-family: PingFang-SC-Medium;
    font-size: 14px;
    line-height: 20px;
    color: #555555;
    text-align: center;
    margin-top: 30px;
  }

  .verifycode {
    width: 180px;
    height: 44px;
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 30px;
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

  .foottext {
    font-family: PingFang-SC-Medium;
    font-size: 12px;
    line-height: 17px;
    color: #B2B2B2;
    text-align: center;
    margin-top: 20px;
  }

  .foottext .contactService {
    color: #C9933E;
    margin-left: 5px;
  }

  .error {
    color: red;
    position: absolute;
    left: 60px;
    top: 48px;
  }

  .error span {
    font-size: 13px;
  }

  .verifycode .el-input {
    font-size: 24px;
  }

  .verifycode .el-input__inner {
    width: 180px;
    height: 44px;
    background: #F5F5F5;
    border: 1px solid #EAEAEA;
    border-radius: 4px;
    padding-left: 48px;
  }

</style>
<style>
  .avatar .my-upload .el-upload-dragger {
    width: 80px;
    height: 80px;
    border: none;
  }

  .avatar-username .el-input__inner {
    background-color: #f2f2f2;
    border: none;
    border-radius: 4px;
    height: 32px;
  }
</style>
