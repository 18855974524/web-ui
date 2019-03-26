import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import VueCookies from 'vue-cookie'
import api from '../libs/api'
import util from '../libs/util'
import $i18n from '../i18n/i18n'

import Index from '@/components/pages/index'

import HomePage from '@/components/pages/home/index'
import supernode from '@/components/pages/home/superNode/supernode'
import superNodeList from '@/components/pages/home/superNode/superNodeList'
import projectDetail from '@/components/pages/home/superNode/projectDetail'
import nodeDetail from '@/components/pages/home/superNode/nodeDetail'

import LoginIndex from '@/components/pages/login/index'
import Login from '@/components/pages/login/login'
import Register from '@/components/pages/login/register'
import ForgetPassword from '@/components/pages/login/forgetPassword'

import Personal from '@/components/pages/personal/index'
import PersonalMain from '@/components/pages/personal/main/index'
import AccountSettingHome from '@/components/pages/personal/main/accountSetting'
import RedPaperHome from '@/components/pages/personal/main/redPaper'
import InviteBackCashHome from '@/components/pages/personal/main/inviteBackCash'

//币币交易
import CurrencyExchange from '@/components/pages/currencyExchange/index'

//提币地址管理
import depositManage from '@/components/pages/personal/depositManage/index'
import depositAddress from '@/components/pages/personal/depositManage/depositAddress'

// import Googleverify from '@/components/common/Googleverify/index'
// import emailVerify from '@/components/common/emailVerify/index'

import AccountSetting from '@/components/pages/personal/accountSetting/index'
import ResetPwd from '@/components/pages/personal/accountSetting/account/updatePassword'
import ResetTradePwd from '@/components/pages/personal/accountSetting/tradePassword/resetPwd'
import SetTradePwd from '@/components/pages/personal/accountSetting/tradePassword/setPwd'
import UpdateTradePwd from '@/components/pages/personal/accountSetting/tradePassword/updatePwd'
import ApiManagement from '@/components/pages/personal/accountSetting/apiManagement/apiManagement'
import Authentication from '@/components/pages/personal/accountSetting/realNameAuthentication/authentication'
import EmailNotification from '@/components/pages/personal/accountSetting/emailnotification/emailnotification'
import LoginLog from '@/components/pages/personal/accountSetting/loginLog/loginLog'

import chargeMoneyRecord from '@/components/pages/personal/chargeMoneyRecord/index'
import chargeMoneyMain from '@/components/pages/personal/chargeMoneyRecord/chargeMoneyMain'
import drawMoney from '@/components/pages/personal/chargeMoneyRecord/drawMoney'
import otherRecord from '@/components/pages/personal/chargeMoneyRecord/otherRecord'

import startGoogleVerify from '@/components/pages/personal/accountSetting/startGoogleVerify/index'
import SetNewPwd from '@/components/pages/login/setNewPwd'


//订单管理
import orderManage from '@/components/pages/personal/orderManage/index'
import currentRecord from '@/components/pages/personal/orderManage/currentRecord'
import pastRecord from '@/components/pages/personal/orderManage/pastRecord'
import detailsView from '@/components/pages/personal/orderManage/detailView'

import myAssets from '@/components/pages/personal/assets/index'

// 活动页面
import Invite from '@/components/pages/invite/invitationToReturn'
import mining from '@/components/pages/mining/index'
import tradeMining from '@/components/pages/mining/tradingMining'
import myMining from '@/components/pages/mining/myMining'

//zendesk
import ZendeskLogin from '@/components/common/ZendeskLogin/zendesklogin'
//测试
// import HelloWorld from '@/components/pages/HelloWorld'


Vue.use(Router)

