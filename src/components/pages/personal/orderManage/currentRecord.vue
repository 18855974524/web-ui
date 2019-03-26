<template>
  <div class="recordTables emptyBlock"  v-cloak>
    <div class="currenrRecord">
      <div class="lefts">
       <!-- <div class="seachFix">
          <el-select popper-class="searchEs" @blur=""  size="small" :filter-method="commonSearch1" v-model="selectVal1" filterable :placeholder="$t('disposit.choice')">
            <el-option
              class="seaechMod"
              v-for="item in options1"
              :key="item.id"
              :label="item.id.toLocaleUpperCase()"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="breadcrumb">/</div>
        <div class="selectFix">
          <el-select popper-class="searchEs"  @blur="" :filter-method="commonSearch2" size="small" v-model="selectVal2" filterable :placeholder="$t('disposit.choice')">
            <el-option
              class="seaechMod"
              v-for="item in options2"
              :key="item.id"
              :label="item.id.toLocaleUpperCase()"
              :value="item.id">
            </el-option>
          </el-select>
        </div>-->
        <div style="width: 180px">
          <el-cascader
            :popper-class="'queue-cascader'"
            expand-trigger="hover"
            :placeholder="$t('disposit.choice')"
            size="small"
            filterable
            :options="marketDataList"
            @change="changeSelectVal"
            v-model="selectMarketData">
          </el-cascader>
        </div>
        <div class="searchBtn">
          <el-button type="primary" size="small" icon="el-icon-search" :disabled="checkSearch" @click.prevent.stop="getTrading(true)">{{$t('disposit.search')}}</el-button>
        </div>
      </div>
      <div class="rights">
        <el-dropdown trigger="click"   @command="handleCommandRepeal">
          <el-button  size="small" type="primary" >{{$t('disposit.repealAll')}}</el-button>
          <el-dropdown-menu  slot="dropdown" class="allrepal">
            <el-dropdown-item :disabled="checkRepal" command="1">{{$t('disposit.repealAllLimitOrder')}}</el-dropdown-item>
            <el-dropdown-item :disabled="checkRepal" command="2">{{$t('disposit.repealAllPlannedOrder')}}</el-dropdown-item>
            <el-dropdown-item :disabled="checkRepal" v-show="this.selectMarketData.length" command="3">{{$t('disposit.repealcurrentLimitOrder')}}</el-dropdown-item>
            <el-dropdown-item :disabled="checkRepal" v-show="this.selectMarketData.length" command="4">{{$t('disposit.repealcurrentPlannedOrder')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="listTable">
      <ul  class="headerUl">
        <li>{{$t('disposit.time')}}</li>
        <li>{{$t('disposit.market')}}</li>
        <li>
          <el-dropdown trigger="hover" @command="handleCommandBuy">
            <span class="el-dropdown-link">
              {{$t('disposit.buy')}}/{{$t('disposit.sell')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown"  class="options">
              <el-dropdown-item command="1">{{$t('disposit.checkallOrder')}}</el-dropdown-item>
              <el-dropdown-item command="2">{{$t('disposit.checkbuyOrder')}}</el-dropdown-item>
              <el-dropdown-item command="3">{{$t('disposit.checksellOrder')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li>
          <el-dropdown trigger="hover" @command="handleCommandType">
            <span class="el-dropdown-link">
              {{$t('disposit.alltypes')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="options" >
              <el-dropdown-item command="1">{{$t('disposit.checkAlltypes')}}</el-dropdown-item>
              <el-dropdown-item command="2">{{$t('disposit.checklimitOrder')}}</el-dropdown-item>
              <el-dropdown-item command="3">{{$t('disposit.checkPlanOrder')}}</el-dropdown-item>
              <el-dropdown-item command="4">{{$t('disposit.checkMarketOrder')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li>{{$t('disposit.entrustPrice')}}</li>
        <li>{{$t('disposit.entrustQuantity')}}</li>
        <li>{{$t('disposit.turnover')}}</li>
        <li>{{$t('disposit.turnoverRate')}}</li>
        <li>{{$t('disposit.operation')}}</li>
      </ul>
      <ul class="contenUl"  v-loading="loading" v-cloak>
        <li v-for="item in tableDatas" v-show="tableDatas.length">
          <ul class="contenInUl">
            <li class="openSans">{{item.createTime|dateTime|sliceFilter}}</li>
            <li class="openSans">
              <span>{{item.market.split('_')[0].toLocaleUpperCase()}}</span>
              <span class="lightSpan">/ {{item.market.split('_')[1].toLocaleUpperCase()}}</span>
            </li>
            <li :class="(item.orderType==1||item.orderType==2)?'buyIn':'buyOut'">{{(item.orderType==1||item.orderType==2)?$t('disposit.buyIn'):$t('disposit.buyOut')}}</li>
            <!--<li>{{item.planType==1?$t('disposit.LowTriggered'):$t('disposit.HeighTriggered')}}/{{item.triggerPrice}}</li>-->
            <li>{{item.category==1?((item.orderType==1||item.orderType==3)?$t('disposit.limit'):$t('disposit.marketprice1')):$t('disposit.zyzs')+(item.planType==2?'≤'+item.triggerPrice:'≥'+item.triggerPrice)}}{{item.category==1?'':`/${item.triggerPrice?etoNumber(item.triggerPrice,marketPrecision[item.id]?marketPrecision[item.id].pricePrecision:0):0}`+$t('disposit.Triggered')}}</li>
            <li class="openSans">{{item.category==1?(item.orderType==1||item.orderType==3)?etoNumber(item.price,marketPrecision[item.market]?marketPrecision[item.market].pricePrecision:0):$t('disposit.marketprice2'):etoNumber(item.price,marketPrecision[item.market]?marketPrecision[item.market].pricePrecision:0)}}</li>
            <li class="openSans">{{etoNumber(item.volume,marketPrecision[item.market]?marketPrecision[item.market].volumePrecision:0)}}</li>
            <li class="openSans">{{etoNumber(item.tradeAmount,marketPrecision[item.market]?marketPrecision[item.market].pricePrecision:0)}}</li>
            <li>
              <!--(NoTrigger,1)=[订单还未触发(计划订单专用)] | (Open,2)=[订单正常进行中] | (Done,3)=[订单已完成] | (Canceled,4)=[订单已取消]-->
              <span v-if="item.status == 1">{{$t('marketOrder.NotTrigger')}}</span>
              <span v-if="item.status == 2 && !(item.category == 1 && item.orderType == 2)">{{FloatNum(item.tradedVolume, item.volume) * 100|toNumFixed(2)|scientific}}%</span>
              <span v-if="item.status == 3 ">100.00%</span>
              <!--<span style="font-size:12px;font-family:OpenSans;color:#E6E8ED;" v-if="(scope.row.orderType == 4 || scope.row.orderType == 2) && scope.row.category == 1">0.00%</span>-->
              <span v-if="item.status == 2 && item.category == 1 && item.orderType == 2">{{FloatNum(item.tradeAmount, item.amount) * 100|toNumFixed(2)|scientific}}%</span>
            </li>
            <li><a class="repeal" @click.prevent.stop="repeal(item)">{{$t('disposit.revocation')}}</a></li>
          </ul>
        </li>
        <li v-for="j in tempLen" v-if="tempLen<10"></li>
        <no-data-tip v-show="!tableDatas.length"></no-data-tip>
      </ul>
    </div>
    <div class="block" style="font-family: PingFang-SC-Regular-Medium" v-show="totalPage>1">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  /*import topBar from './topBar'*/
  import api from '../../../../libs/api'
  import util from '../../../../libs/util'
  import commonFilter from '../../../../libs/commonFilter'
  import noDataTip from '../../../common/noDataTip'
  import Decimal from 'decimal.js'
  export default {
    props:{
      marketPrecision:{
        type:Object,
        default:()=>{
          return {}
        }
      }
    },
    data() {
      return {
        total:1,//默认数据总数
        pagesize:10,//每页的数据条数
        currentPage:1,//默认开始页面
        totalPage:0,
        loading:false,
        tableDatas:[],
        checkSearch:false,
        checkRepal:false,
        tempLen:0,
        selectMarketData:[],
        marketDataList: [],
        Decimal:Decimal,
        etoNumber:util.toFixed,
        orderParams:{
          //市场id.'btc_eth'
          marketId:'',

          //订单状态array maxLength: 4 minLength: 1, 1=[订单还未触发(计划订单专用)],2=[订单正常进行中],3=[订单已完成],4=[订单已取消],0=[所有] [1-2,代表当前] [3-4代表历史]
          orderStatuses: [1,2],

          //订单分类Number  (None,0)=[所有] | (Order,1)=[普通/限价/市价] | (PlanOrder,2)=[计划订单]
          orderCategory: 0,

          //订单类型Array(None,0)=[所有] | (Bid,1)=[限价买单] | (MarketPriceBid,2)=[市价买单] | (Ask,3)=[限价卖单] | (MarketPriceAsk,4)=[市价卖单]
          orderTypes: [0],

          //触发条件Numeber(None,0)=[所有] | (High,1)=[高价触发] | (Low,2)=[低价触发]
          planOrderType: 0,

          //订单创建时间
          beginTime: '',
          //订单结束时间
          endTime: '',
          //返回结果第几页
          pageIndex: 1,
          //返回结果每页的数据长度
          pageSize: 10
        }
      }
    },
    computed:{
    },
    components:{
      noDataTip
    },
   /* mounted(){
      api.post('MyEnvelopes/GetDrawn',{"pageIndex":1,"pageSize":8}).then((res)=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
    },*/
    created(){
      //this.getCoinData()
      this.getAllMarket();
      this.initTable();
      //console.log(this.marketPrecision)
    },
    methods:{
      changeSelectVal(){
        //console.log(this.selectMarketData)
      },
      current_change:function(currentPage){
        this.currentPage = currentPage;
        this.orderParams.pageIndex=currentPage
        this.getTrading()
      },
      FloatNum(a, b){
        let x = new Decimal(a);
        return x.dividedBy(b).toString();
      },
      //智能排序
  /*    commonSearch1: async function(query){
        //自定义搜索方法
        this.options1=this.options.slice()
        if (query !== '') {
          this.options1= commonFilter(this.options1,query,'id')
          /!* console.log(result)*!/
        } else {
          this.options1 = this.options.slice();
        }
      },
      commonSearch2: async function(query){
        //自定义搜索方法
        this.options2=this.options.slice()
        if (query !== '') {
          this.options2= commonFilter(this.options2,query,'id')
          //console.log(result)
        } else {
          this.options2 = this.options.slice();
        }
      },*/

      /*getCoinData:async function(){
         api.post('/Currency/GetCurrencys',{
           isBasic:true
         }).then((res)=>{
          //初始化搜索条件
          if(res.data.isOk){
            this.options=res.data.value
            this.options1=this.options.slice()
            this.options2=this.options.slice()
          }
        })
      },*/

       getAllMarket(){
        this.getMarketData().then((res)=>{
          let tempResult=[]
          for(let j in res){
            tempResult.push({label:j.toLocaleUpperCase(),value:j,children:res[j]})
          }
          this.marketDataList=tempResult
         // console.log()
        })
      },

      async getMarketData(){
        let obj={}
        await api.post('/Market/GetMarketBriefInfoList',{"basic":''}).then((res)=>{
          let temp=res.data.value.items
          //console.log(temp)
          for(let i in temp){
             let tempVal=obj[temp[i].split('_')[0]]
              if(tempVal){
                obj[temp[i].split('_')[0]].push({label:temp[i].split('_')[1].toLocaleUpperCase(),value:temp[i].split('_')[1]})
              }else {
                let temparry=[]
                temparry.push({label:temp[i].split('_')[1].toLocaleUpperCase(),value:temp[i].split('_')[1]})
                obj[temp[i].split('_')[0]]=temparry
              }
          }
        })
        return obj
      },

      initTable(){
        //初始化tableList
        this.searchTrading(this.orderParams)
      },

      handleCommandType(command){
        command=='1'?this.commonHandleType(0):command=='2'?this.commonHandleType(1):command=='3'?this.commonHandleType(2):command=='4'?this.commonHandleType(3):''
      },
      commonHandleType(num){
         //1，3，限价  2，4 市价
        this.orderParams.orderTypes=[0]
        //0,1,2代表 计划订单 2，普通订单 1
        this.orderParams.orderCategory=num
        if(num==1){
          this.orderParams.orderCategory=num
          this.orderParams.orderTypes=[1,3]
        }else if(num==2){
          this.orderParams.orderTypes=[1,3]
        }else if(num==3){
          this.orderParams.orderCategory=1
          this.orderParams.orderTypes=[2,4]
        }
        this.orderParams.pageIndex=1
        this.getTrading()
      },

      handleCommandBuy(command){
        command=='1'?this.commonHandleBuy([0]):command=='2'?this.commonHandleBuy([1,2]):command=='3'?this.commonHandleBuy([3,4]):''
      },
      async commonHandleBuy(arr){
        this.orderParams.orderTypes=arr
        this.orderParams.pageIndex=1
        this.getTrading()
      },

      handleCommandRepeal(command){
        var commandText=command==1?this.$t('disposit.repealAllLimitOrder'):command==2?this.$t('disposit.repealAllPlannedOrder'):command==3?this.$t('disposit.repealcurrentLimitOrder'):command==4?this.$t('disposit.repealcurrentPlannedOrder'):''
        this.$confirm(`${this.$t('disposit.confirm')}`+commandText+'?',this.$t('disposit.revocationTip'), {
          confirmButtonText: this.$t("disposit.confirm"),
          cancelButtonText: this.$t("disposit.cancel"),
          type: 'warning',
          lockScroll:true,
          customClass:'depositWrapper',
        }).then(() => {
          this.loading=true;
          this.checkRepal=true
          this.checkSearch=true
         //确认批量撤销操作 repeal
          this.repealAll(command)
        }).catch(() => {
          this.$message({
            type: 'info',
            message:this.$t('disposit.cacelRevocation')
          });
        });
      },
      getTrading: function(search=false){
        if(search){
          this.orderParams={
            marketId:'',
            orderStatuses: [1,2],
            orderCategory: 0,
            orderTypes: [0],
            planOrderType: 0,
            beginTime: '',
            endTime: '',
            pageIndex: 1,
            pageSize: 10
          }
        }
        //console.log(this.orderParams)
        this.loading=true
        this.checkSearch=true
        this.checkRepal=true
        if(!(this.selectMarketData.length)){
          this.orderParams.marketId=''
        }else {
          this.orderParams.marketId=`${this.selectMarketData[0]}_${this.selectMarketData[1]}`
        }
        this.searchTrading(this.orderParams)
      },
      searchTrading: async function(params){
          this.loading=true
          this.checkSearch=true
          this.checkRepal=true
         api.post('/Order/GetUserOrderPageList',params).then(res=>{
           //console.log('获取数据',res.data)
           this.tableDatas=res.data.value.items
           //console.log(this.tableDatas)
           this.tempLen=10-this.tableDatas.length
           this.totalPage=res.data.value.totalPage
           this.currentPage=res.data.value.currentPage
           if(res.data.value.totalItems!=0){
             this.total=res.data.value.totalItems
           }
           this.loading=false
           this.checkRepal=false
           this.checkSearch=false
         }).catch(err=>{
           //console.log(err)
           this.loading=false
           this.checkRepal=false
           this.checkSearch=false
         })
      },
      repeal(item){
        //单个订单撤销
        this.loading=true
        console.log(item)
        let params={
          "orderId": item.id,
          "orderCategory": item.category,
          "orderType": item.orderType,
          "marketId": item.market
        }
        api.post('/Order/CancelOrder',params).then(res=>{
          //撤销成功
          this.loading=false
          //再次去获取数据（当前条件下）
          //this.searchTrading(params)
          this.orderParams.pageIndex=1
          this.getTrading()
        }).catch(err=>{
          this.loading=false
          console.log(err)
        })
      },
      repealAll(command){
        //批量撤销
        //console.log(command)
        let params={
          "marketId":'',
          "orderCategory": 0
        }
        if(command=='1'){
          //撤销全部 限价1 计划2
          params.marketId=''
          params.orderCategory=1
        }else if(command=='2'){
          params.marketId=''
          params.orderCategory=2
        } else if(command=='3'){
            params.marketId=`${this.selectMarketData[0]}_${this.selectMarketData[1]}`
            params.orderCategory=1
            //console.log(222)
        }else if(command=='4'){
            params.marketId=`${this.selectMarketData[0]}_${this.selectMarketData[1]}`
            params.orderCategory=2
            //console.log(333)
          }
        api.post('/Order/CancelAllOrders',params).then(res=>{
          //撤销成功
          this.loading=false
          this.checkSearch=false
          this.checkRepal=false
          //console.log(res)
          //再次去获取数据（当前条件下）
          this.orderParams.pageIndex=1
          this.getTrading()
          this.$message({
            type: 'success',
            message:this.$t('disposit.revocationSucc')
          });
        }).catch(err=>{
          //console.log(err)
          this.loading=false
          this.checkSearch=false
          this.checkRepal=false
          this.$message({
            type: 'error',
            message:this.$t('disposit.revocationFail')
          });
        })
      }
    },
    watch:{
    }
  }
</script>
<style lang="scss" type="text/scss">
  .recordTables{
    margin-top: 30px;
    padding-bottom: 60px;
    width: 1200px;
    margin-left: 1px;
    font-family: PingFang-SC-Regular;
    .currenrRecord{
      display: flex;
      margin-bottom: 20px;
      justify-content:space-between;
      .lefts{
        display: flex;
        .seachFix{
          width: 100px;
          height: 32px;
        }
        .breadcrumb{
          font-size: 24px;
          color: $font-color6;
          margin: 0 10px;
        }
        .selectFix{
          width: 100px;
          height: 32px;
          color: $font-color2;
        }
        .searchBtn{
          width:88px;
          height: 32px;
          margin-left: 20px;
          .el-button{
            height: 32px;
            width:100%;
            font-family: PingFang-SC-Medium;
          }
        }
      }
      .rights{
        .el-button{
          color: white;
        }
      }
    }
    .listTable{
      .headerUl{
        line-height: 47px;
        display: flex;
        background-color:$bg-color9 ;
        li{
          color: $font-color3;
          font-size: $extra-small-fs;
          padding-left: 14px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .el-dropdown-link{
            cursor: pointer;
          }
          /* a{
             cursor: pointer;
           }*/
          &:nth-child(1){
            width: 150px;
          }
          &:nth-child(2){
            width: 170px;
          }
          &:nth-child(3){
            width: 88px;
            padding-left: 21px;
          }
          &:nth-child(4){
            width: 208px;
          }
          &:nth-child(5){
            width: 140px;
          }
          &:nth-child(6){
            width: 140px;
          }
          &:nth-child(7){
            width: 140px;
          }
          &:nth-child(8){
            width: 80px;
          }
          &:nth-child(9){
            width: 84px;
            text-align: right;
            padding-right: 14px;
            padding-left: 0px;
          }
        }
      }
      .contenUl{
        &>li{
          line-height: 47px;
          height: 47px;
          box-sizing: border-box;
          &:nth-child(odd){
            background-color: white;
          }
          border-bottom: 1px solid $bg-color9;
          &:nth-child(even){
            background-color:$bg-color14
          }
          &:hover{
            background-color: $bg-color11;
          }
          .contenInUl{
            display: flex;
            li{
              color: $font-color2;
              font-size: $extra-small-fs;
              padding-left: 14px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              .lightSpan{
                color:$font-color4;
              }
              &.buyIn{
                color: $--color-success;
              }
              &.buyOut{
                color: $--color-danger;
              }
              .repeal{
                color: $--color-primary;
                cursor: pointer;
              }
              &:nth-child(1){
                width: 150px;
              }
              &:nth-child(2){
                width: 170px;
              }
              &:nth-child(3){
                width: 88px;
                padding-left: 21px;
              }
              &:nth-child(4){
                width: 208px;
              }
              &:nth-child(5){
                width: 140px;
              }
              &:nth-child(6){
                width: 140px;
              }
              &:nth-child(7){
                width: 140px;
              }
              &:nth-child(8){
                width: 80px;
              }
              &:nth-child(9){
                width: 84px;
                text-align: right;
                padding-right: 14px;
                padding-left: 0px;
              }
            }
          }
        }
      }
    }
    .block{
      width:100%;
      height:46px;
      background:rgba(255,255,255,1);
      padding-top: 14px;
    }
  }
  .depositWrapper{
    &.el-message-box{
      width: 398px;
      padding-bottom: 8px;
      .el-message-box__header{
        padding: 0px 20px;
        .el-message-box__title{
          text-align: center;
          line-height: 56px;
          span{
            font-size:16px;
            color: #333;
            font-family: "PingFang-SC";
          }
        }
        .el-message-box__headerbtn{
          .el-message-box__close{
            &.el-icon-close{
              color: #888;
            }
          }
        }
      }
      .el-message-box__content{
        min-height: 130px;
        .el-message-box__status{
          &.el-icon-warning{
            transform: translate3d(-50%,0,0);
            left: 50%;
            top: 30px;
          }
          &::before{
            font-size: 40px;
            color: #C9933E;
          }
          + .el-message-box__message{
            position: absolute;
            top: 100px;
            text-align: center;
            width:calc(100% - 30px);
            padding: 0;
          }
        }
      }
      .el-message-box__btns{
        text-align: center;
        padding-top: 20px;
        padding-bottom: 10px;
        button{
          width: 120px;
          height: 40px;
          &:nth-child(2){
            margin-left: 20px;
          }
        }
      }
    }
  }
</style>
<style>
  .emptyBlock .el-table__body-wrapper.is-scrolling-none .el-table__empty-block{
    display: none;
  }
  .recordTables .listTable .headerUl .el-dropdown{
    font-size: 12px;
    color: #888888;
  }
  ul[id^="dropdown-menu"].el-dropdown-menu.el-popper[x-placement^="bottom"].options{
    margin: 0px;
    transform: translate3d(20px,15px,0);
    /* width: 120px;
     height: 108px;*/
    text-align: center;
    padding: 6px 1px;
    box-sizing: border-box;
    font-family: PingFang-SC-Regular;
  }
  ul[id^="dropdown-menu"].el-dropdown-menu.el-popper[x-placement^="bottom"].options li:hover{
    background-color: white;
    color: #C9933E;
  }
  ul[id^="dropdown-menu"].el-dropdown-menu.el-popper[x-placement^="bottom"].options li{
    padding: 0px 9px;
    line-height: 32px;
    color: #555555;
    font-family: PingFang-SC-Regular;
  }

  ul[id^="dropdown-menu"].el-dropdown-menu.el-popper[x-placement^="bottom"].allrepal{
    margin: 0px;
    transform: translate3d(0px,15px,0);
    text-align: center;
    padding: 6px 1px;
    box-sizing: border-box;

  }
  ul[id^="dropdown-menu"].el-dropdown-menu.el-popper[x-placement^="bottom"].allrepal li:hover{
    background-color: white;
    color: #C9933E;
  }
  ul[id^="dropdown-menu"].el-dropdown-menu.el-popper[x-placement^="bottom"].allrepal li{
    padding: 0px 9px;
    line-height: 32px;
    color: #555555;
  }

  .el-select-dropdown.el-popper.searchEs .popper__arrow{
    display: none;
  }
  .el-select-dropdown.el-popper.searchEs .el-select-dropdown__item.seaechMod.hover{
    background-color: white;
  }
  .el-select-dropdown.el-popper.searchEs .el-select-dropdown__item.seaechMod:hover{
    color:#C9933E;
  }
</style>
