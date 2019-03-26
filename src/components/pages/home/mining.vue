<template>
    <div class="mining-home">
      <ul class="mining-ul">
        <li>
          <p class="title">
            {{$t('homepage.todayMining')}}
          </p>
          <h4 class="volment">
            <b class="shap icon-az-icon-logo"></b>
            {{miningData.todayOutput|toNumFixed(aztShowPrecision)|noDataShow($t('myMining.calculating'),true)}} AZT
          </h4>
          <p class="currentInfo">
            {{$t('homepage.currentBlock')}}
            <span>{{miningData.currentHourlyOutput|toNumFixed(aztShowPrecision)|noDataShow($t('myMining.calculating'),true)}} AZT/{{$t('homepage.hours')}}</span>
          </p>
          <p class="checkIt"><a href="#">{{$t('homepage.checkMining')}} ></a></p>
        </li>
        <li>
          <p class="title">
            {{$t('homepage.todayAllot')}}
          </p>
          <h4 class="volment">
            <b class="shap"></b>
            {{miningData.todayBonusToUsdtVolume|toNumFixed(usdtShowPrecision)|noDataShow($t('myMining.calculating'),true)}} USDT
          </h4>
          <p class="currentInfo">
            {{$t('homepage.todayKeep')}}
            <span>{{miningData.todayRate*100|toNumFixed(2)}}%</span>
          </p>
          <p class="checkIt"><a href="#">{{$t('homepage.checkDividend')}} ></a></p>
        </li>
        <li>
        <p class="title">
          {{$t('homepage.lastDayMining')}}
        </p>
        <h4 class="volment">
          <b class="shap icon-az-icon-logo"></b>
          {{miningData.yesterdayOutput|toNumFixed(aztShowPrecision)|noDataShow($t('myMining.calculating'),true)}} AZT
        </h4>
        <p class="currentInfo">
          {{$t('homepage.lastDayAllot')}}
          <span>{{miningData.yesterdayBonusToUsdtVolume|toNumFixed(usdtShowPrecision)|noDataShow($t('myMining.calculating'),true)}} USDT</span>
        </p>
        <p class="currentInfo lastNode">
          {{$t('homepage.lastDayKeep')}}
          <span>{{miningData.yesterdayRate*100|toNumFixed(2)}}%</span>
        </p>
      </li>
      </ul>
    </div>
</template>

<script>
  import api from '../../../libs/api'
  let TimerS=null;
  export default {
    name: "mining",
    data(){
      return {
        miningData:{
          //今日挖矿累计产出
          todayOutput:0,
          //今天待分配收入折合
          todayBonusToUsdtVolume:0,
          //当前块大小
          currentHourlyOutput:0,
          //昨日分配收入折合
          yesterdayBonusToUsdtVolume:0,
          //昨日挖矿产出
          yesterdayOutput:0
        },
        aztShowPrecision:0,
        usdtShowPrecision:0,
      }
    },
    mounted(){
    },
    destroyed(){
      this.closeTimers()
    },
    methods:{
      initminingData(){
        //初始化数据
        this.getData().then((res)=>{
          if(res=='success'){
            //获取数据之后开启定时刷新任务
            this.openTimers()
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      getData(){
          let defer=new Promise((resolve,reject)=>{
            api.post('/Mining/GetHomePageInfo').then((res)=>{
              Object.assign(this.miningData,res.data.value)
              resolve('success')
            }).catch(()=>{
              reject('false');
            })
          })
          return defer
      },
      TimerSwork(){
        //定时器执行的任务
        this.getData()
      },
      openTimers(){
        //开启定时任务
        if(!TimerS){
          TimerS=setInterval(()=>{
            this.TimerSwork()
            //10 秒钟轮询
          },10000)
        }
      },
      closeTimers(){
        //关闭定时任务
        if(TimerS){
          TimerS=clearInterval(TimerS)
        }
      }
    },
    computed:{
      coinPrecision(){
        return this.$store.state.dict.coinPrecision
      },
    },
    async created(){
      if(Object.keys(this.coinPrecision).length<1){
        await this.$store.dispatch('asyncSetCoinPrecision');
      }
      this.aztShowPrecision = this.coinPrecision.plz.showPrecision;
      this.usdtShowPrecision = this.coinPrecision.usdt.showPrecision;
      if(TimerS){
        this.closeTimers()
      }
      this.initminingData()
    },

  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.mining-home{
  width: 1200px;
  margin: 0 auto;
  .mining-ul{
    display: flex;
    justify-content: space-between;
    height: 100px;
    align-items: center;
    li{
      padding-left: 19px;
      border-left: 1px solid rgba(255,255,255,0.3);
      .title{
        line-height: 14px;
        font-size:14px;
        color: $font-color7;
        margin-bottom: 5px;
        opacity: 0.7;
      }
      .volment{
        font-size: 24px;
        line-height: 24px;
        height: 24px;
        font-weight: normal;
        color: $--color-primary;
        margin-bottom: 15px;
        .shape{

        }
      }
      .currentInfo{
        line-height: 14px;
        font-size:14px;
        color: $font-color7;
        margin-bottom: 10px;
        opacity: 0.7;
        &.lastNode{
          margin: 0;
        }
        span{
          line-height: 14px;
          display: inline-block;
          color: $--color-primary;
        }
      }
      .checkIt{
        line-height:14px;
        font-size:14px;
        color:$--color-primary;
        a{
          line-height: 14px;
          display: inline-block;
          &:hover{
            border-bottom: 1px solid $--color-primary;
          }
        }
      }
    }
  }
}
</style>
