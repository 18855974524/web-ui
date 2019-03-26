import loki from 'lokijs'
import util from '../../../libs/util'
function StoreHandler() {
  this._db = new loki();
  this._db.addCollection('realtimeSub_table'); // 存储订阅的 bar 的实时回调函数
  this._db.addCollection('barsSub_table'); // 存储 bar 的回调函数  onDataCallBack,onErrorCallBack
  this._db.addCollection('bars_table'); // 存储 k 线数据
  this.marketList = this._db.addCollection('market_list');
  this.hotMarketList=this._db.addCollection('hotMarket_list')
  this.bars_records = {};
  this.bars_nodaterecord = {};
  this.GetBarsFunc = null;
}

//获取订阅了最新K线数据的回掉函数
StoreHandler.prototype.GetRealtimeSubCollection = function () {
  return this._db.getCollection('realtimeSub_table');
}
StoreHandler.prototype.GetBarsSubCollection = function () {
  return this._db.getCollection('barsSub_table');
}

//获取存储K线数据的内存collection
StoreHandler.prototype.GetBarsCollection = function () {
  return this._db.getCollection('bars_table');
}

// 获取市场数据 by 交易对
StoreHandler.prototype.GetMarketItem = function(id){
  let data = this.marketList.findOne({'id':id});
  return data;
}

// 初始化存储市场列表数据
StoreHandler.prototype.SetMarketItem = function(data) {
  let market = this.marketList.find({id: data.id});
  let re;
  if (market&&market[0]) {
    re =  this.UpdateMarketItem(data,market[0]);
  } else {
    re = this.CreateMarketItem(data);
  }
  return re;
}


//获取市场列表数据
StoreHandler.prototype.GetMarketsCollection = function () {
  return this._db.getCollection('market_list');
}

// 根据币种搜索市场列表数据
StoreHandler.prototype.SearchMarketsCollection = function (target,tab) {
  let searchWord = target.toLowerCase();
  let chain = this.marketList.chain();
  if(tab !== 'fav'){
    chain.find({'basic':tab});
  }else{
    chain.find({'collected':true});
  }
  if(searchWord.trim()){
    chain.where((item) => {
      return item.target.includes(searchWord)
    })
  }
  return chain.sort((prev,next) => {
    return prev.target.indexOf(searchWord) > next.target.indexOf(searchWord)
  }).data();
}

// 增加一条市场数据
StoreHandler.prototype.CreateMarketItem = function (data) {
    //市场ID
  let increase24h = data.openPrice&&data.closedPrice ? util.toFixed((data.closedPrice - data.openPrice)*100 / data.openPrice,2) : undefined;
  return this.marketList.insert({
    id: data.id,
    //目标币
    target:data.id.split("_")[0],
    //基础币
    basic:data.id.split("_")[1],
    frequencys: data.frequencys,
    openPrice: data.openPrice,
    closedPrice: data.closedPrice,
    lowPrice: data.lowPrice,
    highPrice: data.highPrice,
    volume: data.volume,
    isUserCollected: data.isUserCollected || false,
    increase: 0,
    //24小时增长
    increase24h
  });
}

// 更新一条市场数据
StoreHandler.prototype.UpdateMarketItem =  function(data,old) {
  data.increase24h = data.openPrice&&data.closedPrice ? util.toFixed((data.closedPrice - data.openPrice)*100 / data.openPrice,2) : undefined;
  if(!old.closedPrice || !data.closedPrice){
    data.increase = 0;
  }else{
    data.increase = old.closedPrice - data.closedPrice > 0?1:(old.closedPrice - data.closedPrice === 0?0:-1);
  }
  let row = Object.assign({},old,data);
  return this.marketList.update(row);
}

