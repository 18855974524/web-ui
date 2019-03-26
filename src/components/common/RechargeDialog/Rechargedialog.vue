<template>
  <el-dialog
    :title="Title + $t('recharge.Recharge')"
    width="400px"
    :closeOnClickModal="false"
    :visible.sync="dialogVisible"
    append-to-body
    center
    top="0"
    style="border-radius: 6px;"
    class="dan-dialog"
    @close="closeVue"
  >
    <div class="box">
      <div class="con">
        <div class="tou">
          {{Title}}&nbsp;{{$t("recharge.RechargeLocalQr")}}
        </div>
        <div class="qr-code">
          <canvas id="erweima"></canvas>
          <!--<div id="icon-bg" :class="ACurrency" v-if="Address != ($t('recharge.AddressRequested') || $t('recharge.AddressFail') || '' || !dialogVisible)">-->
            <!--<i :class="`icon-${ACurrency}`" style="font-size: 32px;color: #fff;"></i>-->
          <!--</div>-->
          <img id="icon-bg" v-if="Address != ($t('recharge.AddressRequested') || $t('recharge.AddressFail') || '' || !dialogVisible)" :src="`/image/currency/web_${ACurrency}.png`|hostImgPath" alt="">
        </div>
        <div class="footer-copy">
          <div class="recharge-input">
            <p>{{Title}} {{$t("recharge.RechargeLocal")}}</p>
            <!--<el-input v-model="Address" class="copy-input" type="text" disabled><el-button slot="append" style="width: 40px"><i class="iconfont icon-azl-icon-copy iconColor"></i></el-button></el-input>-->
            <el-input v-model="Address" readonly="readonly" class="input-with-select" disabled><el-button slot="append"
                                                                                                          v-clipboard:copy="Address"
                                                                                                          v-clipboard:success="copyKey"
                                                                                                          v-clipboard:error="onError">
              <i class="icon-azl-icon-copy iconColor iconfont"></i>
            </el-button>
            </el-input>
          </div>
          <div class="memo" v-if="remark">
            <p>{{$t("recharge.RechargeMemo")}}</p>
            <!--<el-input v-model="remark" class="copy-input" type="text" disabled></el-input><span><i class="iconfont icon-azl-icon-copy iconColor"></i></span>-->

            <el-input v-model="menmo" readonly="readonly" class="input-with-select" disabled>
              <el-button slot="append"
                         v-clipboard:copy="remark"
                         v-clipboard:success="copyKey"
                         v-clipboard:error="onError">
                <i class="icon-azl-icon-copy iconColor iconfont"></i>
              </el-button>
            </el-input>
          </div>
        </div>
        <div class="last-footer">
          <p>1.{{$t("recharge.NotCurr")}} {{Title}} {{$t("recharge.NotFind")}}</p>
          <p>2.{{$t("recharge.Use")}} {{Title}} {{$t("recharge.MakeSureGet")}}</p>
          <p>3.{{$t("recharge.FinishRecharge")}}</p>
          <p v-if="remark" style="color: #FF5A30">4.{{$t("recharge.FillMemo")}}!</p>
        </div>
      </div>
      <div class="fuceng" v-if="isShowFuceng">
        <div class="header"><i class="iconfont icon-az-icon-close-" @click="closeFuceng" style="cursor: pointer"></i></div>
        <div class="big-logo">
          <!--<div class="icon-bg" :class="ACurrency">-->
            <!--<i :class="`icon-${ACurrency}`" style="font-size: 36px;color: #fff;"></i>-->
          <!--</div>-->
          <img class="icon-bg" :src="`/image/currency/web_${ACurrency}.png`|hostImgPath" alt="">
          <p>{{Title}}</p>
        </div>
        <ul class="list">
          <li>* {{$t("recharge.YourRecharge")}} {{Title}} {{$t("recharge.zichan")}}</li>
          <li style="color:rgba(255,90,48,1);">* {{$t("recharge.NotCurr")}} {{Title}} {{$t("recharge.NotFind")}}</li>
          <li>* {{$t("recharge.RechargeTime")}}{{RechargeTime}}{{$t("recharge.Time")}}</li>
        </ul>
        <div class="btn">
          <el-button @click="closeFuceng" style="width:140px;height:40px;border-radius: 4px;">{{$t("recharge.LookLocal")}}</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  //调用的时候传入币种id
  import QRCode from 'qrcode'
  import api from '../../../libs/api'

    export default {
        data(){
          return{
            dialogVisible:false,
            Title:"",
            RechargeTime:"",
            Address:"",
            remark:"",
            menmo:"",
            isShowFuceng:true,
            canPost:true,
            ACurrency:''
          }
        },
      created(){

      },
      mounted(){
        this.isShowFuceng = true;
      },
      methods:{
         createQrcode(){
            var canvas = document.getElementById('erweima');
            QRCode.toCanvas(canvas, this.Address,  function (error) {
                if (error) console.error(error)
                console.log('success!');
              }
            )
           canvas.style.width = "100%";
           canvas.style.height = "100%";
           console.log(222222);
          },
        open(title){
          this.ACurrency = title;
          this.Title = title.toUpperCase();
          this.dialogVisible = true;
          api.post("/Currency/GetCurrencyConfirmatonInfos",null)
            .then((res)=>{
              for (let i = 0;i < res.data.value.length;i++) {
                if (title == res.data.value[i].id) {
                  this.RechargeTime = res.data.value[i].confirmTime;
                }
              }
            })
            .catch((err)=>{
              console.log(err);
            })
          api.post("/Currency/GetCurrencyAddressInfos",null)
            .then((res)=>{
              for (let i = 0;i < res.data.value.length;i++) {
                if (title == res.data.value[i].id) {
                  this.remark = res.data.value[i].hasMemo;
                }
              }
            })
            .catch((err)=>{
              console.log(err);
            })
          this.canPost = true;
          this.getAdd(title, 1);
        },
        getAdd(title,num){
          api.post("/User/GetDepositAddress", {currency: title})
            .then((resp)=>{
              this.Address = resp.data.value.address;
              this.menmo = resp.data.value.memo;
              this.createQrcode();
              if(resp.data.value.address == "" || resp.data.value.address == null){
                this.Address = this.$t('recharge.AddressRequested');
                setTimeout(()=>{
                  if(num >= 3 && this.canPost){
                    this.$message({showClose: true, message: this.$t('recharge.SeverWrong'), type: 'error'});
                    this.Address = this.$t('recharge.AddressFail');
                    return;
                  }
                  ++num;
                  if(this.canPost){
                    this.getAdd(title, num);
                  }

                },3000)
              }
            })
            .catch((error)=>{
              console.log(error);
            })
        },
        copyKey(e){
          this.$message({ message:this.$t("recharge.CopySuccs"),showClose:true, type:'success'});
        },
        onError(){
          this.$message({ message:this.$t("recharge.CopyErr"),showClose:true, type:'error'});
        },
        closeVue(){
           this.dialogVisible = false;
          this.Address = "";
          this.isShowFuceng = true;
          this.Title = "";
          this.RechargeTime = "";
          this.Address = "";
          this.remark = false;
          this.menmo = "";
          let canvas = document.getElementById('erweima');
          canvas.height = canvas.height;
          this.canPost = false;
        },
        closeFuceng(){
           this.isShowFuceng = false;
        },
        // chushihua(){
        //    this.isShowFuceng
        // },
      },
      // destroyed(){
      //     console.log(111);
      // }
    }
