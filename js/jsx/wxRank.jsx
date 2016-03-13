/**
 *  WX Rank.jsx
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
    SelectDate,
    FeedbackBlock,
    Share,
    PullRefresh
) {
    'use strict'

    //传递接口数据
    var params = {
        "paging": {
            "page": 1,
            "pageSize": 10
        },
        "hotType":"ONE_DAY"
    }
    window.IScroll = IScroll;
    var WxRank = React.createClass({
        render: function(){
            let model = this.state.model,
                movieHots = '',
                maxMovieHot,
                scale,
                _hotType = this.state.hotType,
                _onClickDays = this.onClickDays,
                language = this.props.language;
            if(model){
                if(model.movieHots){
                    movieHots = model.movieHots.map((movie, k) => {
                        if(k == 0){
                            maxMovieHot = movie.movieHot;
                        }
                        scale = Math.floor(movie.movieHot / maxMovieHot * 100);
                        let _isToday = Util.isEqualDays(movie.releaseDate, new Date()),
                            todayHtml = '',
                            tendencyCla = '',
                            _day = language.type == "cn" ? 
                                   (Util.getChineseDateStr(movie.releaseDate) + language.item.release) :
                                   (Util.getEnglishDateStr(movie.releaseDate) + language.item.release);
                        if(_isToday){
                            todayHtml = <i>{language.item.type}</i>
                        }
                        /**/
                        if(movie.tendency == -1){
                            tendencyCla = 'icon-down';
                        }else if(movie.tendency == 0){
                            tendencyCla = 'still';
                        }else if(movie.tendency == 1){
                            tendencyCla = 'icon-up';
                        }

                        return (
                            <li>
                                <span className="start">
                                    <span className="cinema-index">{k + 1}</span>
                                    <h5>{movie[language.item.movieName]}{todayHtml}</h5>
                                    <p>{_day}</p>
                                </span>
                                <span className="middle">
                                    <div><h5 className="transition5" style={{"width": scale+"%"}}></h5></div>
                                    <p>{movie.movieHot}<i className={tendencyCla}></i></p>
                                </span>
                            </li>
                        )
                    })
                }
            }
            return (
                <section className={"_wx_rank " + (this.props.active?"active":"cached")}>
                    <ul className="css-1px day-rank">
                        <li className={ _hotType=='ONE_DAY'?"current":""} 
                            onClick={_onClickDays.bind(null, 'ONE_DAY')}>{language.menutitle[0]}</li>
                        <li className={ _hotType=='SEVEN_DAY'?"current":""} 
                            onClick={_onClickDays.bind(null, 'SEVEN_DAY')}>{language.menutitle[1]}</li>
                    </ul>
                    /**/
                    <div className="common-table table-rank wx-rank contentView withFooter withSegmented withPickerDaysRank">
                        <div className="scroller">
                            <p className="announcement css-1px"><i className="icon-sound"></i>{language.toast}</p>
                            <div className="table-header css-1px">
                                <span className="start">{language.item.th1}</span>
                                <span className="middle">{language.item.th2}</span>
                            </div>
                            <ul className="table-rank scroller">
                                {movieHots}
                            </ul>
                            <FeedbackBlock />
                        </div>
                    </div>
                </section>
            )
         },
         /**/
         getInitialState: function(){
            return {
                model: null,
                hotType: "ONE_DAY"
            }
        },
        componentDidMount: function(){
            this.fetchData();
            
            // this.initIScroll();
        },
        shouldComponentUpdate: function(nextProps, nextState) {
            var _active = nextProps.active;
            var _el = document.getElementsByClassName('_wx_rank')[0];
            if(!_active){
                _el.className = "_wx_rank cached";
                return false;
            }else{
                _el.className = "_wx_rank active";
            }
            return true;
        },
        componentDidUpdate: function(){
            if(this.props.active){
                this.RAWIScroll && this.RAWIScroll.refresh();
                
                if(!this.props.detail_open){
                    Share.setShare('微信电影指数排行榜－微票儿票房分析，透过数据看电影');
                }
                
            }
        },
        fetchData: function(_params){
            var self = this;
            if(!_params){
                _params = params;
            }

            DataCenter.MHotModel.getData(_params, function(res){
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
            var self = this;
            if(!this.RAWIScroll){
                this.RAWIScroll = new IScroll('.wx-rank', {
                    scrollX: false,
                    scrollY: true,
                    mouseWheel: true,
                    bindToWrapper: true,
                    probeType: 3,
                    preventDefault: Util.iScrollClick(),
                    tap: Util.iScrollClick(),
                    click: Util.iScrollClick(),
                });
            }
            var pullRefresh = new PullRefresh.refresh({
                scroll: this.RAWIScroll,
                model: DataCenter.MHotModel,
                params: params,
                callback: function(res){
                    // re-render
                    self.setState({
                        model: res
                    })
                }
            });
            window.app_iScrolls[3] = this.RAWIScroll;
        },
        
        //选择天数
        onClickDays: function(_hotType){
            console.log(_hotType);
            //alert(_date);
            params.hotType = _hotType;
            this.setState({hotType: _hotType})
            this.fetchData(params);

            if(_hotType === 'ONE_DAY'){
                Util.setPiaoFangEventGa("微信指数", "WechatIndex", "24时热度", "24h");

                // ga('send', 'event', '微信指数', 'click', '24时热度' , 1);
                // //Hawkeye - Wepiao FE Analytics Solution
                // he && he('send', 'event', 'WxRank', 'click', '24h', 1);
            }else{
                Util.setPiaoFangEventGa("微信指数", "WechatIndex", "7日热度", "7d");

                // ga('send', 'event', '微信指数', 'click', '7日热度' , 1);
                // //Hawkeye - Wepiao FE Analytics Solution
                // he && he('send', 'event', 'WxRank', 'click', '7d', 1);
            }

                
        }
     })

     return WxRank;
 })
