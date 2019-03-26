<template>
  <div style="height:100%">
    <div class="currency-exchange main-container">
      <c-header :market="currencyPairItem"></c-header>
      <div class="top-row">
        <div class="left">
          <!--行情列表-->
          <market :selectedItem="currencyPairItem" :wsc="wsc" @selectedChange="changeCurrencyPairItem" :storeHandler="marketStore" ref="marketList"></market>
        </div>
        <div class="kline right">
          <!--k 线图-->
          <kline ref="kline" :wsc="wsc" :storeHandler="marketStore"></kline>
        </div>
      </div>
      <div class="middle-row">
        <order ref="orders" :wsc="wsc" :selectedItem="currencyPairItem" ></order>
      </div>
      <div class="bottom-row">
        <market-order ref="marketentrust" :wsc="wsc" :getId="currencyPairItem.id"></market-order>
      </div>
    </div>

  </div>


</template>

<script>
  import kline from './tradingView/kline'
  import Order from './order/order'
  import market from './market'
  import storeHandler from './storeHandler'
  import api from '../../../libs/api'
  import util from '../../../libs/util'
  import WSC from '../../../libs/websoket/wsConfig'
  import { Decimal } from 'decimal.js'
  import MarketOrder from '../../common/MarketOrder/marketorder'
  import CHeader from './header'
  import VueCookies from 'vue-cookie'

  export default {
    data() {
      return {
        kLineCache: {},
        marketStore: new storeHandler(),
        currencyPairItem: {
          id:this.$route.query.pair
        },
        coinSymbol:util.getCurrencySymbol(),
        wsc:new WSC(),
      }
    },
    components: {
      kline,
      Order,
      market,
      MarketOrder,
      CHeader
    },
    methods: {
      websocketStart() {
        this.wsc.start({
          "SingleKLine": (bar) => {
            //单条K线数据
            console.log('SingleKLine', bar);
            let newBar = {
              market: bar.Market,
              resolution: bar.Frequency,
              time: parseInt(bar.OpenTime.toString()) * 1000,
              open: bar.OpenPrice,
              high: bar.HighPrice,
              low: bar.LowPrice,
              close: bar.ClosedPrice,
              volume: bar.Volume
            };
            this.marketStore.SingleProcess(newBar.market, newBar.resolution, newBar);
          },
          "BatchKLine":  (batchData) =>  {
            //多条K线数据
            // console.log("BatchKLine", batchData);
            //处理数据
            let key = batchData.List[0].Market + '_' + batchData.List[0].Frequency;
            let cache = this.kLineCache[key];
            if (!cache) {
              this.kLineCache[key] = batchData.List;
            }
            else {
              batchData.List.forEach(function (bar) {
                cache.push(bar);
              });
            }
          },
          "BatchKLineSendComplate": (data) => {
            //批量K线发送完成，可以渲染
            // console.log('BatchKLineSendComplate', data, this.kLineCache);
            let key = data.Market + '_' + data.Frequency;
            let cache = this.kLineCache[key];
            let bars = [];
            if (cache && cache.length > 0) {
              cache.forEach(function (bar) {
                bars.push({
                  market: bar.Market,
                  resolution: bar.Frequency,
                  time: parseInt(bar.OpenTime.toString()) * 1000,
                  open: bar.OpenPrice,
                  high: bar.HighPrice,
                  low: bar.LowPrice,
                  close: bar.ClosedPrice,
                  volume: bar.Volume
                });
              });
            }
            this.marketStore.BatchProcess(data.Market, data.Frequency, bars, parseInt(data.Start.toString()), parseInt(data.End.toString()), data.IsStart);
            this.kLineCache[key] = [];
          },
          "ScrollDayKLine": (market) => {
            //市场行情列表
            // console.log('ScrollDayKLine data',market);
            let data = {
              id: market.Market,
              openPrice: market.OpenPrice,
              closedPrice: market.ClosedPrice,
              lowPrice: market.LowPrice,
              highPrice: market.HighPrice,
              volume: market.Volume,
            }
            this.$refs.marketList.updatePageStore(data);
          },
          "CreateOrder":  (data)=> {
            // 当前委托新增单
            // console.log("CreateOrder" + data);
            this.$refs.marketentrust.AddNowEnstrust(data);
          },
          "UpdateOrder": (data)=> {
            // 当前委托改变
            // console.log("UpdateOrder" + data);
            this.$refs.marketentrust.UpdateNowEnstrust(data);
          },
          "PlanOrderTrigger": (data) => {
            // 当前委托计划单触发
            // console.log("PlanOrderTrigger" + data)
            this.$refs.marketentrust.isTriggered(data);
          },
          "TradeSimpleDtoList": (data) => {
            // 最近成交列表
            // console.log("TradeSimpleDtoList:", data.List);
            this.$refs.marketentrust.Recentdeal(data);
          },
          "Error": (err) => {
            console.log(err);
            if(err.Code === 1001){
              this.$message({
                message:err.Message,
                type:'error',
                showClose:true
              });
              localStorage.removeItem('last_exchange_pair')
              this.$router.replace('/')
            }
          },
          "MarketDepthData":(data)=>{
            this.$refs.orders.getList(data);
          },
          "MarketDepthDiff":(data)=>{
            let array = data;
            // setTimeout(() => {
              this.$refs.orders.upDateList(array);
            // }, 500);

          }
        },this.$store.state.user.token || JSON.parse(VueCookies.get('token')));
        this.$refs.kline.setFrequency();
      },
      async changeCurrencyPairItem(data) {
        if(!data || !this.currencyPairItem.id){
          return;
        }
        this.currencyPairItem = Object.assign({},this.currencyPairItem,data);
        this.changePageTitle();
      },
      notExpire(time){
        return new Date().getTime() <= time;
      },
      getCurrencyPairData(currencyPair) {
        let data = this.marketStore.GetMarketItem(currencyPair);
        if (data) {
          this.changeCurrencyPairItem(data);
        }
      },
      toggleSelectedCurrencyCollect() {
        this.currencyPairItem.isUserCollected = !this.currencyPairItem.isUserCollected;
        if (!this.$store.state.user.isLogin) {
          this.$message({
            message: this.$t('message.loginTip'),
            type: 'warning',
            showClose: true
          })
          this.currencyPairItem.isUserCollected = !this.currencyPairItem.isUserCollected;
          return;
        }
        api.post(`/User/${!this.currencyPairItem.isUserCollected ? 'Cancel' : ''}CollectMarket`, {
          'id': this.currencyPairItem.id
        })
          .then(()=>{
            // 更新本地存储
            this.marketStore.SetMarketItem(this.currencyPairItem);
          })
          .catch(() => {
            this.currencyPairItem.isUserCollected = !this.currencyPairItem.isUserCollected
          });
      },
      changePageTitle(){
        document.title = `${this.currencyPairItem.closedPrice || ''} ${this.currencyPairItem.id.replace('_','/').toUpperCase()} - AZEX`;
      }
    },
    computed: {
      legalMoneyPerCurrency(val) {
        return this.$store.state.user.legalMoneyPerCurrency;
      }
    },
    mounted(){
      this.websocketStart();
    },
    created() {
      this.getCurrencyPairData(this.currencyPairItem.id);
      this.changePageTitle();
      // 存储当前交易对到 localStorage
      localStorage.setItem('last_exchange_pair',this.currencyPairItem.id)
    },
    beforeDestroy(){
      // 手动关闭 webSocket
      this.wsc.close();
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .currency-exchange {
    min-width: 1210px;
    margin: 0 auto;
    padding:0 5px;
    background-color: #13151A;
    min-height: 100%;

    // 滚动条样式
    ::-webkit-scrollbar{
      width: 5px;
      background: #1d1e26;
    }
    ::-webkit-scrollbar-thumb {
      width: 5px;
      background: #333540;
      border-radius:3px;
    }

    .top-row {
      display: flex;
      justify-content: space-around;
      margin-top: 5px;
      margin-bottom: 5px;
      .left {
        width: 30%;
        margin-right: 5px;
      }
      >.right {
        width: 70%;
        border-radius: 2px;
        overflow: hidden;
      }
    }
  }
</style>
