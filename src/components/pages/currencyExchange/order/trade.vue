<template>
  <div class="trade-box">
    <div class="tradtop">
      <ul class="tabBox pingFangSC-regular">
        <li :class="{active:activeName=='1'}" @click="clickTabFn('1')">{{$t("trade.limitList")}}</li>
        <li :class="{active:activeName=='2'}" @click="clickTabFn('2')">{{$t("trade.marketPriceList")}}</li>
        <li :class="{active:activeName=='3'}" @click="clickTabFn('3')">{{$t("trade.stopLossStopLoss")}}</li>
        <!-- <li :class="{active:activeName=='3'}" @click="clickTabFn('3')">{{$t("trade.riseAndStop")}}</li>
        <li :class="{active:activeName=='4'}" @click="clickTabFn('4')">{{$t("trade.bottomStopLoss")}}</li> -->
      </ul>
      <div class="iconBox">
        <i class="iconfont icon-az-icon-question iconQuestion"></i>
        <i class="iconfont icon-az-icon-caret-bottom iconDown"></i>
        <div class="toolTip">
          {{$t("trade.iconTitle")}}
        </div>
      </div>
      <div class="tabRight" style="display:none;">
        <span>{{$t("trade.serviceCharge")}}&nbsp;</span><span>{{change}}%&nbsp;</span><!-- {{serviceCharge*100}} -->
        <span><el-checkbox v-model="deductionSelect" @change="changeServiceCharge"></el-checkbox></span>
        <span>{{$t("trade.useAZOffset")}} 30%&nbsp;</span><!-- {{howServiceCharge*100}} -->
      </div>
    </div>
    <div class="cashtradeBox">
      <div class="cashtradeBoxLeft eachcashtrade">
        <div class="cashHeader">
          <span class="cashtitt openSans">{{currencys.sellCurrency}}&nbsp;&nbsp;{{$t("trade.canUser")}} &nbsp;</span>
          <span class="allCash openSans">&nbsp;{{currencys.sellcanUser}}</span>
          <span class="charge" @click="toCharge">{{$t("trade.charge")}}</span>

        </div>
        <div class="price" :class="{borderBottomRadius:borderBottomRadius}"><!-- 买入价 -->
          <span class="span1">{{buy.priceMess}}</span>
          <input type="text" v-model="buyPrice" :placeholder="buy.priceHolder" :disabled="buy.disables"
                 @focus="focuseFn" @keydown="focuseFn"/>
          <span class="span2">{{currencys.sellCurrency}}</span>
        </div>
        <div class="aboutPrice pingFangSC-regular" v-if="heightAsync"><!-- 约等于-->
          <span v-if="together.aboutPriceAsync">≈{{aboutCashUnit}}&nbsp;{{buy.aboutCash}}</span>
        </div>
        <div class="price" v-if="together.entrustPriceAsync" :class="{borderTopRadius:borderTopRadius}"><!-- 委托价 -->
          <span class="span1">{{buy.entrust}}</span>
          <input type="text" v-model="buyEntrustPrice" @focus="focuseFn" @keydown="focuseFn"/>
          <span class="span2">{{currencys.sellCurrency}}</span>
        </div>
        <div class="price" style="margin-top:12px;"><!-- 买入量 -->
          <span class="span1">{{buy.number}}</span>
          <input type="text" v-model="buynumber" @focus="focuseFn" @keydown="focuseFn"/>
          <span class="span2">{{buy.buycurrency}}</span>
        </div>
        <div class="buySider buySider1"><!-- 滑块 -->
          <ul>
            <li class="li1"></li>
            <li class="li2" :class="{buyBg:bugerBg.bg1}"></li>
            <li class="li3" :class="{buyBg:bugerBg.bg2}"></li>
            <li class="li4" :class="{buyBg:bugerBg.bg3}"></li>
            <li class="li5" :class="{buyBg:bugerBg.bg4}"></li>
          </ul>
          <el-slider v-model="buySlideNumber" @change="changeSlide1" :show-tooltip="false"></el-slider><!-- 滑块 -->
          <div style="width:100%;font-size:12px;margin-top:-2px;color:#929AA8;">
            <span style="float:left;">0&nbsp;{{buy.buycurrency}} </span>
            <span style="float:right;">{{buy.canUser}}&nbsp;{{buy.buycurrency}} </span>
          </div>
        </div>

        <!-- 总金额 -->
        <div class="addAllCash pingFangSC-regular" v-if="together.allCashAsync">
          <span>{{$t("trade.allCash")}}</span>
          <span>&nbsp;{{buy.buyAllCash}}&nbsp;{{currencys.sellCurrency}}</span>
        </div>
        <!-- 购买按钮 -->
        <el-button type="success" class="buyButton" :loading="buyLoading" @click="buyFn">{{$t("trade.buyIn")}}&nbsp;&nbsp;{{currencys.buyCurrency}}</el-button>
      </div>
      <!-- <div class="verLine"></div> -->
      <!-- 卖 -->
      <div class="cashtradeBoxRight eachcashtrade">
        <div class="cashHeader">
          <!-- <span class="spanright1">{{sell.title}}{{currencys.buyCurrency}}</span> -->
          <span class="cashtitt openSans">{{currencys.buyCurrency}}&nbsp;&nbsp;{{$t("trade.canUser")}}&nbsp;</span>
          <span class="allCash openSans">&nbsp;{{currencys.buycanUser}}</span>
          <span class="charge" @click="toCharge">{{$t("trade.charge")}}</span>

        </div>
        <div class="price" :class="{borderBottomRadius:borderBottomRadius}"><!-- 卖出价 -->
          <span class="span1">{{sell.priceMess}}</span>
          <input type="text" v-model="sellPrice" :placeholder="sell.priceHolder" :disabled="sell.disables"
                 @focus="focuseFn" @keydown="focuseFn"/>
          <span class="span2">{{currencys.sellCurrency}}</span>
        </div>
        <div class="aboutPrice pingFangSC-regular" v-if="heightAsync"><!-- 约等于-->
          <span v-if="together.aboutPriceAsync"> ≈{{aboutCashUnit}}&nbsp;{{sell.aboutCash}}</span>
        </div>
        <div class="price" v-if="together.entrustPriceAsync" :class="{borderTopRadius:borderTopRadius}"><!-- 委托价 -->
          <span class="span1">{{sell.entrust}}</span>
          <input type="text" v-model="sellEntrustPrice" @focus="focuseFn" @keydown="focuseFn"/>
          <span class="span2">{{currencys.sellCurrency}}</span>
        </div>
        <div class="price" style="margin-top:12px;"><!-- 数量 -->
          <span class="span1">{{sell.number}}</span>
          <input type="text" v-model="sellnumber" @focus="focuseFn" @keydown="focuseFn"/>
          <span class="span2">{{currencys.buyCurrency}}</span>
        </div>
        <div class="buySider buySider2"><!-- 滑块 -->
          <ul>
            <li class="li1"></li>
            <li class="li2" :class="{sellBg:sellerBg.bg1}"></li>
            <li class="li3" :class="{sellBg:sellerBg.bg2}"></li>
            <li class="li4" :class="{sellBg:sellerBg.bg3}"></li>
            <li class="li5" @click="sellLiFn" :class="{sellBg:sellerBg.bg4}"></li>
          </ul>
          <el-slider v-model="sellSlideNumber" @change="changeSlide2" :show-tooltip="false"></el-slider><!-- 滑块 -->
          <div style="width:100%;font-size:12px;margin-top:-5px;color:#929AA8;">
            <span style="float:left;">0&nbsp;{{currencys.buyCurrency}} </span>
            <span style="float:right;">{{sell.canUser}}&nbsp;{{currencys.buyCurrency}} </span>
          </div>
        </div>

        <!-- 总金额 -->
        <div class="addAllCash pingFangSC-regular" v-if="together.allCashAsync">
          <span>{{$t("trade.allCash")}}</span><span>&nbsp;{{sell.buyAllCash}}&nbsp;{{currencys.sellCurrency}}</span>
        </div>
        <!-- 购买按钮 -->
        <el-button type="danger" class="buyButton" :loading="sellLoading" @click="sellFn">{{$t("trade.sellOut")}}&nbsp;&nbsp;{{currencys.buyCurrency}}</el-button>
      </div>
    </div>
    <!-- <div class="not-login-box" v-if="!isLogin">
          <div class="shadowBg"></div>

      </div> -->
    <el-button type="success" v-if="!isLogin" class="loginButton loginButton1" @click="toLogin">
      {{$t("trade.loginNow")}}
    </el-button>
    <el-button type="danger" v-if="!isLogin" class="loginButton loginButton2" @click="toLogin">
      {{$t("trade.loginNow")}}
    </el-button>

    <dialog-wing ref="dialogWing" @dialogWing="dialogWingFn"></dialog-wing>
    <dialog-just-ok ref="dialogJustOk"></dialog-just-ok>
  </div>
</template>

