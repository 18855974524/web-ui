<template>
  <div class="hello">
    <h3>图标</h3>
    <i class="iconfont icon-az-icon-warning"></i>
    绑定并根据值来赋值（绑定邮箱/绑定手机）
    <div  :title="$t(`bindDialog.${msg}BindTitle`)" ></div>
    <img :src="`../../../static/img/country/dist/az-country-`+`${msg}.png`" class="flagImg" />


    <!-- 国家，国旗组建调用
        子组件传给父组件：getCountryEmitFn 函数内参数是子组件传过来的，子组件执行该函数执行
          country是子组件的emit的第一个参数，第二个参数是传过来的值
        父组件传给子组件 ：parentCountry是 父组件初始化传给子组件的在子组件props内，(父组件传给子组件值)
        json是父组件传给子组件的值
    -->
    <v-country @country="getCountryEmitFn" :parentCountry="json" style="margin-left:500px;"></v-country>

<img :src="'img'+ msg" />

    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>

    {{ $t("message.User") }}

    <div>
      // currency 过滤器 使用
      {{'12345.67888'|currency(2)}}
    </div>


    <el-checkbox v-model="checked">备选项</el-checkbox>
    <button @click="changelanguageen">切换英文</button>
    <button @click="changelanguagecn">切换中文</button>
    <button @click="error1">提示信息</button>
    <button @click="error2">错误信息</button>
    <button @click="error3">警告信息</button>
    <button @click="error4">成功信息</button>



  <!-- 智能检测组建 父组件点击执行子组件事件-->
  <v-smartCapture ref="smartCapture"></v-smartCapture>
  <button @click="resetSmart">重置智能检测</button>
  <br>
    <br>
  <hr/>

<!-- 简单的弹框提示信息，只有确定按钮
    ref和button内的点击事件是父级传给子集
  @toEasyWarn="toEasyWarnFn"是子集传给父级的，toEasyWarnFn函数内参数是子组件传过来的，@toEasyWarn是子组件的emit的第一个参数。

-->
<dialog-warning ref="easyWarning"  @toEasyWarn="toEasyWarnFn"></dialog-warning>
<button @click="easyWarningFn">点击出现弹框</button>
<br>
<!-- BTC提现 -->
<get-out-cash ref="getOutCash"  @togetCash="togetCashFn"></get-out-cash>
<button @click="getCashFn">点击提现</button>


    <!-- 简单的弹框提示信息，只有确定按钮
        ref和button内的点击事件是父级传给子集
      @toEasyWarn="toEasyWarnFn"是子集传给父级的，toEasyWarnFn函数内参数是子组件传过来的，@toEasyWarn是子组件的emit的第一个参数。
    -->
    <dialog-warning ref="easyWarning" @toEasyWarn="toEasyWarnFn"></dialog-warning>
    <button @click="easyWarningFn">点击出现弹框</button>
    <br>
    <!-- BTC提现 -->
    <get-out-cash ref="getOutCash" @togetCash="togetCashFn"></get-out-cash>
    <button @click="getCashFn">点击提现</button>


  </div>
</template>

<script>
  import SmartCapture from '../common/smartCapture'
  import County from '../common/country'
  import DialogWarning from '../common/dialogWarning/easyWarning'
  import GetOutCash from '../common/getCash/getOutCash'
  import {mapActions,mapGetters} from 'vuex';

  export default {
    name: 'HelloWorld',
    components: {
      'v-country': County,
      'v-smartCapture': SmartCapture,
      'dialog-warning': DialogWarning,
      'get-out-cash': GetOutCash
    },
    computed:{
      ...mapGetters(['coinPrecision']),//coinPrecision是store内state属性，这样拿属性没有延迟直接用thid.coinPrecision
    },
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        checked: true,
        src:'234124'+json.shortName,
        json: {
          shortName: "PT",
          phoneNumber: "123123",
        }
      }
    },
    created() {

    },
    methods: {
      ...mapActions(['asyncSetCoinPrecision']),//把store内的方法直接拿过来，然后可直接调用该方法this.asyncSetCoinPrecision
      changelanguageen() {
        this.$i18n.locale = 'en';
      },
      changelanguagecn() {
        this.$i18n.locale = 'cn';
      },
      error1() {
        this.$message({showClose: true, message: '这是一条消息提示'});
      },
      error2() {
        this.$message({showClose: true, message: '错了哦，这是一条错误消息', type: 'error'});
      },
      error3() {
        this.$message({showClose: true, message: '警告，这是一条警告消息', type: 'warning'});
      },
      error4() {
        this.$message({showClose: true, message: '成功哦，这是一条成功消息', type: 'success',duration:0});
      },
      resetSmart() {
        this.$refs.smartCapture.init("11")
      },
      getCountryEmitFn(json) {
        console.log(22222);
        console.log(json)
      },
      easyWarningFn() {
        let par = {
          dialogVisible: true,
          titleMessage: "设置资金密码",
          warningMess: "为了保障您的数字资产安全，在提现前请设置资金密码！",
          buttonMess: "去设置",
          iconClass: "icon-az-icon-warning"  //  icon-az-icon-success
        }
        this.$refs.easyWarning.init(par);
      },
      toEasyWarnFn(val) {//子组件点击控制该函数执行
        console.log(val);
        let par = {
          dialogVisible: false,//让子弹框消失
        }
        this.$refs.easyWarning.disableNone(par);//让子弹框消失
      },
      getCashFn() {
        let par = {
          balance: "3223.2864",//需要提币的可用金额
          currency: "btc",// 可用金额的单位,币种,全是小写
          withdrawlCah: "1200",  //抵扣手续费的可用金额,判断是否需要购买或充值
          isEspecial: false,//是否为特殊币种
        }
        this.$refs.getOutCash.init(par);
      },
      togetCashFn(val) {

      }
    }
  }
</script>

<style scoped>
  .hello {
    width: 100%;
    height: 100%;
    background: skyblue;
  }
</style>
