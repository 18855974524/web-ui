<template>
  <el-dialog :visible.sync="dialogVisible" width="400px" center top="0" :closeOnClickModal="false"
             :title="$t('accountSetting.editUserName')" @close="closeDialog">
    <div class="dialog cont-box">
      <el-form :model="bindData" :rules="rules" ref="ruleForm" class="rule-form" label-position="top" @submit.native.prevent>
        <el-form-item :label="$t('accountSetting.userNameLabel')" prop="nickName" class="b-item">
          <el-input type="text" v-model="bindData.nickName" ref="input" :placeholder="$t('accountSetting.userNamePlc')" @keyup.native.enter="submitForm"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading" style="width:100%;">{{$t("accountSetting.ensure")}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
  import api from '../../../../libs/api'

  export default {
    data() {
      let check = (rule, value, callback)=>{
        let len = value.replace(/[\u0391-\uFFE5]/g, 'aa').length;
        if (len<4 || len>20 || !/^[\u4e00-\u9fa5A-Za-z0-9]{2,}$/gi.test(value)) {
          callback(new Error(this.$t('accountSetting.nickNameLengthErrorTip')));
        }
        callback();
      };
      return {
        dialogVisible: false,
        bindData:{
          nickName:'',
          oldName:''
        },
        loading:false,
        rules: {
          nickName: [
            {required: true, message: this.$t('accountSetting.userNamePlc'), trigger: 'blur'},
            {validator: check, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      open(name) {
        this.bindData.nickName = name;
        this.bindData.oldName = name;
        this.dialogVisible = true;
        this.$nextTick(()=>{
          this.$refs.input.focus();
        })
      },
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if(this.bindData.nickName.trim() === this.bindData.oldName.trim()){
              this.dialogVisible = false;
            }else{
              this.loading = true;
              api.post('/User/UpdateNickName', {
                nickName: this.bindData.nickName.trim()
              })
                .then((res) => {
                  this.$store.dispatch('getUser')
                  this.$message({ message:this.$t('accountSetting.nickNameUpdatedSucTip'),showClose:true, type:'success'});
                  this.dialogVisible = false;
                  this.loading = false;
                })
                .catch(() => {
                  this.dialogVisible = false;
                  this.loading = false;
                });
            }
          }
        });
      },
      closeDialog(){
        this.$refs.ruleForm.resetFields()
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
  .cont-box .el-form-item.is-required .el-form-item__label:before{
    display: none;
  }
</style>
