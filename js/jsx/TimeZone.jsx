/**
 *  TimeZone.jsx
 *  选择时区
 *
 */

define([
    'React',
    'Chart',
    'ReactChart',
    'IScroll',
    'Router',
    'util'
], function(
    React,
    Chart,
    ReactChart,
    IScroll,
    Router,
    Util
) {
    'use strict'
    // 时段data
    var timeZoneArr = ['全时段', '黄金时段', '非黄金时段'];
    var style = {
        background: 0,
        border: 0,
        fontSize: "1.22rem"
    }
    // 点击时间段对象
    var navTimeEl;
    var defaultCss = 'nav_time';
    var currentCss = 'nav_time arr-solid-up';
    // 打开状态
    var openStatus = false;
    var TimeZone = React.createClass({

        render: function(){
            var _handleClick = this.handleClick;
            var _date = this.state.date;
            timeZoneArr = window._language.util.timeZone.titles;
            return (
                <div className="nav_time" onClick={_handleClick}>
                    <i className="icon-duration"></i>
                    <span id="nav_time" style={style} className="nav_city  time-bucket">{this.state.item}</span>
                    <span className="arr-down"></span>
                </div>
            )
        },
        getInitialState: function(){
            return {
                item : window._language.util.timeZone.titles[0]
            }
        },

        componentDidMount: function(){
            // this.fetchData();
            // this.setBarColor();
            // this.initIScroll();
        },

        componentDidUpdate: function(){

        },

        handleClick: function(event) {
            navTimeEl = event.currentTarget;
            var dialog = document.getElementById("dialog");
            if(openStatus){
                navTimeEl.className = defaultCss;
                if(dialog){
                    dialog.innerHTML = '';
                }
                openStatus = false;
            }else{
                navTimeEl.className = currentCss;
                openStatus = true;
                if(!dialog){
                    dialog = document.createElement("p");
                    dialog.id = "dialog";
                    dialog.style.height = "100%";
                    var app = document.getElementById("app")
                    app.appendChild(dialog);
                }

                React.render(<TimeZoneDialog
                    isMovieDetail={this.props.isMovieDetail}
                    _top={this.props._top}
                    items={timeZoneArr}
                    klassName={this.props.klassName}
                    handleClick={this.handleLabClick}
                    removeDialog={this.removeDialog} />,
                    dialog);
            }
            
            this.props.showDailogCallback && this.props.showDailogCallback();
        },

        handleLabClick: function(_values){
            var value = _values[0];
            var timeZoneName = _values[1];
            var _value = event.target.value;
            this.setState({item: timeZoneName});
            this.props.timeZoneCallback(_value);
            this.removeDialog();

            Util.setPiaoFangEventGa("选择时段", "selectperiod", timeZoneName, timeZoneName);

            // ga('send', 'event', '选择时段', 'click', timeZoneName, 1);
            // //Hawkeye - Wepiao FE Analytics Solution
            // he && he('send', 'event', 'selectperiod', 'click', timeZoneName, 1);
        },

        removeDialog: function(){
            var dialog = document.getElementById("dialog");
            //var nav_time = document.getElementById("nav_time");
            if(dialog){
                dialog.innerHTML = '';
            }
            if(navTimeEl){
                navTimeEl.className = defaultCss;
            }
            openStatus = false;
            // if(navCityEl){
            //     navCityEl.className = 'nav_city';
            // }
        }
    });

    //
    var timeZoneStyleH = {
        height: "100%"
    }
    var ulStyle = {}, divStyle = {};
    var TimeZoneDialog = React.createClass({
        render: function(){
            var _handleClick = this.props.handleClick;
            var _handleClickDialogBack = this.props.removeDialog;
            var klassName = 'select-bucket ' + this.props.klassName;
            var items = this.props.items,
                len = items.length,
                _timeZoneItems,
                _handleChange = this.handleChange;

            if(this.props.isMovieDetail){
                divStyle ={
                    top: '122px'
                }
                ulStyle = {
                    top: '0px'
                }
            }else{
                divStyle ={
                    
                }
                ulStyle = {
                    top: '79px'
                }
            }

            if(items && len > 0){
                _timeZoneItems = items.map(function(item, i){
                    if(i === 1){
                        return (
                            <li value={i} onClick={_handleClick.bind(null, [i, item])}>
                                {item}
                                <mark> (18:30-22:00)</mark>
                            </li>
                        )
                    }else{
                        return (
                            <li value={i} onClick={_handleClick.bind(null, [i, item])}>{item}</li>
                        )
                    }
                })
            }else{
                return;
            }

            return (
                <div style={timeZoneStyleH}>
                    <div className="dialog_back" onClick={_handleClickDialogBack}></div>
                    <div className="citylist-wrap detailpage-citylist" style={divStyle}>
                        <div className="dialog_back dialog_back2" onClick={_handleClickDialogBack}></div>
                        <div className="subview fixed-box citypicker-wrapper" >
                            <ul className={klassName} style={ulStyle}>{_timeZoneItems} </ul>
                        </div>
                    </div>
                </div>
            )
        }
    });

    return TimeZone;
 })