//获取K线数据
StoreHandler.prototype.GetBars = function (market, resolution, start, end, onDataCallback, onErrorCallback) {
  var key = market + '_' + resolution;
  var record = this.bars_records[key];
  var noDataRecord = this.bars_nodaterecord[key];
  var noData = false;
  if (noDataRecord) {
    if (noDataRecord.startTime >= start)
      noData = true;
  }
  var PrePartBars;
  var AfterPartBars;
  //如果内存里有则直接从内存里面获取，如果没有则从服务器端获取
  if (record) {
    if (noData === true || record.startTime <= start && record.endTime >= end) {
      var bars = this.GetBarsCollection().chain().find({
        'market': market,
        'resolution': resolution,
        'time': {$between: [start * 1000, end * 1000]}
      }).simplesort('time', false).data();
      var newBars = this.transBars(bars);
      onDataCallback(newBars,{noData:noData});
      start = 0;
      end = 0;
    } else if (record.startTime <= start && record.endTime < end && record.endTime > start) {
      var bars = this.GetBarsCollection().chain().find({
        'market': market,
        'resolution': resolution,
        'time': {$between: [start * 1000, record.endTime * 1000]}
      }).simplesort('time', false).data();
      var newBars = this.transBars(bars);
      console.log('88888', newBars);
      if (newBars.length > 0) {
        PrePartBars = newBars;
      }
      start = record.endTime;
    } else if (record.startTime > start && record.endTime >= end && end > record.startTime) {
      var bars = this.GetBarsCollection().chain().find({
        'market': market,
        'resolution': resolution,
        'time': {$between: [record.startTime * 1000, end * 1000]}
      }).simplesort('time', false).data();
      var newBars = this.transBars(bars);
      if (newBars.length > 0) {
        AfterPartBars = newBars;
      }
      end = record.startTime;
    }
  }
  console.log('next');
  //先进行数据订阅
  var sub = this.GetBarsSubCollection();
  var subed = sub.findOne({'market': market, 'resolution': resolution});
  if (!subed){
    sub.insert({
      'market': market,
      'resolution': resolution,
      'onDataCallback': onDataCallback,
      'onErrorCallback': onErrorCallback,
      'PrePartBars': PrePartBars,
      'AfterPartBars': AfterPartBars
    })
  }else {
    subed.onDataCallback = onDataCallback;
    subed.onErrorCallback = onErrorCallback;
    subed.PrePartBars = PrePartBars;
    subed.AfterPartBars = AfterPartBars;
    sub.update(subed);
  }
  // start end 可以为负的吗？
  if (start != 0 && end != 0) {
    var request = {market: market, resolution: resolution, start: start, end: end};
    //请求数据
    this.RequestBars(request);
  }
}
//订阅K线数据
StoreHandler.prototype.SubscribeBars = function (market, resolution, onRealtimeCallback, listenerGUID) {
  var col = this.GetRealtimeSubCollection();
  var oldSub = col.findOne({'listenerGUID': listenerGUID});
  if (!oldSub) {
    var lastBar = this.GetBarsCollection().chain().find({
      'market': market,
      'resolution': resolution
    }).simplesort('time', true).limit(1).data();

    var sub = {
      'market': market,
      'resolution': resolution,
      'listenerGUID': listenerGUID,
      'onRealtimeCallback': onRealtimeCallback,
      'lastBarTime': 0
    };
    // console.log('SubscribeBars', lastBar, sub);
    if (lastBar.length > 0) {
      onRealtimeCallback(lastBar[0]);
      sub.lastBarTime = lastBar[0].time;
      col.insert(sub);
    }
    else {
      col.insert(sub);
      //需要订阅数据
      var request = {
        market: market,
        resolution: resolution,
        start: parseInt((new Date().valueOf()) / 1000) - this.GetResolutionSeconds(resolution),
        end: 0
      };
      this.RequestBars(request);
    }
  }
}
//取消订阅K线数据
StoreHandler.prototype.UnSubscribeBars = function (listenerGUID) {
  var col = this.GetRealtimeSubCollection();
  var sub = col.findOne({'listenerGUID': listenerGUID});
  col.remove(sub);
}

