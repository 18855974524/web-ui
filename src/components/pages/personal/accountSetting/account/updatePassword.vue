<template>
  <div>
    <top-bar :title="$t('updatePwd.title')"></top-bar>
    <div class="main-view-panel-width">
      <div class="panel panel-form-norequired">
        <p class="p-title">{{$t("updatePwd.title")}}</p>
        <div class="p-content">
          <el-form :model="password" :rules="rules" ref="ruleForm" label-width="136px" class="rule-form">
            <el-form-item :label="$t('updatePwd.oldPwdLabel')" prop="oldPassword">
              <el-input v-model="password.oldPassword" type="password" :placeholder="$t('updatePwd.oldPwdPlaceholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('updatePwd.newPwdLabel')" prop="newPassword">
              <el-input v-model="password.newPassword" type="password" :placeholder="$t('updatePwd.newPwdPlaceholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('updatePwd.confirmPwdLabel')" prop="confirmPassword">
              <el-input v-model="password.confirmPassword" type="password" :placeholder="$t('updatePwd.confirmPwdPlaceholder')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm" :loading="loading">{{$t("updatePwd.ensure")}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../../../../libs/api'
  import topBar from '../topBar'
  export default {
    data() {
      let validatePassConfirmPwd = (rule,value,callback) => {
        if(value === this.password.newPassword){
          callback();
        }else{
          callback(new Error(this.$t('updatePwd.confirmNotEqualNewPwd')));
        }
      };
      let validatePassPwd = (rule,value,callback) => {
        if (!value){
          callback(new Error(this.$t('setNewPwd.PwdNoNull')));
        }else if(/^[0-9]{8,20}$/.test(value)){
          callback(new Error(this.$t('updatePwd.pwdLengthTip')));
        }else if(!/^[~!@#$%^&*\x220-9a-zA-Z]{8,20}$/.test(value)){
          callback(new Error(this.$t('updatePwd.passwordWrong')));
        }else{
          callback();
        }
      };
      return {
        loading:false,
        password:{
          oldPassword:'',
          newPassword:'',
          confirmPassword:''
        },
        rules:{
          oldPassword:[
            { required: true, message: this.$t('updatePwd.oldPwdRequired'), trigger: 'blur' },
            { validator: validatePassPwd,trigger: 'blur' }
          ],
          newPassword:[
            { required: true, message: this.$t('updatePwd.newPwdRequired'), trigger: 'blur' },
            { validator: validatePassPwd, trigger: 'blur' }
          ],
          confirmPassword:[
            { required: true, message: this.$t('updatePwd.confirmPwdRequired'), trigger: 'blur' },
            { validator: validatePassConfirmPwd, trigger: 'blur'  }
          ],
        }
      }
    },
    components:{
      topBar
    },
    methods: {
      submitForm(){
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if(this.password.oldPassword === this.password.newPassword){
              this.$message.error(this.$t('updatePwd.newPwdEqualOldPwdTip'));
              return;
            }
            this.loading = true;
            api.post('/User/ChangePassword',{
              oldPassword: this.password.oldPassword,
              newPassword: this.password.newPassword
            })
              .then((res)=>{
                this.$message({ message:this.$t('updatePwd.pwdUpdatedSuc'),showClose:true, type:'success'});
                this.loading = false;
                this.$store.dispatch('setToken',res.data.value || null);
                this.$router.push({name:'accountSettingHome'});
              })
              .catch(()=>{
                this.loading = false;
              });
          }
        });
      },
    },
    created() {
    },
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .panel{
    background: #fff;
    border-radius: 6px;
    margin-bottom:60px;
    height:480px;
    .p-title{
      line-height:60px;
      font-size: $large-fs;
      color: $font-color3;
      padding-left:20px;
      box-shadow: inset 0 -1px 0 0 #E5E5E5;
    }
    .p-content{
      padding:40px 0 126px 0;
      text-align:center;
    }
    .rule-form {
      width: 456px;
      margin:0 auto;
      button{
        width:320px;
      }
    }
  }
</style>
