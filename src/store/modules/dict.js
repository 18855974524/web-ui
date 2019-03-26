import api from '../../libs/api'

const dict = {
  state: {
    languageList:[],
    languageCodeObj:{},
    legalMoneyList:[],
    coinSymbolList: {//法币符号
      Usd: "$",
      Cny: "¥",
      Jpy: "¥",
      Eur: "€",
      Gbp: "£",
      Krw: "₩",
      Hkd: "$",
      Aud: "$",
      Cad: "$",
      Rub: "₽",
    },
    coinCode: {//法币对应的
      Usd: 0,
      Cny: 1,
      Jpy: 2,
      Eur: 3,
      Gbp: 4,
      Krw: 5,
      Hkd: 6,
      Aud: 7,
      Cad: 8,
      Rub: 9,
    },
    coinPrecision:{},
    marketPrecision:{},
    currencyToUsdt:{
      // 其他币种对 USDT 的单位兑换
    },
    usdtToLegalMoney:{
      // USDT 对法币的单位兑换
      'Usd':1,
      'Cny': 0,
      'Jpy': 0,
      'Eur': 0,
      'Gbp': 0,
      'Krw': 0,
      'Hkd': 0,
      'Aud': 0,
      'Cad': 0,
      'Rub': 0,
    },
    exportUrl:{}
  },
  mutations: {
    ['SET_LANGUAGE_LIST'] (state, data) {
      state.languageList = data;
      data.forEach((lang)=>{
        state.languageCodeObj[lang.code] = lang;
      })
    },
    ['SET_LEAGE_MONEY_LIST'] (state, data) {
      state.legalMoneyList = data;
    },
    ['SET_COIN_PRECISION'] (state, data) {
      Object.assign(state.coinPrecision,data)
    },
    ['SET_MARKET_PRECISION'] (state, data) {
      Object.assign(state.marketPrecision,data)
    },
    ['SET_USDT_LEGALMONEY'] (state, data) {
      let length = Object.keys(data).length;
      Object.assign(state.usdtToLegalMoney,data,length?{
        expire: new Date().getTime() + 60*60*1000
      }:{})
    },
    ['SET_CUR_TO_USDT'] (state, data) {
      let length = Object.keys(data).length;
      Object.assign(state.currencyToUsdt,data,length?{
        expire: new Date().getTime() + 60*1000
      }:{})
    },
    ['SET_EXPORT_URL'] (state,data){
      state.exportUrl=data
    }
  },
  actions: {
    asyncSetExportUrl:async ({commit},data)=>{
      let exportUrl={}
      await api.post('/Currency/GetCurrencyAddressInfos').then(res=>{
        let tempUrl=res.data.value
        for(let k in tempUrl){
          exportUrl[tempUrl[k].id]=tempUrl[k].explorerUrl
        }
      })
      commit('SET_EXPORT_URL',exportUrl)
    },
    getLegalMoneyList : ({commit},data) => {
      return new Promise((resolve,reject)=>{
        api.post('/LegalMoney/GetLegalMoneyList')
          .then((res)=>{
            commit('SET_LEAGE_MONEY_LIST',res.data.value)
            resolve();
          }).catch(()=>{
          reject();
        });
      })

    },
    getLanguageList : ({commit},data) => {
      return new Promise((resolve,reject)=>{
        api.post('/Language/GetOptions')
          .then((res)=>{
            commit('SET_LANGUAGE_LIST',res.data.value)
            resolve();
          }).catch(()=>{
          reject();
        });
      })
    },
    /**
     *
     * @param commit
     * @param data is a Array List
     * @returns {Promise<void>}
     *
     */
    asyncSetCoinPrecision : async({commit},data)=>{
      let tempObj={}
      await api.post('/Currency/GetCurrencyPrecisions').then(res=>{
        let temp=res.data.value
        for(let i in temp){
          tempObj[temp[i].id]=temp[i]
        }
      })
      commit('SET_COIN_PRECISION',tempObj)
    },
    asyncSetMarketPrecision : async({commit},data)=>{
      let tempObj={}
      await api.post('/Market/GetMarketPrecisions').then(res=>{
        let temp =res.data.value
        for(let i in temp){
          tempObj[temp[i].id]=temp[i]
        }
      })
      commit('SET_MARKET_PRECISION',tempObj)
    },
    getUSDTPerCur : ({commit},data) => {
      //获取所有基本币种转换成usdt的汇率，usdt约=1美元
      return new Promise((resolve,reject)=>{
        api.post('/Currency/GetCurrencyExchangeRate').then((res)=>{
            commit('SET_CUR_TO_USDT',res.data.value.exchangeRate)
            resolve();
          }).catch(()=>{
          reject();
        });
      })

    },
    getLegalMoneyPerUsdt : ({commit}) => {
      //获取美元对应其他法币的汇率集合
      return new Promise((resolve,reject)=>{
        api.post('/LegalMoney/GetLegalMoneyRate',{
          "legalMoney": 0,
        })
          .then((res)=>{
            commit('SET_USDT_LEGALMONEY',res.data.value.to)
            resolve();
          }).catch(()=>{
          reject();
        });
      })

    },
  }
};

export default dict
