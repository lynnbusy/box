/**
 *  Box Office.jsx
 *  票房／大盘首页

    下载banner
    _banner = (
        <div className="banner" onClick={this.onClickBanner}>
            <a className="close">x</a>
            <span className="logo"><div className="logo-img"></div></span>
            <p><b>微票儿票房分析</b><small>客户端上线-随时随地查询票房趋势</small></p>

            <span><a className="btn">免费下载</a></span>
        </div>
    )

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
    'boxOfficeTable',
    'movieDetail',
    'datacenter',
    'SelectCity',
    'SelectDate',
    'TimeZone',
    'SwitchToDate',
    'feedbackBlock',
    'share',
    'pullRefresh',
    'advertisement'
], function(
    React,
    Chart,
    ReactChart,
    IScroll,
    Router,
    NavBar,
    Util,
    BoxOfficeTable,
    MovieDetail,
    DataCenter,
    SelectCity,
    SelectDate,
    TimeZone,
    SwitchToDate,
    FeedbackBlock,
    Share,
    PullRefresh,
    Advertisement
) {
    'use strict'

    //传递接口数据
    var params = {
        "paging": {
            "page": 1,
            "pageSize": 15
        },
        "movieFilter": {
            "scheduleDate": Util.getTodayStr() + " 00:00:00"
        }
    }
    var toastTxt = '实时票房指当天已售出的包含已开映和未开映的所有场次票房';
    var delay = 5e3;
    // Component
    var BoxOffice = React.createClass({
        render: function(){
            // var accurateNationalBoxOffice = '';
            // if(this.state.model && this.state.model.accurateNationalBoxOffice){
            //     var num = parseInt(this.state.model.accurateNationalBoxOffice);
            //     accurateNationalBoxOffice = (num / 10000).toFixed(1);
            // }
            // let _banner = '';
            let _banner = '', bannerClassName = '',
                isBanner = this.getBannerStatus(),
                banner_hide = this.state.banner_hide,
                titleBar = this.state.language,
                isCN = titleBar.type == 'cn' ? true : false;
            // if(!isBanner && !banner_hide && isCN){
                // bannerClassName = 'banner'
                _banner = (
                    <div>
                        <div className="banner" id="iSlider-wrapper"></div>
                    </div>
                )
            // }
            /* */
            var scheduleDate = params.movieFilter.scheduleDate.replace(' 00:00:00', '');
            var boxOfficeTitle = this.setSwitchToDateMathod(Util.getTodayStr(), scheduleDate);
            let _todayBoard = this.state.model ? boxOfficeTitle.infos : (<div className="today-board" />)
            return (
                <div className=
                    {" contentView withPicker withFooter bo-scroller appDown" + this.props.active}
                >
                    <ul className="scroller">
                        {_todayBoard}
                        <BoxOfficeTable
                            language={this.state.language.boxoffice}
                            movieList={this.state.model && this.state.model.movieBoxOffices}
                            onMovieItemClick={this.props.onMovieItemClick} />
                        <FeedbackBlock />
                    </ul>
                    {_banner}
                    <NavBar bigLogo title="Lynn's Box" leftTitle={this.state.language.left_title}
                        clickSearch={this.props.callbackSearch}
                        clickSeting={this.props.callbackSeting} />
                    <SwitchToDate
                        ref = "SwitchToDate"
                        maxDays = {this.props.maxDays}
                        days = {boxOfficeTitle.days}
                        selectDateChange = {this.selectDateChange}
                        language={titleBar} />
                </div>
            )
        },
        getInitialState: function(){
            return {
                model: null,
                banner_hide: false,
                language: this.props.language
            }
        },
        componentDidMount: function(){
            this.fetchData();
            this.initIScroll();

            // forbid Ad in Lynn's Box Version
            // new Advertisement.ad({
            //     container: 'iSlider-wrapper',
            //     datacenter: DataCenter,
            //     resultCallback: function(){
            //         var _el = document.getElementsByClassName('bo-scroller')[0];
            //         var _class = _el.className;
            //         _el.className = _class + ' appDown';
            //         this.isAds = true;
            //         this.props.completeBanCallback();
            //         this.refs.SwitchToDate.setState({isAds: true});
            //     }.bind(this),
            //     callback: function(ad){
            //         console.log(ad.title);
            //         location.href = '#/targeturl-page/' + ad.pageIndex;
            //     }
            // });

        },
        shouldComponentUpdate: function(nextProps, nextState) {
            var _active = nextProps.active;
            var _el = document.getElementsByClassName('bo-scroller')[0];
            let isBanner = this.getBannerStatus(),
                banner_hide = this.state.banner_hide,
                appDown = '';
            // if(!isBanner && !banner_hide && nextProps.language.type == 'cn'){
            if(this.isAds){
                appDown = 'appDown';
            }

            if(_active != 'active'){
                _el.className = "contentView withPicker withFooter bo-scroller cached " + appDown;
                return false;
            }else{
                _el.className = "contentView withPicker withFooter bo-scroller active " + appDown;
            }
            return true;
        },
        componentDidUpdate: function(){
            if(this.props.active == "active"){
                this.BOScroll.refresh();
                if (!this.props.detail_open) {
                    Share.setShare('实时票房榜-微票儿票房分析，透过数据看电影');
                }
            }
        },
        fetchData: function(_params){
            var self = this;

            if(!_params){
                _params = params;
            }

            DataCenter.BOModel.getData(_params, function(res){
                console.log('BOModel is ready:');
                console.log(res);

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
            this.BOScroll = new IScroll('.bo-scroller', {
                mouseWheel: true,
                bindToWrapper: true,
                probeType: 3,
                preventDefault:  Util.iScrollClick(),
                tap: Util.iScrollClick(),
                click: Util.iScrollClick()
            });

            var pullRefresh = new PullRefresh.refresh({
                scroll: this.BOScroll,
                model: DataCenter.BOModel,
                params: params,
                callback: function(res){
                    // re-render
                    self.setState({
                        model: res
                    })
                }
            });
            window.app_iScrolls[0] = this.BOScroll;

        },
        //选择城市回调
        selectDateChange: function(_date){
            console.log(_date);
            //修改切换“后一天”的Bug
            var _days = Util.restrictSwitchToDate(Util.getTodayStr(), _date);
            this.refs.SwitchToDate.setState({days: _days});

            params.movieFilter.scheduleDate = _date + " 00:00:00";
            this.fetchData(params);
        },
        //Toast
        handlebarClickToast: function(event){
            /*toast
                @txt 必填 为提示语
                @delay 可选 为toast时间
            */
            Util.toast(toastTxt, 5e3);
        },
        //设置选择时间和当前时间显示逻辑
        setSwitchToDateMathod: function(_nowDate, _selectDate){
            let _days = Util.restrictSwitchToDate(_nowDate, _selectDate),
                accurateNationalBoxOffice = '', _getDay = '',
                language = this.state.language.boxoffice,
                units = language.units;

            if(this.state.model && this.state.model.accurateNationalBoxOffice){
                if(this.state.language.type == 'cn'){
                    var num = parseInt(this.state.model.accurateNationalBoxOffice);
                    var hundredMillionObj = Util.getHundredMillion(num / 10000, language.units);
                    accurateNationalBoxOffice = hundredMillionObj.num;
                    units = hundredMillionObj.units;
                    // accurateNationalBoxOffice = (num / 10000).toFixed(1);
                    _getDay = Util.getChineseDateStrWithDay(_selectDate);
                }else{
                    accurateNationalBoxOffice = this.state.model.nationalBoxOfficeEnglish.replace('M', '');
                    _getDay = Util.getEnglishDateStrWithDay(_selectDate);
                }

            }

            var dataTime = this.state.model && this.state.model.dataUpdateLog && this.state.model.dataUpdateLog.dataTime ? this.state.model.dataUpdateLog.dataTime : '';
            var _infos;

            if(_days < 0){
                _infos = (
                            <div className="today-board fadeIn">
                                <div className="board-light "></div>
                                <h2>
                                    {String.format(language.banner.tr1_field, _getDay)} <strong className="s-num">{accurateNationalBoxOffice}</strong>
                                    {units}
                                </h2>
                                <p>{language.banner.info1}</p>
                            </div>
                         );
            /**/
            }else if(_days === 0){
                toastTxt = language.toast1;
                delay = 5e3;
                _infos = (
                            <div className="today-board fadeIn">
                                <div className="board-light"></div>
                                <h2>
                                    {language.banner.tr2_field} <strong className="s-num">{accurateNationalBoxOffice}</strong>
                                    {units}
                                </h2>
                                <p>{String.format(language.banner.info2, dataTime)}
                                    <i className="ico-point" onClick={this.handlebarClickToast}>!</i>
                                </p>
                            </div>
                         );
            }else if(_days >= 1){
                toastTxt = language.toast2;
                delay = 5e3;
                var txt = (
                    <h2>
                        {String.format(language.banner.tr3_field, _getDay)} <strong className="s-num">{accurateNationalBoxOffice}</strong> 万
                    </h2>
                )
                if(accurateNationalBoxOffice === ''){
                    txt = (
                        <h2>
                            {String.format(language.banner.tr4_field, _getDay)} <strong className="s-num"></strong>
                        </h2>
                    )
                }
                _infos = (
                            <div className="today-board fadeIn">
                                <div className="board-light"></div>
                                {txt}
                                <p>{String.format(language.banner.info2, dataTime)}
                                    <i className="ico-point" onClick={this.handlebarClickToast}>!</i>
                                </p>
                            </div>
                         );
            }
            return {
                days: _days,
                infos: _infos
            };
        },

        onClickBanner: function(evt){
            var _el = evt.target;
            if(_el.className == 'close'){
                this.setState({
                    banner_hide: true
                })
                localStorage.setItem('banner-date', Util.getTodayStr());
                ga('send', 'event', '下载广告条', 'click', '关闭广告条' , 1);
            }else if(_el.className == 'btn'){
                ga('send', 'event', '下载广告条', 'click', '进入下载页' , 1);
                location.href = '/download'
            }
        },

        getBannerStatus: function(){
            let bannerDate = localStorage.getItem('banner-date'),
                isBanner = Util.isEqualDays(bannerDate, new Date()),
                _afterData = location.href.split('?')[1],
                isApp    = null,
                apps = Util.compareVersion(),
                from = Util.getSearchValue('from'),
                isWepiaoapp = false;
            //wepiao app 隐藏下载页
            if(from){
                if(from.toLocaleLowerCase() == 'wepiaoapp'){
                    isWepiaoapp = true;
                }
            }
            if(_afterData){
                isApp = Math.round(_afterData.split('#')[0]);
            }
            if(isBanner || isApp || apps.isApp || isWepiaoapp){

                return true;
            }else{

                return false;
            }
        },

        setPiaoFang: function(){
            //ga("set", "/boxoffice", "实时票房榜");
            // ga('send', 'pageview', '/boxoffice');
            ga('send', 'pageview', {
                'page': '/boxoffice',
                'title': '实时票房榜'
            });
            //Hawkeye - Wepiao FE Analytics Solution
            he && he('send', 'pageview', 'boxoffice');
        }

    })

    return BoxOffice;
 })
