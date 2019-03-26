<template>
  <div class="tra-min">
    <div class="card card-row">
      <div class="card-column primary-text-div">
        <p class="p-title">{{$t('tradeMining.todayTotal')}}</p>
        <p class="p-value primary-text">{{totalInfo.todayOutput|toNumFixed(aztShowPrecision)|noDataShow($t('myMining.calculating'))}}</p>
      </div>
      <div class="card-column">
        <p class="p-title">{{$t('tradeMining.yesterdayTotal')}}</p>
        <p class="p-value">{{totalInfo.yesterdayOutput|toNumFixed(aztShowPrecision)|noDataShow($t('myMining.calculating'))}}</p>
      </div>
      <div class="card-column">
        <p class="p-title">{{$t('tradeMining.allTotal')}}</p>
        <p class="p-value">{{totalInfo.totalOutput|toNumFixed(aztShowPrecision)|noDataShow($t('myMining.calculating'))}}</p>
      </div>
    </div>
    <div class="card card-row">
      <div class="card-column primary-text-div">
        <p class="p-title">{{$t('tradeMining.todayNotShareBonusNum')}}</p>
        <p class="p-value primary-text">{{totalInfo.todayBonusToUsdtVolume|toNumFixed(usdtShowPrecision)|noDataShow($t('myMining.calculating'))}}</p>
      </div>
      <div class="card-column">
        <p class="p-title">{{$t('tradeMining.yesterdayShareBonusNum')}}</p>
        <p class="p-value">{{totalInfo.yesterdayBonusToUsdtVolume |toNumFixed(usdtShowPrecision)|noDataShow($t('myMining.calculating'))}}</p>
      </div>
      <div class="card-column">
        <p class="p-title">{{$t('tradeMining.totalShareBonusNum')}}</p>
        <p class="p-value">{{totalInfo.totalBonusToUsdtVolume|toNumFixed(usdtShowPrecision)|noDataShow($t('myMining.calculating'))}}</p>
      </div>
    </div>
    <div class="card card-table">
      <p>
        <span class="tab" :class="{'active':curTab=='todayTab'}" @click="changeTab('todayTab')">{{$t('tradeMining.todayShareDetail')}}</span>
        <span class="tab" :class="{'active':curTab=='hisTab'}" @click="changeTab('hisTab')">{{$t('tradeMining.historyData')}}</span>
      </p>
      <el-table
        v-if="curTab === 'todayTab'"
        :data="dataList"
        :empty-text="$t(`message.${busy?'tableLoadingData':'tableNoData'}`)"
      >
        <el-table-column
          prop="currency"
          :label="$t('tradeMining.coinColumn')"
          width="160px"
        >
          <template slot-scope="scope">
            {{scope.row.currency?scope.row.currency.toLocaleUpperCase():''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="currentHourBonus"
          :label="$t('tradeMining.thisHourProfitColumn')"
          align="right"
          width="320px"
        >
          <template slot-scope="scope">
            {{scope.row.currentHourBonus|toNumFixed(coinPrecision[scope.row.currency]?coinPrecision[scope.row.currency].showPrecision:0)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="todayFeeVolume"
          :label="$t('tradeMining.todayProfitColumn')"
          align="right"
          width="360px"
        >
          <template slot-scope="scope">
            {{scope.row.todayFeeVolume|toNumFixed(coinPrecision[scope.row.currency]?coinPrecision[scope.row.currency].showPrecision:0)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="todayBonus"
          :label="$t('tradeMining.todayNotShareProfitColumn')"
          align="right"
          width="360px"
        >
          <template slot-scope="scope">
            {{scope.row.todayBonus|toNumFixed(coinPrecision[scope.row.currency]?coinPrecision[scope.row.currency].showPrecision:0)}}
          </template>
        </el-table-column>
      </el-table>
      <div v-else>
        <el-table
          :data="dataList"
          :empty-text="$t(`message.${busy?'tableLoadingData':'tableNoData'}`)">
          <el-table-column
            prop="date"
            :label="$t('tradeMining.dateColumn')"
            width="160px"
          >
            <template slot-scope="scope">
              {{scope.row.date|dateTime({onlyD:true})}}
            </template>
          </el-table-column>
          <el-table-column
            prop="usdtVolume"
            :label="$t('tradeMining.miningAZTColumn')"
            align="right"
            width="320px"
          >
            <template slot-scope="scope">
              {{scope.row.todayOutput|toNumFixed(aztShowPrecision)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="todayOutput"
            :label="$t('tradeMining.shareProfitColumn')"
            align="right"
            width="360px"
          >
            <template slot-scope="scope">
              {{scope.row.usdtVolume|toNumFixed(usdtShowPrecision)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="avgHourlyOutput"
            :label="$t('tradeMining.todayAvaLimitColumn')"
            align="right"
            width="360px"
          >
            <template slot-scope="scope">
              {{scope.row.avgHourlyOutput|toNumFixed(aztShowPrecision)}}
            </template>
          </el-table-column>
        </el-table>
        <p v-if="hasMore && !busy">
          <span class="load-btn" @click="loadHistoryMore">{{$t('message.loadMore')}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../../libs/api'

  export default {
    data() {
      return {
        curTab: 'todayTab',
        busy: false,
        totalInfo: {},
        historyPage: {
          pageIndex: 1,
          pageSize: 10
        },
        hasMore: true,
        dataList: [],
        aztShowPrecision:0,
        usdtShowPrecision:0,
      }
    },
    computed: {
      coinPrecision(c) {
        return this.$store.state.dict.coinPrecision
      },
    },
    methods: {
      changeTab(tabName) {
        this.curTab = tabName;
        if (tabName === 'todayTab') {
          this.getBonusToday();
        } else {
          this.historyPage.pageIndex = 1;
          this.dataList = [];
          this.getHistoryList();
        }
      },
      getHistoryList() {
        this.busy = true;
        api.post('/Mining/MiningHistory', this.historyPage)
          .then((res) => {
            this.dataList = this.dataList.concat(res.data.value.items);
            this.busy = false;
            this.hasMore = res.data.value.totalItems > this.historyPage.pageIndex * this.historyPage.pageSize;
          })
      },
      getBonusToday() {
        api.post('/Mining/GetBonusToday')
          .then((res) => {
            this.dataList = res.data.value;
          })
      },
      getTotalInfo() {
        api.post('/Mining/GetMiningTotalInfo')
          .then((res) => {
            this.totalInfo = res.data.value;
          })
      },
      loadHistoryMore() {
        this.historyPage.pageIndex++;
        this.getHistoryList();
      }
    },
    async created() {
      if(Object.keys(this.coinPrecision).length<1){
        await this.$store.dispatch('asyncSetCoinPrecision');
      }
      this.aztShowPrecision = this.coinPrecision.plz.showPrecision;
      this.usdtShowPrecision = this.coinPrecision.usdt.showPrecision;
      this.getTotalInfo();
      this.getBonusToday();
    },
  }
</script>

<style lang="scss" type="text/scss">
  .tra-min {
    .load-btn {
      display: inline-block;
      margin: 14px auto;
      color: #333740;
      font-size: 14px;
      cursor: pointer;
    }
  }
</style>
