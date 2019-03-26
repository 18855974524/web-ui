import api from '../../libs/api'
import $i18n from '../../i18n/i18n'
import VueCookies from 'vue-cookie'


function getBrowserLanguage(){
  let lang = navigator.language;
  if(lang.match(/^zh/)){
    return 'cn'
  }else if(['ko','ja','ru'].includes('lang')){
    return lang
  }else {
    return 'en'
  }
}
function getCoinByLang(lan){
  switch(lan){
    case 'cn': return 'Cny';break;
    case 'en': return 'Usd';break;
    case 'ko': return 'Krw';break;
    case 'ja': return 'Jpy';break;
    case 'ru': return 'Rub';break;
    default: return 'Usd';break;
  }
}


const user = {
  state: {
    token: null,
    isLogin: false,
    coin:'Cny',
    language:'cn',
    hiddenAsset:false,
    notRemindOpenGoogleOpt:false,
    info:undefined,
    isSecVerification:false,
    userAsset:0,
    userAssetGrowth:0,
    legalMoneyPerCurrency:{
      // 币种对法币的单位兑换
    },
  },
  mutations: {//必须同步函数
    ['SET_TOKEN'] (state, data) {
      VueCookies.set('token', JSON.stringify(data),{path:'/'});
      state.token = data;
      state.isLogin = (state.isSecVerification&&!!state.token);
    },
    ['SET_NOT_REMIND_GOOGLE_OPT'] (state, data) {
      state.notRemindOpenGoogleOpt = data.opt;
      data.local ? localStorage.setItem('notRemindGOpt', JSON.stringify(data.opt)) : VueCookies.set('notRemindGOpt', JSON.stringify(data.opt));
    },
    ['SET_HIDDEN_ASSET'] (state, data) {
      state.hiddenAsset = data;
      localStorage.setItem('hiddenAsset', JSON.stringify(data));
    },
    ['SET_USER'] (state, data) {
      state.info = data;
    },
    ['SET_COIN'] (state, data) {
      state.coin = data || getCoinByLang(state.language);
      localStorage.setItem('coin', JSON.stringify(state.coin));
    },
    ['SET_LANGUAGE'] (state, data) {
      state.language = data || getBrowserLanguage();
      $i18n.locale = state.language;
      localStorage.setItem('language', JSON.stringify(state.language));
    },
    ['SET_SECVERIFICATION'] (state, data) {
      // sessionStorage.setItem('isSecVerification', JSON.stringify(data));
      VueCookies.set('isSecVerification', JSON.stringify(data),{path:'/'});
      state.isSecVerification = data;
      state.isLogin = (state.isSecVerification&&!!state.token);
    },
    ['SET_LEGALMONEYPERCURRENCY'] (state, data) {
      state.legalMoneyPerCurrency[data.currency] = {
        percent: data.percent,
        expire: new Date().getTime()+30*60*1000,
      };
    },
    ['SET_USERASSET'] (state, data) {
      state.userAsset = data
    },
  },
  actions: {
    setToken : ({dispatch,commit},data) => {
      commit('SET_TOKEN',data)
    },
    clearToken : ({commit}) => {
      commit('SET_TOKEN', null)
      commit('SET_SECVERIFICATION', false)
      commit('SET_USER', null)
      if(!JSON.parse(localStorage.getItem('notRemindGOpt'))){
        commit('SET_NOT_REMIND_GOOGLE_OPT', {opt:false})
      }
    },
    getUser : async ({commit}) => {
      await api.post('/User/GetUserInfo')
        .then((res)=>{
          commit('SET_USER',res.data.value)
        });
      return true;
    },
    setUser : ({commit},data) => {
      commit('SET_USER', data)
    },
    setCoin : ({commit},data) => {
      commit('SET_COIN', data)
    },
    setLanguage : ({commit},data) => {
      commit('SET_LANGUAGE', data)
    },
    setNotRemindGoogleOpt : ({commit}, data) => {
      commit('SET_NOT_REMIND_GOOGLE_OPT', data)
    },
    setHiddenAsset : ({commit},data) => {
      commit('SET_HIDDEN_ASSET', data)
    },
    setSecVerification : ({dispatch,commit},data) => {
      commit('SET_SECVERIFICATION', data)
    },
    clearSecVer : ({commit}) => {
      commit('SET_SECVERIFICATION', false)
    },
    getLegalMoneyPerCurrency : ({commit},data) => {
      return new Promise((resolve,reject)=>{
        api.post('/Currency/ExchangeLegalMoney',{
          "volume": 1,
          "fromCurrency": data.currency,
          "toLegalMoney": data.coin
        })
          .then((res)=>{
            commit('SET_LEGALMONEYPERCURRENCY',{currency:data.currency,percent:res.data.value.volume})
            resolve();
          }).catch(()=>{
            reject();
        });
      })

    },
    setLegalMoneyPerCurrency : ({commit},data) => {
      commit('SET_LEGALMONEYPERCURRENCY', data)
    },
    setUserAsset:({commit},data)=>{
      commit('SET_USERASSET', data)
    },
    initUser: ({dispatch}) => {
      dispatch('setToken',JSON.parse(VueCookies.get('token')));
      dispatch('setSecVerification', JSON.parse(VueCookies.get('isSecVerification')));
      dispatch('setLanguage',JSON.parse(localStorage.getItem('language')));
      dispatch('setCoin',JSON.parse(localStorage.getItem('coin')));
      dispatch('setNotRemindGoogleOpt',{opt:(JSON.parse(localStorage.getItem('notRemindGOpt')) || JSON.parse(VueCookies.get('notRemindGOpt')))});
      dispatch('setHiddenAsset',JSON.parse(localStorage.getItem('hiddenAsset')));
      if(JSON.parse(VueCookies.get('token'))&&JSON.parse(VueCookies.get('isSecVerification'))){
        dispatch('getUser')
      }
    }
  }
};

export default user
