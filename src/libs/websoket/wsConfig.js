
import ByteBuffer from 'bytebuffer'
import ProtoBuf from 'protobufjs'

/**
 * wsUrl 服务端的ws地址，测试环境为 ws://192.168.125.230:8881
 * protoJsonUrl 指的是 proto_market.json 的位置，proto_market.json的内容可以从 http://192.168.125.230:8881/js/proto获取
 * urlencodedToken url编码 的 Token
 */

let wsBaseUrl = process.env.NODE_ENV === 'development'?'ws://192.168.125.230:8881':'wss://ws.azex.io';
let wsUrl = wsBaseUrl;
const protoJsonUrl = './static/proto.json';
const Controllers = {
  MarketController: 1//市场控制器
}


function GenerateCmdBuffer(controller, command, dataBuffer) {
  let controllerLittleEndian = new ByteBuffer(4).writeUint32(controller, 0).flip();
  let controllerBigEndian = new Uint8Array(4);
  controllerBigEndian[0] = controllerLittleEndian.view[3];
  controllerBigEndian[1] = controllerLittleEndian.view[2];
  controllerBigEndian[2] = controllerLittleEndian.view[1];
  controllerBigEndian[3] = controllerLittleEndian.view[0];
  let commandLittleEndian = new ByteBuffer(2).writeUint16(command, 0).flip();
  let commandBigEndian = new Uint8Array(2);
  commandBigEndian[0] = commandLittleEndian.view[1];
  commandBigEndian[1] = commandLittleEndian.view[0];
  let allBuffer = ByteBuffer.concat([controllerBigEndian, commandBigEndian, dataBuffer], "binary");
  return allBuffer.view;
}

function ByteToUnShort(b) {
  return (b[0] & 0xff) | ((b[1] & 0xff) << 8);
}

class WebSocketConnction {
  constructor() {
    this.ws = {};
    this.waitSendBuffer = [];
    this.closeByWebPage = false;
    this.sendCommands = {};
    this.receiveCommands = {};
  }

  start(callbacks={},token){
    if (token) {
      token = encodeURIComponent(token);
      wsUrl = `${wsBaseUrl}?Authorization=${token}`;
    }else{
      wsUrl = wsBaseUrl;
    }
    ProtoBuf.load(protoJsonUrl, (err, root) => {
      if(err){console.log('error', err)};
      this.startWS(root, callbacks);
    });
  }
  send(commandName,command,callback){
    if (this.ws.readyState === WebSocket.OPEN) {
      let cmd = this.sendCommands[commandName];
      let data = cmd.model.create(command);
      let dataBuffer = cmd.model.encode(data).finish();
      let buffer = GenerateCmdBuffer(Controllers.MarketController, cmd.code, dataBuffer);
      this.ws.send(buffer);
      if (callback) {
        callback();
      }
    }else{
      this.waitSendBuffer.push({commandName,command,callback});
    }
  }
  close(){
    if(this.ws.close){
      // 离开页面手动关闭连接
      console.log('手动关闭连接 websocket');
      this.closeByWebPage = true;
      this.ws.close();
    }
  }

