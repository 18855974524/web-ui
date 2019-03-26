<template>
  <div class="bind-google-tip">
    <el-dialog
      :title="title"
      width="400px"
      :visible.sync="dialogVisible"
      @close="closeDialog"
      :closeOnClickModal="false"
      :append-to-body="false"
      top="0"
      center>
      <div class="google-toast">
        <div class="start-goo-pic">
          <i class="iconfont icon-az-icon-warning"></i>
        </div>
        <div class="start-verify-prompt">
          <p>
            {{infoText}}
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="default" @click="cancel">{{cancelText}}</el-button>
          <el-button type="primary" @click="submit">{{okText}}</el-button>
          </span>
        <div class="never-prompt" v-if="isNotRemindTip">
          <el-checkbox v-model="notRemind">{{$t('openGoogleVerify.notRemind')}}</el-checkbox>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" type="text/scss">
  .bind-google-tip{
    .start-goo-pic {
      i{
        font-size:40px;
        color:$--color-primary;
        margin:5px auto 30px auto;
        display: block;
        text-align:center;
      }
    }
    .start-verify-prompt {
      width: 320px;
      margin: 0 auto;
      font-size: 14px;
      line-height: 20px;
      color: #555555;
      text-align: center;
      margin-bottom: 30px;
    }

    .dialog-footer {
      display: block;
      width: 260px;
      margin: 0 auto;
    }
    .dialog-footer button {
      width: 120px;
      height: 40px;
    }
    .never-prompt {
      width: 100px;
      margin: 20px auto 10px;
      color:#888;
      .el-checkbox{
        &.is-checked .el-checkbox__label,
        .el-checkbox__label{
          color:#888;
          font-weight: normal;
        }
        .el-checkbox__input{
          .el-checkbox__inner{
            background-color: #f5f5f5;
            border-color:#e5e5e5;
          }
          &.is-checked{
            .el-checkbox__inner{
              background-color:$--color-primary;
              border-color:$--color-primary;
            }
          }
        }
      }
    }
  }

</style>
<script>
  // 提示用户开启或绑定谷歌验证器的弹框
  // 通过调用 open 方法传入配置吧信息
  export default {
    data() {
      return {
        title:'',
        dialogVisible: false,
        cancelText:'',
        okText:'',
        isNotRemindTip: false,
        notRemind: false,
        infoText:''
      }
    },
    methods: {
      open(title,okText,cancelText,infoText,isNotRemindTip = false,notRemindWithToken = false) {
        this.title = title || this.$t("openGoogleVerify.openTitle"); // 弹框 title
        this.okText = okText || this.$t("openGoogleVerify.open"); // 确定按钮文字
        this.cancelText = cancelText || this.$t("openGoogleVerify.remindNext"); // 取消按钮文字
        this.infoText = infoText || this.$t("openGoogleVerify.openTip"); // 中间信息说明
        this.isNotRemindTip = isNotRemindTip; //是否显示不再提醒复选款
        this.notRemindWithToken = notRemindWithToken; //点击以后再说是否设置在登陆期间不再提醒
        this.dialogVisible = true;
      },
      cancel(){
        if(this.notRemindWithToken){
          this.notRemindUser(false);
        }
        this.$emit('cancel');
        this.dialogVisible = false;
      },
      submit(){
        this.$emit('submit');
        this.dialogVisible = false;
      },
      notRemindUser(local){
        this.$store.dispatch('setNotRemindGoogleOpt',{opt:true,local:local});
      },
      closeDialog(){
        if(this.isNotRemindTip&&this.notRemind){
          this.notRemindUser(true);
        }
      }

    },
    created(){

    }
  }
</script>
