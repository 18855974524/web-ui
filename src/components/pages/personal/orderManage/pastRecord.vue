<template>
  <div class="recordTable emptyBlock" v-cloak>
    <div class="currenrRecord">
      <div class="lefts">
        <!--<div class="searchOpt" v-if="false">
          <el-dropdown trigger="click" @command="handleCommandCheck">
            <el-button style="height: 32px; width:100%" size="mini" type="primary" >查看全部<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i></el-button>
            <el-dropdown-menu slot="dropdown" class="allrepalss">
              <el-dropdown-item :disabled="commonCheck" command="1">查看全部</el-dropdown-item>
              <el-dropdown-item :disabled="commonCheck" command="2">只看买单</el-dropdown-item>
              <el-dropdown-item :disabled="commonCheck" command="3">只看卖单</el-dropdown-item>
              <el-dropdown-item :disabled="commonCheck" command="4">只看计划单</el-dropdown-item>
              <el-dropdown-item :disabled="commonCheck" command="5">只看限价单</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>-->
        <!--<div class="seachFix">
          <el-select popper-class="searchEs" @blur=""  size="small" :filter-method="commonSearch1"  v-model="selectVal1" filterable :placeholder="$t('disposit.choice')">
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
          <el-select popper-class="searchEs" @blur="" size="small" :filter-method="commonSearch2" v-model="selectVal2" filterable :placeholder="$t('disposit.choice')">
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
          <el-button  type="primary" @click.prevent.stop="searchingData" :disabled="searchCheck" size="small" icon="el-icon-search">{{$t('disposit.search')}}</el-button>
        </div>
      </div>
      <div class="rights">
        <div class="checks">
          <el-checkbox :disabled="loading" style="font-family:PingFang-SC-Medium" type="primary" v-model="checked"><span>{{$t('disposit.alternative')}}</span></el-checkbox>
        </div>
        <div class="btns">
          <el-button style="font-family:PingFang-SC-Regular" :disabled="searchCheck"  :key="index" :type="index==activeIndex ? 'primary' : 'default'" @click.prevent.stop="activeIndex=index" size="small" v-for="(item,index) in btnsData">{{item.name}}</el-button>
        </div>
      </div>
    </div>
    <div class="listTables">
      <ul  class="headerUl">
        <li>{{$t('disposit.time')}}</li>
        <li>{{$t('disposit.market')}}</li>
        <li>
          <el-dropdown trigger="hover" @command="handleCheckBuy">
            <span class="el-dropdown-link">
              {{$t('disposit.buy')}}/{{$t('disposit.sell')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown"  class="options">
              <el-dropdown-item :disabled="searchCheck" command="1">{{$t('disposit.checkallOrder')}}</el-dropdown-item>
              <el-dropdown-item :disabled="searchCheck" command="2">{{$t('disposit.checkbuyOrder')}}</el-dropdown-item>
              <el-dropdown-item :disabled="searchCheck" command="3">{{$t('disposit.checksellOrder')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li>
          <el-dropdown trigger="hover" @command="handleCheckType">
            <span class="el-dropdown-link">
              {{$t('disposit.alltypes')}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="options" >
              <el-dropdown-item :disabled="searchCheck" command="1">{{$t('disposit.checkAlltypes')}}</el-dropdown-item>
              <el-dropdown-item :disabled="searchCheck" command="2">{{$t('disposit.checklimitOrder')}}</el-dropdown-item>
              <el-dropdown-item :disabled="searchCheck" command="3">{{$t('disposit.checkPlanOrder')}}</el-dropdown-item>
              <el-dropdown-item :disabled="searchCheck" command="4">{{$t('disposit.checkMarketOrder')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li>{{$t('disposit.entrustPrice')}}</li>
        <li>{{$t('disposit.turnoverAverage')}}</li>
        <li>{{$t('disposit.entrustQuantity')}}</li>
        <li>{{$t('disposit.turnoverQuantity')}}</li>
        <li>{{$t('disposit.turnover')}}</li>
        <li>{{$t('disposit.status')}}</li>
        <li>{{$t('disposit.operation')}}</li>
      </ul>
      <ul class="contenUl" v-loading="loading" v-cloak>
        <li v-for="item in tableDatas" v-show="tableDatas.length">
          <ul class="contenInUl">
            <li class="openSans">{{item.createTime|dateTime|sliceFilter}}</li>
            <li class="openSans">
              <span>{{item.market.split('_')[0].toLocaleUpperCase()}}</span>
              <span class="lightSpan">/{{item.market.split('_')[1].toLocaleUpperCase()}}</span>
            </li>
            <li :class="item.orderType==1||item.orderType==2?'buyIn':'buyOut'">{{item.orderType==1||item.orderType==2?$t('disposit.buyIn'):$t('disposit.buyOut')}}</li>
            <li>{{item.category==1?((item.orderType==1||item.orderType==3)?$t('disposit.limit'):$t('disposit.marketprice1')):$t('disposit.zyzs')+(item.planType==2?'≤'+item.triggerPrice:'≥'+item.triggerPrice)}}{{item.category==1?'':`/${item.triggerPrice?new Decimal(item.triggerPrice).toFixed():0}`+$t('disposit.Triggered')}}</li>
            <li>{{item.category==1?(item.orderType==1||item.orderType==3)?etoNumber(item.price,marketPrecision[item.market]?marketPrecision[item.market].pricePrecision:0):$t('disposit.marketprice1'):etoNumber(item.price,marketPrecision[item.market]?marketPrecision[item.market].pricePrecision:0)}}</li>
            <li class="openSans">{{(item.tradeAmount/item.tradedVolume)?etoNumber(new Decimal(item.tradeAmount).dividedBy(item.tradedVolume).toString(),marketPrecision[item.market]?marketPrecision[item.market].pricePrecision:0):'--'}}</li>
            <li class="openSans">{{etoNumber(item.volume,marketPrecision[item.market]?marketPrecision[item.market].volumePrecision:0)}}</li>
            <li class="openSans">{{item.tradedVolume>0?etoNumber(item.tradedVolume,marketPrecision[item.market]?marketPrecision[item.market].volumePrecision:0):'--'}}</li>
            <li class="openSans">{{item.tradeAmount>0?etoNumber(item.tradeAmount,marketPrecision[item.market]?marketPrecision[item.market].pricePrecision:0):'--'}}</li>
            <li>{{item.status==1?$t('disposit.noTriggered'):item.status==2?$t('disposit.underway'):item.status==3?$t('disposit.finished'):item.status==4?item.tradedVolume>0?item.tradedVolume!=0?$t('disposit.partlyCompleted'):$t('disposit.revocationed'):$t('disposit.revocationed'):$t('disposit.AbnormalOrders')}}</li>
            <li><a class="repeal" @click.prevent.stop="$emit('routerDetail',true,{marketId: item.market,orderId:item.id,orderType:item.orderType,pageIndex:1,pageSize:10})">{{$t('disposit.checkInfos')}}</a></li>
          </ul>
        </li>
        <li v-for="j in tempLen" v-if="tempLen<10"></li>
        <no-data-tip v-show="!tableDatas.length"></no-data-tip>
        <!--<li v-for="item in 4">
          <ul class="contenInUl">
            <li>123213</li>
            <li>
              <span>123</span>
              <span class="lightSpan">1123</span>
            </li>
            <li class="buyIn buyOut">123</li>
            <li>123123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>1233</li>
            <li>1231232</li>
            <li>123123</li>
            <li>123123</li>
            <li><a class="repeal" @click.prevent.stop="$emit('routerDetail',true,{marketId:'item.market',orderId:'orderId',orderType:'item.orderType'});">查看详情</a></li>
          </ul>
        </li>-->
      </ul>
    </div>
    <div class="block" style="font-family: PingFang-SC-Regular-Medium" v-show="totalPage>1">
      <el-pagination
        :disabled="searchCheck"
        layout="prev, pager, next"
        :total="total"
        :current-page.sync="currentPage"
        @current-change="current_change">
      </el-pagination>
    </div>
  </div>
</template>
<script>
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
        total:10,//默认数据总数
        pagesize:10,//每页的数据条数
        currentPage:1,//默认开始页面,
        totalPage:0,
        Decimal:Decimal,
        tempLen:0,
        btnsData:[
          {name:this.$t('disposit.today')},
          {name:this.$t('disposit.currentWeek')},
          {name:this.$t('disposit.currentMonth')},
          {name:this.$t('disposit.Nearly3months')}
        ],
        primary:'default',
        activeIndex:-1,
        checked:false,
        loading:false,
        selectMarketData:[],
        marketDataList: [],
        tableOtherRecord: [],
        searchCheck:false,
        commonCheck:false,
        etoNumber:util.toFixed,
        tableDatas:[],
        orderParams:{
          //市场id.'btc_eth'
          marketId:'',

          //订单状态array maxLength: 4 minLength: 1, 1=[订单还未触发(计划订单专用)],2=[订单正常进行中],3=[订单已完成],4=[订单已取消],0=[所有]
          orderStatuses: [3,4],

          //订单分类Number  (None,0)=[所有] | (Order,1)=[普通/限价订单] | (PlanOrder,2)=[计划订单]
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
    mounted(){
    },
    created(){
      this.$emit('routerDetail',false)
      this.getAllMarket()
      //this.initSelctOptios()
      this.initTableList()
      //console.log(this.marketPrecision)
    },
    methods: {
      changeSelectVal(){
       // console.log(this.selectMarketData)
      },
      current_change: function (currentPage) {
        this.currentPage =currentPage;
        this.orderParams.pageIndex = this.currentPage
        this.getTableDatas(this.orderParams)
      },

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
      /*initSelctOptios(){
        api.post('/Currency/GetCurrencys',{
          "isBasic": true
        }).then((res)=>{
          //初始化搜索条件
          if(res.data.isOk){
            this.options=res.data.value
            this.options1=this.options.slice()
            this.options2=this.options.slice()
          }
        })
      },*/
      handleCommandCheck(command) {
        if (command == '1') {
          //查看全部
          this.orderParams.orderCategory = 0
          this.orderParams.orderTypes = [0]
          this.orderParams.planOrderType = 0
          this.orderParams.pageIndex = 1
          this.getTableDatas(this.orderParams)
        } else if (command == '2') {
          this.orderParams.orderCategory = 0
          //此处应改成数组传参格式，后端问题
          this.orderParams.orderTypes = [1, 2]
          this.orderParams.planOrderType = 0
          this.orderParams.pageIndex = 1
          this.getTableDatas(this.orderParams)
        } else if (command == '3') {
          this.orderParams.orderCategory = 0
          //此处应改成数组传参格式，后端问题
          this.orderParams.orderTypes = [3, 4]
          this.orderParams.planOrderType = 0
          this.orderParams.pageIndex = 1
          this.getTableDatas(this.orderParams)
        } else if (command == '4') {
          this.orderParams.orderCategory = 1
          this.orderParams.orderTypes = [0]
          this.orderParams.planOrderType = 0
          this.orderParams.pageIndex = 1
          this.getTableDatas(this.orderParams)
        } else if (command == '5') {
          this.orderParams.orderCategory = 2
          this.orderParams.orderTypes = [0]
          this.orderParams.planOrderType = 0
          this.orderParams.pageIndex = 1
          this.getTableDatas(this.orderParams)
        }
      },
      initTableList() {
        this.getTableDatas(this.orderParams)
      },
      async getTableDatas(params) {
        //console.log(params,222222)
        this.loading = true
        this.searchCheck = true
        this.commonCheck = true
        //console.log(params)
        api.post('/Order/GetUserOrderPageList', params).then(res => {
          this.loading = false
          this.searchCheck = false
          this.commonCheck = false
          //console.log('获取数据past',res.data)
         /* this.tableDatas = res.data.value.items*/
          this.totalPage=res.data.value.totalPage
          this.tempLen=10-res.data.value.items.length;
          this.tableDatas=res.data.value.items
          this.currentPage = res.data.value.currentPage
          //console.log(this.tableDatas)
          if (res.data.value.totalItems != 0) {
            this.total = res.data.value.totalItems
          }
        }).catch(err => {
          console.log(err)
          this.loading = false
          this.searchCheck = false
          this.commonCheck = false
        })
      },
      handleCheckBuy(command) {
        command == "2" ? this.orderParams.orderTypes = [1, 2] : command == "3" ? this.orderParams.orderTypes = [3, 4] : this.orderParams.orderTypes = [0]
        this.orderParams.pageIndex = 1
        this.getTableDatas(this.orderParams)
      },
      handleCheckType(command) {
        this.orderParams.orderTypes = [0]
        this.orderParams.orderCategory = 0
        //command=="2"?:command=="3"?this.orderParams.orderCategory=2:this.orderParams.orderCategory=0
        if (command == '2') {
          this.orderParams.orderCategory = 1
          this.orderParams.orderTypes = [1, 3]
        } else if (command == '3') {
          this.orderParams.orderCategory = 2
          this.orderParams.orderTypes = [1,3]
        }else if(command == '4'){
          this.orderParams.orderCategory = 1
          this.orderParams.orderTypes = [2,4]
        }
        this.orderParams.pageIndex = 1
        this.getTableDatas(this.orderParams)
      },
      searchingData() {
        /*   this.orderParams={
          //市场id.'btc_eth'
            marketId:'',

            //订单状态array maxLength: 4 minLength: 1, 1=[订单还未触发(计划订单专用)],2=[订单正常进行中],3=[订单已完成],4=[订单已取消],0=[所有]
            orderStatuses: [3,4],

            //订单分类Number  (None,0)=[所有] | (Order,1)=[普通/限价订单] | (PlanOrder,2)=[计划订单]
            orderCategory: 0,

            //订单类型Array(None,0)=[所有] | (Bid,1)=[限价买单] | (MarketPriceBid,2)=[市价买单] | (Ask,3)=[限价卖单] | (MarketPriceAsk,4)=[市价卖单]
            orderTypes:[0]

            //触发条件Numeber(None,0)=[所有] | (High,1)=[高价触发] | (Low,2)=[低价触发]
            planOrderType: 0,

            //订单创建时间
            beginTime: 0,
            //订单结束时间
            endTime: 0,
            //返回结果第几页
            pageIndex: 1,
            //返回结果每页的数据长度
            pageSize: 10
        }*/
        this.orderParams.marketId = ''
        this.orderParams.orderCategory = 0
        this.orderParams.orderTypes = [0]
        this.orderParams.planOrderType = 0
        this.orderParams.pageIndex = 1
        if (!(this.marketDataList.length)) {
          this.orderParams.marketId = ""
        } else {
          this.orderParams.marketId = `${this.selectMarketData[0]}_${this.selectMarketData[1]}`
        }
        //console.log(this.orderParams.marketId)
        this.getTableDatas(this.orderParams)
      }
    },
      //智能排序
/*      commonSearch1: async function(query){
        //自定义搜索方法
        this.options1=this.options
        if (query !== '') {
          this.options1= commonFilter(this.options1,query,'id')
          /!* console.log(result)*!/
        } else {
          this.options1 = this.options;
        }
      },
      commonSearch2: async function(query){
        //自定义搜索方法
        this.options2=this.options
        if (query !== '') {
          this.options2= commonFilter(this.options2,query,'id')
          //console.log(result)
        } else {
          this.options2 = this.options;
        }
      },
    },*/
    watch:{
      activeIndex(newval,oldval){
          this.orderParams.orderTypes=[0]
          this.orderParams.orderCategory=0
          if(newval==0){
            //获取今日时间段
            //今日凌晨
            this.orderParams.beginTime=parseInt(new Date().setHours(0,0,0,0)/1000)
            this.orderParams.endTime=parseInt(new Date().getTime()/1000)
            this.current_change(1)
           // this.getTableDatas(this.orderParams)
            //console.log(this.orderParams.beginTime,this.orderParams.endTime)
          }else if(newval==1){
              //获取本周时间段
              //1.获取当前是周几[0-6]
              var nowweekDay= new Date().getDay()
              var myDate=new Date()
              //console.log(nowweekDay)
              myDate.setDate(myDate.getDate()+1-nowweekDay);
              this.orderParams.beginTime= parseInt(myDate.setHours(0,0,0,0)/1000);
              this.orderParams.endTime=parseInt(new Date().getTime()/1000)
              this.current_change(1)
              /*this.orderParams.pageIndex=1
              this.getTableDatas(this.orderParams)*/
              //console.log(this.orderParams.beginTime,this.orderParams.endTime)
          }else if(newval==2){
              //获取本月时间段
            var nowMonth=new Date().getMonth()
            var setMounth=new Date()
            var NowDate=new Date().getDate()
            setMounth.setMonth(nowMonth);
            setMounth.setDate(1);
            setMounth.setHours(0,0,0,0);
            this.orderParams.beginTime=parseInt(setMounth.getTime()/1000)
            this.orderParams.endTime=parseInt(new Date().getTime()/1000)
            this.current_change(1)
            /*this.orderParams.pageIndex=1
            this.getTableDatas(this.orderParams)*/
            //console.log(this.orderParams.beginTime,this.orderParams.endTime)
          }else if(newval==3){
              //获取近3个月时间段
            var nowMonths=new Date().getMonth()
            var setTree=new Date();
            setTree.setMonth(nowMonths-3);
            setTree.setDate(1);
            setTree.setHours(0,0,0,0);
            this.orderParams.beginTime=parseInt(setTree.getTime()/1000)
            this.orderParams.endTime=parseInt(new Date().getTime()/1000)
            this.current_change(1)
            /*this.orderParams.pageIndex=1
            this.getTableDatas(this.orderParams)*/
          }else {
            this.orderParams.endTime=this.orderParams.beginTime=0
            this.current_change(1)
           //this.getTableDatas(this.orderParams)
          }
      },
      checked(n,o){
        //console.log('xxxxx')
       if(n){
         this.orderParams.orderStatuses=[3]
         this.current_change(1)
       }else {
         this.orderParams.orderStatuses=[3,4]
         this.current_change(1)
       }
      }
    }
  }
</script>
<style lang="scss" type="text/scss" scoped>
  .recordTable{
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
        .searchOpt{
          height: 32px;
          width: 123px;
          margin-right: 20px;
          .el-dropdown{
            width: 100%;
          }
        }
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
        display: flex;
        .checks{
          height: 32px;
          line-height: 32px;
          margin-right: 33px;
          span{
            color: $font-color5;
            font-size: $extra-small-fs;
          }
        }
        .btns{
          .el-button{
            //color: #555555;
            &.el-button--primary{
              //color: white;
            }
          }

        }
      }
    }
    .listTables{
      .headerUl{
        line-height: 47px;
        display: flex;
        background-color:$bg-color9 ;
        li{
          color: $font-color3;
          font-size: $extra-small-fs;
          padding-left: 14px;
          box-sizing: border-box;
          .el-dropdown-link{
            cursor: pointer;
          }
          /* a{
             cursor: pointer;
           }*/
          &:nth-child(1){
            width: 111px;
          }
          &:nth-child(2){
            width: 108px;
          }
          &:nth-child(3){
            width: 72px;
            padding-left: 5px;
          }
          &:nth-child(4){
            width: 167px;
          }
          &:nth-child(5){
            width: 118px;
          }
          &:nth-child(6){
            width: 118px;
          }
          &:nth-child(7){
            width: 118px;
          }
          &:nth-child(8){
            width: 118px;
          }
          &:nth-child(9){
            width: 118px;
          }
          &:nth-child(10){
            width: 76px;
          }
          &:nth-child(11){
            width: 76px;
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
          &.noticeTip{
            text-align: center;
            span{
              font-size: 14px;
              color: #909399;
            }
          }
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
              box-sizing: border-box;
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
                width: 111px;
              }
              &:nth-child(2){
                width: 108px;
              }
              &:nth-child(3){
                width: 72px;
                padding-left: 5px;
              }
              &:nth-child(4){
                width: 167px;
              }
              &:nth-child(5){
                width: 118px;
              }
              &:nth-child(6){
                width: 118px;
              }
              &:nth-child(7){
                width: 118px;
              }
              &:nth-child(8){
                width: 118px;
              }
              &:nth-child(9){
                width: 118px;
              }
              &:nth-child(10){
                width: 76px;
              }
              &:nth-child(11){
                width: 76px;
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

</style>
<style>
  .emptyBlock .el-table__body-wrapper.is-scrolling-none .el-table__empty-block{
    display: none;
  }
  .recordTable .listTables .headerUl .el-dropdown{
    font-size: 12px;
    color: #888888;
  }
  ul[id^="dropdown-menu"].el-dropdown-menu.el-popper[x-placement^="bottom"].options{
    margin: 0px;
    transform: translate3d(20px,15px,0);
    /*width: 120px;
    height: 108px;*/
    text-align: center;
    padding: 6px 1px;
    box-sizing: border-box;

  }
  ul[id^="dropdown-menu"].el-dropdown-menu.el-popper[x-placement^="bottom"].options li:hover{
    background-color: white;
    color: #C9933E;
  }
  ul[id^="dropdown-menu"].el-dropdown-menu.el-popper[x-placement^="bottom"].options li{
    padding: 0px 9px;
    line-height: 32px;
    color: #555555;
  }

  ul[id^="dropdown-menu"].el-dropdown-menu.el-popper[x-placement^="bottom"].allrepalss{
    margin: 0px;
    transform: translate3d(8px,5px,0);
    width: 120px;
    height: 175px;
    padding: 6px 1px;
    box-sizing: border-box;

  }
  ul[id^="dropdown-menu"].el-dropdown-menu.el-popper[x-placement^="bottom"].allrepalss li:hover{
    background-color: white;
    color: #C9933E;
  }
  ul[id^="dropdown-menu"].el-dropdown-menu.el-popper[x-placement^="bottom"].allrepalss li{
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

