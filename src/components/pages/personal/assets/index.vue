<template>
  <div class="my-assets main-view-panel-width">
    <div class="top-info">
      <div class="left-card">
        <div style="width:360px">
          <p class="p-title">{{$t('myAsset.totalValue')}}</p>
          <div class="asset-num">
            <p class="primary-text">
              <span class="large-text">
                <span v-if="hiddenAsset" style="position:relative;top:8px;">****</span>
                <span v-else>{{personalAsset.btc|scientific|noDataShow('--')}}</span>
              </span>
              BTC
            </p>
            <p class="small-text">
              ≈
              <span v-if="hiddenAsset" style="position:relative;top:3px;">****</span>
              <span v-else>{{personalAsset.btc|toLegalMoney('btc')|currency|noDataShow('--')}}</span>
            </p>
          </div>
        </div>
        <div style="width:138px">
          <p class="p-title">{{$t('myAsset.today')}}</p>
          <p class="asset-num" style="line-height:56px">
            <span v-if="hiddenAsset">****</span>
            <span :class="{'success-text':personalAsset.growth24Hour>=0,'danger-text':personalAsset.growth24Hour<0}" v-else>
              {{personalAsset.growth24Hour>=0?'+':''}}{{personalAsset.growth24Hour|toNumFixed(2)|noDataShow('--')}}%
            </span>
          </p>
        </div>
        <div class="visible-icon" @click="toggleHiddenAsset()">
          <i class="iconfont icon-az-icon-hide-" v-if="hiddenAsset"></i>
          <i class="iconfont icon-az-icon-display-" v-else></i>
        </div>
      </div>
      <div class="right-card">
        <div style="width:262px">
          <p class="p-title">{{$t('myAsset.todayDepositLimit')}}</p>
          <p class="asset-num"><span style="color:#555">{{withDrawLimit.useVolume}}</span>/{{withDrawLimit.volume}}
            BTC</p>
        </div>
        <div>
          <el-button type="default" size="small" @click="$router.push({name:'chargeMoneyMain'})">{{$t('myAsset.financialRecord')}}
          </el-button>
          <el-button type="default" size="small" @click="$router.push({name:'depositAddress'})">
            {{$t('myAsset.depositAddressManage')}}
          </el-button>
        </div>
      </div>
    </div>
    <div class="asset-list">
      <div class="filter">
        <el-input
          size="small"
          @input="search"
          :placeholder="this.$t('myAsset.searchPlaceholder')"
          prefix-icon="iconfont icon-az-icon-search"
          v-model="filter.currency">
        </el-input>
        <div class="common-check-box">
          <el-checkbox v-model="filter.filterSmall" :disabled="busy" @change="getCurrentPageData">
            {{$t('myAsset.hiddenSmallCurrency')}}
          </el-checkbox>
          <el-tooltip style="cursor: pointer" class="item" effect="dark" :content="this.$t('myAsset.hiddenSmallCurrencyTip')" placement="bottom-end">
            <i class="iconfont icon-az-icon-question"></i>
          </el-tooltip>
        </div>
      </div>
      <el-table
        class="azex-common-table"
        :data="assetList"
        row-class-name="table-row"
        :empty-text="busy?this.$t('myAsset.loading'):this.$t('myAsset.noData')"
      >
        <el-table-column
          prop="currency"
          :label="$t('myAsset.currency')"
          width="140">
          <template slot-scope="scope">
            <span class="primary-text bold">{{scope.row.currency.toUpperCase()}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalAmount"
          :label="$t('myAsset.totalMoney')"
          align="right"
          width="190">
          <template slot-scope="scope">
            {{scope.row.totalAmount|scientific|toNumFixed}}
          </template>
        </el-table-column>
        <el-table-column
          prop="balance"
          :label="$t('myAsset.balance')"
          align="right"
          width="190">
          <template slot-scope="scope">
            {{scope.row.balance|scientific|toNumFixed}}
          </template>
        </el-table-column>
        <el-table-column
          prop="locked"
          :label="$t('myAsset.locked')"
          align="right"
          width="180">
          <template slot-scope="scope">
            {{scope.row.locked|scientific|toNumFixed}}
          </template>
        </el-table-column>
        <el-table-column
          prop="asLegalMoney"
          :label="$t('myAsset.asLegalMoney')"
          width="210">
          <template slot-scope="scope">
            {{scope.row.asBtc|toLegalMoney('btc')|currency}}
          </template>
        </el-table-column>
        <el-table-column
          prop="operate"
          :label="$t('myAsset.operate')"
          align="right"
          width="290">
          <template slot-scope="scope">
            <div class="operate-btn">
              <el-button
                :disabled="!scope.row.canDeposit"
                size="mini"
                type="success"
                @click="handleRecharge(scope.row)">{{$t('myAsset.recharge')}}
              </el-button>
              <el-button
                :disabled="!scope.row.canWithdrawl"
                size="mini"
                type="default"
                @click="handleWithdraw(scope.row)">{{$t('myAsset.deposit')}}
              </el-button>
              <el-button style="display:none;"
                size="mini"
                type="default"
                @click="handleSharePaper(scope.row)">{{$t('myAsset.shareGift')}}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-container" v-if="total">
        <el-pagination @current-change="currentChange"
                       :current-page="Number(filter.pageIndex)" :page-size="Number(filter.pageSize)"
                       layout="prev, pager, next" :total="total">
        </el-pagination>
      </div>
      <open-google-verify ref="openRechargeGoogleVerify" @cancel="cancelOpenRechargeGoogleVerify"
                          @submit="confirmOpenGoogleVerify"></open-google-verify>
      <open-google-verify ref="openWithdrawGoogleVerify" @cancel="cancelOpenWithdrawGoogleVerify"
                          @submit="confirmOpenGoogleVerify"></open-google-verify>
      <withdraw-cash ref="withdrawCash" @getCashSuccess="getCashSuccess"></withdraw-cash>
      <easy-warning ref="setCashPassword" @toEasyWarn="toEasyWarnFn1"></easy-warning><!-- 设置资金密码 -->
      <recharge-dialog ref="rechargeDialog"></recharge-dialog>
    </div>
  </div>
</template>

<script>
  import decimal from 'decimal.js'
  import loki from 'lokijs'
  import api from '../../../../libs/api'
  import util from '../../../../libs/util'
  import openGoogleVerify from '../../../common/googleVerify/openGooleVerify'
  import withdrawCash from '../../../common/getCash/getOutCash'
  import easyWarning from '../../../common/dialogWarning/easyWarning'
  import rechargeDialog from '../../../common/rechargeDialog/rechargedialog'
  import {Decimal} from 'decimal.js';

  export default {
    data() {
      return {
        assetList: [],
        minTotalAsset: 0.0001,
        lastFilterCurrency: '',
        filterSmall: false,
        filter: {
          pageIndex: 1,
          pageSize: 10,
          currency: '',
          filterSmall: false
        },
        personalAsset: {
          btc: undefined,
          growth24Hour: undefined

        },
        withDrawLimit: {},
        total: 0,
        busy: false,
        assetDb: new loki().addCollection('assetList'),
        allHasMemo:[],//所有的币种的 是否是特殊币种
      }
    },
    components: {
      openGoogleVerify,
      withdrawCash,
      easyWarning,
      rechargeDialog
    },
    computed: {
      hiddenAsset() {
        return this.$store.state.user.hiddenAsset;
      },
      notRemindOpenGoogleOpt() {
        return this.$store.state.user.notRemindOpenGoogleOpt;
      },
      userInfo() {
        return this.$store.state.user.info;
      }
    },
    mounted(){
      this.getCurrencyBasicInfoAll();
    },
    methods: {
      search() {
        this.filter.currency = this.filter.currency.trim().toUpperCase();
        if (this.busy) {
          setTimeout(() => {
            this.search();
          }, 500);
          return;
        }
        if (this.lastFilterCurrency !== this.filter.currency) {
          this.lastFilterCurrency = this.filter.currency;
          this.getCurrentPageData();
        }
      },
      currentChange(val) {
        this.filter.pageIndex = val;
        this.getCurrentPageData();
      },
      async getAssetList() {
        this.busy = true;
        let result;
        await api.post('/User/GetAssetPageList')
        .then((res) => {
          result = res;
          //console.log(result)
        }, () => {
          this.busy = false;
        });
        this.assetDb.remove(this.assetDb.chain().data());
        await result.data.value.items.forEach((item,index) => {
          this.assetDb.insert(item);
        });
        this.getCurrentPageData();
      },
      notExpire(time){
        return new Date().getTime() <= time;
      },
      getCurrentPageData() {
        this.busy = true;
        let dbChain = this.assetDb.chain();
        if(this.filter.filterSmall){
          dbChain = dbChain.where((item)=>{
            return item.asBtc > this.minTotalAsset
          })
        }
        dbChain = dbChain.simplesort('currency'); // 进行字母排序
        if(this.filter.currency){
          let searchWord = this.filter.currency.toLowerCase();
          dbChain = dbChain.where((item)=>{
            return item.currency.includes(searchWord)
          }).sort((prev,next)=>{
            return prev.currency.indexOf(searchWord) > next.currency.indexOf(searchWord)
          })
        }
        this.total = dbChain.data().length;
        this.assetList = dbChain.offset(this.filter.pageSize*(this.filter.pageIndex-1)).limit(10).data();
        console.log('assetList',this.assetList)
        this.busy = false;
      },
      getPersonalAsset() {
        api.post('/User/GetUserAssetSummary')
          .then((res) => {
            Object.assign(this.personalAsset, res.data.value)
            this.$store.dispatch('setUserAsset',this.personalAsset)
          });
      },
      getWithdrawLimit() {
        api.post('/User/GetUserWithdrawalLimit')
          .then((res) => {
            this.withDrawLimit = res.data.value;
            this.withDrawLimit.useVolume = decimal.sub(this.withDrawLimit.volume,this.withDrawLimit.surplusVolume).toNumber();
          });
      },
      toggleHiddenAsset() {
        this.$store.dispatch('setHiddenAsset', !this.hiddenAsset)
      },
      handleRecharge(item) {
        this.curItem = item;
        if (!this.isGoogleVerified('openRechargeGoogleVerify')) {
          // 充值
          this.openRecharge();
        }
      },
      openRecharge() {
        this.$refs.rechargeDialog.open(this.curItem.currency);
      },
      openWithdraw(isEsp){
        let a = new Decimal(this.curItem.asBtc);
        a = a.dividedBy(this.curItem.balance).toString();
        let par = {
          balance:this.curItem.balance,//需要提币的可用金额
          currency:this.curItem.currency,// 可用金额的单位,币种,全是小写
          isEspecial:isEsp,//是否为特殊币种
          toBtc: a, //提币的币种可用额除以btc的 比例
        }
        this.$refs.withdrawCash.init(par);
      },
      getCurrencyBasicInfo(){//获取币种基本信息  判断是否是特殊币种
        for(let i=0;i<this.allHasMemo.length;i++){
          if(this.allHasMemo[i].id == this.curItem.currency){
            // console.log(this.allHasMemo[i].hasMemo)
            this.openWithdraw(this.allHasMemo[i].hasMemo);
          }
        }
      },
      getCurrencyBasicInfoAll(){//获取所有币种的基本信息，是否是特殊币种
        api.post('/Currency/GetCurrencyAddressInfos',null).then((res)=>{
            this.allHasMemo = res.data.value;
        });
      },
      handleWithdraw(item){
        this.curItem = item;
        if(this.userInfo.isTradePasswordSetted){//判断已经设置了资金密码
          if(!this.isGoogleVerified('openWithdrawGoogleVerify')){//已经开启谷歌二次验证
            this.getCurrencyBasicInfo()//先获取是否是特殊币种，再进行提币
          }
        } else {
          let par = {
            dialogVisible: true,
            titleMessage: this.$t('myAsset.setTradePwd'),
            warningMess: this.$t('myAsset.setTradePwdTip'),
            buttonMess: this.$t('myAsset.goSet'),
            iconClass: "icon-az-icon-warning"  //  icon-az-icon-success
          }
          this.$refs.setCashPassword.init(par);
        }
      },
      toEasyWarnFn1(val) {//资金密码没设置，点击直接去设置资金密码
        // console.log(val);
        let par = {
          dialogVisible: false,
        }
        this.$refs.setCashPassword.disableNone(par);//让子弹框消失
        // this.$router.push({name:"setTradePwd",query:{redirect:{name:"myAssets"}}});//跳转到设置资金密码的地方
        //accountSettingHome
        this.$router.push({name: "accountSettingHome"});//直接跳转到我的账号里面
      },
      handleSharePaper() {

      },
      isGoogleVerified(ref) {
        if (this.notRemindOpenGoogleOpt) {
          return false;
        }
        // 判断是否需要弹出绑定二次验证提示
        if (this.userInfo.userOtpStatus === 0) {
          this.$refs[ref].open(this.$t('openGoogleVerify.bindTitle'),
            this.$t('openGoogleVerify.goBind'), null, this.$t('openGoogleVerify.bindTip'), true, true);
          return true;
        }
        return false;
      },
      cancelOpenRechargeGoogleVerify() {
        this.openRecharge();
      },
      cancelOpenWithdrawGoogleVerify() {
        this.getCurrencyBasicInfo();
      },
      confirmOpenGoogleVerify() {
        this.$router.push({name: 'accountSettingHome'});
      },
      getCashSuccess(){
        this.getAssetList();
        this.getPersonalAsset();
        this.getWithdrawLimit();
      }
    },
    created() {
      this.getAssetList();
      this.getPersonalAsset();
      this.getWithdrawLimit();
    },
  }
</script>
<style lang="scss" type="text/scss">
.operate-btn .el-button{

}
  .my-assets {
    .top-info {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      .left-card,
      .right-card {
        background: #fff;
        width: 590px;
        height: 138px;
        border-radius: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px 20px 30px 40px;
        box-sizing: border-box;
        .visible-icon {
          color: #888;
          line-height: 20px;
          cursor: pointer;
          align-self: flex-start;
          .iconfont {
            font-size: 22px;
          }
        }
        .p-title {
          font-size: 14px;
          color: #888;
          margin-bottom: 14px;
        }
        .asset-num {
          height:56px;
          font-size: 16px;
          color: #B2B2B2;
          font-weight: bold;
          .success-text {
            color: $--color-success;
          }
          .primary-text {
            color: $--color-primary;
          }
          .large-text {
            font-size: 24px;
          }
          .small-text{
            font-weight: normal;
            font-size:12px;
          }
        }
      }
    }
    .asset-list {
      padding-bottom: 60px;
      .filter {
        margin: 20px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-input {
          width: 180px;
        }
        .common-check-box {
          color: #B2B2B2;
        }
      }
    }
  }
  #app{
    .my-assets {
      .filter {
        ::-webkit-input-placeholder { /*WebKit browsers*/
         font-family: PingFang-SC-Regular;
        }
        ::-moz-placeholder { /*Mozilla Firefox*/
          font-family: PingFang-SC-Regular;
        }
        :-moz-placeholder { /*Mozilla Firefox*/
          font-family: PingFang-SC-Regular;
        }
        :-ms-input-placeholder { /*Internet Explorer*/
          font-family: PingFang-SC-Regular;
        }
        .el-input__inner{
          padding-left:30px;
        }
        .el-input__prefix {
          left: 8px;
          top: -1px;
          i {
            color: #B2B2B2;
          }
        }
      }
    }
  }

  .page-container {
    width: 100%;
    background-color: #fff;
    text-align: center;
    height: 60px;
    border-radius: 0 0 4px 4px;
    padding: 14px 0;
    box-sizing: border-box;
  }

  .azex-common-table {
    border-radius: 4px 4px 0 0;
    tr {
      height: 50px;
      box-shadow: 0px 1px 0px 0px rgba(229, 229, 229, 1);
      th {
        background-color: #EAEAEA;
        color: #888;
        border: none;
        font-weight: normal;
        font-family: PingFang-SC-Regular;
      }
      td {
        color: #555;
        &.primary-text {
          color: $--color-primary;
        }
      }
      .cell {
        padding: 0 20px;
      }
      th,td{
        &:last-child{
          .cell{
            padding-left:6px;
          }
        }
      }
    }
    .el-button+.el-button{
      margin-left:3px;
    }
    .el-table__body {
      tr:nth-child(even) {
        background-color: #FAFAFA;
      }
      tr:hover td {
        background: #F5F5F5;
      }
      .operate-btn {
        button {
          font-size: 12px;
          padding: 8px 12px;
        }
      }
    }
  }
</style>