const routes = [
  {
    path: '/mk',
    name: 'currencyExchange',
    component: CurrencyExchange,
    beforeEnter: (to, from, next) => {
      if (!to.query.pair) {
        let pair = localStorage.getItem('last_exchange_pair');
        if(pair){
          next({
            name: to.name,
            query:{
              pair,
            },
          });
        }else{
          api.post('/Market/GetMarketBriefInfoList', {
            'basic': 'btc'
          })
            .then((res) => {
              let query = {pair: res.data.value.items[0], ...to.query}
              next({
                name: to.name,
                query,
              });
            })
        }
      } else {
        next();
      }
    },
    meta: {
      title: $i18n.t('pageTitle.currencyExchange')
    }
  },
  {
    path: "/registerInvite",
    name: 'registerTo',
    component: Register,
    meta: {
      title: $i18n.t('pageTitle.register')
    },

  },
  {
    path: "/loginInvite",
    name: 'loginTo',
    component: Login,
    meta: {
      title: $i18n.t('pageTitle.login')
    },

  },
  {
    path:'/ZdLogin',
    name:'ZendeskLogin',
    component: ZendeskLogin
  },
  {
    path: '/',
    component: Index,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'homePage',
        component: HomePage,
        meta: {
          title: $i18n.t('pageTitle.home')
        }
      },
      {
        path: '/snode',
        name: 'supernode',
        component: supernode,
        meta: {
          title: $i18n.t('pageTitle.supernode')
        },
        children: [
          {
            path: '',
            redirect: 'superNodeList',
          },
          {
            path: 'list',
            name:'superNodeList',
            component: superNodeList,
          },
          {
            path: 'pDetail',
            name: 'projectDetail',
            component: projectDetail,
          },
          {
            path: 'nDetail',
            name: 'nodeDetail',
            component: nodeDetail,
          },
        ]
      },
      {
        path: '/login',
        component: LoginIndex,
        beforeEnter: (to, from, next) => {
          if (store.state.user.isLogin) {
            next({
              path: '/',
            });
          } else {
            let localToken = JSON.parse(VueCookies.get('token'));
            let SessionVerification = JSON.parse(VueCookies.get('isSecVerification'));
            if (localToken && SessionVerification) {
              store.dispatch('setToken', localToken);
              store.dispatch('setSecVerification', SessionVerification);
              next({
                path: '/',
              });
            } else {
              localToken && store.dispatch('clearToken');
              SessionVerification && store.dispatch("clearSecVer");
              next()
            }
          }
        },
        children: [
          {
            path: '/',
            redirect: 'login',
          },
          {
            path: 'login',
            name: 'login',
            component: Login,
            meta: {
              title: $i18n.t('pageTitle.login')
            }
          },
          {
            path: 'register',
            name: 'register',
            component: Register,
            meta: {
              title: $i18n.t('pageTitle.register')
            },
          },
          {
            path: 'fogetPwd',
            name: 'fogetPassword',
            component: ForgetPassword,
            meta: {
              title: $i18n.t('pageTitle.login')
            }
          },
          {
            path: 'setNewPwd',
            name: 'setNewPwd',
            component: SetNewPwd,
            meta: {
              title: $i18n.t('pageTitle.login')
            }
          }
        ]
      },
      {
        path: '/personal',
        component: Personal,
        beforeEnter: (to, from, next) => {
          if (store.state.user.isLogin) {
            next();
          } else {
            let localToken = JSON.parse(VueCookies.get('token'));
            let SessionVerification = JSON.parse(VueCookies.get('isSecVerification'));
            if (localToken && SessionVerification) {
              store.dispatch('setToken', localToken);
              store.dispatch('setSecVerification', SessionVerification);
              next();
            } else {
              store.dispatch('clearToken');
              store.dispatch("clearSecVer");
              next({
                path: '/login',
                query: {redirect: to.fullPath}
              })
            }
          }
        },
        children: [
          {
            path: '/',
            redirect: 'main',
          },
          {
            path: '/invite',
            name: "invite",
            component: Invite,
          },
          {
            path: 'main',
            component: PersonalMain,
            children: [
              {
                path: '/',
                redirect: 'accountSettingHome',
              },
              {
                path: 'aSetHome',
                name: 'accountSettingHome',
                component: AccountSettingHome,
                meta: {
                  title: $i18n.t('pageTitle.accountSetting')
                }
              },
              {
                path: 'redPaper',
                name: 'redPaperHome',
                component: RedPaperHome,
                meta: {
                  title: $i18n.t('pageTitle.myRedPaper')
                }
              },
              {
                path: 'inviteBack',
                name: 'inviteBackCashHome',
                component: Invite,
                meta: {
                  title: $i18n.t('pageTitle.referralProgram')
                }
              }
            ]
          },
          {
            path: 'aSet',
            component: AccountSetting,
            children: [
              {
                path: 'resetPwd',
                name: 'resetPwd',
                component: ResetPwd,
                meta: {
                  title: $i18n.t('pageTitle.accountSetting')
                }
              },
              {
                path: 'resetTradePwd/:cr',
                name: 'resetTradePwd',
                component: ResetTradePwd,
                meta: {
                  title: $i18n.t('pageTitle.accountSetting')
                }
              },
              {
                path: 'setTradePwd',
                name: 'setTradePwd',
                component: SetTradePwd,
                meta: {
                  title: $i18n.t('pageTitle.accountSetting')
                }
              },
              {
                path: 'updateTradePwd',
                name: 'updateTradePwd',
                component: UpdateTradePwd,
                meta: {
                  title: $i18n.t('pageTitle.accountSetting')
                }
              },
              {
                path: 'apiManagement',
                name: 'apiManagement',
                component: ApiManagement,
                meta: {
                  title: $i18n.t('pageTitle.accountSetting')
                }
              },
              {
                path: 'authentication',
                name: 'authentication',
                component: Authentication,
                meta: {
                  title: $i18n.t('pageTitle.accountSetting')
                }
              },
              {
                path: 'emailNotification',
                name: 'emailNotification',
                component: EmailNotification,
                meta: {
                  title: $i18n.t('pageTitle.accountSetting')
                }
              },
              {
                path: 'startGlVr',
                name: 'startGoogleVerify',
                component: startGoogleVerify,
                meta: {
                  title: $i18n.t('pageTitle.accountSetting')
                }
              },
              {
                path: 'loginLog',
                name: 'loginLog',
                component: LoginLog,
                meta: {
                  title: $i18n.t('pageTitle.accountSetting')
                }
              },

            ]
          },
          {
            path: 'cMRecord',
            component: chargeMoneyRecord,
            name: 'chargeMoneyRecord',
            children: [
              {
                path: 'main',
                name: 'chargeMoneyMain',
                component: chargeMoneyMain,
                meta: {
                  title: $i18n.t('pageTitle.financialRecord')
                }
              },
              {
                path: 'drawMoney',
                name: 'drawMoney',
                component: drawMoney,
                meta: {
                  title: $i18n.t('pageTitle.financialRecord')
                }
              },
              {
                path: 'other',
                name: 'otherRecord',
                component: otherRecord,
                meta: {
                  title: $i18n.t('pageTitle.financialRecord')
                }
              },
            ]
          },
          {
            path: 'orderManage',
            component: orderManage,
            name: 'orderManage',
            children: [
              {
                path: 'current',
                name: 'currentRecord',
                component: currentRecord,
                meta: {
                  title: $i18n.t('pageTitle.order')
                }
              },
              {
                path: 'past',
                name: 'pastRecord',
                component: pastRecord,
                meta: {
                  title: $i18n.t('pageTitle.order')
                }
              },
              {
                path: 'details',
                name: 'detailsView',
                component: detailsView,
                meta: {
                  title: $i18n.t('pageTitle.order')
                }
              }
            ]
          },
          {
            path: 'assets',
            name: 'myAssets',
            component: myAssets,
            meta: {
              title: $i18n.t('pageTitle.myAsset')
            }
          },
          {
            path: 'depositAdr',
            name: 'depositAddress',
            component: depositAddress,
            meta: {
              isablecache: false,
              title: $i18n.t('pageTitle.withdrawAddress')
            },
          }
        ]
      },
      {
        "path":'/mining',
        component:mining,
        children:[
          {
            path:'/',
            redirect:{
              name:'tradeMining'
            }
          },
          {
            path:'my',
            name:'myMining',
            component:myMining,
            beforeEnter: (to, from, next) => {
              if (store.state.user.isLogin) {
                next();
              } else {
                let localToken = JSON.parse(VueCookies.get('token'));
                let SessionVerification = JSON.parse(VueCookies.get('isSecVerification'));
                if (localToken && SessionVerification) {
                  store.dispatch('setToken', localToken);
                  store.dispatch('setSecVerification', SessionVerification);
                  next();
                } else {
                  store.dispatch('clearToken');
                  store.dispatch("clearSecVer");
                  next({
                    path: '/login',
                    query: {redirect: to.fullPath}
                  })
                }
              }
            },
          },
          {
            path:'trade',
            name:'tradeMining',
            component:tradeMining
          }
        ]

      }

    ]
  },
  // {
  //   path: '/helloWorld',
  //   name: 'HelloWorld',
  //   component: HelloWorld
  // },
  {
    path: '*',
    //404
    redirect: '/home'
  }
];
const router = new Router({
  mode: 'history',
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0}
  },
})
router.beforeEach((to, from, next) => {
  util.updateExpireRateStore();
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next();
})
export default router
