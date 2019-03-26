<template>
  <div class="get-out-cash">
    <el-dialog :visible.sync="dialogVisible" width="400px" center top="0" :closeOnClickModal="false">
      <p class="dialogTitle">{{currentUnit}}{{ $t("getOutCash.getCash") }} </p>

      <div>
        <span class="label">{{ $t("getOutCash.CashCanGet") }}</span>
        <span class="all-get-cash all-cash">{{canUserCash}}</span>
        <span class="current-unit all-cash"> {{currentUnit}} </span>
      </div>
      <p class="label">{{ $t("getOutCash.getCashAdress") }}
        <span class="adress saveadress" v-if="saveAdressSync" @click="saveNewAdress">{{ $t("getOutCash.saveToAdressList") }}</span>
      </p>
      <!-- <span v-if="saveAdressSync" class="adress">{{ $t("getOutCash.checkNewAdress") }}&nbsp;</span> -->
      <el-select class="selectAdress" :no-match-text="$t('getOutCash.noAdressNow')"
                 :no-data-text="$t('getOutCash.noAdressNow')" v-model="selectCurrentCash" filterable
                 :placeholder="$t('getOutCash.chose')" style="width:340px;" :filter-method="searchAdress">
        <el-option v-for="item in allAdress" :key="item.address" :label="item.address" :value="item.address">
          {{item.tag}}
        </el-option>
      </el-select>
      <p class="label">{{ $t("getOutCash.currencyNumber") }}<span class="nowNumberLast">{{ $t("getOutCash.currentMinimumAmount") }}{{current.withdrawlOnceMin}} {{currentUnit}}</span>
      </p>
      <div class="currentNumber">
        <!-- <el-input type="text" v-model="currentNumber"></el-input> -->
        <!-- @keyup.native="getwithCurnFn" -->
        <input type="text" :placeholder="$t('getOutCash.enterCurrencyNumber')" v-model="currentNumber" class="inputs"/>
        <span>{{currentUnit}}</span>
      </div>
      <p class="label" v-if="remarkAsync">{{ $t("getOutCash.remarks") }}</p>
      <el-input v-if="remarkAsync" :placeholder="$t('getOutCash.enterContent')" v-model="remarks" style="width:340px;">
      </el-input>
      <p class="label">{{ $t("getOutCash.formalities") }}
        <span style="color:#333333;">&nbsp;{{current.withdrawlFixedfee}} </span>
        <span>{{current.withdrawlCurrency}} &nbsp;</span>
        <span class="speed-change" @click="openSpeedFn" style="display:none;">
                <i class="iconfont icon-lightningbshandian" :class="speed.speedIconColor"></i>
                <span>{{speed.speedMess}}</span>
            </span>
      </p>
      <p class="label" style="text-align:center;color:#B2B2B2;" v-if="toBuy">{{ $t("getOutCash.moneyNotEnough") }}
        <span class="chargeCash">&nbsp;{{ $t("getOutCash.bug") }} </span>{{ $t("getOutCash.or") }}
        <span class="chargeCash">{{ $t("getOutCash.charge") }}&nbsp; <span>{{current.withdrawlCurrency}}</span></span>
      </p>
      <p class="label">{{ $t("getOutCash.accountsNumber") }}
        <span style="color:#333333;">&nbsp;{{current.getaccountCash}} </span>
        <span>{{currentUnit}} &nbsp;</span>
      </p>
      <el-button type="primary" @click="next" class="nextBtn">{{ $t("getOutCash.next") }}</el-button>
      <p class="footerTitle">
        {{ $t("getOutCash.explain") }}
      </p>
    </el-dialog>

    <add-get-cash-adress @toaddCashAdress="getAdress" ref="toaddCashAdress"></add-get-cash-adress>
    <speed-up @getSpeedChild="getSpeedChild" ref="tospeedUp"></speed-up>
    <get-cash-to-password ref="topassword" @getCashSuccess="getCashSuccess"></get-cash-to-password>
  </div>
