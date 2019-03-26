<template>
  <div class="easyWarning">
    <el-dialog :visible.sync="dialogVisible" width="400px" center top="0" :closeOnClickModal="false">
        <p class="dialogTitle">{{ $t("addGetCashAdress.addnewgetCashAddress") }} </p>

        <div class="sure-mess">
            <div>
                <span class="label">{{ $t("addGetCashAdress.getCashAdress") }} </span>
                <span class="messs">{{adress.adress}} </span>
            </div>
            <div v-if="remarkAsync2" style="margin-top:10px;">
                <span class="label">{{ $t("addGetCashAdress.remarks") }}</span>
                <span class="messs">{{adress.remarks}} </span>
            </div>
        </div>
        <p class="labs" v-if="remarkAsync">{{ $t("addGetCashAdress.remarks") }}</p>
        <el-input v-if="remarkAsync" :placeholder="$t('addGetCashAdress.enterCurrencyRemarks')" v-model="adress.remarks" style="width:340px;"></el-input>

        <p class="labs">{{ $t("addGetCashAdress.adressName") }}</p>
        <el-input :placeholder="$t('addGetCashAdress.enterCashName')" v-model="adress.adressName" style="width:340px;"></el-input>

        <el-button type="primary" :loading="isLoading" @click="submitFn" class="sure"> {{ $t("addGetCashAdress.addSureo") }}</el-button>



    </el-dialog>
  </div>
</template>

<script>
  import api from '../../../libs/api'
//添加提现地址
  export default {
    data() {
      return {
        dialogVisible:false,
        remarkAsync:false,
        remarkAsync2:false,
        isLoading:false,
        adress:{
            adress:"",
            remarks:"",
            adressName:"",
            currency:"",
        }
      }
    },
    methods:{
      init(par){
          this.adress={
            adress:"",
            remarks:"",
            adressName:"",
            currency:"",
        }


        this.dialogVisible = true;
        this.adress.adress = par.adress;
        this.adress.currency = par.currency;

        if(par.remarks == "**"){
            this.remarkAsync=false;
            this.remarkAsync2=false;
        }else if(par.remarks.replace(/(^\s*)|(\s*$)/g, "")==""){
            this.remarkAsync=true;
            this.remarkAsync2=false;
            this.adress.remarks = "";
        }else{
            this.remarkAsync=false;
            this.remarkAsync2=true;
            this.adress.remarks = par.remarks;
        }

      },
      submitFn(){

          if(this.adress.adressName.replace(/(^\s*)|(\s*$)/g, "")==""){
              this.$message({ showClose: true, message: this.$t("addGetCashAdress.enterCashName"),type: 'error' });
          }else if(this.adress.remarks.replace(/(^\s*)|(\s*$)/g, "")==""){
              if(this.remarkAsync == true){
                  this.$message({ showClose: true, message:  this.$t("addGetCashAdress.enterCurrencyRemarks"),type: 'error' });
              }else{
                  this.isLoading = true;
                  let par = {
                        "currency": this.adress.currency,//币种
                        "tag": this.adress.adressName,//名称
                        "memo": this.adress.remarks,//备注码
                        "address": this.adress.adress//地址
                    }
                    api.post('/User/AddWithdrawlAddress', par).then((res)=>{
                        this.$emit("toaddCashAdress");
                        this.dialogVisible = false;
                        this.isLoading = false;
                    }).catch((err)=> {
                        console.log(err);
                        this.isLoading = false;
                    })
              }
          }else{
              if( /^[0-9a-zA-Z]*$/.test(this.adress.remarks)==false){
                  this.$message({ showClose: true, message:  this.$t("addGetCashAdress.remarksJustNumberAndAZ"),type: 'error' });
              }else{
                  this.isLoading = true;
                let par = {
                    "currency": this.adress.currency,//币种
                    "tag": this.adress.adressName,//名称
                    "memo": this.adress.remarks,//备注码
                    "address": this.adress.adress//地址
                }
                // console.log(par)
                api.post('/User/AddWithdrawlAddress', par).then((res)=>{
                    setTimeout(() => {
                        this.$emit("toaddCashAdress");
                    }, 1500);
                    
                    this.dialogVisible = false;
                    this.isLoading = false;
                }).catch((err)=> {
                    console.log("err");
                    this.isLoading = false;
                })
            }
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
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
     .sure-mess{
         width:300px;
         background:rgba(248,248,248,1);
         padding:20px;
         border-radius:6px;
     }
     .label{
         width:50px;
         font-size:12px;
         color:#B2B2B2;
         text-align:right;
     }
     .messs{
         color:#333333;
         font-size:12px;
         margin-left:5px;
     }
     .labs{
         margin-top:20px;
         color:#B2B2B2;
         font-size:12px;
     }
     .sure{
         width:340px;
         margin-top:20px;
     }
 }
</style>
