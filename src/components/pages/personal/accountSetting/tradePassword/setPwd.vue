<template>
  <div>
    <top-bar :title="$t('tradePwd.setPwdTitle')"></top-bar>
    <div class="main-view-panel-width">
      <div class="panel panel-form-norequired">
        <p class="p-title">{{$t('tradePwd.setPwdTitle')}}</p>
        <div class="p-content">
          <el-form :model="pwd" :rules="rules" ref="ruleForm" label-width="136px" class="rule-form">
            <el-form-item :label="$t('tradePwd.newPwd')" prop="newPassword">
              <el-input v-model="pwd.newPassword" type="password" :maxlength="6" :placeholder="$t('tradePwd.newPwdPlaceholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('tradePwd.confirmPwd')" prop="confirmPassword">
              <el-input v-model="pwd.confirmPassword" type="password" :maxlength="6" :placeholder="$t('tradePwd.confirmPwdPlaceholder')"></el-input>
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
      let validatePassConfirmPwd = (rule,value,callback) => {
        if(value === this.pwd.newPassword){
          callback();
        }else{
          callback(new Error(this.$t('tradePwd.confirmPwdNotEqualNewPwd')));
        }
      };
      let validatePassword = (rule,value,callback) => {
        console.log(value);
        if(/^[0-9]{6,6}$/.test(value)){
          callback();
        }else{
          callback(new Error(this.$t('tradePwd.tradePwdValidateErr')));
        }
      };
      return {
        pwd:{
          newPassword:'',
          confirmPassword:''
        },
        loading:false,
        rules:{
          newPassword:[
            { required: true, message: this.$t('tradePwd.newPwdRequired'), trigger: 'blur' },
            { validator:validatePassword, trigger: 'blur' }
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
            this.loading = true;
            api.post('/User/SetTradePassword',{
              password: this.pwd.newPassword
            }).then((res)=>{
              this.$message({ message:this.$t('tradePwd.setPwdSuc'),showClose:true, type:'success'});
              this.$store.dispatch('getUser');
              this.loading = false;
              this.$router.replace(this.$route.query.redirect || {name:'accountSettingHome'});
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
