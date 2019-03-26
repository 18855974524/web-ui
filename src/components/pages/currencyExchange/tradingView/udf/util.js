import $ from 'jquery';
import jstz from 'jstimezonedetect'
const datafeedConfig = (params) => {
  const {resolution,lang, datafeed} = params;
  return {
    debug: false,
    fullscreen: false,
    interval: resolution,
    container_id: 'tv_chart_container',
    toolbar_bg: '#1D2026',
    datafeed: datafeed,
    //	BEWARE: no trailing slash is expected in feed URL
    // library_path: "charting_library/",
    locale:lang,
    height:451,
    width:'100%',
    timezone:jstz.determine().name(),
    //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
    drawings_access: { type: 'black', tools: [ { name: "Regression Trend" } ] },
    disabled_features: [
      "save_chart_properties_to_local_storage",
      "header_interval_dialog_button",
      "header_symbol_search",
      "header_chart_type",
      "header_settings",
      "header_compare",
      "header_undo_redo",
      "header_screenshot",
      "header_saveload",
      "header_resolutions",
      "show_hide_button_in_legend",
      "format_button_in_legend",
      "timeframes_toolbar",
      "border_around_the_chart",
      "study_buttons_in_legend",
      "delete_button_in_legend",
      "legend_context_menu",
      // "use_localstorage_for_settings", // 会使 items_favoriting disabled
      "volume_force_overlay",
      "show_interval_dialog_on_key_press",
      "compare_symbol",
      "items_favoriting",
    ],
    enabled_features: [
      "move_logo_to_main_pane",
      "dont_show_boolean_study_arguments",
      // "hide_last_na_study_output",
      "hide_left_toolbar_by_default"
    ],
    overrides: {
      // "symbolWatermarkProperties.color": "#944", //水印 symbol
      "volumePaneSize": "small",
      "paneProperties.background": "#1D2026",
      "paneProperties.vertGridProperties.color": "#22262E",
      "paneProperties.horzGridProperties.color": "#22262E",
      "symbolWatermarkProperties.transparency": 90,
      "scalesProperties.textColor": "#555A66",
      "mainSeriesProperties.style": 8,
      "mainSeriesProperties.haStyle.upColor": "#09AC68",
      "mainSeriesProperties.haStyle.downColor": "#CA5128",
      "mainSeriesProperties.haStyle.borderUpColor": "#09AC68",
      "mainSeriesProperties.haStyle.borderDownColor": "#CA5128",
      "mainSeriesProperties.haStyle.wickUpColor": "#09AC68",
      "mainSeriesProperties.haStyle.wickDownColor": "#CA5128",
      "mainSeriesProperties.areaStyle.color1": "#C9933E",
      "mainSeriesProperties.areaStyle.color2": "#1D2026",
      "mainSeriesProperties.areaStyle.linecolor": "#C9933E",
      "mainSeriesProperties.areaStyle.linewidth": 3
    },
    studies_overrides: {
      "volume.volume.color.0": "#CA5128",
      "volume.volume.color.1": "#0C905A",
      "volume.volume.transparency": 50,
      // "volume.volume ma.color": "#FF0000",
      // "volume.volume ma.transparency": 30,
      // "volume.volume ma.linewidth": 5,
      "volume.show ma": false,
      // "bollinger bands.median.color": "#33FF88",
      // "bollinger bands.upper.linewidth": 7, 布林线
    },
    charts_storage_url: 'http://saveload.tradingview.com',
    charts_storage_api_version: "1.1",
    client_id: 'tradingview.com',
    user_id: 'public_user',
    // favorites: {
    //   intervals: ["5", "30", "60", "240", "1D"],
    // },
  };
};

const chartReady = (widget) => {
  // 设置默认的 MA 5，10，30
  widget.chart().createStudy('Moving Average', false, false, [5], null, {"plot.color.0" : "#9469BF"});
  widget.chart().createStudy('Moving Average', false, false, [10],null, {"plot.color.0" : "#399EBF"})
  widget.chart().createStudy('Moving Average', false, false, [30],null, {"plot.color.0" : "#A68A53"})
  widget.chart().onIntervalChanged().subscribe(null, function(interval, obj) {
    if(interval === 'realtime') {
      widget.chart().setChartType(TradingView.AREA);
    }
    // }else{
    //   widget.chart().setChartType(TradingView.HEIKEN_ASHI);
    // }
  })

  const buttonArr = [
    {
      value: '1',
      period: '1min',
      text: '分时',
      chartType: 3,
    },
    {
      value: '1',
      period: '1min',
      text: '1min',
    },
    {
      value: '5',
      period: '5min',
      text: '5min',
    },
    {
      value: '15',
      period: '15min',
      text: '15min',
    },
    {
      value: '30',
      period: '30min',
      text: '30min',
    },
    {
      value: '60',
      period: '1hour',
      text: '1hour',
    },
    {
      value: '240',
      period: '4hour',
      text: '4hour',
    },
    {
      value: '480',
      period: '8hour',
      text: '8hour',
    },
    {
      value: 'D',
      period: 'D',
      text: '1day',
    },
    {
      value: '5D',
      period: '5D',
      text: '5day',
    },
    {
      value: '1W',
      period: '1W',
      text: '1week',
    },
    {
      value: '1M',
      period: '1M',
      text: '1month',
    },
  ];


  let btn = {};

  const handleClick = (e, value,chartType) => {
    widget.chart().setResolution(value);
    widget.chart().setChartType(chartType || 8);
    $(e.target).addClass('select').closest('div.space-single').siblings('div.space-single').find('div.button').removeClass('select');
  };

  buttonArr.forEach((v, i) => {
    btn = widget.createButton().on('click', (e) => {
      handleClick(e, v.value,v.chartType);
    });
    btn[0].innerHTML = v.text;
    btn[0].title = v.text;
    // 如果 30分钟 默认选中，和配置中的 resolution 对应
    if(v.value==='30'){
      $(btn[0]).addClass('select');
    }
  });


};

export default {
  datafeedConfig,
  chartReady,
};


