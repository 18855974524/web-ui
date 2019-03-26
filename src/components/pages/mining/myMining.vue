<template>
  <div class="my-min">
    <div class="current-limit">
      <p class="l-t">{{$t('myMining.curLimit')}}</p>
      <p class="l-v">
        <span v-if="totalInfo.currentHourMiningOutput !== undefined">
           <i class="iconfont icon-az-icon-logo"></i>
           {{totalInfo.currentHourlyMiningOutput|toNumFixed(aztShowPrecision)}} AZT/{{$t('myMining.oneHour')}}
        </span>
        <span v-else>{{$t('myMining.calculating')}}</span>
      </p>
    </div>
    <div class="card card-row">
      <div class="card-column">
        <p class="p-title">{{$t('myMining.thisHourNum')}}</p>
        <p class="p-value">{{totalInfo.currentHourMiningOutput|toNumFixed(aztShowPrecision)|noDataShow($t('myMining.calculating'))}}</p>
      </div>
      <div class="card-column">
        <p class="p-title">{{$t('myMining.todayTotal')}}</p>
        <p class="p-value">{{totalInfo.todayMiningOutput|toNumFixed(aztShowPrecision)|noDataShow($t('myMining.calculating'))}}</p>
      </div>
      <div class="card-column">
        <p class="p-title">{{$t('myMining.yesterdayTotal')}}</p>
        <p class="p-value">{{totalInfo.yesterdayMiningOutput|toNumFixed(aztShowPrecision)|noDataShow($t('myMining.calculating'))}}</p>
      </div>
      <div class="card-column">
        <p class="p-title">{{$t('myMining.allTotal')}}</p>
        <p class="p-value">{{totalInfo.historyMiningOutput|toNumFixed(aztShowPrecision)|noDataShow($t('myMining.calculating'))}}</p>
      </div>
    </div>
    <div class="card card-row">
      <div class="card-column">
        <p class="p-title">{{$t('myMining.thisHourNotShareBonusNum')}}</p>
        <p class="p-value">{{totalInfo.preHourBonusToUsdt|toNumFixed(usdtShowPrecision)|noDataShow($t('myMining.calculating'))}}</p>
      </div>
      <div class="card-column">
        <p class="p-title">{{$t('myMining.todayNotShareBonusNum')}}</p>
        <p class="p-value">{{totalInfo.todayBonusToUsdt|toNumFixed(usdtShowPrecision)|noDataShow($t('myMining.calculating'))}}</p>
      </div>
      <div class="card-column">
        <p class="p-title">{{$t('myMining.yesterdayShareBonusNum')}}</p>
        <p class="p-value">{{totalInfo.yesterdayBonusToUsdt|toNumFixed(usdtShowPrecision)|noDataShow($t('myMining.calculating'))}}</p>
      </div>
      <div class="card-column">
        <p class="p-title">{{$t('myMining.totalShareBonusNum')}}</p>
        <p class="p-value">{{totalInfo.historyBonusToUsdt|toNumFixed(usdtShowPrecision)|noDataShow($t('myMining.calculating'))}}</p>
      </div>
    </div>
    <div class="card card-table">
      <div class="top-bar">
        <span class="tab" :class="{'active':curTab=='miningDet'}" @click="changeTab('miningDet')">{{$t('myMining.miningDetail')}}</span>
        <span class="tab" :class="{'active':curTab=='shareDet'}" @click="changeTab('shareDet')">{{$t('myMining.shareDetail')}}</span>
        <el-date-picker
          :clearable="false"
          class="date-picker"
          v-model="filter.selDate"
          type="date"
          @change="getDataList"
          value-format="timestamp"
          :placeholder="$t('myMining.selectDatePlc')">
        </el-date-picker>
      </div>
      <el-table
        v-if="curTab === 'miningDet'"
        :data="dataList"
        :empty-text="$t(`message.${busy?'tableLoadingData':'tableNoData'}`)"
      >
        <el-table-column
          prop="createTime"
          :label="$t('myMining.dateColumn')"
          width="230px"
        >
          <template slot-scope="scope">
            {{scope.row.createTime|dateTime({notS:true})}}
          </template>
        </el-table-column>
        <el-table-column
          prop="volume"
          :label="$t('myMining.limitColumn')"
          align="right"
          width="440px"
        >
          <template slot-scope="scope">
            {{scope.row.volume|toNumFixed(aztShowPrecision)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="currentHourlyOutput"
          :label="$t('myMining.profitColumn')"
          align="right"
          width="530px"
        >
          <template slot-scope="scope">
            {{scope.row.currentHourlyOutput|toNumFixed(aztShowPrecision)}}
          </template>
        </el-table-column>
      </el-table>
      <div class="shareDetTable" v-else>
        <el-tooltip class="date-icon-tip" effect="dark" :content="$t('myMining.shareBonusTip')" placement="bottom-start">
          <i class="iconfont icon-az-icon-information- primary-text"></i>
        </el-tooltip>
        <el-table
          :data="dataList"
          :empty-text="$t(`message.${busy?'tableLoadingData':'tableNoData'}`)"
        >
          <el-table-column
            prop="createTime"
            :label="$t('myMining.dateColumn')"
            width="230px"
          >
            <template slot-scope="scope">
              {{scope.row.createTime|dateTime({notS:true})}}
            </template>
          </el-table-column>
          <el-table-column
            prop="currency"
            :label="$t('myMining.coinColumn')"
            align="right"
            width="440px"
          >
            <template slot-scope="scope">
              {{scope.row.currency?scope.row.currency.toUpperCase():''}}
            </template>
          </el-table-column>
          <el-table-column
            prop="bonusVolume"
            :label="$t('myMining.bonusColumn')"
            align="right"
            width="530px"
          >
            <template slot-scope="scope">
              {{scope.row.bonusVolume|toNumFixed(coinPrecision[scope.row.currency]?coinPrecision[scope.row.currency].showPrecision:0)}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../../libs/api'
  export default {
    data() {
      return {
        curTab:'miningDet',
        busy:false,
        filter:{
          selDate:new Date().setHours(0,0,0,0)
        },
        totalInfo:{

        },
        dataList:[],
        aztShowPrecision:0,
        usdtShowPrecision:0,
      }
    },
    computed:{
      coinPrecision(c){
        return this.$store.state.dict.coinPrecision
      },
    },
    methods: {
      changeTab(tabName){
        this.curTab = tabName;
        this.getDataList();
      },
      getTotalInfo(){
        api.post('/Mining/GetUserMiningInfo')
          .then((res)=>{
            this.totalInfo = res.data.value;
          })
      },
      getDataList(){
        if(this.curTab === 'miningDet'){
          this.getMiningList();
        }else{
          this.getBonusList();
        }
      },
      getDateParams(){
        let params = {
          startTime:this.filter.selDate/1000,
          endDate:this.filter.selDate/1000 + 24*60*60 -1
        };
        console.log(params);
        return params;
      },
      getMiningList(){
        api.post('/Mining/GetUserMiningAllotHistory',this.getDateParams())
          .then((res)=>{
            this.dataList = res.data.value;
          })
      },
      getBonusList(){
        api.post('/Mining/GetBonusToday',this.getDateParams())
          .then((res)=>{
            this.dataList = res.data.value;
          })
      },
    },
    async created() {
      if(Object.keys(this.coinPrecision).length<1){
        await this.$store.dispatch('asyncSetCoinPrecision');
      }
      this.aztShowPrecision = this.coinPrecision.plz.showPrecision;
      this.usdtShowPrecision = this.coinPrecision.usdt.showPrecision;
      this.getTotalInfo();
      this.getDataList();
    },
  }
</script>

<style scoped lang="scss" type="text/scss">
  .my-min{
    .current-limit{
      margin:40px 0 60px;
      text-align: center;
      .l-t{
        color:#fff;
        opacity: 0.5;
        font-size:24px;
      }
      .l-v{
        color:#E6A82E;
        font-size: 40px;
        line-height: 44px;
        margin-top:20px;
        i{
          font-size:34px;
        }
      }
    }
    .card{
      &.card-table{
        .top-bar{
          padding: 0 60px;
          text-align: left;
          display: flex;
          align-items: center;
          position:relative;
          .tab{
            width:160px;
          }
          .tab-tip{
            display: inline-block;
            font-size:12px;
            color:#BAC2D1;
            margin-left:26px;
            width:470px;
            line-height: 20px;
          }
          .date-picker{
            position: absolute;
            right:60px;
            background:#FFF;
          }
        }
        .shareDetTable{
          position:relative;
          .date-icon-tip{
            position:absolute;
            left:88px;
            top:14px;
            z-index:3;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
