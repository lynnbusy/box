/**
 *  Schedule.jsx
 *  排期
 *
 */

define([
    'React',
    'Chart',
    'ReactChart',
    'IScroll',
    'Router',
    'navBar',
    'util',
    'datacenter',
    'commonTable',
    'movieDetail',
    'SelectCity',
    'SelectDate',
    'TimeZone',
    'feedbackBlock',
    'share',
    'pullRefresh'
], function(
    React,
    Chart,
    ReactChart,
    IScroll,
    Router,
    NavBar,
    Util,
    DataCenter,
    CommonTable,
    MovieDetail,
    SelectCity,
    SelectDate,
    TimeZone,
    FeedbackBlock,
    Share,
    PullRefresh
) {
    'use strict'

    const BARCOLORS_o = [
        "b1d9a9","63c7d3","f5d96c","fad0b7","f69f99",
        "f38456","9bc6e7","888caa","5d6991","826fb2"
    ]

    const BARCOLORS = [
        "f8d303","31d197","f76606","0ea9fa","e83295",
        "9badc1","b3c1d1","c6d1dd","d7dfe8","E5E8EA", "ecf0f4"
    ]

    //传递接口数据
    var params = {
        "paging": {
            "page": 1,
            "pageSize": 15
        },
        "movieFilter": {
            "cityId": [],
            "theaterChainId": null,
            "scheduleDate": Util.getTodayStr() + " 00:00:00",
            "periodType": "0"
        }
    }

    //设置城市名字
    var callbackCityName = null;

    // Chart Config
    Chart.defaults.global.responsive = true;

    var defaultChartData = [
        {
            // 0 can make size correct but render blank.
            value: 0,
            color:"#b1d9a9",
            highlight: "#FF5A5E",
            label: "加载中..."
        }
    ]

    var chartOptions = {
        animationEasing: "easeOutQuart",
        animationSteps: 60,
        segmentShowStroke : false,
        // Tooltip
        tooltipFillColor: "rgba(255,255,255,0.9)",
        tooltipFontColor: "#666666",
        tooltipCaretSize: 0,
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>%"
    };

    // Component - Doughnut Chart
    var DoughnutChart = ReactChart.Doughnut;

    // Component - Schedule
    var Schedule = React.createClass({
        render: function(){
            var _chartData;
            var _chart;
            var _weekStr;
            var _days = Util.restrictSwitchToDate(Util.getTodayStr(), this.state.date),
                language = this.props.language.schedule,
                languageType = this.props.language.type,
                _date;

            if(_days === 0){
                _weekStr = language.today;
            }else{
                if(languageType == 'cn'){
                    _weekStr = Util.getDay(this.state.date);
                }else{
                    _weekStr = Util.getDayEn(this.state.date);
                }
            }
            if(languageType == 'cn'){
                _date = Util.getChineseDateStr(this.state.date);
            }else{
                _date = Util.getEnglishDateStr(this.state.date);
            }

            // generate chartData if model ready, otherwise set default chart data.
            if(!this.state.model){
                _chartData = defaultChartData;
            }else{
                _chartData = this.generateChartData();
            }
            var totalShowTimes = this.state.model && this.state.model.totalShowTimes;

            //设置城市名字
            if(callbackCityName){
                var cityName = languageType == 'cn' ? callbackCityName.cityName : callbackCityName.cityNameEnglish;
            }else{
                var cityName = this.props.language.util.cities.nation;
            }

            if(this.state.model){
                var scheduleTitle = String.format(language.info,
                                    _date, _weekStr,
                                    cityName,
                                    Util.getFormattedNum(totalShowTimes))
            }else{
                var scheduleTitle = '';
            }
            var _handleClick = this.handlebarClick;

            // Chart must only rendered in displayed container
            // Chart.js issue: https://github.com/nnnick/Chart.js/issues/1311
            if(this.props.active == 'active'){
                _chart = (
                    <DoughnutChart
                        data={_chartData}
                        options={chartOptions}
                        redraw
                        width="300" height="170"/>
                )
            }else{
                _chart = null
            }

            return (
                <div className=
                    {"contentView withPicker withFooter sc-scroller " + this.props.active}
                >
                    <ul className="scroller">
                        <div className="_info_">
                            <span className="arr-left" onClick={_handleClick.bind(null, 'prev')}></span>
                            <span className="board-info">{scheduleTitle}</span>
                            <span className="arr-right" onClick={_handleClick.bind(null, 'next')}></span>
                        </div>
                        <div className="sc-chart">
                            {_chart}
                        </div>
                        <CommonTable
                            th1 = {language.item_title.th1}
                            th2 = {language.item_title.th2}
                            th3 = {language.item_title.th3}
                            tr1_field = {language.item_tr.tr1_field}
                            tr2_field = "productShowTimes"
                            tr3_field = "productScheduleRate"
                            name_field = {language.item_tr.tr1_field}
                            color
                            percent
                            formatted
                            showday
                            movieList={this.state.model && this.state.model.movieSchedules}
                            onItemClick={this.props.onMovieItemClick}
                        />
                        <FeedbackBlock />
                    </ul>
                    <NavBar bigLogo title="Lynn's Box"
                        clickSearch={this.props.callbackSearch}
                    />
                    <div className="nav_list border-1px">
                        <SelectCity
                            klassName="contentView withPicker"
                            selectCityCallback={this.selectCityCallback} />
                        <SelectDate
                            ref = "SelectDate"
                            selectDateCallback={this.selectDateCallback}
                            date={this.state.date}
                            MAXDate={Util.getIndexDaysStr(Util.getTodayStr(), this.props.maxDays)} />
                        <TimeZone
                            timeZoneCallback={this.timeZoneCallback} />
                    </div>
                </div>
            )
        },
        /**/
        getInitialState: function(){
            return {
                model: null,
                date: Util.getTodayStr()
            }
        },
        componentDidMount: function(){
            this.fetchData();
            this.initIScroll();
        },
        shouldComponentUpdate: function(nextProps, nextState) {
            var _active = nextProps.active;
            var _el = document.getElementsByClassName('sc-scroller')[0];
            if(_active != 'active'){
                _el.className = "contentView withPicker withFooter sc-scroller cached";
                return false;
            }else{
                _el.className = "contentView withPicker withFooter sc-scroller active";
            }
            return true;
        },
        componentDidUpdate: function(){
            if(this.props.active == "active"){
                this.SCScroll.refresh();
                if(!this.props.detail_open){
                    Share.setShare('排片榜-微票儿票房分析，透过数据看电影');

                }

            }
        },
        fetchData: function(_params){
            var self = this;
            if(!_params){
                _params = params;
            }

            DataCenter.SCModel.getData(_params, function(res){
                console.log('SCModel is ready:');
                console.log(res);

                // re-render
                self.setState({
                    model: res
                })
            },function(err){
                console.log(err);
            })
        },
        generateChartData: function(){
            let movieName = this.props.language.schedule.item_tr.tr1_field;
            return this.state.model.movieSchedules.map(function(movie, i){
                return {
                    value: movie.productScheduleRate,
                    label: movie[movieName],
                    color:  '#' + BARCOLORS[i]
                }
            })
        },
        initIScroll: function(){
            var self = this;
            //init IScroll
            this.SCScroll = new IScroll('.sc-scroller', {
                mouseWheel: true,
                bindToWrapper: true,
                preventDefault:  Util.iScrollClick(),
                tap: Util.iScrollClick(),
                probeType: 3,
                click: Util.iScrollClick(),
            });
            var pullRefresh = new PullRefresh.refresh({
                scroll: this.SCScroll,
                model: DataCenter.SCModel,
                params: params,
                callback: function(res){
                    // re-render
                    self.setState({
                        model: res
                    })
                }
            });
            window.app_iScrolls[0] = this.SCScroll;
        },
        //选择城市回调
        selectCityCallback: function(city, type){
            // console.log(city);
            var cityid = city.cityid;
            if(type == 'city'){
                params.movieFilter.theaterChainId = null;
                if(cityid[0] === '0'){
                    params.movieFilter.cityId = [];
                }else{
                    params.movieFilter.cityId = city.cityid;
                }
            }else{
                params.movieFilter.cityId = null;
                params.movieFilter.theaterChainId = city.cityid[0];
            }
            //设置选择城市/院线名
            callbackCityName = city;

            this.fetchData(params);
        },
        //选择时间回调
        selectDateCallback: function(_date){
            //console.log(_date);
            //alert(_date);
            this.setState({date: _date});
            params.movieFilter.scheduleDate = _date + " 00:00:00";
            this.fetchData(params);
        },
        //选择时段回调
        timeZoneCallback: function(_value){
            console.log(_value);
            //alert(_value);
            params.movieFilter.periodType = _value;
            this.fetchData(params);
        },
        //切换时间
        handlebarClick: function(eventName){
            var _date;
            if(eventName == 'prev'){
                _date = Util.prevDay(this.state.date);
                Util.setPiaoFangEventGa("前一天", "prev", _date, _date);
            }else{
                _date = Util.nextDay(this.state.date);
                Util.setPiaoFangEventGa("后一天", "next", _date, _date);
            }
            this.setState({date: _date});
            this.refs.SelectDate.setState({date: _date});

            params.movieFilter.scheduleDate = _date + " 00:00:00";
            this.fetchData(params);

        },
        setPiaoFang: function(){
            // ga("set", "/schedule", "排片榜");
            // ga('send', 'pageview', '/schedule');
            ga('send', 'pageview', {
                'page': '/schedule',
                'title': '排片榜'
            });
            //Hawkeye - Wepiao FE Analytics Solution
            he && he('send', 'pageview', 'schedule');
        }
    })

    return Schedule;
 })
