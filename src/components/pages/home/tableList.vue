<template>
  <div class="content-wrap">
    <ul class="content-intro">
     <li v-for="item in hotMarketList" @click.prevent.stop="skipPage(item)">
        <h3>
         <div style="display: flex;align-items: center;">
           <!--<div class="icon-bg" :class="item.target" >-->
             <!--<i :class="`icon-${item.target}`" style="font-size: 20px"></i>-->
           <!--</div>-->
           <img class="icon-bg" :src="`/image/currency/web_${item.target}.png`|hostImgPath" alt="">
           <!--<img class="coinIco" :src="`./static/img/coinIco/${item.target}.svg`" alt="">-->
           <p style="margin-left: 10px">
             <a>{{item.target?item.target.toLocaleUpperCase():''}}</a><b>/{{item.basic?item.basic.toLocaleUpperCase():''}}</b>
           </p>
         </div>
          <span :class="item.increase24h.indexOf('+')>-1?'t-green':'t-pink'"><!--<i :class="item.increase24h>=0?'top-sanjiao':'bottom-sanjiao'"></i>-->{{item.increase24h}}%</span>
        </h3>
        <p>
          <b :class="item.increase24h>=0?'pb-color-green':'pb-color-pre'">{{item.closedPrice|toNumFixed(marketPrecision[item.id]?marketPrecision[item.id].volumePrecision:0)||0}}</b>
          <a>{{item.closedPrice|toLegalMoney(item.basic)|currency}}</a>
        </p>
        <p class="last-p">
              <span>
                <strong>{{$t('homepage.tradingVolume')}}:</strong>
                <b>{{item.volume|toNumFixed(2)}} {{item.target.toLocaleUpperCase()}}</b>
              </span>
          <!--<i class="icon-az-icon-gifcard"></i>-->
        </p>
      </li>
     <li v-for="i in 5-hotMarketList.length" v-if="5-hotMarketList.length" class="noDataLi"></li>
    </ul>
    <div class="tableList">
      <div class="tableList-left">
        <ul>
          <!--v-show="!((index==1||index==2)&&!$store.state.user.isLogin)"-->
          <li :class="[extendIndex==index?'active':'']" v-for="(item,index) in extendsListData" @click.prevent.stop="extendList(item,index)">
            <el-tooltip class="item" effect="dark" :content="item.topsText" placement="right"><i :class="item.icon"></i></el-tooltip></li>
        </ul>
      </div>
      <div class="tableList-right">
        <div class="content-text">
          <div class="ct-head">
            <ul>
              <li :class="[index==activeIndex?'active':'']" v-for="(item,index) in tables" @click.prevent.stop="changeTab(index)"><a>{{item.name}}</a><!--<span class="serachBadge">99</span>--></li>
            </ul>
            <div class="searchInput" v-show="extendIndex!=1">
              <el-input
                size="mini"
                prefix-icon="el-icon-search"
                :placeholder="$t('kline.searchQueue')"
                @input="searchCurrency"
                v-model="keyword">
              </el-input>
            </div>
          </div>
          <div class="ct-content">
            <ul class="head-in-ul" ref="headInUl">
              <li data-name="trading">{{$t('homepage.tradingQueue')}}<span><i  class="el-icon-caret-top" v-if="false"></i><i v-if="false" class="el-icon-caret-bottom"></i></span></li>
              <li data-name="news">{{$t('homepage.News')}}<span><i :class="descoption.key=='topnews'?'active':''" class="el-icon-caret-top"></i><i :class="descoption.key=='bottomnews'?'active':''"  class="el-icon-caret-bottom"></i></span></li>
              <li data-name="highsAlows"> {{$t('homepage.upsAnddowns')}}<span><i :class="descoption.key=='tophighsAlows'?'active':''" class="el-icon-caret-top"></i><i :class="descoption.key=='bottomhighsAlows'?'active':''" class="el-icon-caret-bottom"></i></span></li>
              <li data-name="firstTop">24H {{$t('homepage.highest')}}<span><i :class="descoption.key=='topfirstTop'?'active':''" class="el-icon-caret-top"></i><i :class="descoption.key=='bottomfirstTop'?'active':''" class="el-icon-caret-bottom"></i></span></li>
              <li data-name="lastTop">24H {{$t('homepage.lowest')}}<span><i :class="descoption.key=='toplastTop'?'active':''" class="el-icon-caret-top"></i><i :class="descoption.key=='bottomlastTop'?'active':''" class="el-icon-caret-bottom"></i></span></li>
              <li data-name="bargain">24H {{$t('homepage.tradingVolume')}}<span><i :class="descoption.key=='topbargain'?'active':''" class="el-icon-caret-top"></i><i :class="descoption.key=='bottombargain'?'active':''" class="el-icon-caret-bottom"></i></span></li>
              <li data-name="bargain">{{$t('homepage.operate')}}</li>
            </ul>
            <ul class="out-ul scroll-out-ul" ref="scrolls" v-if="marketList.length">
              <li v-for="item in marketList" @click.prevent.stop="skipPage(item)">
                <ul class="in-ul">
                  <li>
                    <a>{{item.id?item.target.toLocaleUpperCase():''}}</a><b>/{{item.id?item.basic.toLocaleUpperCase():''}}</b>
                    <i v-if="false" class="icon-az-icon-gifcard"></i>
                  </li>
                  <li>
                    <span class="pb-color-green">{{item.closedPrice|toNumFixed(marketPrecision[item.id]?marketPrecision[item.id].volumePrecision:0)||0}} {{item.basic?item.basic.toLocaleUpperCase():''}}</span>
                    <strong class="pb-color-light">/&nbsp;{{item.closedPrice|toLegalMoney(item.basic)|currency}}</strong>
                    <!--<i>{{(new Decimal(123456789)*new Decimal(987654321))}}</i>-->
                  </li>
                  <li>
                    <a :class="item.increase24h.indexOf('+')>-1?'pb-color-green':'pb-color-red'">{{item.increase24h}}%</a>
                  </li>
                  <li>
                    <p>{{item.highPrice|toNumFixed(marketPrecision[item.id]?marketPrecision[item.id].volumePrecision:0)}} {{item.basic?item.basic.toLocaleUpperCase():''}}</p>
                  </li>
                  <li>
                    <p>{{item.lowPrice|toNumFixed(marketPrecision[item.id]?marketPrecision[item.id].volumePrecision:0)}} {{item.basic?item.basic.toLocaleUpperCase():''}}</p>
                  </li>
                  <li>
                    <p>{{item.volume|toNumFixed(2)}} {{item.target?item.target.toLocaleUpperCase():''}}</p>
                  </li>
                  <li>
                    <i class="icon-el-icon-star-" :class="$store.state.user.isLogin&&collectMarketList[item.id]?'collect':''"  @click.prevent.stop="collectMarket(item)"></i>
                  </li>
                </ul>
              </li>
              <!--<li  class="in-ul"
                   v-if="isLoading"
                   v-loading="true"
                   element-loading-text="拼命加载中"
                   element-loading-spinner="el-icon-loading"
                   element-loading-background="transparent"></li>-->
            </ul>
            <div style="height: 500px;border-top: 1px solid #eeeeee" v-else>
              <no-data :nodata="nodata"></no-data>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import api from '../../../libs/api';
    import util from '../../../libs/util';
    import WSC from '../../../libs/websoket/wsConfig';
    import storeHandler from '../../../components/pages/currencyExchange/storeHandler';
    import NoData from '../../common/noDataTip';
    import Decimal from 'decimal.js'
    import {mapGetters,mapMutations,mapActions} from 'vuex';
    /**
     * computed
     *...mapGetters(['variable1','variable2'...])
     *
     * methods
     * //SYNC
     *...mapMutations({methodNmae1:'MUTATION_FN_NANE1',methodNmae2:'MUTATION_FN_NANE2',...})
     * //ASYNC
     *...mapActions(['methodName1','methodName2'...])
     * @type {null}
     */
    var KK=null;
    export default {
      data(){
        return{
          keyword:'',
          tables:[],
          tables1:[
            {name:'USDT'},
            {name:'BTC'},
            {name:'ETH'}
          ],
          tables2:[{name:this.$t('homepage.collection')}],
          extendsListData:[
            {
              name:'all',
              icon:'icon-az-icon-Allcurrenci',
              topsText:this.$t('homepage.marketList')
            },
            {
              name:'collect',
              icon:'icon-az-icon-Collection',
              topsText:this.$t('homepage.collection')
            },
            {
              name:'private',
              icon:'icon-az-icon-transaction1',
              topsText:this.$t('homepage.private')
            }
          ],
          extendIndex:0,
          activeIndex:0,
          isLoading:false,
          checked:false,
          collectChecked:false,
          marketList: [],
          hotMarketList:[],
          exdataList:[],
          tempExchange:{},
          ebexList:{},
          tempExPrecision:{},
          historySendList: {},
          collectMarketList:{},
          privatedMarketList:{},
          marketStore: new storeHandler(),
          wsc:new WSC(),
          descoption:{
            key:'0',
            property:'0',
            desc:false
          },
          nodata:0
        }
      },
      async created(){
        this.tables=this.tables1
        //判断是否登录，登录之后就加载所有收藏列表
       // console.log(this.$store.state.user.isLogin)
        if(this.iSlogin){
          //console.log('chushihua')
          this.InitPage()
        }
        this.getHotMarketList();
        this.setExchange(0);
        this.wsStart('start');
        this.changeTabDatas(this.extendIndex,this.activeIndex)
        if(!Object.keys(this.marketPrecision).length){
          this.asyncSetMarketPrecision()
        }
        this.$nextTick(function () {
          let doctop=this.$refs.headInUl.querySelectorAll('.el-icon-caret-top')
          let docbottom=this.$refs.headInUl.querySelectorAll('.el-icon-caret-bottom')
          this.bindClick(doctop,'top')
          this.bindClick(docbottom,'bottom')
        })
      },
      mounted(){
      },
      methods: {
        InitPage(){
          //登录执行
          //执行加载所有收藏数据
          this.getAllcollectMarket()
        },
        changeTab(index) {
          if(index!=this.activeIndex){
            this.activeIndex = index
            //this.keyword=''
            this.changeTabDatas(this.extendIndex,this.activeIndex)
          }
        },
        changeTabDatas(extIndex,actIndex){
          this.tables=this.tables1
          // this.keyword=''
          if(extIndex==0){
            this.GetMarketBriefInfoList(this.tables[actIndex].name.toLocaleLowerCase())
          }else if(extIndex==1){
            this.tables=this.tables2
            if(this.$store.state.user.isLogin){
              this.GetUserCollectList()
            }else {
              this.marketList=[]
            }
          }else if(extIndex==2){
            if(this.$store.state.user.isLogin){
              this.GetUserMarketBriefInfoList(this.tables[actIndex].name.toLocaleLowerCase())
            }else {
              this.marketList=[]
            }

          }
        },
        refreshPageData(name, key) {
          var that=this
          return new Promise(function (resolve, reject) {
            if (key == 'top') {
              that.descoption.desc=false
              if (name == 'trading') {
                //根据排序方式API获取对应数据或者本地前端去做排序处理
                //resolve('根据排序方式API获取对应数据或者本地前端去做排序处理1')
              } else if (name == 'news'&&that.descoption.key!=(key+name)) {
                //升序最新价格
                that.descoption.key=key+name
                that.descoption.property='closedPrice'
                that.PublicDesc(resolve)
              } else if (name == 'highsAlows'&&that.descoption.key!=(key+name)) {
                //升序24小时涨跌
                that.descoption.key=key+name
                that.descoption.property='increase24h'
                that.PublicDesc(resolve)
              } else if (name == 'firstTop'&&that.descoption.key!=(key+name)) {
                //升序24最高
                that.descoption.key=key+name
                that.descoption.property='highPrice'
                that.PublicDesc(resolve)
              } else if (name == 'lastTop'&&that.descoption.key!=(key+name)) {
                //升序24最低
                that.descoption.key=key+name
                that.descoption.property='lowPrice'
                that.PublicDesc(resolve)
              } else if (name == 'bargain'&&that.descoption.key!=(key+name)) {
                //升序成交量
                that.descoption.key=key+name
                that.descoption.property='volume'
                that.PublicDesc(resolve)
              }
            } else {
              that.descoption.desc=true
              if (name == 'trading') {
                //根据排序方式API获取对应数据或者本地前端去做排序处理
                //resolve('根据排序方式API获取对应数据或者本地前端去做排序处理2')
              } else if (name == 'news'&&that.descoption.key!=(key+name)) {
                //降序最新价格
                that.descoption.key=key+name
                that.descoption.property='closedPrice'
                that.PublicDesc(resolve)
              } else if (name == 'highsAlows'&&that.descoption.key!=(key+name)) {
                //降序24涨跌
                that.descoption.key=key+name
                that.descoption.property='increase24h'
                that.PublicDesc(resolve)
              } else if (name == 'firstTop'&&that.descoption.key!=(key+name)) {
                //降序24最高
                that.descoption.key=key+name
                that.descoption.property='highPrice'
                that.PublicDesc(resolve)
              } else if (name == 'lastTop'&&that.descoption.key!=(key+name)) {
                //降序24最低
                that.descoption.key=key+name
                that.descoption.property='lowPrice'
                that.PublicDesc(resolve)
              } else if (name == 'bargain'&&that.descoption.key!=(key+name)) {
                //降序成交量
                that.descoption.key=key+name
                that.descoption.property='volume'
                that.PublicDesc(resolve)
              }
            }
          })
        },
        bindClick(doc, key) {
          var that = this
          for (let i = 0; i < doc.length; i++) {
            doc[i].onclick = function (e) {
              that.refreshPageData(e.target.parentNode.parentNode.getAttribute('data-name'), key).then(function (res) {
                that.marketList = res;
              }).catch(function (err) {
                console.log(err)
              })
            }
          }
        },
        handleList(intops, outtops) {
          if (outtops - intops <= 500) {
            if (!this.checked) {
              clearTimeout(KK)
              this.checked = true
              this.isLoading = true
              //利用setTimeout 模仿 API 获取数据
              KK = setTimeout(function () {
                this.allNum++
                this.isLoading = false
                this.checked = false
              }.bind(this), 2000)
            } else {
              return
            }
          }
          else {
          }
        },
        plchose(market){
          //console.log(this.marketStore.isHaveMarket(market),33333333)
         return this.marketStore.isHaveMarket(market)
        },
        PublicDesc(resolve){
          if(this.extendIndex==1){
            //获取收藏的数据
            resolve(this.marketStore.getMarketCollectedSortData(this.descoption))
          }else if(this.extendIndex==0){
            //获取市场全部的数据
            if(this.keyword.trim().length>0){
              //如果keyword有值
              //进行keyword查询，并且要进行排序
              resolve(this.marketStore.searchCurrency(this.keyword,this.tables[this.activeIndex].name.toLocaleLowerCase(),this.descoption))
            }else {
              resolve(this.marketStore.getMarketSortData(this.descoption,this.tables[this.activeIndex].name.toLocaleLowerCase()))
            }
          }else if(this.extendIndex==2){
            //获取拥有的数据
            if(this.keyword.trim().length>0){
              //如果keyword有值
              //进行keyword查询，并且要进行排序
              resolve(this.marketStore.searchPrivatedCurrency(this.keyword,this.tables[this.activeIndex].name.toLocaleLowerCase(),this.descoption))
            }else {
              resolve(this.marketStore.getMarketPrivatedSortData(this.descoption,this.tables[this.activeIndex].name.toLocaleLowerCase()))
            }
          }
        },
        extendList(item, index) {
          if (this.extendIndex != index) {
            this.extendIndex = index
            this.activeIndex = 0
            this.keyword=''
            this.changeTabDatas(this.extendIndex,this.activeIndex)
          }
        },
        wsStart:function () {
          this.wsc.start({
            "ScrollDayKLine":  (market) =>  {
              //拿到数据格式为数组
              //console.log()
             // console.log(market)
              if(this.plchose(market)){
                if(market){
                  //console.log(that.privatedMarketList)
                  if(this.extendIndex==2&&this.privatedMarketList[market.Market]){
                    market.isPrivated=true
                  }else if(this.extendIndex==1&&this.collectMarketList[market.Market]){
                    market.collected=true
                  }
                  this.marketStore.initApiData(market)
                }
                //数组转换对象 热门交易对
                let transExdataList=this.aRRtoObj(this.exdataList,'id')
                for(let j in this.exdataList[j]){
                  if(this.exdataList[j]==market.Market){
                    let temp=this.marketStore.getHotMarketAllCollData(transExdataList)
                    this.hotMarketList=temp
                    break;
                  }
                }
                if(this.keyword){
                  this.searchCurrency()
                }else {
                  this.getNeedShowData()
                }

              }
            }
          })
        },
        aRRtoObj(data,key){
          let temp =[]
          for(let i in data){
            temp[key]=data[i]
          }
          return temp
        },
        wsSend(params) {
          this.wsc.send("SetReceiveOtherMarketKLine", {Items:params}, (data) => {})
        },
        GetMarketBriefInfoList(basicCoin){
          // /Market/GetMarketBriefInfoList 获取市场列表
          this.commongetData('/Market/GetMarketBriefInfoList',basicCoin)
        },
        GetUserCollectList(){
          // /User/GetUserCollectList 获取用户收藏的市场列表
          this.commongetData('/User/GetUserCollectList',2)
        },
        GetUserMarketBriefInfoList(basicCoin){
          // /Market/GetUserMarketBriefInfoList 获取拥有资产的市场
          //{ "basic": "string", "minAmountAsBtc": 0 }
          this.commongetData('/Market/GetUserMarketBriefInfoList',basicCoin,0.00001)
        },
        async commongetData(url,basicCoin='',minAc=0){
           await api.post(url, {"basic": basicCoin,"minAmountAsBtc":minAc}).then((res) => {
            //1.获取api的参数进行数据库存储
             let apidata=res.data.value.items
             //console.log(apidata,'获取对应的数据')
             let trtemp=[]
             let tempEx=[]
             for(let k in apidata){
               trtemp.push({id:apidata[k]})
             }
            if(minAc>0){
              //私有i
              for(var i in trtemp){
                trtemp[i].isPrivated=true
                //console.log(trtemp[i])
                this.privatedMarketList[trtemp[i].id]=trtemp[i];
                this.marketStore.upDateMarketPrivatedData(trtemp[i]);
              }
              //console.log(this.privatedMarketList)
            }
            if(basicCoin==2){
              //收藏
              for(var j in trtemp){
                trtemp[j].collected=true
                this.marketStore.upDateMarketCollectedData(trtemp[j]);
                //this.marketStore.initApiData(trtemp[j])
              }
            }
            this.getsendCommandAndinitMarket(trtemp).then((res)=>{
                //拿到排序或者非回来的数据
                this.getNeedShowData();
                //console.log(this.marketList)
                //启动订阅条件
                if(res.length>0){
                 setTimeout(()=>{
                   this.wsSend(res)
                 },1000)
                }
            })
          })
        },
        collectMarket(item){
          //收藏或者取消收藏
          if(!this.collectChecked){
            this.collectChecked=true
            item.collected = !item.collected;
            /*console.log(item)
            this.collectChecked=false
            return*/
            if (!this.$store.state.user.isLogin) {
              this.$message({
                message: this.$t('message.loginTip'),
                type: 'warning',
                showClose: true
              })
              item.collected = !item.collected;
              this.collected=false
              this.collectChecked=false
              return;
            }
            api.post(`/User/${!item.collected ? 'Cancel' : ''}CollectMarket`, {
              'id': item.id
            }).then((res)=>{
              // 更新本地存储
              //console.log(res,333333333333333333)
              this.collectMarketList[item.id]=item.collected?1:0;
              this.marketStore.upDateMarketCollectedData(item);
              this.getNeedShowData();
              this.collectChecked=false
            }).catch(() => {
              item.collected = !item.collected
              this.collectChecked=false
            });
          }else {
            return
          }
        },
        getsendCommandAndinitMarket:async function(data){
          let list=[];
          for(let i in data){
            let key=data[i].id
            if(!this.historySendList[key]){
              //插入数据库
              //设置send的command参数
              this.marketStore.initApiData(data[i])
              let items = {
                Market: key,
                Frequencys: ['SD1']
              };
              list.push(items);
              this.historySendList[key]=data[i]
            }
          }
          return list
        },
        searchCurrency() {
          /*this.descoption.key='0';*/
          this.keyword = this.keyword.toUpperCase();
          if(this.keyword){
            if(this.extendIndex==1){
              this.marketList=[]
            }else if(this.extendIndex==0) {
              let res = this.marketStore.searchCurrency(this.keyword,this.tables[this.activeIndex].name.toLocaleLowerCase(),this.descoption)
              this.marketList=res
            }else {
              let res = this.marketStore.searchPrivatedCurrency(this.keyword,this.tables[this.activeIndex].name.toLocaleLowerCase(),this.descoption)
              this.marketList=res
            }
          }else {
            if(this.extendIndex==1){
              this.marketList=[]
            }else if(this.extendIndex==0){
              let rnes=this.marketStore.getMarketSortData(this.descoption,this.tables[this.activeIndex].name.toLocaleLowerCase())
              this.marketList=rnes
            }else {
              let rnes=this.marketStore.getMarketPrivatedSortData(this.descoption,this.tables[this.activeIndex].name.toLocaleLowerCase())
              this.marketList=rnes
            }
          }
        },
        getNeedShowData(){
          var lists;
          if(this.extendIndex==1){
            //获取收藏的数据
           // console.log(this.$store.state.user.isLogin)
            if(!this.$store.state.user.isLogin){
              lists=[]
            }else if(this.$store.state.user.isLogin) {
              lists=this.marketStore.getMarketCollectedSortData(this.descoption)
              //console.log(lists)
            }
          }else if(this.extendIndex==2){
            //获取拥有的数据
            if(!this.$store.state.user.isLogin){
              lists=[]
            }else if(this.$store.state.user.isLogin) {
              //获取拥有的数据
              if(this.keyword.trim().length>0){
                //如果keyword有值
                //进行keyword查询，并且要进行排序
                lists=this.marketStore.searchPrivatedCurrency(this.keyword,this.tables[this.activeIndex].name.toLocaleLowerCase(),this.descoption)
              }else {
                lists=this.marketStore.getMarketPrivatedSortData(this.descoption,this.tables[this.activeIndex].name.toLocaleLowerCase())
              }
              //lists=this.marketStore.getMarketPrivatedSortData(this.descoption,this.tables[this.activeIndex].name.toLocaleLowerCase())
              //console.log(lists)
            }
          }else {
            //获取全部市场的数据
            if(this.keyword.trim().length>0){
              //如果keyword有值
              //进行keyword查询，并且要进行排序
              //console.log(66666)
              lists=this.marketStore.searchCurrency(this.keyword,this.tables[this.activeIndex].name.toLocaleLowerCase(),this.descoption)
              //console.log(lists)
            }else {
              lists=this.marketStore.getMarketSortData(this.descoption,this.tables[this.activeIndex].name.toLocaleLowerCase())
            }
          }
          this.marketList=lists
        },
        async getHotMarketList(){
          //热门交易对
          let params={
            "count": 5
          }
          await api.post('/Market/GetTopMarketBriefInfos',params).then(res=>{
            this.exdataList=res.data.value.items
            //热门交易对数据
            let trtemp=[]
            let tempEx=[]
            for(let n in this.tables1){
              tempEx.push(this.tables1[n].name.toLocaleLowerCase())
            }
            for(let k in this.exdataList){
              trtemp.push({id:this.exdataList[k]})
              if(!this.tempExchange[this.exdataList[k].split('_')[1]]){
                this.tempExchange[this.exdataList[k].split('_')[1]]=0
                tempEx.push(this.exdataList[k].split('_')[1])
              }
            }
            this.getsendCommandAndinitMarket(trtemp).then((res) => {
              console.log(trtemp)
              this.hotMarketList=this.marketStore.getHotMarketAllCollData(trtemp);
              if(res.length){
                setTimeout(()=>{
                  this.wsSend(res)
                },1000)
              }
            })
          })
        },
        setExchange(code){
          //默认的美元
          if(!Object.keys(this.usdtToLegalMoney).length){
              this.getLegalMoneyPerUsdt()
              console.log(this.usdtToLegalMoney)
          }
        },
        getAllcollectMarket(){
        //获取收藏数据列表LIST
           api.post('/User/GetUserCollectList').then((res)=>{
            let temp=res.data.value.items
            //console.log(temp)
            let trtemp=[]
            for(let k in temp){
              trtemp.push({id:temp[k]})
            }
            for(let i in trtemp){
              this.collectMarketList[trtemp[i].id]=1
            }
            //console.log(this.collectMarketList)
          })
        },
        skipPage(item){
          //currencyExchange?pair=xrp_btc
          this.$router.push({
            name:'currencyExchange',
            query:{pair:item.id}
          })
          //console.log(item)
        },
        ...mapActions(['asyncSetMarketPrecision','getLegalMoneyPerUsdt'])
      },
      destroyed(){
          console.log('destroyed tableList')
          this.wsc.close()
      },
      computed:{
        coinCodec(){
          return this.$store.state.dict.coinCode[this.$store.state.user.coin]
        },
        iSlogin(){
          return this.$store.state.user.isLogin
        },
        ...mapGetters(['marketPrecision','usdtToLegalMoney']),
      },
      watch:{
        iSlogin(n,o){
          if(n){
            this.InitPage()
          }
        },
        extendIndex(n,o){
          if(n==1){
            this.nodata=1
          }else {
            this.nodata=0
          }
        }
      },
      components:{
        NoData
      }
    }