</template>

<script>
  //提币窗口
  import api from '../../../libs/api'
  import util from '../../../libs/util'
  import AddGetCashAdress from './addGetCashAdress'
  import SpeedUp from './speedUp'
  import GetCashToPassword from './getCashToPassword'
  import {Decimal} from 'decimal.js';

  export default {
    components: {
      'add-get-cash-adress': AddGetCashAdress,
      'speed-up': SpeedUp,
      'get-cash-to-password': GetCashToPassword
    },
    data() {
      return {
        dialogVisible: false,
        saveAdressSync: false,
        remarkAsync: false,
        toBuy: false,
        speed: {
          speedIconColor: "speedIconColor1",
          speedMess: this.$t("getOutCash.getCashAddSpeed"),
        },
        canUserCash: "",//可用金额
        currentUnit: "",// 可用金额的单位
        selectCurrentCash: "",//下拉选项中有的，且被选中的地址
        selectNoAdress: "",
        allAdress: [],//所有的地址
        allAdress2: [],//所有的地址
        // novalue:"",
        currentNumber: "",//提币数量
        remarks: "",//备注码
        current: {
          withdrawlOnceMin: "",//最小提币数量 withdrawlOnceMin
          withdrawlFixedfee: "0",//手续费
          withdrawlCurrency: "",//手续费币种
          getaccountCash: "0",//到账金额
          withdrawlPrecision: "",//提现精度
        },
        withdrawlCash: "",//手续费所在币种的总金额，判断是否需要购买
        toBtc: "",
      }
    },
    mounted() {
      //this.getAdress();
    },
    watch: {
      currentNumber(val, oldVal) {//提币数量 变化导致 到账数量 变化
        // 到账数量 = 提币金额 - 手续费  （手续费币种 = 提现币种）
        // 到账数量 = 提币金额  （手续费币种 ≠ 提现币种）
        if (val == "") {
          this.current.getaccountCash = 0;
        } else if ((/^[0-9]+\.[0-9]+$/.test(val) == false && /^[0-9]+$/.test(val) == false && /^[0-9]+\.$/.test(val) == false) || this.howManyPoint(val) > this.current.withdrawlPrecision) {//正则判断不可用字符 //或大于精度值
          this.currentNumber = oldVal;
        } else if (parseInt(val).toString().length > 16) {
          this.currentNumber = oldVal;
        } else {
          if (this.current.withdrawlCurrency.toUpperCase() == this.currentUnit.toUpperCase()) {//手续费币种和提现币种相同
            // console.log(val - this.current.withdrawlFixedfee)
            let x = new Decimal(val);
            if (x.minus(this.current.withdrawlFixedfee).toString() > 0) {
              this.current.getaccountCash = x.minus(this.current.withdrawlFixedfee).toString();//到账数量
            } else {
              this.current.getaccountCash = 0;
            }
            // this.current.getaccountCash = val - this.current.withdrawlFixedfee;
          } else {//手续费币种和提现币种不同
            this.current.getaccountCash = val;
          }
        }
      }
    },
    methods: {
      init(par) {

        console.log(par, 99999);
        this.toBtc = par.toBtc;
        this.dialogVisible = true;
        this.selectCurrentCash = "";
        this.selectNoAdress = "";
        this.currentNumber = "";
        this.remarks = "";
        this.saveAdressSync = false;

        this.remarkAsync = par.isEspecial;
        this.canUserCash = par.balance;
        this.currentUnit = par.currency.toUpperCase();
        this.current.getaccountCash = 0;
        this.getCurrentMessage(par.currency);
        //   this.getwithCurnFn();
        this.getAdress();

      },
      getCurrentMessage(id) {//获取币种信息  //获取最小提币数量 //获取手续费，手续费币种 提现精度 withdrawlPrecision
        let par = {
          "id": id
        }
        api.post('/Currency/GetCurrencyWithdrawlInfo', par).then((res) => {
          this.current.withdrawlOnceMin = res.data.value.withdrawlOnceMin;//最小提币数量
          this.current.withdrawlFixedfee = res.data.value.withdrawlFixedfee;//手续费
          this.current.withdrawlCurrency = res.data.value.withdrawlCurrency.toUpperCase();//手续费币种
          this.current.withdrawlPrecision = res.data.value.withdrawlPrecision;//提现精度
          this.notEnough();
        }).catch((err) => {
          console.log("err");
        })
      },
      howManyPoint(n) {//判断有多少位小数点
        return n.toString().split(".")[1] ? n.toString().split(".")[1].length : 0;
      },
      notEnough() {//判断手续费多少， 资金是否需要购买
        let par = {
          "currency": this.current.withdrawlCurrency.toLowerCase(),
          "pageIndex": 1,
          "pageSize": 1
        }
        api.post('/User/GetAssetPageList', par).then((res) => {
          // console.log(res);
          this.withdrawlCash = res.data.value.items[0].balance ? res.data.value.items[0].balance : 0;
          if (this.withdrawlCash < this.current.withdrawlFixedfee) { //所拥有的金额不够手续费
            this.toBuy = true;
          } else {
            this.toBuy = false;
          }

        }).catch((err) => {
          console.log("err");
        })
      },
      getAdress() {//获取币种地址
        this.saveAdressSync = false;
        // this.selectCurrentCash="";//下拉选项中有的，且被选中的地址
        this.selectNoAdress = "";
        let par = {
          currency: this.currentUnit.toLowerCase()
        }

        api.post('/User/GetWithdrawlAddresses', par).then((res) => {
          // console.log(res);
          this.allAdress = res.data.value;
          this.allAdress2 = res.data.value;
        }).catch((err) => {
          console.log("err");
        })

      },
      searchAdress(val) {
        this.selectNoAdress = val;//输入的搜索值
        this.selectCurrentCash = val;
        this.allAdress = [];
        let serchLength = val.length;

        if (serchLength == 0) {
          this.allAdress = this.allAdress2;
        } else {
          for (let i = 0; i < this.allAdress2.length; i++) {
            if (this.allAdress2[i].address == val) {
              this.allAdress.push(this.allAdress2[i]);
            }
          }
        }

        if (val.replace(/(^\s*)|(\s*$)/g, "").length > 2) {//输入的字符串大于3位的时候，判断是否存在，如果不存在，可添加该地址
          let index = 0;
          for (let i = 0; i < this.allAdress2.length; i++) {
            if (this.allAdress2[i].address == val) {
              index = 1;
            }
          }
          if (index == 0) {//没有相同的
            this.saveAdressSync = true;
          } else {//存在相同的
            this.saveAdressSync = false;
          }
        } else {
          this.saveAdressSync = false;
        }
      },
      ///////存储新的提现地址////////////////
      saveNewAdress() {
        if (/^[0-9a-zA-Z]*$/.test(this.selectNoAdress) == false) {
          this.$message({showClose: true, message: this.$t("getOutCash.currencyJustNumberAZ"), type: 'error'});
        } else if (/^[0-9a-zA-Z]*$/.test(this.remarks) == false) {
          this.$message({showClose: true, message: this.$t("getOutCash.remarksJustNumberAZ"), type: 'error'});
        } else {
          let par = {};
          // console.log(this.remarkAsync);
          if (this.remarkAsync == false) {//不是特殊币种，没有备注码
            par = {
              adress: this.selectNoAdress,
              remarks: "**",//不是特殊币种，没有备注码
              currency: this.currentUnit.toLowerCase()
            }
          } else {
            par = {
              adress: this.selectNoAdress,
              remarks: this.remarks,
              currency: this.currentUnit.toLowerCase()
            }
            // console.log(par);
          }
          this.$refs.toaddCashAdress.init(par);
        }
      },
      //////////////控制体现速度开始////////////////////////////
      openSpeedFn() {
        let par = {
          number: this.current.withdrawlFixedfee,//手续费
          unit: this.current.withdrawlCurrency,//单位
          speed: this.speed.speedIconColor//进度
        }
        this.$refs.tospeedUp.init(par);
      },
      getSpeedChild(val) {
        //   console.log(val);
        if (val.backSpeed == 1) {
          this.speed.speedIconColor = "speedIconColor1";
        } else if (val.backSpeed == 2) {
          this.speed.speedIconColor = "speedIconColor2";
        } else if (val.backSpeed == 3) {
          this.speed.speedIconColor = "speedIconColor3";
        }
        this.current.withdrawlFixedfee = val.withdrawl;
        if (this.withdrawlCash < this.current.withdrawlFixedfee) { //所拥有的金额不够手续费
          this.toBuy = true;
        } else {
          this.toBuy = false;
        }

        if (this.current.withdrawlCurrency.toUpperCase() == this.currentUnit.toUpperCase()) {//手续费币种和提现币种相同
          this.currentNumber = this.currentNumber ? this.currentNumber : 0;
          let x = new Decimal(this.currentNumber);
          if (x.minus(this.current.withdrawlFixedfee).toString() > 0) {//数量-手续费
            this.current.getaccountCash = x.minus(this.current.withdrawlFixedfee).toString();//到账数量
          } else {
            this.current.getaccountCash = 0;
          }
          // this.current.getaccountCash = val - this.current.withdrawlFixedfee;
        } else {//手续费币种和提现币种不同
          this.current.getaccountCash = this.currentNumber;
        }
      },
      //////////////////控制体现速度结束/////////////////////////
      next() {
        if (/(^[0-9]+\.$)/.test(this.currentNumber)) {
          this.$message({showClose: true, message: this.$t("getOutCash.enterSureCurrencyNum"), type: 'error'});
        } else if (this.selectCurrentCash.replace(/(^\s*)|(\s*$)/g, "") == "") {
          this.$message({showClose: true, message: this.$t("getOutCash.currencyNotEmpty"), type: 'error'});
        } else if (this.currentNumber.replace(/(^\s*)|(\s*$)/g, "") == "") {
          this.$message({showClose: true, message: this.$t("getOutCash.CurrencyNumNotEmpty"), type: 'error'});
        } else if (parseFloat(this.currentNumber) < parseFloat(this.current.withdrawlOnceMin)) {//
          this.$message({showClose: true, message: this.$t("getOutCash.CurrencyLowerSmallst"), type: 'error'});
        } else if (parseFloat(this.currentNumber) > parseFloat(this.canUserCash)) {
          this.$message({showClose: true, message: this.$t("getOutCash.currencyNotLarger"), type: 'error'});
        } else if (this.current.getaccountCash == 0) {
          this.$message({showClose: true, message: this.$t("getOutCash.getaccountCashNotZero"), type: 'error'});
        } else {

          if (this.withdrawlCash < this.current.withdrawlFixedfee) { //所拥有的金额不够手续费
            this.$message({showClose: true, message: this.$t("getOutCash.cashNoToBug"), type: 'error'});
          } else {
            if (this.remarkAsync == false) {
              this.todetail();
            } else if (this.remarkAsync == true) {
              if (this.remarks.replace(/(^\s*)|(\s*$)/g, "") == "") {
                this.$message({showClose: true, message: this.$t("getOutCash.remarkEmpty"), type: 'error'});
              } else {
                this.todetail();
              }
            }
          }
        }
      },
      async todetail() {
        let remarks = 0;
        //this.remarkAsync = false;
        if (this.remarkAsync == false) {
          remarks = "**";
        } else {
          remarks = this.remarks;
        }

        let speed = 1;
        if (this.speed.speedIconColor == "speedIconColor1") {
          speed = 1;
        } else if (this.speed.speedIconColor == "speedIconColor2") {
          speed = 2;
        } else if (this.speed.speedIconColor == "speedIconColor3") {
          speed = 3;
        }
        // console.log("speed"+speed);
        let par = {
          adress: this.selectCurrentCash,//提币地址
          feeTimes: speed,//手续费倍数
          remark: remarks,//备注码
          getCashNumber: this.currentNumber,//提币数量
          units: this.currentUnit,//提币单位
          withdrawlFixedfee: this.current.withdrawlFixedfee,//手续费用
          withdrawlCurrency: this.current.withdrawlCurrency,//手续费单位
          endGetNumber: this.current.getaccountCash,//到账数量

        }
        let b = new Decimal(this.currentNumber);
        let toBtcCash = b.times(this.toBtc).toString(); //提币数量全部转成btc
        api.post('/User/GetUserWithdrawalLimit').then((data) => {//获取币种的今日提币额度判断
          if (toBtcCash > data.data.value.surplusVolume) {//提币数量超过当日提币额度
            this.$message({showClose: true, message: this.$t("getOutCash.amountMoreToday"), type: 'error'});
          } else {
            this.dialogVisible = false;
            this.$refs.topassword.init(par);
          }
        }).catch((err) => {
          console.log("err1");
        })
      },
      getCashSuccess() {
        this.$emit("getCashSuccess");
      }

    }
  }
