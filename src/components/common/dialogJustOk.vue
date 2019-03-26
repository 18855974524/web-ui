<template>
  <div class="easyWarning">
    <el-dialog :visible.sync="dialogVisible" width="400px" center top="0" :closeOnClickModal="false">
        <p class="dialogTitle">{{$t("trade.reminder")}}</p>

        <div class="mainMess">
            {{$t("trade.notTooLower")}}
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="closeFn">{{$t("trade.knowed")}}</el-button>
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
      }
    },
    methods:{
      init(){
        this.dialogVisible = true;
      },
      closeFn(){
          this.dialogVisible = false;
      },
      
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
    .el-button{
        width:120px;
        height:40px;
    }
 }
</style>
