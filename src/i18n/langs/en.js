import enLocale from 'element-ui/lib/locale/lang/en'
import enDisposit from './disposit/en'
import enFinancial from './financialRecord/en'
import apiManagement from './apiManagement/en'
import register from './register/en'
import getCash from './getCash/en'
import enAccountSetting from './accountSetting/en'
import enAsset from './asset/en'
import enCurrencyExchange from './currencyExchange/en'
import enPersonal from './personal/en' // personal 下公用配置 如 top-bar
import enCommon from './common/en' // 公用组件配置
import footer from './footer/en' // 公用组件配置
import enCoin from './coin/en' // 公用组件配置
import enorder from './order/en'
import enPageTitle from './pageTitle/en'
import superNode from './superNode/en'

import MarketOrder from './marketOrder/en'
import emailNotice from './emailNotice/en'
import login from './login/en'
import recharge from './recharge/en'
import authentication from './authentication/en'
import invite from './invite/en'
import mining from './mining/en'

const en = {
  message: {
    'User': 'username',
    'SystermError': 'system error',
    'TooMorePhone': "TooMorePhone",
    'ChoicePhone': "ChoicePhone",
    'loginTip':'Please log in',
    //Buttons
    'NextStep':'Next',
    'Login':'Log in',
    'Ensure':'Yes',
    'Regain':'Regain',
    "Cancel":'Cancel',
    "tableNoData": 'No data',
    "tableLoadingData": 'Loading…',
    'loadMore':'See more…'
  },
  ...enLocale,
  ...enDisposit,
  ...enFinancial,
  ...enAccountSetting,
  ...enPersonal,
  ...enAsset,
  ...enCommon,
  ...enCurrencyExchange,
  ...enCoin,
  ...apiManagement,
  ...register,
  ...getCash,
  ...footer,
  ...enorder,
  ...enPageTitle,
  ...MarketOrder,
  ...emailNotice,
  ...login,
  ...recharge,
  ...authentication,
  ...invite,
  ...superNode,
  ...mining
}

export default en;
