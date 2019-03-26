import axios from 'axios';
import store from '../store'
import router from '../router'
import {Message} from 'element-ui'
import i18n from '../i18n/i18n'
import VueCookies from 'vue-cookie'
import api from './api'
import {Decimal} from 'decimal.js'


let util = {};
const ajaxUrl = process.env.NODE_ENV === 'development' ?
  'http://192.168.125.230:8882':
  'https://api.azex.io';
util.ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000
});

// http request 拦截器≈
util.ajax.interceptors.request.use(
  config => {
    let token = store.state.user.token || JSON.parse(VueCookies.get('token')) || '';
    //console.log(token)
    if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Lang = store.state.user.language || JSON.parse(localStorage.getItem('language')) || 'cn';
    config.headers.LegalMoney = store.state.user.coin || JSON.parse(localStorage.getItem('coin')) || 'Cny';
    //console.log(config)
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
// http response 拦截器
util.ajax.interceptors.response.use(
  response => {
    if (true !== response.data.isOk) {
      console.log(response)
      /*
      * 判断所有提示信息
      */
       if (response.data.err.code == "-2" || response.data.err.code == "-22" || response.data.err.code == "-1" || response.data.err.code == "19") {
         console.log("错误码为：" + response.data.err.code + ",跳转到登陆页面");
         store.dispatch('clearToken');
         Message({showClose: true, message: i18n.t('login.InformationValid'), type: 'error'});
         router.push({ name: "login" });
       }else if(response.data.err.code == "-6"){
         Message({showClose: true, message: i18n.t('login.LockAccount'), type: 'error'});
         store.dispatch('clearToken');
         router.push({ name: "login" });
       }else {
         Message({ message:response.data.err.message, showClose:true, type:'error'});
       }
      return Promise.reject(response);
    }
    return response;
  },
  error => {
    if (error.response) {
      Message({ message:i18n.t("message.SystermError"), showClose:true, type:'error'});
    }
    return Promise.reject(error.response)   // 返回接口返回的错误信息
  }
);

util.getCurrencySymbol = (coin = store.state.user.coin) => {
  return store.state.dict.coinSymbolList[coin];
}

util.toFixed = (d,s=0) => {
  if(!d && d!==0){
    return 0;
  }
  // 不要超过 16 位
  if (s === 0)
    return Math.floor(d);
  let str = util.scientificToNumber(d).toString();
  let index = str.indexOf('.');
  if(index !== -1){
    let num = str.length-index-1; //原有小数位数
    if(num<s){
      str = `${str}${'0'.repeat(s-num)}`
    }else{
      str = str.slice(0,index+1+s);
    }
  }else{
    str = `${str}.${'0'.repeat(s)}`
  }
  return str
}

util.scientificToNumber = (value) => {
  if(!value && value !==0 ){
    return;
  }
  // e-7 e+21
  let str = value.toString();
  let eIndex = str.indexOf('e');
  if(eIndex<0){
    return value;
  }
  let sign = str.substr(eIndex+1,1);
  let powNum = str.slice(eIndex+2);
  let arr = [];
  if(sign === '-'){
    powNum = powNum - 6;
    arr = new Decimal(value).mul(Math.pow(10,powNum)).toString().split('');
    let dotIndex = arr.indexOf('.');
    arr.splice(dotIndex+1,0,'0'.repeat(powNum));
  }else{
    powNum = powNum - 20;
    arr = new Decimal(value).div(Math.pow(10,powNum)).toString().split('');
    let dotIndex = arr.indexOf('.');
    if(dotIndex === -1){
      arr.push('0'.repeat(powNum));
    }else{
      let dotNum = arr.length - dotIndex -1; // 小数位数
      arr.splice(dotIndex,1); //去掉小数点
      let diff = dotNum - powNum;
      if(diff <= 0){
        arr.splice(arr.length-1,0,'0'.repeat(diff)) // 补齐 0
      }else{
        arr.splice(arr.length-1-diff,0,'.') // 加上小数点
      }
    }
  }
  return arr.join('');
}




// 获取币种转换为法币的结果 不做过期判断
util.getCurrencyToLegalMoney = (currency,volume = 0, legalMoney = store.state.user.coin) => {
  if(!currency || !volume){
    return 0;
  }
  let curCvtUsdt = store.state.dict.currencyToUsdt[currency];
  let usdtCvtLM = legalMoney !== 'USD'?store.state.dict.usdtToLegalMoney[legalMoney]:1;
  return new Decimal(volume).mul(curCvtUsdt).mul(usdtCvtLM).toString();
}
util.updateExpireRateStore = async () => {
  let usdtToLM = store.state.dict.usdtToLegalMoney;
  if(!usdtToLM.expire || util.isExpire(usdtToLM.expire)){
    await store.dispatch('getLegalMoneyPerUsdt');
  }
  let curToUsdt = store.state.dict.currencyToUsdt;
  if(!curToUsdt.expire || util.isExpire(curToUsdt.expire)){
    await store.dispatch('getUSDTPerCur');
  }
  return;
}
util.isExpire = (time) => {
  return time < new Date().getTime();
}


export default util;
