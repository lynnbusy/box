/**
 *  Movie Box Office.jsx
 *  电影详情 —— 票房
 *
 *  @props  {Bool}      active          是否激活
 *  @props  {Number}    movieId         电影 ID
 *  @return {Component} MovieBoxOffice
 */

define([
    'React',
    'Chart',
    'ReactChart',
    'IScroll',
    'commonTable',
    'util',
    'datacenter',
    'SelectCity',
    'SelectDate',
    'TimeZone',
    'feedbackBlock',
    'share'
], function(
    React,
    Chart,
    ReactChart,
    IScroll,
    CommonTable,
    Util,
    DataCenter,
    SelectCity,
    SelectDate,
    TimeZone,
    FeedbackBlock,
    Share
) {
    'use strict'

    //传递接口数据
    var params = {
        "paging": {
            "page": 1,
            "pageSize": 20
        },
        "movieFilter": {
            "cityId": [],
            "theaterChainId": null,
            "scheduleDate": Util.getTodayStr() + " 00:00:00",
            "periodType": "0",
            "movieId": ''
        }
    }

    // Chart Config
    Chart.defaults.global.responsive = true;

    // Var
    var defaultChartData = {
        labels: [],
        datasets: [
            {
                data: [],
            }
        ]
    };

    var chartOptions = {
        bezierCurve : false, // no Curve.
        datasetFill : true,
        scaleShowVerticalLines: false,
        pointDotRadius : 2,
        pointHitDetectionRadius : 5,
        // Tooltip
        tooltipFillColor: "rgba(255,255,255,0.8)",
        tooltipFontColor: "#666666",
        tooltipCaretSize: 0,
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>%",
        // Fxxking hack Solution
        // but always show the last one.
        showXLabels:2

    }
    //设置城市名字
    var callbackCityName = null;

    // Chart
    var LineChart = ReactChart.Line;

    // Component
    var MovieSchedule = React.createClass({

        render: function(){
            let language = this.props.language,
                isCN = this.props.isCN;
            // generate chartData if model ready, otherwise set default chart data.
            Share.setShare('《'+this.props.movieName + '》票房排片趋势-微票儿票房分析');
            // app分享
            if(this.props.active == "active"){
                window.share_app = {
                    iScroll: this.MDScroll,
                    height:  875
                }
            }

            var _chartData;
            if(!this.state.model){
                _chartData = defaultChartData;
            }else{
                _chartData = this.generateChartData(isCN);
            }

            // <Chart />
            var _chart;
            if(this.props.active){
                _chart = (
                    <LineChart
                        data={_chartData}
                        options={chartOptions}
                        ref="chart"
                        redraw
                        width="300" height="200"/>
                )
            }else {
                _chart = null;
            }

            // dynamic Table!
            var _table = '';
            if(this.state.model){
                // 选择全国， 展示全国排名
                if(this.state.model.movieSchedules.length > 0){
                    _table = <CommonTable
                        tr1_field={language.item.cityName}
                        tr2_field="productShowTimes"
                        tr3_field="productScheduleRate"
                        th1={language.item.th1}
                        th2={language.item.th2}
                        th3={language.item.th3}
                        formatted
                        percent
                        cinemaNum
                        movieList={this.state.model.movieSchedules} />
                // 选择城市，展示影院排名
                } else {
                    _table = <CommonTable
                        tr1_field={language.item.cinemaName}
                        tr2_field="productShowTimes"
                        tr3_field="productScheduleRate"
                        th1={language.item.th4}
                        th2={language.item.th2}
                        th3={language.item.th3}
                        formatted
                        percent
                        cinemaNum
                        movieList={this.state.model.areaMovieSchedules} />
                }
            }

            //movie-board-info
            if(this.state.model){
                var _board;
                if(this.state.model.totalShowTimes == 0){
                    _board =
                    (<h2>
                        <small>{language.nodata}</small>

                    </h2>)
                }else{
                    //设置城市名字
                    if(callbackCityName){
                        var cityName = this.props.isCN ? callbackCityName.cityName : callbackCityName.cityNameEnglish;
                    }else{
                        var cityName = _language.util.cities.nation;
                    }
                    _board =
                        (<h2>
                            <small>{String.format(language.info1, cityName, Util.getFormattedNum(this.state.model.totalShowTimes))} </small>
                            <small> {language.item.th3}</small>{this.state.model.movieScheduleRate}<small>%</small>
                        </h2>)
                }
            }else{
                var _board =
                    (<h2>
                        <small>{language.nodata}</small>
                    </h2>)
            }


            return (
                <section className={this.props.active?"active":"cached"}  >
                    <div className="nav_list css-1px fixedUnderNav withSegmented">
                        <SelectCity
                            isMovieDetail
                            klassName="contentView withSegmented withPicker"
                            selectCityCallback={this.selectCityCallback}
                            showDailogCallback={this.props.showDailogCallback} />
                        <SelectDate
                            isMovieDetail
                            klassName="contentView withSegmented withPicker"
                            selectDateCallback={this.selectDateCallback}
                            MAXDate = {Util.getIndexDaysStr(Util.getTodayStr(), this.props.maxDays)}
                            showDailogCallback={this.props.showDailogCallback} />
                        <TimeZone
                            isMovieDetail
                            klassName="contentView withSegmented withPicker"
                            timeZoneCallback={this.timeZoneCallback}
                            showDailogCallback={this.props.showDailogCallback} />
                    </div>
                    
                    <div className="contentView withSegmented withPicker mdsc-scroller">
                        <ul className="scroller">
                            <div className="movie-board-info">
                                {_board}
                            </div>
                            <div className="chart">
                                { _chart }
                            </div>
                            {_table}
                            <FeedbackBlock />
                        </ul>
                    </div>
                </section>
            )
        },
        /**/
        getInitialState: function(){
            return {
                movieId: 0,
                model: null
            }
        },
        componentDidMount: function(){
            // this.initIScroll();
            this.setChartColor();
            this.props.movieScrollRefresh();
        },
        componentWillReceiveProps: function(nextProps){
            var old = this.props.movieId
            var next = nextProps.movieId
            Share.setShare('《'+this.props.movieName + '》票房排片趋势-微票儿票房分析');

            // movieId did not changed, use cached data.
            if(next && next !== old){
                params.movieFilter.movieId = next;
                this.fetchData();
                //ga("set", "/movie-detail", "电影详情 —— 排片");
                // ga('send', 'pageview', '/movie-detail-schedule');

            }

        },
        // shouldComponentUpdate: function(nextProps, nextState) {
        //     var _isOpen = nextProps.active;
        //     var _el = document.getElementsByClassName('_movie')[0];
        //     if(!_isOpen){
        //         _el.className = "movie-detail _movie";
        //         return false;
        //     }else{
        //         _el.className = "movie-detail _movie open";
        //     }
        //     return true;
        // },
        componentWillUpdate: function(){
            if(!this.props.open && this.MDScroll){
                //this.MDScroll.scrollTo(0, 0);
            }
        },
        componentDidUpdate: function(){
            if(this.props.active){
                // this.MDScroll.refresh();
                this.setChartColor();
                this.props.movieScrollRefresh();
            }
        },
        fetchData: function(_params){
            var self = this;
            if(!_params){
                _params = params;
            }
            if(!params.movieFilter.movieId) return;

            DataCenter.MDSCModel.getData(_params, function(res){
                console.log('MDSCModel is ready:');
                console.log(res);

                // re-render
                self.setState({
                    model: res
                })
                self.props.movieCallBack(res.movie);
            },function(err){
                console.log(err);
            })
        },
        setChartColor: function(){
            // use refs to get real chart-object
            if(this.refs.chart===undefined) return;
            var _chart = this.refs.chart.getChart();
            window.c = _chart;

            // manually set color for today point
            var points = _chart.datasets[0].points;

            // find today with reverse order.
            for(let i=points.length-1; i>0 ;i--){
                if(points[i].label === "今天" || points[i].label === "today"){
                    var _p = points[i];

                    _p.fillColor = "#ff0000";
                    _p.strokeColor = "#ff0000";
                    _p.highlightFill = "#ff0000";
                    _p.highlightStroke = "#ff0000";
                }
            }
            _chart.update();
        },
        generateChartData: function(isCN){
            var _labels = this.state.model.movieCharts.map(function(movie, i){
                var date = movie.scheduleDate;
                return (isCN ? Util.getChineseDateStr(date) : Util.getEnglishDateStr(date))
            })
            var _data = this.state.model.movieCharts.map(function(movie, i){
                return movie.productScheduleRate;
            })

            // find today with reverse order.
            for(let i=_labels.length; i>0 ;i--){
                let _date = _labels[i]
                let _today = isCN ? Util.getChineseDateStr(Util.getTodayStr()) : Util.getEnglishDateStr(Util.getTodayStr());
                if  (_date == _today){
                        _labels[i] = isCN ? "今天" : 'today';
                }
            }
            // chartOptions.tooltipTemplate = isCN ? chartOptions.tooltipTemplate : chartOptions.tooltipTemplate1;
            // dynamic HitRadius depends on points number.
            if (_data.length > 60) {
               chartOptions.pointHitDetectionRadius = 0;
            } else {
               var _r = 6 - Math.floor(_data.length / 10);
               chartOptions.pointHitDetectionRadius = _r;
            }

            return {
                labels: _labels,
                datasets: [
                    {
                        label: "",
                        data: _data,
                        fillColor: "rgba(217,239,253,1)",
                        strokeColor: "#4bb7fa",
                        pointColor: "#fff",
                        pointStrokeColor: "#189ef0",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                    }
                ]
            };
        },
        initIScroll: function(){
            // init IScroll
            this.MDScroll = new IScroll('.mdsc-scroller', {
                mouseWheel: true,
                bindToWrapper: true,
                preventDefault:  iScrollClick(),
                tap: iScrollClick(),
                click: iScrollClick()
            });
            window.scroll2 = this.MDScroll;
            function iScrollClick(){
                if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
                if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
                if (/Silk/i.test(navigator.userAgent)) return false;
                if (/Android/i.test(navigator.userAgent))
                {
                  var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
                  return parseFloat(s[0]+s[3]) < 44 ? false : true
                }
            }
            window.app_iScrolls[5] = this.MDScroll;
        },
        //选择城市回调
        selectCityCallback: function(city, type){
            // console.log(city);
            if(type == 'city'){
                params.movieFilter.theaterChainId = null;
                params.movieFilter.cityId = city.cityid;
            }else{
                params.movieFilter.theaterChainId = city.cityid[0];
                params.movieFilter.cityId = null;
            }
            //设置选择城市
            callbackCityName = city;

            this.fetchData(params);
            this.props.scrollBarToZeroCallback();
        },
        //选择时间回调
        selectDateCallback: function(_date){
            // console.log(_date);
            params.movieFilter.scheduleDate = _date + " 00:00:00";
            this.fetchData(params);
            this.props.scrollBarToZeroCallback();
        },
        //选择时段回调
        timeZoneCallback: function(_value){
            // console.log(_value);
            params.movieFilter.periodType = _value;
            this.fetchData(params);
            this.props.scrollBarToZeroCallback();
        }

    })

    return MovieSchedule;
 })
