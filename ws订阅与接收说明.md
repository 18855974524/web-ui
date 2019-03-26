功能         | 提交订阅                       | 接收函数                                     | 用处           | 备注
---------- | -------------------------- | ---------------------------------------- | ------------ | -------------------------------------------------------------------------
获取成交记录     | SetReceiveTradeOrder       | TradeSimpleDtoList                       | 最近成交         |
获取批量K线数据   | SetKLineFequency           | BatchKLine , BatchKLineSendComplate      | K线图          |
获取单条K线数据   | SetReceiveOtherMarketKLine | SingleKLine                              | K线图          | Frequencys 可选值 "1", "5", "15", "30", "60", "180", "360", "720", "D", "7D"
获取24小时单条K线 | SetReceiveOtherMarketKLine | ScrollDayKLine                           | 币币交易-市场行情、首页 | Frequencys 为 SD1
获取市场深度     | SetMarketDepth             | MarketDepthData                          | 币币交易-最新价格    |
更新当前委托     | Login                          | CreateOrder，UpdateOrder，PlanOrderTrigger | 更新 币币交易-当前委托 |


# 获取proto模型定义文件

http://192.168.125.230:8881/js/proto

# 已登录用户，如何订阅ws数据

假设原 ws 地址是  ：ws://192.168.125.231:8881

当前用户的token 为  

eydUeXBlJzonSldUJywnQWxnJzonSFMyNTYnfQ==.eydJZCc6JzViMDc4MDY3YTQxYjk5NzFlOGYxZThjNCcsJ1N1Yic6JzQnLCdBdWQnOidXZWInLCdJcCc6JycsJ0lhdCc6JzE1MjcyMTgyNzknLCdFeHAnOicxNTI3MjQ3MDc5JywnTm90ZSc6JzAnfQ==.w/H6Utr8mXE94Ci5Lxsy7Qxb0YOqrSlR0GVQ1skuxkU=

Urlencode 之后的 token为

eydUeXBlJzonSldUJywnQWxnJzonSFMyNTYnfQ%3D%3D.eydJZCc6JzViMDc4MDY3YTQxYjk5NzFlOGYxZThjNCcsJ1N1Yic6JzQnLCdBdWQnOidXZWInLCdJcCc6JycsJ0lhdCc6JzE1MjcyMTgyNzknLCdFeHAnOicxNTI3MjQ3MDc5JywnTm90ZSc6JzAnfQ%3D%3D.w%2FH6Utr8mXE94Ci5Lxsy7Qxb0YOqrSlR0GVQ1skuxkU%3D

那么，用户登录之后的ws 地址，应该为：

ws://192.168.125.231:8881?Authorization=eydUeXBlJzonSldUJywnQWxnJzonSFMyNTYnfQ%3D%3D.eydJZCc6JzViMDc4MDY3YTQxYjk5NzFlOGYxZThjNCcsJ1N1Yic6JzQnLCdBdWQnOidXZWInLCdJcCc6JycsJ0lhdCc6JzE1MjcyMTgyNzknLCdFeHAnOicxNTI3MjQ3MDc5JywnTm90ZSc6JzAnfQ%3D%3D.w%2FH6Utr8mXE94Ci5Lxsy7Qxb0YOqrSlR0GVQ1skuxkU%3D

也就是  {原地址}?Authorization={urlencode(token)}