<script>
  import api from '../../../../libs/api'
  import {Decimal} from 'decimal.js';
  import util from "../../../../libs/util";
  import dialogWing from "../../../common/dialogWing";
  import dialogJustOk from "../../../common/dialogJustOk";

  export default {
    components: {
      dialogWing,
      dialogJustOk
    },
    name: 'trade-box',
    props: ["trade"],
    data() {
      return {
        PlanOrderType: 1,//追涨 高价触发，低价触发
        borderBottomRadius: false,
        borderTopRadius: false,
        heightAsync: true,//约等于的高度固定
        isTrue: true,
        isFalse: false,
        change: "0.2",//暂时用的，后来上线会变化
        sellLoading: false,
        buyLoading: false,
        currencys: {
          buyCurrency: "",//"ETH",//买的币种(苹果)  BTC / USDT  用 USDT(钱) 来购买 BTC(苹果)
          buycanUser: "0",//买的币种可用费用
          sellCurrency: "",//"BTC",//自己的钱
          sellcanUser: "0",//自己的钱可用费用
        },
        /////////六个表单的绑定值////////////
        buyPrice: "",//买入价 触发价
        buyEntrustPrice: "",//买的委托价
        buynumber: "",//买入量
        sellPrice: "",//卖出价 触发价
        sellEntrustPrice: "",//卖的委托价
        sellnumber: "",//卖出量
        ///////////////////
        activeName: "1",
        serviceCharge: "0.2",//手续费
        deductionSelect: true,//是否使用手续费抵扣
        howServiceCharge: "50",//手续费抵扣率是多少
        lastCashMoney: 0,//下单最小金额
        accuracy: "",//价格精度，多少位小数
        volumePrecision: "",//数量精度
        //balance 余额
        bugerBg: {
          bg1: false,
          bg2: false,
          bg3: false,
          bg4: false,
        },
        sellerBg: {
          bg1: false,
          bg2: false,
          bg3: false,
          bg4: false,
        },
        aboutCashUnit: "",//法币单位 约等于
        buy: {
          title: this.$t("trade.limitBuyIn"),
          priceMess: this.$t("trade.buyPriceIn"),//买入价
          entrust: this.$t("trade.entrustmentPrice"),//委托价
          number: this.$t("trade.buyInNumber"),//数量
          numberUnit: "",//买入量的单位
          buyAllCash: "0.00000000",//总金额
          canUser: "0",//滑动条最大的值
          buycurrency: "",//滑动条的单位
          aboutCash: "0",//约等于
          disables: false,//买入价被禁止
          priceHolder: "",

        },
        buySlideNumber: 0,//买入的滑动值
        sell: {
          title: this.$t("trade.limitSellOut"),
          priceMess: this.$t("trade.sellPriceOut"),//卖出价
          entrust: this.$t("trade.entrustmentPrice"),//委托价
          number: this.$t("trade.sellOutNumber"),//数量
          buyAllCash: "0.00000000",//总金额
          canUser: "0",//滑动条最大的值
          aboutCash: "0",//约等于
          disables: false,//卖出价被禁止
          priceHolder: "",
        },
        sellSlideNumber: 0,//卖出的滑动值
        together: {
          aboutPriceAsync: true,//法币是否显示
          entrustPriceAsync: false,//委托价是否显示
          allCashAsync: false,//总金额的显示
        },
        buyexchangeLegal: "",//货币转换成法币的转换率
        focuseAsync: false,
        newPriceto: "",//最新价格/用买卖止盈止损的
      }
    },
    watch: {
      buySlideNumber(val, oldVal) {
        if ((val > 0 && val < 25) || val == 0) {
          this.bugerBg = {
            bg1: false,
            bg2: false,
            bg3: false,
            bg4: false,
          }
        } else if ((val > 25 && val < 50) || val == 25) {
          this.bugerBg = {
            bg1: true,
            bg2: false,
            bg3: false,
            bg4: false,
          }
        } else if ((val > 50 && val < 75) || val == 50) {
          this.bugerBg = {
            bg1: true,
            bg2: true,
            bg3: false,
            bg4: false,
          }
        } else if ((val > 75 && val < 100) || val == 75) {
          this.bugerBg = {
            bg1: true,
            bg2: true,
            bg3: true,
            bg4: false,
          }
        } else if (val == 100) {
          this.bugerBg = {
            bg1: true,
            bg2: true,
            bg3: true,
            bg4: true,
          }
        }

      },
      sellSlideNumber(val, oldVal) {
        if (val == oldVal) {
          return;
        }
        if ((val > 0 && val < 25) || val == 0) {
          this.sellerBg = {
            bg1: false,
            bg2: false,
            bg3: false,
            bg4: false,
          }
        } else if ((val > 25 && val < 50) || val == 25) {
          this.sellerBg = {
            bg1: true,
            bg2: false,
            bg3: false,
            bg4: false,
          }
        } else if ((val > 50 && val < 75) || val == 50) {
          this.sellerBg = {
            bg1: true,
            bg2: true,
            bg3: false,
            bg4: false,
          }
        } else if ((val > 75 && val < 100) || val == 75) {
          this.sellerBg = {
            bg1: true,
            bg2: true,
            bg3: true,
            bg4: false,
          }
        } else if (val == 100) {
          this.sellerBg = {
            bg1: true,
            bg2: true,
            bg3: true,
            bg4: true,
          }
        }
      },
      // getCoin(val, oldVal){//监听法币 法币切换  法币汇率会跟着变化
      //     if(val==oldVal){
      //         return;
      //     }
      //     // 法币跟着切换
      //     this.aboutCashUnit = this.$store.state.dict.coinSymbolList[val];
      // },
      buyPrice(val, oldVal) {//监听买入价
        if (this.focuseAsync == false) {
          return;
        }
        if (this.activeName == 1) {//判断tab为第一个
          if (val == "") {
            this.buy.aboutCash = "0.00";
            this.buy.canUser = "0";
            this.buySlideNumber = 0;
          } else {
            if (/^[0-9]+\.?[0-9]{0,}$|^\.[0-9]+$/.test(val) == false
              || this.howManyPoint(val) > this.accuracy) {//正则判断不可用字符或大于精度值
              this.buyPrice = oldVal;
            } else if (parseInt(val).toString().length > 16) {
              this.buyPrice = oldVal;
            } else {
              this.buy.aboutCash = this.numberTwo(val * this.buyexchangeLegal);//法币
              if (val == 0) {
                this.buy.canUser = 0;
              } else {
                let a = new Decimal(this.currencys.sellcanUser);
                a = a.dividedBy(this.buyPrice).toString();
                this.buy.canUser = util.toFixed(a, this.volumePrecision) ? util.toFixed(a, this.volumePrecision) : 0;
                //util.toFixed(a,this.volumePrecision)?util.toFixed(a,this.volumePrecision):0;//总量
              }
              if (this.buynumber == "" || this.buynumber == 0) {//判断买入量
                this.buy.buyAllCash = "0.00000000";
                this.buySlideNumber = 0;
              } else {
                // console.log(val*this.buynumber);
                let x = new Decimal(val);
                let y = new Decimal(this.buynumber);
                x = x.times(y).toFixed().toString();
                this.buy.buyAllCash = util.toFixed(x, 8);

                if (Number(this.buynumber) > Number(this.buy.canUser)) {//判断 买入量 > 总量
                  this.buySlideNumber = 100;
                } else {
                  if (this.buynumber * 100 / this.buy.canUser < 1) {
                    this.buySlideNumber = 0;
                  } else {
                    this.buySlideNumber = parseInt(this.buynumber * 100 / this.buy.canUser); //滑块的变化
                  }
                }
              }
            }

          }
        } else {//判断不是第一个tab的
          if (val == "") {
          } else if ((/^[0-9]+\.[0-9]+$/.test(val) == false && /^[0-9]+$/.test(val) == false && /^[0-9]+\.$/.test(val) == false) || this.howManyPoint(val) > this.accuracy) {//正则判断不可用字符或大于精度值
            this.buyPrice = oldVal;
          } else if (parseInt(val).toString().length > 16) {
            this.buyPrice = oldVal;
          }
        }
      },
      sellPrice(val, oldVal) {//监听卖出价
        if (this.focuseAsync == false) {
          return;
        }
        if (this.activeName == 1) {//判断tab为第一个
          if (val == "") {
            this.sell.aboutCash = "0.00";
            // this.sell.canUser = "0";
            this.sellSlideNumber = 0;
          } else {
            if (/^[0-9]+\.?[0-9]{0,}$|^\.[0-9]+$/.test(val) == false || this.howManyPoint(val) > this.accuracy) {//正则判断不可用字符或大于精度值
              this.sellPrice = oldVal;
            } else if (parseInt(val).toString().length > 16) {
              this.sellPrice = oldVal;
            } else {
              this.sell.aboutCash = this.numberTwo(val * this.buyexchangeLegal);//法币
              // if(this.sellPrice == 0){
              //     this.sell.canUser = 0;
              // }else{
              //     let a = new Decimal(this.currencys.buycanUser);
              //     a = a.dividedBy(this.sellPrice).toString();
              //     this.sell.canUser = util.toFixed(a,this.volumePrecision)?util.toFixed(a,this.volumePrecision):0;//总量
              // }
              if (this.sellnumber == "" || this.sellnumber == 0) {//判断卖出量
                this.sell.buyAllCash = "0.00000000";//总金额
                this.sellSlideNumber = 0;
              } else {
                let x = new Decimal(val);
                let y = new Decimal(this.sellnumber);
                x = x.times(y).toFixed().toString();
                this.sell.buyAllCash = util.toFixed(x, 8);
                //this.sell.buyAllCash = util.toFixed(val*this.sellnumber,8); //总金额

                if (Number(this.sellnumber) > Number(this.sell.canUser)) {//判断 买入量 > 总量
                  this.sellSlideNumber = 100;
                } else {
                  if (this.sellnumber * 100 / this.sell.canUser < 1) {
                    this.sellSlideNumber = 0;
                  } else {
                    this.sellSlideNumber = parseInt(this.sellnumber * 100 / this.sell.canUser); //滑块的变化
                  }

                }
              }
            }

          }
        } else {//判断不是第一个tab的
          if (val == "") {
          } else if ((/^[0-9]+\.[0-9]+$/.test(val) == false && /^[0-9]+$/.test(val) == false && /^[0-9]+\.$/.test(val) == false) || this.howManyPoint(val) > this.accuracy) {//正则判断不可用字符或大于精度值
            this.sellPrice = oldVal;
          } else if (parseInt(val).toString().length > 16) {
            this.sellPrice = oldVal;
          }
        }
      },
      buyEntrustPrice(val, oldVal) {//监听买入的委托价
        if (this.focuseAsync == false) {
          return;
        }
        if (this.activeName == 3 || this.activeName == 4) {//判断tab为第一个
          if (val == "") {
            // this.buy.aboutCash ="0.00";
            this.buy.canUser = "0";//总量
            this.buySlideNumber = 0;//滑动条值
          } else {
            if (/^[0-9]+\.?[0-9]{0,}$|^\.[0-9]+$/.test(val) == false || this.howManyPoint(val) > this.accuracy) {//正则判断不可用字符或大于精度值
              this.buyEntrustPrice = oldVal;
            } else if (parseInt(val).toString().length > 16) {
              this.buyEntrustPrice = oldVal;
            } else {
              // this.buy.aboutCash = this.numberTwo(val*this.buyexchangeLegal);//法币
              if (this.buyEntrustPrice == 0) {
                this.buy.canUser = 0;
              } else {
                let a = new Decimal(this.currencys.sellcanUser);
                a = a.dividedBy(this.buyEntrustPrice).toString();
                this.buy.canUser = util.toFixed(a, this.volumePrecision) ? util.toFixed(a, this.volumePrecision) : 0;//总量
              }

              if (this.buynumber == "" || this.buynumber == 0) {//判断买入量
                this.buy.buyAllCash = "0.00000000";//总金额
                this.buySlideNumber = 0;
              } else {
                let x = new Decimal(val);
                let y = new Decimal(this.buynumber);
                x = x.times(y).toFixed().toString();
                this.buy.buyAllCash = util.toFixed(x, 8);

                //this.buy.buyAllCash = util.toFixed(val*this.buynumber,8); //总金额

                if (Number(this.buynumber) > Number(this.buy.canUser)) {//判断 买入量 > 总量
                  this.buySlideNumber = 100;
                } else {
                  if (this.buynumber * 100 / this.buy.canUser < 1) {
                    this.buySlideNumber = 0;
                  } else {
                    this.buySlideNumber = parseInt(this.buynumber * 100 / this.buy.canUser); //滑块的变化
                  }
                }
              }
            }

          }
        } else {//判断不是第一个tab的
          if ((/^[0-9]+\.[0-9]+$/.test(val) == false && /^[0-9]+$/.test(val) == false && /^[0-9]+\.$/.test(val) == false) || this.howManyPoint(val) > this.accuracy) {//正则判断不可用字符或大于精度值
            this.buyEntrustPrice = oldVal;
          } else if (parseInt(val).toString().length > 16) {
            this.buyEntrustPrice = oldVal;
          }
        }
      },
      sellEntrustPrice(val, oldVal) {//监听卖出的委托价
        if (this.focuseAsync == false) {
          return;
        }
        if (this.activeName == 3 || this.activeName == 4) {//判断tab为第一个
          if (val == "") {
            // this.sell.aboutCash ="0.00";
            // this.sell.canUser = "0";//总量
            this.sellSlideNumber = 0;//滑动条值
          } else {
            if (/^[0-9]+\.?[0-9]{0,}$|^\.[0-9]+$/.test(val) == false || this.howManyPoint(val) > this.accuracy) {//正则判断不可用字符或大于精度值
              this.sellEntrustPrice = oldVal;
            } else if (parseInt(val).toString().length > 16) {
              this.sellEntrustPrice = oldVal;
            } else {
              // this.sell.aboutCash = this.numberTwo(val*this.buyexchangeLegal);//法币
              // if(this.sellEntrustPrice == 0){
              //     this.sell.canUser = 0;
              // }else{
              //     let a = new Decimal(this.currencys.buycanUser);
              //     a = a.dividedBy(this.sellEntrustPrice).toString();
              //     this.sell.canUser = util.toFixed(a,this.volumePrecision)?util.toFixed(a,this.volumePrecision):0;//总量
              // }
              if (this.sellnumber == "" || this.sellnumber == 0) {//判断卖出量
                this.sell.buyAllCash = "0.00000000";//总金额
                this.sellSlideNumber = 0;
              } else {
                let x = new Decimal(val);
                let y = new Decimal(this.sellnumber);
                x = x.times(y).toFixed().toString();
                this.sell.buyAllCash = util.toFixed(x, 8);
                //this.sell.buyAllCash = util.toFixed(val*this.sellnumber,8); //总金额 howManyPoint(val)+howManyPoint(this.buynumber)//相乘的话有多少位小数

                if (Number(this.sellnumber) > Number(this.sell.canUser)) {//判断 买入量 > 总量
                  this.sellSlideNumber = 100;
                } else {
                  if (this.sellnumber * 100 / this.sell.canUser < 1) {
                    this.sellSlideNumber = 0;
                  } else {
                    this.sellSlideNumber = parseInt(this.sellnumber * 100 / this.sell.canUser); //滑块的变化
                  }
                }
              }
            }

          }
        } else {//判断不是第一个tab的
          if ((/^[0-9]+\.[0-9]+$/.test(val) == false && /^[0-9]+$/.test(val) == false && /^[0-9]+\.$/.test(val) == false) || this.howManyPoint(val) > this.accuracy) {//正则判断不可用字符或大于精度值
            this.sellEntrustPrice = oldVal;
          } else if (parseInt(val).toString().length > 16) {
            this.sellEntrustPrice = oldVal;
          }
        }
      },
      buynumber(val, oldVal) {//监听买入量
        if (this.focuseAsync == false) {
          return;
        }
        if (this.activeName == 1) {//判断tab为第一个
          if (val == "") {
            this.buy.buyAllCash = "0.00000000";//总金额
            this.buySlideNumber = 0;//滑动条值
          } else if (/^[0-9]+\.?[0-9]{0,}$|^\.[0-9]+$/.test(val) == false || this.howManyPoint(val) > this.volumePrecision) {//正则判断不可用字符或大于精度值
            this.buynumber = oldVal;
          } else if (parseInt(val).toString().length > 16) {
            this.buynumber = oldVal;
          } else {
            if (this.buyPrice == "" || this.buyPrice == 0) {//判断委托价
              this.buy.buyAllCash = "0.00000000";//总金额
              this.buySlideNumber = 0;//滑动条值
            } else {
              let x = new Decimal(val);
              let y = new Decimal(this.buyPrice);
              x = x.times(y).toFixed().toString();
              this.buy.buyAllCash = util.toFixed(x, 8);

              //this.buy.buyAllCash = util.toFixed(val*this.buyPrice,8); //总金额
              // console.log(val*this.buyPrice)
              if (Number(val) > Number(this.buy.canUser)) {//判断 买入量 > 总量
                this.buySlideNumber = 100;//滑动条值
              } else {
                if (val * 100 / this.buy.canUser < 1) {
                  this.buySlideNumber = 0;
                } else {
                  this.buySlideNumber = parseInt(val * 100 / this.buy.canUser); //滑块的变化
                }
              }
            }
          }

        } else if (this.activeName == 3 || this.activeName == 4) {
          if (val == "") {
            this.buy.buyAllCash = "0.00000000";//总金额
            this.buySlideNumber = 0;//滑动条值
          } else if ((/^[0-9]+\.[0-9]+$/.test(val) == false && /^[0-9]+$/.test(val) == false && /^[0-9]+\.$/.test(val) == false) || this.howManyPoint(val) > this.volumePrecision) {//正则判断不可用字符或大于精度值
            this.buynumber = oldVal;
          } else if (parseInt(val).toString().length > 16) {
            this.buynumber = oldVal;
          } else {
            if (this.buyEntrustPrice == "" || this.buyEntrustPrice == 0) {//判断委托价
              this.buy.buyAllCash = "0.00000000";//总金额
              this.buySlideNumber = 0;//滑动条值
            } else {
              let x = new Decimal(val);
              let y = new Decimal(this.buyEntrustPrice);
              x = x.times(y).toFixed().toString();
              this.buy.buyAllCash = util.toFixed(x, 8);

              //this.buy.buyAllCash = util.toFixed(val*this.buyEntrustPrice,8); //总金额 howManyPoint(val)+howManyPoint(this.buynumber)//相乘的话有多少位小数
              if (Number(val) > Number(this.buy.canUser)) {//判断 买入量 > 总量
                this.buySlideNumber = 100;//滑动条值
              } else {
                if (val * 100 / this.buy.canUser < 1) {
                  this.buySlideNumber = 0;
                } else {
                  this.buySlideNumber = parseInt(val * 100 / this.buy.canUser); //滑块的变化
                }
              }
            }
          }
        } else if (this.activeName == 2) {
          if (val == "") {
            // this.buy.buyAllCash = "0";//总金额
            this.buySlideNumber = 0;//滑动条值
          } else if ((/^[0-9]+\.[0-9]+$/.test(val) == false && /^[0-9]+$/.test(val) == false && /^[0-9]+\.$/.test(val) == false) || this.howManyPoint(val) > this.accuracy) {//正则判断不可用字符或大于精度值
            this.buynumber = oldVal;
          } else if (parseInt(val).toString().length > 16) {
            this.buynumber = oldVal;
          } else {
            if (Number(val) > Number(this.currencys.sellcanUser)) {
              // this.buy.buyAllCash =this.currencys.sellcanUser;//总金额
              this.buySlideNumber = 100;//滑动条值
            } else {
              // this.buy.buyAllCash = val;//总金额
              if (val * 100 / this.buy.canUser < 1) {
                this.buySlideNumber = 0;
              } else {
                this.buySlideNumber = parseInt(val * 100 / this.buy.canUser);//滑动条值
              }

            }
          }
        }
      },
      sellnumber(val, oldVal) {
        if (this.focuseAsync == false) {
          return;
        }
        if (this.activeName == 1) {//判断tab为第一个
          if (val == "") {
            this.sell.buyAllCash = "0.00000000";//总金额
            this.sellSlideNumber = 0;//滑动条值
          } else if (/^[0-9]+\.?[0-9]{0,}$|^\.[0-9]+$/.test(val) == false || this.howManyPoint(val) > this.volumePrecision) {//正则判断不可用字符或大于精度值
            this.sellnumber = oldVal;
          } else if (parseInt(val).toString().length > 16) {
            this.sellnumber = oldVal;
          } else {
            if (this.sellPrice == "" || this.sellPrice == 0) {//判断委托价
              this.sell.buyAllCash = "0.00000000";//总金额
            } else {
              let x = new Decimal(val);
              let y = new Decimal(this.sellPrice);
              x = x.times(y).toFixed().toString();
              this.sell.buyAllCash = util.toFixed(x, 8);

              //this.sell.buyAllCash = util.toFixed(val*this.sellPrice,8); //总金额
            }

            if (Number(val) > Number(this.sell.canUser)) {//判断 卖出量 > 总量
              this.sellSlideNumber = 100;//滑动条值
            } else {
              if (val * 100 / this.sell.canUser < 1) {
                this.sellSlideNumber = 0;
              } else {
                this.sellSlideNumber = parseInt(val * 100 / this.sell.canUser); //滑块的变化
              }

            }
          }
        } else if (this.activeName == 2) {
          if (val == "") {
            // this.buy.buyAllCash = "0";//总金额
            this.sellSlideNumber = 0;//滑动条值
          } else if ((/^[0-9]+\.[0-9]+$/.test(val) == false && /^[0-9]+$/.test(val) == false && /^[0-9]+\.$/.test(val) == false) || this.howManyPoint(val) > this.volumePrecision) {//正则判断不可用字符或大于精度值
            this.sellnumber = oldVal;
          } else if (parseInt(val).toString().length > 16) {
            this.sellnumber = oldVal;
          } else {
            if (Number(val) > Number(this.currencys.buycanUser)) {
              // this.buy.buyAllCash =this.currencys.sellcanUser;//总金额
              this.sellSlideNumber = 100;//滑动条值
            } else {
              if (val * 100 / this.sell.canUser < 1) {
                this.sellSlideNumber = 0;
              } else {
                this.sellSlideNumber = parseInt(val * 100 / this.sell.canUser);//滑动条值
              }

            }
          }
        } else if (this.activeName == 3 || this.activeName == 4) {
          if (val == "") {
            this.sell.buyAllCash = "0.00000000";//总金额
            this.sellSlideNumber = 0;//滑动条值
          } else if ((/^[0-9]+\.[0-9]+$/.test(val) == false && /^[0-9]+$/.test(val) == false && /^[0-9]+\.$/.test(val) == false) || this.howManyPoint(val) > this.volumePrecision) {//正则判断不可用字符或大于精度值
            this.sellnumber = oldVal;
          } else if (parseInt(val).toString().length > 16) {
            this.sellnumber = oldVal;
          } else {
            if (this.sellEntrustPrice == "" || this.sellEntrustPrice == 0) {//判断委托价
              this.sell.buyAllCash = "0.00000000";//总金额
              this.sellSlideNumber = 0;//滑动条值
            } else {
              let x = new Decimal(val);
              let y = new Decimal(this.sellEntrustPrice);
              x = x.times(y).toFixed().toString();
              this.sell.buyAllCash = util.toFixed(x, 8);

              //this.sell.buyAllCash = util.toFixed(val*this.sellEntrustPrice,8); //总金额 howManyPoint(val)+howManyPoint(this.buynumber)//相乘的话有多少位小数
              if (Number(val) > Number(this.sell.canUser)) {//判断 买入量 > 总量
                this.sellSlideNumber = 100;//滑动条值
              } else {
                if (val * 100 / this.sell.canUser < 1) {
                  this.sellSlideNumber = 0;
                } else {
                  this.sellSlideNumber = parseInt(val * 100 / this.sell.canUser); //滑块的变化
                }

              }
            }
          }
        }
      },
    },
    computed: {
      userInfo() {
        // console.log(this.$store.state.user.info)
        return this.$store.state.user.info;
      },
      getCoin() {//获取法币
        return this.$store.state.user.coin;
      },
      isLogin() {
        if (this.$store.state.user.isLogin && this.$store.state.user.isSecVerification) {
          return true;
        } else {
          return false;
        }
      },
      legalMoneyPerCurrencyChange() {//货币转换成法币的转换率
        return this.$store.state.user.legalMoneyPerCurrency;
      }
    },
    mounted() {
      Decimal.set({precision: 50})
      setTimeout(() => {
        this.init(this.trade);//初始化加载
      }, 1000);

    },
    methods: {
      //点击tab导致价格变化，从而引起的整体数据变化
      //点击左边列表价格，倒是价格变化，从而引起整体的数据变化
      //买卖过后可用值变化导致里面内容变化
      priceToNew() {
        if (this.activeName == 1) {//判断tab为第一个
          let a = new Decimal(this.buyPrice);
          a = a.times(this.buyexchangeLegal).toString();
          this.buy.aboutCash = this.numberTwo(a);//法币
          if (this.buyPrice == 0) {
            this.buy.canUser = 0;
          } else {
            let b = new Decimal(this.currencys.sellcanUser);
            b = b.dividedBy(this.buyPrice).toString();
            this.buy.canUser = util.toFixed(b, this.volumePrecision) ? util.toFixed(b, this.volumePrecision) : 0;//总量

          }
          if (this.buynumber == "" || this.buynumber == 0) {//判断买入量
            this.buy.buyAllCash = "0.00000000";
            this.buySlideNumber = 0;
          } else {
            let x = new Decimal(this.buyPrice);
            let y = new Decimal(this.buynumber);
            x = x.times(y).toFixed().toString();
            this.buy.buyAllCash = util.toFixed(x, 8);

            //this.buy.buyAllCash = util.toFixed(this.buyPrice*this.buynumber,8); //总金额
            if (Number(this.buynumber) > Number(this.buy.canUser)) {//判断 买入量 > 总量
              this.buySlideNumber = 100;
            } else {
              if (this.buynumber * 100 / this.buy.canUser < 1) {
                this.buySlideNumber = 0;
              } else {
                this.buySlideNumber = parseInt(this.buynumber * 100 / this.buy.canUser); //滑块的变化
              }
            }
          }

          let c = new Decimal(this.sellPrice);
          c = c.times(this.buyexchangeLegal).toString();
          this.sell.aboutCash = this.numberTwo(this.sellPrice * this.buyexchangeLegal);//法币
          
          if (this.sellnumber == "" || this.sellnumber == 0) {//判断卖出量
            this.sell.buyAllCash = "0.00000000";//总金额
            this.sellSlideNumber = 0;
          } else {
            let x = new Decimal(this.sellPrice);
            let y = new Decimal(this.sellnumber);
            x = x.times(y).toFixed().toString();
            this.sell.buyAllCash = util.toFixed(x, 8);

            //this.sell.buyAllCash = util.toFixed(this.sellPrice*this.sellnumber,8); //总金额 howManyPoint(val)+howManyPoint(this.buynumber)//相乘的话有多少位小数

            if (Number(this.sellnumber) > Number(this.sell.canUser)) {//判断 买入量 > 总量
              this.sellSlideNumber = 100;
            } else {
              if (this.sellnumber * 100 / this.sell.canUser < 1) {
                this.sellSlideNumber = 0;
              } else {
                this.sellSlideNumber = parseInt(this.sellnumber * 100 / this.sell.canUser); //滑块的变化
              }

            }
          }
        } else if (this.activeName == 3 || this.activeName == 4) {
          if (this.buyEntrustPrice == 0) {
            this.buy.canUser = 0;
          } else {
            let e = new Decimal(this.currencys.sellcanUser);
            e = e.dividedBy(this.buyEntrustPrice).toString();
            this.buy.canUser = util.toFixed(e, this.volumePrecision) ? util.toFixed(e, this.volumePrecision) : 0;//总量
          }
          if (this.buynumber == "" || this.buynumber == 0) {//判断买入量
            this.buy.buyAllCash = "0.00000000";//总金额
            this.buySlideNumber = 0;
          } else {
            let x = new Decimal(this.buyEntrustPrice);
            let y = new Decimal(this.buynumber);
            x = x.times(y).toFixed().toString();
            this.buy.buyAllCash = util.toFixed(x, 8);

            //this.buy.buyAllCash = util.toFixed(this.buyEntrustPrice*this.buynumber,8); //总金额 howManyPoint(val)+howManyPoint(this.buynumber)//相乘的话有多少位小数
            if (Number(this.buynumber) > Number(this.buy.canUser)) {//判断 买入量 > 总量
              this.buySlideNumber = 100;
            } else {
              if (this.buynumber * 100 / this.buy.canUser < 1) {
                this.buySlideNumber = 0;
              } else {
                this.buySlideNumber = parseInt(this.buynumber * 100 / this.buy.canUser); //滑块的变化
              }
            }
          }
          //卖
         
          if (this.sellnumber == "" || this.sellnumber == 0) {//判断卖出量
            this.sell.buyAllCash = "0.00000000";//总金额
            this.sellSlideNumber = 0;
          } else {
            this.sell.buyAllCash = util.toFixed(this.sellEntrustPrice * this.sellnumber, 8); //总金额 howManyPoint(val)+howManyPoint(this.buynumber)//相乘的话有多少位小数

            if (Number(this.sellnumber) > Number(this.sell.canUser)) {//判断 买入量 > 总量
              this.sellSlideNumber = 100;
            } else {
              if (this.sellnumber * 100 / this.sell.canUser < 1) {
                this.sellSlideNumber = 0;
              } else {
                this.sellSlideNumber = parseInt(this.sellnumber * 100 / this.sell.canUser); //滑块的变化
              }
            }
          }
        } else if (this.activeName == 2) {
          //买
          this.buy.canUser = this.currencys.sellcanUser;
          if (this.buynumber == 0 || this.buynumber == "") {
            this.buySlideNumber = 0;//滑动条值
          } else {
            if (Number(this.buynumber) > Number(this.currencys.sellcanUser)) {
              this.buySlideNumber = 100;//滑动条值
            } else {
              if (this.buynumber * 100 / this.buy.canUser < 1) {
                this.buySlideNumber = 0;
              } else {
                this.buySlideNumber = parseInt(this.buynumber * 100 / this.buy.canUser);//滑动条值
              }
            }
          }

          //卖
          this.sell.canUser = this.currencys.buycanUser;
          if (this.sellnumber == 0 || this.sellnumber == "") {
            this.sellSlideNumber = 0;
          } else {
            if (Number(this.sellnumber) > Number(this.currencys.buycanUser)) {
              this.sellSlideNumber = 100;//滑动条值
            } else {
              if (this.sellnumber * 100 / this.sell.canUser < 1) {
                this.sellSlideNumber = 0;
              } else {
                this.sellSlideNumber = parseInt(this.sellnumber * 100 / this.sell.canUser);//滑动条值
              }
            }
          }


        }
      },
      changeSlide1() {
        this.focuseAsync = false;
        if (this.activeName == 1) {//判断tab为第一个
          if (this.buy.canUser == 0) {//判断总量
            if (this.buynumber == "") {//判断买入量
              this.buynumber = "";
            } else {
              this.buynumber == 0;
            }
          } else {
            let a = new Decimal(this.buy.canUser);
            a = a.times(this.buySlideNumber).dividedBy(100).toString();
            // this.buynumber = util.toFixed(this.buy.canUser*this.buySlideNumber/100,this.accuracy) ;//买入量
            this.buynumber = util.toFixed(a, this.volumePrecision);//买入量
            if (this.buyPrice == "" || this.buyPrice == 0) {
              this.buy.buyAllCash = "0.00000000";//总金额
            } else {
              let x = new Decimal(this.buyPrice);
              let y = new Decimal(this.buynumber);
              x = x.times(y).toFixed().toString();
              this.buy.buyAllCash = util.toFixed(x, 8);


              //this.buy.buyAllCash = util.toFixed(this.buyPrice*this.buynumber,this.howManyPoint(this.buyPrice)+this.howManyPoint(this.buynumber)); //总金额 howManyPoint(val)+howManyPoint(this.buynumber)//相乘的话有多少位小数
            }
          }
        } else if (this.activeName == 2) {
          if (this.buy.canUser == 0) {//判断总量
            if (this.buynumber == "") {//判断买入量
              this.buynumber = "";
            } else {
              this.buynumber == 0;
            }
          } else {
            let c = new Decimal(this.buy.canUser);
            c = c.times(this.buySlideNumber).dividedBy(100).toString();
            this.buynumber = util.toFixed(c, this.volumePrecision);
            //this.buynumber = util.toFixed(this.buy.canUser*this.buySlideNumber/100,this.accuracy) ;//交易金额

          }
        } else if (this.activeName == 3 || this.activeName == 4) {
          if (this.buy.canUser == 0) {//判断总量
            if (this.buynumber == "") {//判断买入量
              this.buynumber = "";
            } else {
              this.buynumber == 0;
            }
          } else {
            let e = new Decimal(this.buy.canUser);
            e = e.times(this.buySlideNumber).dividedBy(100).toString();
            this.buynumber = util.toFixed(e, this.volumePrecision);//买入量
            if (this.buyEntrustPrice == "" || this.buyEntrustPrice == 0) {
              this.buy.buyAllCash = "0.00000000";//总金额
            } else {
              let x = new Decimal(this.buyEntrustPrice);
              let y = new Decimal(this.buynumber);
              x = x.times(y).toFixed().toString();
              this.buy.buyAllCash = util.toFixed(x, 8);

              // let d = new Decimal(this.buyEntrustPrice);
              // d = d.times(this.buynumber).toString();
              //  this.buy.buyAllCash = util.toFixed(d,8); //总金额 howManyPoint(val)+howManyPoint(this.buynumber)//相乘的话有多少位小数
            }
          }
        }
      },
      changeSlide2() {
        this.focuseAsync = false;
        if (this.activeName == 1) {//判断tab为第一个
          if (this.sell.canUser == 0) {//判断总量
            if (this.sellnumber == "") {//判断买入量
              this.sellnumber = "";
            } else {
              this.sellnumber == 0;
            }
          } else {
            let a = new Decimal(this.sell.canUser);
            a = a.times(this.sellSlideNumber).dividedBy(100).toString();
            this.sellnumber = util.toFixed(a, this.volumePrecision);
            //this.sellnumber = util.toFixed(this.sell.canUser*this.sellSlideNumber/100,this.accuracy) ;//买入量

            if (this.sellPrice == "" || this.sellPrice == 0) {
              this.sell.buyAllCash = "0.00000000";//总金额
            } else {
              let b = new Decimal(this.sellPrice);
              b = b.times(this.sellnumber).toString();
              this.sell.buyAllCash = util.toFixed(b, 8); //总金额 howManyPoint(val)+howManyPoint(this.buynumber)//相乘的话有多少位小数
            }
          }
        } else if (this.activeName == 2) {
          if (this.sell.canUser == 0) {//判断总量
            if (this.sellnumber == "") {//判断卖出量
              this.sellnumber = "";
            } else {
              this.sellnumber == 0;
            }
          } else {
            let c = new Decimal(this.sell.canUser);
            c = c.times(this.sellSlideNumber).dividedBy(100).toString();
            this.sellnumber = util.toFixed(c, this.volumePrecision);//卖出量
          }
        } else if (this.activeName == 3 || this.activeName == 4) {
          if (this.sell.canUser == 0) {//判断总量
            if (this.sellnumber == "") {//判断买入量
              this.sellnumber = "";
            } else {
              this.sellnumber == 0;
            }
          } else {
            let d = new Decimal(this.sell.canUser);
            d = d.times(this.sellSlideNumber).dividedBy(100).toString();
            this.sellnumber = util.toFixed(d, this.volumePrecision);//买入量
            if (this.sellEntrustPrice == "" || this.sellEntrustPrice == 0) {
              this.sell.buyAllCash = "0.00000000";//总金额
            } else {
              let e = new Decimal(this.sellEntrustPrice);
              e = e.times(this.sellnumber).toString();
              this.sell.buyAllCash = util.toFixed(e, 8); //总金额 howManyPoint(val)+howManyPoint(this.buynumber)//相乘的话有多少位小数
            }
          }
        }
      },
      focuseFn() {
        this.focuseAsync = true;
      },
      parentPrice(price) {//父组件点击价格传过来的
        if (this.activeName == 1) {
          this.buyPrice = this.scientificToNumber(price.newPrice);
          this.sellPrice = this.scientificToNumber(price.newPrice);
        } else if (this.activeName == 3 || this.activeName == 4) {
          this.buyPrice = this.scientificToNumber(price.newPrice);
          this.buyEntrustPrice = this.scientificToNumber(price.newPrice);
          this.sellPrice = this.scientificToNumber(price.newPrice);
          this.sellEntrustPrice = this.scientificToNumber(price.newPrice);
        }
        this.priceToNew();
      },
      getNewPriceto(price) {//止盈止损买卖的时候获得最新价格
        this.newPriceto = price;
      },
      init(currency) {
        // console.log(currency,99999999988888888)
        this.currencys.buyCurrency = currency ? currency.id.split("_")[0].toUpperCase() : "";
        this.currencys.sellCurrency = currency ? currency.id.split("_")[1].toUpperCase() : "";

        this.activeName = "1";
        //获取货币转换成法币的转换率//this.$store.state.dict.coinCode[this.getCoin]
        this.exchangeLegalMoney();
        //获取手续费,和小数精度，下单最小金额
        this.getetFeeRate(this.currencys.buyCurrency.toLowerCase() + "_" + this.currencys.sellCurrency.toLowerCase(),()=>{
          if (this.$store.state.user.isLogin && this.$store.state.user.isSecVerification) {
              //是否抵扣
              this.deductionSelect = this.userInfo ? this.userInfo.isAzcFeeOpened : false;
              //获取币种可用值

              this.getAssetPageList(this.currencys.buyCurrency.toLowerCase(),this.currencys.sellCurrency.toLowerCase(),()=>{
                this.$emit("getnewPrice");
              })

            } else {
              setTimeout(() => {
                this.$emit("getnewPrice");
              }, 2500);
            }
        });



        this.formReset();//清空所有表单数据
        this.borderBottomRadius = false;
        this.borderTopRadius = false;
        this.heightAsync = true;
        this.aboutCashUnit = this.$store.state.dict.coinSymbolList[this.getCoin];//法币单位
        this.together.aboutPriceAsync = true;
        this.together.entrustPriceAsync = false;
        this.together.allCashAsync = true;
        this.buy = {
          title: this.$t("trade.limitBuyIn"),
          priceMess: this.$t("trade.buyPriceIn"),//买入价
          // entrust:"委托价",//委托价
          number: this.$t("trade.buyInNumber"),//数量
          numberUnit: this.currencys.buyCurrency,//买入量的单位
          buyAllCash: "0.00000000",//总金额
          canUser: "0",//滑动条最大的值
          buycurrency: this.currencys.buyCurrency,//滑动条的单位(包括买入量的单位)
          aboutCash: "0.00",//约等于 法币值
          disables: false,
          priceHolder: "",
        }
        this.sell = {
          title: this.$t("trade.limitSellOut"),
          priceMess: this.$t("trade.sellPriceOut"),//卖出价
          // entrust:"委托价",//委托价
          number: this.$t("trade.sellOutNumber"),//数量
          buyAllCash: "0.00000000",//总金额
          canUser: "0",//滑动条最大的值
          aboutCash: "0.00",//约等于
          disables: false,
          priceHolder: "",
        }

      },
      tab1Fn() {
        this.formReset();//清空所有表单数据
        this.together.aboutPriceAsync = true;
        this.together.entrustPriceAsync = false;
        this.together.allCashAsync = true;
        this.borderBottomRadius = false;
        this.borderTopRadius = false;
        this.heightAsync = true;

        this.buy = {
          title: this.$t("trade.limitBuyIn"),
          priceMess: this.$t("trade.buyPriceIn"),//买入价
          // entrust:"委托价",//委托价
          number: this.$t("trade.buyInNumber"),//数量
          numberUnit: this.currencys.buyCurrency,//买入量的单位
          buyAllCash: "0.00000000",//总金额
          canUser: "0",//滑动条最大的值
          buycurrency: this.currencys.buyCurrency,//滑动条的单位(包括买入量的单位)
          aboutCash: "0.00",//约等于 法币值
          disables: false,
          priceHolder: "",
        }
        this.sell = {
          title: this.$t("trade.limitSellOut"),
          priceMess: this.$t("trade.sellPriceOut"),//卖出价
          // entrust:"委托价",//委托价
          number: this.$t("trade.sellOutNumber"),//数量
          buyAllCash: "0.00000000",//总金额
          canUser: this.currencys.buycanUser,//滑动条最大的值
          aboutCash: "0.00",//约等于
          disables: false,
          priceHolder: "",
        }


      },
      tab2Fn() {
        this.formReset();//清空所有表单数据
        this.together.aboutPriceAsync = false;
        this.together.entrustPriceAsync = false;
        this.together.allCashAsync = false;
        this.borderBottomRadius = false;
        this.borderTopRadius = false;
        this.heightAsync = true;
        this.buy = {
          title: this.$t("trade.markBuyIn"),
          priceMess: this.$t("trade.buyPriceIn"),//买入价
          // entrust:"委托价",//委托价
          number: this.$t("trade.transactionAmount"),//交易金额
          numberUnit: this.currencys.sellCurrency,//买入量的单位
          buyAllCash: "0.00000000",//总金额
          canUser: this.currencys.sellcanUser,//滑动条最大的值
          buycurrency: this.currencys.sellCurrency,//滑动条的单位(包括买入量的单位)
          aboutCash: "0.00",//约等于 法币值
          disables: true,
          priceHolder: this.$t("trade.buyWithBestPrice"),
        }
        this.sell = {
          title: this.$t("trade.markSellOut"),
          priceMess: this.$t("trade.sellPriceOut"),//卖出价
          // entrust:"委托价",//委托价
          number: this.$t("trade.sellOutNumber"),//数量
          buyAllCash: "0.00000000",//总金额
          canUser: this.currencys.buycanUser,//滑动条最大的值
          aboutCash: "0.00",//约等于
          disables: true,
          priceHolder: this.$t("trade.sellWithBestPrice"),
        }
      },
      tab3Fn() {
        this.formReset();//清空所有表单数据
        this.together.aboutPriceAsync = false;
        this.together.entrustPriceAsync = true;
        this.together.allCashAsync = true;
        this.borderBottomRadius = true;
        this.borderTopRadius = true;
        this.heightAsync = false;
        this.buy = {
          title: this.$t("trade.buyingAndBuying"),
          priceMess: this.$t("trade.triggerPrice"),//买入价
          entrust: this.$t("trade.entrustmentPrice"),//委托价
          number: this.$t("trade.buyInNumber"),//数量
          numberUnit: this.currencys.buyCurrency,//买入量的单位
          buyAllCash: "0.00000000",//总金额
          canUser: "0",//滑动条最大的值
          buycurrency: this.currencys.buyCurrency,//滑动条的单位(包括买入量的单位)
          // aboutCash:"0.00",//约等于 法币值
          disables: false,
          priceHolder: "",
        }
        this.sell = {
          title: this.$t("trade.stopAndSell"),
          priceMess: this.$t("trade.triggerPrice"),//触发价
          entrust: this.$t("trade.entrustmentPrice"),//委托价
          number: this.$t("trade.sellOutNumber"),//数量
          buyAllCash: "0.00000000",//总金额
          canUser: this.currencys.buycanUser,//滑动条最大的值
          // aboutCash:"0.00",//约等于
          disables: false,
          priceHolder: "",
        }
      },
      tab4Fn() {
        this.formReset();//清空所有表单数据
        this.together.aboutPriceAsync = false;
        this.together.entrustPriceAsync = true;
        this.together.allCashAsync = true;
        this.borderBottomRadius = true;
        this.borderTopRadius = true;
        this.heightAsync = false;
        this.buy = {
          title: this.$t("trade.buyingofBottom"),
          priceMess: this.$t("trade.triggerPrice"),//买入价
          entrust: this.$t("trade.entrustmentPrice"),//委托价
          number: this.$t("trade.buyInNumber"),//数量
          numberUnit: this.currencys.buyCurrency,//买入量的单位
          buyAllCash: "0.00000000",//总金额
          canUser: "0",//滑动条最大的值
          buycurrency: this.currencys.buyCurrency,//滑动条的单位(包括买入量的单位)
          // aboutCash:"0.00",//约等于 法币值
          disables: false,
          priceHolder: "",
        }
        this.sell = {
          title: this.$t("trade.sellStop"),
          priceMess: this.$t("trade.triggerPrice"),//卖出价
          entrust: this.$t("trade.entrustmentPrice"),//委托价
          number: this.$t("trade.sellOutNumber"),//数量
          buyAllCash: "0.00000000",//总金额
          canUser: this.currencys.buycanUser,//滑动条最大的值
          // aboutCash:"0.00",//约等于
          disables: false,
          priceHolder: "",
        }
      },
      formReset() {

        this.buySlideNumber = 0;//滑块初始化
        this.sellSlideNumber = 0;//滑块初始化

        this.buyPrice = "";//买入价 触发价
        this.buyEntrustPrice = "";//买的委托价
        this.buynumber = "";//买入量
        this.sellPrice = "";//卖出价 触发价
        this.sellEntrustPrice = "";//卖的委托价
        this.sellnumber = "";//卖出量

        this.bugerBg = {
          bg1: false,
          bg2: false,
          bg3: false,
          bg4: false,
        }
        this.sellerBg = {
          bg1: false,
          bg2: false,
          bg3: false,
          bg4: false,
        }
      },
      numberTwo(value) {//截取两位小数
        var toFixedNum = Number(value).toFixed(20);
        var realVal = toFixedNum.substring(0, toFixedNum.toString().length - 18);
        return realVal;
      },
      numbersplice(value, pointNumber) {//截取相对精度的小数 value传的值，pointNumber精确到多少位小数（有些情况下会出现四舍五入现象）
        // let p = new Decimal(value);
        // return p.toFixed(pointNumber).toString();
        return util.toFixed(value, pointNumber);
      },
      howManyPoint(n) {//判断有多少位小数点
        return n.toString().split(".")[1] ? n.toString().split(".")[1].length : 0;
      },
      clickTabFn(name) {//点击tab tab1Fn
        this.activeName = name;
        if (name == 1) {
          this.tab1Fn();
        } else if (name == 2) {
          this.tab2Fn();
        }
        else if (name == 3) {
          this.tab3Fn();
        }
        else if (name == 4) {
          this.tab4Fn();
        }

        this.$emit("getnewPrice");
      },
      sellLiFn() {
        this.sellSlideNumber = 100;
      },
      buyLiFn() {
        this.buySlideNumber = 100;
      },
      getAssetPageList(currency1, currency2, fn) {//currency1是苹果 currency2 是金钱

        api.post("/User/GetUserBalance", {"currency": [currency1,currency2]}).then((res) => {
          // console.log(res.data.value.balances,66666666666666)
          let a = res.data.value.balances[currency1];
          this.currencys.buycanUser = util.toFixed(a, this.volumePrecision);
          this.sell.canUser = util.toFixed(a, this.volumePrecision);
          let b = new Decimal(res.data.value.balances[currency2]);
          b = b.toFixed().toString();//accuracy
          this.currencys.sellcanUser = util.toFixed(b, this.accuracy);
            fn();
        }).catch((error) => {});

      },
      getetFeeRate(currency,fn) {//获取手续费,和小数精度，下单最小金额
        let par = {
          "id": currency,
        }
        api.post("/Market/GetMarket", par).then((res) => {
          // console.log(res)
          this.serviceCharge = res.data.value.makerFeeRate;//取的是挂单手取费
          this.lastCashMoney = res.data.value.minOrderAmount;//下单最小金额
          this.accuracy = res.data.value.pricePrecision;//价格精度，多少位小数
          this.volumePrecision = res.data.value.volumePrecision;//数量精度
            fn();
          let par1 = {
            "id": currency.split("_")[0],
          }
          api.post("/Currency/GetCurrencyExchangeInfo", par1).then((data) => {//获取手续费折扣率
            // console.log(res);
            this.howServiceCharge = data.data.value.deductionDiscount; //手续费折扣率
            // if(this.deductionSelect){
            //     this.serviceCharge = this.serviceCharge*this.howServiceCharge; //手续费乘以费率=手续费
            // }else{
            //     this.serviceCharge = this.howServiceCharge; //手续费
            // }
            if (this.deductionSelect) {
              this.change = 0.06;//手续费
            } else {
              this.change = 0.2;//手续费
            }


          }).catch((error) => {
          });

        }).catch((error) => {
        });
      },
      exchangeLegalMoney() {//货币转换成法币的转换率
        this.buyexchangeLegal = util.getCurrencyToLegalMoney(this.currencys.sellCurrency.toLowerCase(), 1);
      },
      buyFn() {
        if (this.activeName == 1) {

          if (this.buyPrice == "" || this.buyPrice == 0 || /^[0-9]+\.$/.test(this.buyPrice)) {
            this.$message({showClose: true, message: this.$t("trade.enterSureBuyPrice"), type: 'error'});
            return;
          } else if (this.buynumber == "" || this.buynumber == 0 || /^[0-9]+\.$/.test(this.buynumber)) {
            this.$message({showClose: true, message: this.$t("trade.enterSurebuyInNumber"), type: 'error'});
            return;
          } else if (Number(this.buyPrice * this.buynumber) < Number(this.lastCashMoney)) {
            this.$message({showClose: true, message: this.$t("trade.amountNotLowerMinimum"), type: 'error'});
            return;
          } else {
            this.buyJudge(() => {
              if (Number(this.buyPrice * this.buynumber) > Number(this.currencys.sellcanUser)) {
                this.$message({
                  showClose: true,
                  message: this.$t("trade.amountTransactionExceed") + this.currencys.sellCurrency + this.$t("trade.availableQuantity"),
                  type: 'error'
                });
                return;
              }
              this.buyLoading = true;
              let par = {
                "currency": this.currencys.sellCurrency.toLowerCase(),
                "marketId": this.currencys.buyCurrency.toLowerCase() + "_" + this.currencys.sellCurrency.toLowerCase(),
                "audience": 0,
                "orderType": 1,
                "price": this.buyPrice,
                "volume": this.buynumber,
                "amount": 0
              }
              this.buyApi("/Order/SubmiOrder", par)
            });
          }
        } else if (this.activeName == 2) {

          if (this.buynumber == "" || this.buynumber == 0 || /^[0-9]+\.$/.test(this.buynumber)) {
            this.$message({showClose: true, message: this.$t("trade.enterBuyPrice"), type: 'error'});
            return;
          } else if (Number(this.buynumber) < Number(this.lastCashMoney)) {
            this.$message({showClose: true, message: this.$t("trade.amountNotLowerMinimum"), type: 'error'});
            return;
          } else {
            this.buyJudge(() => {
              if (Number(this.buynumber) > Number(this.currencys.sellcanUser)) {
                this.$message({
                  showClose: true,
                  message: this.$t("trade.amountTransactionExceed") + this.currencys.sellCurrency + this.$t("trade.availableQuantity"),
                  type: 'error'
                });
                return;
              }
              this.buyLoading = true;
              let par = {
                "currency": this.currencys.sellCurrency.toLowerCase(),
                "marketId": this.currencys.buyCurrency.toLowerCase() + "_" + this.currencys.sellCurrency.toLowerCase(),
                "audience": 0,
                "orderType": 2,
                "price": 0,
                "volume": 0,
                "amount": this.buynumber
              }
              this.buyApi("/Order/SubmiOrder", par)
            });

          }
        } else if (this.activeName == 3) {

          this.$emit("buySellPrice");//获取最新价格

          if (this.buyPrice == "" || this.buyPrice == 0 || /^[0-9]+\.$/.test(this.buyPrice)) {
            this.$message({showClose: true, message: this.$t("trade.enterCorrectTriggerPrice"), type: 'error'});
            return;
          } else if (this.buyEntrustPrice == "" || this.buyEntrustPrice == 0 || /^[0-9]+\.$/.test(this.buyEntrustPrice)) {
            this.$message({showClose: true, message: this.$t("trade.enterRightEntrustmentPrice"), type: 'error'});
            return;
          } else if (this.buynumber == "" || this.buynumber == 0 || /^[0-9]+\.$/.test(this.buynumber)) {
            this.$message({showClose: true, message: this.$t("trade.enterSurebuyInNumber"), type: 'error'});
            return;
          } else if (Number(this.buyEntrustPrice * this.buynumber) < Number(this.lastCashMoney)) {
            this.$message({showClose: true, message: this.$t("trade.amountNotLowerMinimum"), type: 'error'});
            return;
          } else {

            this.buyJudge(() => {
              if (Number(this.buyEntrustPrice * this.buynumber) > Number(this.currencys.sellcanUser)) {
                this.$message({
                  showClose: true,
                  message: this.$t("trade.amountTransactionExceed") + this.currencys.sellCurrency + this.$t("trade.availableQuantity"),
                  type: 'error'
                });
                return;
              }
              ///////////////////////////////////////////////////////////////////////////////////////////////////

              if (Number(this.buyPrice) > Number(this.newPriceto)) {//触发价大于最新价格
                let par = {
                  titleMessage: this.$t("trade.stopLossStopLoss"),
                  bugAsync: true,
                  firstMess: this.$t("trade.whenThNewPrice") + " ≥ " + this.buyPrice + this.currencys.sellCurrency + this.$t("trade.triggerPriceTo") + this.buyEntrustPrice + this.currencys.sellCurrency,
                  secondMess: this.buynumber + this.currencys.buyCurrency + this.$t("trade.order"),
                }
                this.PlanOrderType = 1;//触发价格大于市场价，则计划单类别 为 高价触发
                this.$refs.dialogWing.init(par);
              } else if (Number(this.buyPrice) < Number(this.newPriceto)) {//触发价小于最新价格
                let par = {
                  titleMessage: this.$t("trade.stopLossStopLoss"),
                  bugAsync: true,
                  firstMess: this.$t("trade.whenThNewPrice") + " ≤ " + this.buyPrice + this.currencys.sellCurrency + this.$t("trade.triggerPriceTo") + this.buyEntrustPrice + this.currencys.sellCurrency,
                  secondMess: this.buynumber + this.currencys.buyCurrency + this.$t("trade.order"),
                }
                this.PlanOrderType = 2;//触发价格小于市场价，则计划单类别 为 低价触发
                this.$refs.dialogWing.init(par);
              } else {//触发价等于委托价格
                this.$refs.dialogJustOk.init();
              }
              ///////////////////////////////////////////////////////////////////////////////////////////////////


            });
          }
        } else if (this.activeName == 4) {

          //   if(this.buyEntrustPrice*this.buynumber>this.currencys.sellcanUser){
          //      this.$message({showClose: true, message: this.$t("trade.amountTransactionExceed")+this.currencys.sellCurrency+this.$t("trade.availableQuantity"), type: 'error'});
          //       return;
          //   }else
          if (this.buyPrice == "" || this.buyPrice == 0 || /^[0-9]+\.$/.test(this.buyPrice)) {
            this.$message({showClose: true, message: this.$t("trade.enterCorrectTriggerPrice"), type: 'error'});
            return;
          } else if (this.buyEntrustPrice == "" || this.buyEntrustPrice == 0 || /^[0-9]+\.$/.test(this.buyEntrustPrice)) {
            this.$message({showClose: true, message: this.$t("trade.enterRightEntrustmentPrice"), type: 'error'});
            return;
          } else if (this.buynumber == "" || this.buynumber == 0 || /^[0-9]+\.$/.test(this.buynumber)) {
            this.$message({showClose: true, message: this.$t("trade.enterSurebuyInNumber"), type: 'error'});
            return;
          } else if (Number(this.buyEntrustPrice * this.buynumber) < Number(this.lastCashMoney)) {
            this.$message({showClose: true, message: this.$t("trade.amountNotLowerMinimum"), type: 'error'});
            return;
          } else {
            this.buyJudge(() => {
              if (Number(this.buyEntrustPrice * this.buynumber) > Number(this.currencys.sellcanUser)) {
                this.$message({
                  showClose: true,
                  message: this.$t("trade.amountTransactionExceed") + this.currencys.sellCurrency + this.$t("trade.availableQuantity"),
                  type: 'error'
                });
                return;
              }
              this.buyLoading = true;
              let par = {
                "currency": this.currencys.sellCurrency.toLowerCase(),
                "marketId": this.currencys.buyCurrency.toLowerCase() + "_" + this.currencys.sellCurrency.toLowerCase(),
                "audience": 0,
                "orderType": 1,//限价
                "planOrderType": 2,//抄底 低价
                "triggerPrice": this.buyPrice,
                "price": this.buyEntrustPrice,
                "Volume": this.buynumber
              }
              this.buyApi("/Order/SubmitPlanOrder", par);
            });
          }
        }
      },
      bugForlostLost() {
        this.buyLoading = true;
        let par = {
          "currency": this.currencys.sellCurrency.toLowerCase(),
          "marketId": this.currencys.buyCurrency.toLowerCase() + "_" + this.currencys.sellCurrency.toLowerCase(),
          "audience": 0,
          "orderType": 1,//限价
          "planOrderType": this.PlanOrderType,//追涨 高价
          "triggerPrice": this.buyPrice,
          "price": this.buyEntrustPrice,
          "Volume": this.buynumber
        }
        this.buyApi("/Order/SubmitPlanOrder", par);
      },
      dialogWingFn(bugAsync) {//止盈止损买卖点击确认，提示框提示返回回来的
        if (bugAsync) {//买
          this.bugForlostLost();
        } else {//卖
          this.sellForlostLost();
        }
      },
      buyJudge(fn) {//买的时候判断可用值是否变化
        let par = {
          "currency":[this.currencys.sellCurrency.toLowerCase()],
        }
        api.post("/User/GetUserBalance", par).then((res) => {
          let a = res.data.value.balances[this.currencys.sellCurrency.toLowerCase()];
          if (this.currencys.sellcanUser != a) {//买的时候获取可用值，如果不相同，变化成相同的
            this.currencys.sellcanUser = util.toFixed(a, this.accuracy);//可用额
            // this.buyCurrencyDiffent();
            this.priceToNew();
          }
          fn();
        }).catch((error) => {
        });
      },

      sellFn() {
        if (this.activeName == 1) {

          if (this.sellPrice == "" || this.sellPrice == 0 || /^[0-9]+\.$/.test(this.sellPrice)) {
            this.$message({showClose: true, message: this.$t("trade.enterSureSellPrice"), type: 'error'});
            return;
          } else if (this.sellnumber == "" || this.sellnumber == 0 || /^[0-9]+\.$/.test(this.sellnumber)) {
            this.$message({showClose: true, message: this.$t("trade.enterSureSellNumber"), type: 'error'});
            return;
          } else if (Number(this.sellPrice * this.sellnumber) < Number(this.lastCashMoney)) {
            this.$message({showClose: true, message: this.$t("trade.amountNotLowerMinimum"), type: 'error'});
            return;
          } else {
            this.sellJudge(() => {
              if (Number(this.sellnumber) > Number(this.currencys.buycanUser)) {
                this.$message({
                  showClose: true,
                  message: this.$t("trade.sellAmount") + this.currencys.buyCurrency + this.$t("trade.availableQuantity"),
                  type: 'error'
                });
                return;
              }
              this.sellLoading = true;
              let par = {
                "currency": this.currencys.buyCurrency.toLowerCase(),
                "marketId": this.currencys.buyCurrency.toLowerCase() + "_" + this.currencys.sellCurrency.toLowerCase(),
                "audience": 0,
                "orderType": 3,
                "price": this.sellPrice,
                "volume": this.sellnumber,
                "amount": 0
              }
              this.sellApi("/Order/SubmiOrder", par)

            })

          }
        } else if (this.activeName == 2) {

          if (this.sellnumber == "" || this.sellnumber == 0 || /^[0-9]+\.$/.test(this.sellnumber)) {
            this.$message({showClose: true, message: this.$t("trade.enterSureSellNumber"), type: 'error'});
            return;
          } else {

            this.sellJudge(() => {
              if (Number(this.sellnumber) > Number(this.currencys.buycanUser)) {
                this.$message({
                  showClose: true,
                  message: this.$t("trade.sellAmount") + this.currencys.buyCurrency + this.$t("trade.availableQuantity"),
                  type: 'error'
                });
                return;
              }
              this.sellLoading = true;
              let par = {
                "currency": this.currencys.buyCurrency.toLowerCase(),
                "marketId": this.currencys.buyCurrency.toLowerCase() + "_" + this.currencys.sellCurrency.toLowerCase(),
                "audience": 0,
                "orderType": 4,
                "price": 0,
                "volume": this.sellnumber,
                "amount": 0
              }
              this.sellApi("/Order/SubmiOrder", par)
            })
          }
        } else if (this.activeName == 3) {

          this.$emit("buySellPrice");//获取最新价格

          if (this.sellPrice == "" || this.sellPrice == 0 || /^[0-9]+\.$/.test(this.sellPrice)) {
            this.$message({showClose: true, message: this.$t("trade.enterCorrectTriggerPrice"), type: 'error'});
            return;
          } else if (this.sellEntrustPrice == "" || this.sellEntrustPrice == 0 || /^[0-9]+\.$/.test(this.sellEntrustPrice)) {
            this.$message({showClose: true, message: this.$t("trade.enterRightEntrustmentPrice"), type: 'error'});
            return;
          } else if (this.sellnumber == "" || this.sellnumber == 0 || /^[0-9]+\.$/.test(this.sellnumber)) {
            this.$message({showClose: true, message: this.$t("trade.enterSureSellNumber"), type: 'error'});
            return;
          } else if (Number(this.sellEntrustPrice * this.sellnumber) < Number(this.lastCashMoney)) {
            this.$message({showClose: true, message: this.$t("trade.amountNotLowerMinimum"), type: 'error'});
            return;
          } else {
            this.sellJudge(() => {
              if (Number(this.sellnumber) > Number(this.currencys.buycanUser)) {
                this.$message({
                  showClose: true,
                  message: this.$t("trade.sellAmount") + this.currencys.buyCurrency + this.$t("trade.availableQuantity"),
                  type: 'error'
                });
                return;
              }
              ///////////////////////////////////////////////////////////////////////////////////////////////////
              if (Number(this.sellPrice) > Number(this.newPriceto)) {//触发价大于最新价格
                let par = {
                  titleMessage: this.$t("trade.stopLossStopLoss"),
                  bugAsync: false,
                  firstMess: this.$t("trade.whenThNewPrice") + " ≥ " + this.sellPrice + this.currencys.sellCurrency + this.$t("trade.triggerPriceTo") + this.sellEntrustPrice + this.currencys.sellCurrency,
                  secondMess: this.sellnumber + this.currencys.buyCurrency + this.$t("trade.order"),
                }
                this.PlanOrderType = 1;//触发价格大于市场价，则计划单类别 为 高价触发
                this.$refs.dialogWing.init(par);
              } else if (Number(this.sellPrice) < Number(this.newPriceto)) {//触发价小于最新价格
                let par = {
                  titleMessage: this.$t("trade.stopLossStopLoss"),
                  bugAsync: false,
                  firstMess: this.$t("trade.whenThNewPrice") + " ≤ " + this.sellPrice + this.currencys.sellCurrency + this.$t("trade.triggerPriceTo") + this.sellEntrustPrice + this.currencys.sellCurrency,
                  secondMess: this.sellnumber + this.currencys.buyCurrency + this.$t("trade.order"),
                }
                this.PlanOrderType = 2;//触发价格小于市场价，则计划单类别 为 低价触发
                this.$refs.dialogWing.init(par);
              } else {//触发价等于委托价格
                this.$refs.dialogJustOk.init();
              }
              ///////////////////////////////////////////////////////////////////////////////////////////////////

            })
          }
        } else if (this.activeName == 4) {

          if (this.sellPrice == "" || this.sellPrice == 0 || /^[0-9]+\.$/.test(this.sellPrice)) {
            this.$message({showClose: true, message: this.$t("trade.enterCorrectTriggerPrice"), type: 'error'});
            return;
          } else if (this.sellEntrustPrice == "" || this.sellEntrustPrice == 0 || /^[0-9]+\.$/.test(this.sellEntrustPrice)) {
            this.$message({showClose: true, message: this.$t("trade.enterRightEntrustmentPrice"), type: 'error'});
            return;
          } else if (this.sellnumber == "" || this.sellnumber == 0 || /^[0-9]+\.$/.test(this.sellnumber)) {
            this.$message({showClose: true, message: this.$t("trade.enterSureSellNumber"), type: 'error'});
            return;
          } else {
            this.sellJudge(() => {
              if (Number(this.sellnumber) > Number(this.currencys.buycanUser)) {
                this.$message({
                  showClose: true,
                  message: this.$t("trade.sellAmount") + this.currencys.buyCurrency + this.$t("trade.availableQuantity"),
                  type: 'error'
                });
                return;
              }
              this.sellLoading = true;
              let par = {
                "currency": this.currencys.buyCurrency.toLowerCase(),
                "marketId": this.currencys.buyCurrency.toLowerCase() + "_" + this.currencys.sellCurrency.toLowerCase(),
                "audience": 0,
                "orderType": 3,//限价
                "planOrderType": 2,//止损 低价
                "triggerPrice": this.sellPrice,
                "price": this.sellEntrustPrice,
                "Volume": this.sellnumber
              }
              this.sellApi("/Order/SubmitPlanOrder", par);
            })
          }
        }
      },
      sellForlostLost() {
        this.sellLoading = true;
        let par = {
          "currency": this.currencys.buyCurrency.toLowerCase(),
          "marketId": this.currencys.buyCurrency.toLowerCase() + "_" + this.currencys.sellCurrency.toLowerCase(),
          "audience": 0,
          "orderType": 3,//限价
          "planOrderType": this.PlanOrderType,//止盈 高价
          "triggerPrice": this.sellPrice,
          "price": this.sellEntrustPrice,
          "Volume": this.sellnumber
        }
        this.sellApi("/Order/SubmitPlanOrder", par);
      },
      sellJudge(fn) {//买的时候判断可用值是否变化
        let par = {
          "currency": [this.currencys.buyCurrency.toLowerCase()],
        }
        api.post("/User/GetUserBalance", par).then((res) => {
          let a = res.data.value.balances[this.currencys.buyCurrency.toLowerCase()]; //res.data.value.items[0].balance;
          if (this.currencys.buycanUser != util.toFixed(a, this.volumePrecision)) {//买的时候获取可用值变化了
            this.currencys.buycanUser = util.toFixed(a, this.volumePrecision);//可用额
            this.sell.canUser = util.toFixed(a, this.volumePrecision);//滑动条最大值
            // this.sellCurrencyDiffent();
            this.priceToNew();
          }
          fn();

        }).catch((error) => {
        });
      },
      buyApi(src, par) {
        api.post(src, par).then((res) => {
          this.buyLoading = false;
          this.$message({showClose: true, message: this.$t("trade.buySuccess"), type: 'success',});
          // this.getAssetPageList(this.currencys.buyCurrency.toLowerCase(),this.currencys.sellCurrency.toLowerCase(),()=>{
          //   this.priceToNew();
          // })
          let a = new Decimal(res.data.value.balance);
          a = a.toFixed().toString();//accuracy
          this.currencys.sellcanUser = util.toFixed(a, this.accuracy);
          this.priceToNew();
        }, (err) => {
          this.buyLoading = false;
        }).catch((error) => {
          this.buyLoading = false;
        });
      },
      sellApi(src, par) {
        api.post(src, par).then((res) => {
          this.sellLoading = false;
          this.$message({showClose: true, message: this.$t("trade.sellSuccess"), type: 'success',});
          // this.getAssetPageList(this.currencys.buyCurrency.toLowerCase(),this.currencys.sellCurrency.toLowerCase(),()=>{
          //   this.priceToNew();
          // })
          let a = res.data.value.balance;
          this.currencys.buycanUser = util.toFixed(a, this.volumePrecision);
          this.sell.canUser = util.toFixed(a, this.volumePrecision);
          this.priceToNew();

        }, (err) => {
          this.sellLoading = false;
        }).catch((error) => {
          this.sellLoading = false;
        });
      },
      toLogin() {
        this.$router.push({name: "login"});
      },
      toCharge() {
        this.$router.push({name: "myAssets"});
      },
      changeServiceCharge() {
        //   console.log(this.howServiceCharge)
        //   console.log(this.serviceCharge)

        //   if(this.deductionSelect){
        //       this.serviceCharge = this.serviceCharge*this.howServiceCharge;//手续费
        //   }else{
        //       this.serviceCharge = this.serviceCharge/this.howServiceCharge;//手续费
        //   }
        if (this.$store.state.user.isLogin && this.$store.state.user.isSecVerification) {
          if (this.deductionSelect) {
            this.change = 0.06;//手续费
          } else {
            this.change = 0.2;//手续费
          }

          api.post('/User/UpdateAzcFeeSwitch', {isEnabled: this.deductionSelect}).then(() => {
            this.$message({
              message: this.deductionSelect ? this.$t("trade.feSettingSuccess") : this.$t("trade.feCloseSuccess"),
              showClose: true,
              type: 'success'
            });
          }).catch(() => {
          });
        }


      },
      scientificToNumber(num) {//解决科学记数法问题
        var str = num.toString();
        var reg = /^(\d+)(e)([\-]?\d+)$/;
        var arr, len,
          zero = '';

        /*6e7或6e+7 都会自动转换数值*/
        if (!reg.test(str)) {
          return num;
        } else {
          /*6e-7 需要手动转换*/
          arr = reg.exec(str);
          len = Math.abs(arr[3]) - 1;
          for (var i = 0; i < len; i++) {
            zero += '0';
          }

          return '0.' + zero + arr[1];
        }
      }

    }
  }