  startWS(root, callbacks) {

    // 以下内容可以从 http://192.168.125.230:8881/js/commands 获取
    /**该部分代码通过服务端自动生成 BEGIN**/
    this.sendCommands = {
      ClientUserChat: { code: 1, model: root.lookup("Chat") },//用户发送的聊天内容
      MQToUserChat: { code: 2, model: root.lookup("BroadcastChat") },//消息队列发送给用户的聊天信息
      ReceiveMarketChat: { code: 3, model: root.lookup("ReceiveChat") },//接收市场聊天信息
      SetKLineFequency: { code: 900, model: root.lookup("GetKLineList") },//设置K线频率
      SingleKLine: { code: 901, model: root.lookup("KLineAggrDto") },//单条K线数据
      SetReceiveOtherMarketKLine: { code: 902, model: root.lookup("SubKLine") },//设置接受其它市场的K线数据
      MarketDepthList: { code: 904, model: root.lookup("MarketDepthList") },//市场深度列表数据
      TradeData: { code: 905, model: root.lookup("TradeFullDto") },//成交记录简单数据
      SetMarketDepth: { code: 906, model: root.lookup("SubMarketDepth") },//订阅市场深度
      SetReceiveTradeOrder: { code: 907, model: root.lookup("GetTopTradeList") },//设置接受交易订单数据
      GetRankingList: { code: 909, model: root.lookup("GetRankingList") },//获取交易市场排行
      CreateOrder: { code: 910, model: root.lookup("OrderInfoDto") },//订单创建数据
      PlanOrderTrigger: { code: 911, model: root.lookup("PlanOrderTrigger") },//计划订单被触发
      Login: { code: 1000, model: root.lookup("LoginToMarket") },//登录，用于接收个人订单变更数据
    };
    this.receiveCommands = {
      Error: { code: 0, model: root.lookup("WsError") },//错误信息
      ToUserChat: { code: 1, model: root.lookup("Chat") },//其它用户发送到用户浏览器的聊天内容
      OpenApiVerifyResult: { code: 2, model: root.lookup("Chat") },//开放API校验结果
      SingleKLine: { code: 1000, model: root.lookup("WsKLine") },//单条K线数据
      BatchKLine: { code: 1001, model: root.lookup("WsKLineList") },//多条K线数据
      BatchKLineSendComplate: { code: 1002, model: root.lookup("BatchSendComplate") },//批量K线发送完成，可以渲染
      MarketDepthData: { code: 1003, model: root.lookup("MarketDepthDto") },//市场深度数据
      MarketDepthDiff: { code: 1004, model: root.lookup("MarketDepthDiff") },//市场深度差异数据
      TradeSimpleDtoList: { code: 1005, model: root.lookup("TradeSimpleDtoList") },//成交订单列表
      ScrollDayKLine: { code: 1006, model: root.lookup("ScrollDayKLine") },//滑动24小时K线数据
      RankingDataList: { code: 1007, model: root.lookup("RankingDataList") },//价格上涨幅度排行列表
      CreateOrder: { code: 1008, model: root.lookup("OrderInfoDto") },//新增订单信息
      UpdateOrder: { code: 1009, model: root.lookup("UpdateOrderInfo") },//更新订单信息
      PlanOrderTrigger: { code: 1010, model: root.lookup("PlanOrderTrigger") },//计划订单触发
    };
        /**该部分代码通过服务端自动生成 END**/

    this.ws = new WebSocket(wsUrl);
    this.ws.onopen = (e) => {
      console.log("Connection open...");
      this.closeByWebPage = false;
      if(this.waitSendBuffer.length){
        this.waitSendBuffer.forEach((params)=>{
          console.log('waitSendBuffer',params);
          this.send(params.commandName,params.command,params.callback);
        })
      }
    };
    this.ws.binaryType = "arraybuffer";
    this.ws.onmessage = (e) => {
      if (e.data instanceof ArrayBuffer) {
        let cmdArray = new Uint8Array(e.data, 0, 2);
        let receiveBuffer = new Uint8Array(e.data, 2);
        let cmd = ByteToUnShort(cmdArray);
        for (const key in this.receiveCommands) {
          if (this.receiveCommands.hasOwnProperty(key) && cmd === this.receiveCommands[key].code) {
            const element = this.receiveCommands[key];
            // console.log(element.model.decode);
            let data = element.model.decode(receiveBuffer);
            callbacks[key]&&callbacks[key](data);
            break;
          }
        }
      } else {
        console.log('string:', e.data);
      }
    };
    this.ws.onerror = (e) => {
      console.log('websocked error',e);
    }
    this.ws.onclose = (e) => {
      console.log("Connection closed", e);
      // 异常关闭则重新连接
      !this.closeByWebPage&&this.startWS(root,callbacks);
    };

  };

}


export default WebSocketConnction;

// 使用示例
// ws.start({
//   "RankingDataList":function(data)function(data){
//     // console.log(data);


// 使用示例
// start({
//   "RankingDataList":function(data){
//     console.log(data);
//   }
// });
//
// setTimeout(() => {
//   // 测试发送
//   send("GetRankingList", { BasicId: "btc" }, function () { console.log("ok"); });
// }, 3000);
