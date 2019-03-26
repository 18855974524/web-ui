<template>
  <div class="easyWarning">
    <el-dialog :visible.sync="dialogVisible" width="400px" center top="0" :closeOnClickModal="false">
        <p class="dialogTitle">{{dialog.titleMessage}}</p>

        <div class="mainMess">
            {{dialog.firstMess}}
            <span class="colorGreen" v-if="dialog.bugAsync">{{$t("trade.bugIn")}}</span>
            <span class="colorRed" v-if="!dialog.bugAsync">{{$t("trade.sellOut")}}</span>
            {{dialog.secondMess}}
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button @click="closeFn">{{$t("trade.cancle")}}</el-button>
            <el-button type="primary" @click="toSet">{{$t("trade.sure")}}</el-button>
        </span>


    </el-dialog>
  </div>
</template>

<script>
//简单的弹框提醒
  export default {
    data() {
      return {
        dialogVisible:false,
        dialog:{
            titleMessage:"",
            bugAsync:true,
            firstMess:"",
            secondMess:"",
        }
      }
    },
    methods:{
      init(par){
          console.log(par)
        this.dialogVisible = true;
        // let pars = {
        //     titleMessage:"止盈止损",
        //     bugAsync:true,
        //     firstMess:"当最新价格 ≥ 68123.123 USDT 时，触发以价格6868.0024USDT",
        //     secondMess:"0.0024 BTC 的订单",
        // }
        Object.assign(this.dialog,par);

      },
      closeFn(){
          this.dialogVisible = false;
      },
      toSet(){
       Object.assign(this.dialog,{});
       this.dialogVisible = false;
       this.$emit("dialogWing",this.dialog.bugAsync);
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
 .easyWarning{
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
    .mainMess{
        width:300px;
        height:60px;
        font-size:14px;
        font-family:PingFang-SC-Medium;
        color:rgba(153,153,153,1);
        line-height:20px;
        margin:0 auto;
        text-align:center;
    }
    .colorGreen{
        color:rgba(10,191,116,1);
    }
    .colorRed{
        color:rgba(230,100,57,1);
    }
    .el-button{
        width:120px;
        height:40px;
    }
 }
</style>
