<template>
<div class="recordTable emptyBlock">
  <template>
    <el-table
      :data="tableChargeMoney"
      stripe
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @expand-change="toggleRowExpansion"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item  label="Txid">
              <a :href="`${exportUrl[props.row.currency]}/?txno=${props.row.txNo}`" target="_blank"><span style="color:rgba(201,147,62,1);">{{props.row.txNo }}</span></a>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('disposit.currency')"
        width="200">
        <template slot-scope="props">
          <span class="actives"><!--v-bind:class="{active: (props.row.currency === 'btc')}"-->{{ props.row.currency.toLocaleUpperCase() }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('financial.time')"
        width="250">
        <template slot-scope="props">
          <span class="createTime">{{ props.row.createAt|dateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('financial.quantity')"
        prop="volume"
        width="270">
        <template slot-scope="props">
          <span class="createTime">{{etoNumber(props.row.volume,coinPrecision[props.row.currency]?coinPrecision[props.row.currency].showPrecision:0)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('financial.confirmTime')"
        width="160">
        <template slot-scope="props">
          <span class="createTime">{{props.row.confirmation}}/{{confirmTime[props.row.currency]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('financial.status')"
        prop="status"
        width="160">
        <template slot-scope="props">
        <span class="statusOrder" :class="{activeStatus: (props.row.status != 4&&props.row.status != 5),activeFail: (props.row.status ==5||props.row.status ==1)}">
          {{ props.row.status==1?$t('financial.abnormalOrders'):props.row.status==2?$t('financial.unconfirmed'):props.row.status==3?$t('financial.confirmationSuc'):props.row.status==4?$t('financial.completed'):$t('financial.rechargeAbnormal') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('disposit.operation')"
        align="right"
        width="112">
        <template slot-scope="props">
          <el-button
            class="detailView"
            size="mini"
            :disabled="props.row.confirmation<=0?true:false"
            @click="handleEdit(exportUrl[props.row.currency],props.row.txNo)">{{$t('financial.details')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <ul class="wrapUl" v-if="tempLen<10">
      <li :class="(tempLen%2 ==0) ?'even':'odd'" v-for="i in tempLen"></li>
    </ul>
  </template>
  <no-data-tip v-show="!tableChargeMoney.length"></no-data-tip>
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
.recordTable{
  margin-top: 30px;
  padding-bottom: 60px;
  width: 1200px;
  margin-left: 1px;
  font-family: PingFang-SC-Regular;
  .actives{
    font-size:$large-fs;
    font-family:openSans-Semibold;
    color:rgba(201,147,62,1);
    line-height:22px;
  }
  .createTime{
    font-size:14px;
    font-family:openSans;
    color:rgba(85,85,85,1);
    line-height:19px;
  }
  .detailView{
    font-family: PingFang-SC-Medium;
  }
  .statusOrder{
    font-family: PingFang-SC-Regular;
    &.activeStatus{
      font-size:14px;
      color:rgba(65,160,230,1);
      line-height:20px;
      cursor: pointer;
    }
    &.activeFail {
      font-size: 14px;
      color: rgba(255, 90, 48, 1);
      line-height: 20px;
    }
  }

  .block{
    width:100%;
    height:46px;
    background:rgba(255,255,255,1);
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
    font-family: PingFang-SC-Regular;
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
  .recordTable .el-table .el-table__body-wrapper .el-button{
    color: #555555;
    border-color: #E5E5E5;
  }
  .recordTable .btn-next{
    color: #888888;
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
/*import topBar from './topBar'*/
import api from '../../../../libs/api'
import util from '../../../../libs/util'
import noDataTip from '../../../common/noDataTip'
import {mapActions,mapGetters} from 'vuex'
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
          currentPage:1,//默认开始页面
          totalPage:0,
          tempLen:0,
          tableChargeMoney:[],
          upadte:{},
          getRowKeys(row) {
            return row.id;
          },
          expands: [],
          confirmTime:{},
          etoNumber:util.toFixed,
        }
    },
    components:{
       /* topBar*/
      noDataTip
    },
    mounted(){
      //this.fun()
      /*this.expands.push(this.tableChargeMoney[1].id);*/
    },
    computed:{
      ...mapGetters(['exportUrl'])
    },
    created(){
      this.getSafeTime()
      if(!Object.keys(this.exportUrl).length){
        this.asyncSetExportUrl()
      }

    },
    methods:{
      current_change:function(currentPage){
        this.currentPage = currentPage;
        this.fun()
      },
 /*     async getDetailsLink(){
        api.post('/Currency/GetCurrencyAddressInfos').then(res=>{
         let tempUrl=res.data.value
          for(let k in tempUrl){
           this.exportUrl[tempUrl[k].id]=tempUrl[k].explorerUrl
          }
          //this.$state.
        })
      },*/
      getSafeTime(){
        api.post('/Currency/GetCurrencyConfirmatonInfos').then(res=>{
          let temArry=res.data.value
         // console.log(temArry,111111111111)
          for(let j in temArry){
            this.confirmTime[temArry[j].id]=temArry[j].confirmTime
          }
          this.fun()
          //console.log(this.confirmTime)
        })
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
          //console.log(this.expands)
        }

      },
      fun(){
        let pageList = {
          pageIndex : this.currentPage,
          pageSize : this.pagesize,
        }
        api.post('/User/GetDepositLog',pageList).then((res)=>{
          this.total=res.data.value.totalItems
          this.pagesize=res.data.value.pageSize
          this.currentPage=res.data.value.currentPage
          this.tableChargeMoney = res.data.value.items
         // console.log(this.tableChargeMoney)
          this.totalPage=res.data.value.totalPage
          this.tempLen=(10-this.tableChargeMoney.length)
          /*let temp=[]
          for(let i in this.tableChargeMoney){
            console.log(this.tableChargeMoney[i])
            temp.push(api.post('/Currency/GetCurrencyAddressInfo',{
              "id": this.tableChargeMoney[i].txNo
            }))
          }
          this.gethrefLink(temp)*/
          //console.log(this.tableChargeMoney)
          //1.遍历数据币种，并对币种进行筛选
            //this.getConfirm(this.getConis(this.tableChargeMoney))
          });
        },
      /*gethrefLink(arryList){
       let allHref = new Promise.all(arryList);
        allHref.then(res=>{
          console.log(res)
        })}*/
      getConis(data){
        var hash = {};
        for(let i in data){
          if(!hash[data[i].currency]){
            hash[data[i].currency]=''
            this.temp[data[i].currency]=0
          }
        }
       return Object.keys(hash)
      },
      ...mapActions(['asyncSetExportUrl'])
      /*getConfirm(res){
           var num=0
           var tempArry=[]
           for(let i in res){
             api.post('/Currency/GetCurrencyBasicInfo',{id:res[i]}).then((result)=>{
               //console.log(num)
               if(num==res.length-1){
                 tempArry[res[i]]=result.data.value.confirmTime
                 this.temp=tempArry
               }else {
                 tempArry[res[i]]=result.data.value.confirmTime
                 num++
               }
            })

        }
      }*/
    }
}
</script>
