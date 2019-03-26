<template>
  <div class="box">
    <top-bar :title="$t('emailNotice.emailNotice')"></top-bar>
    <div class="setting-item">
      <div style="width: 100%;">
        <p class="item-title"><i class="iconfont icon-az-icon-login- icon-color"></i> {{$t('emailNotice.NumNotice')}}</p>
      </div>
      <div class="SecLine">
        <div class="item-info">
          <p style="font-size: 14px;color: #555555;">{{$t('emailNotice.generalNotice')}}</p>
        </div>
        <div class="right_btn" v-show="isOk">
          <span>{{loginEmailNotice? $t('emailNotice.opened'): $t('emailNotice.NoOpen')}}</span>
          <el-switch v-model="loginEmailNotice" @change="FirChange">
        </el-switch>
      </div>
      </div>

    </div>
    <div class="setting-item">
      <div>
        <p class="item-title"><i class="iconfont icon-az-icon-transaction- icon-color"></i> {{$t('emailNotice.primoNotice')}}</p>
      </div>
      <div class="SecLine">
        <div class="item-info">
          <p style="font-size: 14px;color: #555555;">{{$t('emailNotice.ToRemind')}}</p>
        </div>
        <div class="right_btn" v-show="isOk">
          <span>{{topUpNotice? $t('emailNotice.opened'): $t('emailNotice.NoOpen')}}</span>
          <el-switch v-model="topUpNotice" @change="SecChange">
          </el-switch>
        </div>
      </div>
      <div class="ThiLine">
        <div class="item-info">
          <p style="font-size: 14px;color: #555555;">{{$t('emailNotice.tiCurrNotice')}}</p>
        </div>
        <div class="right_btn" v-show="isOk">
          <span>{{withrawalNotice? $t('emailNotice.opened') : $t('emailNotice.NoOpen')}}</span>
          <el-switch v-model="withrawalNotice" @change="ThiChange">
          </el-switch>
        </div>
      </div>
    </div>
    <el-dialog
      :title="$t('emailNotice.openEmail')"
      :visible.sync="dialogVisible"
      :closeOnClickModal="false"
      center
      top="0"
      width="400px">
      <div style="width: 100%;text-align:center;margin-top: 10px"><i class="iconfont icon-az-icon-warning"
                                                                     style="font-size: 40px;color: #C9933E"></i></div>
      <div style="margin-top: 30px;text-align: center">{{$t('emailNotice.notEmail')}}？</div>
      <span slot="footer" class="dialog-footer" style="width: 270px">
          <el-button @click="dialogVisible = false" style="width:120px;">{{$t('message.Cancel')}}</el-button>
          <el-button type="primary" @click="BatchCancellation" style="width:120px;margin-left: 20px">{{$t('message.Ensure')}}</el-button>
        </span>
    </el-dialog>
  </div>

</template>

