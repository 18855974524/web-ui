<template>
  <div>
    <top-bar :title="$t('tradePwd.resetPwdTitle')"></top-bar>
    <div class="main-view-panel-width">
      <div class="panel panel-form-norequired">
        <p class="p-title">{{$t('tradePwd.resetPwdTitle')}}</p>
        <div class="p-content">
          <el-form :model="password" :rules="rules" ref="ruleForm" label-width="136px" class="rule-form">
            <el-form-item :label="$t('tradePwd.cardID')" prop="idNo" v-if="userInfo&&userInfo.certStatus == 2">
              <el-input v-model="password.idNo" type="text" :placeholder="$t('tradePwd.cardIDPlaceholder')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('tradePwd.newPwd')" prop="password">
              <el-input v-model="password.password" type="password" :maxlength="6" :placeholder="$t('tradePwd.newPwdPlaceholder')"></el-input>
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
      let validatePassConfirmPwd = (rule,value,callback) => {
        if(value === this.password.password){
          callback();
        }else{
          callback(new Error(this.$t('tradePwd.confirmPwdNotEqualNewPwd')));
        }
      };
      let validatePassword = (rule,value,callback) => {
        if(/^[0-9]{6,6}$/.test(value)){
          callback();
        }else{
          callback(new Error(this.$t('tradePwd.tradePwdValidateErr')));
        }
      };
      return {
        password:{
          password:'',
          confirmPassword:'',
          idNo:'',
          checkResultId:''
        },
        loading:false,
        rules:{
          idNo:[
            { required: true, message: this.$t('tradePwd.cardIDRequired'), trigger: 'blur' },
          ],
          password:[
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
    computed:{
      userInfo(){
        return this.$store.state.user.info;
      },
    },
    methods: {
      submitForm(){
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            api.post('/User/ForgotTradePassword', {
              password: this.password.password,
              checkResultId: this.$route.params.cr,
              idNo: this.password.idNo || null
            }).then((res) => {
              this.$message({ message:this.$t('tradePwd.resetPwdSuc'),showClose:true, type:'success'});
              this.loading = false;
              this.$router.replace({name: 'accountSettingHome'});
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

</style>