</script>

<style lang="scss" type="text/scss" scoped >
  .content-wrap{
    width: 1200px;
    margin: 0 auto;
    font-family:PingFang-SC-Regular;
  }
  /*start hotmarket*/
  .content-intro{
    display: flex;
    padding-top: 20px;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
    .icon-bg{
      width: 20px;
      height: 20px;
      border-radius:50%;
      text-align: center;
      color: white
    }
  }
  .content-intro li{
    padding: 15px;
    background: url("../../../assets/img/hotBg@2x.png");
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 4px;
    transition: all 0.4s ease-in-out;
    width: 224px;
    box-sizing: border-box;
    overflow: hidden;
    &.noDataLi{
      background: none;
      width: 224px;
      &:hover{
        box-shadow: none;
        cursor:auto;
        transform:none
      }
    }
    &:hover{
      cursor: pointer;
      box-shadow: 0px 6px 12px 0px rgba(0,0,0,0.15);
      transform: translateY(-5px);
    }
  }
  .content-intro li>p b{
    font-size:$medium-fs;
    font-family:openSans-Semibold;
  }
  .in-ul > li > a.pb-color-green {
    color:#2DBB70;
  }
  .top-sanjiao{
    width: 0;
    height: 0;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-bottom: 4px solid #0ABF74;
    position: absolute;
    left: -10px;
    top: 8px;
  }
  .bottom-sanjiao{
    width: 0;
    height: 0;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-top: 4px solid $--color-danger;
    margin-bottom: 10px;
    position: absolute;
    left: -10px;
    top: 8px;
  }
  .in-ul > li > a.pb-color-red {
    color:$--color-danger;
  }
  .content-intro li>p a{
    font-size:$extra-small-fs;
    font-family:openSans;
    margin-left: 3px;
    font-weight: normal;
    color:#929AA8;
  }
  .content-intro li>.last-p span strong{
    font-size:$extra-small-fs;
    font-family:HelveticaNeue-Medium;
    font-weight: normal;
    color:#929AA8;
  }
  .content-intro li>.last-p span b{
    font-size:$extra-small-fs;
    font-family:openSans;
    font-weight: normal;
    color:#929AA8;
  }
  .content-intro li>.last-p i.icon-az-icon-gifcard{
    font-size: 20px;
    background: linear-gradient(90deg,rgba(240,205,115,1),rgba(238,179,80,1));
    -webkit-background-clip: text;
    color: transparent;

  }
  .content-intro li>p{
    display: flex;
    align-items: center;
    // margin-bottom:5px;
  }
  .content-intro li>p.last-p{
    justify-content: space-between;
    height: 20px;
  }
  .content-intro li h3{
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 20px;
    height: 20px;
    width: 194px;
    margin-bottom:10px;
  }
  .content-intro li h3 i.icon-az-icon-transaction-{
    font-size: 20px;
    color: $--color-primary;
  }
  .content-intro li h3 img.coinIco{
    width: 20px;
    height: 20px;
    overflow: hidden;
    border-radius: 50%;
  }
  .content-intro li h3 a{
    font-size:$medium-fs;
    font-family:openSans-Semibold;
    color:#333740;
  }
  .content-intro li h3 b{
    font-size:$medium-fs;
    font-family:openSans-Semibold;
    color:#929AA8;
  }
  .content-intro li h3 span{
    font-family:openSans;
    position: relative;
    font-size:11px;
  }
  .t-green{
    color:$--color-success;
  }
  .t-pink{
    color: $--color-danger;
  }
  .color-yellow{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: $--color-warning;
  }
  .color-purple{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #C391F0;
  }
  .color-blue{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #50AEF5;
  }
  .color-grren{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #44CC88;
  }
  .color-yellow-linear{
    background:linear-gradient(90deg,rgba(240,205,115,1),rgba(238,179,80,1));
  }
  /*end hotmarket*/
  .tableList{
    margin-bottom: 40px;
    display: flex;
    border-radius: 4px;
    overflow: hidden;
  }
  .tableList-left{
    width:50px;
    padding-top: 50px;
    background-color: #555A66;
    box-shadow: 0px 1px 0px 0px rgba(229,229,229,1), 1px 0px 0px 0px rgba(229,229,229,1)
  }
  .tableList-left ul li{
    width: 100%;
    height: 50px;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
  }
  .tableList-left ul li i{
    font-size: 18px;
    color: #686e7a;
  }
  .tableList-left ul li.active{
    background-color: $--color-primary;
  }
  .tableList-left ul li.active i{
    color: white;
  }
  .tableList-right{
    width: 1150px;
  }
  .content-text{
    width:100%
  }
  .ct-content{
    background: white;
  }
  .ct-head{
    //padding: 0px 20px 0px 30px;
    height: 50px;
    background:rgba(240,241,242,1);
    //box-shadow: 0px 1px 0px 0px rgba(229,229,229,1), 1px 0px 0px 0px rgba(229,229,229,1), -1px 0px 0px 0px rgba(229,229,229,1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    //border-bottom: 1px solid #E5E5E5;
  }
  .ct-head ul{
    display: flex
  }
  .ct-head ul li{
    padding: 15px 30px 14px 30px;
    color:#929AA8;
    font-size:$medium-fs;
    text-align: center;
    font-family: openSans-Semibold;
  }
  .ct-head ul li.active{
    color:$--color-primary;
    border-bottom: 2px solid $--color-primary;
    font-family: openSans-Semibold;
  }
  .ct-head ul li:hover{
    cursor: pointer;
    color:$--color-warning;
  }
  .searchInput{
    width: 180px;
    padding-right: 20px;
    //font-family: PingFangSC_Medium;
    .el-input{
      .el-input--mini{
        .el-input--prefix{
          .el-input__inner{
            padding: 0px 15px 0px 34px;
            height: 28px;
            background-color: white!important;
            border: none;
            padding-top: 2px;
          }
        }
      }
    }
  }
  .out-ul{
    height: 500px;
    overflow-y: scroll;
    color:rgba(51,55,64,1);
    cursor: pointer;
  }
  .out-ul>li:hover{
    background-color:$bg-color14;
  }
  .out-ul>li{
    border-top: 1px solid #eeeeee;
    font-family: openSans;
  }
  .out-ul>li:hover .in-ul>li:first-child i{
    color: $--color-primary;
  }
  .head-in-ul{
    color:rgba(166,174,189,1);
    font-size: $medium-fs;
    li{
      display: flex;
      align-items: center;
      font-family: PingFangSC_Medium;
      span{
        position: relative;
        display: inline-block;
        width: 12px;
        height: 24px;
        margin-left:5px;
        i{
          cursor: pointer;
          position: absolute;
          font-size: 10px;
          color: #D8DCE6;
          &.el-icon-caret-bottom{
            bottom: 2px;
            &.active{
              color: $--color-primary;
            }
          }
          &.el-icon-caret-top{
            top: 5px;
            &.active{
              color: $--color-primary !important;
              border-bottom: 0px !important;
            }
          }
          &:hover{
            color: $--color-primary;
          }
        }
      }

    }
  }
  .in-ul{
    height: 50px;
    box-sizing: border-box;
  }
  .in-ul,.head-in-ul{
    display: flex;
    justify-content: space-between;
    align-items: center;
    //border-bottom: 1px solid $bg-color9;
  }
  .head-in-ul>li>i{
    cursor: pointer;
  }
  .in-ul>li>i.icon-az-icon-gifcard{
    font-size: 20px;
    background: linear-gradient(90deg,rgba(240,205,115,1),rgba(238,179,80,1));
    -webkit-background-clip: text;
    color: transparent;
  }
  .in-ul>li{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .in-ul>li>a{
    color:rgba(51,55,64,1);
  }
  .in-ul>li>b{
    color:rgba(146,154,168,1);
    font-weight: normal;
  }
  .in-ul>li>strong{
    font-weight: normal;
  }
  .in-ul>li p{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .head-in-ul>li{
    height: 50px;
    font-size: $medium-fs;
    padding-left: 20px;
  }
  .in-ul>li{
    height: 50px;
    line-height: 50px;
    font-size: $medium-fs;
    padding-left: 20px;
  }
  .in-ul>li:nth-child(1),.head-in-ul>li:nth-child(1){
    width: 160px;
  }
  .in-ul>li:nth-child(1){
    font-family: openSans-Semibold;
  }
  .in-ul>li:nth-child(2),.head-in-ul>li:nth-child(2){
    width: 275px;
  }
  .in-ul>li:nth-child(2)>a{
    color:$font-color1;
  }
  .in-ul>li:nth-child(2)>b{
    font-weight: normal;
    color: rgba(51,51,51,0.7);
  }
  .in-ul>li:nth-child(3)>strong{
    font-weight: normal;
    font-size: $extra-small-fs;
  }
  .in-ul>li:nth-child(3),.head-in-ul>li:nth-child(3){
    width: 107px;
  }
  .in-ul>li:nth-child(4),.head-in-ul>li:nth-child(4){
    width: 190px;
  }
  .in-ul>li:nth-child(5),.head-in-ul>li:nth-child(5){
    width: 190px;
  }
  .in-ul>li:nth-child(6),.head-in-ul>li:nth-child(6){
    width: 150px;
  }
  .in-ul>li:nth-child(7),.head-in-ul>li:nth-child(7){
    width: 68px;
  }
  .in-ul>li:nth-child(7) {
    color: #EEEEEE;
    font-size: 16px;
    text-indent: 4px;
  }
  .pb-color-green {
    color:#2DBB70;
  }
  .pb-color-pre{
    color: #FF5A30;
  }
  .pb-color-red {
    color:$--color-danger
  }
  .pb-color-light{
    color: #929AA8;
  }
  .collect{
    color: $--color-primary;
  }
</style>