StoreHandler.prototype.RequestBars = function (request) {
  this.GetBarsFunc(request);
}
StoreHandler.prototype.transBars = function (bars) {
  var newBars = [];
  bars.forEach(function (bar) {
    newBars.push({time: bar.time, open: bar.open, high: bar.high, low: bar.low, close: bar.close, volume: bar.volume});
  });
  return newBars;
}
//处理K线数据[{market:'',solution:'',time: '',open: '',high: '',low: '',close: ''}]
StoreHandler.prototype.BatchProcess = function (market, resolution, bars, start, end, noData) {
  //存储到内存数据库里
  var barsCol = this.GetBarsCollection();
  bars.forEach(function (bar) {
    barsCol.insert(bar);
  });
  var newBars = this.transBars(bars);
  console.log("BatchProcess", market, resolution, bars, start, end);
  var key = market + '_' + resolution;
  var record = this.bars_records[key];
  if (!record) {
    record = {startTime: 0, endTime: 0};
    this.bars_records[key] = record;
  }
  var query = {'market': market, 'resolution': resolution};
  if (newBars.length > 0) {
    var firstBar = newBars[0];
    var lastBar = newBars[newBars.length - 1];

    if (start < record.startTime || record.startTime == 0) record.startTime = start;
    if (end > record.endTime) record.endTime = end;

    var realtimeSubCol = this.GetRealtimeSubCollection();

    var realtimeSubs = realtimeSubCol.find(query);
    //获取倒数第二条K线数据
    var previousBar = newBars[newBars.length - 2];
    // console.log('realtimeSubs', realtimeSubs);
    realtimeSubs.forEach(function (realtimesub) {
      // console.log('realtimesub', realtimesub);
      if (realtimesub.lastBarTime == 0) {
        realtimesub.lastBarTime = previousBar.time;
        realtimesub.onRealtimeCallback(previousBar);
      }
      if (lastBar.time > realtimesub.lastBarTime) {
        realtimesub.lastBarTime = lastBar.time;
        realtimesub.onRealtimeCallback(lastBar);
      }
      realtimeSubCol.update(realtimesub);
    });
  }
  var barsSubCol = this.GetBarsSubCollection();
  var barsSubs = barsSubCol.find(query);
  barsSubs.forEach(function (barsSub) {
    var backBars = newBars;
    // console.log('barsSub.onDataCallback', barsSub);
    if (barsSub.PrePartBars) {
      backBars = barsSub.PrePartBars.concat(backBars);
      barsSub.PrePartBars = undefined;
      barsSubCol.update(barsSub);
    } else if (barsSub.AfterPartBars) {
      backBars = backBars.concat(barsSub.AfterPartBars);
      barsSub.AfterPartBars = undefined;
      barsSubCol.update(barsSub);
    }
    barsSub.onDataCallback(backBars, {noData: noData});
  });
  if (noData)
    this.bars_nodaterecord[key] = {'startTime': start}
}
StoreHandler.prototype.SingleProcess = function (market, resolution, bar) {
  var barsCol = this.GetBarsCollection();
  var oldBar = barsCol.findOne({'market': market, 'resolution': resolution, 'time': bar.time});
  if (!oldBar)
    barsCol.insert(bar);
  else {
    oldBar.open = bar.open;
    oldBar.high = bar.high;
    oldBar.low = bar.low;
    oldBar.close = bar.close;
    oldBar.volume = bar.volume;
    barsCol.update(oldBar);
  }

  var newBars = this.transBars([bar]);
  var key = market + '_' + resolution;
  var record = this.bars_records[key];
  if (!record) {
    record = {startTime: 0, endTime: 0};
    this.bars_records[key] = record;
  }

  var query = {'market': market, 'resolution': resolution};
  if (newBars.length > 0) {
    var firstBar = newBars[0];
    var lastBar = newBars[newBars.length - 1];

    var firstTime = parseInt(firstBar.time / 1000);
    if (firstTime < record.startTime || record.startTime == 0) record.startTime = firstTime;
    var lastTime = parseInt(lastBar.time / 1000);
    if (lastTime > record.endTime) record.endTime = lastTime + this.GetResolutionSeconds(resolution);

    var realtimeSubCol = this.GetRealtimeSubCollection();

    var realtimeSubs = realtimeSubCol.find(query);
    //获取倒数第二条K线数据
    var previousBar = newBars[newBars.length - 2];
    realtimeSubs.forEach(function (realtimesub) {
      if (realtimesub.lastBarTime == 0) {
        realtimesub.lastBarTime = previousBar.time;
        realtimesub.onRealtimeCallback(previousBar);
      }
      if (lastBar.time >= realtimesub.lastBarTime) {
        realtimesub.lastBarTime = lastBar.time;
        realtimesub.onRealtimeCallback(lastBar);
      }
    });
  }
}
StoreHandler.prototype.GetResolutionSeconds = function (resolution) {
  if (resolution == 'D')
    return 24 * 60 * 60;
  else
    return parseInt(resolution) * 60;
}

/*
* 首页交易市场
* */

//初始化api发送或者ws接受的数据处理,返回对应的结果，更新或者插入
StoreHandler.prototype.initApiData=function (data) {
  //console.log(data.id,data.Market) //data是{data}对象
  let market = this.marketList.findOne({id:data.id||data.Market});
  if(market){
    //更新数据
    //console.log('update')
    this.upDateMarketData(market,data)
  }else {
    //创建数据
    //console.log('created')
    //console.log(data)
    this.CreateMarketItems(data);

  }
}
StoreHandler.prototype.isHaveMarket=function (market) {
  return this.marketList.findOne({id:market.Market});
}

