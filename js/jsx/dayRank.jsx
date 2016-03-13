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

    //传递接口数据
    var params = {
        "paging": {
            "page": 1,
            "pageSize": 20
        },
        "movieFilter": {
            "scheduleDate": Util.getTodayStr() + " 00:00:00"
        }
    }

    var style = {
        background: 0,
        border: 0,
        fontSize: "1.22rem",
        color: "#D4D2D2"
    }

    // Component
    var DayRank = React.createClass({
        render: function(){
            let _current = this.state.open,
                _onClick = this.onTabClick,
                language = this.props.language;
            return (
                <section className={"_days_rank " + (this.props.active?"active":"cached")}  >
                    <ul className="css-1px day-rank">
                        <li className={ _current==0?"current":"" } 
                            onClick={_onClick.bind(null, 0)}>{language.menutitle[0]}</li>
                        <li className={ _current==1?"current":"" } 
                            onClick={_onClick.bind(null, 1)}>{language.menutitle[1]}</li>
                    </ul>
                    
                    <FirstDay
                        active={this.props.active}
                        open={this.state.open}
                        language={language} />
                    <DaysRank
                        active={this.props.active}
                        open={this.state.open} 
                        language={language} />
                </section>
            )
        },
        getInitialState: function(){
            return {
                model: null,
                open: 0
            }
        },
        componentDidMount: function(){
            // this.fetchData();
            
            // this.initIScroll();
            //<h2 className="rank-title css-1px">{"截至" + Util.getChineseDateStrWithYear(currentDay)}</h2>
        },
        shouldComponentUpdate: function(nextProps, nextState) {
            var _active = nextProps.active;
            var _el = document.getElementsByClassName('_days_rank')[0];
            if(!_active){
                _el.className = "_days_rank cached";
                return false;
            }else{
                _el.className = "_days_rank active";
            }
            return true;
        },
        componentDidUpdate: function(){
            if(this.props.active){
                this.CIScroll && this.CIScroll.refresh();
                //this.CIScroll.refresh();
                //this.fetchData();
                if(!this.props.detail_open){
                    Share.setShare('中国票房排行榜—微票儿票房分析，透过数据看电影');
                }
                // ga('send', 'pageview', {
                //     'page': '/day-rank',
                //     'title': '日排行'
                // });
                // //Hawkeye - Wepiao FE Analytics Solution
                // he && he('send', 'pageview', 'OpeningDay');
            }
        },
        fetchData: function(_params){
            var self = this;
            if(!_params){
                _params = params;
            }

            DataCenter.DRankModel.getData(_params, function(res){
                console.log('CIModel is ready:');
                console.log(res);
                // if(res.movieBoxOfficeRanks.length === 0){
                //     self.loseMethod();
                // }
                // re-render
                self.setState({
                    model: res
                })
                //setTimeout(self.initIScroll, 1000);
            },function(err){
                console.log(err);
            })
        },
        initIScroll: function(){
            //init IScroll
            this.CIScroll = new IScroll('.dayra-scroller', {
                mouseWheel: true,
                bindToWrapper: true,
                preventDefault: Util.iScrollClick(),
                tap: Util.iScrollClick(),
                click: Util.iScrollClick(),
            });
        },
        
        onTabClick: function(_current){
            this.setState({
                open: _current
            })
            var _label = _current == 0 ? 'opening day' : 'non-opening day';
            var _label1 = _current == 0 ? '首日票房' : '单日票房';
            Util.setPiaoFangEventGa("日票房榜", "dailyrecord", _label1, _label);
            // ga('send', 'event', '日票房榜', 'click', _label , 1);

            // //Hawkeye - Wepiao FE Analytics Solution
            // he && he('send', 'event', 'DayRank', 'click', _label , 1);
        }
    })
    
    //首日票房
    var FirstDay = React.createClass({
        render: function(){
            let language = this.props.language;

            return (
                <div className={"contentView withFooter withSegmented withPickerDaysRank firstdayra-scroller "+ (this.props.open == 0?"active":"cached")} 
                     style={{'height': document.body.offsetHeight - 160 + 'px'}}
                >
                    <ul className="scroller" >
                        <CommonTable
                            th1={language.item.th1}
                            th2={language.item.th2}
                            th3={language.item.th3}
                            tr1_field={language.item.movieName}
                            tr2_field={language.item.productBoxOffice}
                            tr3_field="scheduleDate"
                            id_field="cinemaId"
                            name_field="FirstDayRankName"
                            index
                            movieList={this.state.model && this.state.model.movieBoxOffices}
                        />
                        <FeedbackBlock />
                    </ul>
                </div>
            )
        },
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
            // var _active = nextProps.active;
            // var _el = document.getElementsByClassName('ci-scroller')[0];
            // if(_active != 'active'){
            //     _el.className = "contentView withFooter withPicker ci-scroller cached";
            //     return false;
            // }else{
            //     _el.className = "contentView withFooter withPicker ci-scroller active";
            // }
            return true;
        },
        componentDidUpdate: function(){
            if(this.props.open == 0){
                this.FDIScroll && this.FDIScroll.refresh();
                //this.CIScroll.refresh();
                //this.fetchData();
                if(!this.props.detail_open){
                    // Share.setShare('中国票房排行榜—微票儿票房分析，透过数据看电影');
                }
                // app分享
                if(this.props.active){
                    // app分享
                    window.shareinfo = {
                        title: '中国票房排行榜—微票儿票房分析，透过数据看电影',
                        desc: '',
                        url: 'http://piaofang.wepiao.com/#/rank',
                        height: 690
                    }
                    window.app_iScrolls[8] = this.FDIScroll;
                }
            }
        },
        fetchData: function(_params){
            var self = this;
            if(!_params){
                _params = params;
            }

            DataCenter.FDRankModel.getData(_params, function(res){
                console.log('CIModel is ready:');
                console.log(res);
                // if(res.movieBoxOfficeRanks.length === 0){
                //     self.loseMethod();
                // }
                // re-render
                self.setState({
                    model: res
                })
                //setTimeout(self.initIScroll, 1000);
            },function(err){
                console.log(err);
            })
        },
        initIScroll: function(){
            //init IScroll
            this.FDIScroll = new IScroll('.firstdayra-scroller', {
                mouseWheel: true,
                bindToWrapper: true,
                preventDefault: Util.iScrollClick(),
                tap: Util.iScrollClick(),
                click: Util.iScrollClick(),
            });
        }
    });

    //单日票房
    var DaysRank = React.createClass({
        render: function(){
            let language = this.props.language;

            return (
                <div className={"contentView withFooter withSegmented withPickerDaysRank dayra-scroller " + (this.props.open == 1?"active":"cached")} 
                     style={{'height': document.body.offsetHeight - 160 + 'px'}}
                >
                    <ul className="scroller" >
                        <CommonTable
                            th1={language.item.th1}
                            th2={language.item.th2}
                            th3={language.item.th3}
                            tr1_field={language.item.movieName}
                            tr2_field={language.item.productBoxOffice}
                            tr3_field="scheduleDate"
                            id_field="cinemaId"
                            name_field="DaysRankName"
                            index
                            movieList={this.state.model && this.state.model.movieBoxOffices}
                        />
                        <FeedbackBlock />
                    </ul>
                </div>
            )
        },
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
            // var _active = nextProps.active;
            // var _el = document.getElementsByClassName('ci-scroller')[0];
            // if(_active != 'active'){
            //     _el.className = "contentView withFooter withPicker ci-scroller cached";
            //     return false;
            // }else{
            //     _el.className = "contentView withFooter withPicker ci-scroller active";
            // }
            return true;
        },
        componentDidUpdate: function(){
            if(this.props.open == 1){
                this.DIScroll && this.DIScroll.refresh();
                //this.CIScroll.refresh();
                //this.fetchData();
                if(!this.props.detail_open){
                    // Share.setShare('中国票房排行榜—微票儿票房分析，透过数据看电影');
                }
                // app分享
                if(this.props.active){
                    // app分享
                    window.shareinfo = {
                        title: '中国票房排行榜—微票儿票房分析，透过数据看电影',
                        desc: '',
                        url: 'http://piaofang.wepiao.com/#/rank',
                        height: 690
                    }
                    window.app_iScrolls[9] = this.FDIScroll;
                }
            }
        },
        fetchData: function(_params){
            var self = this;
            if(!_params){
                _params = params;
            }

            DataCenter.DRankModel.getData(_params, function(res){
                console.log('CIModel is ready:');
                console.log(res);
                // if(res.movieBoxOfficeRanks.length === 0){
                //     self.loseMethod();
                // }
                // re-render
                self.setState({
                    model: res
                })
                //setTimeout(self.initIScroll, 1000);
            },function(err){
                console.log(err);
            })
        },
        initIScroll: function(){
            //init IScroll
            this.DIScroll = new IScroll('.dayra-scroller', {
                mouseWheel: true,
                bindToWrapper: true,
                preventDefault: Util.iScrollClick(),
                tap: Util.iScrollClick(),
                click: Util.iScrollClick(),
            });
        }
    });

    return DayRank;
 })
