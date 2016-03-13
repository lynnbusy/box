//SwitchToDate

/**
 *  SwitchToDate.jsx
 *  切换日期
 *
 */

define([
    'React',
    'Chart',
    'ReactChart',
    'IScroll',
    'Router',
    'util',
    '../mock/city',
    'SelectDate'
], function(
    React,
    Chart,
    ReactChart,
    IScroll,
    Router,
    Util,
    CITY,
    SelectDate
) {
    'use strict'
    // <input type="date" value="2011-01-04">

    var SwitchToDate = React.createClass({
        days: null,
        render: function(){
            let _handleClick = this.handlebarClick,
                language = window._language ?window._language.util.switchToDate : {th1: '前一天', th2: '后一天'},
                next_time = document.getElementsByClassName('_next_time_'),
                style = 'nav_time _next_time_';
            if(this.state.days === this.props.maxDays){
                style = 'nav_time _next_time_ color-h';
            }
            let _maxDate = Util.getIndexDaysStr(Util.getTodayStr(), this.props.maxDays);
            return (
                <div className="nav_list border-1px">
                    <div className="nav_time" onClick={_handleClick.bind(null, 'prev')}><span className="arr-left">{language.th1}</span></div>
                    <SelectDate ref = "SelectDate" selectDateCallback={this.selectDateCallback} date={this.state.date} MAXDate={_maxDate} isAds={this.state.isAds} />
                    <div className={style} onClick={_handleClick.bind(null, 'next')}><span className="arr-right">{language.th2}</span></div>
                </div>
            )
        },
        getInitialState: function(){
            return {
                date : this.props.date || Util.getTodayStr(),
                days : this.props.days,
                isAds: false
            }
        },

        componentDidMount: function(){
            // this.fetchData();
            // this.setBarColor();
            // this.initIScroll();
        },
        componentDidUpdate: function(){

        },
        cityLisDialog: function(){

        },
        handlebarClick: function(eventName){
            var _days = this.state.days;
            var _maxDays = this.props.maxDays || 2;
            if(_days === _maxDays && eventName == 'next'){
                return;
            }
            var next_time = document.getElementsByClassName('_next_time_');
            if(next_time[0]){
                next_time[0].className = 'nav_time _next_time_';
            }
        	var _date;

            if(eventName == 'prev'){
            	_date = Util.prevDay(this.state.date);
                _days--;
                Util.setPiaoFangEventGa("前一天", "prev", _date, _date);
                // ga('send', 'event', 'button', 'click', '前一天' , 1);
                // //Hawkeye - Wepiao FE Analytics Solution
                // he && he('send', 'event', 'button', 'click', 'before', 1);
            }else{
                _days++;
                if(_days === _maxDays){
                    if(next_time[0]){
                        next_time[0].className = 'nav_time _next_time_ color-h';
                    }
                    // _date = Util.nextDay(this.state.date);

                }else if(_days > _maxDays){
                    if(next_time[0]){
                        next_time[0].className = 'nav_time _next_time_ color-h';
                    }
                    return;
                }
                _date = Util.nextDay(this.state.date);
                Util.setPiaoFangEventGa("后一天", "next", _date, _date);
                // ga('send', 'event', 'button', 'click', '后一天' , 1);
                // //Hawkeye - Wepiao FE Analytics Solution
                // he && he('send', 'event', 'button', 'click', 'after', 1);
            }
            this.setState({date: _date, days: _days});
            this.refs.SelectDate.setState({date: _date});

            this.props.selectDateChange(_date);
        },

        selectDateCallback: function(_date){
            var _nowDate = this.state.date.replace(' 00:00:00', '');
            var _selectDate = _date.replace(' 00:00:00', '');
            var _days = Util.restrictSwitchToDate(_nowDate, _selectDate);
        	this.setState({
                date: _date,
                days: _days
            });
        	this.props.selectDateChange(_date);
        }
    });


    return SwitchToDate;
 })
