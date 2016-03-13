/**
 *  Movie Detail.jsx
 *  电影详情 —— 包含 排片/票房
 *
 *  @props  {Bool}      open            是否开启
 *  @props  {Number}    movieId         电影 ID
 *  @props  {String}    movieName       电影名
 *  @props  {Number}    currentSegment  当前段落
 *  @props  {Function}  backCallback    返回回调
 *  @return {Component} MovieDetail
 */

define([
    'React',
    'navBar',
    'segmented',
    'movieSchedule',
    'movieBoxOffice',
    'MovieData',
    'util',
    'datacenter',
    'IScroll',
], function(
    React,
    NavBar,
    Segmented,
    MovieSchedule,
    MovieBoxOffice,
    MovieData,
    Util,
    DataCenter,
    IScroll
) {
    'use strict'
    window.React = React;
    // Component
    var MovieDetail = React.createClass({
        render: function(){
            var _isOpen = (this.props.open) ? "open" : "",
                _title = this.props.movieName,
                _current = this.state.currentSegment,
                movie = '',
                language = this.props.language.movieDetail,
                isCN = this.props.language.type == 'cn' ? true : false,
                _movieData = '',
                _segmented = (
                    <Segmented
                        current = {_current}
                        th1 = {language.menutitle[0]}
                        th2 = {language.menutitle[1]}
                        onChange = {this.onSegmentedChange} />
                );

            //
            if(this.state.movie){
                var _movie = this.state.movie,
                    scoreEl = '',
                    movieHotEl = '',
                    // starrings = _movie[language.movie.starring].split('/'),
                    // starring = _movie[language.movie.director] +
                    //            (starrings[0] ? ' / ' + starrings[0] : '') +
                    //            (starrings[1] ? ' / ' + starrings[1] : ''),

                    releaseDate = Util.getDateStr(new Date(_movie.releaseDate));
                var _days = Util.restrictSwitchToDate(Util.getTodayStr(), releaseDate);
                if(_days > 0){
                    if(_movie.wantCount > 0){
                        scoreEl = <div><i className="ico-popcorn"></i>{Util.getFormattedNum(_movie.wantCount)}<small>{language.movie.reviewitem[2]}</small></div>;
                    }
                }else{
                    if(_movie.score > 0){
                        scoreEl = <div><i className="ico-popcorn"></i>{_movie.score}%<small>{language.movie.reviewitem[0]}</small></div>;
                    }
                }
                if(_movie.movieHot > 0){
                    movieHotEl = <div><i className="ico-wechat"></i>{Util.getFormattedNum(_movie.movieHot)}<small>{language.movie.reviewitem[1]}</small></div>
                }
                //
                movie = (
                    <div className="movie-detail-wrapper">
                        <div className="movie-details">
                            <img src={_movie.pictureUrl} />
                            <div className="mov-info">
                                <div className="mov-data">
                                    {scoreEl}
                                    {movieHotEl}
                                </div>
                                <p>{_movie[language.movie.country]}</p>
                                <p>{_movie[language.movie.productReleaseDate]}, {_movie[language.movie.duration]}</p>
                                <p>{_movie.version}</p>
                            </div>
                        </div>
                    </div>
                )

                if(isCN){
                    _movieData = (
                        <MovieData
                            active = {_current==2}
                            open = {this.props.open}
                            movie = {this.state.movie}
                            movieScrollRefresh = {this.movieScrollRefresh}
                            movieId = {this.props.movieId}
                        />
                    )
                        
                    _segmented = (
                        <Segmented
                            current = {_current}
                            th1 = {language.menutitle[0]}
                            th2 = {language.menutitle[1]}
                            th3 = {language.menutitle[2]}
                            onChange = {this.onSegmentedChange} />
                    )
                }
            }
            /**/
            return (
                <div className={"movie-detail _movie "+_isOpen} >
                    <NavBar
                        title={this.props.movieName}
                        leftNav=" "
                        rightLogo
                        backCallback={this.props.backCallback} />
                    <div className="movie-detail-container">
                        <div className="movie-scroller">
                            { movie }
                            {_segmented}
                            <MovieSchedule
                                active = {_current==1}
                                open = {this.props.open}
                                movieId = {this.props.movieId}
                                maxDays = {this.props.maxDays}
                                movieName = {_title}
                                movieCallBack = {this.movieCallBack}
                                movieScrollRefresh = {this.movieScrollRefresh}
                                showDailogCallback= {this.showDailogCallback}
                                scrollBarToZeroCallback = {this.scrollBarToZeroCallback}
                                language = {language.schedule}
                                isCN = {isCN} />
                            <MovieBoxOffice
                                active = {_current==0}
                                open = {this.props.open}
                                movieId = {this.props.movieId}
                                movieName = {_title}
                                movieCallBack = {this.movieCallBack}
                                movieScrollRefresh = {this.movieScrollRefresh}
                                language = {language.boxoffice}
                                isCN = {isCN} />
                            {_movieData}
                        </div>
                    </div>
                </div>
            )
        },
        /**/
        getInitialState: function(){
            return {
                movieId: 0,
                currentSegment: 1,
                movie: null,
                days: 0
            }
        },
        getDefaultProps: function(){
            return {
                movieName: "影片详情"
            }
        },
        shouldComponentUpdate: function(nextProps, nextState) {
            var _isOpen = nextProps.open;
            var _el = document.getElementsByClassName('_movie')[0];
            if(!_isOpen){
                _el.className = "movie-detail _movie";
                return false;
            }else{
                _el.className = "movie-detail _movie open";
            }
            return true;
            //return nextProps.open;
        },
        componentDidMount: function(){
            this.initIScroll();
        },
        componentWillReceiveProps: function(nextProps){
            if(nextProps.currentSegment !== "undefined"){
                var currentSegment = nextProps.currentSegment >= 2 ? 0 : nextProps.currentSegment;
                this.setState({
                    currentSegment: currentSegment
                })
            }
        },

        initIScroll: function(){
            var _container = document.getElementsByClassName('movie-detail-container')[0];
            _container.style.height = document.body.clientHeight - 44 + 'px';

            this.movieScroll = new IScroll('.movie-detail-container', {
                mouseWheel: true,
                bindToWrapper: true,
                preventDefault:  Util.iScrollClick(),
                tap: Util.iScrollClick(),
                click: Util.iScrollClick(),
            });
            this.movieScroll.on("scroll", this.doSomething);
        },

        movieScrollRefresh: function(){
            this.movieScroll && this.movieScroll.refresh();

        },

        // Segmented Control
        onSegmentedChange: function(index){
            this.setState({
                currentSegment: index,
                isOnClickMovieDetailMenus: true
            })
        },

        doSomething: function(){
            consols.log(this.x, this.y)
        },

        //返回影片资料信息
        movieCallBack: function(movie){
            var releaseDate = Util.getDateStr(new Date(movie.releaseDate));
            var _days = Util.restrictSwitchToDate(Util.getTodayStr(), releaseDate);
            this.setState({
                movie: movie,
                days: _days
            })
        },

        //显示弹层处理方法
        showDailogCallback: function(){
            this.movieScroll && this.movieScroll.scrollTo(0, -150);
        },

        //显示弹层处理方法滚动条置0
        scrollBarToZeroCallback: function(){
            this.movieScroll && this.movieScroll.scrollTo(0, 0);
        }
    })

    return MovieDetail;
 })


