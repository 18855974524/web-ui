<template>
<!-- 最新价格 -->
  <div class="orderBox">
    <div class="new-price-box">
      <div class="new-price-box-top">
        <div class="title-box">
          {{$t("order.newPrice")}}
        </div>
        <div class="currencyTitle" :class="classObject">
          {{selectedItem.closedPrice?selectedItem.closedPrice:0}} {{selectedItem.id?selectedItem.id.split("_")[1].toUpperCase():0}}
        </div>
        <div class="currencyMoney">
           &nbsp;/ {{topMess.unit}}&nbsp;{{topMess.money}}
        </div>
        <!-- 加减 -->
        <div class="addNumberBox">
          <button class="reduce addBox" @click="reduceFn" :disabled="selectNumber.reduceDisabled" :class="{isActive:deletClass}"><i class="icon-az-icon-minus iconfont"></i></button>
          <div class="addNumber addBox">
            <el-dropdown>
              <span class="el-dropdown-link">
                {{selectNumber.selectShow}} {{$t("order.smalPoint")}}
              </span>
              <el-dropdown-menu style="background:rgba(51,55,64,1);" slot="dropdown"  class="drops">
                <el-dropdown-item v-for="(item,index) in selectNumber.select" :key=index>
                  <div class="paddingContent" @click="selectDecFn(item)">{{item}} {{$t("order.smalPoint")}}</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            </div>
          <button class="add addBox" @click="addNuFn" :disabled="selectNumber.addDisabled" :class="{isActive:addClass}"><i class="icon-az-icon-plus iconfont"></i> </button>
        </div>
      </div>
      <div class="successBox eachTableNew">
        <!-- <div class="" style="background:blue;width:100%;"> -->
          <div class="tableHeader">
            <div class="firstTh" style="text-indent:15px;">{{$t("order.allPrice")}}({{selectedItem.id?selectedItem.id.split("_")[1].toUpperCase():""}})</div>
            <div class="twoTh">{{$t("order.entrustment")}}({{selectedItem.id?selectedItem.id.split("_")[0].toUpperCase():""}})</div>
            <div class="threeTh" style="padding-right:9px;">{{$t("order.eachPrice")}}({{selectedItem.id?selectedItem.id.split("_")[1].toUpperCase():""}})</div>
          </div>
          <div class="listBox scroll-out-ul">
             <div class="eachBgBox">
               <!-- //////////////// -->
               <div class="eachLineBg"  v-for="(item,index) in BidList" :key = index>
                 <div class="successLeft"  :style="`width:`+getPercent(item.V)+`%;`"></div>
               </div>
             </div>
             <div class="eachBgBox eachBgBoxMess">
              <div class="tablebody" v-for="(item,index) in BidList" :key = index  @click="getPrice(item.P)">
                <div class="firstTd" style="text-indent:15px;">{{decimals(item.V,item.P)}}</div>
                <div class="twoTd" style="text-align:left;">{{decimals2(item.V)}}</div>
                <div class="threeTd successColor" style="padding-right:9px;">{{decimals3(item.P)}}</div>
              </div>

            </div>
          </div>

        <!-- </div> -->
      </div>
      <div class="errorBox eachTableNew">
        <div class="tableHeader">
          <div class="firstTh" style="text-indent:9px;width:33%;">{{$t("order.eachPrice")}}({{selectedItem.id?selectedItem.id.split("_")[1].toUpperCase():""}})</div>
          <div class="twoTh" style="text-align:right;width:25%;">{{$t("order.entrustment")}}({{selectedItem.id?selectedItem.id.split("_")[0].toUpperCase():""}})</div>
          <div class="threeTh" style="padding-right:15px;width:42%;">{{$t("order.allPrice")}}({{selectedItem.id?selectedItem.id.split("_")[1].toUpperCase():""}})</div>
        </div>
        <div class="listBox scroll-out-ul">
          <div class="eachBgBox">
            <!-- //////////////////// -->
            <div class="eachLineBg" v-for="(item,index) in AskList" :key = index>
              <div class="successRight" :style="`width:`+getPercent(item.V)+`%;`"></div>
            </div>
          </div>
          <div class="eachBgBox eachBgBoxMess">
            <div class="tablebody" v-for="(item,index) in AskList" :key = index  @click="getPrice(item.P)">
              <div class="firstTd readColor" style="text-indent:9px;width:33%;">{{decimals3(item.P)}}</div>
              <div class="twoTd" style="width:25%;">{{decimals2(item.V)}}</div>
              <div class="threeTd" style="padding-right:15px;width:42%;">{{decimals(item.V,item.P)}}</div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="Stop-profit-loss">
      <!-- 交易 -->
      <trade ref="trade" :trade ="selectedItem" @getnewPrice="getnewPrice" @buySellPrice="buySellPrice"></trade>
    </div>

  </div>
