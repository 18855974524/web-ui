<template>
  <div>
    <top-bar :title="$t('tradePwd.updatePwdTitle')"></top-bar>
    <div class="main-view-panel-width">
      <div class="panel panel-form-norequired">
        <p class="p-title">{{$t('tradePwd.updatePwdTitle')}}</p>
        <div class="p-content">
          <el-form :model="password" :rules="rules" ref="ruleForm" label-width="136px" class="rule-form">
            <el-form-item :label="$t('tradePwd.oldPwd')" prop="oldPassword">
              <el-input v-model="password.oldPassword" type="password" :maxlength="6" :placeholder="$t('tradePwd.newPwdPlaceholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('tradePwd.newPwd')" prop="newPassword">
              <el-input v-model="password.newPassword" type="password" :maxlength="6" :placeholder="$t('tradePwd.newPwdPlaceholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('tradePwd.confirmPwd')" prop="confirmPassword">
              <el-input v-model="password.confirmPassword" type="password" :maxlength="6" :placeholder="$t('tradePwd.confirmPwdPlaceholder')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm" :loading="loading">{{$t('tradePwd.ensure')}}</el-button>
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
      let validatePassword = (rule,value,callback) => {
        if(/^[0-9]{6,6}$/.test(value)){
          callback();
        }else{
          callback(new Error(this.$t('tradePwd.tradePwdValidateErr')));
        }
      };
      let validatePassConfirmPwd = (rule,value,callback) => {
        if(value === this.password.newPassword){
          callback();
        }else{
          callback(new Error(this.$t('tradePwd.confirmPwdNotEqualNewPwd')));
        }
      };
      return {
        password:{
          oldPassword:'',
          newPassword:'',
          confirmPassword:''
        },
        loading:false,
        rules:{
          oldPassword:[
            { required: true, message: this.$t('tradePwd.oldPwdRequired'), trigger: 'blur' },
            { validator: validatePassword, trigger: 'blur'  }
          ],
          newPassword:[
            { required: true, message: this.$t('tradePwd.newPwdRequired'), trigger: 'blur' },
            { validator: validatePassword, trigger: 'blur'  }
          ],
          confirmPassword:[
            { required: true, message: this.$t('tradePwd.confirmPwdRequired'), trigger: 'blur' },
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
            api.post('/User/ChangeTradePassword',{
              oldPassword: this.password.oldPassword,
              newPassword: this.password.newPassword
            }).then((res)=>{
              this.$message({ message:this.$t('tradePwd.updatePwdSuc'),showClose:true, type:'success'});
              this.loading = false;
              this.$router.replace({name:'accountSettingHome'});
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

