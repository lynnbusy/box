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
    'SelectDate',
    'feedbackBlock',
    'share'
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
    Share
) {
    'use strict'

    //获取前一天日期
    var currentDay = Util.prevDay( Util.getTodayStr() );

    // 当前日期获取失败时，当前累计天数，最大前5天
    var loseIndex = 1;
    var locality = "ALL";

    //传递接口数据
    var params = {
        "paging": {
            "page": 1,
            "pageSize": 100
        },
        "movieFilter": {
            "year": 0,
            "locality": locality
        }
    }

    var style = {
        background: 0,
        border: 0,
        fontSize: "1.22rem",
        color: "#D4D2D2"
    }

    // Component
    var YearRank = React.createClass({
        render: function(){
            let _current = this.state.currentYeay,
                _onClick = this.onTabClick,
                _onClickLocality = this.onTabLocality,
                _currentLocality = this.state.locality,
                _onClickFilterBtn = this.onClickFilterBtn,
                language = this.props.language;

            return (
                <section className={"_year_rank " + (this.props.active?"active":"cached")}  >
                    <div className={"raw-scroller "} style={{"display": (this.state.raw_scroller_status ? "block" : "none")}} >
                        <ul className="css-1px year-rank" style={{'width': '460px'}}>
                            <li className={ _current==0?"current":""}
                            onClick={_onClick.bind(null, 0)}><a>{language.screen[0]}</a></li>
                            <li className={ _current==2016?"current":""}
                            onClick={_onClick.bind(null, 2016)}><a>2016</a></li>
                            <li className={ _current==2015?"current":""}
                            onClick={_onClick.bind(null, 2015)}><a>2015</a></li>
                            <li className={ _current==2014?"current":""}
                            onClick={_onClick.bind(null, 2014)}><a>2014</a></li>
                            <li className={ _current==2013?"current":""}
                            onClick={_onClick.bind(null, 2013)}><a>2013</a></li>
                            <li className={ _current==2012?"current":""}
                            onClick={_onClick.bind(null, 2012)}><a>2012</a></li>
                            <li className={ _current==2011?"current":""}
                            onClick={_onClick.bind(null, 2011)}><a>2011</a></li>
                        </ul>
                    </div>
                    <div className={"raw-scroller raw-scroller-2 "} style={{"display": (this.state.raw_scroller_status ? "block" : "none")}} >
                        <ul className="css-1px country-rank" style={{'width': '460px'}}>
                            <li className={ _currentLocality=='ALL'?"current":""} 
                            onClick={_onClickLocality.bind(null, 'ALL')}><a>{language.screen[1][0]}</a></li>
                            <li className={ _currentLocality=='DOMESTIC'?"current":""} 
                            onClick={_onClickLocality.bind(null, 'DOMESTIC')}><a>{language.screen[1][1]}</a></li>
                            <li className={ _currentLocality=='IMPORTED'?"current":""} 
                            onClick={_onClickLocality.bind(null, 'IMPORTED')}><a>{language.screen[1][2]}</a></li>
                        </ul>
                    </div>
                    <h2 className="rank-title css-1px">{_current==0?language.title1:language.title2+this.state.model.nationalBoxOffice+'亿'}
                        <i onClick={_onClickFilterBtn.bind()} className={"icon-loudou " + (this.state.icon_loudou ? "" : "current")}></i>
                    </h2>
                    <div className={"contentView withFooter withSegmented withPickerRank ra-scroller"} style={{"top": this.state.raw_scroller_status ? "" : "129px"}}>
                        <ul className="scroller" >
                            <CommonTable
                                th1={language.item.th1}
                                th2={language.item.th2}
                                temp_th={language.item.th3}
                                th3={language.item.th4}
                                tr1_field={language.item.movieName}
                                tr2_field={language.item.productTotalBoxOffice}
                                temp_field={language.item.productTickets}
                                tr3_field="productAvgPerson"
                                id_field="cinemaId"
                                name_field="rankName"
                                index
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
                model: null,
                date: currentDay,
                currentYeay: 0,
                locality: "ALL",
                raw_scroller_status: true,
                icon_loudou: true,
            }
        },
        componentDidMount: function(){
            this.fetchData();
            
            //this.initIScroll();
        },
        shouldComponentUpdate: function(nextProps, nextState) {
            var _active = nextProps.active;
            var _el = document.getElementsByClassName('_year_rank')[0];
            if(!_active){
                _el.className = "_year_rank cached";
                return false;
            }else{
                _el.className = "_year_rank active";
            }
            return true;
        },
        componentDidUpdate: function(){
            if(this.props.active){
                
                this.CIScroll && this.CIScroll.refresh();
                this.RAWIScroll && this.RAWIScroll.refresh();
                if(!this.props.detail_open){
                    Share.setShare('中国票房排行榜—微票儿票房分析，透过数据看电影');
                }
                // ga('send', 'pageview', {
                //     'page': '/rank',
                //     'title': '总排行'
                // });

                // //Hawkeye - Wepiao FE Analytics Solution
                // he && he('send', 'pageview', 'OverallRecord');

                // app分享
                window.shareinfo = {
                    title: '中国票房排行榜—微票儿票房分析，透过数据看电影',
                    desc: '',
                    url: 'http://piaofang.wepiao.com/#/rank',
                    height: 770
                }
                window.app_iScrolls[7] = this.CIScroll;
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
                setTimeout(self.initIScroll, 500);
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
            if(!this.RAWIScroll){
                this.RAWIScroll = new IScroll('.raw-scroller', {
                    scrollX: true,
                    scrollY: false,
                    mouseWheel: true,
                    bindToWrapper: true,
                    preventDefault: Util.iScrollClick(),
                    tap: Util.iScrollClick(),
                    click: Util.iScrollClick(),
                });
            }
        },
        
        //选择时间回调
        selectDateCallback: function(_date){
            console.log(_date);
            //alert(_date);
            params.movieFilter.scheduleDate = _date + " 00:00:00";
            this.fetchData(params);
        },

        onTabClick: function(_currentYeay){
            var _currentYeaystr = _currentYeay;
            if(_currentYeay == 0){
                _currentYeaystr = "历年累计";
            }
            this.setState({
                currentYeay: _currentYeay
            })
            params.movieFilter.year = _currentYeay;
            this.fetchData();

            Util.setPiaoFangEventGa("总票房榜", "OverallRecord", 'year_'+ _currentYeaystr, 'year_'+ _currentYeaystr);
            // ga('send', 'event', 'YearRank', 'click', '年份_'+ _currentYeaystr , 1);

            // //Hawkeye - Wepiao FE Analytics Solution
            // he && he('send', 'event', 'YearRank', 'click', 'year_' + _currentYeaystr, 1);
        },

        onTabLocality: function(_locality){
            var _localitystr = "全部";
            this.setState({
                locality: _locality
            })
            params.movieFilter.locality = _locality;
            if(_locality == 'ALL'){
                params.paging.pageSize = 100;
            }else {
                params.paging.pageSize = 30;
                if(_locality == 'DOMESTIC'){
                    _localitystr = "国产";
                }else{
                    _localitystr = "进口";
                }
            }
            this.fetchData();
            
            Util.setPiaoFangEventGa("总票房榜", "overallrecord", _localitystr, _locality);

            // ga('send', 'event', 'YearRank', 'click', '影片类型_'+ _localitystr , 1);

            // //Hawkeye - Wepiao FE Analytics Solution
            // he && he('send', 'event', 'YearRank', 'click', 'movietype_' + _locality, 1);
        },

        // 筛选按钮操作
        onClickFilterBtn: function(evt){
            var _status = this.state.raw_scroller_status;
            if(_status){
                this.setState({
                    raw_scroller_status: false,
                    icon_loudou: false
                })
            }else{
                this.setState({
                    raw_scroller_status: true,
                    icon_loudou: true
                })
            }
            this.CIScroll && this.CIScroll.refresh();
        }
    })

    return YearRank;
 })