<script>
  import api from '../../../../../libs/api'
  import topBar from '../topBar'
    export default {
      components:{
        topBar
      },
      data(){
        return{
          loginEmailNotice: "",
          topUpNotice: "",
          withrawalNotice: "",
          dialogVisible:false,
          isOk:false,
        }
      },
      created(){
        // console.log(localStorage.getItem('loginEmailNotice'));
        // console.log(localStorage.getItem('topUpNotice'));
        // console.log(localStorage.getItem('withrawalNotice'));
        // this.loginEmailNotice = localStorage.getItem("loginEmailNotice");
        // this.topUpNotice = localStorage.getItem("topUpNotice");
        // this.withrawalNotice = localStorage.getItem("withrawalNotice");
        api.post("/User/GetNoticeConfig",null)
          .then((res)=>{
            this.loginEmailNotice = res.data.value.loginEmailNotice;
            this.topUpNotice = res.data.value.topUpNotice;
            this.withrawalNotice = res.data.value.withrawalNotice;
            this.isOk = true;
          }).catch((err)=>{
          // this.$message.error(err);
          console.log(err);
        })
      },
      mounted(){
        api.post("/User/GetNoticeConfig",null)
          .then((res)=>{
              this.loginEmailNotice = res.data.value.loginEmailNotice;
              this.topUpNotice = res.data.value.topUpNotice;
              this.withrawalNotice = res.data.value.withrawalNotice;
          })
          .catch((err)=>{
            // this.$message.error(err);
            console.log(err);
          })
      },
      // destroyed(){
      //   // localStorage.setItem('loginEmailNotice',this.loginEmailNotice);
      //   // localStorage.setItem('topUpNotice',this.topUpNotice);
      //   // localStorage.setItem('withrawalNotice',this.withrawalNotice);
      //   console.log('销毁了');
      // },
      methods:{
        FirChange(){
          if(!this.$store.state.user.info.email){
            this.dialogVisible = true;
            this.loginEmailNotice = !this.loginEmailNotice;
            return
          }
          api.post("/User/UpdateNoticeSwitch", {
            noticeConfigSwitchType: 0,
            enable:this.loginEmailNotice
          })
            .then((res)=>{
              // this.$message.success();
              this.$message({ message:this.$t("emailNotice.ReviseSucc"),showClose:true, type:'success'});
            })
            .catch((err)=>{

            })
        },
        SecChange(){
          // console.log(111);
          if(!this.$store.state.user.info.email){
            this.dialogVisible = true;
            this.topUpNotice = !this.topUpNotice;
            return
          }
          api.post("/User/UpdateNoticeSwitch", {
            noticeConfigSwitchType: 1,
            enable:this.topUpNotice
          })
            .then((res)=>{
              this.$message({ message:this.$t("emailNotice.ReviseSucc"),showClose:true, type:'success'});
            })
            .catch((err)=>{

            })
        },
        ThiChange(){
          // console.log(111);
          if(!this.$store.state.user.info.email){
            this.dialogVisible = true;
            this.withrawalNotice = !this.withrawalNotice;
            return
          }
          api.post("/User/UpdateNoticeSwitch", {
            noticeConfigSwitchType: 2,
            enable:this.withrawalNotice
          })
            .then((res)=>{
              this.$message({ message:this.$t("emailNotice.ReviseSucc"),showClose:true, type:'success'});
            })
            .catch((err)=>{
              this.$message.error(err);
            })
        },
        BatchCancellation(){
          // this.$message({showClose:true, message: this.$t("login.smartFaild"), type:'error'});
          this.$router.push('/personal');
        }
      },
    }
</script>
<style>
  .box .el-dialog {
    width: 400px;
    margin-top: 0 !important;
  }
</style>
<style scoped  lang="scss" type="text/scss">
  .setting-item {
    width:1200px;
    background: #FFFFFF;
    border-radius: 6px;
    margin: 20px auto;
    padding: 20px;
    /*display: flex;*/
    .item-title {
      font-size: 16px;
      color: #555555;
      margin-bottom: 30px;
      .iconfont {
        font-size: 20px;
        margin-right: 6px;
      }
      .item-info{
        display: flex;
        align-items: center;
        p{
          font-size: 14px;
          color: #555555;

        }
      }
      /*.right_btn{*/
        /*text-align: right;*/
        /*flex:1;*/
        /*line-height:82px;*/
        /*span{*/
          /*display:inline-block;*/
          /*font-size: 14px;*/
          /*color: #B2B2B2;*/
          /*margin-right:6px;*/
        /*}*/
      /*}*/
    }
    .SecLine{
      width: 100%;
      div{
        display: inline-block;
      }
      .right_btn{
        float: right;
        span{
          font-size: 14px;
          color: #B2B2B2;
          margin-right: 6px;
        }
      }
    }
    .ThiLine{
      margin-top: 25px;
      div{
        display: inline-block;
      }
      .right_btn{
        float: right;
        span{
          font-size: 14px;
          color: #B2B2B2;
          margin-right: 6px;
        }
      }
    }
  }
  .icon-color{
    color: rgb(201,147,62);
  }
  /*.right_btn{*/
    /*text-align: right;*/
    /*flex:1;*/
    /*line-height:82px;*/
    /*span{*/
      /*display:inline-block;*/
      /*font-size: 14px;*/
      /*color: #B2B2B2;*/
      /*margin-right:6px;*/
    /*}*/
  /*}*/

</style>
