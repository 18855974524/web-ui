import Vue from 'vue'

import store from './store';
import ElementUI from 'element-ui';

import App from './App'
import router from './router'
import i18n from './i18n/i18n';

//公共样式
import './fonts/iconfont.css'
import './fonts/font-family.css'
import './assets/style/element-variables.scss'
import './assets/style/index.scss'
import './assets/style/country.css'


import './fonts/iconfont.js'

//自定义函数
import './libs/index.js'
import util from './libs/util.js'


// 智能验证
import './libs/guide.js'
import './libs/smartCaptcha.js'

import {Decimal} from 'decimal.js'
//
// 点击复制文本
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import VueCookies from 'vue-cookie'
Vue.use(VueCookies)

Vue.use(ElementUI)
//

Vue.filter('utcToMd',function (value) {
  if(!value) return
  let Sdate=new Date(value);
  let M='0'+(Sdate.getMonth() + 1);
  let D='0'+Sdate.getDate()
  return M.substr(-2,2)+'-'+D.substr(-2,2)
})
Vue.filter('dateTime', function(value,filter={}) {
  // filter 参数说明
  /*
    onlyD:只包含日期
    notS:不包含秒数显示
    ...
   */
  if(!value) {
    return '';
  }
  if(typeof filter !== 'object'){
    return value;
  }
  let d = new Date(value*1000);
  let year = d.getFullYear();
  let month = '0'+(d.getMonth() + 1);
  let day = '0'+d.getDate();
  let dateArr = [year,'/',month.substr(-2,2),'/',day.substr(-2,2)];
  if(filter.onlyD){
    return dateArr.join('');
  }
  let hour = '0'+d.getHours()+'';
  let minutes = '0'+d.getMinutes()+'';
  let seconds = '0'+d.getSeconds()+'';
  dateArr = [...dateArr,' ',hour.substr(-2,2),':',minutes.substr(-2,2),':',seconds.substr(-2,2)];
  if(filter.notS){
    dateArr.splice(dateArr.length-2);
  }
  return dateArr.join('');
});
Vue.filter('sliceFilter',function (value) {
  if(!value){
    return ''
  }
   return value.slice(value.indexOf('/')+1)
});
Vue.filter('currency', function(value, decimals=2) {
  value = parseFloat(value);
  if (!isFinite(value) || !value && value !== 0) return '';
  let _currency = util.getCurrencySymbol()+' ';
  let stringified = ''+util.toFixed(Math.abs(value),decimals)
  // let _int = decimals>0 ? stringified.slice(0, -1 - decimals) : stringified;
  // let i = _int.length % 3;
  // let head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
  // let _float = decimals>0 ? stringified.slice(-1 - decimals) : '';
  let sign = value < 0 ? '-' : '';
  // let digitsRE = /(\d{3})(?=\d)/g;
  // return sign + _currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
  return sign + _currency + stringified;
});

// market no data show
Vue.filter('noDataShow',function(value,repText,isFilter0 = false){
  return (value || (value === 0 && !isFilter0)) ? value : repText;
})

// 科学计数法正常显示
Vue.filter('scientific',util.scientificToNumber);

// fixed show
Vue.filter('toNumFixed',function(value,num = 8){
  return value || value === 0 ? util.toFixed(value,num) : value;
})

Vue.filter('toLegalMoney',function(volume,currency,lm){
  return util.getCurrencyToLegalMoney(currency,volume,lm);
})


Vue.filter('hostImgPath',function(value){
  let baseUrl = process.env.NODE_ENV === 'production'?'https://api.azex.io':'http://192.168.125.230:8882';
  return `${baseUrl}${value}`
})

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  store,
  render: h => h(App),
  data() {
    return {
      brt: new Vue(),
    }
  }
}).$mount('#app');
