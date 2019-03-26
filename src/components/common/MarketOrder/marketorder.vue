<template>
  <div class="market-box">
    <el-dialog
      :title="$t('marketOrder.WarmPrompt')"
      :visible.sync="dialogVisible"
      center
      :modal-append-to-body="false"
      class="sec-dialog"
      append-to-body
      :closeOnClickModal="false"
      width="400px"
      style="margin-top: 0">
      <div style="width: 100%;text-align:center;margin-top: 10px"><i class="iconfont icon-az-icon-warning"
                                                                     style="font-size: 40px;color: #C9933E"></i></div>
      <div style="margin-top: 30px;text-align: center">{{$t('marketOrder.isRight')}}{{DropDownText}}？</div>
      <span slot="footer" class="dialog-footer" style="width: 270px">
          <el-button @click="dialogVisible = false" style="width:120px;">{{$t('message.Cancel')}}</el-button>
          <el-button type="primary" @click="BatchCancellation" style="width:120px;margin-left: 20px">{{$t('message.Ensure')}}</el-button>
        </span>
    </el-dialog>
    <div class="recent-deal">
      <div class="deal-header">
        <p>{{$t('marketOrder.RecentDeal')}}</p>
      </div>
      <el-table
        :data="RecentDealTable"
        height="388px"
        style="width: 100%" class="deal-table">
        <el-table-column
          align="left"
          :label="`${$t('marketOrder.Price')}(`+`${TransactionCurrency})`">
          <template slot-scope="scope">
            <span v-if="scope.row.Trend == 2" class="err_text">{{numbersplice(scope.row.Price,accuracy)|scientific}}</span>
            <span v-if="scope.row.Trend == 1" class="success_text">{{numbersplice(scope.row.Price,accuracy)|scientific}}</span>
            <span v-if="scope.row.Trend == 3" :class="{ success_text: isUps(scope.row), err_text: !isUps(scope.row) }">{{numbersplice(scope.row.Price,accuracy)|scientific}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          :label="`${$t('marketOrder.Amount')}(`+`${DealCurrency})`"
          style="width: 31.25%;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
          <template slot-scope="scope">
            <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB">{{numbersplice(scope.row.Volume,VolumeAccuracy)|scientific}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('loginLog.time')"
          align="right"
          width="70px">
          <template slot-scope="scope">
            <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB">{{creatHour(scope.row.CreateTime)}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="entrust">
      <el-tabs v-model="activeName" type="card" @tab-click="addCss">
        <el-tab-pane :label="$t('marketOrder.NowCommissioned')" name="1">
          <el-table
            :data="NowEntrustList"
            @filter-change="NowEntrustDeal"
            height="388px"
            style="width: 100%" class="deal-table">
            <el-table-column
              :label="$t('loginLog.time')"
              align="left"
              style="width:12%;font-size:12px;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope">
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;">
                  <p>{{creatDay(scope.row.createTime)}}</p>
                  <p>{{creatHour(scope.row.createTime)}}</p>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :label="$t('marketOrder.market')"
              style="width:10%;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope">
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;">{{scope.row.market.toUpperCase().replace('_','/')}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              filter-placement="bottom"
              :label="dealText"
              prop="dealType"
              header-cell-class-name="filter-ul"
              :filters="FiltersDeal"
              :filter-multiple="false"
              :filtered-value="[0]">
              <template slot-scope="scope">
                <span style="color:#0ABF74;font-size:12px;font-family:OpenSans;" v-if="scope.row.orderType == 1 || scope.row.orderType == 2">{{$t('marketOrder.buyed')}}</span>
                <span style="color:#E66439;font-size:12px;font-family:OpenSans;" v-if="scope.row.orderType == 3 || scope.row.orderType == 4">{{$t('marketOrder.saled')}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              filter-placement="bottom"
              header-cell-class-name="filter-ul"
              :label="typeText"
              :filters="FiltersType"
              :filter-multiple="false"
              prop="orderType"
              :filtered-value="[3]"
              style="width: 18.4%;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope">
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;"
                      v-if="scope.row.orderType == 1 && scope.row.category == 1">{{$t('marketOrder.LimitedPrice')}}</span>
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;"
                      v-if="scope.row.orderType == 3 && scope.row.category == 1">{{$t('marketOrder.LimitedPrice')}}</span>
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;"
                      v-if="scope.row.orderType == 2 && scope.row.category == 1">{{$t('marketOrder.MarketPrice')}}</span>
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;"
                      v-if="scope.row.orderType == 4 && scope.row.category == 1">{{$t('marketOrder.MarketPrice')}}</span>
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;" v-if="scope.row.planType == 2 && scope.row.category == 2"><p>{{$t('marketOrder.StopLossProfit')}}</p><p>≤{{scope.row.triggerPrice|scientific}} {{$t('marketOrder.trigger')}}</p></span>
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;" v-if="scope.row.planType == 1 && scope.row.category == 2"><p>{{$t('marketOrder.StopLossProfit')}}</p><p>≥{{scope.row.triggerPrice|scientific}} {{$t('marketOrder.trigger')}}</p></span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :label="$t('marketOrder.WTWTJG')"
              style="width: 11.4%;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope">
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;">{{scope.row.price|scientific}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :label="$t('marketOrder.WTWTSL')"
              style="width: 12.5%;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope">
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;">{{scope.row.volume|scientific}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :label="$t('marketOrder.TradingVolume')"
              style="width: 12.5%;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope">
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;">{{scope.row.tradeAmount|scientific}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :label="$t('marketOrder.TurnoverRatio')"
              style="width: 6.8%;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope">
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;" v-if="scope.row.status == 1">{{$t('marketOrder.NotTrigger')}}</span>
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;" v-if="scope.row.triggered">{{$t('marketOrder.triggered')}}</span>
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;" v-if="scope.row.status == 2 && !scope.row.triggered && !(scope.row.category == 1 && scope.row.orderType == 2)">{{numbersplice(FloatNum(scope.row.tradedVolume, scope.row.volume) * 100,2)|scientific}}%</span>
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;" v-if="scope.row.status == 3 && !scope.row.triggered">100.00%</span>
                <!--<span style="font-size:12px;font-family:OpenSans;color:#E6E8ED;" v-if="(scope.row.orderType == 4 || scope.row.orderType == 2) && scope.row.category == 1">0.00%</span>-->
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;" v-if="scope.row.status == 2 && !scope.row.triggered && scope.row.category == 1 && scope.row.orderType == 2">{{numbersplice(FloatNum(scope.row.tradeAmount, scope.row.amount) * 100,2)|scientific}}%</span>
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              :label="$t('marketOrder.operation')"
              style="width: 8%;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope">
                <span style="cursor: pointer;color:#C9933E;font-size:12px;font-family:OpenSans; " @click="repeal(scope.row)">{{$t('marketOrder.repeal')}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="NowEntrustList.length > 0">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class="NowPagenation"
                           small
                           :total="pagenation.total"
                           :current-page.sync="pagenation.currPage" :page-size="pagenation.pageSize"
                           layout="prev, pager, next">
            </el-pagination>
          </div>
          <div v-if="NowEntrustList.length == 0">
            <img src="../../../../static/images/empty.svg" alt="" style="position: absolute;top: 155px;left: 50%;transform: translateX(-50%);width: 60px">
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('marketOrder.CommissionedHistory')" name="2">
          <el-table
            :data="HistoryEntrustList"
            @filter-change="HistoryEntrustDeal"
            height="388px"
            style="width: 100%" class="deal-table">
            <el-table-column
              :label="$t('marketOrder.time')"
              align="left"
              style="width:13.5%;font-size:12px;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope">
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;">
                  <p>{{creatDay(scope.row.createTime)}}</p>
                  <p>{{creatHour(scope.row.createTime)}}</p>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :label="$t('marketOrder.market')"
              style="width:10%;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope">
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;">{{scope.row.market.toUpperCase().replace('_','/')}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :label="HisDealText"
              :filters="HisFiltersDeal"
              header-cell-class-name="filter-ul"
              :filter-multiple="false"
              :filtered-value="[0]"
              prop="HistoryDeal"
              filter-placement="bottom"
              style="width: 7.3%;font-family:PingFang-SC-Regular;color:#E6E8ED;border: 0">
              <template slot-scope="scope">
                <span style="color:#0ABF74;font-size:12px;font-family:OpenSans;" v-if="scope.row.orderType == 1 || scope.row.orderType == 2">{{$t('marketOrder.buyed')}}</span>
                <span style="color:#E66439;font-size:12px;font-family:OpenSans;" v-if="scope.row.orderType == 3 || scope.row.orderType == 4">{{$t('marketOrder.saled')}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :label="HisTypeText"
              :filters="HisFiltersType"
              header-cell-class-name="filter-ul"
              prop="HistoryType"
              :filter-multiple="false"
              :filtered-value="[3]"
              filter-placement="bottom"
              style="width: 20%;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope">
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;"
                      v-if="scope.row.orderType == 1 && scope.row.category == 1">{{$t('marketOrder.LimitedPrice')}}</span>
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;"
                      v-if="scope.row.orderType == 3 && scope.row.category == 1">{{$t('marketOrder.LimitedPrice')}}</span>
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;"
                      v-if="scope.row.orderType == 2 && scope.row.category == 1">{{$t('marketOrder.MarketPrice')}}</span>
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;"
                      v-if="scope.row.orderType == 4 && scope.row.category == 1">{{$t('marketOrder.MarketPrice')}}</span>
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;" v-if="scope.row.planType == 2 && scope.row.category == 2"><p>{{$t('marketOrder.StopLossProfit')}}</p><p>≤{{scope.row.triggerPrice|scientific}} {{$t('marketOrder.trigger')}}</p></span>
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;" v-if="scope.row.planType == 1 && scope.row.category == 2"><p>{{$t('marketOrder.StopLossProfit')}}</p><p>≥{{scope.row.triggerPrice|scientific}} {{$t('marketOrder.trigger')}}</p></span>
                <!--<span style="font-size:12px;font-family:OpenSans;color:#E6E8ED;" v-if="scope.row.orderType == 3 && scope.row.planType == 2 && scope.row.category == 2"><p>{{$t('marketOrder.StopLoss')}}</p><p>{{scope.row.triggerPrice|scientific}} {{$t('marketOrder.trigger')}}</p></span>-->
                <!--<span style="font-size:12px;font-family:OpenSans;color:#E6E8ED;" v-if="scope.row.orderType == 3 && scope.row.planType == 1 && scope.row.category == 2"><p>{{$t('marketOrder.StopProfit')}}</p><p>{{scope.row.triggerPrice|scientific}} {{$t('marketOrder.trigger')}}</p></span>-->
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :label="$t('marketOrder.DealPrice')"
              style="width: 11.4%;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope">
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;" v-if="scope.row.tradedVolume != 0">{{numbersplice(FloatNum(scope.row.tradeAmount, scope.row.tradedVolume),accuracy)|scientific}}</span>
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;" v-if="scope.row.tradedVolume == 0">--</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :label="$t('marketOrder.Turnover')"
              style="width: 12.5%;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope">
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;">{{scope.row.tradedVolume|noDataShow('--',true)|scientific}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :label="$t('marketOrder.TradingVolume')"
              style="width: 12.5%;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope">
                <span style="font-size:12px;font-family:OpenSans;color:#C8CEDB;">{{scope.row.tradeAmount|noDataShow('--',true)|scientific}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :label="$t('marketOrder.status')"
              style="width: 6.8%;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 3"
                      style="font-size:12px;font-family:OpenSans;color:#C8CEDB;">{{$t('marketOrder.FFL')}}</span>
                <span v-if="scope.row.status == 4 && scope.row.tradedVolume != 0"
                      style="font-size:12px;font-family:OpenSans;color:#C8CEDB;">{{$t('marketOrder.PFL')}}</span>
                <span v-if="scope.row.status == 4 && scope.row.tradedVolume == 0" style="font-size:12px;font-family:OpenSans;color:#E6E8ED;">{{$t('marketOrder.Unsettled')}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              :label="$t('marketOrder.operation')"
              style="width: 8%;font-family:PingFang-SC-Regular;color:rgba(136,136,136,1);border: 0">
              <template slot-scope="scope" style="font-size:12px;font-family:OpenSans;color:rgba(255,255,255,.6);">
                <span @click="LookDetails(scope.row)" style="cursor: pointer;color:#C9933E;font-size:12px;font-family:OpenSans;">{{$t('marketOrder.ViewDetails')}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="HistoryEntrustList.length > 0">
            <el-pagination @size-change="HisSizeChange" @current-change="HisCurrentChange"
                           small
                           :total="Hispagenation.total"
                           class="NowPagenation"
                           :current-page.sync="Hispagenation.currPage" :page-size="Hispagenation.pageSize"
                           layout="prev, pager, next">
            </el-pagination>
          </div>
          <div v-if="HistoryEntrustList.length == 0">
            <img src="../../../../static/images/empty.svg" alt="" style="position: absolute;top: 155px;left: 50%;transform: translateX(-50%);width: 60px">
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('marketOrder.MSCurrency')" name="3">
          <div class="currency-material">
            <div class="material-box">
              <div class="material-left">
                <div class="currency-logo">
                  <!--<div class="icon-bg" :class="ACurrency">-->
                    <!--<i :class="`icon-${ACurrency}`" style="font-size: 32px;color: #fff;"></i>-->
                  <!--</div>-->
                  <img class="icon-bg" :src="`/image/currency/web_${ACurrency}.png`|hostImgPath" alt="">
                  <div class="sb">
                    <span style="font-size:18px;font-family:PingFang-SC-Bold;color:#E6E8ED;">{{DealCurrency}}</span>
                  </div>
                </div>
                <h6 style="font-size:14px;font-family:OpenSans;color:rgba(104,110,122,1);margin-top: 30px">{{DealCurrency}} {{$t('marketOrder.synopsis')}}</h6>
                <div class="meterial-content">
                  <div v-html="intro"></div>
                </div>
              </div>
              <div class="material-right">
                <ul>
                  <li><p>{{$t('marketOrder.IssueTime')}}</p> <span>{{createYear(releaseTime)}}</span></li>
                  <li><p>{{$t('marketOrder.gross')}}</p> <span>{{total}}</span></li>
                  <li><p>{{$t('marketOrder.liutong')}}</p> <span>{{turnover}}</span></li>
                  <li><p>{{$t('marketOrder.costPrice')}}</p> <span>{{costAsUsd}}</span></li>
                  <li><p>{{$t('marketOrder.officialWebsite')}}</p> <a :href="official">{{official}}</a></li>
                  <li><p>{{$t('marketOrder.whiteBook')}}</p> <a :href="whitePaper">{{whitePaper}}</a></li>
                  <li><p>{{$t('marketOrder.BlockChainAddress')}}</p> <a :href="explorerUrl">{{explorerUrl}}</a></li>
                </ul>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <div class="in-right">
          <div class="check-div" v-if="NowShow" style="margin-right: 15px">
            <el-checkbox @change="OnlyOneMarket" v-model="OnlyMarket" style="margin-right: 10px"></el-checkbox>
            {{$t('marketOrder.currentMarket')}}
            <el-dropdown placement="bottom" @command="DropClick" @visible-change="DropDownShow">
              <span class="el-dropdown-link"
                         style="padding: 5px 9px;;margin-left: 20px;font-size: 12px;color: #929AA8;border-radius: 2px;border: 0;cursor: pointer">
                {{$t('marketOrder.SelectType')}}<i class="iconfont icon-az-icon-caret-bottom" id="dropdown-icon" style="margin-left: 3px;font-size: 12px"></i>
              </span>
              <el-dropdown-menu slot="dropdown" class="my-drop">
                <el-dropdown-item command="1" :class="{li_click : nowMarketPu}">{{$t('marketOrder.RevokeCurrentMarketPriceList')}}</el-dropdown-item>
                <el-dropdown-item command="2" :class="{li_click : allMarketPu}">{{$t('marketOrder.RevokeAllMarketPriceList')}}</el-dropdown-item>
                <el-dropdown-item command="3" :class="{li_click : nowMarketPlan}">{{$t('marketOrder.CancelTheCurrentMarketPlan')}}</el-dropdown-item>
                <el-dropdown-item command="4" :class="{li_click : allMarketPlan}">{{$t('marketOrder.CancelAllMarketingPlans')}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="his-div" v-if="HisShow">
            <el-checkbox v-model="IsHidRepeal" @change="HidRepeal"></el-checkbox>
            {{$t('marketOrder.HideRepealOrder')}}
            <button style="margin-left: 20px" :class="{active: TodayIsClick}" @click="Clickday(1)">{{$t('marketOrder.Today')}}</button>
            <button :class="{active:WeekIsClick}" @click="Clickday(2)">{{$t('marketOrder.ThisWeek')}}</button>
            <button :class="{active:MonthIsClick}" @click="Clickday(3)">{{$t('marketOrder.ThisMonth')}}</button>
            <button style="margin-right: 15px" :class="{active:ThreeMonthIsClick}" @click="Clickday(4)">{{$t('marketOrder.NearlyThreeMonths')}}</button>
          </div>
          <!--<el-select>全部撤销</el-select>-->
        </div>
      </el-tabs>
    </div>

  </div>
</template>

<script>
  // 引用时，需传入市场id
  import api from '../../../libs/api'
  import ws from '../../../libs/websoket/wsConfig'
  import {Decimal} from 'decimal.js';
  export default {
    data() {
      return {
        marketId:"",
        RecentDealTable: [],//最近成交列表数组
        activeName: "1",
        dealText: this.$t('marketOrder.BuyOrSale'),
        typeText: this.$t('marketOrder.AllType'),
        HisDealText: this.$t('marketOrder.BuyOrSale'),
        HisTypeText: this.$t('marketOrder.AllType'),
        DropDownText: this.$t('marketOrder.SelectType'),
        TodayIsClick: true,
        WeekIsClick: false,
        MonthIsClick: false,
        ThreeMonthIsClick: false,
        repealType: '1',
        DealCurrency: "",//当前交易币种
        TransactionCurrency: "",//当前交易币种
        orderStatuses: [1, 2],//订单状态 [ 0, 1, 2, 3, 4 ] 判别订单状态，当前委托只会用到 1 未触发, 2 已触发 *
        orderCategory: 0,//订单分类 [ 0, 1, 2 ] 判别普通单/计划单
        orderTypes: [0],// 买卖类型，1[限价买单] | 2[市价买单] | 3[限价卖单] | 4[市价卖单] *
        // planOrderType: 0,//计划单类别 订单类别为计划单时有效，其余情况传递None. 1高价触发， 2低价触发
        pagenation: {
          total: null,//总条目数
          currPage: 1,//当前页
          pageSize: 8,//一页显示个数
        },
        NowShow: true,
        HisShow: false,
        FiltersDeal: [{text: this.$t('marketOrder.BuyOrSale'), value: 0}, {text: this.$t('marketOrder.buy'), value: 1}, {text: this.$t('marketOrder.sale'), value: 2}],
        FiltersType: [{text: this.$t('marketOrder.AllType'), value: 3}, {text: this.$t('marketOrder.MarketOrder'), value: 4}, {text: this.$t('marketOrder.LimitOrder'), value: 5}, {text: this.$t('marketOrder.PlanOrder'), value: 6}],
        HisFiltersDeal: [{text: this.$t('marketOrder.BuyOrSale'), value: 0}, {text: this.$t('marketOrder.buy'), value: 1}, {text: this.$t('marketOrder.sale'), value: 2}],
        HisFiltersType: [{text: this.$t('marketOrder.AllType'), value: 3}, {text: this.$t('marketOrder.MarketOrder'), value: 4}, {text: this.$t('marketOrder.LimitOrder'), value: 5}, {
          text: this.$t('marketOrder.PlanOrder'),
          value: 6
        }],
        NowEntrustList: [],  // 当前委托
        NowEntrustDealN: 0,//当前委托买卖类型
        NowEntrustTypeN: 0,//当前委托订单类型
        HistoryEntrustList: [],  // 历史委托
        HisEntrustDealN: 0,// 历史委托买卖类型
        HisEntrustTypeN: 0,// 历史委托订单类型
        //历史委托的参数
        HisOrderStatus: [3, 4],
        HisOrderCategory: 0,
        HisOrderTypes: [0],
        Hispagenation: {
          total: null,//总条目数
          currPage: 1,//当前页
          pageSize: 8,//一页显示个数
        },
        beginTime: new Date().setHours(0, 0, 0, 0) / 1000,
        endTime: new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1) / 1000,
        OnlyMarket: false,
        IsHidRepeal: false,
        nowMarketPu: false,
        allMarketPu: false,
        nowMarketPlan: false,
        allMarketPlan: false,
        dialogVisible: false,
        accuracy:"",
        VolumeAccuracy:"",
        ACurrency:"",
        intro:'',
        releaseTime:'',
        total:'',
        turnover:'',
        costAsUsd:'',
        official:'',
        whitePaper:'',
        explorerUrl:''
      }
    },
    props: {
      getId: {
        type:String,
        required:true
      },// 市场id
      wsc:{
        type:Object
      }
    },
    created() {
      setTimeout(()=>{
        this.getList();
      },300)

    },
    mounted() {
      let that = this;
      let NewMarket = this.getId.split('_');
      this.getetFeeRate(this.getId);
      this.ACurrency = NewMarket[0];
      this.DealCurrency = NewMarket[0].toUpperCase();
      this.TransactionCurrency = NewMarket[1].toUpperCase();

      // that.RecentDealTable = that.RecentDealTable.sort(that.compare('CreateTime'));
      setTimeout(() => {
        this.wsc.send("SetReceiveTradeOrder", {Market: this.getId,Count:40,Subscribe:true }, function () { console.log("ok"); });
        this.wsc.send('Login',{Market:this.getId});
      }, 1000);

    },
    watch: {
      // activeIndex(newval,oldval){
      //   if(newval==0){
      //     //获取今日时间段
      //     //今日凌晨
      //     this.beginTime=new Date().setHours(0,0,0,0)
      //     this.endTime=new Date().getTime()
      //     this.getHisList()
      //     console.log(this.beginTime,this.endTime)
      //   }else if(newval==1){
      //     //获取本周时间段
      //     //1.获取当前是周几[0-6]
      //     var nowweekDay= new Date().getDay()
      //     var myDate=new Date()
      //     myDate.setDate(myDate.getDate()+1-nowweekDay);
      //     this.beginTime= myDate.setHours(0,0,0,0);
      //     this.endTime=new Date().getTime()
      //     this.getHisList()
      //     console.log(this.beginTime,this.endTime)
      //   }else if(newval==2){
      //     //获取本月时间段
      //     var nowMonth=new Date().getMonth()
      //     var setMounth=new Date()
      //     var NowDate=new Date().getDate()
      //     setMounth.setMonth(nowMonth);
      //     setMounth.setDate(1);
      //     setMounth.setHours(0,0,0,0);
      //     this.beginTime=setMounth.getTime()
      //     this.endTime=new Date().getTime()
      //     this.getHisList()
      //     console.log(this.beginTime,this.endTime)
      //   }else if(newval==3){
      //     //获取近3个月时间段
      //     var nowMonths=new Date().getMonth()
      //     var setTree=new Date();
      //     setTree.setMonth(nowMonths-3);
      //     setTree.setDate(1);
      //     setTree.setHours(0,0,0,0);
      //     this.beginTime=setTree.getTime()
      //     this.endTime=new Date().getTime()
      //     this.getHisList()
      //   }else {
      //     this.endTime=this.beginTime=0
      //     this.getHisList()
      //   }
      // }
    },
    methods: {
      // returnIntro(data){
      //   let arr = data.split('/');
      //   var endText = '';
      //   for (let i = 0; i < arr.length;i++) {
      //     let xp = document.createElement('P');
      //     xp.appendChild(document.createTextNode(arr[i]));
      //     endText += xp;
      //   }
      //   return endText;
      // },
      isUps(index){
        for(let i = this.RecentDealTable.indexOf(index);i < this.RecentDealTable.length;i++){
          if(this.RecentDealTable[i].Trend == 1){
            return true;
          }else if(this.RecentDealTable[i].Trend == 2){
            return false;
          }
        }
      },
      // 获取列表
      getList() {
        if(this.$store.state.user.isSecVerification) {
          let OrderNowList = {
            marketId: this.marketId,
            orderStatuses: this.orderStatuses,
            orderCategory: this.orderCategory,
            orderTypes: this.orderTypes,
            pageIndex: this.pagenation.currPage,
            pageSize: this.pagenation.pageSize
          }
          api.post('/Order/GetUserOrderPageList', OrderNowList)
            .then((res) => {
              this.pagenation.total = res.data.value.totalItems;
              this.NowEntrustList = res.data.value.items;
            })
            .catch((err) => {
              console.log(err);
            })
        }
      },
      getHisList() {
        if(this.$store.state.user.isSecVerification) {
          let OrderNowList = {
            orderStatuses: this.HisOrderStatus,
            orderCategory: this.HisOrderCategory,
            orderTypes: this.HisOrderTypes,
            beginTime: this.beginTime,
            endTime: this.endTime,
            // planOrderType:this.planOrderType,
            pageIndex: this.Hispagenation.currPage,
            pageSize: this.Hispagenation.pageSize
          }
          api.post('/Order/GetUserOrderPageList', OrderNowList)
            .then((res) => {
              this.Hispagenation.total = res.data.value.totalItems;
              this.HistoryEntrustList = res.data.value.items;
            })
        }
        // console.log('daniel',this.HistoryEntrustList,res.data.value.items);
      },
      compare(keyName){ //arr.sort(compare('age'))
        // var objectArraySort = function (keyName) {
          return function (objectN, objectM) {
            var valueN = objectN[keyName];
            var valueM = objectM[keyName];
            if (valueN < valueM) return 1; //从大到小排序
            else if (valueN > valueM) return -1;
            else return 0
          }
      },
      //最近成交列表
      Recentdeal(data){
        if(this.RecentDealTable.length == 0){
          this.RecentDealTable = data.List;
        }else{
          // for(let i = 0;i < data.List.length;i++){
          //   this.RecentDealTable.unshift(data.List[i]);
          // }
          this.RecentDealTable = data.List.concat(this.RecentDealTable);
          this.RecentDealTable.splice(99,this.RecentDealTable.length - 99);
        }
      },
      addCss(tab, event) {
        // console.log(tab, event);
        console.log(this.activeName);
        if (this.activeName == 1) {
          this.getList();
          this.HisShow = false;
          setTimeout(()=>{
            this.NowShow = true;
          },20)
        } else if (this.activeName == 2) {
          this.pdTime();
          this.NowShow = false;
          this.getHisList();
          setTimeout(()=>{
            this.HisShow = true;
          },20)
        } else {
          this.HisShow = false;
          this.NowShow = false;
          if(this.intro == '') {
            api.post('/CurrencyIntro/GetCurrencyIntro', {currency: this.ACurrency})
              .then((res) => {
                this.intro = res.data.value.intro;
                this.releaseTime = res.data.value.releaseTime;
                this.total = res.data.value.total;
                this.turnover = res.data.value.turnover;
                this.costAsUsd = res.data.value.cost;
                this.official = res.data.value.official;
                this.whitePaper = res.data.value.whitePaper;
                this.explorerUrl = res.data.value.explorerUrl;
              })
              .catch((err) => {

              })
          }
        }
      },
      FloatNum(a, b){
        let x = new Decimal(a);
        return x.dividedBy(b).toString();
      },
      getetFeeRate(currency){//获取手续费,和小数精度，下单最小金额
        let par={
          "id": currency,
        }
        api.post("/Market/GetMarket",par)
          .then((res)=>{
          this.accuracy= res.data.value.pricePrecision;//价格精度，多少位小数
          this.VolumeAccuracy =  res.data.value.depthVolumePrecision;//数量精度
          console.log('这是精度',this.accuracy);
        })
          .catch((error) => {

          });
      },
      numbersplice(value,pointNumber) {//截取相对精度的小数 value传的值，pointNumber精确到多少位小数（有些情况下会出现四舍五入现象）
        let p = new Decimal(value);
        return p.toFixed(pointNumber).toString();
      },
      NowEntrustDeal(obj) {
        console.log(obj);
        for(var k in obj) {
          if (obj[k][0] == 0) {
            this.dealText = this.$t('marketOrder.BuyOrSale');
            this.NowEntrustDealN = 0;
            this.ChangeType();
          }
          if (obj[k][0] == 1) {
            this.dealText = this.$t('marketOrder.buy');
            this.NowEntrustDealN = 1;
            this.ChangeType();
          }
          if (obj[k][0] == 2) {
            this.dealText = this.$t('marketOrder.sale');
            this.NowEntrustDealN = 2;
            this.ChangeType();
          }
          if (obj[k][0] == 3) {
            this.typeText = this.$t('marketOrder.AllType');
            this.NowEntrustTypeN = 0;
            this.ChangeType();
          }
          if (obj[k][0] == 4) {
            this.typeText = this.$t('marketOrder.MarketOrder');
            this.NowEntrustTypeN = 1;
            this.ChangeType();
          }
          if (obj[k][0] == 5) {
            this.typeText = this.$t('marketOrder.LimitOrder');
            this.NowEntrustTypeN = 2;
            this.ChangeType();
          }
          if (obj[k][0] == 6) {
            this.typeText = this.$t('marketOrder.PlanOrder');
            this.NowEntrustTypeN = 3;
            this.ChangeType();
          }
        }
      },
      ChangeHisType() {
        if (this.HisEntrustDealN == 0) {
          if (this.HisEntrustTypeN == 0) {
            this.HisOrderCategory = 0;
            this.HisOrderTypes = [0];// 买卖类型，1[限价买单] | 2[市价买单] | 3[限价卖单] | 4[市价卖单] *
          }
          if (this.HisEntrustTypeN == 1) {
            this.HisOrderCategory = 1;
            this.HisOrderTypes = [2, 4];
          }
          if (this.HisEntrustTypeN == 2) {
            this.HisOrderCategory = 1;
            this.HisOrderTypes = [1, 3];
          }
          if (this.HisEntrustTypeN == 3) {
            this.HisOrderCategory = 2;
            this.HisOrderTypes = [1, 3];
          }
        }
        if (this.HisEntrustDealN == 1) {
          if (this.HisEntrustTypeN == 1) {
            this.HisOrderCategory = 1;
            this.HisOrderTypes = [2];
          }
          if (this.HisEntrustTypeN == 2) {
            this.HisOrderCategory = 1;
            this.HisOrderTypes = [1];
          }
          if (this.HisEntrustTypeN == 3) {
            this.HisOrderCategory = 2;
            this.HisOrderTypes = [1];
          }
        }
        if (this.HisEntrustDealN == 2) {
          if (this.HisEntrustTypeN == 1) {
            this.HisOrderCategory = 1;
            this.HisOrderTypes = [4];
          }
          if (this.HisEntrustTypeN == 2) {
            this.HisOrderCategory = 1;
            this.HisOrderTypes = [3];
          }
          if (this.HisEntrustTypeN == 3) {
            this.HisOrderCategory = 2;
            this.HisOrderTypes = [3];
          }
        }
        if (this.HisEntrustTypeN == 0) {
          if (this.NowEntrustDealN == 1) {
            this.HisOrderCategory = 0;
            this.HisOrderTypes = [1, 2];
          }
          if (this.HisEntrustDealN == 2) {
            this.HisOrderCategory = 1;
            this.HisOrderTypes = [4, 3];
          }
        }
        this.Hispagenation.currPage = 1;
        this.getHisList()
      },
      HistoryEntrustDeal(obj) {
        console.log(obj);
        for(var k in obj) {
          if (obj[k][0] == 0) {
            this.HisDealText = this.$t('marketOrder.BuyOrSale');
            this.HisEntrustDealN = 0;
            this.ChangeHisType();
          }
          if (obj[k][0] == 1) {
            this.HisDealText = this.$t('marketOrder.buy');
            this.HisEntrustDealN = 1;
            this.ChangeHisType();
          }
          if (obj[k][0] == 2) {
            this.HisDealText = this.$t('marketOrder.sale');
            this.HisEntrustDealN = 2;
            this.ChangeHisType();
          }
          if (obj[k][0] == 3) {
            this.HisTypeText = this.$t('marketOrder.AllType');
            this.HisEntrustTypeN = 0;
            this.ChangeHisType();
          }
          if (obj[k][0] == 4) {
            this.HisTypeText = this.$t('marketOrder.MarketOrder');
            this.HisEntrustTypeN = 1;
            this.ChangeHisType();
          }
          if (obj[k][0] == 5) {
            this.HisTypeText = this.$t('marketOrder.LimitOrder');
            this.HisEntrustTypeN = 2;
            this.ChangeHisType();
          }
          if (obj[k][0] == 6) {
            this.HisTypeText = this.$t('marketOrder.PlanOrder');
            this.HisEntrustTypeN = 3;
            this.ChangeHisType();
          }
        }
      },
      // websoket添加
      AddNowEnstrust(data){
        console.log('当前委托',data);
        let newObj = new Object();
        for (let i = 0;i<this.NowEntrustList.length;i++){
          if(data.Id == this.NowEntrustList[i].id){
            return;
          }
        }
        newObj.id = data.Id;
        newObj.market = data.Market;
        newObj.currency = data.Currency;
        newObj.category = data.Category;
        newObj.orderType = data.OrderType;
        newObj.tradeAmount = 0;
        newObj.tradedVolume = 0;
        newObj.planType = data.PlanType;
        newObj.triggerPrice = data.TriggerPrice;
        newObj.price = data.Price;
        newObj.volume = data.Volume;
        newObj.amount = data.Amount;
        newObj.status = data.Status;
        newObj.createTime = data.CreateTime;
        console.log(newObj.createTime);
        console.log(newObj);
        if (this.NowEntrustDealN == 0) {
          if (this.NowEntrustTypeN == 0) {
            this.NowEntrustList.unshift(newObj);
          }
          if (this.NowEntrustTypeN == 1 && newObj.orderCategory == 1) {
            if(newObj.orderType == 2 || newObj.orderType == 4){
              this.NowEntrustList.unshift(newObj);
            }
          }
          if (this.NowEntrustTypeN == 2 && newObj.orderCategory == 1) {
            if(newObj.orderType == 1 || newObj.orderType == 3){
              this.NowEntrustList.unshift(newObj);
            }
          }
          if (this.NowEntrustTypeN == 3 && newObj.orderCategory == 2) {
            this.NowEntrustList.unshift(newObj);
          }
        }
        if (this.NowEntrustDealN == 1) {
          if (this.NowEntrustTypeN == 1 && newObj.orderCategory == 1 && newObj.orderType == 2) {
            this.NowEntrustList.unshift(newObj);
          }
          if (this.NowEntrustTypeN == 2 && newObj.orderCategory == 1 && newObj.orderType == 1) {
            this.NowEntrustList.unshift(newObj);
          }
          if (this.NowEntrustTypeN == 3 && newObj.orderCategory == 2 && newObj.orderType == 1) {
            this.NowEntrustList.unshift(newObj);
          }
        }
        if (this.NowEntrustDealN == 2) {
          if (this.NowEntrustTypeN == 1 && newObj.orderCategory == 1 && newObj.orderType == 4) {
            this.NowEntrustList.unshift(newObj);
          }
          if (this.NowEntrustTypeN == 2 && newObj.orderCategory == 1 && newObj.orderType == 3) {
            this.NowEntrustList.unshift(newObj);
          }
          if (this.NowEntrustTypeN == 3 && newObj.orderCategory == 2 && newObj.orderType == 4) {
            this.NowEntrustList.unshift(newObj);
          }
        }
        if (this.NowEntrustTypeN == 0) {
          if (this.NowEntrustDealN == 1) {
            if(newObj.orderType == 1 || newObj.orderType ==2){
              this.NowEntrustList.unshift(newObj);
            }
          }
          if (this.NowEntrustDealN == 2) {
            if(newObj.orderType == 3 || newObj.orderType ==4){
              this.NowEntrustList.unshift(newObj);
            }
          }
        }
        if(this.NowEntrustList.length > 8){
          this.NowEntrustList.pop();
        }
      },
      // websoket判断计划单是否触发
      isTriggered(data){
        for(let i = 0;i < this.NowEntrustList.length;i++){
          if(data.OrderId == this.NowEntrustList[i].id){
            this.NowEntrustList[i].triggered = true;
          }
        }
      },
      // websoket修改状态
      UpdateNowEnstrust(data){
        console.log('订单有成交', data);
        for(let i = 0;i < this.NowEntrustList.length;i++){
          if(data.OrderId == this.NowEntrustList[i].id){
            this.NowEntrustList[i].tradedVolume = data.TxVolume;
            this.NowEntrustList[i].tradeAmount = data.TxAmount;
            this.NowEntrustList[i].triggered = false;
            this.NowEntrustList[i].status = data.Status;
            console.log(this.NowEntrustList[i]);
            if(data.Status == 3 || data.status == 4){
              setTimeout(()=>{
                this.getList();
              },300)
            }
          }
        }
      },
      // 改变当前委托的类型
      ChangeType() {
        if (this.NowEntrustDealN == 0) {
          if (this.NowEntrustTypeN == 0) {
            this.orderCategory = 0;
            this.orderTypes = [0];// 买卖类型，1[限价买单] | 2[市价买单] | 3[限价卖单] | 4[市价卖单] *
          }
          if (this.NowEntrustTypeN == 1) {
            this.orderCategory = 1;
            this.orderTypes = [2, 4];
          }
          if (this.NowEntrustTypeN == 2) {
            this.orderCategory = 1;
            this.orderTypes = [1, 3];
          }
          if (this.NowEntrustTypeN == 3) {
            this.orderCategory = 2;
            this.orderTypes = [1, 3];
          }
        }
        if (this.NowEntrustDealN == 1) {
          if (this.NowEntrustTypeN == 1) {
            this.orderCategory = 1;
            this.orderTypes = [2];
          }
          if (this.NowEntrustTypeN == 2) {
            this.orderCategory = 1;
            this.orderTypes = [1];
          }
          if (this.NowEntrustTypeN == 3) {
            this.orderCategory = 2;
            this.orderTypes = [1];
          }
        }
        if (this.NowEntrustDealN == 2) {
          if (this.NowEntrustTypeN == 1) {
            this.orderCategory = 1;
            this.orderTypes = [4];
          }
          if (this.NowEntrustTypeN == 2) {
            this.orderCategory = 1;
            this.orderTypes = [3];
          }
          if (this.NowEntrustTypeN == 3) {
            this.orderCategory = 2;
            this.orderTypes = [3];
          }
        }
        if (this.NowEntrustTypeN == 0) {
          if (this.NowEntrustDealN == 1) {
            this.orderCategory = 0;
            this.orderTypes = [1, 2];
          }
          if (this.NowEntrustDealN == 2) {
            this.orderCategory = 1;
            this.orderTypes = [4, 3];
          }
        }
        this.pagenation.currPage = 1;
        this.getList();
      },
      // 撤销方法
      repeal(row) {
        console.log(row);
        let CancelForm = {
          "orderId": row.id,
          "orderCategory": row.category,
          "orderType": row.orderType,
          "marketId": row.market
        }
        if(this.NowEntrustList.length == 1){
          api.post('/Order/CancelOrder', CancelForm)
            .then((res) => {
              this.$message({showClose: true, message: this.$t('marketOrder.RepealSucc'), type: 'success'})
              setTimeout(()=>{
                this.pagenation.currPage = 1;
                this.getList();
              },300);
            })
            .catch((err) => {
              console.log(err);
            })
        }else{
          api.post('/Order/CancelOrder', CancelForm)
            .then((res) => {
              this.$message({showClose: true, message: this.$t('marketOrder.RepealSucc'), type: 'success'})
              setTimeout(()=>{
                this.getList();
              },300);
            })
            .catch((err) => {
              console.log(err);
            })
        }

      },
      createYear(day){
        if(this.releaseTime == ''){
          return;
        }
        let date = new Date(day * 1000);
        let Y = date.getFullYear() + '/';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
        let D = date.getDate() + '';
        let d = Y + M + D;
        return d;
      },
      // 转化日期
      creatDay(day) {
        console.log(day)
        let date = new Date(day * 1000);
        let d = ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "/" +
          (date.getDate() > 9 ? date.getDate() : ("0" + date.getDate()));
        return d;
      },
      creatHour(day) {
        let date = new Date(day * 1000);
        let d = (date.getHours() > 9 ? date.getHours() : ("0" + date.getHours())) + ":" +
          (date.getMinutes() > 9 ? date.getMinutes() : ("0" + date.getMinutes())) + ":" +
          (date.getSeconds() > 9 ? date.getSeconds() : ("0" + date.getSeconds()));
        return d;
      },
      // 分页
      handleSizeChange(val) { //操作分页
        this.pagenation.pageSize = val;//每页条数
        this.getList(); //重新请求一次
      },
      handleCurrentChange(val) {
        this.pagenation.currPage = val; //当前页码
        this.getList();
      },
      HisSizeChange(val) { //操作分页
        this.Hispagenation.pageSize = val;//每页条数
        this.getHisList(); //重新请求一次
      },
      HisCurrentChange(val) {
        this.Hispagenation.currPage = val; //当前页码
        this.getHisList();
      },
      LookDetails(row) {
        console.log(row);
        this.$router.push({
          name: 'detailsView',
          query: {marketId: row.market, orderId: row.id, orderType: row.orderType}
        });
      },
      pdTime(){
        if(this.TodayIsClick){
          this.Clickday(1);
        }else if(this.WeekIsClick){
          this.Clickday(2);
        }else if(this.MonthIsClick){
          this.Clickday(3);
        }else if(this.ThreeMonthIsClick){
          this.Clickday(4);
        }
      },
      Clickday(num) {
        if (num == 1) {
          this.TodayIsClick = true;
          this.WeekIsClick = false;
          this.MonthIsClick = false;
          this.ThreeMonthIsClick = false;
          //获取今日时间段
          //今日凌晨
          this.beginTime = new Date().setHours(0, 0, 0, 0) / 1000;
          this.endTime = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1) / 1000;
        } else if (num == 2) {
          this.TodayIsClick = false;
          this.WeekIsClick = true;
          this.MonthIsClick = false;
          this.ThreeMonthIsClick = false;
          // 获取本周时间段
          // 1.获取当前是周几[0-6]
          var nowweekDay = new Date().getDay()
          var myDate = new Date()
          myDate.setDate(myDate.getDate() + 1 - nowweekDay);
          this.beginTime = myDate.setHours(0, 0, 0, 0) / 1000;
          this.endTime = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1) / 1000;
        } else if (num == 3) {
          this.TodayIsClick = false;
          this.WeekIsClick = false;
          this.MonthIsClick = true;
          this.ThreeMonthIsClick = false;
          // 获取本月时间段
          var nowMonth = new Date().getMonth()
          var setMounth = new Date()
          var NowDate = new Date().getDate()
          setMounth.setMonth(nowMonth);
          setMounth.setDate(1);
          setMounth.setHours(0, 0, 0, 0);
          this.beginTime = setMounth.getTime() / 1000;
          this.endTime = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1) / 1000;
        } else if (num == 4) {
          this.TodayIsClick = false;
          this.WeekIsClick = false;
          this.MonthIsClick = false;
          this.ThreeMonthIsClick = true;
          // 获取近3个月时间段
          var nowMonths = new Date().getMonth();
          var setTree = new Date();
          setTree.setMonth(nowMonths - 3);
          setTree.setDate(1);
          setTree.setHours(0, 0, 0, 0);
          this.beginTime = setTree.getTime() / 1000;
          this.endTime = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1) / 1000;
        } else {
          this.endTime = this.beginTime = 0;
        }
        this.Hispagenation.currPage = 1;
        this.getHisList()
      },
      OnlyOneMarket() {
        console.log(this.OnlyMarket);
        if (this.OnlyMarket) {
          this.marketId = this.getId;
          this.pagenation.currPage = 1;
          this.getList()
        } else {
          this.marketId = "";
          this.pagenation.currPage = 1;
          this.getList()
        }
      },
      HidRepeal() {
        console.log(this.IsHidRepeal);
        if (this.IsHidRepeal) {
          this.HisOrderStatus = [3];
          this.Hispagenation.currPage = 1;
          this.getHisList();
        } else {
          this.HisOrderStatus = [3, 4];
          this.Hispagenation.currPage = 1;
          this.getHisList();
        }
      },
      DropClick(command) {
        console.log(command);
        if(this.$store.state.user.isLogin) {
          if (command == 1) {
            this.DropDownText = this.$t('marketOrder.RevokeCurrentMarketPriceList');
            this.nowMarketPu = true;
            this.allMarketPlan = false;
            this.allMarketPu = false;
            this.nowMarketPlan = false;
          }
          if (command == 2) {
            this.DropDownText = this.$t('marketOrder.RevokeAllMarketPriceList');
            this.nowMarketPu = false;
            this.allMarketPu = true;
            this.nowMarketPlan = false;
            this.allMarketPlan = false;
          }
          if (command == 3) {
            this.DropDownText = this.$t('marketOrder.CancelTheCurrentMarketPlan');
            this.nowMarketPu = false;
            this.allMarketPu = false;
            this.nowMarketPlan = true;
            this.allMarketPlan = false;
          }
          if (command == 4) {
            this.DropDownText = this.$t('marketOrder.CancelAllMarketingPlans');
            this.nowMarketPu = false;
            this.allMarketPu = false;
            this.nowMarketPlan = false;
            this.allMarketPlan = true;
          }
          this.dialogVisible = true;
        }else {
          this.$router.push({name:'login'});
        }
      },
      DropDownShow(a){
        console.log(a);
        if(a){
          console.log(document.getElementById('dropdown-icon'));
          document.getElementById('dropdown-icon').className = 'iconfont icon-az-icon-caret-top-copy';
          console.log(document.getElementById('dropdown-icon'));
        }else {
          document.getElementById('dropdown-icon').className = 'iconfont icon-az-icon-caret-bottom';
        }
      },
      BatchCancellation() {
          if (this.nowMarketPu) {
            let Form = {
              marketId: this.getId,
              orderCategory: 1
            };
            api.post("/Order/CancelAllOrders", Form)
              .then((res) => {
                this.$message({showClose: true, message: this.$t('marketOrder.RepealAllSucc'), type: 'success',});
                setTimeout(() => {
                  this.pagenation.currPage = 1;
                  this.getList();
                }, 300);
              })
              .catch((err) => {
                console.log(err);
              })
          }
          if (this.allMarketPu) {
            let Form = {
              marketId: '',
              orderCategory: 1,
            };
            api.post("/Order/CancelAllOrders", Form)
              .then((res) => {
                this.$message({showClose: true, message: this.$t('marketOrder.RepealAllSucc'), type: 'success',});
                setTimeout(() => {
                  this.pagenation.currPage = 1;
                  this.getList();
                }, 300);
              })
              .catch((err) => {
                console.log(err);
              })
          }
          if (this.nowMarketPlan) {
            let Form = {
              marketId: this.getId,
              orderCategory: 2
            };
            api.post("/Order/CancelAllOrders", Form)
              .then((res) => {
                this.$message({showClose: true, message: this.$t('marketOrder.RepealAllSucc'), type: 'success',});
                setTimeout(() => {
                  this.pagenation.currPage = 1;
                  this.getList();
                }, 300);
              })
              .catch((err) => {
                console.log(err);
              })
          }
          if (this.allMarketPlan) {
            let Form = {
              marketId: '',
              orderCategory: 2,
            };
            api.post("/Order/CancelAllOrders", Form)
              .then((res) => {
                this.$message({showClose: true, message: this.$t('marketOrder.RepealAllSucc'), type: 'success',});
                setTimeout(() => {
                  this.pagenation.currPage = 1;
                  this.getList();
                }, 300);
              })
              .catch((err) => {
                console.log(err);
              })
          }
          this.dialogVisible = false;
      },
    }
  }
</script>
<style>
.entrust .el-table th .cell.highlight{
  padding: 0
}
  .NowPagenation.el-pagination.el-pagination--small{
    position: relative;
    top: -30px;
    text-align: center;
    height:36px;
  }
  .NowPagenation button{
    background: #1D2026 !important;
  }
  .NowPagenation .el-pagination button[disabled] i{
    color: #555A66 !important;
  }
  .NowPagenation button i{
    color: #929AA8 !important;
  }
  .NowPagenation.el-pagination ul li{
    background: #1D2026;
    color: #686E7A;
    font-size: 12px;
    font-family:HelveticaNeue;
  }
  .NowPagenation.el-pagination ul li.number.active{
    background: #1D2026 !important;
    color:#C9933E !important;
    border: 0 !important;
  }
  .market-box .el-table__empty-text{
    color: #929AA8;
    font-family:PingFangSC-Medium;
  }
  .entrust .el-table__empty-text{
    top: 201px;
  }
  .market-box .el-dialog {
    width: 400px;
    margin-top: 0 !important;
  }

  .my-drop {
    width: 152px;
    background: #333740 !important;
    border: 0 !important;
    margin-top: 12px !important;
    padding: 6px 0;
  }

  .my-drop li {
    padding: 0;
    height: 28px;
    line-height: 28px;
    text-align: center;
    vertical-align: middle;
    font-size: 12px !important;
    font-family: PingFang-SC-Regular;
    color:#929AA8 !important;
  }
  .his-div .el-checkbox{
    margin-right: 10px;
  }
  .my-drop li:hover {
    background: #40444D !important;
    color: #C8CEDB !important;
  }

  .my-drop li.li_click {
    background: #40444D !important;
    color: #C8CEDB;
  }

  .market-box .has-gutter th{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #686E7A;
    border: 0 !important;
    height: 28px !important;
    padding: 0 !important;
    background:#1D2026;
    vertical-align: top;
  }

  .market-box .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #22262E !important;
  }

  .market-box .el-table::before{
    display: none;
  }
  .market-box .el-table th.is-leaf,
  .market-box .el-table td{
    border: none;
  }
  .market-box .el-table td {
    background-color: #1D2026 !important;
    height: 28px;
    border: none;
  }
  .market-box .el-table th{
    background-color: #1D2026;
    vertical-align: top !important;
  }
  .market-box .el-table th,
  .market-box .el-table td {
    border: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .el-table-filter {
    background: #333740 !important;
    border: 0 !important;
    transform: translateX(-25px) !important;
  }

  .el-table-filter__list-item {
    color: #929AA8 !important;
    text-align: center;
    font-size:12px !important;
    font-family:HelveticaNeue;
  }

  .el-table-filter__list-item:hover {
    background: #40444D !important;
    color: #C8CEDB !important;
  }

  .el-table-filter__list-item.is-active {
    background: #40444D !important;
    color: #C8CEDB !important;
  }

  .el-table-filter .el-table-filter__list .el-table-filter__list-item:first-child {
    display: none;
  }

  .market-box .el-table__column-filter-trigger i {
    color: #686E7A;
    font-size: 12px;
    margin-left: 5px;
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
  .sec-dialog .el-dialog.el-dialog--center{
    margin-top: 0 !important;
  }
  .market-box .el-table[data-v-af4014f2]::before {
    height: 0;
  }

  .market-box .el-tabs__nav-scroll .el-tabs__nav {
    border: 0 !important;

  }
  .market-box .el-tabs__nav-wrap:after {
    height: 0;
  }

  .market-box .el-tabs__nav-scroll {
    background: #1D2026;
  }

  .market-box .el-dialog__wrapper .el-input__inner {
    border: 0;
    background: rgba(46, 46, 46, 1) !important;
    height: 28px !important;
  }

  .market-box .el-tabs--card > .el-tabs__header .el-tabs__item {
    border: 0;
    color: #929AA8;
    font-size: 14px;
  }

  .market-box .el-tabs__content {
    overflow: visible;
  }

  .market-box .el-checkbox__inner::after {
    /*left: 4.6px;*/
    border-color: #000;
    border-width: 1.5px;
  }

  .market-box .el-checkbox__inner {
    border: 1px solid #4E4E4E;
    background-color: #22262E;
  }

  .market-box .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    color: #C9933E;
    border-bottom: 2px solid #C9933E;
  }
  .market-box .el-tabs__item{
    height: 32px;
    line-height: 32px;
  }

  .entrust .el-tabs--card > .el-tabs__header {
    margin: 0;
    border: 0;
    height: 32px;
  }
  .market-box .el-table th .cell {
    padding-right: 10px;
    padding-top: 0;
    padding-bottom: 0;
    line-height: 32px !important;
  }

  .entrust .el-table th > .cell ,
  .recent-deal .el-table th > .cell{
    color: #686E7A !important;
    font-size: 12px;
    vertical-align: top;
  }
  .entrust .cell p{
    line-height: 15px;
  }
  .check-div input.el-input__inner {
    background: rgba(62, 62, 62, 1) !important;
    border: 0px !important;
    border-radius: 2px !important;
    color: rgba(178, 178, 178, 1);
  }

  .check-div .el-input__suffix {
    color: #888888;
  }
  .deal-table .el-table__body-wrapper::-webkit-scrollbar{
    width: 5px;
    background: #1d1e26 !important;
  }
  .deal-table .el-table__body-wrapper::-webkit-scrollbar-thumb {
    width: 5px;
    background: #333540 !important;
  }
  .entrust .el-table tr{
    height: 32px;
  }
  .recent-deal tr.el-table__row{
    height: 28px;
  }
  .recent-deal .cell{
    line-height: 27px !important;
  }
  .entrust .el-table tr.el-table__row{
    height: 40px;
  }
  .el-dropdown{
    height: 24px;
  }
  .entrust .el-table .el-table__header .has-gutter tr th:nth-child(3),.entrust .el-table .el-table__header .has-gutter tr th:nth-child(4){
    cursor: pointer;
  }
  div[id^="el-popover"].el-popover.el-popper>.popper__arrow{
    display: none;
  }
</style>

<style scoped lang="scss" type="text/scss">
    .icon-bg{
      display: inline-block;
      width:40px;
      height:40px;
      line-height:40px;
      border-radius: 50%;
      overflow: hidden;
      text-align: center;
    }

.success_text{
  color: $--color-success;
  font-family:OpenSans;
  font-size:12px !important;
}
.err_text{
  color:$--color-danger;
  font-family:OpenSans;
  font-size:12px !important;
}
.el-dropdown-link:hover{
  background: #333740 !important;
  padding: 4px 8px !important;
  border: 1px solid #929AA8 !important;
  i.icon-az-icon-caret-bottom{
    transform-origin:center center; //旋转中心要是正中间 才行
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    transition: transform 0.2s; //过度时间 可调
    -moz-transition: -moz-transform 0.2s;
    -moz-transition: -moz-transform 0.2s;
    -o-transition: -o-transform 0.2s;
    -ms-transition: -ms-transform 0.2s;
  }
}
.el-dropdown-link .el-icon--right{
  display: inline;
}
  .market-box {
    height: 421px;
    width: 100%;
    background: #13151A;
    margin-top: 5px;
    display: flex;
    .recent-deal {
      width: 30%;
      min-width: 283px;
      display: inline-block;
      margin-right: 5px;
      border-radius: 2px;
      .deal-header {
        width: 100%;
        display: inline-block;
        height: 32px;
        background: #1D2026;
        font-size: 14px;
        font-family: PingFang-SC-Medium;
        color: #E6E8ED;
        line-height: 32px;

        p {
          padding-left: 10px;
          display: inline-block;
        }
      }
      .deal-table {
        background: #1D2026;
      }
    }
    .entrust {
      width: 100%;
      display: inline-block;
      float: right;
      position: relative;
      height: 420px;
      overflow: hidden;
      border-radius: 2px;
      .in-right {
        display: inline-block;
        position: absolute;
        height: 32px;
        right: 0;
        top: -32px;
        .check-div {
          height: 100%;
          line-height: 32px;
          display: inline-block;
          font-size: 12px;
          font-family: PingFang-SC-Medium;
          color: #686E7A;
        }
        .his-div {
          font-size: 12px;
          font-family: PingFang-SC-Medium;
          color: #686E7A;
          height: 32px;
          line-height: 32px;
          button {
            border: 0;
            background: #1D2026;
            color: #686E7A;
            font-size: 12px;
            font-family: PingFang-SC-Medium;
            display: inline-block;
            padding: 0 10px;
            height: 28px;
            margin-left: 10px;
            cursor: pointer;
          }
        }
      }
      .deal-table {
        background: #1D2026;
      }
      .currency-material{
        height: 388px;
        background: #1D2026;
        .material-box{
          height:348px;
          width: 100%;
          padding-top: 20px;
          display: flex;
          overflow: auto;
          ::-webkit-scrollbar{
            width: 5px;
            background: #1d1e26 !important;
          }
          ::-webkit-scrollbar-thumb {
            width: 5px;
            background: #333540 !important;
          }
          .material-left{
            display: inline-block;
            width:65%;
            margin-left: 30px;
            .currency-logo{
              .sb{
                display: inline-block;
                width:36px;
                vertical-align: top;
                margin-left: 20px;
                line-height: 44px;
                span{
                  font-size:12px;
                  font-family:PingFang-SC-Regular;
                  color:#686E7A;
                }
              }
            }
            .meterial-content{
              margin-top: 10px;
              div{
                font-size:14px;
                font-family:OpenSans;
                color:rgba(230,232,237,1);
              }
            }
            }
          .material-right{
               display: inline-block;
               width:100%;
               height:278px;
               float: right;
               margin:0 30px 0 100px;
               vertical-align: top;
               font-size:12px;
               font-family:OpenSans;
               color:rgba(229,229,229,1);
               border-radius: 2px ;
               ul{
                 li{
                   font-size:14px;
                   font-family:PingFangSC-Regular;
                   padding-bottom: 15px;
                   border-bottom: 1px solid #333740;
                   line-height:14px;
                   color:#686E7A;
                   margin-top: 15px;
                   p{
                     display: inline-block;
                     word-break:keep-all;
                     width:132px;
                   }
                   a{
                     color: #C9933E;
                     display: inline-block;
                     width: 300px;
                     overflow: hidden;
                     text-overflow: ellipsis;
                     white-space: nowrap;
                     margin-left: 15px;
                   }
                   span{
                     color: #E6E8ED;
                     margin-left: 15px;
                   }
                 }
               }
             }
          }

      }

    }
  }

  .his-div .active {
    background: #333740 !important;
    color: #929AA8 !important;
    border-radius: 2px;
    border: 0 !important;
  }

  /*.market-box .has-gutter .el-table_1_column_1,*/
  /*.market-box .has-gutter .el-table_1_column_2,*/
  /*.market-box .has-gutter .el-table_1_column_3,*/
  /*.entrust .el-table_2_column_4,*/
  /*.entrust .el-table_2_column_5,*/
  /*.entrust .el-table_2_column_6,*/
  /*.entrust .el-table_2_column_7,*/
  /*.entrust .el-table_2_column_8,*/
  /*.entrust .el-table_2_column_9,*/
  /*.entrust .el-table_2_column_10,*/
  /*.entrust .el-table_2_column_11,*/
  /*.entrust .el-table_2_column_12,*/
  /*.entrust .has-gutter .el-table_3_column_13,*/
  /*.entrust .has-gutter .el-table_3_column_14,*/
  /*.entrust .has-gutter .el-table_3_column_15,*/
  /*.entrust .has-gutter .el-table_3_column_16,*/
  /*.entrust .has-gutter .el-table_3_column_17,*/
  /*.entrust .has-gutter .el-table_3_column_18,*/
  /*.entrust .has-gutter .el-table_3_column_19,*/
  /*.entrust .has-gutter .el-table_3_column_20,*/
  /*.entrust .has-gutter .el-table_3_column_21 {*/
    /*font-family: PingFang-SC-Regular;*/
    /*font-size: 12px;*/
    /*color: rgba(136, 136, 136, 1);*/
    /*border: 0 !important;*/
    /*height: 28px !important;*/
    /*padding: 0;*/
    /*background: rgba(46, 46, 46, 1);*/
  /*}*/
</style>
