``/**
 *  CommonTable.jsx
 *  通用列表组件
 *
 *  @props  {Null}      color           显示颜色
 *  @props  {Null}      formatted       数字格式化
 *  @props  {Null}      percent         最后一栏显示百分号
 *  @props  {Null}      showday         显示零点场／上映首日
 *  @props  {Null}      cinemaNum       显示影院数量
 *  @props  {Null}      index           显示次序
 *  @props  {Function}  helper          针对 tr1 的 helper 函数
 *  @return {Component} CommonTable
 */

define([
    'React',
    'util'
], function(
    React,
    Util
) {
    'use strict'

    // Const
    var BARCOLORS = [
        "f8d303","31d197","f76606","0ea9fa","e83295",
        "9badc1","b3c1d1","c6d1dd","d7dfe8","E5E8EA",
        "ecf0f4", "F3F3F3", "F5F5F5", "F7F7F5", "F7F8F8", "F7F8F8"
    ]

    // for lynn's
    localStorage.setItem('language', 'en');
    let localLanguage = localStorage.getItem('language'),
        _languageType = '';
    if(localLanguage){
        _languageType = localLanguage;

    }else{
        _languageType = navigator.language.toLowerCase() == 'zh-cn' ? 'cn' : 'en';

        _languageType = 'en'
    }

    // Component
    var CommonTable = React.createClass({
        render: function(){
            var _announcement = '',
                table_rank = '';

            if(this.props.toast){
                _announcement = <p className="announcement css-1px"><i className="icon-sound"></i>{this.props.toast}</p>;
            }
            if(this.props.movieList){
                var _movieItems = this.props.movieList.map((movie, i) => {

                    // table need Color
                    if(this.props.color){
                        var _barColor={
                            backgroundColor: '#' + BARCOLORS[i]
                        }
                        var _color = <i style={_barColor}/>

                    }else{
                        var _color = "";
                    }

                    // process Table Row 1.
                    var _tr1 = movie[this.props.tr1_field];
                    if(!_tr1 && _languageType == 'en'){
                        _tr1 = 'others'
                    }
                    if(this.props.helper){
                        _tr1 = this.props.helper(_tr1);
                    }
                    // process special showday tag (tr1)
                    if(this.props.showday){
                        if(movie.showDays === 1 && !this.props.isLong){
                            _tr1 = Util.strShort(_tr1, 7);
                        }else{
                            _tr1 = Util.strShort(_tr1, 11);
                        }
                        if(_languageType == 'cn'){
                            if(movie.showDays === 0) var _showday = <em> 零点场</em>
                            else if (movie.showDays === 1) var _showday = <em> 首日</em>
                            else if (movie.showDays < 0) var _showday = <em> 点映</em>
                            else var _showday = ''

                            if(movie.scheduleDate  && this.props.isPresell){

                                var scheduleDate = new Date(movie.scheduleDate);
                                var _days = Util.restrictSwitchToDate1(Util.getTodayStr(), scheduleDate);
                                // alert(movie.scheduleDate.replace('T00:00:00', ' '))
                                if(_days > 0){
                                    _showday = <em style={{'color': '#f76606'}}> 预售</em>
                                }
                            }

                        }else{
                            if(movie.showDays === 0) var _showday = <em> Midnight</em>
                            else if (movie.showDays === 1) var _showday = <em> Premiere</em>
                            else if (movie.showDays < 0) var _showday = <em> Limited release</em>
                            else var _showday = ''

                            if(movie.scheduleDate && this.props.isPresell){
                                var scheduleDate = new Date(movie.scheduleDate);
                                var _days = Util.restrictSwitchToDate1(Util.getTodayStr(), scheduleDate);
                                if(_days > 0){
                                    _showday = <em style={{'color': '#f76606'}}> Presell</em>
                                }
                            }
                        }

                    }

                    if(_tr1 === '其它' || _tr1 === 'others'){
                        _showday = '';
                    }

                    if(_tr1.indexOf(' Cinemas') > 0){
                        _tr1 = _tr1.replace(' Cinemas', '')
                    }else if(_tr1.indexOf(' Cinema') > 0){
                        _tr1 = _tr1.replace(' Cinema', '')
                    }

                    // process cinemaNum tag (tr1)
                    if(this.props.cinemaNum){
                        if(movie.cinemas)
                            var _cinemaNum = <small>（{movie.cinemas}{_languageType == 'cn' ? '家' : ''}）</small>
                        else
                            var _cinemaNum = ''
                    }

                    // process index
                    if(this.props.index){
                        var _index = <span className="cinema-index">{i+1}</span>
                    }else var _index = ''

                    // support both movie and cinema
                    //插入增加项
                    var temp_span = '',
                        release_date = '',
                        all_start = '',
                        span_end = '',
                        _release = _languageType == "cn" ? "上映": " Release";

                    if(this.props.temp_field){
                        var productTickets = _languageType == 'cn' ? parseInt(movie[this.props.temp_field] / 10000) : movie[this.props.temp_field].replace('M', '');
                        temp_span = <span className="middle m-middle" >
                                        {productTickets}
                                    </span>
                        release_date = <p>{movie['releaseDate'].replace('T00:00:00', '')+_release}</p>
                        all_start = 'all-start';
                        table_rank = "table-rank years-rank";

                        _tr1 = <h5>{_tr1}</h5>

                    }

                    if(this.props.name_field == "FirstDayRankName" || this.props.name_field == "DaysRankName"){

                        var _date = movie[this.props.tr3_field].replace('T00:00:00', '');
                            var _week = _languageType == 'cn' ? Util.getDay(_date) : Util.getDayEn(_date);
                            span_end = <span className="end m-middle" >
                                            {_date}
                                            <p>{_week}</p>
                                        </span>
                        if(this.props.name_field == "DaysRankName"){
                            table_rank = "table-rank days-rank";
                            release_date = <p>{movie['releaseDate'].replace('T00:00:00', '')+ _release}</p>
                        }else{
                            table_rank = "table-rank firstday-rank";
                        }

                        _tr1 = <h5>{_tr1}</h5>
                        movie[this.props.tr2_field] = parseInt(movie[this.props.tr2_field]);
                    }else{
                        span_end = <span className="end" >
                            {this.props.formatted
                                ? Util.getFormattedNum(movie[this.props.tr3_field])
                                : movie[this.props.tr3_field]}
                            {this.props.percent
                                ? "%"
                                : ""}
                        </span>
                    }

                    return (
                        <li key={i}
                            className={this.props.onItemClick && "hasTouchState"}
                            onClick={this.handleClick.bind(
                                null,
                                movie[this.props.id_field],
                                _tr1
                            )}
                        >
                            <span className={"start " + all_start} >
                                {_index}
                                {_color}
                                {_tr1}
                                {_showday}
                                {_cinemaNum}
                                {release_date}
                            </span>
                            <span className="middle" >
                                {this.props.formatted
                                    ? Util.getFormattedNum(movie[this.props.tr2_field])
                                    : this.props.temp_field
                                    ? parseInt(movie[this.props.tr2_field]):movie[this.props.tr2_field]}
                            </span>
                            {temp_span}
                            {span_end}
                        </li>
                    )
                })

            }else{
                var _movieItems =  (
                    <li> 加载中... </li>
                )
            }

            //插入增加项
            var temp_nav = '';
            if(this.props.temp_th){
                temp_nav = <span className="middle m-middle">{this.props.temp_th}</span>
            }

            return (
                <div className={"common-table " + table_rank}>
                    {_announcement}
                    <div className="table-header css-1px">
                        <span className="start" >{this.props.th1}</span>
                        <span className="middle">{this.props.th2}</span>
                        {temp_nav}
                        <span className="end">{this.props.th3}</span>
                    </div>
                    <ul className="border-1px">
                        {_movieItems}
                    </ul>
                </div>
            )
        },
        handleClick: function(id, name){
            // block movieName = "其它"
            if((name == '其它' || name == 'others' ) && id == 0){
                return;
            }
            if(this.props.onItemClick){
                this.props.onItemClick(id, name);
            }

        },
        getDefaultProps: function(){
            return {
                tr1_field: "movieName",
                tr2_field: "productBoxOffice",
                tr3_field: "productTotalBoxOffice",
                th1: "影片",
                th2: "票房(万)",
                th3: "上座率",
                id_field: "movieId",
                name_field:"movieName"
            }
        }
    })

    return CommonTable;
 })
