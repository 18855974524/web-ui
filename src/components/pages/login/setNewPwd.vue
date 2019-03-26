<template>
  <div class="box">
    <div class="con">
      <div class="header">
        <i class="iconfont icon-az-icon-arrow-left iconleft" @click="$router.push('/login/fogetPassword')"></i>
        {{$t("setNewPwd.SetNewPwd")}}
      </div>
      <el-input v-model="FirPwd" type="password" :placeholder="$t('setNewPwd.InputLoginPwd')" style="width: 79.6%;margin:35px auto 0;"></el-input>
      <el-input v-model="SecPwd" type="password" :placeholder="$t('setNewPwd.InputRePwd')" style="width: 79.6%;margin:25px auto 0;"></el-input>

      <div class="btn" style="text-align: center;margin-top: 30px">
        <el-button type="primary" style="width: 79.6%;border-radius: 4px" @click="makeSure" :loading="loading">{{$t("message.Ensure")}}</el-button>
      </div>

    </div>
  </div>
</template>

<script>
  import api from '../../../libs/api'
  import dan from '../../../store/daniel'
    export default {
        name: "setNewPwd",
      data(){
          return{
            FirPwd:"",
            SecPwd:"",
            checkResultId:"",
            loading:false,
            phoneCode:"",
            phoneNum:"",
            email:"",
          }
      },
      methods:{
        makeSure(){
          this.loading = true;
          if (!this.FirPwd){
            this.$message({showClose: true, message: this.$t('setNewPwd.PwdNoNull'), type: 'error'});
            this.loading = false;
          } else if(/^[0-9]{8,20}$/.test(this.FirPwd)){
            // this.errorMess = this.$t('forgetPwd.InputTruePwd');
            this.$message({showClose: true, message: this.$t('setNewPwd.InputTruePwd'), type: 'error'});
            // this.errorSync = true;
            this.loading = false;
          }else if(/^[~!@#$%^&*\x220-9a-zA-Z]{8,20}$/.test(this.FirPwd)==false){
            this.$message({showClose: true, message: this.$t('updatePwd.passwordWrong'), type: 'error'});
            this.loading = false;
          } else if(this.FirPwd != this.SecPwd){
            this.$message({showClose: true, message: this.$t('setNewPwd.DiffrentPwd'), type: 'error'});
            this.loading = false;
          }else {
            if (this.phoneNum){
              api.post("/User/ForgotPassword", {
                phoneNumber:this.phoneNum,
                phoneCode:this.phoneCode,
                password: this.SecPwd,
                checkResultId: this.checkResultId
              })
                .then((res)=>{
                  this.$message({showClose: true, message: this.$t('setNewPwd.AmendPwdSucc'), type: 'success'});
                  this.loading = false;
                  setTimeout(() => {
                    this.$router.push({name:'login'});
                  },1500)
                })
                .catch((err)=>{
                  this.loading = false;
                  console.log(err);
                })
            } else {
              api.post("/User/ForgotPassword", {
                email:this.email,
                password: this.SecPwd,
                checkResultId: this.checkResultId
              })
                .then((res)=>{
                  this.$message({showClose: true, message: this.$t('setNewPwd.AmendPwdSucc'), type: 'success'});
                  this.loading = false;
                  setTimeout(() => {
                    this.$router.push({name:'login'});
                  },1500)
                })
                .catch((err)=>{
                  this.loading = false;
                  console.log(err);
                })
            }

          }
        },
      },
      mounted(){
          this.checkResultId = this.$route.query.checkResultId;
          console.log(this.$route.query);
          this.email = this.$route.query.email;
          this.phoneCode = this.$route.query.phoneCode;
          this.phoneNum = this.$route.query.phoneNumber;
      }

    }
</script>

<style scoped lang="scss" type="text/scss">
  .box{
    width: 100%;
    height: 100%;
  .con{
    width: 400px;
    height: 328px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    background: #fff;
    border-radius: 6px;
    text-align: center;
  }
  .header{
    height: 56px;
    line-height: 56px;
    font-size: 16px;
    color: #333333;
    text-align: center;
    position: relative;
    .iconleft{
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  }
</style>
