<template>
  <div class="recordTable chekeckInfo emptyBlock" v-cloak>
    <template>
      <el-table v-loading="checkeds"
        :data="tableOtherRecord"
        stripe
        style="width: 100%">
        <el-table-column
          :label="$t('disposit.time')"
          width="260">
           <template slot-scope="props">
             <span>{{props.row.createTime|dateTime}}</span>
           </template>
        </el-table-column>
        <el-table-column
          :label="$t('disposit.price')"
          width="270">
          <template slot-scope="props">
            <span>{{etoNumber(props.row.price,marketPrecision[marketId].pricePrecision)}}{{baseCoin}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('disposit.turnoverNum')"
          width="250">
          <template slot-scope="props">
            <span>{{etoNumber(props.row.volume,marketPrecision[marketId].volumePrecision)}}{{dealCoin}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('disposit.costAmount')"
          width="230">
          <template slot-scope="props">
            <span>{{etoNumber(props.row.amount,marketPrecision[marketId].pricePrecision)}}{{baseCoin}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('disposit.serviceCharge')"
          width="190">
          <template slot-scope="props">
            <span>{{props.row.fee}}{{(DealOrderType==3||DealOrderType==4)?baseCoin:dealCoin}}</span>
          </template>
          <!--<template slot-scope="props">
            <span v-bind:class="{activeStatus: (props.row.status === '待确认')}">{{ props.row.status }}</span>
          </template>-->
        </el-table-column>
      </el-table>
      <ul class="wrapUl" v-if="tempLen<10">
        <li :class="(tempLen%2 ==0) ?'even':'odd'" v-for="i in tempLen"></li>
      </ul>
    </template>
    <no-data-tip v-show="!tableOtherRecord.length"></no-data-tip>
    <div class="block" style="font-family: PingFang-SC-Regular-Medium" v-show="totalPage>1">
      <el-pagination
        layout="prev, pager, next"
        :disabled="checkeds"
        :total="total"
        @current-change="current_change">
      </el-pagination>
    </div>

  </div>
</template>

<style lang="scss" type="text/scss" scoped>
  .recordTable {
    margin-top: 30px;
    padding-bottom: 60px;
    font-family: PingFang-SC-Regular;
    .active {
      font-size: 16px;
      font-family: openSans-Semibold;
      color: rgba(201, 147, 62, 1);
      line-height: 22px;
    }
    span{
      font-family: openSans;
    }
    .activeStatus {
      font-size: 14px;
      font-family: PingFangSC-Regular;
      color: rgba(65, 160, 230, 1);
      line-height: 20px;
      cursor: pointer;
    }
    .block {
      width: 1200px;
      height: 46px;
      background: rgba(255, 255, 255, 1);
      padding-top: 14px;
    }
    .wrapUl{
      li{
        height: 50px;
        border-bottom: 1px solid #ebeef5;
        background-color: white;
        box-sizing: border-box;
        &:hover{
          background-color: #f5f7fa!important;
        }
        &.even{
          &:nth-child(even){
            background-color: #fafafa;
          }
        }
        &.odd{
          &:nth-child(odd){
            background-color: #fafafa;
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
  .recordTable.chekeckInfo .el-table .el-table__body-wrapper .el-table__body .el-table__row td {
    padding:13px 0px 13px 0px;
  }
  .recordTable.chekeckInfo  .el-table .el-table__body-wrapper .el-table__body .el-table__row td:last-child{
    text-align: right;
  }

  .recordTable.chekeckInfo  .el-table thead {
    color: #888888;
  }
  .recordTable.chekeckInfo  .el-table thead tr th:nth-child(5) div{
    text-align: right;
  }
  .recordTable.chekeckInfo  .el-table .el-table__body-wrapper {
    color: #555555;
  }
  .recordTable.chekeckInfo .el-table .cell {
    padding-left: 20px;
    padding-right: 20px;
  }

  .recordTable.chekeckInfo  .demo-table-expand {
    font-size: 0;
  }

  .recordTable.chekeckInfo  .btn-next {
    color: #888888;
  }

  .recordTable.chekeckInfo  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }

  .recordTable.chekeckInfo  .el-table th {
    width: 250px;
    height: 50px;
    background: rgba(234, 234, 234, 1);
    box-shadow: 0px -1px 0px 0px rgba(229, 229, 229, 1), 0px 1px 0px 0px rgba(229, 229, 229, 1);
    font-weight: normal;
  }
</style>
<script>
  import api from '../../../../libs/api'
  import util from '../../../../libs/util'
  import noDataTip from '../../../common/noDataTip'
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
        total: 10,//默认数据总数
        pagesize: 10,//每页的数据条数
        currentPage: 1,
        totalPage:0,
        tempLen:0,
        checkeds:false,
        marketId:'',
        tableOtherRecord: [],
        orderInfoParams:{
          marketId:'',
          orderId: '',
          orderType: 0,
          pageIndex: 1,
          pageSize: 10
        },
        etoNumber:util.toFixed,
      }
    },
    components: {
      noDataTip
    },
    methods: {
      current_change: function (currentPage) {
        this.currentPage = currentPage;
        this.orderInfoParams.pageIndex=this.currentPage
        this.getOrderInfoList(this.orderInfoParams)
      },
      getOrderInfoList(params) {
        this.checkeds=true
        api.post('/Order/GetOrderDetailPageList',params).then(res=>{
          this.tableOtherRecord=res.data.value.items
          //console.log(this.tableOtherRecord)
          //this.tableOtherRecord=[]
          //console.log(res.data.value)
          this.totalPage=res.data.value.totalPage;
          this.tempLen=10-this.tableOtherRecord.length;
          this.currentPage=res.data.value.currentPage
          this.checkeds=false
          if(res.data.value.totalItems!=0){
            this.total=res.data.value.totalItems
          }
        }).catch(err=>{
          console.log(err)
          this.checkeds=false
        })
      },
      initList(params){
        this.orderInfoParams.marketId=params.marketId
        this.orderInfoParams.orderId=params.orderId
        this.orderInfoParams.orderType=params.orderType
        this.getOrderInfoList(this.orderInfoParams)
      }
    },
    computed:{
      baseCoin(){
        return this.$route.query.marketId.split('_')[1].toLocaleUpperCase()
      },
      dealCoin(){
        return this.$route.query.marketId.split('_')[0].toLocaleUpperCase()
      },
      DealOrderType(){
        return this.$route.query.orderType
      }
    },
    created(){
      this.initList(this.$route.query)
      this.marketId=this.$route.query.marketId
      //console.log(this.marketPrecision[this.marketId])
    }
  }
</script>
