<template>
  <div class="recordTable emptyBlock">
    <template>
      <el-table
        :data="tableDrawMoney"
        stripe
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @expand-change="toggleRowExpansion"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item :label="$t('financial.charge')">
                <span class="depositPre">{{props.row.fee }}<i class="iconType">{{props.row.feeCurrency.toLocaleUpperCase()}}</i></span>
              </el-form-item>
              <el-form-item :label="$t('financial.address')">
                <span style="color:rgba(201,147,62,1);"><i class="addressname" v-if="props.row.tag">({{props.row.tag}})</i>{{ props.row.address}}</span>
              </el-form-item>
              <el-form-item label="txid">
                <span style="color:rgba(201,147,62,1);">{{props.row.txNo}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('disposit.currency')"
          width="200">
          <template slot-scope="props">
            <span class="actives"><!-- v-bind:class="{active: (props.row.feeCurrency === 'btc')}"-->{{ props.row.feeCurrency.toLocaleUpperCase() }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('financial.time')"
          width="250">
          <template slot-scope="props">
            <span class="createTime">{{ props.row.createdAt|dateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('financial.quantity')"
          width="270">
          <template slot-scope="props">
            <span class="createTime">{{etoNumber(props.row.volume,coinPrecision[props.row.currency]?coinPrecision[props.row.currency].showPrecision:0)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('financial.confirmTime')"
          width="160">
          <template slot-scope="props">
            <span class="createTime">{{props.row.validResult}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('financial.status')"
          prop="status"
          width="160">
          <template slot-scope="props">
            <!--<span v-bind:class="{activeStatus: (props.row.status == 1),activeFail: (props.row.status ==2)}">
              {{ props.row.status==1?'待确认':props.row.status==2?'审核失败':'已完成'}}</span>-->
           <!-- <span class="statusOrder" v-bind:class="{activeStatus: (props.row.status != 4&&props.row.status != 5),activeFail: (props.row.status ==5||props.row.status ==1)}">
          {{props.row.status==2?$t('financial.unconfirmed'):props.row.status==3?$t('financial.confirmationSuc'):props.row.status==4?$t('financial.completed'):$t('financial.failureAudit')}}</span>-->

          <span class="statusOrder" :class="{activeStatus: props.row.status == 4,activeFail:(props.row.status ==5||props.row.status ==6||props.row.status ==7)}">{{calculateStatus(props.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('disposit.operation')"
          align="right"
          width="112">
          <template slot-scope="props">
            <el-button
              size="mini"
              class="detailView"
              :disabled="props.row.status==3||props.row.status==4||props.row.status==6?false:true"
              @click="handleEdit(exportUrl[props.row.currency],props.row.txNo)">{{$t('financial.details')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <ul class="wrapUl" v-if="tempLen<10">
        <li :class="(tempLen%2 ==0) ?'even':'odd'" v-for="i in tempLen"></li>
      </ul>
    </template>
    <no-data-tip v-show="!tableDrawMoney.length"></no-data-tip>
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
  body #app .recordTable .el-table .el-button{
    height: 27px;
  }
  .recordTable {
    margin-top: 30px;
    padding-bottom: 60px;
    width: 1200px;
    margin-left: 1px;
    font-family: PingFang-SC-Regular;
    .actives {
      font-size: 16px;
      font-family: openSans-Semibold;
      color: rgba(201, 147, 62, 1);
      line-height: 22px;
    }
    .createTime{
      font-family: openSans;
    }
    .detailView{
      font-family: PingFang-SC-Medium;
    }
    .statusOrder {
      font-family: PingFang-SC-Regular;
      .activeStatus {
        font-size: 14px;
        color: rgba(65, 160, 230, 1);
        line-height: 20px;
        cursor: pointer;
      }
      .activeFail {
        font-size: 14px;
        color: rgba(255, 90, 48, 1);
        line-height: 20px;
      }
    }
    .block {
      width: 100%;
      height: 46px;
      background: rgba(255, 255, 255, 1);
      padding-top: 14px;
    }
    .iconType{
      color: #888888;
      font-size: 14px;
      font-style: normal;
      margin-left: 5px;
    }
    .depositPre{
      color:#333333;
    }
    .addressname{
      color: #555555;
      font-style: normal;
      margin-right: 3px;
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
  .el-table__expanded-cell{
    background:rgba(248,248,248,1)
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
  .recordTable .btn-next{
    color: #888888;
  }
  .recordTable .el-table .el-table__body-wrapper .el-button{
    color: #555555;
    border-color: #E5E5E5;
  }
  .recordTable .demo-table-expand {
    font-size: 0;
  }
  .recordTable .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
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
  .recordTable .el-button--mini{
    /*width:68px;*/
    height:27px;
    border-radius: 2px ;
    padding: 7px 7px;
  }
  .recordTable .el-table__expanded-cell{
    background:rgba(248,248,248,1);
  }
</style>
<script>
import api from '../../../../libs/api'
import util from '../../../../libs/util'
import noDataTip from '../../../common/noDataTip'
import {mapActions,mapGetters} from 'vuex'
/*import topBar from './topBar'*/
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
          tableDrawMoney:[],
          getRowKeys(row) {
            return row.id;
          },
          expands: [],
          totalPage:0,
          tempLen:0,
          etoNumber:util.toFixed,
          statusTips:''
        }
    },
    components:{
        /*topBar*/
      noDataTip
    },
    mounted(){

    },
    computed:{
    ...mapGetters(['exportUrl'])
    },
    created(){
      this.drawfun()
      if(!Object.keys(this.exportUrl).length){
        this.asyncSetExportUrl()
      }
    },
    methods:{
      calculateStatus(status){
        /*(None,0)=[None]
        (Started,1)=[开始处理]
        (Pending,2)=[等待人工处理]
        (Processing,3)=[币种监控器正在处理]
        (Completed,4)=[完成]
        (CreateFailed,5)=[创建失败]
        (ProcessingFailed,6)=[处理失败]
        (Canceled,7)=[提现取消]
        (Unknown,8)=[未知状态]*/
        if(status==1||status==2||status==3||status==8){
          return this.$t('financial.unconfirmed')
        }
        else if(status==4){
          return this.$t('financial.completed')
        }
        else if(status==5||status==6||status==7){
          return this.$t('financial.failureAudit')
        }
        // switch (status)
        // {
        //   case 1:
        //     this.statusTips="开始处理";
        //     break;
        //   case 2:
        //     this.statusTips="等待人工处理";
        //     break;
        //   case 3:
        //     this.statusTips="币种监控器正在处理";
        //     break;
        //   case 4:
        //     this.statusTips="完成";
        //     break;
        //   case 5:
        //     this.statusTips="创建失败";
        //     break;
        //   case 6:
        //     this.statusTips="处理失败";
        //     break;
        //   case 7:
        //     this.statusTips="提现取消";
        //     break;
        //   case 8:
        //     this.statusTips="未知状态";
        //     break;
        //   default:
        //     this.statusTips="未知状态";
        // }
        //return this.statusTips='2222'
      },
      current_change:function(currentPage){
                this.currentPage = currentPage;
                this.drawfun()
      },
      handleEdit(net,query){
        //console.log(net,query)
        window.open(net+'?txno='+query)
      },
      toggleRowExpansion(row){
        //解决elementUI 手风琴展开
        if(row.id===this.expands[0]){
          this.expands = [];
        }else {
          this.expands = [];
          this.expands.push(row.id);
        }

      },
      drawfun(){
          let pageList = {
          pageIndex : this.currentPage,
          pageSize : this.pagesize,
        }
        api.post('/User/GetWithdrawlLog',pageList).then((res)=>{
          //console.log(res)
          this.tableDrawMoney = res.data.value.items;

          console.log(this.tableDrawMoney, 777)
          if(res.data.value.totalItems!=0&&this.tableDrawMoney.length){
            this.total=res.data.value.totalItems
            this.pagesize=res.data.value.pageSize
            this.currentPage=res.data.value.currentPage
          }
          this.totalPage=res.data.value.totalPage
          this.tempLen=10-this.tableDrawMoney.length
        },(err)=>{}).catch((err)=> {
          console.log(err)
        })
      },
      ...mapActions(['asyncSetExportUrl'])
    }
}
</script>