</template>

<script>
 import api from '../../../../libs/api'
 import trade from './trade'
 import {Decimal} from 'decimal.js';
 import util from "../../../../libs/util";
  export default {
    components:{
      trade
    },
    props:[ "selectedItem","wsc" ],
    data() {
      return {
        deletClass:false,
        addClass:false,
        id:"",
        classObject:{//控制最新价格的颜色
          readColor:true,
          successColor:false,
          // normal:false,
        },
        topMess:{
          currencyNumber:"0.00",//当前币种最新价格
          currency:"USDT",//当前币种单位
          unit:"￥",//法币单位
          money:"0",//法币
        },
        selectNumber:{
          select:[0,1,2,3],//几位小数的数组
          selectShow:0,//展示的小数
          reduceDisabled:false,
          addDisabled:false,
        },
        currencys:{
          buyCurrency:"",//(苹果)  BTC / USDT  用 USDT(钱) 来购买 BTC(苹果)
          sellCurrency:"",//钱
        },
        buyexchangeLegal:"",//币种转为法币的换算率
        accuracy:"",//价格最大精度
        accuracyNumber:"",//价格精度
        AskList:[],//卖单列表
        BidList:[],//买单列表
        precision:0,//最大的百分比
        Version:"",//版本号
      }
    },
    watch:{
      // selectedItem(val,oldVal){//监听币种交易对变化
      //   if(val.closedPrice == oldVal.closedPrice){//最新价格变化了 转换成法币的也变化
      //   }else{
      //     this.topMess.currencyNumber = val.closedPrice;
      //     console.log(this.topMess.currencyNumber)
      //     //  let a = new Decimal(this.topMess.currencyNumber);
      //       this.exchangeLegalMoney();
      //   }
      // },
    },
    computed:{
      getCoin(){//获取法币
        this.topMess.unit = this.$store.state.user.coin;
        return this.$store.state.user.coin;
      },
    },
    mounted(){
      this.topMess.unit = this.$store.state.dict.coinSymbolList[this.getCoin];//法币单位
      // setTimeout(() => {
        this.initFirst(this.selectedItem);//初始化的时候，在获取精度函数内
      // }, 1000);
      
    },
    methods: {
      decimals(a,b){//算 总价 = 单价*量
        let x = new Decimal(a);
        x = x.times(b).toString();
        x = util.toFixed(x,this.accuracy);
        return x;
      },
      decimals2(val){//对委托量进行数量精度截取
        let a = util.toFixed(val,this.accuracyNumber);
        return a;
      },
      decimals3(val){//对单价进行精度截取
        let a = util.toFixed(val,this.selectNumber.selectShow);
        return a;
      },
      getList(data){//获取列表 number是几位小数
        // console.log(data,11111111);
        this.AskList=[];
        this.BidList=[];
        this.precision = 0;
        this.Version = data.Version.toString();
        this.AskList = data.AskList.sort(this.sortAZ);//sortAZ
        this.BidList = data.BidList.sort(this.sortZA);//sortZA
        let array = this.AskList.concat(this.BidList);
        for(let i=0;i<array.length;i++){
          if(array[i].V>this.precision){
            this.precision = array[i].V;
          }
        }
      },
      //每次更新的时候send一下(新价格，挂单数不为0，挂单数为0，版本不同)
      upDateList(data){//不断更新列表数据
        // console.log(data,999);
        if(data.StartVersion.toString()!=this.Version){
          this.sendList(this.selectNumber.selectShow);
          return;
        }
        this.Version = data.EndVersion.toString();

        if(data.AskList){
          if(this.AskList.length == 0){
            this.AskList = data.AskList;
          }else{
            let array1=[];
            for(let s=0;s<this.AskList.length;s++){
              array1.push(this.AskList[s].P);
            }

            for(let i=0;i<data.AskList.length;i++){
              for(let j=0;j<this.AskList.length;j++){
                if(data.AskList[i].P == this.AskList[j].P){
                  this.AskList[j] = data.AskList[i];
                }
              }
              if(!this.IsInArray(array1,data.AskList[i].P)){
                this.AskList.push(data.AskList[i]);
              }
            }
            let arrayNotZero = [];//把数量不为0的取出来
            for(let i=0;i<this.AskList.length;i++){
              if(this.AskList[i].V!=0){
                arrayNotZero.push(this.AskList[i]);
              }
            }
            this.AskList = arrayNotZero;
          }
        }else{
          console.log("没有askList")
        }


        if(data.BidList){
          if(this.BidList.length == 0){
            this.BidList = data.BidList;
          }else{
            let array2=[];
            for(let a=0;a<this.BidList.length;a++){
              array2.push(this.BidList[a].P)
            }
            for(let m=0;m<data.BidList.length;m++){
              for(let n=0;n<this.BidList.length;n++){
                if(data.BidList[m].P == this.BidList[n].P){
                  this.BidList[n] = data.BidList[m];
                }
              }
              if(!this.IsInArray(array2,data.BidList[m].P)){
                this.BidList.push(data.BidList[m]);
              }
            }
            let arrayNotZero2 = [];//把数量不为0的取出来
            for(let i=0;i<this.BidList.length;i++){
              if(this.BidList[i].V!=0){
                arrayNotZero2.push(this.BidList[i]);
              }
            }
            this.BidList = arrayNotZero2;
          }
        }else{
          console.log("没有bidList")
        }



        this.AskList = this.AskList.sort(this.sortAZ);
        this.BidList = this.BidList.sort(this.sortZA);
        let array = this.AskList.concat(this.BidList);
        this.precision = 0;
        for(let p=0;p<array.length;p++){
          if(array[p].V>this.precision){
            this.precision = array[p].V;
          }
        }
      },
      IsInArray(arr, val) {//判断一个数是否在数组内
        let testStr = ',' + arr.join(",") + ",";
        return testStr.indexOf("," + val + ",") != -1;
      },
      sortZA(a,b){//从大到小排序
        return b.P - a.P
      },
      sortAZ(a,b){//从小到大
        return  a.P - b.P
      },
      sendList(number){//number是选择的小数精度 初始化send
        this.wsc.send("SetMarketDepth",{Market:this.id,Precision:number,Limit:10},(success)=>{},error=>{
            console.log(error)
        })
      },
      getPercent(num){
        return num/this.precision*100;
      },
      initFirst(val){//初始化加载子组件
          this.id = val.id;
          // this.currencys.buyCurrency = val.id?val.id.split("_")[0].toUpperCase():"";
          // this.currencys.sellCurrency = val.id?val.id.split("_")[1].toUpperCase():"";
          // this.topMess.currency = val.id?val.id.split("_")[1].toUpperCase():0;//最新价格单位
          // this.topMess.currencyNumber = val.closedPrice?val.closedPrice:0;//最新价格

          this.getMarket(()=>{
             setTimeout(() => {
               this.exchangeLegalMoney();////货币转换成法币的转换率
             }, 1000); 
          });//获取精度

          // this.$refs.trade.init(val);
      },
      numberArrayFn(val){//获取下拉框
        this.addClass = true;
        // console.log(this.addClass)
        if(val>2){
          this.selectNumber.select = [val-3,val-2,val-1,val];
        }else if(val==2){
          this.selectNumber.select = [0,1,2];
        }else if(val==1){
          this.selectNumber.select = [0,1]
        }else if(val==0){
          this.deletClass = true;
          this.selectNumber.select = [0]
        }
        this.selectNumber.selectShow = val;
      },
      getMarket(fn){//获取市场所在的精度 获取小数
        let par = {id:this.id};
        api.post("/Market/GetMarket",par).then((res)=>{
          this.accuracy = res.data.value.pricePrecision;
          this.accuracyNumber = res.data.value.depthVolumePrecision;
          this.numberArrayFn(res.data.value.pricePrecision);
          this.sendList(this.accuracy); //获取精度之后发送第一次websocket
          fn();
        },(err)=>{this.buyLoading = false;}).catch((error) => {});
      },
      numbersplice(value,pointNumber) {//截取相对精度的小数 value传的值，pointNumber精确到多少位小数
        var toFixedNum = Number(value).toFixed(20);
        var realVal = toFixedNum.substring(0, toFixedNum.toString().length - (20-pointNumber));
        realVal = parseFloat(realVal);
        return realVal;
      },
      exchangeLegalMoney(){//货币转换成法币的转换率
        this.buyexchangeLegal = util.getCurrencyToLegalMoney( this.selectedItem.id.split("_")[1].toLowerCase(), 1)
        let a = new Decimal(this.selectedItem.closedPrice);
        a = a.times(this.buyexchangeLegal).toString();
        this.topMess.money = util.toFixed(a,2);
      },
      selectDecFn(item){//下拉框小数选中事件
        this.selectNumber.selectShow = item;
        this.sendList(item);

        this.addClass = false;
        this.deletClass = false;
        if(item == this.selectNumber.select[0]){
          this.selectNumber.reduceDisabled = true;
          this.selectNumber.addDisabled = false;
          this.deletClass = true;
        }else if(item == this.selectNumber.select[this.selectNumber.select.length-1]){
          this.selectNumber.reduceDisabled = false;
          this.selectNumber.addDisabled = true;
          this.addClass = true;
        }else{
          this.selectNumber.reduceDisabled = false;
          this.selectNumber.addDisabled = false;
        }

        if(this.selectNumber.select.length==1){
          this.selectNumber.reduceDisabled = true;
          this.selectNumber.addDisabled = true;
          this.deletClass = true;
          this.addClass = true;
        }
      },
      reduceFn(){//小数减事件 deletClass addClass isActive
        this.selectNumber.addDisabled = false;//让加的可以点
        this.addClass = false;//加不灰色
        if(this.selectNumber.select.length == 1){
          this.addClass = true;
        }
        if(this.selectNumber.selectShow == this.selectNumber.select[0]){
          this.selectNumber.reduceDisabled = true;
          this.deletClass = true;
        }else{
          for(let i=0;i<this.selectNumber.select.length;i++){
            if(this.selectNumber.selectShow==this.selectNumber.select[i]){
              this.selectNumber.selectShow = this.selectNumber.select[i-1];
              this.sendList(this.selectNumber.selectShow);
              if(this.selectNumber.selectShow == this.selectNumber.select[0]){
                this.selectNumber.reduceDisabled = true;
                this.deletClass = true;
              }
              return;
            }
          }
        }

      },
      addNuFn(){//小数加事件
        this.selectNumber.reduceDisabled = false;//让减得可以点
        this.deletClass = false;
        if(this.selectNumber.select.length == 1){
          this.deletClass = true;
        }
        if(this.selectNumber.selectShow == this.selectNumber.select[this.selectNumber.select.length-1]){
          this.selectNumber.addDisabled = true;
        }else{
          for(let i=0;i<this.selectNumber.select.length;i++){
            if(this.selectNumber.selectShow==this.selectNumber.select[i]){
              // console.log(this.selectNumber.select[i+1])
              this.selectNumber.selectShow = this.selectNumber.select[i+1];
              this.sendList(this.selectNumber.selectShow);
              if(this.selectNumber.selectShow == this.selectNumber.select[this.selectNumber.select.length-1]){
                this.selectNumber.addDisabled = true;
                this.addClass = true;
              }
              return;
            }
          }
        }
      },
      getPrice(price){//点击表格中价格事件
        let trade={
          newPrice:price,
        }
        this.$refs.trade.parentPrice(trade)
      },
      getnewPrice(){//点击子组件tab的时候，传最新的价格赋值过去
        let trade={
          newPrice:this.selectedItem.closedPrice,
        }
        this.$refs.trade.parentPrice(trade);
      },
      buySellPrice(){//止盈止损买卖的时候传过去最新价格
        this.$refs.trade.getNewPriceto(this.selectedItem.closedPrice);
      },
      scientificToNumber(num) {//解决科学记数法问题
          var str = num.toString();
          var reg = /^(\d+)(e)([\-]?\d+)$/;
          var arr, len,
              zero = '';

          /*6e7或6e+7 都会自动转换数值*/
          if (!reg.test(str)) {
              return num;
          } else {
              /*6e-7 需要手动转换*/
              arr = reg.exec(str);
              len = Math.abs(arr[3]) - 1;
              for (var i = 0; i < len; i++) {
                  zero += '0';
              }

              return '0.' + zero + arr[1];
          }
      },
      toFixeds(){
        // 不要超过 16 位
        if (s === 0)
          return Math.floor(d);
        let str = ''+d;
        let index = str.indexOf('.');
        if(index !== -1){
          let num = str.length-index-1; //原有小数位数
          if(num<s){
            str = `${str}${'0'.repeat(s-num)}`
          }else{
            str = str.slice(0,index+1+s);
          }
        }else{
          str = `${str}.${'0'.repeat(s)}`
        }
        return str
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
.isActive{
  color:#40444D!important;
  &:hover{
    color:#40444D!important;
  }
}

.el-dropdown-link{
  font-size:12px;
  color:#929AA8;
  line-height:27px;
  &:hover{
    color:#F0F2F6
  }
}
.scroll-out-ul{
  overflow: scroll;
}
.scroll-out-ul::-webkit-scrollbar-track{
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 3px rgba(0,0,0,0.1);
  background-color: rgba(78,78,78,1);
}
.scroll-out-ul::-webkit-scrollbar{
  width: 3px;
  background-color: rgba(78,78,78,1);
}
.scroll-out-ul::-webkit-scrollbar-corner{
  background-color: rgba(78,78,78,1);
}
.readColor{
  color:$--color-danger !important;
}
.successColor{
  color:$--color-success !important;
}
.normal{
  color:#888888!important;
}
.orderBox{
    width:100%;
    height:352px;
    background:rgba(19,21,26,1);
}


.new-price-box-top{
  width:100%;
  height:40px;
  background:rgba(29,32,38,1);
  overflow:hidden;
  .title-box{
    line-height:40px;
    font-size:14px;
    float:left;
    margin-left:15px;
    color:white;
    font-family: HelveticaNeue-Medium;
  }
  .currencyTitle{
    float:left;
    margin-left:20px;
    font-size:14px;
    font-family:OpenSans;
    color:rgba(136,136,136,1);
    line-height:40px;
  }
  .currencyMoney{
    font-size:14px;
    font-family:OpenSans;
    color:rgba(136,136,136,1);
    line-height:40px;
    float:left;
  }
  .addNumberBox{
    float:right;
    height:28px;
    margin-top:6px;
    border-radius:2px;
    width:129px;
    margin-right:15px;
    font-family:PingFang-SC-Regular;
    .addBox{
      border:none;
      display:block;
      float:left;
      line-height:27px;
      color:rgba(178,178,178,1);
      font-size:12px;
      text-align:center;
      cursor:pointer;
    }
    .reduce{
      width:32px;
      border-radius:2px 0 0 2px;
      line-height:20px;
      font-size:28px;
      background:rgba(29,32,38,1);
      &:hover{
        color:#F0F2F6
      }
    }
    .addNumber{
      width:65px;
    }
    .add{
      width:32px;
      line-height:23px;
      border-radius:0 2px 2px 0;
      font-size:22px;
      background:rgba(29,32,38,1);
      &:hover{
        color:#F0F2F6
      }
    }
  }
}



.new-price-box{
    width:50%;
    // width:calc(100% - 605px);
    height:100%;
    border-radius:2px;
    background:rgba(29,32,38,1);
    float:left;

    .eachTableNew{
      width:50%;
      box-sizing: border-box;
      float:left;
      background:#1D2026;
      height:310px;
    }
    .successBox{
      padding-right:2px;
      background:#1D2026;
    }
    .tableHeader{
      width:100%;
      height:28px;
      line-height:28px;
      font-size:12px;
      color:rgba(104,110,122,1);
      font-family:PingFangSC-Regular;
      .firstTh{
        // width:calc((100% - 8px)/3);
        width:42%;
        float:left;
        box-sizing: border-box;
      }
      .twoTh{
        width:25%;
        float:left;
      }
      .threeTh{
        width:33%;
        float:left;
        text-align: right;
        box-sizing: border-box;
      }
    }
    .listBox{
      width:100%;
      height:calc(100% - 28px);
      position: relative;
      overflow: auto;
      // background:red;
      .eachBgBox{
        width:100%;
        height:280px;
        font-family:OpenSans;
        .eachLineBg{
          width:100%;
          height:26px;
          margin-top:2px;
          .successLeft{
            float:right;
            background:rgba(45,187,112,0.1);
            height:100%;
          }
          .successRight{
            height:100%;
            background:rgba(255,90,48,0.1);
          }
        }
        .tablebody{
          width:100%;
          height:26px;
          line-height:28px;
          margin-top:2px;
          color:#C8CEDB;
          font-size:12px;
          cursor:pointer;
          &:hover{
            background:rgba(34,38,46,1);
          }
          .firstTd{
            width:42%;
            float:left;
            box-sizing: border-box;
          }
          .twoTd{
            width:25%;
            float:left;
            text-align:right;
          }
          .threeTd{
            width:33%;
            float:left;
            text-align:right;
            box-sizing: border-box;
          }
        }
      }
      .eachBgBoxMess{
        position: absolute;;
        left:0;
        // top:-1px;
        top:0;
        box-sizing:border-box;
      }
    }
}



.Stop-profit-loss{
    width:calc(50% - 5px);
    // width:595px;
    height:100%;
    margin-left:5px;
    border-radius:2px;
    background:rgba(29,32,38,1);;
    float:left;
}
.el-popper[x-placement^="bottom"]{//[data-v-46b3853f]
      margin-top: 7px!important;
      font-size: 12px!important;
      transform: translateX(18px)!important;
      background:rgba(51,55,64,1);
      border:none!important;
}
.el-dropdown-menu__item{//[data-v-46b3853f]
  line-height: 28px!important;
  font-size: 12px!important;
  padding:0!important;
  width:100px!important;
  text-indent: 10px!important;
}
.paddingContent{
    width:90px;
    color:#929AA8;
    text-align:center;
    padding-right:10px;
  &:hover{
    background:rgba(64,68,77,1)!important;
    color:#C8CEDB!important;
  }
}
.el-dropdown-menu{
  background:rgba(51,55,64,1);
  border:none!important;
  transform: translateX(26px)!important;
}
</style>
<style>
.drops.el-popper[x-placement^="bottom"] .popper__arrow{
  top:-10000px!important;
}
</style>

