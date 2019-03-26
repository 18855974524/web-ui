import api from '../../../../../libs/api'

let Datafeeds = {};
Datafeeds.UDFCompatibleDatafeed = function (klineStore, market, pricescale) {
  this._configuration = undefined;//图表配置信息
  this._enableLogging = false;//是否启用日志输出
  this._callbacks = {};//事件回掉字典
  this._initializationFinished = false;//是否完成了初始化
  this._initialize();//完成初始化
  this.Store = klineStore;
  this.market = market;
  this.pricescale = pricescale;
}
//框架配置
Datafeeds.UDFCompatibleDatafeed.prototype.defaultConfiguration = function () {
  return {
    supported_resolutions: ["1", "5", "15", "30", "60", "240", "480", "D", "5D", "1W", "1M"]
  };
}
//获取服务器时间
Datafeeds.UDFCompatibleDatafeed.prototype.getServerTime = function (callback) {
  // return parseInt((new Date().valueOf()) / 1000);
  api.post('/System/GetSystemTime').then((res) => {
    callback(res.data.value.utcNow);
  })
}

//事件回掉注册
Datafeeds.UDFCompatibleDatafeed.prototype.on = function (event, callback) {
  if (!this._callbacks.hasOwnProperty(event)) {
    this._callbacks[event] = [];
  }

  this._callbacks[event].push(callback);
  return this;
};
//触发事件
Datafeeds.UDFCompatibleDatafeed.prototype._fireEvent = function (event, argument) {
  if (this._callbacks.hasOwnProperty(event)) {
    var callbacksChain = this._callbacks[event];
    for (var i = 0; i < callbacksChain.length; ++i) {
      callbacksChain[i](argument);
    }

    this._callbacks[event] = [];
  }
};


Datafeeds.UDFCompatibleDatafeed.prototype._logMessage = function (message) {
  if (this._enableLogging) {
    var now = new Date();
    console.log(now.toLocaleTimeString() + '.' + now.getMilliseconds() + '> ' + message);
  }
};

//初始化图表配置信息(可从api获取配置信息)
Datafeeds.UDFCompatibleDatafeed.prototype._initialize = function () {
  var that = this;
  that._setupWithConfiguration(that.defaultConfiguration());//这里使用默认配置
};
//设置图表的配置的方法
Datafeeds.UDFCompatibleDatafeed.prototype._setupWithConfiguration = function (configurationData) {
  this._configuration = configurationData;
  if (!configurationData.exchanges) {
    configurationData.exchanges = [];
  }
  this.onInitialized();
  this._fireEvent('configuration_ready');
  this._logMessage('Initialized with ' + JSON.stringify(configurationData));
};

Datafeeds.UDFCompatibleDatafeed.prototype.onReady = function (callback) {
  var that = this;
  if (this._configuration) {//判断配置是否已经初始化完成
    setTimeout(function () {
      callback(that._configuration);
    }, 0);
  } else {
    this.on('configuration_ready', function () {
      callback(that._configuration);
    });
  }
};
//初始化完成的回掉函数
Datafeeds.UDFCompatibleDatafeed.prototype.onInitialized = function () {
  this._initializationFinished = true;
  this._fireEvent('initialized');
};
//读取市场配置信息
Datafeeds.UDFCompatibleDatafeed.prototype.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
  console.log('resolveSymbol', symbolName);
  var that = this;
  if (!this._initializationFinished) {
    this.on('initialized', function () {
      that.resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback);
    });

    return;
  }
  onSymbolResolvedCallback({
    "name": that.market,
    "minmov": 1,
    'full_name': that.market,
    "ticker": that.market,
    "has_intraday": true,
    "has_no_volume": false,
    "session":"24x7",
    "pricescale": that.pricescale,
    "supported_resolutions": ["1", "5", "15", "30", "60", "240", "480", "D", "5D", "1W", "1M"]
  });
}
//读取K线数据
Datafeeds.UDFCompatibleDatafeed.prototype.getBars = function (symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback) {
  console.log(resolution);
  this.Store.GetBars(symbolInfo.ticker, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback);
}
//订阅K线数据
Datafeeds.UDFCompatibleDatafeed.prototype.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
  this.Store.SubscribeBars(symbolInfo.ticker, resolution, onRealtimeCallback, listenerGUID);
};
//取消K线订阅
Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeBars = function (listenerGUID) {
  this.Store.UnSubscribeBars(listenerGUID);
};

export default Datafeeds;
