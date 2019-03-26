<template>
  <div class="easyWarning">
    <el-dialog :visible.sync="dialogVisible" width="400px" center top="0" :closeOnClickModal="false">
        <p class="dialogTitle">{{titleMessage}}</p>

        <div class="iconP"><i class="iconfont" :class="iconClass"></i></div>

        <p class="warningMess">{{warningMess}}</p>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="toSet">{{buttonMess}}</el-button>
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
        titleMessage:"",
        warningMess:"",
        buttonMess:"",
        iconClass:"",
      }
    },
    methods:{
      init(par){
        console.log(par);
        this.dialogVisible = par.dialogVisible;
        this.titleMessage = par.titleMessage;
        this.warningMess = par.warningMess;
        this.buttonMess = par.buttonMess;
        this.iconClass = par.iconClass;
      },
      disableNone(par){
        this.dialogVisible = par.dialogVisible;
      },
      toSet(){
        this.dialogVisible = false;
        let mess="111"
        this.$emit("toEasyWarn",mess);
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
     .iconP{
         width:100%;
         margin-top:20px;
     }
     .iconfont{
        font-size:40px;
         margin-left:160px;
         margin-top:30px;
     }
     .icon-az-icon-warning{
         color:#C9933E;

     }
     .icon-az-icon-success{
       color:$--color-success;
     }
     .warningMess{
       font-size:12px;
       text-align:center;
       width:100%;
       color:#888888;
       margin-top:30px;
     }
 }
</style>
