<template>
  <div class="invite" id="invite">
   <div class="inviteTop">
       <div class="rightTopRules"><a href="#btom" >{{$t("invite.activRules")}}</a>  </div><!-- 活动规则 -->
       <img src="../../../../static/img/invite/pcTopBg.png" class="pcTopBg" />
       <img src="../../../../static/img/invite/appTopBg.png" class="appTopBg" />

       <div class="stepBoxPc">
           <div class="stepBoxPcTitle">
                <img src="../../../../static/img/invite/stepBoth.png" class="stepBoth stepBoth1" />
                <div class="stepTitle">{{$t("invite.threeStep")}}</div>
                <img src="../../../../static/img/invite/stepBoth.png" class="stepBoth stepBoth2" />
           </div>

           <img src="../../../../static/img/invite/threeStep.png" class="threeStep"/>
           <div class="stepButton">
               <button class="btn1 btn"></button>
               <button class="btn2 btn"></button>
               <button class="btn3 btn"></button>
           </div>
           <div class="mess">
               <div>{{$t("invite.share")}}</div>
               <div>{{$t("invite.frendRegi")}}</div>
               <div>{{$t("invite.drawGetCash")}}</div>
           </div>
       </div>
       <div class="stepBoxApp">
           <div class="stepBoxAppTitle">
                <img src="../../../../static/img/invite/stepBoth.png" class="stepBoth stepBoth1" />
                <div class="stepTitle">{{$t("invite.threeStep")}}</div>
                <img src="../../../../static/img/invite/stepBoth.png" class="stepBoth stepBoth2" />
           </div>

           <div class="rightTriangleBox"><!-- 两个三角形 -->
                <div class="eachBox">
                    <img src="../../../../static/img/invite/step1.png" />
                    <div class="Mess Mess1">{{$t("invite.shareLink")}}</div>
                    <div class="Mess">{{$t("invite.toYourFrend")}}</div>
                    <i class="iconfont icon-el-icon-caret-right triangle"></i>
                </div>
                <div class="eachBox">
                    <img src="../../../../static/img/invite/step2.png" />
                    <div class="Mess Mess1">{{$t("invite.fromLink")}}</div>
                    <div class="Mess">{{$t("invite.regiAndTred")}}</div>
                    <i class="iconfont icon-el-icon-caret-right triangle"></i>
                </div>
                <div class="eachBox">
                    <img src="../../../../static/img/invite/step3.png" />
                    <div class="Mess Mess1">{{$t("invite.getFrends")}}</div>
                    <div class="Mess">{{$t("invite.commission")}}</div>
                </div>
           </div>

       </div>
   </div>

    <div class="inviteCenter">
        <div class="centerOnePc">
            <div class="eachWay">
                <div class="eachWayTitle">
                    <img src="../../../../static/img/invite/stepBothRed.png" class="stepBothRed1 stepBothRed" />
                    <div class="titleMess">{{$t("invite.myInviteWay")}}</div>
                    <img src="../../../../static/img/invite/stepBothRed.png" class="stepBothRed2 stepBothRed"  />
                </div>
                <div class="requestBox">
                    <img src="../../../../static/img/invite/whiteBg.png" class="whiteBg"  />
                    <div class="requestBoxBox">
                        <div class="sixPercenter">
                            <div style="width:100%;margin-left:30px;color:rgba(81,77,128,1);font-size:14px;">{{$t("invite.linkInvite")}}</div>
                            <div style="width:100%;margin-top:20px;">
                                <input v-model="copyVal" type="text" disabled style="float:left;text-indent:8px;margin-left:25px;border:none;color:rgba(136,136,136,1);background:#eee;width:180px;height:40px;border-radius:20px;"/>
                                <div class="copyBtn" v-clipboard:copy="copyVal" v-clipboard:success="onCopy" v-clipboard:error="onError" >
                                    <img src="../../../../static/img/invite/copy.png" />
                                    {{$t("invite.copy")}}
                                </div>
                            </div>
                        </div>
                        <div class="line"></div>
                        <div class="fourPercenter">
                            <div style="width:100%;margin-left:30px;color:rgba(81,77,128,1);font-size:14px;">{{$t("invite.sendPacketInvite")}}</div>
                            <div style="width:100%;margin-top:20px;">
                                <div class="copyBtn2" @click="toSendPackets">
                                    <img src="../../../../static/img/invite/packet.png" />
                                    {{$t("invite.sendPackets")}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="eachWay eachWay2">
                <div class="eachWayTitle">
                    <img src="../../../../static/img/invite/stepBothGreen.png" class="stepBothRed1 stepBothRed" />
                    <div class="titleMess">{{$t("invite.myInviterecord")}}</div>
                    <img src="../../../../static/img/invite/stepBothGreen.png" class="stepBothRed2 stepBothRed"  />
                </div>
                <div class="requestBox">
                    <img src="../../../../static/img/invite/whiteBg.png" class="whiteBg"  />
                    <div class="requestBoxBox">
                        <div class="fourPercenter">
                            <div style="color:rgba(242,176,109,1);font-size:12px;margin-top:15px;width:100%;text-align:center;">{{$t("invite.hasInvitePeop")}}</div>
                            <div style="font-size:30px;color:rgba(255,147,38,1);margin-top:10px;text-align:center;width:100%;">{{people}} </div>

                        </div>
                        <div class="line"></div>
                        <div class="sixPercenter">
                            <div style="color:rgba(242,176,109,1);font-size:12px;margin-top:15px;width:100%;text-align:center;">{{$t("invite.getAllCash")}}</div>
                            <div style="font-size:30px;color:rgba(255,147,38,1);margin-top:10px;text-align:center;width:100%;">{{allBtcCash}} </div>
                            <div style="color:rgba(242,176,109,1);font-size:12pxwidth:100%;text-align:center;">≈ {{frenchCurrencyUnit}} {{frenchCurrency}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="centerOneApp">
            <div class="eachWayTitle">
                <img src="../../../../static/img/invite/stepBothGreen.png" class="stepBothRed1 stepBothRed" />
                <div class="titleMess">{{$t("invite.myInviterecord")}}</div>
                <img src="../../../../static/img/invite/stepBothGreen.png" class="stepBothRed2 stepBothRed"  />
            </div>
            <div class="requestBox">
                <img src="../../../../static/img/invite/whiteBg.png" class="whiteBg"  />
                <div class="requestBoxCenter">
                    <div class="people">
                        <div class="peopleTitle">{{$t("invite.hasInvitePeop")}}</div>
                        <div class="peoplePeople">{{people}}</div>
                    </div>
                    <div class="line"></div>
                    <div class="currencyBox">
                        <div class="peopleTitle">{{$t("invite.getAllCash")}}</div>
                        <div class="peoplePeople">{{allBtcCash}}</div>
                        <div class="fabi">≈ {{frenchCurrencyUnit}} {{frenchCurrency}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="bothTableBox">
        <div class="bothTableBoxTop">
            <img src="../../../../static/img/invite/stepBoth.png" style="margin-right:20px;" />
            {{$t("invite.myInviterecode")}}
            <img src="../../../../static/img/invite/stepBoth.png" style="margin-left:20px;" />
        </div>

        <div class="tableBox">
            <div class="tableBtnGroup">
                <div class="firstBtn btn" :class="{active:isActived}" @click="changeTab(1)">{{$t("invite.invitationRecord")}}</div>
                <div class="noBtn"></div>
                <div class="twoBtn btn" :class="{active:!isActived}" @click="changeTab(2)">{{$t("invite.maidRecord")}}</div>
            </div>
            <div class="tableTwo">
                <div class="tableEackBox tableEackBox1" v-if="isActived">
                    <table>
                        <thead>
                            <tr>
                                <th>{{$t("invite.invitationNumber")}}</th>
                                <th>{{$t("invite.time")}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in arrayList1" :key=index>
                                <td>{{item.accountName}}</td>
                                <td>{{creatDay(item.createTime)}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="noTableMess" v-if="this.totalItems1==0">
                        <img src="../../../../static/img/invite/noTable.png" />
                        <div>{{$t("invite.noMessinvite")}}</div>
                    </div>
                    <div class="seeMore"  v-if="this.totalItems1/((this.pageIndex1-1)*10)>1" @click="inviteRecorde">{{$t("invite.tooMore")}}</div>
                </div>
                <div class="tableEackBox tableEackBox2" v-if="!isActived">
                    <table>
                        <thead>
                            <tr>
                                <th>{{$t("invite.invitationNumber")}}</th>
                                <th>{{$t("invite.time")}}</th>
                                <th>{{$t("invite.commissions")}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in arrayList2" :key=index>
                                <td>{{item.accountName}}</td>
                                <td>{{creatDay(item.createTime)}}</td>
                                <td>{{item.volume}} {{item.currency.toUpperCase()}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="noTableMess" v-if="this.totalItems2==0">
                        <img src="../../../../static/img/invite/noTable.png" />
                        <div>{{$t("invite.noMessBack")}}</div>
                    </div>
                    <div class="seeMore" v-if="this.totalItems2/((this.pageIndex2-1)*10)>1" @click="maidRecord">{{$t("invite.tooMore")}}</div>
                </div>
            </div>

        </div>
        <!-- ///////////////////////////////////// -->
        <p id='btom'></p>
        <div class="bottomDetail">
            <div class="bothTableBoxTop">
                <img src="../../../../static/img/invite/stepBoth.png" style="margin-right:20px;" />
                {{$t("invite.activRules")}}
                <img src="../../../../static/img/invite/stepBoth.png" style="margin-left:20px;" />
            </div>
            <div class="bottomRules">
                <p> {{$t("invite.detail1")}}</p>
                <p> {{$t("invite.detail2")}}</p>
                <p> {{$t("invite.detail3")}}</p>
                <p> {{$t("invite.detail4")}}</p>
                <p> {{$t("invite.detail5")}}</p>
            </div>
        </div>

        <div class="toFixed"></div><!-- 抵消fixed底部 -->
    </div>


    <div class="fixedBottom">
        <div class="fixedBottomLeft"  v-clipboard:copy="copyVal" v-clipboard:success="onCopy" v-clipboard:error="onError">{{$t("invite.copyToInvite")}}</div>
        <div class="fixedBottomRight" @click="toSendPackets">
            <img src="../../../../static/img/invite/packet.png" style="width:18px;margin-right:5px;" />
            {{$t("invite.sendPacketInvite")}}
        </div>
    </div>


  </div>
</template>

<script>
 import api from '../../../libs/api'
 import {Decimal} from 'decimal.js';
 import {mapActions,mapGetters} from 'vuex';
 import util from "../../../libs/util";
export default {
  name: 'HelloWorld',
  data () {
    return {
      isActived:true,
      people:"",//已邀请好友
      allBtcCash:"",
      frenchCurrency:"",//法币
      frenchCurrencyUnit:"",//法币单位
      pageIndex1:1,
      totalItems1:0,//总条数
      arrayList1:[],
      pageIndex2:1,
      totalItems2:0,
      arrayList2:[],

    }
  },
  computed:{
      ...mapGetters(['coinPrecision']),
      getCoin() {//获取法币
        return this.$store.state.user.coin;
      },
      copyVal(){
          return this.$store.state.user.info?window.location.origin+"/registerInvite?id="+this.$store.state.user.info.userId:""//copy的输入框内容
      }

  },
  created(){
    //   console.log(this.copyVal,9999999999999)
      console.log(this.$store.state.user.info,22222)
      this.getPromoter();
      this.inviteRecorde();
      this.maidRecord();
  },
  mounted(){
      
  },
  methods:{
        getPromoter(){
            api.post("/Promoter/GetPromoterSummary").then((res)=>{
                // console.log(res,111);
                this.people = res.data.value.number;
                let currencyJson = res.data.value.promoterGet;
                console.log(currencyJson,333)
                // this.toBtc(currencyJson);
                this.allBtcCash = res.data.value.asBtc;//所有btc可用额
                this.frenchCurrencyUnit = this.$store.state.dict.coinSymbolList[this.getCoin];//法币单位
                util.getCurrencyToLegalMoney("btc", this.allBtcCash).then((val) => {//btc转换成法币的转换率
                    // console.log(val.toString(),99889988);
                    this.frenchCurrency =util.toFixed(val.toString(),2);
                });

            }).catch((error) => {});
        },
        // toBtc(currencyJson){
        //     let currencyArray = Object.keys(currencyJson);
        //     api.post("/Currency/GetCurrencyExchangeRate",{fromCurrencys:currencyArray,toCurrency:"btc"}).then((res)=>{
        //         // console.log(res,222);
        //         let currencyRateJson = res.data.value.exchangeRate;
        //         // console.log(currencyRateJson,444)
        //         let allBtcCash = 0;
        //         for(let i=0;i<currencyArray.length;i++){
        //             let n = new Decimal(currencyJson[currencyArray[i]]).times(currencyRateJson[currencyArray[i]]).toString();
        //             let a = new Decimal(n);
        //             let b = new Decimal(allBtcCash);
        //             allBtcCash = a.plus(b).toString();
        //         }
        //         // console.log(this.coinPrecision.btc.showPrecision,99998888);
        //         this.allBtcCash = util.toFixed(allBtcCash, this.coinPrecision.btc.showPrecision);//转换之后的所有btc
        //         this.frenchCurrencyUnit = this.$store.state.dict.coinSymbolList[this.getCoin];//法币单位
        //         // console.log(this.allBtcCash);
        //         util.getCurrencyToLegalMoney("btc", this.allBtcCash).then((val) => {//btc转换成法币的转换率
        //             // console.log(val.toString(),99889988);
        //             this.frenchCurrency =util.toFixed(val.toString(),2);
        //         });
        //     }).catch((error) => {});
        // },
        inviteRecorde(){//邀请记录
            let par = {
                "pageIndex": this.pageIndex1,//当前页
                "pageSize":10//一页显示
            };
            api.post("/Promoter/GetPromoterRecordPageList",par).then((res)=>{
                this.pageIndex1+=1;//页码加1
                this.totalItems1 = res.data.value.totalItems;
                this.arrayList1 = this.arrayList1.concat(res.data.value.items);//合并数组
                console.log(res,222)
            }).catch((error) => {});
        },
        maidRecord(){
            let par = {
                "pageIndex": this.pageIndex2,//当前页
                "pageSize":10//一页显示
            };
            api.post("/Promoter/GetPromoterDividendRecordPageList",par).then((res)=>{
                console.log(res,55555)
                this.pageIndex2+=1;//页码加1
                this.totalItems2 = res.data.value.totalItems;//总条数
                this.arrayList2 = this.arrayList2.concat(res.data.value.items);//合并数组
            }).catch((error) => {});
        },
        creatDay(time){
            let date = new Date(time * 1000);
            let day = ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "/" +
                (date.getDate() > 9 ? date.getDate() : ("0" + date.getDate())) + " " +
                (date.getHours() > 9 ? date.getHours() : ("0" + date.getHours())) + ":" +
                (date.getMinutes() > 9 ? date.getMinutes() : ("0" + date.getMinutes()));
            return day;
        },
        changeTab(index){
            console.log(index)
            if(index==1){
                this.isActived = true;
            }else{
                this.isActived = false;
            }
        },
        onCopy(e) {
            if(this.IsPC()){
                this.$message({showClose: true, message: this.$t("invite.copySuccess")+e.text, type: 'success'});
            }else{
                alert(this.$t("invite.copySuccess")+e.text);
            }
        },
        onError(e) {
            if(this.IsPC()){
                this.$message({showClose: true, message: this.$t("invite.copyError"), type: 'error'});
            }else{
                alert(this.$t("invite.copyError"));
            }
        },
        IsPC() {
            if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                return false;
            }else{
                return true;
            }
        },
        toSendPackets(){
            window.open(window.location.origin+"/envelope/my/sendO");
        }

  }
}
</script>
<style >
  #invite{
    width:100%;
  }
.tableEackBox .noTableMess{
    width:100%;
    height:200px;
    padding-top:100px;
}
.tableEackBox .noTableMess img{
    margin-top:50px;
    width:80px;
    height:80px;
    display:block;
    margin:0 auto;
}
.tableEackBox .noTableMess div{
    color:rgba(178,178,178,1);
    width:100%;
    font-size:14px;
    text-align:center;
}

.tableBox .tableBtnGroup .active{
    background:linear-gradient(90deg,rgba(255,200,0,1),rgba(246,170,42,1))!important;
    box-shadow:0px 5px 10px 0px rgba(255,170,0,0.5);
    color:rgba(255,255,255,1)!important;
}
.invite{
    position: relative;
}
.rightTopRules{
    display:none;
    height:36px;
    line-height:36px;
    background:linear-gradient(90deg,rgba(255,229,0,1),rgba(255,196,0,1));
    border-radius:22px 0px 0px 22px;
    padding:0 20px 0 20px;
    font-size:14px;
    color:rgba(48,31,206,1);
    position:absolute;
    right:0;
    top:29px;
}
.invite .inviteTop{
    position:relative;
    width:100%;
    height:493px;
    background:linear-gradient(180deg,rgba(49,32,209,1),rgba(29,29,115,1));
}
.invite .pcTopBg{
    width:820px;
    margin:0 auto;
    display:block;
}
.invite .appTopBg{
    display:none;
}
.stepBoxPc{
    display:block;
    width:1200px;
    height:190px;
    background:rgba(20,20,102,1);
    border-radius:8px;
    margin-left:-600px;
    position:absolute;
    left:50%;
    bottom:0;
}

.stepBoxPc .stepBoxPcTitle{
    width:100%;
    height:40px;
    padding-top:20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size:16px;
    color:rgba(238,239,251,1);
    line-height:18px;
}
.stepBoxPc .stepBoth{
    width:60px;
    height:8px;
}
.stepBoxPc .stepBoth1{
    margin-right:10px;
}
.stepBoxPc .stepBoth2{
    margin-left:10px;
}

.stepBoxPc .threeStep{
    width:844px;
    height:56px;
    margin:7px 0 0 172px;
}
.stepBoxPc .mess{
    width:100%;
}
.stepBoxPc .mess div{
    width:calc(100% / 3);
    float:left;
    color:rgba(187,184,230,1);
    font-size:14px;
    text-align:center;
    margin-top:15px;
}
.stepBoxPc .stepButton{
    position:absolute;
    width:844px;
    height:56px;
    left:172px;
    top:68px;
}
.stepBoxPc .stepButton .btn{
    width:56px;
    height:56px;
    display:block;
    float:left;
    opacity:0;
}
.stepBoxPc .stepButton .btn1{
    margin-left:0;
}
.stepBoxPc .stepButton .btn2{
    margin-left: 344px;
}
.stepBoxPc .stepButton .btn3{
    margin-left: 332px;
}
.stepBoxApp{
    display:none;
}
.stepBoxApp .stepBoxAppTitle{
    width:100%;
    height:40px;
    padding-top:20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height:18px;
    font-size:16px;
    color:rgba(238,239,251,1);
}
.stepBoxApp .stepBoxAppTitle .stepBoth{
    width:60px;
    height:8px;
}
.stepBoxApp .stepBoxAppTitle .stepBoth1{
    margin-right:10px;
}
.stepBoxApp .stepBoxAppTitle .stepBoth2{
    margin-left:10px;
}
.stepBoxApp .rightTriangleBox{
    margin-top:14px;
}
.stepBoxApp .rightTriangleBox .Mess1{
    margin-top:15px;
}
.stepBoxApp .rightTriangleBox .Mess{
    width:100%;
    text-align:center;
    font-size:14px;
    line-height:20px;
    color:rgba(187,184,230,1);
}
.stepBoxApp .rightTriangleBox .eachBox{
    width:calc( 100% / 3 );
    height:76px;
    position:relative;
    float:left;
}
.stepBoxApp .rightTriangleBox .eachBox img{
    width:56px;
    margin:13px auto 0;
    display:block;
}
.stepBoxApp .rightTriangleBox .eachBox i{
    position:absolute;
    font-size:12px;
    top:32px;
    right:-6px;
    color:rgba(255,255,255,0.5);;
}

/* /////////////////////////////////////////////////////////////////////////////////////// */
.inviteCenter{
    width:100%;
    background:rgba(29,29,115,1);
}
.centerOnePc{
    display:block;
    height:230px;
    width:1200px;
    margin:0 auto;
}
.centerOnePc .eachWay{
    width:590px;
    float:left;
}
.centerOnePc .eachWay2{
   margin-left:20px;
}
.centerOnePc .eachWay .eachWayTitle{
    width:270px;
    height:60px;
    margin:0 auto;
    color:rgba(238,239,251,1);
    font-size:16px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.centerOnePc .eachWay .eachWayTitle .stepBothRed{
    width:60px;
    height:8px;
}
.centerOnePc .eachWay .eachWayTitle .stepBothRed1{
    margin-right:10px;
}
.centerOnePc .eachWay .eachWayTitle .stepBothRed2{
    margin-left:10px;
}
.centerOnePc .eachWay .requestBox{
    width:100%;
    height:170px;
    position: relative;
}
.centerOnePc .eachWay .requestBox .whiteBg{
    width:100%;
    height:100%;
}
.centerOnePc .eachWay .requestBox .requestBoxBox{
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
}
.centerOnePc .eachWay .requestBox .sixPercenter{
    width:60%;
    float:left;
    margin-top:20px;
}
.centerOnePc .eachWay .requestBox .line{
    float:left;
    width:2px;
    height:60px;
    background:#eee;
    margin-top:48px;
}
.centerOnePc .eachWay .requestBox .fourPercenter{
    width:calc(40% - 2px);
    float:left;
    margin-top:20px;
}
.centerOnePc .eachWay .requestBox .copyBtn{
    float:left;
    font-size:14px;
    color:rgba(255,255,255,1);
    margin-left:10px;
    width:120px;
    height:40px;
    background:linear-gradient(90deg,rgba(255,200,0,1),rgba(246,170,42,1));
    box-shadow:0px 5px 10px 0px rgba(255,170,0,0.5);
    border-radius:20px;
    display:flex;
    justify-content: center;
    align-items: center;
    cursor:pointer;
}
.centerOnePc .eachWay .requestBox .copyBtn img{
    width:12px;
    height:12px;
    margin-right:5px;
}
.centerOnePc .eachWay .requestBox .copyBtn2{
    margin-left:25px;
    width:131px;
    height:40px;
    background:linear-gradient(90deg,rgba(255,142,76,1),rgba(253,100,51,1));
    box-shadow:0px 5px 10px 0px rgba(239,82,66,0.5);
    border-radius:20px;
    font-size:14px;
    color:rgba(255,255,255,1);
    display:flex;
    justify-content: center;
    align-items: center;
    cursor:pointer;
}
.centerOnePc .eachWay .requestBox .copyBtn2 img{
    width:16px;
    height:20px;
    margin-right:5px;
}
/* app */
.centerOneApp{
    display:none;
    width:100%;
    padding-top:20px;
}
.centerOneApp .eachWayTitle{
    width:100%;
    height:60px;
    font-size:16px;
    color:rgba(238,239,251,1);
    display: flex;
    justify-content: center;
    align-items: center;
}
.centerOneApp .eachWayTitle .stepBothRed{
    width:60px;
    height:8px;
}
.centerOneApp .eachWayTitle .stepBothRed1{
    margin-right:10px;
}
.centerOneApp .eachWayTitle .stepBothRed2{
    margin-left:10px;
}


.centerOneApp .requestBox{
    width:calc(100% - 30px);
    margin-left:15px;
    position:relative;
}
.centerOneApp .requestBox .whiteBg{
    width:100%;
    height:170px;
}
.centerOneApp .requestBox .requestBoxCenter{
    width:100%;
    height:100%;
    position:absolute;
    left:0;
    top:0;
}
.centerOneApp .requestBoxCenter .people{
    width:calc(40% - 1px);
    float:left;
    margin-top:40px;
}
.centerOneApp .requestBoxCenter .line{
    width:1px;
    float:left;
    height:60px;
    margin-top:45px;
    background:#eee;
}
.centerOneApp .requestBoxCenter .currencyBox{
    width:60%;
    float:left;
    margin-top:40px;
}
.centerOneApp .peopleTitle,.centerOneApp .fabi{
    width:100%;
    color:rgba(242,176,109,1);
    font-size:12px;
    text-align:center;
}
.centerOneApp .peoplePeople{
    width:100%;
    font-size:30px;
    color:rgba(255,147,38,1);
    line-height:36px;
    margin-top:10px;
    text-align:center;
}
/* ///////////////////////////////////////////////////////////////////////////////////////// */
.bothTableBox{
    width:100%;
    background:rgba(29,29,115,1);
    padding-bottom:40px;
}
.bothTableBoxTop{
    width:1200px;
    height:60px;
    margin:0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size:16px;
    color:rgba(238,239,251,1);
}
.bothTableBoxTop img {
    width:60px;
    height:8px;
}
.bothTableBox .tableBox{
    width:1200px;
    /* min-height:364px; */
    margin:0 auto;
    background:white;
    border-radius:8px;
}
.tableBox .tableBtnGroup{
    width:100%;
    height:50px;
    padding-top:20px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.tableBox .tableBtnGroup .btn{
    background:#F2F2F7;
    width:120px;
    height:36px;
    border-radius:20px;
    text-align:center;
    line-height:36px;
    font-size:16px;
    color:rgba(81,77,128,0.5);
    cursor:pointer;
}
.tableBox .tableBtnGroup .noBtn{
    width:120px;
    height:36px;
}
.tableBox .tableTwo {
    width:100%;
}
.tableBox .tableTwo .tableEackBox{
    width:100%;
    padding-bottom:20px;
}
.tableEackBox table{
    width:90%;
    margin-left:5%;
    font-size:12px;
    line-height:40px;
}
.tableEackBox table thead{
    color:rgba(178,178,178,1);
}
.tableEackBox table table td{
    color:rgba(85,85,85,1);
}
.tableEackBox1 table thead th:nth-child(1){
    text-align:left;
    width:60%;
}
.tableEackBox1 table thead th:nth-child(2){
    text-align:right;
    width:40%;
}
.tableEackBox1 table tbody td:nth-child(1){
    width:60%;
    text-align:left;
}
.tableEackBox1 table tbody td:nth-child(2){
    width:40%;
    text-align:right;
}
.tableEackBox .seeMore{
    border-top:1px solid #eee;
    width:100%;
    text-align:center;
    height:30px;
    color:rgba(255,147,38,1);
    line-height:50px;
    font-size:14px;
    cursor:pointer;
}
.tableEackBox .seeMore:hover{
    text-decoration: underline;
}


.tableEackBox2 table thead th:nth-child(1){
    width:40%;
    text-align:left;
}
.tableEackBox2 table thead th:nth-child(2){
    width:30%;
    text-align:left;
}
.tableEackBox2 table thead th:nth-child(3){
    width:30%;
    text-align:right;
}
.tableEackBox2 table tbody td:nth-child(1){
    width:40%;
    text-align:left;
}
.tableEackBox2 table tbody td:nth-child(2){
    width:30%;
    text-align:left;
}
.tableEackBox2 table tbody td:nth-child(3){
    width:30%;
    text-align:right;
}


.bothTableBox .bottomDetail{
    border-radius:8px;
    background:rgba(18,18,89,1);
    width:1200px;
    margin:30px auto 0;
}
.bothTableBox .bottomRules{
    width:calc(100% - 60px);
    margin-left:30px;
    padding-bottom:30px;
    color:rgba(187,184,230,1);
    line-height:23px;
    font-size:14px;
}

.fixedBottom{
    display:none;
}
.invite .toFixed{
    display:none;
    width:100%;
    height:48px;
}







@media screen and (max-width: 750px){
    .rightTopRules{
        display:block;
    }
    .invite .inviteTop{
        height:531px;
    }
    .inviteTop .pcTopBg{
        display:none;
    }
    .inviteTop  .appTopBg{
        width:100%;
        height:389px;
        display:block;
    }
    .stepBoxPc{
        display:none;
    }
    .stepBoxApp{
        display:block;
        width:calc( 100% - 30px);
        height:204px;
        background:#131361;
        border-radius:8px;
        position:absolute;
        left:15px;
        bottom:0;
    }
    .centerOnePc{
        display:none;
    }
    .centerOneApp{
        display:block;
    }
    .bothTableBox .bothTableBoxTop{
        width:100%;
    }
    .bothTableBox .tableBox{
        width:calc(100% - 30px);
        margin-left:15px;
    }
    .tableBox .tableBtnGroup .noBtn{
        width:45px;
    }

/* //////// */
    .tableEackBox2 table thead th:nth-child(1){
        width:100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display:block;
        float:left;
    }
    .tableEackBox2 table thead th:nth-child(2){
        width:80px;
        display:block;
        float:left;
        text-indent:5px;
    }
    .tableEackBox2 table thead th:nth-child(3){
        width:calc(100% - 180px);
        display:block;
        float:left;
    }
    .tableEackBox2 table tbody td:nth-child(1){
        width:100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display:block;
        float:left;
    }
    .tableEackBox2 table tbody td:nth-child(2){
        width:80px;
        display:block;
        float:left;
        text-indent:5px;
    }
    .tableEackBox2 table tbody td:nth-child(3){
        width:calc(100% - 180px);
        display:block;
        float:left;
    }
/* /////// */
    .bothTableBox .bottomDetail{
        width:calc(100% - 30px);
        margin-left:15px;
    }
    .fixedBottom{
        display:block;
        position:fixed;
        left:0;
        bottom:-1px;
        width:100%;
        height:48px;
        font-size:0;
    }
    .fixedBottom .fixedBottomLeft{
        width:60%;
        float:left;
        font-size:14px;
        cursor:pointer;
        line-height:48px;
        text-align:center;
        color:rgba(255,255,255,1);
        background:linear-gradient(90deg,rgba(255,194,13,1),rgba(245,160,42,1));
    }
    .fixedBottom .fixedBottomRight{
        cursor:pointer;
        float:left;
        width:40%;
        height:100%;
        font-size:14px;
        color:rgba(255,255,255,1);
        background:linear-gradient(90deg,rgba(255,142,76,1),rgba(253,100,51,1));
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .invite .toFixed{
        display:block;
    }
    .tableEackBox .noTableMess{
        height:150px;
    }
    .tableEackBox .noTableMess img{
        width:44px;
        height:44px;
    }
}
</style>
