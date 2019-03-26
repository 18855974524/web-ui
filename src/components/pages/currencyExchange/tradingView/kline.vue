<template>
  <div class="kline-panel">
    <div id="tv_chart_container">
    </div>
  </div>

</template>

<script>
  import datafeeds from './datafeed/datafeed.js';
  import tradingViewUtil from './udf/util'
  import $ from 'jquery'
  import api from '../../../../libs/api'
  export default {
    data() {
      return {
        klineStore:this.storeHandler,
      }
    },
    props:{
      selectedItem:{
        type:Object
      },
      storeHandler:{

      },
      wsc:{

      }
    },
    computed:{
      language(){
        return this.$store.state.user.language;
      },
    },
    watch:{
      language(val,old){
        if(val!==old && window.widget){
          this.tradingViewGetReady();
        }
      }
    },
    methods: {
      setFrequency(){
        this.klineStore.HaveSubscribedEndTimeDict = {};
        this.klineStore.GetBarsFunc = (request) => {
          // console.log('request', request);
          let key = request.market + '_' + request.resolution;
          let HaveSubscribedEndTime = this.klineStore.HaveSubscribedEndTimeDict[key];
          if (!HaveSubscribedEndTime) {
            HaveSubscribedEndTime = 0;
            this.klineStore.HaveSubscribedEndTimeDict[key] = 0;
          }
          if (HaveSubscribedEndTime == 0 || request.end < HaveSubscribedEndTime) {
            this.wsc.send('SetKLineFequency',{
              Market: request.market,
              Frequency: request.resolution,
              Start: request.start,
              End: request.end,
              Subscribe: HaveSubscribedEndTime == 0
            },()=>{
              HaveSubscribedEndTime = request.end;
              this.klineStore.HaveSubscribedEndTimeDict[key] = HaveSubscribedEndTime;
            });
          } else {
            this.klineStore.BatchProcess(request.market, request.resolution, []);
          }
        }
        this.tradingViewGetReady();
      },
      initWidget(params){
        window.widget = new TradingView.widget(tradingViewUtil.datafeedConfig(params));
        widget.onChartReady(() => {
          // $("iframe[id^='tradingview']")[0].contentWindow.document.querySelector('.tv-close-panel').click();
          tradingViewUtil.chartReady(widget);
        })
      },
      // tradeView准备
      async tradingViewGetReady() {
        if(!this.$store.state.dict.marketPrecision[this.$route.query.pair]){
          await this.$store.dispatch('asyncSetMarketPrecision');
        }
        let pricePrecision = this.$store.state.dict.marketPrecision[this.$route.query.pair].pricePrecision;
        let datafeed = new datafeeds.UDFCompatibleDatafeed(this.klineStore, this.$route.query.pair, Math.pow(10, pricePrecision || 8));
        let params = {
          resolution: "30",
          lang: this.language === 'cn'?'zh':'en',
          datafeed
        };
        if(TradingView.widget){
          this.initWidget(params);
        }else{
          TradingView.onready((() => {
            this.initWidget(params);
          }));
        }
      },
    },
    created(){
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  .kline-panel {
    background-color: #1D2026;
    height: 459px;
  }
</style>
<style>
  /*iframe{*/
    /*width:100%;*/
    /*height:320px;*/
  /*}*/
</style>