</script>
<style lang="scss" type="text/scss">
  .iconBox {
    float: left;
    position: relative;
    .iconQuestion {
      width: 14px;
      color: rgba(146, 154, 168, 1);
      margin-top: 10px;
      float: left;
      cursor: pointer;
      &:hover {
        color: rgba(201, 147, 62, 1);
      }
    }
    .iconDown {
      position: absolute;
      left: 0;
      top: -7px;
      display: none;
      color: rgba(51, 55, 64, 1);
    }
    .toolTip {
      display: none;
      position: absolute;
      width: 185px;
      left: -94px;
      bottom: 29px;
      background: rgba(51, 55, 64, 1);
      border-radius: 2px;
      font-size: 12px;
      padding: 15px;
      color: rgba(200, 206, 219, 1);
    }
  }

  .iconBox:hover .iconDown, .iconBox:hover .toolTip {
    display: block;
  }

  .trade-box {
    width: 100%;
    height: 100%;
    position: relative;
    .loginButton {
      height: 40px;
      position: absolute;
      bottom: 10px;
      width: calc((100% - 33px) / 2);
      font-family: HelveticaNeue-Medium;
    }
    .loginButton1 {
      left: 8px;
    }
    .loginButton2 {
      right: 8px;
    }

    .buyBg {
      background: rgba(10, 191, 116, 0.5) !important;
    }
    .sellBg {
      background: rgba(255, 92, 38, 0.5) !important;
    }
    .active {
      color: rgba(201, 147, 62, 1) !important;
      border-bottom: 2px solid rgba(201, 147, 62, 1) !important;
    }
    .tradtop {
      width: 100%;
      height: 40px;
      background: rgba(29, 32, 38, 1);;
      .tabBox {
        height: 40px;
        list-style: none;
        float: left;
        margin-left: 15px;
        li {
          float: left;
          color: rgba(146, 154, 168, 1);
          height: 38px;
          line-height: 38px;
          font-size: 14px;
          padding: 0 8px;
          cursor: pointer;
          border-bottom: 2px solid rgba(29, 32, 38, 1);
          &:hover {
            color: rgba(201, 147, 62, 1);
          }
        }
      }
      .tabRight {
        float: right;
        line-height: 38px;
        color: rgba(104, 110, 122, 1);
        font-size: 12px;
        margin-right: 8px;
      }
    }
    .cashtradeBox {
      // color:rgba(136,136,136,1);
      width: 100%;
      height: calc(100% - 40px);
      .eachcashtrade {
        height: 100%;
        width: calc((100% - 55px) / 2);
        float: left;
        position: relative;
      }
      .cashtradeBoxLeft {
        margin-left: 15px;
      }
      .cashtradeBoxRight {
        margin-left: 25px;
      }
      .cashHeader {
        width: 100%;
        height: 40px;
        line-height: 40px;
        .spanleft1 {
          font-size: 16px;
          font-family: PingFang-SC-Bold;
          color: rgba(45, 187, 112, 1);
          float: left;
        }
        .spanright1 {
          font-size: 16px;
          font-family: PingFang-SC-Bold;
          color: rgba(255, 90, 48, 1);
          float: left;
        }
        .charge {
          float: right;
          color: rgba(201, 147, 62, 1);
          cursor: pointer;
          font-size: 14px;
          &:hover {
            text-decoration: underline;
          }
        }
        .cashtitt {
          float: left;
          color: rgba(148, 151, 168, 1);
          font-size: 14px;
        }
        .allCash {
          float: left;
          color: rgba(148, 151, 168, 1);
          font-size: 14px;
          // max-width: 100px;
          // overflow:hidden;
          // white-space:nowrap;/*不显示的地方用省略号...代替*/
          // text-overflow:ellipsis;
        }

      }
      .borderBottomRadius {
        input {
          border-radius: 4px 4px 0 0 !important;
        }
      }
      .borderTopRadius {
        input {
          border-radius: 0 0 4px 4px !important;
        }
      }
      .price {
        // margin-top:8px;
        margin-top: 0;
        width: 100%;
        height: 40px;
        position: relative;
        input {
          width: 100%;
          height: 100%;
          border: 1px solid rgba(64, 68, 77, 1);
          border-radius: 4px;
          background: rgba(34, 38, 46, 1);;
          text-indent: 68px;
          color: rgba(240, 242, 246, 1);
          font-size: 14px;
          &:focus {
            outline: none;
            border: 1px solid rgba(104, 110, 122, 1);
          }
        }
        input[disabled] {
          border: none;
        }
        .span1 {
          position: absolute;
          left: 10px;
          top: 10px;
          color: rgba(85, 90, 102, 1);
          font-size: 14px;
          font-family: PingFang-SC-Regular;
        }
        .span2 {
          position: absolute;
          right: 10px;
          top: 10px;
          color: rgba(85, 90, 102, 1);
          font-size: 14px;
        }
      }
      .aboutPrice {
        text-indent: 50px;
        font-size: 12px;
        margin-top: 5px;
        height: 17px;
        font-size: 12px;
        line-height: 17px;
        width: 100%;
        color: #555A66;
      }
      .buyButton {
        position: absolute;
        left: 0;
        bottom: 10px;
        width: 100%;
        font-family: HelveticaNeue-Medium;
      }
      .buySider {
        position: relative;
        .el-slider {
          width: calc(100% - 16px);
          margin-left: 5px;
        }
        ul {
          position: absolute;
          left: 0;
          top: 0;
          list-style: none;
          width: calc(100% - 16px);
          margin-left: 5px;
          li {
            float: left;
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(34, 38, 46, 1);
            top: 12px;
            transform: translate(-50%);
            cursor: pointer;
          }
          .li1 {
            left: 0;
          }
          .li2 {
            left: 25%;
          }
          .li3 {
            left: 50%;
          }
          .li4 {
            left: 75%;
          }
          .li5 {
            left: 100%;
          }
        }
      }

    }
  }

  .addAllCash {
    left: 0;
    bottom: 60px;
    position: absolute;
    font-size: 14px;
    color: rgba(240, 242, 246, 1);
  }

  .buySider1 .li1 {
    background: rgba(10, 191, 116, 0.5) !important;
  }

  .buySider2 .li1 {
    background: rgba(255, 92, 38, 0.5) !important;
  }

  .cashtradeBox {
    ::-webkit-input-placeholder {
      color: rgba(104, 107, 122, 1) !important;
    }
  }

  .el-slider__runway {
    background: rgba(34, 38, 46, 1) !important;
  }

  .el-slider__button {
    border: none !important;
  }

  .buySider1 .el-slider__button {
    background-color: $--color-success;
    width: 12px;
    height: 12px;
  }

  .buySider1 .el-slider__bar {
    height: 4px;
    // background-color:$--color-success;
    background: rgba(10, 191, 116, 0.5);
  }

  .buySider2 .el-slider__button {
    background-color: $--color-danger;
    width: 12px;
    height: 12px;
  }

  .buySider2 .el-slider__bar {
    height: 4px;
    // background-color:$--color-danger;
    background: rgba(255, 92, 38, 0.5);
  }

  .el-slider__runway {
    height: 4px !important;
  }

  .el-slider__button-wrapper .el-tooltip {
    margin-top: -2px;
  }

  /* .tabRight .el-checkbox__input .el-checkbox__inner{
    background:rgba(62,62,62,1);
  } */
  .tabRight .el-checkbox__inner::after {
    border-color:  #000 !important;
  }

  .tabRight .el-checkbox__inner {
    border: 1px solid #4E4E4E;
    background-color: rgba(34, 38, 46, 1);
  }

  .tabRight .is-checked .el-checkbox__inner {
    background: #C9933E;
  }

  .tabRight .is-checked .el-checkbox__inner::after {
    border-color: #000;
  }

</style>

