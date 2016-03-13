/**
 *  rank.jsx
 *  排行
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
    'SelectDate',
    'feedbackBlock',
    'share',
    'segmented',
    'yearRank',
    'dayRank',
    'wxRank'
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
    SelectDate,
    FeedbackBlock,
    Share,
    Segmented,
    YearRank,
    DayRank,
    WxRank
) {
    'use strict'

    //获取前一天日期
    var currentDay = Util.prevDay( Util.getTodayStr() );

    // 当前日期获取失败时，当前累计天数，最大前5天
    var loseIndex = 1;

    //传递接口数据
    var params = {
        "paging": {
            "page": 1,
            "pageSize": 100
        },
        "movieFilter": {
            "year":0
        }
    }

    var style = {
        background: 0,
        border: 0,
        fontSize: "1.22rem",
        color: "#D4D2D2"
    }

    // Component
    var Rank = React.createClass({
        render: function(){
            let _current = this.state.currentSegment,
                language = this.props.language.rank;

            return (
                <div className=
                    {"movie-rank " + this.props.active}
                >
                    <Segmented
                        current = {this.state.currentSegment}
                        th1 = {language.menutitle[0]}
                        th2 = {language.menutitle[1]}
                        th3 = {language.menutitle[2]}
                        onChange = {this.onSegmentedChange}
                    />
                    <NavBar
                        bigLogo title="Lynn's Box"
                        clickSearch={this.props.callbackSearch}
                    />
                    <WxRank
                        active = {_current==0 && this.props.active == 'active'}
                        detail_open = {this.state.detail_open}
                        language = {language.wx}
                        onItemClick={this.props.onMovieItemClick}
                    />
                    <YearRank
                        active = {_current==1}
                        detail_open = {this.state.detail_open}
                        language = {language.yearRank}
                    />
                    <DayRank
                        active = {_current==2}
                        detail_open = {this.state.detail_open}
                        language = {language.dayRank}
                    />
                </div>
            )
        },
        getInitialState: function(){
            return {
                model: null,
                date: currentDay,
                currentSegment: 0,
                detail_open: this.props.detail_open
            }
        },
        componentDidMount: function(){
            //this.fetchData();
            //this.initIScroll();
        },
        shouldComponentUpdate: function(nextProps, nextState) {
            var _active = nextProps.active;
            var _el = document.getElementsByClassName('movie-rank')[0];
            if(_active != 'active'){
                _el.className = "movie-rank cached";
                return false;
            }else{
                _el.className = "movie-rank active";
            }
            return true;
        },
        componentDidUpdate: function(){
            if(this.props.active == "active"){
                //this.CIScroll.refresh();
                // if(!this.props.detail_open){
                //     Share.setShare('中国票房总榜—微票儿票房分析，透过数据看电影');
                // }
                // ga("set", "/rank", "排行");
                // ga('send', 'pageview', '/rank');
            }
        },
        fetchData: function(_params){
            var self = this;
            if(!_params){
                _params = params;
            }

            DataCenter.YRankModel.getData(_params, function(res){
                console.log('CIModel is ready:');
                console.log(res);
                // if(res.movieBoxOfficeRanks.length === 0){
                //     self.loseMethod();
                // }
                // re-render
                self.setState({
                    model: res
                })
            },function(err){
                console.log(err);
            })
        },
        initIScroll: function(){
            //init IScroll
            this.CIScroll = new IScroll('.ra-scroller', {
                mouseWheel: true,
                bindToWrapper: true,
                preventDefault: Util.iScrollClick(),
                tap: Util.iScrollClick(),
                click: Util.iScrollClick(),
            });
        },

        //选择时间回调
        selectDateCallback: function(_date){
            console.log(_date);
            //alert(_date);
            params.movieFilter.scheduleDate = _date + " 00:00:00";
            this.fetchData(params);
        },

        // Segmented Control
        onSegmentedChange: function(index){
            var pullRefreshTop;
            if(index == 0){
                pullRefreshTop = 120;
                Util.setPiaoFangEventGa("排行", "Rank", "微信指数", "WechatIndex");
            }else if(index >= 1){
                pullRefreshTop = 10;
                if(index == 1){
                    Util.setPiaoFangEventGa("排行", "Rank", "总票房榜", "OverallRecord");
                }else if(index == 2){
                    Util.setPiaoFangEventGa("排行", "Rank", "日票房榜", "DailyRecord");
                }
            }
            this.props.pullRefreshCallBack(pullRefreshTop);
            this.setState({
                currentSegment: index,
                isOnClickMovieDetailMenus: true
            })
        },
        setPiaoFang: function(){
            ga('send', 'pageview', {
                'page': '/rank',
                'title': '微信指数'
            });
            //Hawkeye - Wepiao FE Analytics Solution
            he && he('send', 'pageview', 'rank');
        }
    })

    return Rank;
 })