</script>

<style lang="scss" type="text/scss" scoped>

  .inputs {
    width: 100%;
    height: 40px;
    border: 1px solid #EAEAEA;
    border-radius: 4px;
    text-indent: 8px;
    color: rgba(136, 136, 136, 1);
    background: rgba(245, 245, 245, 1);
    &:focus {
      outline: none;
    }
  }

  .get-out-cash {
    width: 400px;
    font-family: PingFang-SC-Medium;
    .dialogTitle {
      position: absolute;
      width: 100%;
      top: 10px;
      left: 0;
      text-align: center;
      z-index: -1;
      font-size: 16px;
      color: #333333;
    }
    .label {
      font-size: 12px;
      color: #888888;
      margin-top: 15px;
    }
    .all-cash {
      color: #C9933E;
      font-size: 14px;
      margin-left: 5px;
    }
    .all-get-cash {
      margin-left: 5px;
    }
    .adress {
      float: right;
      font-size: 12px;
      color: #B2B2B2;
    }
    .saveadress {
      color: #C9933E;
      cursor: pointer;
      margin-right: 12px;
      &:hover {
        text-decoration: underline;
      }
    }
    .currentNumber {
      position: relative;
      width: 340px;
      span {
        position: absolute;
        right: 10px;
        top: 7px;
        color: #B2B2B2;

      }
    }
    .nowNumberLast {
      color: #B2B2B2;
      font-size: 12px;
      float: right;
      margin-right: 12px;
    }
    // .chargeCash{
    // color:#C9933E;
    // cursor: pointer;
    // &:hover{
    //     text-decoration: underline;
    // }
    // }
    .nextBtn {
      width: 340px;
      margin-top: 20px;
    }
    .speed-change {
      float: right;
      margin-right: 12px;
      color: #C9933E;
      font-size: 12px;
      cursor: pointer;
      span {
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .speedIconColor1 {
      color: #C9933E;
    }
    .speedIconColor2 {
      color: #FFAB20;
    }
    .speedIconColor3 {
      color: $--color-danger;
    }
    .footerTitle {
      color: #B2B2B2;
      font-size: 12px;
      margin-top: 20px;
    }
    // .currentNumber .el-input-group__append{
    //     background:#EAEAEA;
    // }
    // .currentNumber .el-input__inner{
    //     border-right:none;
    // }

  }
</style>

<style>
  .el-popper[x-placement^="bottom"] .popper__arrow {
    top: -10000px !important;
  }

  .el-select-dropdown__empty {
    font-size: 12px !important;
    height: 140px;
    line-height: 97px;
  }
</style>