</script>
<style>
  .dan-dialog.el-dialog__title{
    font-family:PingFang-SC-Medium;
    color:rgb(51,51,51) !important;
  }
  .dan-dialog .el-input__inner{
    /*width:281px;*/
    height:40px;
    background:rgba(245,245,245,1) !important;
    border-radius: 4px 0px 0px 4px;
    font-size:12px;
    font-family:OpenSans;
    color:rgba(85,85,85,1);
    line-height:40px;
    padding: 0px;
  }
</style>
<style scoped lang="scss" type="text/scss">

.iconColor{
  color: rgba(201,147,62,1);
}
#erweima{
  width: 100%;
  height: 100%;
}
  .box{
    width: 100%;
    .con{
      .tou{
        font-size:12px;
        font-family:PingFang-SC-Medium;
        color:rgba(136,136,136,1);
        text-align: center;
      }
      .qr-code{
        width:180px;
        height:180px;
        margin: 0 auto;
        text-align: center;
        position: relative;
        #icon-bg{
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateY(-50%) translateX(-50%);
          display: inline-block;
          width:40px;
          height:40px;
          line-height:40px;
          border-radius: 50%;
          overflow: hidden;
          text-align: center;
        }
      }
      .footer-copy{
        .recharge-input,.memo{
          margin-top: 20px;
          p{
            font-size:12px;
            font-family:PingFang-SC-Medium;
            color:rgba(136,136,136,1);
          }
        }
      }
      .last-footer{
        width: 275px;
        margin: 20px auto 0;
        font-size:12px;
        font-family:PingFang-SC-Medium;
        color:rgba(178,178,178,1);
        line-height:17px;
      }
    }
    .fuceng{
      width: 100%;
      height: 100%;
      position: absolute;
      background:rgba(255,255,255,0.94);
      left: 0;
      top: 0;
      border-radius: 6px;
      .header{
        color: #888;
        font-size: 14px;
        padding-right: 20px;
        line-height: 54px;
        text-align: right;
      }
      .big-logo{
        margin-top: 63px;
        text-align: center;
        .icon-bg{
          display: inline-block;
          width:70px;
          height:70px;
          line-height:70px;
          border-radius: 50%;
          overflow: hidden;
          text-align: center;
        }
        p{
          font-size:24px;
          font-family:PingFang-SC-Bold;
          color:rgba(51,51,51,1);
        }
      }
      .list{
        width: 260px;
        font-size:16px;
        font-family:PingFangSC-Semibold;
        color:rgba(85,85,85,1);
        margin: 40px auto;
        li{
          margin-bottom: 15px;
        }
      }
      .btn{
        text-align: center;
      }
    }
  }
</style>
