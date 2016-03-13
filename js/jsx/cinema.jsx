/**
 *  Cinema.jsx
 *  影院
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
    SelectCity,
    SelectDate,
    TimeZone,
    FeedbackBlock,
    Share,
    PullRefresh
) {
    'use strict'

    // 时段data
    var timeZoneArr = ['全时段', '黄金时段', '非黄金时段'];

    //获取前一天日期
    var currentDay = Util.prevDay( Util.getTodayStr() );

    // 当前日期获取失败时，当前累计天数，最大前5天
    var loseIndex = 1;

    //传递接口数据
    var params = {
        "paging": {
            "page": 1,
            "pageSize": 200
        },
        "movieFilter": {
            "cityId": [],
            "theaterChainId": null,
            "scheduleDate": currentDay + " 00:00:00",
            "periodType": "0"
        }
    }

    var style = {
        background: 0,
        border: 0,
        fontSize: "1.22rem",
        color: "#D4D2D2"
    }

    // Component
    var Cinema = React.createClass({
        render: function(){

            let _scheduleDate = params.movieFilter.scheduleDate.replace(' 00:00:00', ''),
                language = this.props.language.cinema;
            return (
                <div className=
                    {"contentView withFooter withPicker ci-scroller " + this.props.active}
                >
                    <ul className="scroller">
                        <CommonTable
                            th1={language.item.th1}
                            th2={language.item.th2}
                            th3={language.item.th3}
                            tr1_field={language.item_tr.tr1_field}
                            tr2_field="productTickets"
                            tr3_field="productAvgPerson"
                            id_field="cinemaId"
                            name_field={language.item_tr.tr1_field}
                            toast={language.toast}
                            index
                            onItemClick={this.props.onCinemaItemClick}
                            movieList={this.state.model && this.state.model.cinemaBoxOffices}
                        />
                        <FeedbackBlock />
                    </ul>
                    <NavBar
                        bigLogo title="Lynn's Box"
                        clickSearch={this.props.callbackSearch}
                    />
                    <div className="nav_list border-1px">
                        <SelectCity
                            klassName="contentView withPicker"
                            selectCityCallback={this.selectCityCallback} />
                        <SelectDate
                            ref = "SelectDate"
                            date = {this.state.date}
                            MAXDate = {this.state.date}
                            selectDateCallback={this.selectDateCallback} />
                        <div className="nav_time" style={style}>
                            <i className="icon-duration"></i>
                            <span className="arr-down-">{this.props.language.util.timeZone.titles[0]}</span>
                        </div>
                    </div>
                </div>
            )
        },
        //
        getInitialState: function(){
            return {
                model: null,
                date: currentDay
            }
        },
        componentDidMount: function(){
            this.fetchData();
            this.initIScroll();
        },
        shouldComponentUpdate: function(nextProps, nextState) {
            var _active = nextProps.active;
            var _el = document.getElementsByClassName('ci-scroller')[0];
            if(_active != 'active'){
                _el.className = "contentView withFooter withPicker ci-scroller cached";
                return false;
            }else{
                _el.className = "contentView withFooter withPicker ci-scroller active";
            }
            return true;
        },
        componentDidUpdate: function(){
            if(this.props.active == "active"){
                this.CIScroll.refresh();
                if (!this.props.cinema_open) {
                    Share.setShare('热门影院排行-微票儿票房分析，透过数据看电影');
                }
            }
        },
        fetchData: function(_params){
            var self = this;
            if(!_params){
                _params = params;
            }

            DataCenter.CIModel.getData(_params, function(res){
                console.log('CIModel is ready:');
                console.log(res);
                if(res && res.cinemaBoxOffices && res.cinemaBoxOffices.length === 0){
                    self.loseMethod();
                }
                // re-render
                self.setState({
                    model: res
                })
            },function(err){
                console.log(err);
            })
        },
        initIScroll: function(){
            var self = this;
            //init IScroll
            this.CIScroll = new IScroll('.ci-scroller', {
                mouseWheel: true,
                bindToWrapper: true,
                probeType: 3,
                preventDefault: Util.iScrollClick(),
                tap: Util.iScrollClick(),
                click: Util.iScrollClick()
            });
            var pullRefresh = new PullRefresh.refresh({
                scroll: this.CIScroll,
                model: DataCenter.CIModel,
                params: params,
                callback: function(res){
                    // re-render
                    self.setState({
                        model: res
                    })
                }
            });
            window.app_iScrolls[2] = this.CIScroll;
        },
        //选择城市回调
        selectCityCallback: function(city){
            // console.log(city);
            params.movieFilter.cityId = city.cityid;
            if(city.cityid.length == 1 && city.cityid[0] == '0'){
                params.paging.pageSize = 200;
            }else{
                params.paging.pageSize = 20;
            }
            this.fetchData(params);
        },
        //选择时间回调
        selectDateCallback: function(_date){
            // console.log(_date);
            //alert(_date);
            params.movieFilter.scheduleDate = _date + " 00:00:00";
            this.fetchData(params);
        },
        //选择时段回调
        timeZoneCallback: function(_value){
            // console.log(_value);
            //alert(_value);
            params.movieFilter.periodType = _value;
            this.fetchData(params);
        },
        //请求失败处理方法，最多请求前5天的
        loseMethod: function(){
            loseIndex++;
            if(loseIndex <= 5){
                var _date = Util.prevDay( currentDay );
                currentDay = _date;
                params.movieFilter.scheduleDate = _date + " 00:00:00";
                this.fetchData(params);
                this.setState({date: _date});
                this.refs.SelectDate.setState({date: _date});
            }
        },

        setPiaoFang: function(){
            //ga("set", "/cinema", "热门影院排行");
            // ga('send', 'pageview', '/cinema');
            ga('send', 'pageview', {
                'page': '/cinema',
                'title': '热门影院排行'
            });
            //Hawkeye - Wepiao FE Analytics Solution
            he && he('send', 'pageview', 'cinema');
        }
    })

    return Cinema;
 })
