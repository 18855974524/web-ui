<template>
<div class="recordTable otherRecord emptyBlock">
  <template>
    <el-table
    :data="tableOtherRecord"
    v-loading="isLoading"
    stripe
    style="width: 100%">
    <el-table-column
      :label="$t('disposit.currency')"
      width="260">
      <template slot-scope="props">
            <span class="actives"><!-- v-bind:class="{active: (props.row.currency.toLocaleUpperCase() === 'BTC')}"-->{{ props.row.currency.toLocaleUpperCase()}}</span>
      </template>
    </el-table-column>
    <el-table-column
      :label="$t('financial.time')"
      width="330">
      <template slot-scope="props">
        <span class="openSans">{{ props.row.createTime|dateTime }}</span>
      </template>
    </el-table-column>
    <el-table-column
      :label="$t('financial.quantity')"
      width="400">
      <template slot-scope="props">
        <span class="openSans">{{etoNumber(props.row.volume,coinPrecision[props.row.currency]?coinPrecision[props.row.currency].showPrecision:0)}}</span>
        <!--<span>{{props.row.volume}}</span>-->
      </template>
    </el-table-column>
    <el-table-column
      :label="$t('financial.type')"
      width="210">
      <template slot-scope="props">
        <span>{{ props.row.typeMessage}}</span>
      </template>
    </el-table-column>
<!--    <el-table-column
      :label="$t('financial.status')"
      width="180">
      <template slot-scope="props">
            <span v-bind:class="{activeStatus: (props.row.type === 1)}">{{ props.row.type}}</span>
      </template>
    </el-table-column>-->
  </el-table>
    <ul class="wrapUl" v-if="tempLen<10">
      <li :class="(tempLen%2 ==0) ?'even':'odd'" v-for="i in tempLen"></li>
    </ul>
  </template>
  <no-data-tip v-show="!tableOtherRecord.length" ></no-data-tip>
  <div class="block" style="font-family: PingFang-SC-Regular-Medium" v-show="totalPage>1">
    <el-pagination
      layout="prev, pager, next"
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
    .actives {
      font-size: 16px;
      font-family: openSans-Semibold;
      color: rgba(201, 147, 62, 1);
      line-height: 22px;
    }
 /*   .activeStatus {
      font-size: 14px;
      font-family: PingFang-SC-Regular;
      color: rgba(65, 160, 230, 1);
      line-height: 20px;
      cursor: pointer;
    }*/
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
  .recordTable .el-table .el-table__body-wrapper .el-table__body .el-table__row td{
    padding-top: 11px;
    padding-bottom: 11px;
  }
  .recordTable .el-table thead{
    color: #888888;
  }
  .recordTable .el-pager li{
    font-size: 12px;
    font-weight: normal;
    min-width: 28px;
    color: #888888;
  }
  .recordTable .el-table .el-table__body-wrapper{
    color: #555555;
  }
  .recordTable.otherRecord .el-table .cell{
    padding-left: 20px;
  }
  .recordTable .demo-table-expand {
    font-size: 0;
  }
  .recordTable .btn-next{
    color: #888888;
  }

  .recordTable .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .recordTable .el-table th{
    width:250px;
    height:50px;
    background:rgba(234,234,234,1);
    box-shadow: 0px -1px 0px 0px rgba(229,229,229,1), 0px 1px 0px 0px rgba(229,229,229,1);
    font-weight: normal;
  }
</style>
<script>
import api from "../../../../libs/api";
import util from '../../../../libs/util'
import noDataTip from '../../../common/noDataTip'
export default {
    props:{
      coinPrecision:{
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
          currentPage:1,
          tableOtherRecord:[],
          totalPage:0,
          tempLen:0,
          etoNumber:util.toFixed,
          isLoading:true
        }
    },
    components:{
      noDataTip
    },
    created(){
      this.inintTableList()
    },
    methods:{
      current_change:function(currentPage){
        this.currentPage = currentPage;
        this.inintTableList()
      },
      inintTableList(){
        this.isLoading=true
        let list={"accountBillType":0,"pageIndex": this.currentPage,"pageSize": this.pagesize}
        api.post('/User/GetAccountBillPageList',list).then((res)=>{
          //console.log(res.data.value.items)
          this.tableOtherRecord=res.data.value.items
          this.tempLen=10-this.tableOtherRecord.length
          this.totalPage=res.data.value.totalPage
          if(res.data.value.totalItems!=0&&this.tableOtherRecord.length){
            this.total=res.data.value.totalItems
          }
          this.isLoading=false
        })
      },
      handleEdit(){
      }
    }
}
</script>