// 增加首页一条市场数据
StoreHandler.prototype.CreateMarketItems = function (data) {
  //市场ID
  let increase24h = data.OpenPrice&&data.ClosedPrice?((data.ClosedPrice - data.OpenPrice)>=0?'+':'')+util.toFixed((data.ClosedPrice - data.OpenPrice)*100 / data.OpenPrice,2) : '+'+'0.00';
  this.marketList.insert({
    id: data.id,
    //目标币
    target:data.id.split("_")[0],
    //基础币
    basic:data.id.split("_")[1],
    frequencys: data.Frequencys,
    openPrice: data.OpenPrice,
    closedPrice: data.ClosedPrice,
    lowPrice: data.LowPrice,
    highPrice: data.HighPrice,
    volume: data.Volume,
    isUserCollected: data.isUserCollected || false,
    isPrivated: data.isPrivated || false,
    collected:data.collected || false,
    increase: 0,
    //24小时增长
    increase24h:increase24h
  });
}
//更新数据
StoreHandler.prototype.upDateMarketData=function (markets,data){
  markets.increase24h = data.OpenPrice&&data.ClosedPrice?((data.ClosedPrice - data.OpenPrice)>=0?'+':'')+util.toFixed((data.ClosedPrice - data.OpenPrice)*100 / data.OpenPrice,2) : '+'+'0.00';
  markets.increase =markets.closedPrice&&data.ClosedPrice? markets.closedPrice - data.ClosedPrice > 0?1:(markets.closedPrice - data.ClosedPrice === 0?0:-1):0;
  markets.openPrice = data.OpenPrice
  markets.closedPrice = data.ClosedPrice
  markets.lowPrice = data.LowPrice;
  markets.highPrice = data.HighPrice;
  markets.volume = data.Volume;
  markets.isPrivated=data.isPrivated||false;
  markets.collected=data.collected||false;
  this.marketList.update(markets);
}

//更新收藏的数据
StoreHandler.prototype.upDateMarketCollectedData=function (data) {
  let marketOne = this.marketList.findOne({id:data.id});
  if(!marketOne){
    this.initApiData(data)
  }else {
    marketOne.collected=data.collected
    this.marketList.update(marketOne)
  }
}
//更新私有的数据
StoreHandler.prototype.upDateMarketPrivatedData=function (data) {
  let marketOne = this.marketList.findOne({id:data.id});
  if(!marketOne){
    this.initApiData(data)
  }else {
    marketOne.isPrivated=data.isPrivated
    this.marketList.update(marketOne)
  }

}

//返回所有热门市场列表数据集中的所有数据
StoreHandler.prototype.getHotMarketAllCollData=function (data) {
  let result=[]
  //console.log(data)
  for(let i in data){
    result.push(this.GetMarketsCollection().chain().find({'id':data[i].id}).data()[0])
  }
  //console.log(result)
  return result
}

//返回收藏排序或者非排序的数据
StoreHandler.prototype.getMarketCollectedSortData=function (isSort) {
  if(isSort.key!='0'){
    return this.GetMarketsCollection().chain().find({'collected':true}).simplesort(isSort.property,isSort.desc).data()
  }else {
    return this.GetMarketsCollection().chain().find({'collected':true}).data()
  }
}

//返回排序或者非排序的数据
StoreHandler.prototype.getMarketSortData=function (isSort,basic) {
  if(isSort.key!='0'){
    return this.GetMarketsCollection().chain().find({'basic':basic}).simplesort(isSort.property,isSort.desc).data()
  }else {
    return this.GetMarketsCollection().chain().find({'basic':basic}).data()
  }
}



//返回拥有的市场排序或者非排序的数据
StoreHandler.prototype.getMarketPrivatedSortData=function (isSort,basic) {
  if(isSort.key!='0'){
    return this.GetMarketsCollection().chain().find({'basic':basic,'isPrivated':true}).simplesort(isSort.property,isSort.desc).data()
  }else {
    //console.log('返回私有的市场',this.GetMarketsCollection().chain().find().data())
    return this.GetMarketsCollection().chain().find({'basic':basic,'isPrivated':true}).data()
  }
}

//根据基础币种搜索市场列表数据，并是否排序
StoreHandler.prototype.searchCurrency=function (key,basic,isSort) {
  key=key.toLocaleLowerCase()
  if(isSort.key!='0'){
    return this.GetMarketsCollection().chain().find({'basic':basic}).where((item)=>{return item.target.indexOf(key)>-1}).simplesort(isSort.property,isSort.desc).data()
  }else {
    return this.marketList.chain().find({'basic':basic}).where((item)=>{return item.target.indexOf(key)>-1}).sort((a,b)=>{ return a.target.indexOf(key)-b.target.indexOf(key)}).data()
  }
}

StoreHandler.prototype.searchPrivatedCurrency=function (key,basic,isSort) {
  key=key.toLocaleLowerCase()
  if(isSort.key!='0'){
    return this.GetMarketsCollection().chain().find({'basic':basic,'isPrivated':true}).where((item)=>{return item.target.indexOf(key)>-1}).simplesort(isSort.property,isSort.desc).data()
  }else {
    return this.marketList.chain().find({'basic':basic,'isPrivated':true}).where((item)=>{return item.target.indexOf(key)>-1}).sort((a,b)=>{ return a.target.indexOf(key)-b.target.indexOf(key)}).data()
  }
}


export default StoreHandler;
