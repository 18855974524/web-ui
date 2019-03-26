<template>
  <div class="easyWarning">
    <el-dialog :visible.sync="dialogVisible" width="400px" center top="0" :closeOnClickModal="false">
        <p class="dialogTitle">{{ $t("getCashToPassword.confirmGetCash") }}</p>

        <div class="sure-password-box">
            <div class="eachMess">
                <span class="label">{{ $t("getCashToPassword.currencyAdress") }}</span>
                <span class="mess mess2">{{adress}} </span>
            </div>
            <div class="eachMess" v-if="remarkAsync">
                <span class="label">{{ $t("getCashToPassword.remarks") }} </span>
                <span class="mess mess2">{{remark}} </span>
            </div>
            <div class="eachMess">
                <span class="label">{{ $t("getCashToPassword.currencyNumber") }}</span>
                <span class="mess" style="color:#C9933E;">{{getCashNumber}} {{units}}</span>
            </div>
            <div class="eachMess">
                <span class="label">{{ $t("getCashToPassword.formalities") }}</span>
                <span class="mess">{{withdrawlFixedfee}}</span>
                <span class="units"> {{withdrawlCurrency}}</span>
            </div>
            <div class="eachMess">
                <span class="label">{{ $t("getCashToPassword.accountsNumber") }}</span>
                <span class="mess">{{endGetNumber}}</span>
                <span class="units"> {{units}}</span>
            </div>
        </div>
        <p class="label-password">{{ $t("getCashToPassword.capitalCipher") }}</p>
        <input type="password" :placeholder="$t('getCashToPassword.enterCapitalPassword')" v-model="passwords" class="cashPass"/>
        
        <el-button type="primary" :loading="isLoading" @click="submitFn" class="sure">{{ $t("getCashToPassword.next") }}</el-button>
        <p class="label-password">{{ $t("getCashToPassword.explain") }}</p>
    </el-dialog>


        <google ref="google"></google>
        <email ref="email"></email>
        <phonevalit ref="phonevalit"></phonevalit>
        <dialog-warning ref="easyWarning"></dialog-warning>
  </div>
</template>

<script>
import api from '../../../libs/api'
import Google from '../googleVerify/index'
import Email from '../emailVerify/index'
import Phonevalit from '../phoneVerification'
import DialogWarning from '../dialogWarning/easyWarning'


//提币确认密码
  export default {
    components:{
      'google':Google,
      'email':Email,
      'phonevalit':Phonevalit,
      'dialog-warning':DialogWarning,
    },
    data() {
      return {
        dialogVisible:false,
        isLoading:false,
        remarkAsync:false,
        adress:"",//地址
        endGetNumber:"",//到账数量
        getCashNumber:"",//提币数量
        remark:"",//备注码
        units:"",//提币单位
        withdrawlCurrency:"",//手续费币种
        withdrawlFixedfee:"",//手续费
        feeTimes:"",//手续费倍数
        passwords:"",
        tid:"",
      }
    },
    watch:{
        passwords(val,oldVal){
            if(val.toString().trim()==""){//等于空的时候不处理 
            }else if(val.length>6 || /^[0-9]+$/.test(val)==false){
                this.passwords = oldVal;
            }
        }
    },
    methods:{
      init(par){
          console.log(par,444)
        this.tid = "",
        
        this.remark = "";
        console.log(par);
        this.dialogVisible = true;
        this.adress = par.adress;
        this.endGetNumber = par.endGetNumber;
        this.getCashNumber = par.getCashNumber;
        // this.remark = par.remark;
        this.units = par.units;
        this.withdrawlCurrency = par.withdrawlCurrency;
        this.withdrawlFixedfee = par.withdrawlFixedfee;
        this.feeTimes = par.feeTimes;
        if(par.remark == "**"){//不是特殊币种，没有备注码
            this.remarkAsync = false;
            this.remark="";
        }else{
            this.remarkAsync = true;
            this.remark = par.remark;
        }

        this.passwords = "";
        console.log(this.passwords)
      },
      submitFn(){
        if(/^\d{6}$/.test(this.passwords)==false){
            this.$message({showClose: true, message: this.$t('getCashToPassword.capitalCipherSixjust'),type: 'error'});
        }else{
            this.isLoading = true;
            api.post('/User/VerifyTradePassword', {"tradePassword":this.passwords}).then((res)=>{
                // console.log(res.data.value);
                this.isLoading = false;
                this.tid = res.data.value.tid;
                this.isValidate();
            }).catch((err)=> {
                this.isLoading = false;
                console.log("err");
            })
        }
      },

      isValidate(){//判断是否进行谷歌验证，手机验证，邮箱绑定
        this.dialogVisible = false;
        api.post("/User/GetUserInfo", null).then((res)=>{
            // console.log(11111);
              let par ={
                    "tid": this.tid,
                    "currency": this.units.toLowerCase(),
                    "volume": this.getCashNumber,
                    "feeTimes":this.feeTimes,
                    "address": this.adress,
                    "memo": this.remark,
                    "captcha": res.data.value.catch
                }
                
            api.post('/User/SendWithdrawlCaptcha').then((data)=>{
                if(res.data.value.userOtpStatus == 1){//绑定谷歌谷歌
                    this.$refs.google.open('/User/ApplyWithdrawl',this.sucess,par);
                }else if(res.data.value.phoneNumber){//绑定手机
                    this.$refs.phonevalit.open(res.data.value.phoneNumber,"/User/SendWithdrawlCaptcha",'/User/ApplyWithdrawl',this.sucess,par);
                }else if( res.data.value.email){//绑定邮箱
                    this.$refs.email.open(res.data.value.email,"/User/SendWithdrawlCaptcha",'/User/ApplyWithdrawl',this.sucess,par);
                }
            }).catch((err)=> {
                console.log("error")
            })

        }).catch((err)=>{
            console.log(err);
        })
      },
      sucess(){//提现请求成功
        let par = {
          dialogVisible:true,
          titleMessage:this.$t('getCashToPassword.getCashConmitSuccess'),
          warningMess:this.$t('getCashToPassword.getCashConmitSuccessEnd'),
          buttonMess:this.$t('getCashToPassword.sure'),
          iconClass: "icon-az-icon-success"
        }
        this.$emit("getCashSuccess");
        this.$refs.easyWarning.init(par);
      }

    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
.cashPass{
    width:340px;
    height:40px;
    background:rgba(245,245,245,1);
    border-radius:4px;
    border:1px solid rgba(234,234,234,1);
    text-indent: 15px;
    &:focus{
        outline: none;
    }
}
 .easyWarning{
     font-family: PingFang-SC-Medium;
     .dialogTitle{
         position: absolute;
         width:100%;
         top:10px;
         left:0;
         text-align: center;
         z-index: -1;
         font-size:16px;
         color:#333333;
     }
     .sure-password-box{
         width:320px;
         padding:15px;
         padding-left:20px;
         background:rgba(248,248,248,1);
         border-radius:6px;
     }
     .eachMess{
         margin-top:10px;
         height:25px;
         display:table;
     }
     .label{
         color:#888888;
         font-size:12px;
         width:76px;
         display:block;
         text-align: left;
         float: left;
     }
     .mess{
         color:#333333;
         margin-left:10px;
     }
     .mess2{
         width:234px;
         float:left;
         display:block;
         word-break: break-all;
     }
     .units{
         color:#B2B2B2;
     }
    .label-password{
        color:#888888;
        font-size:12px;
        margin-top:20px;
    }
    .sure{
         width:340px;
         margin-top:20px;
     }

 }
</style>
