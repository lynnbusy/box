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
    FeedbackBlock,
    Share
) {
    'use strict'

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
        hideXLabels: true,
        pointDotRadius : 2,
        pointHitDetectionRadius : 5,
        // Tooltip
        tooltipFillColor: "rgba(255,255,255,0.7)",
        tooltipFontColor: "#666666",
        tooltipCaretSize: 0,
        tooltipTemplate: "<%if (label && label != ' '){%> <%=label%>: <%}%> <%= value %>万",
        tooltipTemplate1: "<%if (label && label != ' '){%> <%=label%>: <%}%> <%= value %>wan",
        // Fxxking hack Solution
        // but always show the last one.
        showXLabels:2

    }

    // Chart
    var LineChart = ReactChart.Line;

    // Component
    var MovieBoxOffice = React.createClass({
        render: function(){
            // generate chartData if model ready, otherwise set default chart data.
            Share.setShare('《'+this.props.movieName + '》票房排片趋势-微票儿票房分析');
            let _chartData, _board,
                language = this.props.language,
                isCN = this.props.isCN;
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

            // movie-board-info
            // get last one
            // if(this.state.model && this.state.model.movieBoxOffices){
            if(this.state.model && this.state.model.movieBoxOfficeStats){
                    // copy, not pop()!
                    // let last = this.state.model.movieBoxOffices.slice(-1)[0];
                    let last = this.state.model.movieBoxOfficeStats;
                    if(last){
                        // let _date = last && last.scheduleDate.split("T")[0]
                        // let _today = Util.getTodayStr();
                        // let _productTotalBoxOffice = last.productTotalBoxOffice ? last.productTotalBoxOffice : '';
                        // let _productBoxOffice = last.productBoxOffice ? last.productBoxOffice : '';
                        // if  (_date == _today){
                        if(!last.endShow){
                            let total = parseFloat(last[language.item.total]) + parseFloat(last[language.item.advanceTotal]);
                            let totalObj = Util.getHundredMillion(total, language.infos[1]);
                            let upToNowObj = Util.getHundredMillion(parseFloat(last[language.item.total]), language.infos[1], last[language.item.total]);
                            if(isCN){
                                _board = (
                                    <h2><small>{language.infos[2]}</small>{upToNowObj.num}
                                        <small>{upToNowObj.units} </small>
                                        <small> {language.infos[4]}{last[language.item.advanceTotal]}{language.infos[3]}</small>
                                        <small> {language.infos[7]}{totalObj.num}{totalObj.units}</small>
                                    </h2>
                                )
                            }else{
                                _board = (
                                    <h2><small>{language.infos[2]}</small>{upToNowObj.num}
                                        <small>{upToNowObj.units} </small>
                                        <small> {language.infos[4]}{last[language.item.advanceTotal]}{language.infos[3]}</small>
                                    </h2>
                                )
                            }
                        }else{
                            let firstWeekObj = Util.getHundredMillion(parseInt(last[language.item.firstWeek].replace('M', '')), language.infos[3]);
                            let advanceTotalObj = Util.getHundredMillion(parseInt(last[language.item.total].replace('M', '')), language.infos[3]);
                            _board = (
                                <h2>
                                    <small>{language.infos[5]} {firstWeekObj.num}{firstWeekObj.units}</small>
                                    <small> {language.infos[6]} </small>{advanceTotalObj.num}<small>{advanceTotalObj.units}</small>
                                </h2>
                            )
                        }
                    }else{
                        _board = (
                            <h2>
                                <small>{language.nodata}</small>
                            </h2>
                        )
                    }
                        
            }else{
                // default placeholder
                _board = (
                    <h2>
                        <small>{language.nodata}</small>
                    </h2>
                )
            }


            return (
                <section className={"_movieboxoffice " + (this.props.active?"active":"cached")}  >
                    <div className="contentView withSegmented mdbo-scroller">
                        <ul className="scroller">
                            <div className="movie-board-info">
                                {_board}
                            </div>
                            <div className="chart">
                                { _chart }
                            </div>
                            <CommonTable
                                tr1_field="scheduleDate"
                                tr2_field={language.item.productBoxOffice}
                                tr3_field="productTicketSeatRate"
                                helper = {isCN ? Util.getChineseDateStrWithDay : Util.getEnglishDateStrWithDay}
                                th1={language.item.th1}
                                th2={language.item.th2}
                                th3={language.item.th3}
                                showday
                                percent
                                isPresell
                                isLong
                                movieList={this.state.model && this.state.model.movieBoxOffices}
                            />
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
        getDefaultProps: function(){
            return {
                movieName: "影片详情"
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
                this.fetchData(next);
                //ga("set", "/movie-detail", "电影详情 —— 票房");
                // ga('send', 'pageview', '/movie-detail-office');
                
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
            // if(!this.props.open && this.MDScroll){
            //     this.MDScroll.scrollTo(0, 0);
            // }
        },
        componentDidUpdate: function(){
            if(this.props.active){
                // this.MDScroll.refresh();
                this.setChartColor();
                this.props.movieScrollRefresh();
            }
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
            // _chart.firstTooltipPosition();
        },
        fetchData: function(id){
            console.log(id);
            if(!id) return;

            var self = this;
            var _params = {
                "paging": {
                    "page": 1,
                    "pageSize":99  // 无限
                },
                "movieFilter": {
                    "movieId": id
                }
            }

            DataCenter.MDBOModel.getData(_params, function(res){
                console.log('MDBOModel is ready:');
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
        generateChartData: function(isCN){
            var _movieBoxOffices = this.state.model.movieBoxOffices,
                _boxOffices = [],
                _len = _movieBoxOffices.length;

            for(let j = _len - 1; j >= 0 ; j--){
                _boxOffices.push(_movieBoxOffices[j]);
            }
            var _labels = _boxOffices.map(function(movie, i){
                var date = movie.scheduleDate;

                return (isCN ? Util.getChineseDateStr(date) : Util.getEnglishDateStr(date))
            })
            var _data = _boxOffices.map(function(movie, i){
                return movie.productBoxOffice;
            })

            // find today with reverse order.
            for(let i=_labels.length-1; i>0 ;i--){
                let _date = _labels[i]
                // let _today = isCN ? Util.getChineseDateStr(Util.getTodayStr()) : Util.getEnglishDateStr(Util.getTodayStr());
                if  (Util.isEqualDays(_boxOffices[i].scheduleDate, Util.getTodayStr())){
                        _labels[i] = isCN ? "今天" : 'today';
                }
            }

            // Hack: if labels or data got 0, chart would failed to render
            if(_labels.length == 1){
                _labels.splice(0, 0, " ");
                _data.splice(0, 0, 0);
            }

            // dynamic HitRadius depends on points number.
            if (_data.length > 60) {
                chartOptions.pointHitDetectionRadius = 0;
            } else {
                var _r = 6 - Math.floor(_data.length / 10);
                chartOptions.pointHitDetectionRadius = _r;
            }
            chartOptions.tooltipTemplate = isCN ? chartOptions.tooltipTemplate : chartOptions.tooltipTemplate1;
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
                        pointHighlightStroke: "rgba(151,187,205,1)"
                    }
                ]
            };
        },
        initIScroll: function(){
            // init IScroll
            this.MDScroll = new IScroll('.mdbo-scroller', {
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
            window.app_iScrolls[4] = this.MDScroll;
        }
    })

    return MovieBoxOffice;
 })
