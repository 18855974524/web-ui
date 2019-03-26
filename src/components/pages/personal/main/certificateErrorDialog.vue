<template>
  <el-dialog :visible.sync="dialogVisible" width="400px" center top="0" :closeOnClickModal="false"
             :title="$t('certificateConfirm.title')">
    <div class="dialog">
      <p class="reason-title">{{$t('certificateConfirm.reasonTitle')}}</p>
      <div class="warning-msg">{{warningMess}}</div>
      <p class="re-cert-tip">
        {{$t('certificateConfirm.reCertTip')}}
      </p>
      <el-button class="submit-btn" type="primary" size="medium" @click="toSet">{{$t('certificateConfirm.ok')}}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  //简单的弹框提醒
  export default {
    data() {
      return {
        dialogVisible: false,
        warningMess: "*姓名和身份证信息不一致 *手持身份证照片没有附带日期",
      }
    },
    methods: {
      open(warningMess) {
        this.warningMess = warningMess;
        this.dialogVisible = true;
      },
      toSet() {
        this.dialogVisible = false;
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .dialog {
    text-align: center;
  }

  .reason-title {
    font-size: 14px;
    color: #888;
    margin-top: 5px;
  }

  .warning-msg {
    width: 190px;
    color: $--color-warning;
    font-size: 14px;
    margin: 20px auto;
    text-align: left;
  }

  .re-cert-tip {
    color: #555;
    font-size: 14px;
  }

  .submit-btn {
    width: 140px;
    margin: 30px auto 10px;
  }

</style>
