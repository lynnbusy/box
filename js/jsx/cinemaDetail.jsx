/**
 *  Cinema Detail.jsx
 *  影院详情
 *
 *  @props  {Bool}      open            是否开启
 *  @props  {Number}    cinemaId        影院 ID
 *  @props  {String}    cinemaName      影院名
 *  @props  {Function}  backCallback    返回回调
 *  @return {Component} CinemaDetail
 */

define([
    'React',
    'navBar',
    'segmented',
    'movieSchedule',
    'movieBoxOffice',
    'util',
    'datacenter',
    'SelectCity',
    'SelectDate',
    'TimeZone',
    'SwitchToDate',
    'feedbackBlock',
    'share'
], function(
    React,
    NavBar,
    Segmented,
    MovieSchedule,
    MovieBoxOffice,
    Util,
    DataCenter,
    SelectCity,
    SelectDate,
    TimeZone,
    SwitchToDate,
    FeedbackBlock,
    Share
) {
    'use strict'
    var style = {
        height: document.body.offsetHeight - 166 + 'px'
    }
    // 时段 data
    var timeZoneArr = ['全时段', '黄金时段', '非黄金时段'];
     //获取前天日期
    var prevDay = Util.prevDay( Util.getTodayStr() );
    //传递接口数据
    var params = {
        "paging": {
            "page": 1,
            "pageSize":10  // 无限
        },
        "movieFilter": {
            "scheduleDate": prevDay + " 00:00:00",
            "periodType": "0"
        }
    }

    // Component
    var CinemaDetail = React.createClass({
        render: function(){
            var _handleClick = this.handleClick;
            var _isOpen = (this.props.open) ? "open" : "";
            var _title = this.props.cinemaName;
            var model = this.state.model;
            var cinemaBoxOffice = "";
            var movieList = "";
            var language = this.props.language.cinemaDetail;
            if(this.props.open){
                Share.setShare(''+this.props.cinemaName + ': 排片、观影人次分析-微票儿票房分析');
            }
            
            if(model){
                if(model.cinemaBoxOffice){
                    var ciboxoff = model.cinemaBoxOffice;
                    cinemaBoxOffice = (
                        <div className="total-info">
                            <span>
                                <i className="icon-movie"></i>
                                <h4>{ciboxoff.movies}</h4>
                                <p>{language.menutitle[0]}</p>
                            </span>
                            <span>
                                <i className="icon-session"></i>
                                <h4>{ciboxoff.productShowTimes}</h4>
                                <p>{language.menutitle[1]}</p>
                            </span>
                            <span>
                                <i className="icon-persontime"></i>
                                <h4>{ciboxoff.productTickets}</h4>
                                <p>{language.menutitle[2]}</p>
                            </span>
                            <span>
                                <i className="icon-seat"></i>
                                <h4>{ciboxoff.productAvgPerson}</h4>
                                <p>{language.menutitle[3]}</p>
                            </span>
                        </div>
                    )
                    /**/
                }else{
                    let _style = {
                        lineHeight: '85px',
                        backgroundColor: 'rgb(247,248,248)'
                    }
                    cinemaBoxOffice = (
                        <div className = "feedback" style={_style}> {language.nodata} </div>
                    )
                }
                /**/
                if(model.cinemaMovieSchedules){
                    movieList = model.cinemaMovieSchedules.map((movie, k) => {
                        var _halls = movie.cinemaScheduleDetailHalls.map((hall, l) => {
                            var _details = [];
                            let stack = [];
                            let ds = hall.cinemaScheduleDetails;
                            for (var i = 0; i < ds.length; i++) {
                                stack.push(<mark>{ds[i].scheduleTime}</mark>);
                                if(stack.length === 4 || i === ds.length - 1){
                                    _details.push(<div>{stack}</div>)
                                    stack = [];
                                }
                            }
                            /**/
                            return (
                                <li key={'li'+l}>
                                    <div className="room-number">
                                        {hallRoomMethod(this.props.language, hall.hallTypeName)}
                                        {hallTypeName(this.props.language, hall.hallTypeName)}
                                    </div>
                                    <div className="play-time">
                                        <section>
                                            {_details}
                                        </section>
                                    </div>
                                </li>
                            )
                        });

                        // Too many problems in DOM Structure
                        return (
                            <li key={k}>
                                <div className="cinema-item"
                                     onClick={_handleClick}
                                >
                                    <div className="img-wrap">
                                        <img src={movie.pictureUrl} />
                                    </div>
                                    <div className="movie-data">
                                        <h3>
                                            <span style={{"fontSize": "1.5rem"}}>
                                                {movie[language.item.movieName]}
                                            </span>
                                            <small>({language.item.release}{movie.showDays}{language.item.days})</small>
                                        </h3>
                                        <div>
                                            <span className="arr-down">
                                                {movie.productShowTimes}<small>{language.item.th1}</small>
                                            </span>
                                            <span>
                                                {movie.productScheduleRate}%<small>{language.item.th2}</small>
                                            </span>

                                        </div>
                                    </div>
                                </div>
                                <div className="session-item arr-grey-up m-hide">
                                    <ul  className="clearfix">
                                        {_halls}
                                    </ul>
                                </div>
                            </li>
                        )
                    })
                }
            }
            /**/
            return (
                <div className={"movie-detail _cinema "+_isOpen} >
                    <NavBar
                        title={this.props.cinemaName}
                        leftNav=" "
                        rightLogo
                        backCallback={this.props.backCallback}
                    />
                    <SwitchToDate
                        date = {prevDay}
                        maxDays = {this.props.maxDays}
                        days = {Util.restrictSwitchToDate(Util.getTodayStr(), prevDay)}
                        selectDateChange = {this.selectDateCallback}
                    />
                    <div className="cinema-detail-scroller">
                        <p className="announcement css-1px"><i className="icon-sound"></i>{language.toast}</p>
                        <div className="cinema-detail">
                            {cinemaBoxOffice}
                            <div className="contentView withPicker cinema-detail-scr" style={style}>
                                <ul className="scroller">
                                    {movieList}
                                    <FeedbackBlock />
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        /**/
        getInitialState: function(){
            return {
                cinemaId: 0,
                model: null
            }
        },
        getDefaultProps: function(){
            return {
                movieName: "影院详情"
            }
        },
        componentDidMount: function(){
            this.initIScroll();
        },
        shouldComponentUpdate: function(nextProps, nextState) {
            var _isOpen = nextProps.open;
            var _el = document.getElementsByClassName('_cinema')[0];
            if(!_isOpen){
                _el.className = "movie-detail _cinema";
                return false;
            }else{
                _el.className = "movie-detail _cinema open";
            }
            return this.props.open;
        },
        componentWillReceiveProps: function(nextProps){
            var old = this.props.cinemaId
            var next = nextProps.cinemaId
            if(next && next !== old){
                params.movieFilter.cinemaId = next;
                this.fetchData(params);
            }
            if(nextProps.open){
                Share.setShare(''+this.props.cinemaName + ': 排片、观影人次分析-微票儿票房分析');
                //ga("set", "/cinema-detail", "影院详情");
                // ga('send', 'pageview', '/cinema-detail');
                
            }

            
        },
        componentDidUpdate: function(prevProps, prevState){
            if(this.props.open){
                this.cinemaDScroll.refresh();
            }
        },
        fetchData: function(_params){
            if(!_params){
                _params = params;
            }
            var self = this;

            DataCenter.MDCIModel.getData(_params, function(res){
                console.log('MDCIModel is ready:');
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
            //init IScroll
            this.cinemaDScroll = new IScroll('.cinema-detail-scr', {
                mouseWheel: true,
                bindToWrapper: true,
                preventDefault:  Util.iScrollClick(),
                tap: Util.iScrollClick(),
                click: Util.iScrollClick(),
            });
            window.app_iScrolls[6] = this.cinemaDScroll;
        },
        // handle click of cinema list
        handleClick: function(event) {
            var evt_el = event.currentTarget;
            var el = evt_el.nextElementSibling;
            if(el){
                var klass = el.className;
                if(klass.indexOf('m-hide') >= 0){
                    el.className = 'session-item arr-grey-up';

                    he && he('send', 'event', 'cinema-detail', 'click', 'movietime', 1);
                }else{
                    el.className = 'session-item arr-grey-up m-hide';
                }
                this.cinemaDScroll.refresh();
                //scheduledetail
                
            }
        },
        //选择时间回调
        selectDateCallback: function(_date){
            console.log(_date);
            //alert(_date);
            params.movieFilter.scheduleDate = _date + " 00:00:00";
            this.fetchData(params);
        }
        
    })
    // 影片详情大厅·小厅处理
    function hallRoomMethod (language, _name){
        var language = language.cinemaDetail;
        if(_name == "大厅"){
            return language.maxRoom;
        }
        if(_name == "小厅"){
            return language.minRoom;
        }

    }
    function hallTypeName(language, _name){
        var name = '';
        var language = language.cinemaDetail;
        if(_name == "大厅" || _name == "小厅"){
            if(_name === "大厅"){
                name = '(≥80'+ language.seat +')';
            }else if(_name === "小厅"){
                name = '(<80'+ language.seat +')'
            }
            return (
                React.createElement(
                    'span',
                    { className: 'hall-type-name' },
                    name
                )
            )
        }
    }
        

    return CinemaDetail;
 })
