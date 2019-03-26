<template>
  <div class="market-info">
    <div class="top-panel">
      <div class="flex-div" v-if="curItem.id">
        <div class="cur-icon">
          <img class="icon-bg" :src="`/image/currency/web_${curItem.target}.png`|hostImgPath" alt="">
          <!--<div class="icon-bg" :class="curItem.target">-->
            <!--<i :class="`icon-${curItem.target}`"></i>-->
          <!--</div>-->
        </div>
        <div class="cur-info">
          <p class="openSans">
            {{curItem.id.toUpperCase().replace('_','/')}}
          </p>
          <p>
            <span class="label">{{$t('kline.amount')}}</span>
            {{curItem.volume|scientific|toNumFixed(2)|noDataShow('--')}} {{curItem.id.split('_')[0].toUpperCase()}}
          </p>
          <p>
            <span class="label">{{$t('kline.low')}}</span> {{curItem.lowPrice|scientific|noDataShow('--')}}
          </p>
        </div>
        <div class="h24-info">
          <p>
            {{curItem.closedPrice|scientific|noDataShow('--')}}
          </p>
          <p>
            <span class="label">{{$t('kline.increaseAmount')}}</span>
            <span :class="{'success-text':curItem.increase24h>0,'danger-text':curItem.increase24h<0}">
              {{curItem.increase24h>0?'+':''}}{{curItem.increase24h|noDataShow('--')}}<span v-if="curItem.increase24h!==undefined">%</span>
            </span>
          </p>
          <p>
            <span class="label">{{$t('kline.high')}}</span> {{curItem.highPrice|scientific|noDataShow('--')}}
          </p>
        </div>
      </div>
    </div>
    <div class="market-list">
      <div class="opr-bar">
        <div class="tab" :class="{'active':curTab=='fav'}" @click="setCurTab('fav')">
          <i class="iconfont icon-el-icon-star-"></i>
        </div>
        <div class="tab" :class="{'active':curTab=='usdt'}" @click="setCurTab('usdt')">
          USDT
        </div>
        <div class="tab" :class="{'active':curTab=='btc'}" @click="setCurTab('btc')">
          BTC
        </div>
        <div class="tab" :class="{'active':curTab=='eth'}" @click="setCurTab('eth')">
          ETH
        </div>
        <div class="search-bar">
          <!--<div class="searchBox" v-if="searchEnable">-->
            <!--<i class="iconfont icon-az-icon-search"></i>-->
            <!--<el-input v-model="keyword" ref="searchInput" @blur="closeSearchInput"-->
                      <!--:placeholder="$t('kline.searchPlaceholder')" @input="searchCurrency"></el-input>-->
          <!--</div>-->
          <!--:placeholder="$t('kline.searchPlaceholder')"-->
          <el-input v-model="keyword" ref="searchInput" size="mini"
           @input="searchCurrency"></el-input>
          <i class="iconfont icon-az-icon-search" @click="enableSearch"></i>
        </div>
      </div>
      <div class="table">
        <div class="title row">
          <div class="col">

          </div>
          <div class="col">
            {{$t('kline.currencyPair')}}
          </div>
          <div class="col">
            {{$t('kline.recentPrice')}}
          </div>
          <div class="col">
            {{$t('kline.upDownPercent24')}}
          </div>
        </div>
        <div class="content-list">
          <div class="row" v-for="item in marketList"
               :class="{'selected':item.id === selectedItem.id}"
               @click="changePair(item.id)"
               @mouseenter="setCurPair(item.id)"
               @mouseout="mouseLeaveItem(item.id)"
          >
            <div class="col">
              <i class="iconfont icon-el-icon-star-" @click="collectItem($event,item)"
                 :class="{'active':item.isUserCollected}"></i>
            </div>
            <div class="col">
              {{item.id.toUpperCase().replace('_','/')}}
            </div>
            <div class="col" :class="{'success-text':item.increase==1,'danger-text':item.increase==-1}">
              {{item.closedPrice|scientific|noDataShow('--')}}
            </div>
            <div class="col">
              <span :class="{'success-text':item.increase24h>0,'danger-text':item.increase24h<0}">
                {{item.increase24h>0?'+':''}}{{item.increase24h|noDataShow('--')}}<span v-if="item.increase24h!==undefined">%</span>
              </span>
            </div>
          </div>
          <div class="no-data" v-if="!busy&&!Object.keys(marketList).length">
            {{$t(`kline.${curTab==='fav'?'noFavorites':'noData'}`)}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../../libs/api'
  import storeHandler from './storeHandler'
  import VueCookies from 'vue-cookie'

  export default {
    data() {
      return {
        curTab: this.$route.query.tab || this.$route.query.pair.split('_')[1],
        keyword: '',
        // searchEnable: false,
        // page:{
        //   pageIndex:1,
        //   pageSize:16
        // },
        marketList: {},
        favoriteList:{},
        historySendList: {},
        marketStore: this.storeHandler,
        curItem:{},
        busy:false,
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
    methods: {
      setCurTab(tab) {
        this.curTab = tab;
        this.getMarketList();
      },
      updatePageStore(data){
        if(data){
          let marketRow = this.marketStore.SetMarketItem(Object.assign({},this.marketList[data.id],data));
          // 更新当前页面存储
          this.marketList[marketRow.id] = Object.assign({},this.marketList[marketRow.id],{
            frequencys: marketRow.frequencys,
            openPrice: marketRow.openPrice,
            closedPrice: marketRow.closedPrice,
            lowPrice: marketRow.lowPrice,
            highPrice: marketRow.highPrice,
            volume: marketRow.volume,
            isUserCollected: marketRow.isUserCollected || false,
            increase: marketRow.increase,
            increase24h: marketRow.increase24h
          });
          (marketRow.id === this.curItem.id) && (this.curItem = this.marketList[this.curItem.id]);
          (marketRow.id === this.selectedItem.id) && (this.setSelectedPair(this.selectedItem.id));
        }
      },
      setCurPair(id){
        if(this.marketList[id]){
          this.curItem = this.marketList[id];
        }else{
          this.curItem = this.selectedItem;
        }
      },
      setSelectedPair(id){
        this.$emit('selectedChange',this.marketList[id])
      },
      changePair(id){
        if(id !== this.selectedItem.id){
          window.location.href = `/mk?pair=${id}&tab=${this.curTab}`;
        }
      },
      mouseLeaveItem(id){
        setTimeout(()=>{
          if(this.curItem.id === id){
            this.curItem = this.selectedItem;
          }
        },200)
      },
      startSendWSCommand() {
        let list = [];
        for(let key in this.marketList){
          if (!this.historySendList[key]) {
            // 避免多次发送相同的 market
            let data = {
              Market: key,
              Frequencys: ['SD1']
            };
            list.push(data);
            this.historySendList[key] = data;
          }
        }
        if(list.length){
          this.wsc.send("SetReceiveOtherMarketKLine", {Items: list}, function () {
            //市场行情列表
            console.log('ScrollDayKLineSuc', list);
          });
        }
      },
      addCollectionByInitList(list = this.marketList){
        for(let k in list){
          this.marketStore.SetMarketItem(list[k]);
        }
      },
      async getCollectedMarketList(){
        let obj = {};
        let login  = this.$store.state.user.isLogin || JSON.parse(VueCookies.get('token'))&&JSON.parse(VueCookies.get('isSecVerification'));
        if(login) {
          await api.post('/User/GetUserCollectList')
            .then((res) => {
              obj = this.transListToObj(res.data.value.items,'id',{isUserCollected:true});
            })
        }
        return obj;

      },
      getMarketList() {
        this.busy = true;
        if (this.curTab === 'fav') {
          this.getCollectedMarketList().then((obj)=>{
            this.marketList = obj;
            this.setSelectedPair(this.selectedItem.id);
            if(!this.curItem.id){
              this.setCurPair(this.selectedItem.id);
            }
            this.addCollectionByInitList();
            this.startSendWSCommand();
            this.busy = false;
          },()=>{
            this.busy = false;
          })
        } else {
          api.post('/Market/GetMarketBriefInfoList', {
            'basic': this.curTab
          })
            .then((res) => {
              this.marketList = this.transListToObj(res.data.value.items,'id');
              // console.log(this.marketList);
              this.setSelectedPair(this.selectedItem.id);
              if(!this.curItem.id){
                this.setCurPair(this.selectedItem.id);
              }
              this.addCollectionByInitList();
              this.startSendWSCommand();
              this.busy = false;
            },()=>{
              this.busy = false;
            })
        }
      },
      transListToObj(arr,key,specProperty={}){
        let obj = {};
        arr.forEach((market)=>{
          let id = market.id || market;
          let data = this.marketStore.GetMarketItem(id) || {[key]:id,basic:id.split('_')[1],target:id.split('_')[0]};
          obj[id] = {...data,...specProperty};
        })
        return obj;
      },
      enableSearch() {
        this.searchEnable = true;
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      },
      searchCurrency() {
        this.keyword = this.keyword.toUpperCase();
        let res = this.marketStore.SearchMarketsCollection(this.keyword,this.curTab);
        this.marketList = this.transListToObj(res,'id');
      },
      closeSearchInput() {
        if (!this.keyword.trim()) {
          this.searchEnable = false;
        }
      },
      collectItem(e,item) {
        e.stopPropagation();
        item.isUserCollected = !item.isUserCollected;
        if (!this.$store.state.user.isLogin) {
          this.$message({
            message: this.$t('message.loginTip'),
            type: 'warning',
            showClose: true
          })
          item.isUserCollected = !item.isUserCollected;
          return;
        }
        api.post(`/User/${!item.isUserCollected ? 'Cancel' : ''}CollectMarket`, {
          'id': item.id
        })
          .then(()=>{
            // 更新本地存储
            this.marketStore.SetMarketItem(item);
          })
          .catch(() => {
            item.isUserCollected = !item.isUserCollected
          });
      }
    },
    created() {
      this.getMarketList();
      this.getCollectedMarketList().then((obj)=>{
        this.addCollectionByInitList(obj);
      })
    },
  }
</script>

<style lang="scss" type="text/scss">
  .market-info {
    border-radius: 2px;
    background-color: #1D2026;
    .top-panel {
      padding: 20px 0;
      height:101px;
      box-sizing: border-box;
      .flex-div {
        display: flex;
        align-items: center;
        justify-content: center;
        color:#C8CEDB;
        div {
          p {
            font-size: 12px;
            margin-bottom: 4px;
            &:first-child {
              font-size: 14px;
            }
            .label{
              color:#686E7A;
            }
          }
          &.cur-icon {
            width: 22%;
            text-align: center;
            .icon-bg{
              display: inline-block;
              width:40px;
              height:40px;
              line-height:40px;
              border-radius: 50%;
              overflow: hidden;
            }
            i {
              font-size: 32px;
              color: #fff;
            }
            img{
              width:40px;
              height:40px;
              border-radius: 50%;
            }
          }
          &.cur-info {
            width: 42%;
          }
          &.h24-info {
            width: 36%;
          }
        }
      }
    }
    .market-list {
      .opr-bar {
        display: flex;
        height: 40px;
        position: relative;
        width: 100%;
        align-items: center;
        .tab {
          color: #929AA8;
          font-size: 14px;
          padding: 5px 0;
          margin:0 15px;
          cursor: pointer;
          i {
            font-size: 14px;
          }
          &.active {
            color: $--color-primary;
            border-bottom: 1px solid $--color-primary;
            line-height: 16px;
          }
        }
        .search-bar {
          position: absolute;
          right: 15px;
          top: 6px;
          background:rgba(34,38,46,1);
          border-radius:4px;
          border:1px solid rgba(64,68,77,1);
          width:90px;
          i {
            position: absolute;
            right: 6px;
            top: 6px;
            color: #929AA8;
            font-size: 14px;
          }
        }
      }
      .table {
        width: 100%;
        .row {
          height: 28px;
          line-height: 28px;
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          &.title {
            .col {
              color: #686E7A;
              &:last-child {
                text-align: right;
              }
            }
          }
          .col {
            color: #C8CEDB;
            padding: 0 15px;
            text-align: left;
            flex-grow: 1;
            &:first-child {
              width: 34px;
              box-sizing: border-box;
              flex-grow: 0;
            }
            &:nth-child(2){
              width:40%;
            }
            &:nth-child(3){
              width:40%;
            }
            &:last-child {
              min-width: 100px;
              box-sizing: border-box;
              padding-left:0;
              flex-grow: 0;
              text-align: right;
            }
            i {
              color: #40444D;
              font-size: 14px;
              &.active {
                color: $--color-primary;
              }
            }
          }
        }
        .content-list {
          height: 290px;
          overflow: auto;
          .row {
            cursor: pointer;
            &:hover,
            &.selected {
              background-color: #22262E;
            }
          }
          .no-data{
            text-align:center;
            margin-top:135px;
            font-size:14px;
            color:rgba(146,154,168,1);
          }
        }
      }
    }
  }
  #app {
    .market-info {
      .search-bar {
        .el-input {
          .el-input__inner {
            width: 100%;
            padding-right: 20px;
            padding-left: 10px;
            background-color: transparent;
            color: #F0F1F7;
            border: none;
          }
          ::-webkit-input-placeholder { /*WebKit browsers*/
            color: #555A66;
            font-size: 12px;
          }
          ::-moz-placeholder { /*Mozilla Firefox*/
            color: #555A66;
            font-size: 12px;
          }
          :-moz-placeholder { /*Mozilla Firefox*/
            color: #555A66;
            font-size: 12px;
          }
          :-ms-input-placeholder { /*Internet Explorer*/
            color: #555A66;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
