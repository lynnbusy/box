/**
 *  App.jsx
 *  入口文件，处理依赖与顶层组件
 *
 */

require.config({
    paths: {
        React : "lib/react-with-addons",
        FastClick: "lib/fastclick.min",
        Chart: "lib/Chart",
        IScroll: "lib/iscroll",
        Router: "lib/director",
        DatePicker: "lib/react-date-picker.min",
        WX: "lib/wx",
        WxBridge: "lib/wxbridge"
    },
    shim: {
        'IScroll': {
            exports: "IScroll"
        },
        'Router': {
            exports: "Router"
        }
    },
    packages: [
        {
            name: "ReactChart",
            location: "lib/react-chart",
            main: "index"
        }
    ]
})


require([
    'React',
    'navBar',
    'tabBar',
    'comingMovie',
    'boxOffice',
    'schedule',
    'cinema',
    'rank',
    'movieDetail',
    'datacenter',
    'FastClick',
    'cinemaDetail',
    'feedbackPage',
    'appShare',
    'Search',
    'util',
    'language',
    'mine',
    'adPage'
], function(
    React,
    NavBar,
    TabBar,
    ComingMovie,
    BoxOffice,
    Schedule,
    Cinema,
    Rank,
    MovieDetail,
    DataCenter,
    FastClick,
    CinemaDetail,
    FeedbackPage,
    AppShare,
    Search,
    Util,
    Language,
    Mine,
    AdPage
) {
    'use strict';

    //腾讯影咖
    var _from = Util.getSearchValue('from');
    if(_from == 'yingka'){
        var app_el = document.getElementById('app');
        app_el.className = 'share_img';
    }

    // 支持触摸事件
    //React.initializeTouchEvents(true);
    // FastClick iOS need
    FastClick.attach(document.body);
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    window.app_iScrolls = [];
    window.shareinfo = {
        title: '实时票房榜-微票儿票房分析，透过数据看电影',
        desc: 'http://piaofang.wepiao.com/#/boxoffice',
        url:  'http://piaofang.wepiao.com/#/boxoffice',
        height: 970
    }

    let localLanguage = localStorage.getItem('language'),
        _language = '';
    // alert(localLanguage)

    // Forced English for Lynn's Box skin version
    _language = Language.en;
    window._language = _language;
    
    // if(localLanguage){
    //     _language = (localLanguage == 'cn') ? Language.cn : Language.en;
    //     window._language = _language;
    // }else{
    //     _language = navigator.language.toLowerCase() == 'zh-cn' ? Language.cn : Language.en;
    //     window._language = _language;
    // }



    //开屏提示中英文
    // _language.skip = _language.type == 'en' ? 'skip' : '跳过';
    /*
        处理刷404页中英切换
    */
    // _language = Language.en;
    if(_language.type == 'en'){
        let nodeatIcon = document.getElementById('nodeatIcon'),
            btn = document.getElementById('nodataRefresh');
        nodeatIcon.className = 'no-data-icon-en';
        btn.innerHTML = 'Refresh';
    }

    //首页埋点
    Util.setPiaoFang();

    /**
     * @class Gandalf
     * The App
     */
    var Gandalf = React.createClass({
        render: function() {
            var _current = this.state.currentTabView,
                pullRefreshTop = this.state.pullRefreshTop + 'px';

            return (
                <div className={this.state.standalone?"standalone":""}>
                    <div className="mui-pull-top-pocket mui-block mui-visibility" style={{'top': pullRefreshTop}}>
                        <div className="mui-pull">
                            <div className="mui-pull-loading mui-icon icon-up2">
                            </div>
                            <div className="mui-pull-caption"></div>
                        </div>
                    </div>
                    <BoxOffice
                        active={_current==0?"active":"cached"} ref={"BoxOffice"}
                        onMovieItemClick={this.onMovieItemClick}
                        detail_open={this.state.detail_open}
                        maxDays={15}
                        callbackSearch={this.callbackSearch}
                        language={this.state.language}
                        completeBanCallback={this.completeBanCallback} />
                    <Schedule
                        active={_current==1?"active":"cached"} ref={"Schedule"}
                        onMovieItemClick={this.onMovieItemClick}
                        detail_open={this.state.detail_open}
                        maxDays={15}
                        callbackSearch={this.callbackSearch}
                        language={this.state.language} />
                    <Cinema
                        active={_current==2?"active":"cached"} ref={"Cinema"}
                        onCinemaItemClick={this.onCinemaItemClick}
                        cinema_open={this.state.cinema_open}
                        callbackSearch={this.callbackSearch}
                        language={this.state.language} />
                    <Rank
                        active={_current==3?"active":"cached"} ref={"Rank"}
                        onCinemaItemClick={this.onCinemaItemClick}
                        onMovieItemClick={this.onMovieItemClick}
                        detail_open={this.state.detail_open}
                        callbackSearch={this.callbackSearch}
                        pullRefreshCallBack = {this.pullRefreshCallBack}
                        language={this.state.language} />
                    <TabBar
                        current={this.state.currentTabView}
                        onTabClick={this.onTabClick}
                        callbackSeting={this.callbackSeting}
                        language={this.state.language} />
                    <MovieDetail
                        open={this.state.detail_open}
                        movieName={this.state.detail_movieName}
                        movieId={this.state.detail_movieId}
                        currentSegment={this.state.currentTabView}
                        backCallback={this.onBackBtnClick}
                        maxDays={15}
                        language={this.state.language} />
                    <CinemaDetail
                        open={this.state.cinema_open}
                        cinemaName={this.state.cinema_name}
                        cinemaId={this.state.cinema_id}
                        backCallback={this.onBackBtnClick}
                        maxDays={-1}
                        language={this.state.language} />
                    <Search
                        open={this.state.search_open}
                        backCallback={this.callbackSearch}
                        onItemClick={this.onMovieItemClick}
                        onCinemaItemClick={this.onCinemaItemClick}
                        language={this.state.language} />
                    <FeedbackPage
                        open={this.state.feedback_open} ref={"FeedbackPage"}
                        backCallback={this.onBackBtnClick}
                        language={this.state.language} />
                    <AppShare />
                    <Mine
                        open={this.state.mine_open} ref={"Mine"}
                        backCallback={this.onBackBtnClick}
                        language={this.state.language} />
                    <AdPage
                        open={this.state.targeturlpage_open}
                        targeturlPageIndex={this.state.targeturlPageIndex}
                        backCallback={this.onBackBtnClick} />
                </div>
            )
        },
        getInitialState: function(){
            return {
                currentTabView: 0,
                standalone: false,
                detail_open: false,
                detail_movieId: 0,
                detail_movieName: '影片详情',
                cinema_open: false,
                cinema_id: 0,
                cinema_name: '影院详情',
                feedback_open: false,
                search_open: false,
                mine_open: false,
                targeturlpage_open: false,
                targeturlPageIndex: null,
                pullRefreshTop: 138,
                //中/英文切换
                language: _language
            }
        },
        componentDidMount: function(){
            this.initRouter();
            this.isStandAlone();
            //下拉loading top值
            this.getBannerStatus();

            //开屏
            // console.log('new open show');
            // if (!localStorage.getItem('isShowOpen')) {
            //     document.getElementById('sN').innerHTML = _language.skip;
            //     document.getElementById('openShow').className = 'opening';
            //     var sC = 3;
            //     var closeTimeout = setInterval(function(){
            //         if(sC != 0){
            //             document.getElementById('sC').innerHTML = sC--;
            //         }else{
            //             localStorage.setItem('isShowOpen', '1');
            //             clearInterval(closeTimeout);
            //             document.getElementById('openShow').className += ' m-hide';
            //         }
            //     }, 1000);

            //     document.getElementById('closeShow').onclick = function(e){
            //         localStorage.setItem('isShowOpen', '1');
            //         clearInterval(closeTimeout);
            //         document.getElementById('openShow').className += ' m-hide';
            //     }
            // }
        },
        initRouter: function(){
            // Router
            var self = this;
            this.router = new Router({
                '/': this.closeDetailsAndBackTo.bind(this, 0),
                '/boxoffice': this.closeDetailsAndBackTo.bind(this, 0),
                '/schedule': this.closeDetailsAndBackTo.bind(this, 1),
                '/cinema': this.closeDetailsAndBackTo.bind(this, 2),
                '/rank': this.closeDetailsAndBackTo.bind(this, 3),
                '/mine': {
                    on: function(){
                        //设置ga / he
                        self.refs.Mine.setPiaoFang();

                        self.setState({
                            mine_open: true,
                            feedback_open: false,
                            targeturlpage_open: false
                        })
                    }
                },
                '/feedback': {
                    on: function(){
                        //设置ga / he
                        self.refs.FeedbackPage.setPiaoFang();

                        self.setState({
                            feedback_open: true,
                            targeturlpage_open: false
                        })
                    }
                },
                '/movie-detail': {
                    '/:id': {
                        '/:name': {
                            on: function(id, name){
                                self.setState({
                                    detail_movieId: id,
                                    detail_movieName: decodeURIComponent(name),
                                    detail_open: true,
                                    feedback_open: false,
                                    search_open: false,
                                    targeturlpage_open: false
                                })
                                // app分享
                                window.shareinfo = {
                                    page: name + '-影院分享',
                                    title: '《'+ decodeURIComponent(name) + '》票房排片趋势-微票儿票房分析',
                                    desc: location.href,
                                    url:  location.href
                                }
                                if(self.state.currentTabView === 0){
                                    window.shareinfo.height = 400;
                                    ga('send', 'pageview', {
                                        'page': '/movie-detail-office',
                                        'title': '电影详情—票房'
                                    });

                                    //Hawkeye - Wepiao FE Analytics Solution
                                    he && he('send', 'pageview', 'movie-detail-boxoffice');
                                }else{
                                    window.shareinfo.height = 875;
                                    ga('send', 'pageview', {
                                        'page': '/movie-detail-schedule',
                                        'title': '电影详情—排片'
                                    });
                                    //Hawkeye - Wepiao FE Analytics Solution
                                    he && he('send', 'pageview', 'movie-detail-schedule');
                                }
                                self.getPageHeight('_movieboxoffice');
                                //下拉loading top值
                                self.setState({ pullRefreshTop: 138 });
                            }
                        }
                    }
                },
                '/cinema-detail': {
                    '/:id': {
                        '/:name': {
                            on: function(id, name){
                                self.setState({
                                    cinema_id: id,
                                    cinema_name: decodeURIComponent(name),
                                    cinema_open: true,
                                    feedback_open: false,
                                    search_open: false,
                                    targeturlpage_open: false
                                })
                                // app分享
                                window.shareinfo = {
                                    page: name + '-影院分享',
                                    title: ''+decodeURIComponent(name) + ': 排片、观影人次分析-微票儿票房分析',
                                    desc: location.href,
                                    url:  location.href,
                                    height: 400
                                }
                                self.getPageHeight('cinema-detail');
                                ga('send', 'pageview', {
                                    'page': '/cinema-detail',
                                    'title': '影院详情'
                                });

                                //Hawkeye - Wepiao FE Analytics Solution
                                he && he('send', 'pageview', 'cinema-detail');
                            }
                        }
                    }
                },
                '/targeturl-page': {
                    '/:index':{
                        on: function(index){
                            self.setState({
                                targeturlPageIndex: index,
                                targeturlpage_open: true
                            })
                        }
                    }
                }
            }).configure({
                // need server-side router config. otherwise cannot GET
                html5history: false
            }).init();//优化第一次打开页面无响应的问
        },
        isStandAlone: function(){
            let _isIPhone = navigator.userAgent.indexOf('iPhone') != -1;
            let _isStandalone = window.navigator.standalone == true;
            let _isBrowser = document.URL.match(/^https?:/);
            let _parentStandalone = () => document.getElementById('app').className="standalone";

            if(!_isBrowser){
                this.setState({
                    standalone: true
                })
                _parentStandalone();
                return;
            }
            if( _isIPhone && _isStandalone  ){
                this.setState({
                    standalone: true
                })
                _parentStandalone();
            }
        },
        onTabClick: function(_index){
            var _tabMap = {
                '0': '#/boxoffice',
                '1': '#/schedule',
                '2': '#/cinema',
                '3': '#/rank'
            }
            // 修改Android下切换响应慢的问题
            location.href = _tabMap[_index];
            if(_index === 3){
                localStorage.setItem('new_rank', 'true');
            }
        },
        // close all detail-pages and back to
        closeDetailsAndBackTo: function(tabIndex){
            this.setState({
                currentTabView: tabIndex,
                detail_open: false,
                cinema_open: false,
                feedback_open: false,
                search_open: false,
                mine_open: false,
                targeturlpage_open: false
            });

            if(tabIndex === 0){
                //设置ga / he
                this.refs.BoxOffice && this.refs.BoxOffice.setPiaoFang();
                // app分享
                window.shareinfo = {
                    page: '票房-分享',
                    title: '实时票房榜-微票儿票房分析，透过数据看电影',
                    desc: 'http://piaofang.wepiao.com/#/boxoffice',
                    url:  'http://piaofang.wepiao.com/#/boxoffice',
                    height: 970
                }
                //下拉loading top值
                this.getBannerStatus();
            }else if(tabIndex === 1){
                //设置ga / he
                this.refs.Schedule && this.refs.Schedule.setPiaoFang();
                // app分享
                window.shareinfo = {
                    page: '排片-分享',
                    title: '排片榜-微票儿票房分析，透过数据看电影',
                    desc: 'http://piaofang.wepiao.com/#/schedule',
                    url:  'http://piaofang.wepiao.com/#/schedule',
                    height: 780
                }
                //下拉loading top值
                this.setState({ pullRefreshTop: 80 });
            }else if(tabIndex === 2){
                //设置ga / he
                this.refs.Cinema && this.refs.Cinema.setPiaoFang();
                // app分享
                window.shareinfo = {
                    page: '影院-分享',
                    title: '热门影院排行-微票儿票房分析，透过数据看电影',
                    desc: 'http://piaofang.wepiao.com/#/cinema',
                    url:  'http://piaofang.wepiao.com/#/cinema',
                    height: 930
                }
                //下拉loading top值
                this.setState({ pullRefreshTop: 80 });
            }else if(tabIndex === 3){
                //设置ga / he
                this.refs.Rank && this.refs.Rank.setPiaoFang();
                // app分享
                window.shareinfo = {
                    page: '排行-分享',
                    title: '微信电影指数排行榜—微票儿票房分析，透过数据看电影',
                    desc: '',
                    url:    'http://piaofang.wepiao.com/#/rank',
                    height: 675
                }
                //下拉loading top值
                this.setState({ pullRefreshTop: 120 });
            }
        },
        // pass through funciton
        onBackBtnClick: function(page){
            // manually judge the hashchange.

            let oldURL = location.href;
            setTimeout(()=>{
                let newURL = location.href;
                if(oldURL === newURL){
                    console.log("hey you must on the history stack bottom, let me send you to the home.");
                    //this.router.setRoute("/boxoffice")
                    // 修改Android下切换响应慢的问题
                    location.href = '#/boxoffice';
                }
                if(location.hash === ''){
                    location.hash = '/boxoffice';
                }

                // adpage mathod
                if(page == 'adpage'){
                    let _system = Util.compareSystem();
                    if(_system === 'Android'){
                        location.reload();
                    }
                }
            },100)

            window.history.back(1);

        },
        onMovieItemClick: function(id, name){
            // location.hash =
            //     '/movie-detail/'+ id +
            //     '/' + encodeURIComponent(name);
            //this.router.setRoute('/movie-detail/'+ id + '/' + encodeURIComponent(name))
            // 修改Android下切换响应慢的问题
            name = name.replace("'", " ");
            location.href = '#/movie-detail/'+ id + '/' + encodeURIComponent(name);
        },
        onCinemaItemClick: function(id, name){
            // location.hash =
            //     '/cinema-detail/'+ id +
            //     '/' + encodeURIComponent(name);
            //this.router.setRoute('/cinema-detail/'+ id + '/' + encodeURIComponent(name))
            // 修改Android下切换响应慢的问题
            name = name.replace("'", " ");
            location.href = '#/cinema-detail/'+ id + '/' + encodeURIComponent(name);
        },

        getPageHeight: function(_className){
            setTimeout(function(){
                if(_className === '_movieboxoffice'){
                    var _el = document.getElementsByClassName(_className)[0];
                    var _ul = _el.getElementsByClassName('border-1px')[0];
                    var _lis = _ul.childNodes;
                    var _len = _lis.length;
                    var con = _len - 1;
                    if(con > 10){
                        con = 10;
                    }
                    window.shareinfo.height = 435 + 40 * con;
                }else if(_className === 'cinema-detail'){

                    var _el = document.getElementsByClassName(_className)[0];
                    var _ul = _el.getElementsByClassName('scroller')[0];
                    var _lis = _ul.childNodes;
                    var _len = _lis.length;
                    var con = _len - 1;
                    if(con > 5){
                        con = 5;
                    }
                    window.shareinfo.height = 180 + 81 * con;
                }
            }, 1000)
        },

        //搜索
        callbackSearch: function(bool){
            if(bool) ga('send', 'event', '搜索', 'click', '搜索', 1);

            this.setState({
                search_open: bool
            })
            // alert(this.state.search_open)
        },

        //通用设置
        callbackSeting: function(bool){
            if(bool) ga('send', 'event', '通用设置', 'click', '通用设置', 1);

            this.setState({
                mine_open: bool
            })
        },

        getBannerStatus: function(){
            var _value = this.isAds ? 148 : 80;
            this.setState({ pullRefreshTop: _value });
        },

        pullRefreshCallBack: function(_value){
            this.setState({ pullRefreshTop: _value });
        },

        // 广告banner 下载回调
        completeBanCallback: function(){
            this.isAds = true;
            this.setState({ pullRefreshTop: 148 });
        }
    });

    var App = React.createClass({
      render () {
        var Child;
        switch (this.props.route) {
          case 'comingmovie': Child = ComingMovie; break;
          case '': Child = Gandalf; break;
          default: Child = Gandalf;
        }
        return (
            <Child language={_language}/>
        )
      }
    });


    function render () {
        var route = window.location.hash.substr(2);
        React.render(
            <App route={route} />,
            document.getElementById('app')
        );
    }

    window.addEventListener('hashchange', render);
    render();

});
