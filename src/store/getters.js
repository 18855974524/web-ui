
export default {
  languageCodeObj : state => state.dict.languageCodeObj,
  languageList : state => state.dict.languageList,
  legalMoneyList : state => state.dict.legalMoneyList,
  coinSymbolList : state => state.dict.coinSymbolList,
  coinPrecision : state => state.dict.coinPrecision,
  marketPrecision : state => state.dict.marketPrecision,
  usdtToLegalMoney :state=>state.dict.usdtToLegalMoney,
  currencyToUsdt:state=>state.dict.currencyToUsdt,
  coin:state=>state.user.coin,
  exportUrl :state=>state.dict.exportUrl
}
