import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import zhDisposit from './disposit/cn'
import zhFinancial from './financialRecord/cn'
import apiManagement from './apiManagement/cn'
import register from './register/cn'
import getCash from './getCash/cn'
import zhAccountSetting from './accountSetting/cn'
import zhAsset from './asset/cn'
import zhCurrencyExchange from './currencyExchange/cn'
import zhPersonal from './personal/cn' // personal 下公用配置 如 top-bar
import zhCommon from './common/cn' // 公用组件配置
import footer from './footer/cn' // 公用组件配置
import zhCoin from './coin/cn' // 公用组件配置
import zhorder from './order/cn'
import zhPageTitle from './pageTitle/cn'
import superNode from './superNode/cn'

import MarketOrder from './marketOrder/cn'
import emailNotice from './emailNotice/cn'
import login from './login/cn'
import recharge from './recharge/cn'
import authentication from './authentication/cn'
import invite from './invite/cn'
import mining from './mining/cn'

const cn = {
  message: {
    'loginTip': '请先登录',
    'SystermError': '系统出错了，请稍后再试',
    'User': '用户名',
    //按钮类
    'NextStep': '下一步',
    'Login': '登录',
    'Ensure': '确定',
    'Regain': '重新获取',
    "Cancel": '取消',
    //table
    "tableNoData": '暂无数据',
    "tableLoadingData": '加载中…',
    'loadMore':'加载更多…'
  },

  ...zhFinancial,
  ...zhLocale,
  ...zhDisposit,
  ...apiManagement,
  ...register,
  ...zhAccountSetting,
  ...zhPersonal,
  ...zhCommon,
  ...getCash,
  ...footer,
  ...zhAsset,
  ...zhCurrencyExchange,
  ...zhCoin,
  ...zhorder,
  ...zhPageTitle,
  ...MarketOrder,
  ...emailNotice,
  ...login,
  ...recharge,
  ...authentication,
  ...invite,
  ...superNode,
  ...mining
}
export default cn;
